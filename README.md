<div align="center">

<img src="pulibc/yyc3-article-cover-3.png" alt="YYC³ 餐饮行业智能化平台" width="100%">

</div>

---

# 🚀 YYC³ - 餐饮行业智能化平台

<div align="center">

**YYC³（YanYu Cloud Cube）**
**标语**：万象归元于云枢 | 深栈智启新纪元
***英文***：*All Realms Converge at Cloud Nexus, DeepStack Ignites a New Era*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)](https://www.typescriptlang.org)
[![Vue](https://img.shields.io/badge/Vue-3.4+-42b883.svg)](https://vuejs.org)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18+-brightgreen.svg)](https://nodejs.org)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![GitHub Stars](https://img.shields.io/github/stars/YYC-Cube/yyc3-catering-platform?style=social)](https://github.com/YYC-Cube/yyc3-catering-platform)
[![GitHub Forks](https://img.shields.io/github/forks/YYC-Cube/yyc3-catering-platform?style=social)](https://github.com/YYC-Cube/yyc3-catering-platform/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/YYC-Cube/yyc3-catering-platform)](https://github.com/YYC-Cube/yyc3-catering-platform/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/YYC-Cube/yyc3-catering-platform)](https://github.com/YYC-Cube/yyc3-catering-platform/pulls)
[![Code Size](https://img.shields.io/github/languages/code-size/YYC-Cube/yyc3-catering-platform)](https://github.com/YYC-Cube/yyc3-catering-platform)
[![Contributors](https://img.shields.io/github/contributors/YYC-Cube/yyc3-catering-platform)](https://github.com/YYC-Cube/yyc3-catering-platform/graphs/contributors)
[![Last Commit](https://img.shields.io/github/last-commit/YYC-Cube/yyc3-catering-platform)](https://github.com/YYC-Cube/yyc3-catering-platform/commits/main)
[![Release](https://img.shields.io/github/release-date/YYC-Cube/yyc3-catering-platform)](https://github.com/YYC-Cube/yyc3-catering-platform/releases)

---

**项目描述**：基于多智能体协同架构和多模态AI交互的现代化餐饮管理系统，提供从前端顾客服务到后端运营管理的全栈智能化解决方案

[快速开始](#-快速开始) • [功能特色](#-功能特色) • [文档](#-文档) • [贡献](#-贡献指南)

</div>

---

## 📋 目录

- [🎯 项目概述](#-项目概述)
- [⚡ 快速开始](#-快速开始)
- [🚀 功能特色](#-功能特色)
- [🛠️ 技术栈](#️-技术栈)
- [📁 项目结构](#-项目结构)
- [📊 项目状态](#-项目状态)
- [🚀 部署指南](#-部署指南)
- [📖 文档](#-文档)
- [🤝 贡献指南](#-贡献指南)
- [📄 开源协议](#-开源协议)

---

## 🎯 项目概述

### 项目背景

YYC³餐饮行业智能化平台是一个面向现代餐饮企业的全栈智能化管理系统，采用**多智能体协同架构**和**多模态AI交互**技术，深度融合人工智能、大数据分析和微服务架构，为餐饮企业提供从前端顾客服务到后端运营管理的完整解决方案。

### 项目目标

- 🤖 **AI驱动**：通过多智能体协同和多模态交互，实现智能化运营决策
- 🏗️ **现代架构**：采用微服务架构，支持高可用、高性能、高扩展
- 📊 **数据智能**：基于AI的预测分析、智能推荐和自动决策
- 🎨 **优秀体验**：提供现代化、响应式、易用的用户界面
- 🔧 **企业级**：满足企业级安全性、可靠性和可维护性要求

### 核心价值

- 🚀 **高效开发**：标准化架构和组件，加速业务功能开发
- 🤖 **智能助手**：24小时AI智能客服，提升用户体验
- 🔄 **自动化流程**：智能订单处理、厨房调度、库存管理
- 📱 **多端支持**：管理后台、员工端、顾客端统一管理

---

## ⚡ 快速开始

### 环境要求

- **Node.js**：18+
- **TypeScript**：5.0+
- **pnpm**：9.0+ (推荐，CI 使用) / **npm**：9.0+
- **Bun**：1.0+ (api-service 运行时)
- **PostgreSQL**：13+ (api-service) 与 **MySQL**：8+ (其余服务，见各服务 package.json)
- **Redis**：6.0+
- **Docker** + **Docker Compose**（本地基础设施栈）
- **Helm**：3.9+（K8s 部署）
- **Git**：2.30+

> ⚠️ 本仓库为 **pnpm 单仓多包** 结构，详细架构与约定见 `AGENTS.md`，改进路线见 `PLAN.md`。

### 安装运行

```bash
# 克隆项目
git clone https://github.com/YYC-Cube/yyc3-catering-platform.git
cd yyc3-catering-platform

# 安装依赖（必须使用 pnpm，postinstall 会执行 scripts/setup-env.js）
pnpm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入必要的配置

# 启动开发服务器（管理后台 + api-service 并发）
pnpm run dev

# 或分别启动各端
pnpm run dev:admin      # 管理后台
pnpm run dev:customer   # 顾客端
pnpm run dev:staff      # 员工端
pnpm run dev:backend    # api-service

# 启动本地基础设施（MySQL/Redis/Kafka/RabbitMQ/Consul/Nacos/ELK/Prometheus/Grafana）
pnpm run docker:up
```

### 访问应用

- **UI演示页面**：<http://localhost:5173>
- **组件演示**：<http://localhost:5173/demos>
- **API文档**：<http://localhost:3000/api-docs>
- **健康检查**：<http://localhost:3000/health>

---

## 🚀 功能特色

### 📊 数据可视化

- **实时数据看板**：销售额、订单数、客流量、转化率等关键指标
- **交互式图表**：ECharts图表库，支持多种图表类型
- **数据筛选**：今日/本周/本月/本年多维度数据筛选
- **趋势分析**：KPI指标 + 趋势分析 + 预测模型

### 👥 用户管理

- **JWT认证**：无状态认证 + 刷新机制 + 会话管理
- **权限控制**：RBAC角色权限 + 多租户数据隔离
- **会员系统**：等级管理 + 积分系统 + 会员权益
- **消息通知**：系统消息 + 业务通知 + 实时推送

### 🛒 订单管理

- **智能订单处理**：订单创建 + 状态管理 + 支付集成
- **AI菜品推荐**：个性化推荐 + 健康建议 + 智能搭配
- **订单预测**：AI预测销量 + 库存优化 + 供应链管理
- **异常处理**：异常订单检测 + 自动提醒 + 智能分配

### 🍽️ 菜单管理

- **菜品CRUD**：创建 + 编辑 + 删除 + 查询
- **分类管理**：多级分类 + 排序 + 状态管理
- **价格策略**：动态定价 + 促销活动 + 折扣管理
- **库存管理**：库存预警 + 自动补货 + 跨店调配

### 🏪 连锁管理

- **多店运营**：门店管理 + 标准化流程 + 统一管理
- **供应链管理**：供应商管理 + 自动采购 + 成本优化
- **数据统计**：跨店数据 + 对比分析 + 统一报表
- **质量控制**：食材安全 + 质量追溯 + 合规管理

### 🛡️ 食品安全

- **追溯系统**：食材溯源 + 生产追溯 + 销售追溯
- **安全监控**：定期检查 + 风险预警 + 合规管理
- **召回管理**：问题食材 + 自动召回 + 影响评估
- **报告生成**：安全报告 + 数据分析 + 改进建议

### 🤖 AI智能助手

- **多模态交互**：文本对话 + 语音交互 + 图像识别 + 视频分析
- **智能客服**：24小时客服 + 问题解答 + 业务咨询
- **经营分析**：AI分析 + 决策建议 + 趋势预测
- **预测模型**：销售预测 + 库存优化 + 需求分析

### 📚 文档知识库

- **智能文档管理**：多格式支持 + 版本控制 + 分类归档
- **AI智能问答**：语义理解 + 智能检索 + 答案生成
- **知识图谱**：自动构建 + 智能推荐 + 可视化展示
- **质量监控**：质量评分 + 改进建议 + 合规检查
- **协作编辑**：实时协作 + 评论反馈 + 权限管理

---

## 🛠️ 技术栈

### 前端技术栈（frontend/apps/）

- **框架**：Vue 3.4 + `<script setup lang="ts">` + TypeScript 5.3+
- **构建工具**：Vite 5.4+
- **UI 组件库**：Element Plus + @element-plus/icons-vue + radix-vue + lucide-vue-next
- **状态管理**：Pinia
- **路由**：Vue Router 4
- **样式方案**：SCSS + Tailwind CSS 4 + CSS 设计令牌（`--color-primary` 等）
- **图表库**：ECharts 5.4（vue-echarts）+ Recharts
- **多语言**：内建 i18n（zh-CN / en-US / ja-JP）
- **测试框架**：Vitest + @vue/test-utils + @testing-library/vue（单测） / Playwright（E2E）
- **开发工具**：ESLint + Prettier + TypeScript（严格模式）

### 后端技术栈（backend/services/）

- **运行时**：Node.js 18+（Express 服务）+ Bun 1.0+（api-service）
- **框架**：Express.js + sequelize-typescript（多数服务） / Bun 原生 HTTP（api-service）
- **数据库**：MySQL 8（user/order/payment/menu 等，via sequelize-typescript）+ PostgreSQL（api-service）
- **消息队列**：Kafka + RabbitMQ（通知服务）
- **缓存**：Redis（分布式缓存 + 会话 + 限流）
- **服务发现**：Consul + Nacos
- **认证**：JWT（jose / jsonwebtoken）+ bcryptjs
- **日志**：Winston（结构化日志，中文输出）
- **API 网关**：Express + http-proxy-middleware（反向代理 + 鉴权 + 限流）

### AI技术栈

- **大语言模型**：OpenAI GPT + Anthropic Claude + 本地AI模型
- **智能代理**：AgenticCore + GoalManager + ActionPlanner
- **多模态**：文本 + 语音 + 图像 + 视频
- **机器学习**：TensorFlow.js + 预测分析 + 推荐算法

### DevOps 技术栈

- **容器化**：Docker + Docker Compose（含 MySQL/Redis/Kafka/RabbitMQ/Consul/Nacos/ELK/Prometheus/Grafana）
- **编排**：Kubernetes + Helm（`helm/` 伞形图表 + `infra/phase1/iac/helm/charts/` 各服务子图表）
- **多云 IaC**：Terraform（AWS / 阿里云 / 腾讯云）+ 各云 K8s 清单（EKS / ACK / TKE）
- **CI/CD**：GitHub Actions（`ci-cd.yml` 主流水线 + `gateway-ci.yml` 网关流水线 + `codeql.yml` 安全分析）
- **监控**：Prometheus + Grafana（已配置）
- **日志**：ELK Stack（Elasticsearch + Logstash + Kibana）

---

## 📁 项目结构

```
yyc3-catering-platform/                # pnpm 单仓多包
├── frontend/apps/                      # 前端工作区
│   ├── admin-dashboard/                # @yyc3/admin-dashboard 管理后台（Element Plus + Pinia + ECharts）
│   ├── customer-app/                   # 顾客端
│   └── staff-app/                      # 员工端
├── backend/
│   ├── services/                       # 微服务集群（pnpm workspace）
│   │   ├── api-gateway/                # Express 反向代理网关 (port 3200)
│   │   ├── api-service/                # Bun + PostgreSQL 核心 API
│   │   ├── user-service/               # Express + MySQL (port 3201)
│   │   ├── order-service/              # (port 3203)
│   │   ├── payment-service/            # (port 3204)
│   │   ├── notification-service/       # RabbitMQ (port 3205)
│   │   ├── menu-service/
│   │   ├── analytics-service/          # (port 3303)
│   │   ├── smart-kitchen/              # 自带 docker-compose + Prometheus + Mosquitto
│   │   ├── smart-ops-service/
│   │   ├── ai-assistant/
│   │   ├── service-registry/           # Consul 服务发现
│   │   ├── redis-cache/
│   │   ├── delivery-service / chain-operation / food-safety / o2o-system
│   │   └── microservice-template/      # 📌 新微服务脚手架（规范基准）
│   ├── shared/                         # @yyc3/shared-types (ApiResponse / Auth)
│   ├── common/                         # @yyc3/common (Logger / EventBus / Communication)
│   └── monitoring/
├── agentic-core/                       # AI 代理框架（独立 workspace 包）
├── types/                              # @yyc3/types 共享 .d.ts 实体定义
├── helm/                               # 根 Helm 图表 (yyc3-catering-platform)
├── infra/phase1/                       # 多云 IaC：Terraform + K8s 清单 + 各服务 Helm 子图表
├── prometheus/  grafana/              # 监控配置
├── docker-compose.yaml                 # 本地基础设施栈
├── tests/                              # 顶层集成 / API 测试
├── docs/                               # 文档（多为中文 .md：规划/运维/设计）
├── scripts/                            # setup-env.js / 安全修复脚本
├── AGENTS.md                           # 🤖 AI 代理工作指南
├── PLAN.md                             # 📋 完善推进方案（本文档）
├── package.json  pnpm-workspace.yaml   # workspace 与脚本入口
└── tsconfig.json                       # 严格模式根配置
```

> 各服务端口映射、命名规范、响应信封等约定详见 `AGENTS.md`。

---

## 📊 项目状态

### 模块完成度

| 模块 | 完成度 | 状态 |
|------|--------|------|
| **前端应用（admin/customer/staff）** | ~85% | ✅ Vue 3 核心功能完整 |
| **后端微服务** | ~70% | ⚠️ 核心服务完整，4 个 stub 服务待实现（见 PLAN.md D4） |
| **AI 集成** | ~80% | ✅ 多模型适配器 + agentic-core |
| **数据库** | ~80% | ✅ MySQL + PostgreSQL 双栈 |
| **测试框架** | ~60% | ⚠️ 核心 service 有单测，stub 服务缺失 |
| **部署配置** | ~75% | ✅ Helm + 多云 IaC 已就绪（12 服务缺 Dockerfile，见 PLAN.md D6） |

### 已完成核心组件

#### 前端（Vue 3 + TypeScript）

- ✅ 管理后台：Element Plus + Pinia + vue-router，含侧边栏/头部/通知/主题色系统
- ✅ 业务视图：订单、客户、菜单、连锁、数据看板、客户生命周期等
- ✅ AI 子系统：`src/lib/ai-widget`（AutonomousAIEngine / MemorySystem / ToolRegistry / 模型适配器）
- ✅ 图表组件：ECharts 封装（营收、客流、订单状态、Top 菜品）
- ✅ 国际化：zh-CN / en-US / ja-JP

#### 后端（Node/Express + Bun）

- ✅ API 网关：http-proxy-middleware 反向代理 + 鉴权 + 限流 + 服务路由
- ✅ 微服务集群：user / order / payment / menu / notification / analytics / smart-kitchen / smart-ops 等
- ✅ 共享层：`backend/shared`（类型）+ `backend/common`（Logger / EventBus / Communication）
- ✅ 数据模型：sequelize-typescript + UUID 主键 + snake_case 列

### 待完善功能（详见 PLAN.md）

- 🔴 **stub 服务实现**：o2o-system / chain-operation / food-safety / delivery-service
- 🔴 **凭据治理**：docker-compose 硬编码弱口令改环境变量注入（D5）
- 🟠 **Dockerfile 补齐**：12 个服务尚无容器化定义（D6）
- 🟠 **测试覆盖**：stub 服务补 tsconfig + 单测骨架（D4）
- 🟡 **三 gateway 目录归并**：backend/gateway / backend/api-gateway / backend/services/api-gateway（D6）

---

## 🚀 部署指南

### 开发环境部署

```bash
# 1. 克隆项目
git clone https://github.com/YYC-Cube/yyc3-catering-platform.git
cd yyc3-catering-platform

# 2. 安装依赖（必须使用 pnpm）
pnpm install

# 3. 配置环境变量
cp .env.example .env
vim .env

# 4. 启动本地基础设施（可选，需 Docker）
pnpm run docker:up     # MySQL/Redis/Kafka/RabbitMQ/Consul/Nacos/ELK/Prometheus/Grafana

# 5. 启动开发服务器
pnpm run dev           # 管理后台 + api-service

# 6. 运行测试
pnpm run test          # unit + integration
pnpm run test:e2e      # Playwright（admin-dashboard）
```

### 生产环境部署（Helm / Kubernetes）

```bash
# 1. 构建前后端产物
pnpm run build         # build:frontend && build:backend

# 2. 使用 Helm 部署到 K8s
pnpm run deploy:dev    # 开发环境：namespace=yyc3-dev
pnpm run deploy:prod   # 生产环境：namespace=yyc3-prod（3 副本 + HPA）

# 3. 数据库迁移（CI 中自动执行，本地可手动）
pnpm run db:migrate

# 4. 检查服务状态
kubectl get pods -n yyc3-prod
```

> 多云（AWS EKS / 阿里云 ACK / 腾讯云 TKE）IaC 配置位于 `infra/phase1/iac/`。

### 文档知识库服务部署

```bash
# 启动文档知识库服务
cd backend/services/knowledge-base
bun install
bun run dev

# 访问文档知识库API
curl http://localhost:3001/api/knowledge-base/health
```

---

## 📖 文档

### 开发者必读

- **[AGENTS.md](./AGENTS.md)** — 🤖 AI 代理 / 开发者工作指南：命令、架构、约定、陷阱（最全的工作参考）
- **[PLAN.md](./PLAN.md)** — 📋 全局多维度完善推进方案：7 大维度现状与路线图
- [贡献指南](./CONTRIBUTING.md) — 环境、规范、提交流程
- [更新日志](./CHANGELOG.md)

### 设计与项目文档

- [架构设计文档](./docs/YYC3-Cater-Platform-文档闭环/)
- [API接口文档](./docs/api/)
- [智枢服务化平台](./docs/智枢服务化平台/)
- [数据库设计文档](./docs/数据库设计文档.md)
- [文档索引](./docs/文档索引.md)
- [代码规范](./.eslintrc.cjs) · [Prettier 配置](./.prettierrc.js)

---

## 🤝 贡献指南

### 代码贡献

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: 添加某个功能'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

### 提交规范

我们遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建或辅助工具变动

### 问题反馈

如果您发现任何问题或有改进建议，请：

1. 搜索现有的 [Issues](https://github.com/YYC-Cube/yyc3-catering-platform/issues)
2. 创建新的 Issue，详细描述问题或建议
3. 提供复现步骤和环境信息

---

## 📄 开源协议

本项目采用 [MIT License](./LICENSE) 开源协议。

---

<div align="center">

**联系我们**：<admin@0379.email>
**官方网站**：<https://yyc3.com>
**GitHub**：<https://github.com/YYC-Cube>

Made with ❤️ by YYC³ Team

**让我们一起构建更智能的餐饮未来！** 🚀

</div>

---

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」
