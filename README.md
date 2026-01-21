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
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org)
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
- **npm**：9.0+ 或 **pnpm**：8.0+ (推荐)
- **PostgreSQL**：13+
- **Redis**：6.0+
- **Git**：2.30+

### 安装运行

```bash
# 克隆项目
git clone https://github.com/YYC-Cube/yyc3-catering-platform.git
cd yyc3-catering-platform

# 安装依赖（推荐使用pnpm）
cd ui
pnpm install

# 或使用npm
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入必要的配置

# 启动开发服务器
pnpm run dev

# 或使用npm
npm run dev
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

### 前端技术栈

- **框架**：React 18+ + TypeScript 5.3+
- **构建工具**：Vite 5.4+
- **UI组件库**：自定义组件系统（YUButton、YUTable、YUAvatar等）
- **状态管理**：React Hooks + Context API
- **路由**：React Router 6+
- **样式方案**：CSS Modules + Tailwind CSS（可选）
- **图表库**：ECharts 5.4+
- **测试框架**：Vitest + @testing-library/react + @testing-library/jest-dom
- **开发工具**：ESLint + Prettier + TypeScript

### 后端技术栈

- **运行时**：Node.js 18+ + Bun 1.0+
- **框架**：Express.js 4.18 + Hono 4.0 + TypeScript
- **数据库**：PostgreSQL 13+ + Redis 6.0+
- **消息队列**：Kafka
- **缓存**：Redis (分布式缓存 + 会话管理)
- **认证**：JWT + bcryptjs
- **API文档**：Swagger/OpenAPI
- **文档知识库**：Hono + Bun + Zod + UUID

### AI技术栈

- **大语言模型**：OpenAI GPT + Anthropic Claude + 本地AI模型
- **智能代理**：AgenticCore + GoalManager + ActionPlanner
- **多模态**：文本 + 语音 + 图像 + 视频
- **机器学习**：TensorFlow.js + 预测分析 + 推荐算法

### DevOps技术栈

- **容器化**：Docker + Docker Compose
- **编排**：Kubernetes (规划中)
- **CI/CD**：GitHub Actions / GitLab CI (规划中)
- **监控**：Prometheus + Grafana (规划中)
- **日志**：ELK Stack (规划中)

---

## 📁 项目结构

```
yyc3-catering-platform/
├── ui/                            # React前端应用
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/        # 核心UI组件
│   │   │   │   ├── YUButton.tsx   # 按钮组件
│   │   │   │   ├── YUTable.tsx    # 表格组件
│   │   │   │   ├── YUAvatar.tsx   # 头像组件
│   │   │   │   ├── YUInput.tsx    # 输入框组件
│   │   │   │   └── ...            # 其他组件
│   │   │   ├── demos/             # 业务演示页面
│   │   │   │   ├── DemoIndex.tsx  # 演示中心
│   │   │   │   ├── OrderManagementDemo.tsx  # 订单管理演示
│   │   │   │   └── MenuManagementDemo.tsx    # 菜单管理演示
│   │   │   ├── CustomerMenuPage.tsx  # 顾客菜单页面
│   │   │   └── ComponentShowcase.tsx  # 组件展示页面
│   │   ├── styles/                # 全局样式
│   │   ├── types/                 # TypeScript类型定义
│   │   └── __tests__/             # 测试文件
│   │       └── components/        # 组件测试
│   ├── public/                    # 静态资源
│   ├── package.json               # 前端依赖配置
│   ├── vite.config.ts             # Vite配置
│   ├── vitest.config.ts           # Vitest测试配置
│   └── vitest.setup.ts            # 测试环境设置
├── backend/                       # 后端服务目录
│   ├── api-gateway/              # API网关服务
│   ├── services/                 # 微服务集群
│   │   ├── ai-assistant/         # AI助手服务
│   │   ├── smart-kitchen/        # 智慧后厨服务
│   │   ├── o2o-system/           # O2O系统服务
│   │   ├── chain-ops/            # 连锁运营服务
│   │   ├── food-safety/          # 食品安全服务
│   │   └── knowledge-base/        # 文档知识库服务
│   ├── libs/                     # 共享库目录
│   │   ├── key-management/       # 密钥管理库
│   │   ├── logger/               # 日志系统库
│   │   └── rabbitmq/             # 消息队列库
│   └── database/                 # 数据库管理
├── agentic-core/                  # 智能代理核心
│   ├── src/
│   │   ├── models/               # AI模型目录
│   │   ├── systems/              # 智能系统目录
│   │   └── utils/                # 工具函数目录
├── docs/                          # 文档目录
│   ├── YYC3-CP-设计文档/         # 设计文档
│   │   ├── UI设计与业务功能融合可视化展示.md
│   │   └── UI交互体验演示文档.md
│   ├── api/                       # API文档目录
│   ├── YYC3-Cater-Platform-文档闭环/  # 项目文档
│   └── 智枢服务化平台/            # 服务化平台文档
├── tests/                         # 测试目录
│   ├── api/                       # API测试目录
│   └── e2e/                       # 端到端测试目录
├── docker-compose.yaml            # Docker编排文件
├── package.json                   # 项目配置文件
├── tsconfig.json                  # TypeScript配置文件
└── README.md                      # 项目说明文件
```

---

## 📊 项目状态

### 整体完成度：95%

| 模块 | 完成度 | 状态 |
|------|--------|------|
| **前端应用** | 95% | ✅ 核心功能完整 |
| **后端服务** | 100% | ✅ 核心架构完整 |
| **AI集成** | 100% | ✅ 多模型支持 |
| **数据库** | 100% | ✅ 企业级架构 |
| **测试框架** | 100% | ✅ 测试环境完整 |
| **部署配置** | 0% | ❌ 待开发 |

### 已完成核心组件

#### 前端组件（React + TypeScript）

- ✅ **核心UI组件**：YUButton、YUTable、YUAvatar、YUInput、YUSelect、YUTag、YUBadge等
- ✅ **业务演示页面**：订单管理演示、菜单管理演示、演示中心
- ✅ **测试覆盖**：45个测试用例全部通过（YUButton 18个、YUTable 27个）
- ✅ **主题系统**：模块化主题配色（海洋蓝、紫罗兰、翡翠绿、珊瑚橙等）
- ✅ **响应式设计**：移动端、平板、桌面端适配
- ✅ **交互体验**：加载状态、悬停效果、过渡动画

#### 后端组件（32个TypeScript文件）

- ✅ API网关：认证、授权、限流、日志、多租户
- ✅ 智能代理核心：AgenticCore、GoalManager、ActionPlanner
- ✅ 微服务集群：AI助手、智慧后厨、O2O系统、连锁运营、食品安全、文档知识库
- ✅ 数据库迁移：50+核心表结构

### 待完善功能

#### 🔴 高优先级 (立即处理)

1. **Docker部署配置** - 创建Dockerfile + docker-compose.yml
2. **业务页面开发** - 基于演示页面开发实际业务功能
3. **API集成** - 前后端API对接

#### 🟠 中优先级 (1个月内)

1. **监控系统** - 集成Prometheus + Grafana
2. **性能优化** - 数据库优化 + 缓存策略
3. **安全防护** - 安全中间件 + 防护措施

#### 🟡 低优先级 (2-3个月)

1. **文档完善** - API文档 + 用户手册
2. **国际化支持** - 多语言支持 + 本地化

---

## 🚀 部署指南

### 开发环境部署

```bash
# 1. 克隆项目
git clone https://github.com/YYC-Cube/yyc3-catering-platform.git
cd yyc3-catering-platform

# 2. 安装前端依赖
cd ui
pnpm install

# 3. 配置环境变量
cp .env.example .env
vim .env

# 4. 启动前端开发服务器
pnpm run dev

# 5. 运行测试
pnpm run test
```

### 生产环境部署

```bash
# 1. 构建生产版本
cd ui
pnpm run build

# 2. 使用Docker部署
docker-compose -f docker-compose.prod.yml up -d

# 3. 检查服务状态
docker-compose ps

# 4. 查看日志
docker-compose logs -f
```

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

### 设计文档

- [UI设计与业务功能融合可视化展示](./docs/YYC3-CP-设计文档/UI设计与业务功能融合可视化展示.md) - 业务模块架构、组件映射、页面布局示例
- [UI交互体验演示文档](./docs/YYC3-CP-设计文档/UI交互体验演示文档.md) - 交互状态、动画效果、响应式设计、可访问性

### 项目文档

- [架构设计文档](./docs/YYC3-Cater-Platform-文档闭环/)
- [API接口文档](./docs/api/)
- [智枢服务化平台](./docs/智枢服务化平台/)
- [数据库设计文档](./docs/数据库设计文档.md)
- [文档索引](./docs/文档索引.md)

### 开发文档

- [开发规范](./.trae/rules/)
- [代码规范](./.eslintrc.js)
- [提交规范](./CONTRIBUTING.md)
- [更新日志](./CHANGELOG.md)

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
