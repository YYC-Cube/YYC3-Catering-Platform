/**
 * @fileoverview API限流中间件
 * @description 提供基于IP和用户的API请求限流功能
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-09
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { dbManager } from '../config/database';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (request: Request) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  error?: string;
  code?: string;
}

/**
 * 内存存储的限流数据
 */
class MemoryStore {
  private store = new Map<string, { count: number; resetTime: number }>();

  public set(key: string, value: { count: number; resetTime: number }, ttlMs: number): void {
    this.store.set(key, value);

    // 设置过期时间
    setTimeout(() => {
      this.store.delete(key);
    }, ttlMs);
  }

  public get(key: string): { count: number; resetTime: number } | undefined {
    const value = this.store.get(key);

    if (value && Date.now() > value.resetTime) {
      this.store.delete(key);
      return undefined;
    }

    return value;
  }

  public increment(key: string, ttlMs: number): { count: number; resetTime: number } {
    const now = Date.now();
    const resetTime = now + ttlMs;

    const current = this.get(key);
    const newCount = current ? current.count + 1 : 1;

    const newValue = { count: newCount, resetTime };
    this.set(key, newValue, ttlMs);

    return newValue;
  }

  public delete(key: string): void {
    this.store.delete(key);
  }

  public clear(): void {
    this.store.clear();
  }

  public size(): number {
    return this.store.size;
  }
}

/**
 * API限流中间件类
 */
export class RateLimitMiddleware {
  private memoryStore = new MemoryStore();
  private defaultConfig: RateLimitConfig;

  constructor() {
    this.defaultConfig = {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'), // 1分钟
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 100次请求
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
    };
  }

  /**
   * 创建限流中间件
   */
  public create(config: Partial<RateLimitConfig> = {}) {
    const finalConfig = { ...this.defaultConfig, ...config };

    return async (request: Request): Promise<RateLimitResult> => {
      try {
        const key = finalConfig.keyGenerator
          ? finalConfig.keyGenerator(request)
          : this.defaultKeyGenerator(request);

        const record = this.memoryStore.increment(key, finalConfig.windowMs);
        const remaining = Math.max(0, finalConfig.maxRequests - record.count);

        if (record.count > finalConfig.maxRequests) {
          return {
            success: false,
            limit: finalConfig.maxRequests,
            remaining: 0,
            resetTime: record.resetTime,
            error: '请求过于频繁，请稍后再试',
            code: 'TOO_MANY_REQUESTS',
          };
        }

        return {
          success: true,
          limit: finalConfig.maxRequests,
          remaining,
          resetTime: record.resetTime,
        };
      } catch (error) {
        console.error('限流中间件错误:', error);
        // 出错时允许请求通过
        return {
          success: true,
          limit: finalConfig.maxRequests,
          remaining: finalConfig.maxRequests,
          resetTime: Date.now() + finalConfig.windowMs,
        };
      }
    };
  }

  /**
   * 基于IP的限流
   */
  public byIp(windowMs?: number, maxRequests?: number) {
    return this.create({
      windowMs: windowMs || this.defaultConfig.windowMs,
      maxRequests: maxRequests || this.defaultConfig.maxRequests,
      keyGenerator: (request: Request) => `ip:${this.getClientIp(request)}`,
    });
  }

  /**
   * 基于用户的限流
   */
  public byUser(windowMs?: number, maxRequests?: number) {
    return this.create({
      windowMs: windowMs || this.defaultConfig.windowMs,
      maxRequests: maxRequests || this.defaultConfig.maxRequests,
      keyGenerator: (request: Request) => {
        const user = this.getUserFromRequest(request);
        return user ? `user:${user.id}` : `ip:${this.getClientIp(request)}`;
      },
    });
  }

  /**
   * 严格的API限流（用于敏感操作）
   */
  public strict(windowMs = 60000, maxRequests = 10) {
    return this.create({
      windowMs,
      maxRequests,
      keyGenerator: (request: Request) => {
        const user = this.getUserFromRequest(request);
        const path = new URL(request.url).pathname;
        const method = request.method;

        if (user) {
          return `strict:${user.id}:${method}:${path}`;
        } else {
          return `strict:ip:${this.getClientIp(request)}:${method}:${path}`;
        }
      },
    });
  }

  /**
   * 登录限流
   */
  public login() {
    return this.create({
      windowMs: 15 * 60 * 1000, // 15分钟
      maxRequests: 5, // 最多5次尝试
      keyGenerator: (request: Request) => {
        const ip = this.getClientIp(request);
        const url = new URL(request.url);
        const email = url.searchParams.get('email') || 'unknown';
        return `login:${ip}:${email}`;
      },
    });
  }

  /**
   * 注册限流
   */
  public register() {
    return this.create({
      windowMs: 60 * 60 * 1000, // 1小时
      maxRequests: 3, // 最多3次注册
      keyGenerator: (request: Request) => {
        const ip = this.getClientIp(request);
        return `register:${ip}`;
      },
    });
  }

  /**
   * 创建限流响应头
   */
  public createHeaders(result: RateLimitResult): Headers {
    const headers = new Headers();

    headers.set('X-RateLimit-Limit', result.limit.toString());
    headers.set('X-RateLimit-Remaining', result.remaining.toString());
    headers.set('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000).toString());

    if (!result.success) {
      headers.set('Retry-After', Math.ceil((result.resetTime - Date.now()) / 1000).toString());
    }

    return headers;
  }

  /**
   * 创建限流响应
   */
  public createResponse(result: RateLimitResult): Response {
    const headers = this.createHeaders(result);

    if (!result.success) {
      const errorResponse = {
        success: false,
        error: result.error,
        code: result.code,
        limit: result.limit,
        remaining: result.remaining,
        resetTime: new Date(result.resetTime).toISOString(),
        timestamp: new Date().toISOString(),
      };

      headers.set('Content-Type', 'application/json');

      return new Response(JSON.stringify(errorResponse), {
        status: 429,
        headers,
      });
    }

    return new Response(null, { status: 200, headers });
  }

  /**
   * 默认键生成器
   */
  private defaultKeyGenerator(request: Request): string {
    const ip = this.getClientIp(request);
    const user = this.getUserFromRequest(request);

    return user ? `mixed:${user.id}:${ip}` : `ip:${ip}`;
  }

  /**
   * 获取客户端IP
   */
  private getClientIp(request: Request): string {
    // 尝试从各种头获取真实IP
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare

    if (forwardedFor) {
      return forwardedFor.split(',')[0].trim();
    }

    if (realIp) {
      return realIp.trim();
    }

    if (cfConnectingIp) {
      return cfConnectingIp.trim();
    }

    // 如果无法获取真实IP，使用默认值
    return '127.0.0.1';
  }

  /**
   * 从请求中获取用户信息
   */
  private getUserFromRequest(request: Request): any {
    // 这里应该从请求上下文中获取用户信息
    // 在实际实现中，这通常是通过身份验证中间件设置的
    try {
      return (request as any).user || null;
    } catch {
      return null;
    }
  }

  /**
   * 清理过期数据
   */
  public cleanup(): void {
    // MemoryStore会自动清理过期数据
    console.log(`🧹 当前限流记录数: ${this.memoryStore.size()}`);
  }

  /**
   * 获取存储统计信息
   */
  public getStats(): { size: number; memoryUsage: number } {
    return {
      size: this.memoryStore.size(),
      memoryUsage: process.memoryUsage().heapUsed,
    };
  }
}

// 导出单例实例
export const rateLimiter = new RateLimitMiddleware();

// 导出便捷方法
export const createRateLimit = (config?: Partial<RateLimitConfig>) => rateLimiter.create(config);
export const rateLimitByIp = (windowMs?: number, maxRequests?: number) =>
  rateLimiter.byIp(windowMs, maxRequests);
export const rateLimitByUser = (windowMs?: number, maxRequests?: number) =>
  rateLimiter.byUser(windowMs, maxRequests);
export const strictRateLimit = (windowMs?: number, maxRequests?: number) =>
  rateLimiter.strict(windowMs, maxRequests);
export const loginRateLimit = () => rateLimiter.login();
export const registerRateLimit = () => rateLimiter.register();

// 定期清理任务
setInterval(
  () => {
    rateLimiter.cleanup();
  },
  5 * 60 * 1000
); // 每5分钟清理一次
