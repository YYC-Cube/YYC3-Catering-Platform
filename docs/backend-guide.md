# YYC³ 餐饮平台 — 后端服务开发指导文档

> 本文档面向后端开发者与 AI 代理,系统说明各微服务的架构、配置、约定与注意事项。
> 配套文档:`AGENTS.md`(全仓工作指南)、`PLAN.md`(完善路线)、`docs/deployment.md`(前端部署)。

---

## 目录

1. [架构总览](#1-架构总览)
2. [服务清单与端口映射](#2-服务清单与端口映射)
3. [目录结构与微服务模板](#3-目录结构与微服务模板)
4. [数据库配置](#4-数据库配置)
5. [服务注册与发现 (Consul)](#5-服务注册与发现-consul)
6. [API 网关与认证机制](#6-api-网关与认证机制)
7. [响应信封与错误处理](#7-响应信封与错误处理)
8. [日志规范](#8-日志规范)
9. [Docker 化与容器构建](#9-docker-化与容器构建)
10. [本地开发环境 (docker-compose)](#10-本地开发环境-docker-compose)
11. [开发流程与检查清单](#11-开发流程与检查清单)
12. [已知问题与注意事项](#12-已知问题与注意事项)

---

## 1. 架构总览

```
                    ┌──────────────────────────────────────────┐
                    │              客户端 (Vue 3)               │
                    │   admin-dashboard / customer / staff     │
                    └──────────────────┬───────────────────────┘
                                       │ HTTP / WebSocket
                                       ▼
                    ┌──────────────────────────────────────────┐
                    │          API Gateway (Express)           │
                    │  http-proxy-middleware + JWT + 限流       │
                    │  反向代理 + 身份转发 (X-User-ID/Email)    │
                    └──┬───────┬───────┬───────┬───────┬───────┘
                       │       │       │       │       │
            ┌──────────▼┐ ┌────▼───┐ ┌─▼────┐ ┌▼─────┐ ┌▼──────────┐
            │user-service│ │order-  │ │menu- │ │pay-  │ │analytics- │
            │  Express   │ │service │ │svc   │ │ment  │ │service    │
            │  MySQL     │ │ MySQL  │ │MySQL │ │MySQL │ │PostgreSQL │
            └─────┬─────┘ └───┬────┘ └──┬───┘ └──┬───┘ └────┬──────┘
                  │           │         │        │          │
            ┌─────▼───────────▼─────────▼────────▼──────────▼────┐
            │              基础设施层 (Docker Compose)              │
            │  MySQL 8 · Redis 7 · Kafka · RabbitMQ · Consul      │
            │  Nacos · ELK · Prometheus · Grafana                 │
            └─────────────────────────────────────────────────────┘
```

**关键设计**:
- **异构运行时**: 多数服务用 Node.js + Express;`api-service` 用 **Bun** 原生 HTTP。
- **异构数据库**: 多数服务用 **MySQL**(sequelize-typescript);`api-service` 用 **PostgreSQL**(raw `pg`);`analytics-service` 亦用 PostgreSQL。
- **API 网关** 作为唯一入口,以反向代理方式分发请求到各下游服务。

---

## 2. 服务清单与端口映射

| 服务 | 框架 | 数据库 | 默认端口 | 运行时 |
|---|---|---|---|---|
| `api-gateway` | Express | — | **3200** | Node |
| `api-service` | Bun.serve | PostgreSQL | **3000** | Bun |
| `user-service` | Express + sequelize-typescript | MySQL | **3201** | Node |
| `order-service` | Express + sequelize-typescript | MySQL | **3202** | Node |
| `menu-service` | Express + sequelize-typescript | MySQL | **3201** ⚠️ | Node |
| `payment-service` | Express + Sequelize | MySQL | **3204** | Node |
| `notification-service` | Express + Sequelize | MySQL | **3206** | Node |
| `analytics-service` | Express + sequelize-typescript | PostgreSQL | **3303** | Node |
| `smart-kitchen` | Express | Redis (无 ORM) | **3645** | Node |
| `smart-ops-service` | Express | MongoDB | **3205** | Node |
| `ai-assistant` | Express | — | **3201** ⚠️ | Node |

### ⚠️ 端口冲突(需注意)

`user-service`、`menu-service`、`ai-assistant` **都默认 3201**,不可同时本地运行。启动时用环境变量覆盖:

```bash
# 示例:menu-service 改用 3211
SERVICE_PORT=3211 pnpm --filter yyc3-menu-service dev
```

### API 网关内部路由映射

`api-gateway/src/config/services.ts` 中的默认值(需通过环境变量覆盖以匹配实际端口):

| 网关路由前缀 | 目标服务 | 网关默认 URL | 实际服务端口 |
|---|---|---|---|
| `/api/users` | user-service | `localhost:3201` | 3201 ✅ |
| `/api/restaurants` | restaurantService | `localhost:3202` | 3202 (order-service) |
| `/api/menu-items` | restaurantService | `localhost:3202` | 3201 (menu-service) ⚠️ |
| `/api/orders` | orderService | `localhost:3203` | 3202 (order-service) ⚠️ |
| `/api/cart` | orderService | `localhost:3203` | 3202 ⚠️ |
| `/api/payments` | paymentService | `localhost:3204` | 3204 ✅ |
| `/api/notifications` | notificationService | `localhost:3205` | 3206 ⚠️ |
| `/api/analytics` | analyticsService | `localhost:3303` | 3303 ✅ |

> ⚠️ 网关默认端口映射与实际服务端口存在不一致,本地全量启动时需通过环境变量对齐(见第 10 节)。

---

## 3. 目录结构与微服务模板

### 标准目录结构

参考 `backend/services/microservice-template/`,每个新微服务应遵循:

```
backend/services/<service-name>/
├── src/
│   ├── config/              # 配置文件
│   │   ├── config.ts        # 主配置(读取环境变量)
│   │   ├── database.ts      # 数据库连接
│   │   └── logger.ts        # Winston 日志配置
│   ├── controllers/         # HTTP 控制器(薄层,仅处理请求/响应)
│   ├── services/            # 业务逻辑层(厚层,含核心逻辑)
│   ├── models/              # 数据模型(Sequelize / TypeORM)
│   ├── routes/              # Express Router 定义
│   ├── middleware/          # 服务级中间件
│   ├── __tests__/unit/      # 单元测试(镜像 src/ 结构)
│   └── app.ts               # 应用入口(Express bootstrap)
├── Dockerfile               # 容器构建(可选)
├── package.json
├── tsconfig.json
├── .env.example             # 环境变量模板
└── README.md
```

### 分层约定

```
HTTP 请求 → Router → Controller → Service → Model/Repository
                              ↓
                         logger / config
```

- **Controller**: 仅做请求参数提取、调用 Service、格式化响应,**不含业务逻辑**。
- **Service**: 核心业务逻辑,**Singleton 模式**导出(`export default new UserService()`)。
- **Model**: 用装饰器定义表结构与关联关系。

### 新建微服务流程

```bash
# 1. 复制模板
cp -r backend/services/microservice-template backend/services/my-service

# 2. 修改 package.json 中的 name 字段
# 3. 修改 tsconfig.json 的 outDir
# 4. 实现 config / controllers / services / models / routes / app.ts
# 5. 在 api-gateway/src/config/services.ts 中注册新服务
# 6. 在 api-gateway/src/routes/index.ts 中添加代理路由
# 7. 编写 __tests__/unit/ 测试
# 8. (可选)添加 Dockerfile
```

---

## 4. 数据库配置

### 数据库分布总览

| 服务 | ORM | 数据库 | 环境变量前缀 |
|---|---|---|---|
| user-service | `sequelize-typescript` | MySQL | `DATABASE_*` |
| order-service | `sequelize-typescript` | MySQL | `DB_*` |
| menu-service | `sequelize-typescript` + `mysql2` | MySQL | `DB_*` |
| payment-service | `Sequelize` (vanilla) | MySQL | `DB_*` |
| notification-service | `Sequelize` (vanilla) | MySQL | `DB_*` |
| analytics-service | `sequelize-typescript` | PostgreSQL | `DB_*` |
| api-service | `pg.Pool` (raw driver) | PostgreSQL | `DATABASE_*` |
| smart-ops-service | — | MongoDB | `DATABASE_URL` |
| smart-kitchen | — | Redis-backed | — |

### Sequelize 连接模板(MySQL 服务)

```typescript
// 参照 user-service/src/config/database.ts
import { Sequelize } from 'sequelize-typescript';

const sequelize = new Sequelize({
  host: config.database.host,        // env: DATABASE_HOST
  port: config.database.port,        // env: DATABASE_PORT
  username: config.database.user,    // env: DATABASE_USER
  password: config.database.password,// env: DATABASE_PASSWORD
  database: config.database.name,    // env: DATABASE_NAME
  dialect: config.database.dialect,  // 'mysql'
  logging: (msg) => logger.debug(msg),
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    underscored: true,       // 列名自动转 snake_case
    timestamps: true,        // created_at / updated_at
    paranoid: true,          // 软删除 deleted_at
  },
});
```

### 环境变量命名差异

不同服务使用了不同的环境变量前缀,这是当前已知的不一致(见 PLAN.md):

| 前缀 | 使用服务 |
|---|---|
| `DATABASE_HOST` / `DATABASE_PORT` | user-service, api-service |
| `DB_HOST` / `DB_PORT` | order-service, menu-service, payment-service, notification-service, analytics-service |

**新服务建议统一使用 `DB_*` 前缀**(与 docker-compose 一致)。

### 模型定义约定

```typescript
// 参照 user-service/src/models/User.ts
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';

@Table({
  tableName: 'users',                          // 复数 + snake_case
  indexes: [
    { name: 'idx_users_phone', fields: ['phone'], unique: true },
  ],
})
export class User extends Model<User> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id: string;

  @Column({ type: DataType.STRING(20), allowNull: false, unique: true })
  phone: string;

  @ForeignKey(() => Role)
  @Column({ type: DataType.UUID, allowNull: false })
  role_id: string;                              // snake_case 外键

  @BelongsTo(() => Role)
  role: Role;
}
```

**命名规范**:
- 表名:复数 + snake_case (`users`、`order_items`、`food_safety_records`)
- 列名:snake_case (`role_id`、`last_login_at`、`created_at`)
- 主键:`id`,UUID 类型
- 外键:`{被引用表单数}_id` (`user_id`、`order_id`)
- 时间戳:`created_at` / `updated_at` / `deleted_at`

### 模型同步

```typescript
// 开发环境自动同步表结构(非生产)
if (process.env.NODE_ENV !== 'production') {
  await sequelize.sync({ alter: true });
}
```

> 生产环境应使用迁移脚本(`db:migrate`),而非 `sync()`。

---

## 5. 服务注册与发现 (Consul)

### 架构

```
ServiceRegistryManager  ──注册──▶  Consul (8500)
       ▲                              │
       │                              │ 健康检查
ServiceDiscoveryClient  ◀──发现──    │
  (缓存 + 负载均衡)                  │
```

### 三层设计

| 层 | 文件 | 职责 |
|---|---|---|
| **ConsulClient** | `service-registry/src/consul-client.ts` | 封装 Consul HTTP API(Axios) |
| **ServiceRegistryManager** | `service-registry/src/service-registry-manager.ts` | 服务注册生命周期管理 |
| **ServiceDiscoveryClient** | `service-registry/src/service-discovery-client.ts` | 客户端发现 + 缓存 + 负载均衡 |

### 注册示例

```typescript
import { initServiceRegistry } from '@yyc3/service-registry';

const registry = initServiceRegistry({
  name: 'user-service',
  address: 'localhost',
  port: 3201,
  healthCheck: {
    type: 'http',
    http: 'http://localhost:3201/health',
    interval: '10s',
    timeout: '5s',
  },
});
// 自动注册;失败自动重试(最多 10 次,间隔 5s)
// SIGTERM/SIGINT 时自动注销
```

### 发现 + 调用示例

```typescript
import { callService } from '@yyc3/service-registry';

// 自动负载均衡(random / round-robin / least-connections / weighted)
const result = await callService('user-service', {
  method: 'GET',
  path: '/api/v1/users/123',
});
```

### 配置环境变量

```bash
CONSUL_HOST=localhost    # 或 docker-compose 中的 consul
CONSUL_PORT=8500
CONSUL_TOKEN=            # ACL token(生产环境必须)
CONSUL_DATACENTER=dc1
CONSUL_SCHEME=http
```

### 缓存与负载均衡策略

- 缓存 TTL: 30 秒
- 健康检查间隔: 10 秒
- 重试次数: 3,重试间隔: 1 秒
- 负载均衡策略: `random`(默认)、`round-robin`、`least-connections`、`weighted`

---

## 6. API 网关与认证机制

### 网关职责

```
client → [限流] → [CORS] → [Helmet] → [JSON Parser] → [认证中间件] → [反向代理] → 下游服务
```

### 认证流程

`api-gateway/src/middleware/auth.ts` 使用 `jsonwebtoken` 验证 Bearer Token:

```typescript
// 认证中间件:验证失败返回 401
export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: '未提供认证令牌' });
  }
  const decoded = jwt.verify(token, process.env['JWT_SECRET']);
  (req as any).user = decoded;   // 挂载到 req.user
  next();
};

// 可选认证:有 Token 则验证,无 Token 也放行
export const optionalAuthMiddleware = (req, res, next) => { ... };
```

### 身份转发

网关通过 HTTP Header 将用户身份转发给下游服务(**不**转发 Token):

```typescript
// api-gateway/src/routes/index.ts — onProxyReq 回调
if ((req as any).user) {
  proxyReq.setHeader('X-User-ID', (req as any).user.userId);
  proxyReq.setHeader('X-User-Email', (req as any).user.email);
}
```

下游服务可通过 `req.headers['x-user-id']` 获取用户身份。

### 路由保护级别

```typescript
// secure = true → 需认证 (authMiddleware)
createProxyRoute('/api/users',        'userService',         true);
createProxyRoute('/api/orders',       'orderService',         true);
createProxyRoute('/api/payments',     'paymentService',       true);
createProxyRoute('/api/notifications','notificationService',  true);

// secure = false → 可选认证 (optionalAuthMiddleware)
createProxyRoute('/api/restaurants',  'restaurantService',    false);
createProxyRoute('/api/menu-items',   'restaurantService',    false);
createProxyRoute('/api/analytics',    'analyticsService',     false);
```

### JWT Secret 配置

```bash
# .env
JWT_SECRET=your-very-secure-secret-key   # 生产环境必须替换
```

> ⚠️ 当前代码中 `jwt.verify` 的 fallback 为 `'your-secret-key-change-in-production'`,**生产环境必须设置 `JWT_SECRET` 环境变量**。

---

## 7. 响应信封与错误处理

### 统一响应格式

```typescript
// backend/shared/types/ApiResponse.ts
interface ApiResponse<T = any> {
  code: number;          // HTTP 状态码
  message: string;       // 人类可读消息(中文)
  data?: T;              // 业务数据
  timestamp: number;     // Unix 毫秒时间戳
  requestId?: string;    // 请求追踪 ID
  success: boolean;      // 成功/失败标志
}
```

### Controller 响应模式

```typescript
// 成功响应
return res.status(200).json({
  code: 200,
  message: '获取用户列表成功',
  data: result,
});

// 错误响应
return res.status(404).json({
  code: 404,
  message: '用户不存在',
});

// 异常捕获
try {
  // ...
} catch (error: any) {
  logger.error('操作失败:', error);
  return res.status(500).json({
    code: 500,
    message: error.message || '服务器内部错误',
  });
}
```

### 错误类型体系

`backend/src/middleware/errorHandler.ts` 定义了 Hono 风格的错误层级(供 api-service 使用):

| 错误类 | HTTP 状态码 | 用途 |
|---|---|---|
| `ValidationError` | 400 | 请求参数校验失败 |
| `AuthenticationError` | 401 | 认证失败 |
| `AuthorizationError` | 403 | 权限不足 |
| `NotFoundError` | 404 | 资源不存在 |
| `ConflictError` | 409 | 资源冲突 |
| `RateLimitError` | 429 | 限流触发 |
| `BusinessError` | 400 | 业务规则违反 |
| `ExternalServiceError` | 502 | 外部依赖故障 |
| `DatabaseError` | 500 | 数据库操作失败 |

> 多数 Express 服务的 Controller 使用简化版 `try/catch + res.status(error.status || 500)`,未采用上述完整体系。新服务建议引入 `AppError` 层级。

### 健康检查端点

所有服务应在 `app.ts` 中暴露:

```typescript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'user-service',
    timestamp: new Date().toISOString(),
  });
});
```

---

## 8. 日志规范

### 共享日志库

`backend/libs/logger/logger.service.ts` 基于 Winston + daily-rotate-file:

```typescript
import { createLoggerService, LogLevel } from '@libs/logger/logger.service';

const logger = createLoggerService({
  level: process.env['LOG_LEVEL'] || LogLevel.INFO,
  filePath: process.env['LOG_FILE_PATH'] || './logs/service.log',
  maxFiles: process.env['LOG_MAX_FILES'] || '14d',
  maxSize: process.env['LOG_MAX_SIZE'] || '20m',
  format: process.env['LOG_FORMAT'] || 'json',
});

logger.info('数据库连接成功');
logger.error('登录失败', { userId: '123', error: err.message });
```

### 日志约定

| 级别 | 使用场景 | 示例 |
|---|---|---|
| `debug` | SQL 日志、详细调试信息 | `logger.debug('SQL: SELECT * FROM users')` |
| `info` | 正常业务流程、启动/关闭 | `logger.info('用户服务已启动,监听端口 3201')` |
| `warn` | 异常但可恢复的情况 | `logger.warn('Redis 连接超时,使用本地缓存')` |
| `error` | 错误、异常、需要关注 | `logger.error('数据库连接失败:', error)` |

- 日志消息统一使用**中文**。
- 结构化日志传递上下文对象:`logger.info('代理请求', { serviceName, url, method })`。
- 生产环境**不输出**堆栈信息到客户端响应,仅在日志中记录。

### 各服务差异

| 服务 | 日志实现 | 文件保留 |
|---|---|---|
| api-gateway | 共享库 `@libs/logger` | 14 天 |
| user-service | 独立 Winston 配置(error + combined 双文件) | 30 天 |
| ai-assistant | 行内配置(app.ts 中) | — |

---

## 9. Docker 化与容器构建

### 现有 Dockerfile 清单

| 服务 | 基础镜像 | 包管理器 | 安全特性 |
|---|---|---|---|
| `api-gateway` | `oven/bun:1-alpine` | pnpm | ✅ 非 root 用户 + dumb-init + healthcheck |
| `user-service` | `node:18-alpine` | npm | ❌ root 运行,无 init,无 healthcheck |
| `api-service` | Bun 专用 | bun | ✅ 多阶段构建 |
| `menu-service` | — | — | — |
| `notification-service` | — | — | — |
| `smart-kitchen` | — | — | — |

### 推荐 Dockerfile 模板(Node + Express 服务)

```dockerfile
# 基于 api-gateway 的最佳实践
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache curl dumb-init
COPY package*.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:20-alpine AS production
RUN addgroup -g 1001 -S yyc3 && adduser -S yyc3 -u 1001 -G yyc3
RUN apk add --no-cache curl dumb-init
WORKDIR /app
COPY --from=builder --chown=yyc3:yyc3 /app/dist ./dist
COPY --from=builder --chown=yyc3:yyc3 /app/node_modules ./node_modules
COPY --from=builder --chown=yyc3:yyc3 /app/package.json ./
USER yyc3
EXPOSE 3201
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3201/health || exit 1
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
```

### 安全要点

- **非 root 用户**: 创建 `yyc3` 用户,`USER yyc3` 切换。
- **dumb-init**: 作为 PID 1 正确处理信号(SIGTERM/SIGINT)。
- **多阶段构建**: builder 阶段包含 devDeps,production 阶段仅复制 `dist` + 生产 `node_modules`。
- **Health check**: 生产镜像应包含 `HEALTHCHECK` 指令。
- **不复制 `.env`**: 生产环境通过 K8s Secret / docker-compose env 注入。

---

## 10. 本地开发环境 (docker-compose)

### 启动基础设施

```bash
pnpm run docker:up
# 或仅启动需要的组件
docker-compose up -d mysql redis consul
```

### 基础设施端口与凭据(开发环境)

| 组件 | 端口 | 凭据(仅开发) |
|---|---|---|
| MySQL | 3306 | root / `123456`,db: `yyc3_catering`,user: `yyc3_user` |
| Redis | 6379 | password: `123456` |
| RabbitMQ | 5672 (AMQP) / 15672 (UI) | admin / `123456`,vhost: `/yyc3` |
| Kafka | 9092 / 29092 | — |
| Consul | 8500 (HTTP) / 8600 (DNS) | — |
| Nacos | 8848 | — |
| Elasticsearch | 9200 | — |
| Kibana | 5601 | — |
| Logstash | 5044 | — |
| Prometheus | 9090 | — |
| Grafana | 3000 | admin / admin |

> ⚠️ 以上均为**开发环境默认凭据**,**严禁用于生产**。生产凭据治理见 `PLAN.md` D5。

### 启动单个微服务

```bash
# 安装依赖(根目录)
pnpm install

# 启动 user-service
pnpm --filter yyc3-user-service dev

# 启动 api-service (Bun)
pnpm --filter yyc3-catering-api-service dev
```

### 全量启动(含端口覆盖)

由于端口冲突,全量启动需为每个服务指定不同端口:

```bash
# 终端 1:基础设施
pnpm run docker:up

# 终端 2:api-gateway
pnpm --filter yyc3-api-gateway dev

# 终端 3:user-service
pnpm --filter yyc3-user-service dev

# 终端 4:menu-service (改端口避免冲突)
SERVICE_PORT=3211 pnpm --filter yyc3-menu-service dev
```

### 环境变量配置

每个服务从 `.env` 文件读取配置。模板见各服务的 `.env.example`:

```bash
# user-service/.env 示例
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=yyc3_user
DATABASE_PASSWORD=123456
DATABASE_NAME=yyc3_catering
DATABASE_DIALECT=mysql
JWT_SECRET=your-development-secret
PORT=3201
```

---

## 11. 开发流程与检查清单

### 新功能开发检查清单

- [ ] 修改/新增文件包含 **JSDoc 文件头**(`@fileoverview`、`@author YYC³`、`@version`、`@created`、`@license MIT`)
- [ ] Controller 方法有 **TypeScript 类型注解**(参数与返回值)
- [ ] 响应遵循 **统一信封格式**(`{ code, message, data }`)
- [ ] 错误处理使用 `try/catch`,并通过 `logger.error()` 记录
- [ ] Service 以 **Singleton** 模式导出
- [ ] Model 使用 **snake_case** 列名 + UUID 主键
- [ ] 日志消息使用**中文**
- [ ] 新增了对应的 **单元测试**(`__tests__/unit/`)
- [ ] 运行 `pnpm --filter <pkg> test` 通过
- [ ] 运行 `pnpm --filter <pkg> lint` 通过
- [ ] 运行 `pnpm --filter <pkg> type-check` 通过

### 测试编写

```typescript
// backend/services/user-service/src/__tests__/unit/services/UserService.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import userService from '../../../services/UserService';
import { User, UserStatus } from '../../../models/User';

// 模拟 Sequelize Model
vi.mock('../../../models/User');

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该成功注册新用户', async () => {
    vi.spyOn(User, 'findOne').mockResolvedValue(null);
    vi.spyOn(User, 'create').mockResolvedValue({ id: '1' } as any);

    const result = await userService.register({
      phone: '13800138000',
      password: 'password123',
    });

    expect(result).toBeDefined();
  });
});
```

**测试约定**:
- 框架: **Vitest**(部分老服务可能用 Jest,新服务统一用 Vitest)
- 位置: `src/__tests__/unit/**/*.test.ts`,镜像源码结构
- Mock: 使用 `vi.mock()` + `vi.spyOn()` 模拟 Sequelize Model
- 描述: 中文(`'应该成功...'`)

### 提交规范

```bash
git commit -m "feat(user-service): 添加密码重置功能"
#           ↑ type(scope): description
```

| Type | 用途 |
|---|---|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `refactor` | 代码重构(不改行为) |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `docs` | 文档更新 |
| `chore` | 构建/工具变动 |

---

## 12. 已知问题与注意事项

### ⚠️ 端口冲突

`user-service`、`menu-service`、`ai-assistant` 均默认 3201。本地开发需用环境变量覆盖。

### ⚠️ 网关路由映射不完整

`api-gateway/src/config/services.ts` 的默认端口与部分服务的实际端口不一致(`notificationService` 默认 3205 但服务实际 3206;`orderService` 默认 3203 但服务实际 3202)。本地开发需通过环境变量对齐:

```bash
# api-gateway/.env 示例
USER_SERVICE_URL=http://localhost:3201
ORDER_SERVICE_URL=http://localhost:3202
PAYMENT_SERVICE_URL=http://localhost:3204
NOTIFICATION_SERVICE_URL=http://localhost:3206
ANALYTICS_SERVICE_URL=http://localhost:3303
RESTAURANT_SERVICE_URL=http://localhost:3211  # menu-service
```

### ⚠️ 环境变量前缀不统一

部分服务用 `DATABASE_*`,部分用 `DB_*`。新服务建议统一使用 `DB_*`。

### ⚠️ JWT Secret Fallback

`api-gateway/src/middleware/auth.ts` 中 `jwt.verify` 有硬编码 fallback:
```typescript
jwt.verify(token, process.env['JWT_SECRET'] || 'your-secret-key-change-in-production')
```
**生产环境必须设置 `JWT_SECRET`**。

### ⚠️ 双数据库

MySQL(多数服务)和 PostgreSQL(api-service、analytics-service)并存。docker-compose 只启动 MySQL;使用 PostgreSQL 的服务需额外启动或配置连接。

### ⚠️ Dockerfile 安全差异

`user-service` 的 Dockerfile 以 root 运行、无 dumb-init、无 healthcheck,与 `api-gateway` 的安全实践不一致。新服务应参照 api-gateway 的 Dockerfile 模板。

### ⚠️ `analytics-service` 的 `sync({ alter: true })`

该服务在所有环境(含生产)中调用 `sequelize.sync({ alter: true })`,可能意外修改生产表结构。建议改为条件同步。

### ⚠️ Stub 服务

以下服务仅有最小骨架,功能不完整(见 `PLAN.md` D4):
- `o2o-system` (1 文件)
- `chain-operation` (4 文件,无 tsconfig)
- `food-safety` (4 文件,无 tsconfig)
- `delivery-service` (15 文件,无测试)

---

## 附录:关键文件索引

| 内容 | 文件路径 |
|---|---|
| 微服务模板 | `backend/services/microservice-template/` |
| 共享类型 | `backend/shared/types/ApiResponse.ts`、`Auth.ts` |
| 共享服务库 | `backend/common/services/{LoggerService,EventBusService,CommunicationService}.ts` |
| 日志库 | `backend/libs/logger/logger.service.ts` |
| 错误处理 | `backend/src/middleware/errorHandler.ts` |
| 网关路由 | `backend/services/api-gateway/src/routes/index.ts` |
| 网关认证 | `backend/services/api-gateway/src/middleware/auth.ts` |
| 网关服务配置 | `backend/services/api-gateway/src/config/services.ts` |
| 服务注册 | `backend/services/service-registry/src/` |
| 本地基础设施 | `docker-compose.yaml` |
| Helm 部署 | `helm/`、`infra/phase1/iac/helm/charts/` |
