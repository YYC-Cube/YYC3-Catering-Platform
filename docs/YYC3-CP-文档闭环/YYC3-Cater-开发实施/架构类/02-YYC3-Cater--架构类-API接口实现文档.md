---

**@file**：YYC³-API接口实现文档
**@description**：YYC³餐饮行业智能化平台的API接口实现文档
**@author**：YYC³
**@version**：v1.0.0
**@created**：2025-01-30
**@updated**：2025-01-30
**@status**：published
**@tags**：架构设计,API,YYC³,接口设计

---

# API接口实现文档

> **_YanYuCloudCube_**
> **标语**：言启象限 | 语枢未来
> **_Words Initiate Quadrants, Language Serves as Core for the Future_**
> **标语**：万象归元于云枢 | 深栈智启新纪元
> **_All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence_**

## 文档信息

- 文档类型：架构类
- 所属阶段：YYC3-Cater--开发实施
- 遵循规范：五高五标五化要求
- 版本号：V1.0
- 创建时间：2025-01-30
- 更新时间：2025-01-30

## 目录

1. [API接口概述](#1-api接口概述)
2. [RESTful API设计](#2-restful-api设计)
3. [GraphQL API设计](#3-graphql-api设计)
4. [API网关实现](#4-api网关实现)
5. [认证与授权](#5-认证与授权)
6. [请求验证](#6-请求验证)
7. [错误处理](#7-错误处理)
8. [API文档生成](#8-api文档生成)
9. [API性能优化](#9-api性能优化)
10. [API测试](#10-api测试)

---

## 1. API接口概述

### 1.1 API设计原则

```typescript
/**
 * @file API接口核心定义
 * @description 定义API接口的核心原则和设计理念
 * @module api-interface
 * @author YYC³
 * @version 1.0.0
 */

/**
 * API设计原则
 */
export enum APIDesignPrinciple {
  // RESTful原则
  RESOURCE_ORIENTED = "RESOURCE_ORIENTED", // 面向资源
  STATELESS = "STATELESS", // 无状态
  UNIFORM_INTERFACE = "UNIFORM_INTERFACE", // 统一接口
  CACHEABLE = "CACHEABLE", // 可缓存
  LAYERED_SYSTEM = "LAYERED_SYSTEM", // 分层系统

  // 通用原则
  CONSISTENT_NAMING = "CONSISTENT_NAMING", // 命名一致
  VERSIONING = "VERSIONING", // 版本控制
  PAGINATION = "PAGINATION", // 分页支持
  FILTERING = "FILTERING", // 过滤支持
  SORTING = "SORTING", // 排序支持

  // 安全原则
  AUTHENTICATION = "AUTHENTICATION", // 认证
  AUTHORIZATION = "AUTHORIZATION", // 授权
  RATE_LIMITING = "RATE_LIMITING", // 限流
  INPUT_VALIDATION = "INPUT_VALIDATION", // 输入验证
}

/**
 * API设计原则描述
 */
export const apiDesignPrinciples: Record<APIDesignPrinciple, string> = {
  [APIDesignPrinciple.RESOURCE_ORIENTED]: "API应该围绕资源设计，使用名词而非动词",
  [APIDesignPrinciple.STATELESS]: "每个请求应该包含所有必要信息，服务器不保存客户端状态",
  [APIDesignPrinciple.UNIFORM_INTERFACE]: "使用统一的接口设计，提高可预测性",
  [APIDesignPrinciple.CACHEABLE]: "响应应该明确标识是否可缓存",
  [APIDesignPrinciple.LAYERED_SYSTEM]: "系统应该分层，客户端不需要知道是否连接到终端服务器",
  [APIDesignPrinciple.CONSISTENT_NAMING]: "使用一致的命名约定，包括资源名称、字段名称等",
  [APIDesignPrinciple.VERSIONING]: "API应该支持版本控制，避免破坏性变更",
  [APIDesignPrinciple.PAGINATION]: "列表接口应该支持分页，避免返回过多数据",
  [APIDesignPrinciple.FILTERING]: "列表接口应该支持过滤，提高数据检索效率",
  [APIDesignPrinciple.SORTING]: "列表接口应该支持排序，提供灵活的数据展示",
  [APIDesignPrinciple.AUTHENTICATION]: "API应该实现认证机制，验证客户端身份",
  [APIDesignPrinciple.AUTHORIZATION]: "API应该实现授权机制，控制资源访问权限",
  [APIDesignPrinciple.RATE_LIMITING]: "API应该实现限流机制，防止滥用",
  [APIDesignPrinciple.INPUT_VALIDATION]: "API应该验证所有输入，防止无效或恶意数据",
};

/**
 * HTTP方法映射
 */
export const httpMethodMapping = {
  GET: "获取资源",
  POST: "创建资源",
  PUT: "更新整个资源",
  PATCH: "部分更新资源",
  DELETE: "删除资源",
  HEAD: "获取资源头信息",
  OPTIONS: "获取支持的HTTP方法",
};

/**
 * HTTP状态码
 */
export const httpStatusCodes = {
  // 2xx 成功
  200: "OK - 请求成功",
  201: "Created - 资源创建成功",
  202: "Accepted - 请求已接受，正在处理",
  204: "No Content - 请求成功，无返回内容",

  // 3xx 重定向
  301: "Moved Permanently - 资源已永久移动",
  302: "Found - 资源临时移动",
  304: "Not Modified - 资源未修改",

  // 4xx 客户端错误
  400: "Bad Request - 请求格式错误",
  401: "Unauthorized - 未授权",
  403: "Forbidden - 禁止访问",
  404: "Not Found - 资源不存在",
  409: "Conflict - 资源冲突",
  422: "Unprocessable Entity - 请求格式正确但语义错误",
  429: "Too Many Requests - 请求过于频繁",

  // 5xx 服务器错误
  500: "Internal Server Error - 服务器内部错误",
  502: "Bad Gateway - 网关错误",
  503: "Service Unavailable - 服务不可用",
  504: "Gateway Timeout - 网关超时",
};
```

### 1.2 API版本控制

```typescript
/**
 * API版本控制策略
 */
export enum APIVersionStrategy {
  URL_PATH = "URL_PATH", // URL路径版本控制
  HEADER = "HEADER", // 请求头版本控制
  QUERY_PARAM = "QUERY_PARAM", // 查询参数版本控制
  CONTENT_NEGOTIATION = "CONTENT_NEGOTIATION", // 内容协商
}

/**
 * API版本管理器
 */
export class APIVersionManager {
  private currentVersion: string = "v1";
  private supportedVersions: string[] = ["v1", "v2"];

  /**
   * 设置当前版本
   */
  setCurrentVersion(version: string): void {
    if (!this.supportedVersions.includes(version)) {
      throw new Error(`Unsupported version: ${version}`);
    }
    this.currentVersion = version;
  }

  /**
   * 获取当前版本
   */
  getCurrentVersion(): string {
    return this.currentVersion;
  }

  /**
   * 检查版本是否支持
   */
  isVersionSupported(version: string): boolean {
    return this.supportedVersions.includes(version);
  }

  /**
   * 添加支持的版本
   */
  addSupportedVersion(version: string): void {
    if (!this.supportedVersions.includes(version)) {
      this.supportedVersions.push(version);
    }
  }

  /**
   * 移除支持的版本
   */
  removeSupportedVersion(version: string): void {
    const index = this.supportedVersions.indexOf(version);
    if (index > -1) {
      this.supportedVersions.splice(index, 1);
    }
  }

  /**
   * 解析版本
   */
  parseVersion(version: string): string {
    // 移除v前缀
    return version.replace(/^v/i, "");
  }

  /**
   * 比较版本
   */
  compareVersions(v1: string, v2: string): number {
    const v1Parts = this.parseVersion(v1).split(".").map(Number);
    const v2Parts = this.parseVersion(v2).split(".").map(Number);

    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1Part = v1Parts[i] || 0;
      const v2Part = v2Parts[i] || 0;

      if (v1Part > v2Part) return 1;
      if (v1Part < v2Part) return -1;
    }

    return 0;
  }
}
```

---

## 2. RESTful API设计

### 2.1 资源设计

```typescript
/**
 * @file RESTful API设计
 * @description 实现RESTful API的设计和实现
 * @module restful-api
 * @author YYC³
 * @version 1.0.0
 */

/**
 * 资源定义
 */
export interface Resource {
  name: string;
  singular: string;
  plural: string;
  endpoints: Endpoint[];
}

/**
 * 端点定义
 */
export interface Endpoint {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  description: string;
  authentication: boolean;
  authorization: string[];
  parameters: Parameter[];
  responses: Response[];
}

/**
 * 参数定义
 */
export interface Parameter {
  name: string;
  type: string;
  location: "path" | "query" | "body" | "header";
  required: boolean;
  description: string;
}

/**
 * 响应定义
 */
export interface Response {
  statusCode: number;
  description: string;
  schema: any;
}

/**
 * RESTful资源生成器
 */
export class RESTfulResourceGenerator {
  /**
   * 生成标准资源端点
   */
  generateStandardEndpoints(resourceName: string): Endpoint[] {
    const singular = this.toSingular(resourceName);
    const plural = this.toPlural(resourceName);

    return [
      {
        method: "GET",
        path: `/${plural}`,
        description: `获取${resourceName}列表`,
        authentication: true,
        authorization: ["read"],
        parameters: [
          {
            name: "page",
            type: "number",
            location: "query",
            required: false,
            description: "页码",
          },
          {
            name: "limit",
            type: "number",
            location: "query",
            required: false,
            description: "每页数量",
          },
        ],
        responses: [
          {
            statusCode: 200,
            description: "成功",
            schema: {
              data: [],
              total: 0,
              page: 1,
              limit: 10,
            },
          },
        ],
      },
      {
        method: "GET",
        path: `/${plural}/:id`,
        description: `获取${resourceName}详情`,
        authentication: true,
        authorization: ["read"],
        parameters: [
          {
            name: "id",
            type: "string",
            location: "path",
            required: true,
            description: "资源ID",
          },
        ],
        responses: [
          {
            statusCode: 200,
            description: "成功",
            schema: {},
          },
          {
            statusCode: 404,
            description: "资源不存在",
            schema: {
              error: "Resource not found",
            },
          },
        ],
      },
      {
        method: "POST",
        path: `/${plural}`,
        description: `创建${resourceName}`,
        authentication: true,
        authorization: ["create"],
        parameters: [
          {
            name: "body",
            type: "object",
            location: "body",
            required: true,
            description: "资源数据",
          },
        ],
        responses: [
          {
            statusCode: 201,
            description: "创建成功",
            schema: {},
          },
          {
            statusCode: 400,
            description: "请求格式错误",
            schema: {
              error: "Invalid request",
            },
          },
        ],
      },
      {
        method: "PUT",
        path: `/${plural}/:id`,
        description: `更新${resourceName}`,
        authentication: true,
        authorization: ["update"],
        parameters: [
          {
            name: "id",
            type: "string",
            location: "path",
            required: true,
            description: "资源ID",
          },
          {
            name: "body",
            type: "object",
            location: "body",
            required: true,
            description: "资源数据",
          },
        ],
        responses: [
          {
            statusCode: 200,
            description: "更新成功",
            schema: {},
          },
          {
            statusCode: 404,
            description: "资源不存在",
            schema: {
              error: "Resource not found",
            },
          },
        ],
      },
      {
        method: "DELETE",
        path: `/${plural}/:id`,
        description: `删除${resourceName}`,
        authentication: true,
        authorization: ["delete"],
        parameters: [
          {
            name: "id",
            type: "string",
            location: "path",
            required: true,
            description: "资源ID",
          },
        ],
        responses: [
          {
            statusCode: 204,
            description: "删除成功",
            schema: null,
          },
          {
            statusCode: 404,
            description: "资源不存在",
            schema: {
              error: "Resource not found",
            },
          },
        ],
      },
    ];
  }

  /**
   * 转换为单数形式
   */
  private toSingular(word: string): string {
    // 简单实现，实际应该使用更复杂的规则
    if (word.endsWith("ies")) {
      return word.slice(0, -3) + "y";
    }
    if (word.endsWith("es")) {
      return word.slice(0, -2);
    }
    if (word.endsWith("s")) {
      return word.slice(0, -1);
    }
    return word;
  }

  /**
   * 转换为复数形式
   */
  private toPlural(word: string): string {
    // 简单实现，实际应该使用更复杂的规则
    if (word.endsWith("y")) {
      return word.slice(0, -1) + "ies";
    }
    if (word.endsWith("s") || word.endsWith("x") || word.endsWith("z") || word.endsWith("ch") || word.endsWith("sh")) {
      return word + "es";
    }
    return word + "s";
  }
}
```

### 2.2 控制器实现

```typescript
/**
 * RESTful控制器基类
 */
export abstract class RESTfulController<T> {
  /**
   * 获取列表
   */
  async getList(req: any, res: any): Promise<void> {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await this.service.findAll({
        page: Number(page),
        limit: Number(limit),
      });

      res.json({
        success: true,
        data: result.data,
        total: result.total,
        page: Number(page),
        limit: Number(limit),
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * 获取详情
   */
  async getDetail(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.service.findById(id);

      if (!result) {
        res.status(404).json({
          success: false,
          error: "Resource not found",
        });
        return;
      }

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * 创建资源
   */
  async create(req: any, res: any): Promise<void> {
    try {
      const result = await this.service.create(req.body);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * 更新资源
   */
  async update(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.service.update(id, req.body);

      if (!result) {
        res.status(404).json({
          success: false,
          error: "Resource not found",
        });
        return;
      }

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * 删除资源
   */
  async delete(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      await this.service.delete(id);

      res.status(204).send();
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * 错误处理
   */
  private handleError(error: any, res: any): void {
    console.error("API Error:", error);

    if (error.statusCode) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  /**
   * 抽象服务
   */
  protected abstract service: any;
}
```

---

## 3. GraphQL API设计

### 3.1 Schema定义

```typescript
/**
 * @file GraphQL API设计
 * @description 实现GraphQL API的设计和实现
 * @module graphql-api
 * @author YYC³
 * @version 1.0.0
 */

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
} from "graphql";

/**
 * GraphQL类型定义
 */
export const userType = new GraphQLObjectType({
  name: "User",
  description: "用户类型",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString), description: "用户ID" },
    name: { type: GraphQLNonNull(GraphQLString), description: "用户名" },
    email: { type: GraphQLNonNull(GraphQLString), description: "邮箱" },
    createdAt: { type: GraphQLString, description: "创建时间" },
    updatedAt: { type: GraphQLString, description: "更新时间" },
  }),
});

/**
 * 查询类型
 */
export const queryType = new GraphQLObjectType({
  name: "Query",
  description: "根查询类型",
  fields: () => ({
    user: {
      type: userType,
      description: "获取用户信息",
      args: {
        id: { type: GraphQLNonNull(GraphQLString), description: "用户ID" },
      },
      resolve: async (_: any, { id }: any, context: any) => {
        return context.userLoader.load(id);
      },
    },
    users: {
      type: GraphQLList(userType),
      description: "获取用户列表",
      args: {
        page: { type: GraphQLInt, description: "页码" },
        limit: { type: GraphQLInt, description: "每页数量" },
      },
      resolve: async (_: any, { page = 1, limit = 10 }: any, context: any) => {
        return context.userService.findAll({ page, limit });
      },
    },
  }),
});

/**
 * 变更类型
 */
export const mutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "根变更类型",
  fields: () => ({
    createUser: {
      type: userType,
      description: "创建用户",
      args: {
        name: { type: GraphQLNonNull(GraphQLString), description: "用户名" },
        email: { type: GraphQLNonNull(GraphQLString), description: "邮箱" },
        password: { type: GraphQLNonNull(GraphQLString), description: "密码" },
      },
      resolve: async (_: any, args: any, context: any) => {
        return context.userService.create(args);
      },
    },
    updateUser: {
      type: userType,
      description: "更新用户",
      args: {
        id: { type: GraphQLNonNull(GraphQLString), description: "用户ID" },
        name: { type: GraphQLString, description: "用户名" },
        email: { type: GraphQLString, description: "邮箱" },
      },
      resolve: async (_: any, { id, ...data }: any, context: any) => {
        return context.userService.update(id, data);
      },
    },
    deleteUser: {
      type: GraphQLBoolean,
      description: "删除用户",
      args: {
        id: { type: GraphQLNonNull(GraphQLString), description: "用户ID" },
      },
      resolve: async (_: any, { id }: any, context: any) => {
        await context.userService.delete(id);
        return true;
      },
    },
  }),
});

/**
 * GraphQL Schema
 */
export const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});
```

### 3.2 解析器实现

```typescript
/**
 * GraphQL解析器
 */
export class GraphQLResolver {
  /**
   * 数据加载器
   */
  private userLoader: any;

  constructor(private userService: any) {
    this.userLoader = this.createUserLoader();
  }

  /**
   * 创建用户数据加载器
   */
  private createUserLoader() {
    // 使用dataloader实现批量加载和缓存
    return {
      load: async (id: string) => {
        return this.userService.findById(id);
      },
      loadMany: async (ids: string[]) => {
        return this.userService.findByIds(ids);
      },
    };
  }

  /**
   * 执行查询
   */
  async executeQuery(query: string, variables?: any): Promise<any> {
    const { graphql } = await import("graphql");

    return graphql({
      schema,
      source: query,
      variableValues: variables,
      contextValue: {
        userService: this.userService,
        userLoader: this.userLoader,
      },
    });
  }

  /**
   * 执行变更
   */
  async executeMutation(mutation: string, variables?: any): Promise<any> {
    return this.executeQuery(mutation, variables);
  }
}
```

---

## 4. API网关实现

### 4.1 网关配置

```typescript
/**
 * @file API网关实现
 * @description 实现API网关的路由、负载均衡等功能
 * @module api-gateway
 * @author YYC³
 * @version 1.0.0
 */

/**
 * 路由配置
 */
export interface RouteConfig {
  path: string;
  method: string;
  target: string;
  timeout?: number;
  retry?: number;
  rateLimit?: {
    windowMs: number;
    max: number;
  };
  cache?: {
    ttl: number;
  };
}

/**
 * 服务配置
 */
export interface ServiceConfig {
  name: string;
  instances: string[];
  healthCheck?: {
    path: string;
    interval: number;
  };
  loadBalance?: "round-robin" | "least-connections" | "ip-hash";
}

/**
 * API网关
 */
export class APIGateway {
  private routes: Map<string, RouteConfig[]> = new Map();
  private services: Map<string, ServiceConfig> = new Map();
  private rateLimiters: Map<string, any> = new Map();
  private caches: Map<string, any> = new Map();

  /**
   * 注册路由
   */
  registerRoute(config: RouteConfig): void {
    const key = `${config.method}:${config.path}`;

    if (!this.routes.has(key)) {
      this.routes.set(key, []);
    }

    this.routes.get(key)!.push(config);
  }

  /**
   * 注册服务
   */
  registerService(config: ServiceConfig): void {
    this.services.set(config.name, config);
  }

  /**
   * 路由请求
   */
  async routeRequest(req: any, res: any): Promise<void> {
    const key = `${req.method}:${req.path}`;
    const routes = this.routes.get(key);

    if (!routes || routes.length === 0) {
      res.status(404).json({ error: "Route not found" });
      return;
    }

    const route = routes[0]; // 简化处理，实际应该支持多个路由

    // 限流检查
    if (route.rateLimit && !this.checkRateLimit(req, route.rateLimit)) {
      res.status(429).json({ error: "Too many requests" });
      return;
    }

    // 缓存检查
    if (route.cache) {
      const cached = this.getFromCache(req, route.cache.ttl);
      if (cached) {
        res.json(cached);
        return;
      }
    }

    // 转发请求
    const response = await this.forwardRequest(req, route);

    // 缓存响应
    if (route.cache && response.statusCode === 200) {
      this.setCache(req, response.data, route.cache.ttl);
    }

    res.status(response.statusCode).json(response.data);
  }

  /**
   * 检查限流
   */
  private checkRateLimit(req: any, config: { windowMs: number; max: number }): boolean {
    const key = this.getClientKey(req);
    const limiter = this.rateLimiters.get(key);

    if (!limiter) {
      this.rateLimiters.set(key, {
        count: 1,
        resetTime: Date.now() + config.windowMs,
      });
      return true;
    }

    if (Date.now() > limiter.resetTime) {
      limiter.count = 1;
      limiter.resetTime = Date.now() + config.windowMs;
      return true;
    }

    if (limiter.count >= config.max) {
      return false;
    }

    limiter.count++;
    return true;
  }

  /**
   * 获取客户端标识
   */
  private getClientKey(req: any): string {
    return req.ip || req.headers["x-forwarded-for"] || "unknown";
  }

  /**
   * 从缓存获取
   */
  private getFromCache(req: any, ttl: number): any {
    const key = this.getCacheKey(req);
    const cached = this.caches.get(key);

    if (!cached) {
      return null;
    }

    if (Date.now() > cached.expiry) {
      this.caches.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * 设置缓存
   */
  private setCache(req: any, data: any, ttl: number): void {
    const key = this.getCacheKey(req);
    this.caches.set(key, {
      data,
      expiry: Date.now() + ttl,
    });
  }

  /**
   * 获取缓存键
   */
  private getCacheKey(req: any): string {
    return `${req.method}:${req.path}:${JSON.stringify(req.query)}`;
  }

  /**
   * 转发请求
   */
  private async forwardRequest(req: any, route: RouteConfig): Promise<any> {
    // 实现请求转发逻辑
    return {
      statusCode: 200,
      data: {},
    };
  }
}
```

### 4.2 负载均衡

```typescript
/**
 * 负载均衡器
 */
export class LoadBalancer {
  private currentIndex = 0;
  private connections: Map<string, number> = new Map();

  /**
   * 轮询算法
   */
  roundRobin(instances: string[]): string {
    const instance = instances[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % instances.length;
    return instance;
  }

  /**
   * 最少连接算法
   */
  leastConnections(instances: string[]): string {
    let minConnections = Infinity;
    let selectedInstance = instances[0];

    for (const instance of instances) {
      const connections = this.connections.get(instance) || 0;
      if (connections < minConnections) {
        minConnections = connections;
        selectedInstance = instance;
      }
    }

    return selectedInstance;
  }

  /**
   * IP哈希算法
   */
  ipHash(instances: string[], ip: string): string {
    const hash = this.hash(ip);
    const index = hash % instances.length;
    return instances[index];
  }

  /**
   * 哈希函数
   */
  private hash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  /**
   * 增加连接数
   */
  incrementConnections(instance: string): void {
    const connections = this.connections.get(instance) || 0;
    this.connections.set(instance, connections + 1);
  }

  /**
   * 减少连接数
   */
  decrementConnections(instance: string): void {
    const connections = this.connections.get(instance) || 0;
    this.connections.set(instance, Math.max(0, connections - 1));
  }
}
```

---

## 5. 认证与授权

### 5.1 JWT认证

```typescript
/**
 * @file 认证与授权
 * @description 实现API的认证和授权机制
 * @module authentication-authorization
 * @author YYC³
 * @version 1.0.0
 */

import jwt from "jsonwebtoken";

/**
 * JWT配置
 */
export interface JWTConfig {
  secret: string;
  expiresIn: string;
  issuer?: string;
  audience?: string;
}

/**
 * JWT认证器
 */
export class JWTAuthenticator {
  constructor(private config: JWTConfig) {}

  /**
   * 生成令牌
   */
  generateToken(payload: any): string {
    return jwt.sign(payload, this.config.secret, {
      expiresIn: this.config.expiresIn,
      issuer: this.config.issuer,
      audience: this.config.audience,
    });
  }

  /**
   * 验证令牌
   */
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.config.secret, {
        issuer: this.config.issuer,
        audience: this.config.audience,
      });
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  /**
   * 解码令牌
   */
  decodeToken(token: string): any {
    return jwt.decode(token);
  }

  /**
   * 刷新令牌
   */
  refreshToken(token: string): string {
    const decoded = this.verifyToken(token);
    const { iat, exp, ...payload } = decoded;
    return this.generateToken(payload);
  }
}
```

### 5.2 RBAC授权

```typescript
/**
 * 角色定义
 */
export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  GUEST = "GUEST",
}

/**
 * 权限定义
 */
export enum Permission {
  READ = "read",
  WRITE = "write",
  DELETE = "delete",
  ADMIN = "admin",
}

/**
 * 角色权限映射
 */
export const rolePermissions: Record<Role, Permission[]> = {
  [Role.ADMIN]: [Permission.READ, Permission.WRITE, Permission.DELETE, Permission.ADMIN],
  [Role.USER]: [Permission.READ, Permission.WRITE],
  [Role.GUEST]: [Permission.READ],
};

/**
 * RBAC授权器
 */
export class RBACAuthorizer {
  /**
   * 检查权限
   */
  hasPermission(role: Role, permission: Permission): boolean {
    const permissions = rolePermissions[role] || [];
    return permissions.includes(permission);
  }

  /**
   * 检查多个权限
   */
  hasAllPermissions(role: Role, permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(role, permission));
  }

  /**
   * 检查任意权限
   */
  hasAnyPermission(role: Role, permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(role, permission));
  }

  /**
   * 添加角色权限
   */
  addPermission(role: Role, permission: Permission): void {
    if (!rolePermissions[role]) {
      rolePermissions[role] = [];
    }
    rolePermissions[role].push(permission);
  }

  /**
   * 移除角色权限
   */
  removePermission(role: Role, permission: Permission): void {
    if (rolePermissions[role]) {
      const index = rolePermissions[role].indexOf(permission);
      if (index > -1) {
        rolePermissions[role].splice(index, 1);
      }
    }
  }
}
```

---

## 6. 请求验证

### 6.1 数据验证

```typescript
/**
 * @file 请求验证
 * @description 实现API请求的验证机制
 * @module request-validation
 * @author YYC³
 * @version 1.0.0
 */

import { z } from "zod";

/**
 * 验证规则
 */
export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: string;
  min?: number;
  max?: number;
  pattern?: RegExp;
  enum?: any[];
  custom?: (value: any) => boolean | string;
}

/**
 * 验证器
 */
export class Validator {
  /**
   * 验证数据
   */
  validate(
    data: any,
    rules: ValidationRule[]
  ): {
    valid: boolean;
    errors: Record<string, string>;
  } {
    const errors: Record<string, string> = {};

    for (const rule of rules) {
      const value = data[rule.field];

      // 检查必填
      if (rule.required && (value === undefined || value === null || value === "")) {
        errors[rule.field] = `${rule.field} is required`;
        continue;
      }

      // 如果值为空且非必填，跳过其他验证
      if (!rule.required && (value === undefined || value === null || value === "")) {
        continue;
      }

      // 类型验证
      if (rule.type && !this.checkType(value, rule.type)) {
        errors[rule.field] = `${rule.field} must be ${rule.type}`;
        continue;
      }

      // 最小值验证
      if (rule.min !== undefined && value < rule.min) {
        errors[rule.field] = `${rule.field} must be at least ${rule.min}`;
        continue;
      }

      // 最大值验证
      if (rule.max !== undefined && value > rule.max) {
        errors[rule.field] = `${rule.field} must be at most ${rule.max}`;
        continue;
      }

      // 正则验证
      if (rule.pattern && !rule.pattern.test(value)) {
        errors[rule.field] = `${rule.field} format is invalid`;
        continue;
      }

      // 枚举验证
      if (rule.enum && !rule.enum.includes(value)) {
        errors[rule.field] = `${rule.field} must be one of ${rule.enum.join(", ")}`;
        continue;
      }

      // 自定义验证
      if (rule.custom) {
        const result = rule.custom(value);
        if (result !== true) {
          errors[rule.field] = typeof result === "string" ? result : `${rule.field} is invalid`;
          continue;
        }
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * 检查类型
   */
  private checkType(value: any, type: string): boolean {
    switch (type) {
      case "string":
        return typeof value === "string";
      case "number":
        return typeof value === "number" && !isNaN(value);
      case "boolean":
        return typeof value === "boolean";
      case "array":
        return Array.isArray(value);
      case "object":
        return typeof value === "object" && value !== null && !Array.isArray(value);
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case "url":
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      default:
        return true;
    }
  }
}

/**
 * Zod验证器
 */
export class ZodValidator {
  /**
   * 创建验证Schema
   */
  static createSchema<T>(schema: z.ZodSchema<T>): z.ZodSchema<T> {
    return schema;
  }

  /**
   * 验证数据
   */
  static validate<T>(
    schema: z.ZodSchema<T>,
    data: any
  ): {
    success: boolean;
    data?: T;
    errors?: z.ZodError;
  } {
    const result = schema.safeParse(data);

    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    }

    return {
      success: false,
      errors: result.error,
    };
  }
}
```

---

## 7. 错误处理

### 7.1 错误定义

```typescript
/**
 * @file 错误处理
 * @description 实现API的错误处理机制
 * @module error-handling
 * @author YYC³
 * @version 1.0.0
 */

/**
 * API错误基类
 */
export class APIError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = "APIError";
  }
}

/**
 * 错误类型
 */
export class BadRequestError extends APIError {
  constructor(message: string = "Bad Request", details?: any) {
    super(400, "BAD_REQUEST", message, details);
  }
}

export class UnauthorizedError extends APIError {
  constructor(message: string = "Unauthorized", details?: any) {
    super(401, "UNAUTHORIZED", message, details);
  }
}

export class ForbiddenError extends APIError {
  constructor(message: string = "Forbidden", details?: any) {
    super(403, "FORBIDDEN", message, details);
  }
}

export class NotFoundError extends APIError {
  constructor(message: string = "Not Found", details?: any) {
    super(404, "NOT_FOUND", message, details);
  }
}

export class ConflictError extends APIError {
  constructor(message: string = "Conflict", details?: any) {
    super(409, "CONFLICT", message, details);
  }
}

export class ValidationError extends APIError {
  constructor(message: string = "Validation Error", details?: any) {
    super(422, "VALIDATION_ERROR", message, details);
  }
}

export class InternalServerError extends APIError {
  constructor(message: string = "Internal Server Error", details?: any) {
    super(500, "INTERNAL_SERVER_ERROR", message, details);
  }
}
```

### 7.2 错误处理器

```typescript
/**
 * 错误处理器
 */
export class ErrorHandler {
  /**
   * 处理错误
   */
  static handle(error: Error, req: any, res: any): void {
    console.error("Error:", error);

    if (error instanceof APIError) {
      res.status(error.statusCode).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // 处理其他错误
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 异步错误包装器
   */
  static asyncHandler(fn: Function) {
    return async (req: any, res: any, next: any) => {
      try {
        await fn(req, res, next);
      } catch (error) {
        next(error);
      }
    };
  }
}
```

---

## 8. API文档生成

### 8.1 OpenAPI规范

```typescript
/**
 * @file API文档生成
 * @description 实现API文档的自动生成
 * @module api-documentation
 * @author YYC³
 * @version 1.0.0
 */

/**
 * OpenAPI文档生成器
 */
export class OpenAPIDocumentGenerator {
  private doc: any = {
    openapi: "3.0.0",
    info: {
      title: "YYC3 Catering Platform API",
      version: "1.0.0",
      description: "餐饮平台API文档",
    },
    servers: [
      {
        url: "http://localhost:3200",
        description: "Development server",
      },
    ],
    paths: {},
    components: {
      schemas: {},
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  };

  /**
   * 添加路径
   */
  addPath(path: string, method: string, config: any): void {
    if (!this.doc.paths[path]) {
      this.doc.paths[path] = {};
    }

    this.doc.paths[path][method.toLowerCase()] = {
      summary: config.summary,
      description: config.description,
      tags: config.tags || [],
      security: config.security ? [{ bearerAuth: [] }] : [],
      parameters: config.parameters || [],
      requestBody: config.requestBody,
      responses: config.responses,
    };
  }

  /**
   * 添加Schema
   */
  addSchema(name: string, schema: any): void {
    this.doc.components.schemas[name] = schema;
  }

  /**
   * 生成文档
   */
  generate(): any {
    return this.doc;
  }

  /**
   * 导出为JSON
   */
  exportJSON(): string {
    return JSON.stringify(this.doc, null, 2);
  }

  /**
   * 导出为YAML
   */
  exportYAML(): string {
    // 实现YAML导出
    return "";
  }
}
```

---

## 9. API性能优化

### 9.1 缓存策略

```typescript
/**
 * @file API性能优化
 * @description 实现API的性能优化策略
 * @module api-performance
 * @author YYC³
 * @version 1.0.0
 */

/**
 * 缓存策略
 */
export enum CacheStrategy {
  NO_CACHE = "NO_CACHE",
  NO_STORE = "NO_STORE",
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
  MUST_REVALIDATE = "MUST_REVALIDATE",
  PROXY_REVALIDATE = "PROXY_REVALIDATE",
  MAX_AGE = "MAX_AGE",
  S_MAXAGE = "S_MAXAGE",
}

/**
 * 缓存管理器
 */
export class CacheManager {
  private cache: Map<string, { data: any; expiry: number }> = new Map();

  /**
   * 设置缓存
   */
  set(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl * 1000,
    });
  }

  /**
   * 获取缓存
   */
  get(key: string): any | null {
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * 删除缓存
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * 清空缓存
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * 生成缓存键
   */
  generateKey(req: any): string {
    return `${req.method}:${req.path}:${JSON.stringify(req.query)}`;
  }
}
```

### 9.2 压缩

```typescript
/**
 * 压缩中间件
 */
export class CompressionMiddleware {
  /**
   * 压缩响应
   */
  static compress(req: any, res: any, next: any): void {
    const acceptEncoding = req.headers["accept-encoding"] || "";

    if (acceptEncoding.includes("gzip")) {
      res.setHeader("Content-Encoding", "gzip");
      // 实现gzip压缩
    } else if (acceptEncoding.includes("deflate")) {
      res.setHeader("Content-Encoding", "deflate");
      // 实现deflate压缩
    }

    next();
  }
}
```

---

## 10. API测试

### 10.1 单元测试

```typescript
/**
 * @file API测试
 * @description 实现API的测试策略
 * @module api-testing
 * @author YYC³
 * @version 1.0.0
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";

/**
 * API测试基类
 */
export abstract class APITestBase {
  protected app: any;

  /**
   * 设置测试环境
   */
  abstract setup(): Promise<void>;

  /**
   * 清理测试环境
   */
  abstract teardown(): Promise<void>;

  /**
   * 发送GET请求
   */
  async get(path: string, token?: string): Promise<any> {
    const headers: any = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // 实现GET请求
    return {};
  }

  /**
   * 发送POST请求
   */
  async post(path: string, data: any, token?: string): Promise<any> {
    const headers: any = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // 实现POST请求
    return {};
  }

  /**
   * 发送PUT请求
   */
  async put(path: string, data: any, token?: string): Promise<any> {
    const headers: any = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // 实现PUT请求
    return {};
  }

  /**
   * 发送DELETE请求
   */
  async delete(path: string, token?: string): Promise<any> {
    const headers: any = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // 实现DELETE请求
    return {};
  }
}

/**
 * 用户API测试
 */
describe("User API", () => {
  let test: APITestBase;
  let authToken: string;

  beforeEach(async () => {
    test = new UserAPITest();
    await test.setup();
  });

  afterEach(async () => {
    await test.teardown();
  });

  it("should create a user", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };

    const response = await test.post("/api/users", userData);

    expect(response.statusCode).toBe(201);
    expect(response.data).toHaveProperty("id");
    expect(response.data.name).toBe(userData.name);
  });

  it("should get user list", async () => {
    const response = await test.get("/api/users", authToken);

    expect(response.statusCode).toBe(200);
    expect(response.data).toHaveProperty("data");
    expect(Array.isArray(response.data.data)).toBe(true);
  });

  it("should get user by id", async () => {
    const response = await test.get("/api/users/1", authToken);

    expect(response.statusCode).toBe(200);
    expect(response.data).toHaveProperty("id");
  });

  it("should update user", async () => {
    const updateData = {
      name: "Updated Name",
    };

    const response = await test.put("/api/users/1", updateData, authToken);

    expect(response.statusCode).toBe(200);
    expect(response.data.name).toBe(updateData.name);
  });

  it("should delete user", async () => {
    const response = await test.delete("/api/users/1", authToken);

    expect(response.statusCode).toBe(204);
  });
});

class UserAPITest extends APITestBase {
  async setup(): Promise<void> {
    // 设置测试环境
  }

  async teardown(): Promise<void> {
    // 清理测试环境
  }
}
```

### 10.2 集成测试

```typescript
/**
 * API集成测试
 */
export class APIIntegrationTest {
  /**
   * 测试API端到端流程
   */
  async testEndToEndFlow(): Promise<void> {
    // 1. 创建用户
    const userResponse = await this.createUser();
    expect(userResponse.statusCode).toBe(201);

    // 2. 登录获取token
    const loginResponse = await this.login(userResponse.data);
    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.data).toHaveProperty("token");

    const token = loginResponse.data.token;

    // 3. 使用token访问受保护资源
    const protectedResponse = await this.getProtectedResource(token);
    expect(protectedResponse.statusCode).toBe(200);

    // 4. 创建订单
    const orderResponse = await this.createOrder(token);
    expect(orderResponse.statusCode).toBe(201);

    // 5. 获取订单列表
    const ordersResponse = await this.getOrders(token);
    expect(ordersResponse.statusCode).toBe(200);
    expect(ordersResponse.data.length).toBeGreaterThan(0);
  }

  private async createUser(): Promise<any> {
    return {};
  }

  private async login(user: any): Promise<any> {
    return {};
  }

  private async getProtectedResource(token: string): Promise<any> {
    return {};
  }

  private async createOrder(token: string): Promise<any> {
    return {};
  }

  private async getOrders(token: string): Promise<any> {
    return {};
  }
}
```

---

## 📄 文档标尾 (Footer)

> 「**_YanYuCloudCube_**」
> 「**_<admin@0379.email>_**」
> 「**_Words Initiate Quadrants, Language Serves as Core for the Future_**」
> 「**_All things converge in cloud pivot; Deep stacks ignite a new era of intelligence_**」

## 概述

### 架构概述

本架构文档详细描述了系统的整体架构设计，包括架构目标、设计原则、技术选型等关键信息。

#### 架构目标

- **高可用性**：确保系统稳定运行，故障自动恢复
- **高性能**：响应迅速，资源利用高效
- **高安全性**：数据加密，权限严格控制
- **高扩展性**：模块化设计，易于功能扩展
- **高可维护性**：代码清晰，文档完善

#### 设计原则

- **单一职责**：每个组件只负责一个功能
- **开闭原则**：对扩展开放，对修改关闭
- **依赖倒置**：依赖抽象而非具体实现
- **接口隔离**：使用细粒度的接口
- **迪米特法则**：最少知识原则

## 架构设计

### 架构设计

#### 整体架构

系统采用分层架构设计，包括：

- **表现层**：负责用户界面和交互
- **应用层**：处理业务逻辑
- **业务层**：实现核心业务功能
- **数据层**：管理数据存储和访问
- **基础设施层**：提供基础服务支持

#### 模块划分

系统划分为多个独立模块，每个模块负责特定功能：

- **用户模块**：用户管理和认证
- **订单模块**：订单处理和管理
- **支付模块**：支付集成和处理
- **通知模块**：消息通知和推送
- **报表模块**：数据统计和分析

#### 技术选型

- **前端框架**：React / Vue
- **后端框架**：Node.js / Express / Fastify
- **数据库**：PostgreSQL / MongoDB
- **缓存**：Redis
- **消息队列**：RabbitMQ / Kafka

## 技术实现

### 技术实现

#### 核心技术栈

```typescript
// 核心依赖
{
  "dependencies": {
    "react": "^18.0.0",
    "typescript": "^5.0.0",
    "express": "^4.18.0",
    "prisma": "^5.0.0",
    "redis": "^4.6.0"
  }
}
```

#### 关键实现

1. **服务层实现**

```typescript
class UserService {
  async createUser(data: CreateUserDto): Promise<User> {
    // 验证输入
    this.validateUserData(data);

    // 加密密码
    const hashedPassword = await this.hashPassword(data.password);

    // 创建用户
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return user;
  }
}
```

2. **中间件实现**

```typescript
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "未授权访问" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "令牌无效" });
  }
};
```

## 部署方案

### 部署方案

#### 部署架构

采用容器化部署方案，使用Docker和Kubernetes进行编排。

#### 部署步骤

1. **环境准备**

```bash
# 安装Docker
curl -fsSL https://get.docker.com | sh

# 安装Kubernetes
# 根据操作系统选择相应的安装方式
```

2. **构建镜像**

```bash
# 构建应用镜像
docker build -t yyc3-app:latest .

# 推送到镜像仓库
docker push registry.example.com/yyc3-app:latest
```

3. **部署到Kubernetes**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: yyc3-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: yyc3-app
  template:
    metadata:
      labels:
        app: yyc3-app
    spec:
      containers:
        - name: app
          image: registry.example.com/yyc3-app:latest
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: "production"
```

4. **配置服务**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: yyc3-app-service
spec:
  selector:
    app: yyc3-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer
```

## 性能优化

### 性能优化

#### 前端优化

1. **代码分割**

```typescript
// 路由级别代码分割
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  );
}
```

2. **缓存策略**

```typescript
// React.memo 避免不必要的重渲染
const MemoizedComponent = React.memo(({ data }) => {
  return <div>{data.value}</div>;
});

// useMemo 缓存计算结果
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

#### 后端优化

1. **数据库优化**

```typescript
// 使用索引
CREATE INDEX idx_user_email ON users(email);

// 查询优化
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true
  },
  where: {
    active: true
  },
  take: 100
});
```

2. **缓存策略**

```typescript
// Redis缓存
async function getUser(id: string): Promise<User> {
  const cacheKey = `user:${id}`;

  // 尝试从缓存获取
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // 从数据库获取
  const user = await prisma.user.findUnique({ where: { id } });

  // 写入缓存
  await redis.setex(cacheKey, 3600, JSON.stringify(user));

  return user;
}
```

## 安全考虑

### 安全考虑

#### 认证与授权

1. **JWT认证**

```typescript
// 生成JWT令牌
const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" });

// 验证JWT令牌
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

2. **RBAC授权**

```typescript
// 角色权限检查
function checkPermission(user: User, resource: string, action: string): boolean {
  const permissions = rolePermissions[user.role];
  return permissions.some(p => p.resource === resource && p.actions.includes(action));
}
```

#### 数据保护

1. **输入验证**

```typescript
// 使用Zod进行输入验证
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/),
  name: z.string().min(2),
});

const validated = createUserSchema.parse(input);
```

2. **数据加密**

```typescript
// 使用bcrypt加密密码
const hashedPassword = await bcrypt.hash(password, 10);

// 验证密码
const isValid = await bcrypt.compare(password, hashedPassword);
```

#### 安全头配置

```typescript
// Express安全头配置
app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(","),
    credentials: true,
  })
);
```

## 监控告警

### 监控告警

#### 监控指标

1. **系统指标**

- CPU使用率
- 内存使用率
- 磁盘使用率
- 网络I/O

2. **应用指标**

- 请求量(RPS)
- 响应时间
- 错误率
- 并发用户数

3. **业务指标**

- 用户注册数
- 订单创建数
- 支付成功率
- 用户活跃度

#### 监控工具

```typescript
// Prometheus指标收集
import { Counter, Histogram, Gauge } from "prom-client";

const requestCounter = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});

const responseTime = new Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route"],
});

// 使用中间件记录指标
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;
    requestCounter.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode,
    });
    responseTime.observe(
      {
        method: req.method,
        route: req.route?.path || req.path,
      },
      duration
    );
  });

  next();
});
```

#### 告警规则

```yaml
groups:
  - name: api_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "API错误率过高"
          description: "5分钟内错误率超过5%"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, http_request_duration_seconds) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "API响应时间过长"
          description: "95%分位响应时间超过1秒"
```

## 最佳实践

### 最佳实践

#### 代码规范

1. **命名规范**

```typescript
// 变量：camelCase
const userName = "John";

// 常量：UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;

// 类：PascalCase
class UserService {}

// 接口：PascalCase，前缀I（可选）
interface IUserService {}
```

2. **注释规范**

```typescript
/**
 * 创建用户
 * @param email - 用户邮箱
 * @param password - 用户密码
 * @returns 创建的用户对象
 * @throws {Error} 当邮箱已存在时抛出错误
 */
async function createUser(email: string, password: string): Promise<User> {
  // 实现
}
```

#### 错误处理

```typescript
// 统一错误处理
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 使用错误处理中间件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  // 记录未预期的错误
  logger.error("Unexpected error:", err);

  return res.status(500).json({
    success: false,
    error: "服务器内部错误",
  });
});
```

#### 日志记录

```typescript
// 结构化日志
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// 使用日志
logger.info("User created", { userId: user.id, email: user.email });
logger.error("Database connection failed", { error: error.message });
```

## 最佳实践

### 最佳实践

#### 代码规范

1. **命名规范**

```typescript
// 变量：camelCase
const userName = "John";

// 常量：UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;

// 类：PascalCase
class UserService {}

// 接口：PascalCase，前缀I（可选）
interface IUserService {}
```

2. **注释规范**

```typescript
/**
 * 创建用户
 * @param email - 用户邮箱
 * @param password - 用户密码
 * @returns 创建的用户对象
 * @throws {Error} 当邮箱已存在时抛出错误
 */
async function createUser(email: string, password: string): Promise<User> {
  // 实现
}
```

#### 错误处理

```typescript
// 统一错误处理
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 使用错误处理中间件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  // 记录未预期的错误
  logger.error("Unexpected error:", err);

  return res.status(500).json({
    success: false,
    error: "服务器内部错误",
  });
});
```

#### 日志记录

```typescript
// 结构化日志
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// 使用日志
logger.info("User created", { userId: user.id, email: user.email });
logger.error("Database connection failed", { error: error.message });
```

## 相关文档

- [中间件集成架构文档](YYC3-Cater-开发实施/架构类/04-YYC3-Cater--架构类-中间件集成架构文档.md) - YYC3-Cater-开发实施/架构类
- [数据访问层架构实现文档](YYC3-Cater-开发实施/架构类/03-YYC3-Cater--架构类-数据访问层架构实现文档.md) - YYC3-Cater-开发实施/架构类
- [AI模型开发与集成文档](YYC3-Cater-开发实施/架构类/05-YYC3-Cater--架构类-AI模型开发与集成文档.md) - YYC3-Cater-开发实施/架构类
- [代码架构实现说明书](YYC3-Cater-开发实施/架构类/01-YYC3-Cater--架构类-代码架构实现说明书.md) - YYC3-Cater-开发实施/架构类
- [YYC3 智枢服务化平台 - 自动迭代实施计划资源准备清单](YYC3-Cater-开发实施/架构类/11-YYC3-Cater--架构类-自动迭代实施计划资源准备清单.md) - YYC3-Cater-开发实施/架构类
