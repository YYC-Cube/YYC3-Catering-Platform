# 🚀 YYC³ 文档知识库系统

<div align="center">

**YYC³（YanYu Cloud Cube）**
**标语**：万象归元于云枢 | 深栈智启新纪元
**_英文_**：_All Realms Converge at Cloud Nexus, DeepStack Ignites a New Era_

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org)
[![Bun](https://img.shields.io/badge/Bun-1.0+-black.svg)](https://bun.sh)
[![Hono](https://img.shields.io/badge/Hono-4.0+-orange.svg)](https://hono.dev)

---

**项目描述**：智能化文档管理和知识共享平台，基于YYC³「五高五标五化」核心理念构建

[快速开始](#-快速开始) • [功能特色](#-功能特色) • [API文档](#-api文档) • [架构设计](#-架构设计)

</div>

---

## 📋 目录

- [🎯 项目概述](#-项目概述)
- [⚡ 快速开始](#-快速开始)
- [🚀 功能特色](#-功能特色)
- [🛠️ 技术栈](#️-技术栈)
- [📁 项目结构](#-项目结构)
- [🔌 API文档](#-api文档)
- [🏗️ 架构设计](#️-架构设计)
- [📖 开发指南](#-开发指南)
- [🚀 部署指南](#-部署指南)
- [🤝 贡献指南](#-贡献指南)
- [📄 开源协议](#-开源协议)

---

## 🎯 项目概述

### 项目背景

YYC³ 文档知识库系统是第四阶段的核心成果，基于第三阶段的知识图谱、质量评估、智能推荐等成果，构建一个智能化、可扩展、高性能的文档管理和知识共享平台。

### 项目目标

- 🎯 **智能化管理**：基于AI的文档分类、质量评估和智能推荐
- 🎯 **高效检索**：支持关键词、语义和混合搜索
- 🎯 **知识图谱**：可视化的文档关系和概念网络
- 🎯 **质量监控**：自动化的文档质量评估和持续监控
- 🎯 **版本控制**：基于Git的文档版本管理
- 🎯 **协作编辑**：支持多人协作编辑和审核流程

### 核心价值

- 🚀 **高效开发**：标准化的文档模板和自动生成工具
- 🤖 **智能助手**：AI驱动的智能推荐和问答系统
- 🔄 **自动化流程**：自动化的索引、分类和质量监控
- 📱 **多端支持**：支持Web、移动端和API集成
- 📊 **数据分析**：文档使用分析和质量趋势监控

---

## ⚡ 快速开始

### 环境要求

- **Bun**：1.0.0+
- **TypeScript**：5.0+
- **Node.js**：18.0+ (可选)
- **Git**：2.30+

### 安装运行

```bash
# 1. 克隆项目
git clone https://github.com/YYC-Cube/yyc3-document-knowledge-base.git
cd yyc3-document-knowledge-base

# 2. 安装依赖
bun install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入必要的配置

# 4. 启动开发服务器
bun run dev

# 5. 访问应用
# 健康检查：http://localhost:3280/health
# API文档：http://localhost:3280/api
```

### 构建生产版本

```bash
# 构建项目
bun run build

# 启动生产服务器
bun run start
```

---

## 🚀 功能特色

### 核心功能

#### 1. 文档管理

- ✅ 文档CRUD操作
- ✅ 版本管理和历史记录
- ✅ 文档分类和标签
- ✅ 批量导入和导出
- ✅ 文档模板和自动生成

#### 2. 智能检索

- ✅ 关键词搜索
- ✅ 语义搜索
- ✅ 混合搜索
- ✅ 搜索结果高亮
- ✅ 相关文档推荐

#### 3. 知识图谱

- ✅ 文档关系可视化
- ✅ 概念网络展示
- ✅ 节点详情查看
- ✅ 路径查找和推荐
- ✅ 图谱统计分析

#### 4. 质量监控

- ✅ 多维度质量评估
- ✅ 自动化质量检查
- ✅ 质量趋势分析
- ✅ 质量预警机制
- ✅ 改进建议生成

#### 5. 使用分析

- ✅ 文档浏览统计
- ✅ 用户行为分析
- ✅ 热门文档排行
- ✅ 搜索词分析
- ✅ 使用报告生成

#### 6. 协作编辑

- ✅ 多人实时编辑
- ✅ 编辑历史记录
- ✅ 评论和讨论
- ✅ 审核流程管理
- ✅ 权限控制

---

## 🛠️ 技术栈

### 前端技术

- **框架**：React 18+ / Vue 3+
- **语言**：TypeScript 5.0+
- **UI库**：Ant Design / Material-UI
- **可视化**：D3.js / Cytoscape.js
- **编辑器**：Monaco Editor

### 后端技术

- **运行时**：Bun 1.0+
- **框架**：Hono 4.0+
- **语言**：TypeScript 5.0+
- **验证**：Zod 3.22+
- **认证**：JWT

### 数据存储

- **文档存储**：Markdown文件
- **图数据库**：NetworkX / Neo4j
- **关系数据库**：PostgreSQL (可选)
- **缓存**：Redis (可选)
- **搜索引擎**：Elasticsearch (可选)

### 开发工具

- **包管理**：Bun
- **构建工具**：Bun Build
- **代码规范**：ESLint + Prettier
- **类型检查**：TypeScript
- **测试框架**：Bun Test

---

## 📁 项目结构

```
YYC3-文档知识库核心代码/
├── app.ts                          # 主应用入口
├── package.json                    # 项目配置
├── tsconfig.json                   # TypeScript配置
├── .env.example                    # 环境变量示例
├── .gitignore                      # Git忽略配置
│
├── services/                       # 业务服务层
│   ├── document-service.ts         # 文档管理服务
│   ├── quality-assessment.service.ts  # 质量评估服务
│   ├── quality-monitor-service.ts  # 质量监控服务
│   ├── search-service.ts           # 搜索服务
│   ├── knowledge-graph-service.ts  # 知识图谱服务
│   └── recommendation-service.ts   # 推荐服务
│
├── repositories/                   # 数据访问层
│   ├── document.repository.ts      # 文档仓库
│   ├── version.repository.ts       # 版本仓库
│   ├── quality-report.repository.ts  # 质量报告仓库
│   ├── concept.repository.ts       # 概念仓库
│   └── graph.repository.ts         # 图谱仓库
│
├── types/                          # 类型定义
│   └── document.types.ts           # 文档相关类型
│
├── api/                            # API路由
│   └── documents-api.ts            # 文档API
│
├── utils/                          # 工具函数
│   └── logger.ts                   # 日志工具
│
└── tests/                          # 测试文件
    ├── unit/                       # 单元测试
    ├── integration/                # 集成测试
    └── e2e/                        # 端到端测试
```

---

## 🔌 API文档

### 基础信息

- **Base URL**：`http://localhost:3280/api`
- **认证方式**：JWT Bearer Token
- **响应格式**：JSON

### 核心接口

#### 1. 文档管理

##### 创建文档

```http
POST /api/documents
Content-Type: application/json

{
  "title": "文档标题",
  "description": "文档描述",
  "content": "# 文档内容\n\n这里是文档正文",
  "category": "技术文档",
  "subcategory": "API文档",
  "tags": ["API", "文档"],
  "keywords": ["关键词1", "关键词2"],
  "author": "作者名"
}
```

**响应**：

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "文档标题",
    "description": "文档描述",
    "content": "# 文档内容\n\n这里是文档正文",
    "category": "技术文档",
    "subcategory": "API文档",
    "tags": ["API", "文档"],
    "keywords": ["关键词1", "关键词2"],
    "qualityScore": 85.5,
    "qualityMetrics": {
      "contentCompleteness": 90,
      "structureNormalization": 85,
      "technicalAccuracy": 88,
      "readability": 80,
      "practicality": 85
    },
    "version": "1.0.0",
    "status": "draft",
    "viewCount": 0,
    "author": "作者名",
    "createdAt": "2025-01-30T00:00:00.000Z",
    "updatedAt": "2025-01-30T00:00:00.000Z"
  }
}
```

##### 获取文档列表

```http
GET /api/documents?category=技术文档&status=published&limit=20&offset=0
```

**响应**：

```json
{
  "success": true,
  "data": [...],
  "total": 100,
  "limit": 20,
  "offset": 0
}
```

##### 获取文档详情

```http
GET /api/documents/:id
```

**响应**：

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "文档标题",
    ...
  }
}
```

##### 更新文档

```http
PUT /api/documents/:id
Content-Type: application/json

{
  "title": "新标题",
  "content": "新内容"
}
```

##### 删除文档

```http
DELETE /api/documents/:id
```

#### 2. 搜索功能

##### 关键词搜索

```http
GET /api/documents/search?q=API&type=keyword&limit=20
```

##### 语义搜索

```http
GET /api/documents/search?q=如何使用API&type=semantic&limit=20
```

##### 混合搜索

```http
GET /api/documents/search?q=API文档&type=hybrid&limit=20
```

#### 3. 质量评估

##### 获取质量报告

```http
GET /api/documents/:id/quality
```

**响应**：

```json
{
  "success": true,
  "data": {
    "overallScore": 85.5,
    "metrics": {
      "contentCompleteness": 90,
      "structureNormalization": 85,
      "technicalAccuracy": 88,
      "readability": 80,
      "practicality": 85
    },
    "issues": [
      {
        "type": "warning",
        "category": "content",
        "message": "文档内容不够完整",
        "suggestion": "建议添加更多章节和示例"
      }
    ],
    "suggestions": ["建议添加更多章节和示例", "建议定期更新文档内容"]
  }
}
```

#### 4. 统计信息

##### 获取文档统计

```http
GET /api/documents/statistics
```

**响应**：

```json
{
  "success": true,
  "data": {
    "total": 100,
    "byCategory": {
      "技术文档": 50,
      "产品文档": 30,
      "用户文档": 20
    },
    "byStatus": {
      "published": 80,
      "draft": 15,
      "review": 5
    },
    "avgQualityScore": 85.5
  }
}
```

---

## 🏗️ 架构设计

### 系统架构

```
┌─────────────────────────────────────────────────────────────────────┐
│                        YYC³ 文档知识库系统                           │
└─────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
┌───────▼────────┐      ┌──────────▼────────┐      ┌─────────▼────────┐
│   前端展示层    │      │    API网关层       │      │   外部集成层      │
└───────┬────────┘      └──────────┬────────┘      └─────────┬────────┘
        │                         │                         │
        │                         │                         │
┌───────▼───────────────────────▼─────────────────────────▼────────┐
│                      业务逻辑层                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ 知识检索  │  │ 智能推荐  │  │ 质量监控  │  │ 版本管理  │         │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ 文档管理  │  │ 知识图谱  │  │ 使用分析  │  │ 协作编辑  │         │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘         │
└───────┬───────────────────────┬─────────────────────────┬────────┘
        │                       │                         │
        │                       │                         │
┌───────▼────────┐    ┌────────▼────────┐    ┌─────────▼────────┐
│   数据访问层    │    │   智能引擎层      │    │   基础服务层      │
└───────┬────────┘    └────────┬────────┘    └─────────┬────────┘
        │                     │                     │
        │                     │                     │
┌───────▼─────────────────────▼─────────────────────▼────────┐
│                      数据存储层                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ 文档存储  │  │ 图数据库  │  │ 关系数据库 │  │ 缓存系统  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└───────────────────────────────────────────────────────────────┘
```

### 数据模型

#### 文档（Document）

```typescript
interface Document {
  id: string; // 文档唯一标识
  title: string; // 文档标题
  description: string; // 文档描述
  content: string; // 文档内容（Markdown）
  category: string; // 文档分类
  subcategory: string; // 子分类
  tags: string[]; // 标签列表
  keywords: string[]; // 关键词列表
  qualityScore: number; // 质量评分（0-100）
  qualityMetrics: QualityMetrics; // 质量指标
  version: string; // 当前版本
  versions: DocumentVersion[]; // 版本历史
  status: DocumentStatus; // 文档状态
  viewCount: number; // 浏览次数
  likeCount: number; // 点赞次数
  shareCount: number; // 分享次数
  commentCount: number; // 评论次数
  references: string[]; // 引用的文档ID
  referencedBy: string[]; // 被引用的文档ID
  relatedDocuments: string[]; // 相关文档ID
  author: string; // 作者
  createdAt: Date; // 创建时间
  updatedAt: Date; // 更新时间
  concepts: string[]; // 包含的概念
}
```

#### 质量指标（QualityMetrics）

```typescript
interface QualityMetrics {
  contentCompleteness: number; // 内容完整性（0-100）
  structureNormalization: number; // 结构规范化（0-100）
  technicalAccuracy: number; // 技术准确性（0-100）
  readability: number; // 可读性（0-100）
  practicality: number; // 实用性（0-100）
}
```

---

## 📖 开发指南

### 代码规范

遵循YYC³团队开发规范：

- 使用TypeScript严格模式
- 遵循Conventional Commits提交规范
- 使用ESLint进行代码检查
- 使用Prettier进行代码格式化
- 编写单元测试和集成测试

### 提交规范

```bash
# 新功能
git commit -m "feat: 添加文档导出功能"

# 修复bug
git commit -m "fix: 修复搜索结果分页问题"

# 文档更新
git commit -m "docs: 更新API文档"

# 代码重构
git commit -m "refactor: 优化文档存储逻辑"
```

### 测试

```bash
# 运行所有测试
bun test

# 运行单元测试
bun test unit

# 运行集成测试
bun test integration

# 运行端到端测试
bun test e2e
```

---

## 🚀 部署指南

### Docker部署

```bash
# 构建镜像
docker build -t yyc3-document-knowledge-base .

# 运行容器
docker run -d \
  --name yyc3-docs \
  -p 3280:3280 \
  -v $(pwd)/data:/app/data \
  -e NODE_ENV=production \
  yyc3-document-knowledge-base
```

### Docker Compose部署

```yaml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3280:3280"
    volumes:
      - ./data:/app/data
    environment:
      - NODE_ENV=production
      - PORT=3280
    restart: unless-stopped
```

### 环境变量配置

```env
NODE_ENV=production
PORT=3280
DATA_DIR=/app/data
LOG_LEVEL=info
JWT_SECRET=your-secret-key
```

---

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 贡献流程

1. Fork本仓库
2. 创建功能分支（`git checkout -b feature/AmazingFeature`）
3. 提交更改（`git commit -m 'feat: Add some AmazingFeature'`）
4. 推送到分支（`git push origin feature/AmazingFeature`）
5. 创建Pull Request

### 代码审查

- 确保代码通过所有测试
- 遵循代码规范
- 添加必要的注释和文档
- 更新相关的文档

---

## 📄 开源协议

本项目采用 [MIT License](./LICENSE) 开源协议。

---

<div align="center">

**联系我们**：<admin@0379.email>
**官方网站**：<https://yyc3.com>
**GitHub**：<https://github.com/YYC-Cube>

Made with ❤️ by YYC³ Team

**让我们一起构建更智能的开发环境！** 🚀

</div>
