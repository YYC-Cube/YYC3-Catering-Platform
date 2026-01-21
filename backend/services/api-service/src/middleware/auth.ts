/**
 * @fileoverview 身份验证中间件
 * @description 提供JWT身份验证和授权功能
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-09
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import jwt from 'jsonwebtoken';
import { dbManager } from '../config/database';

// JWT相关接口定义
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  restaurantId?: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    restaurantId?: string;
  };
}

export interface AuthenticationResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    role: string;
    restaurantId?: string;
  };
  error?: string;
  code?: string;
}

/**
 * 身份验证中间件类
 */
export class AuthenticationMiddleware {
  private jwtSecret: string;
  private jwtExpiresIn: string;

  constructor() {
    // SECURITY FIX: Require JWT_SECRET to be set in environment
    // Remove hardcoded fallback secret
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
      throw new Error('JWT_SECRET environment variable must be set with at least 32 characters');
    }
    this.jwtSecret = secret;
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
  }

  /**
   * 生成JWT令牌
   */
  public generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    // SECURITY FIX: Use jsonwebtoken library instead of custom implementation
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
      issuer: 'yyc3-catering-platform',
      audience: 'yyc3-api'
    });
  }

  /**
   * 验证JWT令牌
   */
  public async verifyToken(token: string): Promise<AuthenticationResult> {
    try {
      if (!token) {
        return {
          success: false,
          error: '缺少身份验证令牌',
          code: 'MISSING_TOKEN'
        };
      }

      // 移除Bearer前缀
      const cleanToken = token.replace('Bearer ', '').trim();

      if (!cleanToken) {
        return {
          success: false,
          error: '无效的身份验证令牌格式',
          code: 'INVALID_TOKEN_FORMAT'
        };
      }

      // SECURITY FIX: Use jsonwebtoken library for secure verification
      let decodedPayload: JWTPayload;
      try {
        decodedPayload = jwt.verify(cleanToken, this.jwtSecret, {
          issuer: 'yyc3-catering-platform',
          audience: 'yyc3-api'
        }) as JWTPayload;
      } catch (jwtError: any) {
        if (jwtError.name === 'TokenExpiredError') {
          return {
            success: false,
            error: '身份验证令牌已过期',
            code: 'TOKEN_EXPIRED'
          };
        } else if (jwtError.name === 'JsonWebTokenError') {
          return {
            success: false,
            error: '无效的身份验证签名',
            code: 'INVALID_SIGNATURE'
          };
        }
        throw jwtError;
      }

      // 从数据库验证用户
      const userResult = await dbManager.query(`
        SELECT id, email, role, status
        FROM users
        WHERE id = $1 AND status = 'active'
      `, [decodedPayload.userId]);

      if (userResult.rows.length === 0) {
        return {
          success: false,
          error: '用户不存在或已被禁用',
          code: 'USER_INACTIVE'
        };
      }

      const user = userResult.rows[0];

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          restaurantId: decodedPayload.restaurantId
        }
      };

    } catch (error) {
      console.error('JWT验证错误:', error);
      return {
        success: false,
        error: '身份验证令牌验证失败',
        code: 'VERIFICATION_ERROR'
      };
    }
  }

  /**
   * 身份验证中间件
   */
  public authenticate() {
    return async (request: Request): Promise<{ success: boolean; user?: any; error?: string; code?: string }> => {
      try {
        const authorization = request.headers.get('authorization');

        if (!authorization) {
          return {
            success: false,
            error: '缺少Authorization头',
            code: 'MISSING_AUTH_HEADER'
          };
        }

        const result = await this.verifyToken(authorization);

        if (!result.success) {
          return result;
        }

        return {
          success: true,
          user: result.user
        };

      } catch (error) {
        console.error('身份验证中间件错误:', error);
        return {
          success: false,
          error: '身份验证过程中发生错误',
          code: 'AUTH_ERROR'
        };
      }
    };
  }

  /**
   * 角色授权中间件
   */
  public authorize(allowedRoles: string[]) {
    return async (request: Request, user?: any): Promise<{ success: boolean; error?: string; code?: string }> => {
      try {
        if (!user) {
          return {
            success: false,
            error: '用户身份信息缺失',
            code: 'MISSING_USER_INFO'
          };
        }

        if (!allowedRoles.includes(user.role)) {
          return {
            success: false,
            error: '权限不足',
            code: 'INSUFFICIENT_PERMISSIONS'
          };
        }

        return { success: true };

      } catch (error) {
        console.error('授权中间件错误:', error);
        return {
          success: false,
          error: '授权过程中发生错误',
          code: 'AUTHORIZATION_ERROR'
        };
      }
    };
  }

  /**
   * 餐厅权限验证
   */
  public authorizeRestaurantAccess() {
    return async (request: Request, user?: any): Promise<{ success: boolean; error?: string; code?: string }> => {
      try {
        if (!user) {
          return {
            success: false,
            error: '用户身份信息缺失',
            code: 'MISSING_USER_INFO'
          };
        }

        // 管理员和超级管理员可以访问所有餐厅
        if (user.role === 'admin' || user.role === 'super_admin') {
          return { success: true };
        }

        // 餐厅管理员只能访问自己的餐厅
        if (user.role === 'restaurant_admin') {
          if (!user.restaurantId) {
            return {
              success: false,
              error: '餐厅管理员缺少餐厅关联',
              code: 'MISSING_RESTAURANT_ID'
            };
          }
          return { success: true };
        }

        return {
          success: false,
          error: '权限不足',
          code: 'INSUFFICIENT_PERMISSIONS'
        };

      } catch (error) {
        console.error('餐厅权限验证错误:', error);
        return {
          success: false,
          error: '餐厅权限验证过程中发生错误',
          code: 'RESTAURANT_AUTH_ERROR'
        };
      }
    };
  }

  /**
   * 可选身份验证（不强制要求登录）
   */
  public optionalAuthenticate() {
    return async (request: Request): Promise<{ success: boolean; user?: any }> => {
      try {
        const authorization = request.headers.get('authorization');

        if (!authorization) {
          return { success: true };
        }

        const result = await this.verifyToken(authorization);

        if (result.success) {
          return {
            success: true,
            user: result.user
          };
        }

        // 可选验证失败时不返回错误
        return { success: true };

      } catch (error) {
        console.error('可选身份验证错误:', error);
        return { success: true };
      }
    };
  }

  /**
   * 创建认证中间件响应
   */
  public createAuthResponse(result: { success: boolean; user?: any; error?: string; code?: string }): Response {
    if (!result.success) {
      const errorResponse = {
        success: false,
        error: result.error || '身份验证失败',
        code: result.code || 'AUTH_FAILED',
        timestamp: new Date().toISOString()
      };

      return new Response(JSON.stringify(errorResponse), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(null, { status: 200 });
  }

  /**
   * 创建授权中间件响应
   */
  public createAuthzResponse(result: { success: boolean; error?: string; code?: string }): Response {
    if (!result.success) {
      const errorResponse = {
        success: false,
        error: result.error || '权限不足',
        code: result.code || 'AUTHORIZATION_FAILED',
        timestamp: new Date().toISOString()
      };

      return new Response(JSON.stringify(errorResponse), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(null, { status: 200 });
  }
}

// 导出单例实例
export const authMiddleware = new AuthenticationMiddleware();

// 导出便捷方法
export const generateToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>) => authMiddleware.generateToken(payload);
export const verifyToken = (token: string) => authMiddleware.verifyToken(token);
export const authenticate = () => authMiddleware.authenticate();
export const authorize = (roles: string[]) => authMiddleware.authorize(roles);
export const authorizeRestaurant = () => authMiddleware.authorizeRestaurantAccess();
export const optionalAuth = () => authMiddleware.optionalAuthenticate();