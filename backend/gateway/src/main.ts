/**
 * @file API网关服务入口
 * @description YYC³餐饮行业智能化平台 - 基于Express.js + TypeScript的现代化API网关
 * @module main
 * @author YYC³
 * @version 1.0.0
 * @created 2024-10-15
 * @updated 2024-10-15
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { config } from './config/app';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { AuthenticatedRequest } from './middleware/tenantMiddleware';
import { authMiddleware } from './middleware/auth';
import { tenantMiddleware } from './middleware/tenantMiddleware';
import { morganMiddleware } from './middleware/morgan';
import { healthCheck } from './routes/health';
import { setupSwagger } from './config/swagger';
import { logger } from './utils/logger';

// 创建Express应用
const app: express.Application = express();

// 基础中间件配置
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }),
);

app.use(
  cors({
    origin: config.cors.origins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID', 'X-Request-ID'],
  }),
);

app.use(
  compression({
    filter: (req: express.Request, res: express.Response) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
    level: 6,
    threshold: 1024,
  }),
);

app.use(
  express.json({
    limit: '10mb',
    verify: (req: express.Request, res: express.Response, buf: Buffer) => {
      try {
        JSON.parse(buf.toString());
      } catch (e) {
        res.status(400).json({
          success: false,
          message: 'Invalid JSON',
          code: 'INVALID_JSON',
        });
        return;
      }
    },
  }),
);

app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 限流中间件
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: config.rateLimit.max, // 限制每个IP的请求数
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: express.Request) => {
    return req.ip + ':' + (req.headers['x-tenant-id'] || 'default');
  },
  skip: (req: express.Request) => {
    // 跳过Dashboard和Kitchen路径的限流
    return req.path.startsWith('/api/v1/dashboard') || req.path.startsWith('/api/v1/kitchen');
  },
});

app.use(limiter);

// 请求日志
app.use(requestLogger);
app.use(morganMiddleware);

// 健康检查路由（无需认证）
app.use('/health', healthCheck);

// 多租户中间件
app.use(tenantMiddleware);

// Dashboard和Kitchen代理中间件（无需认证，移到限流中间件之前）
app.use(
  '/api/v1/dashboard',
  createProxyMiddleware({
    target: config.services.smartKitchen.url,
    changeOrigin: true,
    pathRewrite: {
      '^/api/v1/dashboard': '/api/dashboard',
    },
    onProxyReq: (proxyReq: any, req: AuthenticatedRequest, res: express.Response) => {
      proxyReq.setHeader('X-Tenant-ID', req.headers['x-tenant-id'] || 'default');
      proxyReq.setHeader('X-Request-ID', req.headers['x-request-id'] || '');
      proxyReq.setHeader('X-User-ID', req.user?.id || '');
    },
    onError: (err: Error, req: express.Request, res: express.Response) => {
      logger.error('Dashboard service proxy error', { error: err.message, url: req.url });
      res.status(503).json({
        success: false,
        message: 'Dashboard service unavailable',
        code: 'SERVICE_UNAVAILABLE',
      });
    },
  }),
);

app.use(
  '/api/v1/kitchen',
  createProxyMiddleware({
    target: config.services.smartKitchen.url,
    changeOrigin: true,
    pathRewrite: {
      '^/api/v1/kitchen': '/api/kitchen',
    },
    onProxyReq: (proxyReq: any, req: AuthenticatedRequest, res: express.Response) => {
      proxyReq.setHeader('X-Tenant-ID', req.headers['x-tenant-id'] || 'default');
      proxyReq.setHeader('X-Request-ID', req.headers['x-request-id'] || '');
      proxyReq.setHeader('X-User-ID', req.user?.id || '');
    },
    onError: (err: Error, req: express.Request, res: express.Response) => {
      logger.error('Kitchen service proxy error', { error: err.message, url: req.url });
      res.status(503).json({
        success: false,
        message: 'Kitchen service unavailable',
        code: 'SERVICE_UNAVAILABLE',
      });
    },
  }),
);

// 认证中间件（排除特定路由）
const excludeAuth = ['/health', '/api/v1/auth/login', '/api/v1/auth/register', '/docs'];
app.use('/api', (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
  if (excludeAuth.some(path => req.path.startsWith(path))) {
    return next();
  }
  authMiddleware(req, res, next);
});

// API文档
setupSwagger(app);

// 微服务代理配置
const serviceProxies: Record<string, Options> = {
  '/api/v1/ai-assistant': {
    target: config.services.aiAssistant.url,
    changeOrigin: true,
    pathRewrite: {
      '^/api/v1/ai-assistant': '',
    },
    onProxyReq: (proxyReq: any, req: AuthenticatedRequest, res: express.Response) => {
      proxyReq.setHeader('X-Tenant-ID', req.headers['x-tenant-id'] || 'default');
      proxyReq.setHeader('X-Request-ID', req.headers['x-request-id'] || '');
      proxyReq.setHeader('X-User-ID', req.user?.id || '');
    },
    onError: (err: Error, req: express.Request, res: express.Response) => {
      logger.error('AI Assistant service proxy error', { error: err.message, url: req.url });
      res.status(503).json({
        success: false,
        message: 'AI Assistant service unavailable',
        code: 'SERVICE_UNAVAILABLE',
      });
    },
  },

  '/api/v1/smart-kitchen': {
    target: config.services.smartKitchen.url,
    changeOrigin: true,
    pathRewrite: {
      '^/api/v1/smart-kitchen': '',
    },
    onProxyReq: (proxyReq: any, req: AuthenticatedRequest, res: express.Response) => {
      proxyReq.setHeader('X-Tenant-ID', req.headers['x-tenant-id'] || 'default');
      proxyReq.setHeader('X-Request-ID', req.headers['x-request-id'] || '');
      proxyReq.setHeader('X-User-ID', req.user?.id || '');
    },
    onError: (err: Error, req: express.Request, res: express.Response) => {
      logger.error('Smart Kitchen service proxy error', { error: err.message, url: req.url });
      res.status(503).json({
        success: false,
        message: 'Smart Kitchen service unavailable',
        code: 'SERVICE_UNAVAILABLE',
      });
    },
  },

  '/api/v1/chain-operation': {
    target: config.services.chainOperation.url,
    changeOrigin: true,
    pathRewrite: {
      '^/api/v1/chain-operation': '',
    },
    onProxyReq: (proxyReq: any, req: AuthenticatedRequest, res: express.Response) => {
      proxyReq.setHeader('X-Tenant-ID', req.headers['x-tenant-id'] || 'default');
      proxyReq.setHeader('X-Request-ID', req.headers['x-request-id'] || '');
      proxyReq.setHeader('X-User-ID', req.user?.id || '');
    },
    onError: (err: Error, req: express.Request, res: express.Response) => {
      logger.error('Chain Operation service proxy error', { error: err.message, url: req.url });
      res.status(503).json({
        success: false,
        message: 'Chain Operation service unavailable',
        code: 'SERVICE_UNAVAILABLE',
      });
    },
  },

  '/api/v1/food-safety': {
    target: config.services.foodSafety.url,
    changeOrigin: true,
    pathRewrite: {
      '^/api/v1/food-safety': '',
    },
    onProxyReq: (proxyReq: any, req: AuthenticatedRequest, res: express.Response) => {
      proxyReq.setHeader('X-Tenant-ID', req.headers['x-tenant-id'] || 'default');
      proxyReq.setHeader('X-Request-ID', req.headers['x-request-id'] || '');
      proxyReq.setHeader('X-User-ID', req.user?.id || '');
    },
    onError: (err: Error, req: express.Request, res: express.Response) => {
      logger.error('Food Safety service proxy error', { error: err.message, url: req.url });
      res.status(503).json({
        success: false,
        message: 'Food Safety service unavailable',
        code: 'SERVICE_UNAVAILABLE',
      });
    },
  },

  '/api/v1/o2o-system': {
    target: config.services.o2oSystem.url,
    changeOrigin: true,
    pathRewrite: {
      '^/api/v1/o2o-system': '',
    },
    onProxyReq: (proxyReq: any, req: AuthenticatedRequest, res: express.Response) => {
      proxyReq.setHeader('X-Tenant-ID', req.headers['x-tenant-id'] || 'default');
      proxyReq.setHeader('X-Request-ID', req.headers['x-request-id'] || '');
      proxyReq.setHeader('X-User-ID', req.user?.id || '');
    },
    onError: (err: Error, req: express.Request, res: express.Response) => {
      logger.error('O2O System service proxy error', { error: err.message, url: req.url });
      res.status(503).json({
        success: false,
        message: 'O2O System service unavailable',
        code: 'SERVICE_UNAVAILABLE',
      });
    },
  },
};

// 注册其他代理中间件
const otherProxies: Record<string, Options> = {};
Object.entries(serviceProxies).forEach(([path, options]) => {
  if (path !== '/api/v1/smart-kitchen') {
    otherProxies[path] = options;
  }
});
Object.entries(otherProxies).forEach(([path, options]) => {
  app.use(path, createProxyMiddleware(options));
});

// 根路径
app.get('/', (req: express.Request, res: express.Response) => {
  res.json({
    success: true,
    message: 'YYC³餐饮行业智能化平台 API网关',
    version: config.app.version,
    environment: config.app.environment,
    timestamp: new Date().toISOString(),
    services: Object.keys(config.services),
  });
});

// 404处理
app.use('*', (req: express.Request, res: express.Response) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    code: 'ENDPOINT_NOT_FOUND',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
const server = app.listen(config.app.port, config.app.host, () => {
  logger.info(`🚀 YYC³ API网关服务已启动`, {
    host: config.app.host,
    port: config.app.port,
    environment: config.app.environment,
    version: config.app.version,
    nodeVersion: process.version,
    platform: process.platform,
  });
});

// 优雅关闭
const gracefulShutdown = (signal: string) => {
  logger.info(`收到 ${signal} 信号，开始优雅关闭...`);

  server.close(() => {
    logger.info('HTTP服务器已关闭');
    process.exit(0);
  });

  // 强制关闭超时
  setTimeout(() => {
    logger.error('强制关闭服务器');
    process.exit(1);
  }, 10000);
};

// 监听关闭信号
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// 未捕获异常处理
process.on('uncaughtException', (error: Error) => {
  logger.error('未捕获的异常', { error: error.message, stack: error.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('未处理的Promise拒绝', { reason, promise });
  process.exit(1);
});

export default app;
