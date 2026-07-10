# YYC³餐饮行业智能化平台 - 开发指南

## 📖 目录

1. [开发环境搭建](#开发环境搭建)
2. [项目结构说明](#项目结构说明)
3. [组件开发指南](#组件开发指南)
4. [测试指南](#测试指南)
5. [部署指南](#部署指南)
6. [最佳实践](#最佳实践)

---

## 开发环境搭建

### 系统要求

- **Node.js**: v18.0.0 或更高版本
- **pnpm**: v8.0.0 或更高版本
- **Git**: v2.0.0 或更高版本
- **编辑器**: VS Code (推荐) 或其他支持TypeScript的编辑器

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/yyc3/catering-platform.git
cd catering-platform

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 开发服务器

- **前端**: http://localhost:3100
- **后端**: http://localhost:3000
- **数据库**: PostgreSQL (默认端口5432)
- **Redis**: Redis (默认端口6379)

### 环境变量

创建 `.env.local` 文件：

```env
# 数据库配置
DATABASE_URL=postgresql://user:password@localhost:5432/yyc3_db

# Redis配置
REDIS_URL=redis://localhost:6379

# API配置
API_BASE_URL=http://localhost:3000/api

# AI配置
AI_API_KEY=your_ai_api_key
AI_MODEL=gpt-4

# 应用配置
APP_NAME=YYC³餐饮行业智能化平台
APP_URL=http://localhost:3100
```

### VS Code插件推荐

- **Vue - Official**: Vue 3语法高亮和智能提示
- **TypeScript Vue Plugin (Volar)**: TypeScript支持
- **ESLint**: 代码检查
- **Prettier**: 代码格式化
- **GitLens**: Git增强功能

---

## 项目结构说明

### 整体结构

```
yyc3-catering-platform/
├── frontend/                    # 前端项目
│   ├── apps/
│   │   └── admin-dashboard/    # 管理后台
│   │       ├── src/
│   │       │   ├── components/  # 组件
│   │       │   ├── views/       # 页面
│   │       │   ├── api/        # API接口
│   │       │   ├── composables/ # 组合式函数
│   │       │   ├── utils/      # 工具函数
│   │       │   ├── types/      # 类型定义
│   │       │   └── lib/       # 第三方库集成
│   │       ├── e2e/           # 端到端测试
│   │       └── __tests__/      # 单元测试和集成测试
│   └── packages/              # 共享包
├── backend/                    # 后端项目
│   ├── services/               # 微服务
│   └── shared/                # 共享代码
├── ui/                        # UI设计系统
│   ├── src/
│   │   └── app/
│   │       ├── ai-widget/      # AI Widget系统
│   │       ├── closed-loop/    # Closed Loop系统
│   │       └── components/     # UI组件
│   └── guidelines/            # 设计指南
├── docs/                      # 文档
└── scripts/                   # 脚本
```

### 前端项目结构

```
admin-dashboard/
├── src/
│   ├── components/
│   │   ├── UI/               # UI组件库
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   └── ...
│   │   ├── layout/           # 布局组件
│   │   ├── dashboard/        # 仪表板组件
│   │   └── AIWidget/        # AI Widget组件
│   ├── views/                # 页面组件
│   │   ├── Dashboard.vue
│   │   ├── OrderManagement.vue
│   │   └── ...
│   ├── api/                  # API接口
│   │   ├── order.ts
│   │   ├── menu.ts
│   │   └── ...
│   ├── composables/          # 组合式函数
│   │   ├── useAuth.ts
│   │   ├── useOrder.ts
│   │   └── ...
│   ├── utils/                # 工具函数
│   │   ├── format.ts
│   │   ├── validate.ts
│   │   └── ...
│   ├── types/                # 类型定义
│   │   ├── order.ts
│   │   ├── menu.ts
│   │   └── ...
│   ├── lib/                 # 第三方库集成
│   │   ├── ai-widget/
│   │   └── closed-loop/
│   ├── router/               # 路由配置
│   ├── store/                # 状态管理
│   └── styles/               # 样式文件
├── e2e/                    # 端到端测试
│   ├── yyc3-platform.e2e.test.ts
│   └── performance.e2e.test.ts
└── __tests__/               # 单元测试和集成测试
    ├── integration/
    │   ├── ai-widget.test.ts
    │   ├── closed-loop.test.ts
    │   └── system-integration.test.ts
    └── components/
        └── UI/
```

---

## 组件开发指南

### UI组件开发

#### 组件命名规范

- **组件文件**: PascalCase，如 `Button.vue`
- **组件导出**: PascalCase，如 `export const Button`
- **组件使用**: PascalCase，如 `<Button />`

#### 组件结构

```vue
<template>
  <div class="button" :class="variant">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from "vue";

interface ButtonProps {
  variant?: "primary" | "secondary" | "tertiary";
  disabled?: boolean;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: "primary",
  disabled: false,
});
</script>

<style scoped>
.button {
  /* 样式 */
}
</style>
```

#### 组件类型定义

```typescript
// types/button.ts
export interface ButtonProps {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export type ButtonVariant = ButtonProps["variant"];
export type ButtonSize = ButtonProps["size"];
```

#### 组件测试

```typescript
// Button.test.tsx
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Button from "./Button.vue";

describe("Button", () => {
  it("应该正确渲染", () => {
    const wrapper = mount(Button);
    expect(wrapper.find(".button").exists()).toBe(true);
  });

  it("应该支持不同的变体", () => {
    const wrapper = mount(Button, { props: { variant: "secondary" } });
    expect(wrapper.find(".button.secondary").exists()).toBe(true);
  });
});
```

### 页面组件开发

#### 页面结构

```vue
<template>
  <div class="page-container">
    <YTLayout>
      <template #header>
        <YTHeader :title="pageTitle" />
      </template>

      <template #sidebar>
        <YTSidebar :menu="menuItems" />
      </template>

      <template #content>
        <div class="page-content">
          <!-- 页面内容 -->
        </div>
      </template>
    </YTLayout>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import YTLayout from "@/components/layout/YTLayout.vue";
import YTHeader from "@/components/layout/YTHeader.vue";
import YTSidebar from "@/components/layout/YTSidebar.vue";

const pageTitle = ref("页面标题");
const menuItems = ref([
  { id: "1", label: "菜单项1", path: "/path1" },
  { id: "2", label: "菜单项2", path: "/path2" },
]);
</script>

<style scoped>
.page-container {
  /* 样式 */
}
</style>
```

### API接口开发

#### API函数定义

```typescript
// api/order.ts
import axios from "axios";
import type { Order, CreateOrderRequest, UpdateOrderRequest } from "@/types/order";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

export const orderApi = {
  // 获取订单列表
  getOrders: async (params?: any): Promise<Order[]> => {
    const response = await api.get("/orders", { params });
    return response.data;
  },

  // 获取订单详情
  getOrderById: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // 创建订单
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await api.post("/orders", data);
    return response.data;
  },

  // 更新订单
  updateOrder: async (id: string, data: UpdateOrderRequest): Promise<Order> => {
    const response = await api.put(`/orders/${id}`, data);
    return response.data;
  },

  // 删除订单
  deleteOrder: async (id: string): Promise<void> => {
    await api.delete(`/orders/${id}`);
  },
};
```

### 组合式函数开发

#### Composable定义

```typescript
// composables/useOrder.ts
import { ref, computed } from "vue";
import { orderApi } from "@/api/order";
import type { Order } from "@/types/order";

export function useOrder() {
  const orders = ref<Order[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const fetchOrders = async () => {
    loading.value = true;
    error.value = null;

    try {
      orders.value = await orderApi.getOrders();
    } catch (e) {
      error.value = e as Error;
    } finally {
      loading.value = false;
    }
  };

  const createOrder = async (data: any) => {
    loading.value = true;
    error.value = null;

    try {
      const newOrder = await orderApi.createOrder(data);
      orders.value.push(newOrder);
      return newOrder;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const updateOrder = async (id: string, data: any) => {
    loading.value = true;
    error.value = null;

    try {
      const updatedOrder = await orderApi.updateOrder(id, data);
      const index = orders.value.findIndex(o => o.id === id);
      if (index !== -1) {
        orders.value[index] = updatedOrder;
      }
      return updatedOrder;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const deleteOrder = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      await orderApi.deleteOrder(id);
      orders.value = orders.value.filter(o => o.id !== id);
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
    updateOrder,
    deleteOrder,
  };
}
```

---

## 测试指南

### 单元测试

#### 运行测试

```bash
# 运行所有测试
pnpm test

# 运行特定测试文件
pnpm test Button.test.tsx

# 监听模式
pnpm test --watch

# 覆盖率报告
pnpm test --coverage
```

#### 测试示例

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import Button from "./Button.vue";

describe("Button", () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(Button);
  });

  it("应该正确渲染", () => {
    expect(wrapper.find(".button").exists()).toBe(true);
  });

  it("应该响应点击事件", async () => {
    await wrapper.trigger("click");
    expect(wrapper.emitted()).toHaveProperty("click");
  });
});
```

### 集成测试

#### 测试示例

```typescript
import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import AIWidget from "@/components/AIWidget/index.vue";

describe("AIWidget Integration", () => {
  it("应该正确处理消息", async () => {
    const wrapper = mount(AIWidget);

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            content: "测试回复",
            toolCalls: [],
          }),
      })
    ) as any;

    wrapper.vm.inputMessage = "测试消息";
    await wrapper.vm.sendMessage();

    expect(wrapper.vm.messages).toHaveLength(2);
  });
});
```

### 端到端测试

#### 运行测试

```bash
# 运行所有E2E测试
pnpm test:e2e

# 运行特定测试文件
pnpm test:e2e yyc3-platform.e2e.test.ts

# UI模式
pnpm test:e2e:ui

# 调试模式
pnpm test:e2e:debug
```

#### 测试示例

```typescript
import { test, expect } from "@playwright/test";

test("用户登录流程", async ({ page }) => {
  await page.goto("http://localhost:3100");

  await page.fill('input[name="username"]', "admin");
  await page.fill('input[name="password"]', "password123");
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/.*dashboard/);
});
```

---

## 部署指南

### 构建项目

```bash
# 构建前端
pnpm build

# 构建后端
cd backend
pnpm build
```

### 环境变量

生产环境需要配置以下环境变量：

```env
# 数据库配置
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Redis配置
REDIS_URL=redis://host:6379

# API配置
API_BASE_URL=https://api.yourdomain.com/api

# AI配置
AI_API_KEY=your_production_ai_api_key

# 应用配置
APP_NAME=YYC³餐饮行业智能化平台
APP_URL=https://yourdomain.com
NODE_ENV=production
```

### Docker部署

#### Dockerfile

```dockerfile
# 前端Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### docker-compose.yml

```yaml
version: "3.8"

services:
  frontend:
    build:
      context: ./frontend/apps/admin-dashboard
      dockerfile: Dockerfile
    ports:
      - "3100:80"
    environment:
      - NODE_ENV=production

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/yyc3_db
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=yyc3_db
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### CI/CD

#### GitHub Actions示例

```yaml
name: CI/CD

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: pnpm install
      - run: pnpm test
      - run: pnpm build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: |
          # 部署命令
          docker-compose up -d
```

---

## 最佳实践

### 代码规范

#### TypeScript规范

- 使用 `interface` 定义对象类型
- 使用 `type` 定义联合类型
- 避免使用 `any`，使用 `unknown` 代替
- 使用泛型提高代码复用性

```typescript
// ✅ 推荐
interface User {
  id: string;
  name: string;
}

type UserRole = "admin" | "user" | "guest";

function processData<T>(data: T): T {
  return data;
}

// ❌ 不推荐
const user: any = {};
```

#### Vue 3规范

- 使用 Composition API
- 使用 `<script setup>` 语法
- 使用 TypeScript 类型定义
- 使用组合式函数复用逻辑

```vue
<!-- ✅ 推荐 -->
<script setup lang="ts">
import { ref, computed } from "vue";

const count = ref(0);
const doubled = computed(() => count.value * 2);
</script>

<!-- ❌ 不推荐 -->
<script>
export default {
  data() {
    return {
      count: 0,
    };
  },
};
</script>
```

### 性能优化

#### 组件优化

- 使用 `v-once` 静态内容
- 使用 `v-memo` 缓存列表项
- 使用 `computed` 缓存计算结果
- 使用 `v-show` 替代频繁切换的 `v-if`

```vue
<!-- ✅ 推荐 -->
<div v-once>静态内容</div>
<div v-for="item in items" :key="item.id" v-memo="[item.id]">
  {{ item.name }}
</div>

<!-- ❌ 不推荐 -->
<div>静态内容</div>
<div v-for="item in items" :key="item.id">
  {{ item.name }}
</div>
```

#### 网络优化

- 使用请求缓存
- 使用防抖和节流
- 使用懒加载
- 使用分页加载

```typescript
// ✅ 推荐
import { debounce } from "lodash-es";

const debouncedSearch = debounce(async (keyword: string) => {
  const results = await searchApi(keyword);
}, 300);

// ❌ 不推荐
const search = async (keyword: string) => {
  const results = await searchApi(keyword);
};
```

### 安全规范

#### 输入验证

- 使用 Zod 进行输入验证
- 防止 XSS 攻击
- 防止 SQL 注入

```typescript
// ✅ 推荐
import { z } from "zod";

const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// ❌ 不推荐
const email = req.body.email;
```

#### 权限控制

- 使用路由守卫
- 使用权限指令
- 使用 API 权限验证

```typescript
// ✅ 推荐
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next("/login");
  } else {
    next();
  }
});
```

### Git工作流

#### 分支策略

- `main`: 主分支，用于生产环境
- `develop`: 开发分支，用于集成测试
- `feature/*`: 功能分支
- `bugfix/*`: 修复分支
- `hotfix/*`: 紧急修复分支

#### 提交规范

```
feat: 添加新功能
fix: 修复bug
docs: 更新文档
style: 代码格式调整
refactor: 代码重构
test: 添加测试
chore: 构建/工具链相关
```

---

**最后更新**: 2026-01-21
**版本**: 1.0.0
**作者**: YYC³ 团队

🌹 祝您开发愉快！
