---

## 📋 文档信息

| 属性 | 内容 |
|------|------|
| **文档标题** | YYC³餐饮行业智能化平台的README |
| **文档类型** |  |
| **所属阶段** |  |
| **遵循规范** | YYC³ 团队标准化规范 v1.0.0 |
| **版本号** | v1.0.0 |
| **创建日期** | 2025-01-30 |
| **作者** | YYC³ Team |
| **更新日期** | 2025-01-30 |

---

**@file**：YYC³-README
**@description**：YYC³餐饮行业智能化平台的README
**@author**：YYC³
**@version**：v1.0.0
**@created**：2025-01-30
**@updated**：2025-01-30
**@status**：published
**@tags**：YYC³,文档

---

# ![YYC³ 智能应用](public/github.png)

# 星云操作系统 - 企业级 AI 智能管理平台

<p align="center">
  <img src="public/github.png" alt="星云操作系统 Logo" width="120" />
</p>

<p align="center">
  <strong>星云操作系统 - 企业级 AI 智能管理平台</strong><br/>
  <em>万象归元于云枢，深栈智启新纪元。</em>
</p>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16-blue?logo=next.js" alt="Next.js 16" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19.2-blue?logo=react" alt="React 19.2" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript" alt="TypeScript 5.0" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/TailwindCSS-3.3-blue?logo=tailwindcss" alt="Tailwind CSS" /></a>
  <a href="https://github.com/shadcn/ui"><img src="https://img.shields.io/badge/shadcn/ui-组件库-blueviolet" alt="shadcn/ui" /></a>
  <a href="https://github.com/YYC-Cube/yyc3-Futuristic-Dashboard"><img src="https://img.shields.io/github/stars/YYC-Cube/yyc3-Futuristic-Dashboard?style=social" alt="GitHub Stars" /></a>
</p>

<p align="center">
  <a href="https://vercel.com"><img src="https://img.shields.io/badge/部署-Vercel-black?logo=vercel" alt="Vercel" /></a>
  <a href="#"><img src="https://img.shields.io/badge/环境变量-已配置-green" alt="Env Ready" /></a>
  <a href="#"><img src="https://img.shields.io/badge/权限系统-RBAC-orange" alt="RBAC" /></a>
  <a href="#"><img src="https://img.shields.io/badge/AI引擎-已集成-brightgreen" alt="AI Engine" /></a>
  <a href="#"><img src="https://img.shields.io/badge/响应式-移动端支持-blue" alt="Responsive" /></a>
  <a href="#"><img src="https://img.shields.io/badge/语言-中文支持-red" alt="中文支持" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT License" /></a>
</p>

📦 项目特性

### 核心功能

- **AI 智能分析引擎** - 实时数据预测、异常检测和智能建议
- **多租户权限管理** - 基于 RBAC 的细粒度权限控制系统
- **高级数据可视化** - 5种专业图表组件（折线图、热力图、径向图、区域图、仪表盘）
- **实时协作通知** - 通知中心、活动流、团队在线状态
- **全平台响应式** - 完美适配桌面端和移动端
- **完整中文支持** - 所有界面和提示均为中文

🧱 技术栈

- **框架**: Next.js 16 (App Router)
- **UI 库**: React 19.2
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **组件库**: shadcn/ui
- **图标**: Lucide React
- **动画**: Framer Motion (可选)

📁 项目结构

# 智能运维控制台（Next.js + shadcn/ui）

简洁且可扩展的运维/监控控制台骨架，基于 Next.js App Router、React 组件化结构与自定义 AI/通知/权限模块。

---

## 目录总览（高层）

项目以功能分层与模块化组件组织，便于维护与逐步扩展。

```
├── app/                         # Next.js App Router 页面（页面/路由）
│   ├── layout.tsx               # 全局布局（包含 AuthProvider）
│   ├── page.tsx                 # 主页（仪表板）
│   ├── analytics/               # 数据分析页面
│   ├── communications/          # 通讯中心页面
│   ├── console/                 # 系统控制台页面
│   ├── data-center/             # 数据中心页面
│   ├── network/                 # 网络监控页面
│   ├── security/                # 安全防护页面
│   └── settings/                # 系统设置页面
├── components/                  # 可复用 UI 与业务组件
│   ├── ai-insights-panel.tsx    # AI 洞察面板
│   ├── auth/                    # 权限管理相关组件
│   │   ├── auth-context.tsx
│   │   ├── auth-guard.tsx
│   │   ├── permission-gate.tsx
│   │   ├── user-management-panel.tsx
│   │   ├── role-permissions-panel.tsx
│   │   └── tenant-selector.tsx
│   ├── charts/                  # 图表与仪表盘组件
│   │   ├── advanced-line-chart.tsx
│   │   ├── area-comparison-chart.tsx
│   │   ├── charts-dashboard.tsx
│   │   ├── heatmap-chart.tsx
│   │   ├── radial-progress-chart.tsx
│   │   └── real-time-gauge.tsx
│   ├── collaboration/           # 协作/活动流组件
│   │   ├── activity-feed.tsx
│   │   └── team-presence.tsx
│   ├── mobile/                  # 移动端专用组件
│   │   ├── mobile-bottom-nav.tsx
│   │   ├── mobile-metric-card.tsx
│   │   ├── mobile-nav.tsx
│   │   └── mobile-stats-grid.tsx
│   ├── notifications/           # 通知中心组件
│   │   └── notification-center.tsx
│   └── ui/                      # 基于 shadcn/ui 的基础组件封装
├── lib/                         # 业务逻辑、工具库与服务封装
│   ├── ai-engine.ts             # AI 分析引擎（抽象/适配）
│   ├── auth/                    # 权限逻辑实现
│   │   ├── types.ts
│   │   ├── permissions.ts
│   │   └── auth-context.tsx
│   ├── chart-data-generator.ts  # 图表数据生成/模拟器
│   ├── notifications/           # 通知系统实现
│   │   ├── notification-types.ts
│   │   └── notification-manager.ts
│   └── utils.ts                 # 通用工具函数
├── hooks/                       # 复用 Hooks
│   ├── use-ai-analysis.ts
│   ├── use-mobile.ts
│   └── use-notifications.ts
├── dashboard.tsx                # 主仪表板（可被 app/page.tsx 包裹）
└── public/                      # 静态资源（图标、图片、示例数据等）
```

---

## 关键设计原则

- 单一职责：每个组件/模块聚焦一个功能，便于测试与复用。
- 分层清晰：UI / Hooks / Lib / Pages 明确分离，降低耦合。
- 可扩展与可替换：AI、通知、权限等子系统采用适配器模式，便于替换实现（例如本地 mock → 后端服务）。
- 移动优先：提供移动专用组件目录，保证小屏可用性。

---

## 安装与启动（开发）

先确保 Node.js 与 pnpm/yarn/npm 已安装，示例以 pnpm 为例：

1. 安装依赖
   - pnpm install

2. 本地开发
   - pnpm dev
   - 打开 http://localhost:3000

3. 构建与生产
   - pnpm build
   - pnpm start

（如果使用环境变量，请在根目录创建 .env.local 并参考 .env.example）

---

## 代码约定

- 使用 TypeScript（.tsx / .ts）与 React Hooks。
- 组件命名：驼峰且以功能结尾，如 MetricsCard、AuthGuard。
- 文件组织：页面放在 app 下；纯展示组件放 components/ui；复杂业务组件放 components/ 下对应子目录。
- 样式：优先使用 Tailwind + shadcn/ui 组件封装，避免在组件内大量写内联样式。
- 测试：建议为关键逻辑（lib/ 下）和核心组件添加单元测试（Jest/Testing Library）。

---

## 权限与安全

- 全局布局 layout.tsx 包含 AuthProvider，负责在页面路由级别提供会话/权限。
- auth/ 中封装鉴权逻辑（permission checks、role mapping、multi-tenant 支持）。
- 敏感操作需要在后端校验权限；前端只做界面层次的门控（UX）。

---

## 常见开发任务

- 添加新页面：在 app/ 下新建子目录并添加 page.tsx（和可选的 layout.tsx / loading.tsx）。
- 添加可复用组件：components/<feature>/ 新建组件并在 components/ui 中复用基础 UI。
- 集成真实数据源：把 lib/<service> 的 mock 替换为 API 调用，保持接口适配层不变。

---

## 部署建议

- 使用 Vercel / Netlify 进行静态 SSR 部署（Next.js App Router 支持）。
- 后端服务（AI 引擎、通知、权限）请分别容器化并提供稳定 API。
- 为关键路由与 API 启用监控与告警（Sentry / Prometheus / Grafana）。

---

## 贡献指南

1. Fork -> 新建 feature 分支 (feat/xxx 或 fix/xxx)。
2. 提交遵循 Conventional Commits（feat/fix/docs/...）。
3. 发起 Pull Request，添加变更说明与关联 issue。
4. 运行 linter 与测试：pnpm lint && pnpm test

---

## TODO / 后续扩展建议

- 增加示例数据与 Storybook 展示组件状态。
- 为 charts 提供性能优化（虚拟化、大数据分页）。
- 引入 RBAC 管理后台页面（在 components/auth 中扩展）。
- 完善移动端体验（离线支持与 PWA）。

🔍 功能模块详解

### 1. AI 智能分析引擎

位置: `lib/ai-engine.ts`, `hooks/use-ai-analysis.ts`, `components/ai-insights-panel.tsx`

**功能:**

- 时间序列预测（移动平均算法）
- 异常检测（Z-score 统计方法）
- 趋势分析（线性回归）
- 智能建议生成

### 2. 权限管理系统

位置: `lib/auth/`, `components/auth/`

**角色层级:**

- 超级管理员 (super_admin)
- 管理员 (admin)
- 经理 (manager)
- 操作员 (operator)
- 查看者 (viewer)

**权限类型:**

- view:dashboard - 查看仪表板
- view:analytics - 查看数据分析
- view:data - 查看数据中心
- view:network - 查看网络监控
- view:security - 查看安全防护
- view:ai-insights - 查看 AI 洞察
- manage:users - 管理用户
- manage:roles - 管理角色
- manage:settings - 管理系统设置
- manage:resources - 管理资源分配
- execute:commands - 执行系统命令
- export:data - 导出数据

**使用示例:**
\`\`\`typescript
import { useAuth } from '@/lib/auth/auth-context'
import { PermissionGate } from '@/components/auth/permission-gate'

// 在组件中使用
const { user, hasPermission } = useAuth()

// 条件渲染
{hasPermission('manage:users') && <UserManagementPanel />}

// 使用权限门控组件
<PermissionGate permission="view:analytics">
<AnalyticsContent />
</PermissionGate>
\`\`\`

### 3. 高级数据可视化

位置: `components/charts/`

**图表类型:**

- **高级折线图** - 带渐变填充的时间序列图表
- **热力图** - 24小时活动热力分析
- **径向进度图** - 多指标环形展示
- **区域对比图** - 多数据系列对比分析
- **实时仪表盘** - 动画过渡的实时指标

**使用示例:**
\`\`\`typescript
import { RealTimeGauge } from '@/components/charts/real-time-gauge'

<RealTimeGauge 
  value={cpuUsage} 
  max={100} 
  label="CPU" 
  color="cyan" 
  size="medium" 
/>
\`\`\`

### 4. 实时通知系统

位置: `lib/notifications/`, `components/notifications/`

**通知类型:**

- info - 信息通知
- success - 成功通知
- warning - 警告通知
- error - 错误通知
- system - 系统通知

**优先级:**

- low - 低优先级
- medium - 中优先级
- high - 高优先级
- urgent - 紧急

**使用示例:**
\`\`\`typescript
import { useNotifications } from '@/hooks/use-notifications'

const { notifications, addNotification, markAsRead } = useNotifications()

// 添加通知
addNotification({
title: '系统更新',
message: '新版本已准备好安装',
type: 'info',
priority: 'medium'
})
\`\`\`

### 5. 移动端适配

位置: `components/mobile/`, `hooks/use-mobile.ts`

**移动端组件:**

- MobileNav - 侧边抽屉导航
- MobileBottomNav - 底部标签栏
- MobileMetricCard - 优化的指标卡片
- MobileStatsGrid - 统计数据网格

**使用示例:**
\`\`\`typescript
import { useMobile } from '@/hooks/use-mobile'

const isMobile = useMobile()

{isMobile ? <MobileView /> : <DesktopView />}
\`\`\`

## 页面路由

| 路由              | 页面       | 权限要求         |
| ----------------- | ---------- | ---------------- |
| `/`               | 主仪表板   | view:dashboard   |
| `/analytics`      | 数据分析   | view:analytics   |
| `/data-center`    | 数据中心   | view:data        |
| `/network`        | 网络监控   | view:network     |
| `/security`       | 安全防护   | view:security    |
| `/console`        | 系统控制台 | execute:commands |
| `/communications` | 通讯中心   | 无               |
| `/settings`       | 系统设置   | manage:settings  |

## 环境变量

查看 `.env.example` 文件了解所需的环境变量配置。

## 自定义配置

### 修改主题颜色

编辑 `app/globals.css` 中的 CSS 变量:

\`\`\`css
:root {
--background: 0 0% 0%;
--foreground: 210 40% 98%;
--primary: 189 94% 43%;
--primary-foreground: 0 0% 100%;
/_ ... 更多颜色变量 _/
}
\`\`\`

### 添加新的权限

1. 在 `lib/auth/types.ts` 中添加新的权限类型
2. 在 `lib/auth/permissions.ts` 中更新角色权限映射
3. 使用 `PermissionGate` 组件保护相关 UI

🧭 页面路由

路由 页面 权限要求
/ 主仪表板 view:dashboard
/analytics 数据分析 view:analytics
/data-center 数据中心 view:data
/network 网络监控 view:network
/security 安全防护 view:security
/console 系统控制台 execute:commands
/communications 通讯中心 无
/settings 系统设置 manage:settings

🧪 性能优化

- 使用 React Server Components 减少客户端 JavaScript
- 图表组件使用 Canvas API 实现高性能渲染
- 移动端使用专用组件优化性能
- 使用 `useCallback` 和 `useMemo` 优化重渲染
- 懒加载非关键组件

🌐 浏览器支持

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

🤝 贡献指南
Fork 仓库：https://github.com/YYC-Cube/yyc3-Futuristic-Dashboard.git

创建分支

提交更改

开启 Pull Request

📜 许可证

本项目采用 MIT 许可证。

📮 技术支持

如有问题或建议，请通过以下方式联系:

提交 Issue
联系邮箱：admin@0379.email
查看项目文档

🕘 更新日志

### v1.0.0 (2025-01-25)

- 初始版本发布
- 完整的 AI 智能分析引擎
- 多租户权限管理系统
- 5种高级数据可视化组件
- 实时协作与通知系统
- 全平台响应式支持
- 完整中文本地化

---

**星云操作系统** - 打造下一代企业级智能管理平台

## 概述

### 概述

本文档提供了实用的技巧和方法，帮助开发者提高工作效率和代码质量。

#### 适用场景

- 日常开发工作
- 代码优化和重构
- 问题排查和调试
- 性能优化和调优

#### 预期收益

- 提高开发效率
- 减少代码错误
- 优化系统性能
- 提升代码可维护性

## 核心概念

### 核心概念

#### 关键术语

- **技巧**：经过实践验证的有效方法
- **最佳实践**：业界公认的优秀做法
- **模式**：可重复使用的解决方案
- **原则**：指导设计的基本准则

#### 核心原理

1. **DRY原则**（Don't Repeat Yourself）
   - 避免代码重复
   - 提取公共逻辑
   - 使用函数和类封装

2. **KISS原则**（Keep It Simple, Stupid）
   - 保持简单
   - 避免过度设计
   - 优先可读性

3. **YAGNI原则**（You Aren't Gonna Need It）
   - 只实现当前需要的功能
   - 避免过度工程
   - 保持代码精简

## 实施步骤

### 实施步骤

#### 步骤1：准备工作

```bash
# 安装必要工具
npm install -g typescript eslint prettier

# 初始化项目
npm init -y
npm install --save-dev typescript @types/node
```

#### 步骤2：配置环境

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

#### 步骤3：编写代码

```typescript
// 创建主文件
// src/index.ts
function main() {
  console.log("Hello, YYC³!");
}

main();
```

#### 步骤4：测试验证

```bash
# 运行代码
npm run dev

# 运行测试
npm test
```

## 代码示例

### 代码示例

#### 示例1：基础用法

```typescript
// 简单示例
function greet(name: string): string {
  return `Hello, ${name}!`;
}

const message = greet("YYC³");
console.log(message); // 输出: Hello, YYC³!
```

#### 示例2：高级用法

```typescript
// 异步操作
async function fetchData(url: string): Promise<any> {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// 使用示例
fetchData("https://api.example.com/data")
  .then(data => console.log(data))
  .catch(error => console.error("Error:", error));
```

#### 示例3：错误处理

```typescript
// 自定义错误类
class ValidationError extends Error {
  constructor(
    public field: string,
    message: string
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

// 使用示例
function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError("email", "邮箱格式不正确");
  }
}

try {
  validateEmail("invalid-email");
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(`验证失败: ${error.field} - ${error.message}`);
  }
}
```

## 注意事项

### 注意事项

#### 常见陷阱

1. **异步操作错误**

```typescript
// ❌ 错误：没有等待异步操作
async function processData() {
  const data = fetchData(); // 忘记await
  console.log(data); // 输出Promise对象
}

// ✅ 正确：使用await
async function processData() {
  const data = await fetchData();
  console.log(data); // 输出实际数据
}
```

2. **内存泄漏**

```typescript
// ❌ 错误：没有清理事件监听器
useEffect(() => {
  window.addEventListener("resize", handleResize);
}, []); // 缺少清理函数

// ✅ 正确：清理事件监听器
useEffect(() => {
  window.addEventListener("resize", handleResize);
  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);
```

#### 性能注意事项

1. **避免不必要的重渲染**

```typescript
// ❌ 错误：每次都创建新对象
<Component data={{ value: 1 }} />

// ✅ 正确：使用useMemo缓存
const memoizedData = useMemo(() => ({ value: 1 }), []);
<Component data={memoizedData} />
```

2. **避免大对象传递**

```typescript
// ❌ 错误：传递整个大对象
<Component user={user} />

// ✅ 正确：只传递需要的属性
<Component userName={user.name} userId={user.id} />
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

## 常见问题

### 常见问题

#### Q1: 如何处理异步错误？

**A**: 使用try-catch捕获异步错误：

```typescript
async function handleRequest() {
  try {
    const result = await fetchData();
    return result;
  } catch (error) {
    console.error("请求失败:", error);
    throw error;
  }
}
```

#### Q2: 如何优化React组件性能？

**A**: 使用以下优化技术：

1. **React.memo**：避免不必要的重渲染
2. **useMemo**：缓存计算结果
3. **useCallback**：缓存函数引用
4. **代码分割**：懒加载组件

```typescript
const MemoizedComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => processData(data), [data]);
  return <div>{processedData}</div>;
});
```

#### Q3: 如何管理应用状态？

**A**: 根据应用复杂度选择合适的状态管理方案：

1. **简单应用**：使用React Context API
2. **中等应用**：使用Zustand或Redux Toolkit
3. **复杂应用**：使用Redux + 中间件

```typescript
// Zustand示例
const useStore = create(set => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 })),
}));
```

## 案例分析

### 案例分析

#### 案例1：性能优化

**问题**：页面加载时间过长，用户体验差。

**分析**：

- 首次内容绘制(FCP)：3.2秒
- 最大内容绘制(LCP)：5.8秒
- 累积布局偏移(CLS)：0.25

**解决方案**：

1. 实现代码分割和懒加载
2. 优化图片加载（使用WebP格式，添加loading="lazy"）
3. 启用Gzip压缩
4. 使用CDN加速静态资源

**结果**：

- FCP：1.2秒（↓62.5%）
- LCP：2.1秒（↓63.8%）
- CLS：0.08（↓68%）

#### 案例2：错误处理改进

**问题**：错误信息不清晰，难以定位问题。

**分析**：

- 错误信息过于简单
- 缺少错误上下文
- 没有错误追踪

**解决方案**：

1. 实现自定义错误类
2. 添加错误堆栈追踪
3. 集成错误监控工具（Sentry）
4. 实现错误日志记录

**结果**：

- 错误定位时间减少70%
- 错误解决率提高40%
- 用户投诉减少60%

#### 案例3：代码重构

**问题**：代码重复率高，维护困难。

**分析**：

- 代码重复率：35%
- 函数平均长度：120行
- 圈复杂度：15

**解决方案**：

1. 提取公共逻辑到工具函数
2. 使用设计模式重构
3. 拆分大函数
4. 添加单元测试

**结果**：

- 代码重复率：8%（↓77%）
- 函数平均长度：35行（↓71%）
- 圈复杂度：5（↓67%）

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
