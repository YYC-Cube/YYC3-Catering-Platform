# YYC³ API服务

YYC³餐饮平台核心API服务，提供菜单管理、订单处理、库存管理等核心业务功能。

## 🚀 快速开始

### 环境要求

- Bun >= 1.0.0
- PostgreSQL >= 13
- Redis >= 6

### 安装依赖

```bash
bun install
```

### 环境配置

复制环境变量配置文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置数据库连接和其他环境变量。

### 数据库初始化

```bash
bun run db:migrate
bun run db:seed
```

### 启动开发服务器

```bash
bun run dev
```

服务将在 `http://localhost:3000` 启动。

### 构建生产版本

```bash
bun run build
bun run start
```

## 📚 API文档

### 基础信息

- **基础URL**: `http://api.0379.love/api/v1`
- **认证方式**: JWT Bearer Token
- **数据格式**: JSON
- **字符编码**: UTF-8

### 通用响应格式

```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "timestamp": "2025-01-09T00:00:00.000Z"
}
```

错误响应格式：

```json
{
  "success": false,
  "error": "错误描述",
  "code": "ERROR_CODE",
  "timestamp": "2025-01-09T00:00:00.000Z"
}
```

## 🍽️ 菜单管理API

### 菜品管理

#### 创建菜品

```http
POST /api/v1/menu/items
Content-Type: application/json

{
  "name": "宫保鸡丁",
  "description": "经典川菜，麻辣鲜香",
  "category": "main_course",
  "price": 38.00,
  "spicyLevel": "medium",
  "prepTime": 15,
  "ingredients": ["鸡肉", "花生", "干辣椒"],
  "tags": ["川菜", "辣", "下饭菜"]
}
```

#### 获取菜品列表

```http
GET /api/v1/menu/items?page=1&limit=20&category=main_course&status=available
```

#### 获取菜品详情

```http
GET /api/v1/menu/items/{id}
```

#### 更新菜品

```http
PUT /api/v1/menu/items/{id}
Content-Type: application/json

{
  "price": 42.00,
  "status": "unavailable"
}
```

#### 删除菜品

```http
DELETE /api/v1/menu/items/{id}
```

### 搜索和推荐

#### 搜索菜品

```http
GET /api/v1/menu/search?keyword=宫保鸡丁&category=main_course
```

#### 获取推荐菜品

```http
GET /api/v1/menu/recommended?limit=10
```

#### 获取热门菜品

```http
GET /api/v1/menu/popular?limit=10
```

#### 获取新品菜品

```http
GET /api/v1/menu/new?limit=10
```

### 统计分析

#### 获取分类统计

```http
GET /api/v1/menu/stats/categories
```

#### 获取销量统计

```http
GET /api/v1/menu/stats/sales?startDate=2025-01-01&endDate=2025-01-31
```

### 批量操作

#### 批量更新菜品状态

```http
PATCH /api/v1/menu/items/batch/status
Content-Type: application/json

{
  "ids": ["uuid1", "uuid2"],
  "status": "unavailable"
}
```

## 🏥 健康检查

### 服务健康状态

```http
GET /health
```

响应示例：

```json
{
  "status": "healthy",
  "timestamp": "2025-01-09T00:00:00.000Z",
  "version": "1.0.0",
  "environment": "production",
  "uptime": 3600.5,
  "responseTime": "45ms",
  "services": {
    "database": {
      "status": "healthy",
      "responseTime": "12ms"
    }
  },
  "memory": {
    "used": 128,
    "total": 256,
    "external": 64
  }
}
```

## 🔒 错误代码

| 错误代码                | HTTP状态码 | 描述             |
| ----------------------- | ---------- | ---------------- |
| `NOT_FOUND`             | 404        | 请求的资源不存在 |
| `VALIDATION_ERROR`      | 400        | 请求参数验证失败 |
| `UNAUTHORIZED`          | 401        | 未授权访问       |
| `FORBIDDEN`             | 403        | 权限不足         |
| `RATE_LIMIT_EXCEEDED`   | 429        | 请求频率超限     |
| `INTERNAL_SERVER_ERROR` | 500        | 服务器内部错误   |
| `SERVICE_UNAVAILABLE`   | 503        | 服务暂时不可用   |

## 📝 开发指南

### 项目结构

```
src/
├── config/          # 配置文件
│   ├── app.ts       # 应用配置
│   └── database.ts  # 数据库配置
├── controllers/     # 控制器
│   └── menu-controller.ts
├── models/          # 数据模型
│   └── menu.ts
├── routes/          # 路由定义
│   └── menu-routes.ts
├── middleware/      # 中间件
├── services/        # 业务服务
├── types/           # 类型定义
└── utils/           # 工具函数
```

### 代码规范

- 使用 TypeScript 进行类型安全开发
- 遵循 YYC³ 编码规范
- 使用 Zod 进行数据验证
- 采用 RESTful API 设计原则

### 数据库操作

```typescript
import { dbManager } from './config/database';

// 查询
const result = await dbManager.query('SELECT * FROM menu_items WHERE id = $1', [
  id,
]);

// 事务
await dbManager.transaction(async client => {
  await client.query('INSERT INTO orders ...');
  await client.query('UPDATE inventory ...');
});
```

## 🚀 部署

### Docker部署

```bash
# 构建镜像
docker build -t yyc3-api-service .

# 运行容器
docker run -d \
  --name yyc3-api \
  -p 3000:3000 \
  --env-file .env \
  yyc3-api-service
```

### Docker Compose部署

```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - '3000:3000'
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/yyc3
      - REDIS_HOST=redis
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: yyc3_catering
      POSTGRES_USER: yyc3_user
      POSTGRES_PASSWORD: yyc3_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

## 📊 监控

### 应用指标

- 响应时间监控
- 错误率统计
- 请求量统计
- 数据库连接池状态

### 日志级别

- `error`: 错误信息
- `warn`: 警告信息
- `info`: 一般信息
- `debug`: 调试信息

## 🤝 贡献

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

- **项目维护者**: YYC³团队
- **邮箱**: admin@0379.email
- **文档**: https://docs.0379.love
- **问题反馈**: https://github.com/yyc3/catering-platform/issues

---

**YYC³餐饮平台** - 智能化餐饮管理解决方案 🍽️
