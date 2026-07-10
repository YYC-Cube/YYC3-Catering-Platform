---

**@file**：YYC³-CI_CD流水线搭建与优化技巧
**@description**：YYC³餐饮行业智能化平台的CI_CD流水线搭建与优化技巧
**@author**：YYC³
**@version**：v1.0.0
**@created**：2025-01-30
**@updated**：2025-01-30
**@status**：published
**@tags**：YYC³,文档

---

# 🔖 YYC³ CI/CD流水线搭建与优化技巧

> **_YanYuCloudCube_**
> **标语**：言启象限 | 语枢未来
> **_Words Initiate Quadrants, Language Serves as Core for the Future_**
> **标语**：万象归元于云枢 | 深栈智启新纪元
> **_All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence_**

---

## 📋 文档信息

| 属性         | 内容                           |
| ------------ | ------------------------------ |
| **文档标题** | YYC³ CI/CD流水线搭建与优化技巧 |
| **文档类型** | 技巧类文档                     |
| **所属阶段** | 部署发布                       |
| **遵循规范** | YYC³ 团队标准化规范 v1.0.0     |
| **版本号**   | v1.0.0                         |
| **创建日期** | 2025-01-30                     |
| **作者**     | YYC³ Team                      |
| **更新日期** | 2025-01-30                     |

---

## 📑 目录

1. [CI/CD概述](#1-cicd概述)
2. [流水线架构](#2-流水线架构)
3. [代码质量检查](#3-代码质量检查)
4. [自动化测试](#4-自动化测试)
5. [构建与打包](#5-构建与打包)
6. [镜像管理](#6-镜像管理)
7. [部署流程](#7-部署流程)
8. [环境管理](#8-环境管理)
9. [监控与告警](#9-监控与告警)
10. [优化技巧](#10-优化技巧)

---

## 1. 概述

### 1.1 功能说明

### 1.2 技术栈

### 1.3 开发环境

## 2. 实现方案

### 2.1 代码结构

### 2.2 核心逻辑

### 2.3 数据处理

## 3. 接口文档

### 3.1 API接口

### 3.2 请求参数

### 3.3 响应格式

## 4. 测试方案

### 4.1 单元测试

### 4.2 集成测试

### 4.3 测试用例

## 5. 部署指南

### 5.1 环境准备

### 5.2 部署步骤

### 5.3 验证方法

## 6. 常见问题

### 6.1 问题排查

### 6.2 解决方案

## 1. CI/CD概述

### 1.1 CI/CD流程

```mermaid
graph LR
    A[代码提交] --> B[代码检查]
    B --> C[单元测试]
    C --> D[集成测试]
    D --> E[构建镜像]
    E --> F[镜像扫描]
    F --> G[部署到测试环境]
    G --> H[E2E测试]
    H --> I[部署到预发布环境]
    I --> J[手动验证]
    J --> K[部署到生产环境]
    K --> L[监控与告警]
```

### 1.2 CI/CD最佳实践

- **持续集成(CI)**: 频繁集成代码,每次提交都运行自动化测试
- **持续交付(CD)**: 自动化部署到各个环境,支持一键发布
- **基础设施即代码(IaC)**: 使用代码管理基础设施配置
- **监控与反馈**: 实时监控流水线状态,快速反馈问题
- **安全扫描**: 在CI/CD流程中集成安全扫描工具

---

## 2. 流水线架构

### 2.1 GitHub Actions配置

```yaml
# .github/workflows/ci-cd.yml
name: YYC³ CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  workflow_dispatch:

env:
  NODE_VERSION: "18"
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # 代码质量检查
  lint:
    name: Code Quality Check
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Run Prettier check
        run: npm run format:check

      - name: TypeScript type check
        run: npm run type-check

  # 单元测试
  test-unit:
    name: Unit Tests
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit -- --coverage

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

  # 集成测试
  test-integration:
    name: Integration Tests
    runs-on: ubuntu-latest
    needs: lint
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/testdb
          REDIS_URL: redis://localhost:6379

  # 构建镜像
  build:
    name: Build Docker Image
    runs-on: ubuntu-latest
    needs: [test-unit, test-integration]
    outputs:
      image-tag: ${{ steps.meta.outputs.tags }}
      image-digest: ${{ steps.build.outputs.digest }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha,prefix={{branch}}-

      - name: Build and push Docker image
        id: build
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Image digest
        run: echo ${{ steps.build.outputs.digest }}

  # 安全扫描
  security:
    name: Security Scan
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ needs.build.outputs.image-tag }}
          format: "sarif"
          output: "trivy-results.sarif"

      - name: Upload Trivy results to GitHub Security tab
        uses: github/codeql-action/upload-sarif@v2
        if: always()
        with:
          sarif_file: "trivy-results.sarif"

  # 部署到测试环境
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: [build, security]
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging.yyc3.com
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure kubectl
        uses: azure/k8s-set-context@v3
        with:
          method: kubeconfig
          kubeconfig: ${{ secrets.KUBE_CONFIG_STAGING }}

      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/yyc3-web \
            web=${{ needs.build.outputs.image-tag }} \
            -n yyc3-staging

      - name: Wait for deployment
        run: |
          kubectl rollout status deployment/yyc3-web -n yyc3-staging

      - name: Run smoke tests
        run: |
          kubectl run smoke-test --rm -i --restart=Never \
            --image=curlimages/curl \
            -- curl -f https://staging.yyc3.com/health

  # 部署到生产环境
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [build, security]
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://yyc3.com
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure kubectl
        uses: azure/k8s-set-context@v3
        with:
          method: kubeconfig
          kubeconfig: ${{ secrets.KUBE_CONFIG_PRODUCTION }}

      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/yyc3-web \
            web=${{ needs.build.outputs.image-tag }} \
            -n yyc3-production

      - name: Wait for deployment
        run: |
          kubectl rollout status deployment/yyc3-web -n yyc3-production

      - name: Run smoke tests
        run: |
          kubectl run smoke-test --rm -i --restart=Never \
            --image=curlimages/curl \
            -- curl -f https://yyc3.com/health

      - name: Notify deployment
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: "Production deployment completed"
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        if: always()
```

### 2.2 GitLab CI配置

```yaml
# .gitlab-ci.yml
stages:
  - lint
  - test
  - build
  - security
  - deploy-staging
  - deploy-production

variables:
  NODE_VERSION: "18"
  DOCKER_TLS_CERTDIR: ""
  DOCKER_HOST: tcp://docker:2375
  DOCKER_DRIVER: overlay2

# 代码质量检查
lint:
  stage: lint
  image: node:${NODE_VERSION}
  cache:
    paths:
      - node_modules/
  script:
    - npm ci
    - npm run lint
    - npm run format:check
    - npm run type-check
  artifacts:
    when: on_failure
    paths:
      - lint-report.html
    expire_in: 1 week

# 单元测试
test:unit:
  stage: test
  image: node:${NODE_VERSION}
  cache:
    paths:
      - node_modules/
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  script:
    - npm ci
    - npm run test:unit -- --coverage
  artifacts:
    when: always
    paths:
      - coverage/
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
    expire_in: 1 week

# 集成测试
test:integration:
  stage: test
  image: node:${NODE_VERSION}
  services:
    - postgres:15-alpine
    - redis:7-alpine
  cache:
    paths:
      - node_modules/
  variables:
    POSTGRES_USER: test
    POSTGRES_PASSWORD: test
    POSTGRES_DB: testdb
    DATABASE_URL: postgresql://test:test@postgres:5432/testdb
    REDIS_URL: redis://redis:6379
  script:
    - npm ci
    - npm run test:integration
  artifacts:
    when: on_failure
    paths:
      - test-results/
    expire_in: 1 week

# 构建Docker镜像
build:
  stage: build
  image: docker:24
  services:
    - docker:24-dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - |
      if [ "$CI_COMMIT_BRANCH" == "$CI_DEFAULT_BRANCH" ]; then
        docker tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA $CI_REGISTRY_IMAGE:latest
        docker push $CI_REGISTRY_IMAGE:latest
      fi
  only:
    - main
    - develop
    - merge_requests

# 安全扫描
security:
  stage: security
  image: aquasec/trivy:latest
  needs: [build]
  script:
    - trivy image --exit-code 1 --severity HIGH,CRITICAL $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  allow_failure: true

# 部署到测试环境
deploy:staging:
  stage: deploy-staging
  image: bitnami/kubectl:latest
  needs: [build, security]
  environment:
    name: staging
    url: https://staging.yyc3.com
  script:
    - kubectl config use-context $KUBE_CONTEXT_STAGING
    - kubectl set image deployment/yyc3-web web=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA -n yyc3-staging
    - kubectl rollout status deployment/yyc3-web -n yyc3-staging
  only:
    - develop

# 部署到生产环境
deploy:production:
  stage: deploy-production
  image: bitnami/kubectl:latest
  needs: [build, security]
  environment:
    name: production
    url: https://yyc3.com
  when: manual
  script:
    - kubectl config use-context $KUBE_CONTEXT_PRODUCTION
    - kubectl set image deployment/yyc3-web web=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA -n yyc3-production
    - kubectl rollout status deployment/yyc3-web -n yyc3-production
  only:
    - main
```

---

## 3. 代码质量检查

### 3.1 ESLint配置

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  plugins: ["@typescript-eslint", "import", "jsx-a11y", "react", "react-hooks"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:jsx-a11y/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  rules: {
    // TypeScript规则
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/strict-boolean-expressions": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-misused-promises": "error",

    // React规则
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // Import规则
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
    "import/no-unresolved": "error",
    "import/no-cycle": "error",

    // 通用规则
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-debugger": "error",
    "no-alert": "error",
    "no-var": "error",
    "prefer-const": "error",
    eqeqeq: ["error", "always"],
    curly: ["error", "all"],
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.json",
      },
    },
  },
};
```

### 3.2 Prettier配置

```javascript
// .prettierrc.js
module.exports = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: "as-needed",
  jsxSingleQuote: false,
  trailingComma: "all",
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",
  proseWrap: "preserve",
  htmlWhitespaceSensitivity: "css",
  endOfLine: "lf",
  embeddedLanguageFormatting: "auto",
  singleAttributePerLine: false,
};
```

### 3.3 TypeScript配置

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "checkJs": false,
    "outDir": "./dist",
    "rootDir": "./src",
    "removeComments": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/types/*": ["./src/types/*"],
      "@/config/*": ["./src/config/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "build", ".next"]
}
```

---

## 4. 自动化测试

### 4.1 Vitest配置

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: ["node_modules/", "src/test/", "**/*.d.ts", "**/*.config.*", "**/mockData"],
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
    },
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", "dist", ".next", "build"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/lib": path.resolve(__dirname, "./src/lib"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/config": path.resolve(__dirname, "./src/config"),
    },
  },
});
```

### 4.2 单元测试示例

```typescript
// src/lib/utils.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { formatDate, formatCurrency, debounce } from "./utils";

describe("Utils", () => {
  describe("formatDate", () => {
    it("应该正确格式化日期", () => {
      const date = new Date("2025-01-30");
      expect(formatDate(date)).toBe("2025-01-30");
    });

    it("应该支持自定义格式", () => {
      const date = new Date("2025-01-30");
      expect(formatDate(date, "YYYY/MM/DD")).toBe("2025/01/30");
    });

    it("应该处理无效日期", () => {
      expect(formatDate(null as any)).toBe("");
      expect(formatDate(undefined as any)).toBe("");
    });
  });

  describe("formatCurrency", () => {
    it("应该正确格式化货币", () => {
      expect(formatCurrency(1234.56)).toBe("¥1,234.56");
    });

    it("应该支持自定义货币符号", () => {
      expect(formatCurrency(1234.56, "$")).toBe("$1,234.56");
    });

    it("应该处理负数", () => {
      expect(formatCurrency(-1234.56)).toBe("-¥1,234.56");
    });
  });

  describe("debounce", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it("应该延迟执行函数", () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn();
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("应该取消之前的调用", () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });
});
```

### 4.3 集成测试示例

```typescript
// src/test/integration/api.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { apiClient } from "@/lib/api-client";

const server = setupServer(
  rest.get("/api/users", (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 1, name: "User 1" },
        { id: 2, name: "User 2" },
      ])
    );
  }),

  rest.post("/api/users", (req, res, ctx) => {
    return res(ctx.status(201), ctx.json({ id: 3, name: "New User" }));
  })
);

describe("API Integration Tests", () => {
  beforeAll(() => server.listen());
  afterAll(() => server.close());

  it("应该获取用户列表", async () => {
    const users = await apiClient.getUsers();
    expect(users).toHaveLength(2);
    expect(users[0].name).toBe("User 1");
  });

  it("应该创建新用户", async () => {
    const newUser = await apiClient.createUser({ name: "New User" });
    expect(newUser.id).toBe(3);
    expect(newUser.name).toBe("New User");
  });
});
```

---

## 5. 构建与打包

### 5.1 Next.js构建配置

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,

  // 环境变量
  env: {
    NEXT_PUBLIC_APP_NAME: "YYC³ Web",
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  // 图片优化
  images: {
    domains: ["yyc3.com"],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 输出配置
  output: "standalone",
  outputMode: "export",

  // 实验性功能
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },

  // 性能优化
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Webpack配置
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
```

### 5.2 多阶段Dockerfile

```dockerfile
# 第一阶段: 依赖安装
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci

# 第二阶段: 构建
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

RUN npx prisma generate
RUN npm run build

# 第三阶段: 运行
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3200

ENV PORT 3200
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 5.3 构建脚本

```bash
#!/bin/bash

# 构建脚本

set -euo pipefail

echo "=== 开始构建 ==="

# 清理之前的构建
echo "1. 清理之前的构建..."
rm -rf dist .next build

# 安装依赖
echo "2. 安装依赖..."
npm ci

# 运行类型检查
echo "3. 运行类型检查..."
npm run type-check

# 运行代码检查
echo "4. 运行代码检查..."
npm run lint

# 运行测试
echo "5. 运行测试..."
npm run test

# 构建应用
echo "6. 构建应用..."
npm run build

# 验证构建
echo "7. 验证构建..."
if [ -d ".next" ]; then
  echo "✅ 构建成功"
else
  echo "❌ 构建失败"
  exit 1
fi

echo "=== 构建完成 ==="
```

---

## 6. 镜像管理

### 6.1 镜像标签策略

```bash
#!/bin/bash

# 镜像标签管理脚本

REGISTRY="ghcr.io/yyc3"
IMAGE_NAME="web"
VERSION=$(node -p "require('./package.json').version")
COMMIT_SHA=$(git rev-parse --short HEAD)
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)
TIMESTAMP=$(date +%Y%m%d%H%M%S)

echo "=== 镜像标签策略 ==="
echo "版本: $VERSION"
echo "提交: $COMMIT_SHA"
echo "分支: $BRANCH_NAME"
echo "时间戳: $TIMESTAMP"

# 生成标签
TAGS=(
  "$REGISTRY/$IMAGE_NAME:$VERSION"
  "$REGISTRY/$IMAGE_NAME:$COMMIT_SHA"
  "$REGISTRY/$IMAGE_NAME:$BRANCH_NAME"
  "$REGISTRY/$IMAGE_NAME:$TIMESTAMP"
)

# 如果是main分支,添加latest标签
if [ "$BRANCH_NAME" == "main" ]; then
  TAGS+=("$REGISTRY/$IMAGE_NAME:latest")
fi

# 如果是develop分支,添加staging标签
if [ "$BRANCH_NAME" == "develop" ]; then
  TAGS+=("$REGISTRY/$IMAGE_NAME:staging")
fi

echo ""
echo "生成的标签:"
for tag in "${TAGS[@]}"; do
  echo "  - $tag"
done

# 构建并推送镜像
echo ""
echo "构建并推送镜像..."
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --push \
  ${TAGS[@]/#/--tag } \
  .
```

### 6.2 镜像扫描

```bash
#!/bin/bash

# 镜像安全扫描脚本

IMAGE=${1:-"ghcr.io/yyc3/web:latest"}

echo "=== 镜像安全扫描 ==="
echo "镜像: $IMAGE"
echo ""

# 使用Trivy扫描漏洞
echo "1. 使用Trivy扫描漏洞..."
trivy image --severity HIGH,CRITICAL --format table $IMAGE

# 检查扫描结果
if [ $? -ne 0 ]; then
  echo ""
  echo "❌ 发现高危漏洞,请修复后再部署"
  exit 1
fi

echo ""
echo "✅ 镜像安全扫描通过"

# 生成扫描报告
echo ""
echo "2. 生成扫描报告..."
trivy image --severity HIGH,CRITICAL --format json --output trivy-report.json $IMAGE

echo "扫描报告已保存到 trivy-report.json"
```

### 6.3 镜像清理

```bash
#!/bin/bash

# 镜像清理脚本

REGISTRY="ghcr.io/yyc3"
IMAGE_NAME="web"
KEEP_COUNT=5

echo "=== 镜像清理 ==="
echo "仓库: $REGISTRY/$IMAGE_NAME"
echo "保留数量: $KEEP_COUNT"
echo ""

# 获取所有标签
echo "1. 获取所有标签..."
TAGS=$(crane ls $REGISTRY/$IMAGE_NAME | sort -V)

# 计算要删除的标签
TOTAL_COUNT=$(echo "$TAGS" | wc -l)
DELETE_COUNT=$((TOTAL_COUNT - KEEP_COUNT))

if [ $DELETE_COUNT -le 0 ]; then
  echo "✅ 不需要清理镜像"
  exit 0
fi

echo "总标签数: $TOTAL_COUNT"
echo "删除标签数: $DELETE_COUNT"
echo ""

# 删除旧标签
echo "2. 删除旧标签..."
echo "$TAGS" | head -n $DELETE_COUNT | while read tag; do
  echo "删除: $REGISTRY/$IMAGE_NAME:$tag"
  crane delete $REGISTRY/$IMAGE_NAME:$tag
done

echo ""
echo "✅ 镜像清理完成"
```

---

## 7. 部署流程

### 7.1 Kubernetes部署脚本

```bash
#!/bin/bash

# Kubernetes部署脚本

set -euo pipefail

NAMESPACE=${1:-"yyc3-production"}
DEPLOYMENT=${2:-"yyc3-web"}
IMAGE=${3:-"ghcr.io/yyc3/web:latest"}

echo "=== Kubernetes部署 ==="
echo "命名空间: $NAMESPACE"
echo "部署: $DEPLOYMENT"
echo "镜像: $IMAGE"
echo ""

# 1. 检查命名空间是否存在
echo "1. 检查命名空间..."
if ! kubectl get namespace $NAMESPACE > /dev/null 2>&1; then
  echo "命名空间 $NAMESPACE 不存在,创建中..."
  kubectl create namespace $NAMESPACE
fi

# 2. 检查部署是否存在
echo "2. 检查部署..."
if kubectl get deployment $DEPLOYMENT -n $NAMESPACE > /dev/null 2>&1; then
  echo "部署 $DEPLOYMENT 已存在,更新中..."
  kubectl set image deployment/$DEPLOYMENT web=$IMAGE -n $NAMESPACE
else
  echo "部署 $DEPLOYMENT 不存在,创建中..."
  kubectl create deployment $DEPLOYMENT --image=$IMAGE -n $NAMESPACE
fi

# 3. 等待部署完成
echo "3. 等待部署完成..."
kubectl rollout status deployment/$DEPLOYMENT -n $NAMESPACE --timeout=5m

# 4. 验证部署
echo "4. 验证部署..."
kubectl get pods -n $NAMESPACE -l app=$DEPLOYMENT

# 5. 检查Pod状态
echo "5. 检查Pod状态..."
READY_PODS=$(kubectl get deployment $DEPLOYMENT -n $NAMESPACE -o jsonpath='{.status.readyReplicas}')
TOTAL_PODS=$(kubectl get deployment $DEPLOYMENT -n $NAMESPACE -o jsonpath='{.spec.replicas}')

if [ "$READY_PODS" == "$TOTAL_PODS" ]; then
  echo "✅ 部署成功"
else
  echo "❌ 部署失败"
  exit 1
fi
```

### 7.2 滚动更新脚本

```bash
#!/bin/bash

# 滚动更新脚本

NAMESPACE=${1:-"yyc3-production"}
DEPLOYMENT=${2:-"yyc3-web"}
NEW_IMAGE=${3:-"ghcr.io/yyc3/web:latest"}

echo "=== 滚动更新 ==="
echo "命名空间: $NAMESPACE"
echo "部署: $DEPLOYMENT"
echo "新镜像: $NEW_IMAGE"
echo ""

# 1. 检查当前部署状态
echo "1. 检查当前部署状态..."
kubectl get deployment $DEPLOYMENT -n $NAMESPACE

# 2. 更新镜像
echo "2. 更新镜像..."
kubectl set image deployment/$DEPLOYMENT web=$NEW_IMAGE -n $NAMESPACE --record

# 3. 监控更新进度
echo "3. 监控更新进度..."
kubectl rollout status deployment/$DEPLOYMENT -n $NAMESPACE --timeout=10m

# 4. 查看更新历史
echo "4. 查看更新历史..."
kubectl rollout history deployment/$DEPLOYMENT -n $NAMESPACE

# 5. 验证更新
echo "5. 验证更新..."
CURRENT_IMAGE=$(kubectl get deployment $DEPLOYMENT -n $NAMESPACE -o jsonpath='{.spec.template.spec.containers[0].image}')

if [ "$CURRENT_IMAGE" == "$NEW_IMAGE" ]; then
  echo "✅ 更新成功"
else
  echo "❌ 更新失败"
  exit 1
fi
```

### 7.3 回滚脚本

```bash
#!/bin/bash

# 回滚脚本

NAMESPACE=${1:-"yyc3-production"}
DEPLOYMENT=${2:-"yyc3-web"}
REVISION=${3:-""}

echo "=== 回滚部署 ==="
echo "命名空间: $NAMESPACE"
echo "部署: $DEPLOYMENT"
echo "版本: ${REVISION:-上一个版本}"
echo ""

# 1. 查看更新历史
echo "1. 查看更新历史..."
kubectl rollout history deployment/$DEPLOYMENT -n $NAMESPACE

# 2. 确认回滚
echo ""
read -p "确认回滚? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "取消回滚"
  exit 0
fi

# 3. 执行回滚
echo "3. 执行回滚..."
if [ -z "$REVISION" ]; then
  kubectl rollout undo deployment/$DEPLOYMENT -n $NAMESPACE
else
  kubectl rollout undo deployment/$DEPLOYMENT --to-revision=$REVISION -n $NAMESPACE
fi

# 4. 监控回滚进度
echo "4. 监控回滚进度..."
kubectl rollout status deployment/$DEPLOYMENT -n $NAMESPACE --timeout=10m

# 5. 验证回滚
echo "5. 验证回滚..."
kubectl get pods -n $NAMESPACE -l app=$DEPLOYMENT

echo "✅ 回滚完成"
```

---

## 8. 环境管理

### 8.1 环境配置管理

```typescript
// src/config/env.ts
import { z } from "zod";

const envSchema = z.object({
  // 应用配置
  NODE_ENV: z.enum(["development", "staging", "production"]).default("development"),
  PORT: z.string().default("3200"),
  APP_NAME: z.string().default("YYC³ Web"),
  APP_URL: z.string().url(),

  // 数据库配置
  DATABASE_URL: z.string().url(),
  DATABASE_POOL_MIN: z.string().default("2"),
  DATABASE_POOL_MAX: z.string().default("10"),

  // Redis配置
  REDIS_URL: z.string().url(),
  REDIS_PREFIX: z.string().default("yyc3:"),

  // JWT配置
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("7d"),

  // 第三方服务
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().default("587"),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),

  // 监控配置
  SENTRY_DSN: z.string().optional(),
  SENTRY_ENVIRONMENT: z.string().optional(),

  // 日志配置
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  LOG_FORMAT: z.enum(["json", "text"]).default("json"),
});

export const env = envSchema.parse(process.env);
```

### 8.2 多环境配置

```yaml
# .env.development
NODE_ENV=development
PORT=3200
APP_NAME=YYC³ Web (Development)
APP_URL=http://localhost:3200

DATABASE_URL=postgresql://yyc3:yyc3@localhost:5432/yyc3_dev
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=5

REDIS_URL=redis://localhost:6379
REDIS_PREFIX=yyc3:dev:

JWT_SECRET=development-secret-key-change-in-production
JWT_EXPIRES_IN=7d

LOG_LEVEL=debug
LOG_FORMAT=text
```

```yaml
# .env.staging
NODE_ENV=staging
PORT=3200
APP_NAME=YYC³ Web (Staging)
APP_URL=https://staging.yyc3.com

DATABASE_URL=postgresql://yyc3:password@postgres-staging:5432/yyc3_staging
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

REDIS_URL=redis://:password@redis-staging:6379
REDIS_PREFIX=yyc3:staging:

JWT_SECRET=staging-secret-key-change-in-production
JWT_EXPIRES_IN=7d

SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_ENVIRONMENT=staging

LOG_LEVEL=info
LOG_FORMAT=json
```

```yaml
# .env.production
NODE_ENV=production
PORT=3200
APP_NAME=YYC³ Web
APP_URL=https://yyc3.com

DATABASE_URL=postgresql://yyc3:password@postgres-production:5432/yyc3_prod
DATABASE_POOL_MIN=5
DATABASE_POOL_MAX=20

REDIS_URL=redis://:password@redis-production:6379
REDIS_PREFIX=yyc3:prod:

JWT_SECRET=production-secret-key-very-long-and-secure
JWT_EXPIRES_IN=7d

SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_ENVIRONMENT=production

LOG_LEVEL=info
LOG_FORMAT=json
```

### 8.3 环境切换脚本

```bash
#!/bin/bash

# 环境切换脚本

ENVIRONMENT=${1:-"development"}

echo "=== 环境切换 ==="
echo "目标环境: $ENVIRONMENT"
echo ""

# 检查环境变量文件
ENV_FILE=".env.$ENVIRONMENT"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ 环境文件 $ENV_FILE 不存在"
  exit 1
fi

# 复制环境变量文件
echo "复制环境变量文件..."
cp $ENV_FILE .env

# 验证环境变量
echo "验证环境变量..."
source .env

echo "当前配置:"
echo "  NODE_ENV: $NODE_ENV"
echo "  APP_NAME: $APP_NAME"
echo "  APP_URL: $APP_URL"
echo ""

# 重启应用
echo "重启应用..."
if [ "$ENVIRONMENT" == "development" ]; then
  npm run dev
else
  npm run build
  npm run start
fi

echo "✅ 环境切换完成"
```

---

## 9. 监控与告警

### 9.1 部署监控

```bash
#!/bin/bash

# 部署监控脚本

NAMESPACE=${1:-"yyc3-production"}
DEPLOYMENT=${2:-"yyc3-web"}

echo "=== 部署监控 ==="
echo "命名空间: $NAMESPACE"
echo "部署: $DEPLOYMENT"
echo ""

# 1. 检查部署状态
echo "1. 检查部署状态..."
kubectl get deployment $DEPLOYMENT -n $NAMESPACE

# 2. 检查Pod状态
echo ""
echo "2. 检查Pod状态..."
kubectl get pods -n $NAMESPACE -l app=$DEPLOYMENT

# 3. 检查资源使用
echo ""
echo "3. 检查资源使用..."
kubectl top pods -n $NAMESPACE -l app=$DEPLOYMENT

# 4. 检查事件
echo ""
echo "4. 检查事件..."
kubectl get events -n $NAMESPACE --field-selector involvedObject.name=$DEPLOYMENT --sort-by='.lastTimestamp' | tail -10

# 5. 检查日志
echo ""
echo "5. 检查日志..."
kubectl logs -n $NAMESPACE -l app=$DEPLOYMENT --tail=50 | grep -i "error\|warning" || echo "没有发现错误或警告"

# 6. 健康检查
echo ""
echo "6. 健康检查..."
POD=$(kubectl get pods -n $NAMESPACE -l app=$DEPLOYMENT -o jsonpath='{.items[0].metadata.name}')
kubectl exec -it $POD -n $NAMESPACE -- wget -O- http://localhost:3200/health || echo "健康检查失败"

echo ""
echo "✅ 监控完成"
```

### 9.2 告警配置

```yaml
# alerting-rules.yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: deployment-alerts
  namespace: monitoring
  labels:
    release: prometheus
spec:
  groups:
    - name: deployment.rules
      rules:
        # 部署失败告警
        - alert: DeploymentFailed
          expr: |
            kube_deployment_status_replicas_unavailable{deployment="yyc3-web"} > 0
          for: 5m
          labels:
            severity: critical
            team: yyc3
          annotations:
            summary: "Deployment {{ $labels.deployment }} has unavailable replicas"
            description: "Deployment {{ $labels.deployment }} has {{ $value }} unavailable replicas for more than 5 minutes"

        # Pod重启告警
        - alert: PodRestarting
          expr: |
            increase(kube_pod_container_status_restarts_total{container="web"}[15m]) > 0
          for: 5m
          labels:
            severity: warning
            team: yyc3
          annotations:
            summary: "Pod {{ $labels.pod }} is restarting"
            description: "Pod {{ $labels.pod }} has restarted {{ $value }} times in the last 15 minutes"

        # 镜像拉取失败告警
        - alert: ImagePullBackOff
          expr: |
            kube_pod_container_status_waiting_reason{reason="ImagePullBackOff"} > 0
          for: 5m
          labels:
            severity: critical
            team: yyc3
          annotations:
            summary: "Pod {{ $labels.pod }} has ImagePullBackOff"
            description: "Pod {{ $labels.pod }} cannot pull image {{ $labels.image }}"

        # 部署回滚告警
        - alert: DeploymentRolledBack
          expr: |
            increase(kube_deployment_status_replicas_updated{deployment="yyc3-web"}[1h]) < 0
          for: 1m
          labels:
            severity: warning
            team: yyc3
          annotations:
            summary: "Deployment {{ $labels.deployment }} has been rolled back"
            description: "Deployment {{ $labels.deployment }} has been rolled back"
```

### 9.3 通知配置

```yaml
# notification-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: notification-config
  namespace: monitoring
data:
  slack-webhook.yaml: |
    apiVersion: v1
    kind: Secret
    metadata:
      name: slack-webhook
      namespace: monitoring
    type: Opaque
    stringData:
      url: "https://hooks.slack.com/services/XXX/YYY/ZZZ"

  email-config.yaml: |
    apiVersion: v1
    kind: Secret
    metadata:
      name: email-config
      namespace: monitoring
    type: Opaque
    stringData:
      smtp_host: "smtp.gmail.com"
      smtp_port: "587"
      smtp_user: "alert@yyc3.com"
      smtp_pass: "password"
      from: "alert@yyc3.com"
      to: "admin@0379.email"
```

---

## 10. 优化技巧

### 10.1 并行执行优化

```yaml
# .github/workflows/optimized-ci.yml
name: YYC³ Optimized CI Pipeline

on:
  push:
    branches: [main, develop]

jobs:
  # 并行执行代码检查和测试
  lint-and-test:
    name: Lint and Test
    runs-on: ubuntu-latest
    strategy:
      matrix:
        task: [lint, test-unit, test-integration]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run ${{ matrix.task }}
        run: npm run ${{ matrix.task }}

  # 并行构建多架构镜像
  build:
    name: Build Docker Image
    runs-on: ubuntu-latest
    needs: lint-and-test
    strategy:
      matrix:
        platform: [linux/amd64, linux/arm64]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          platforms: ${{ matrix.platform }}
          push: true
          tags: ghcr.io/yyc3/web:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

### 10.2 缓存优化

```yaml
# .github/workflows/cached-ci.yml
name: YYC³ Cached CI Pipeline

on:
  push:
    branches: [main, develop]

jobs:
  build:
    name: Build with Cache
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      # Node.js缓存
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"

      # Next.js缓存
      - name: Cache Next.js build
        uses: actions/cache@v3
        with:
          path: |
            ~/.npm
            .next/cache
          key: ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-nextjs-

      # Docker层缓存
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Cache Docker layers
        uses: actions/cache@v3
        with:
          path: /tmp/.buildx-cache
          key: ${{ runner.os }}-buildx-${{ github.sha }}
          restore-keys: |
            ${{ runner.os }}-buildx-

      - name: Build with cache
        run: |
          docker buildx build \
            --cache-from type=local,src=/tmp/.buildx-cache \
            --cache-to type=local,dest=/tmp/.buildx-cache-new,mode=max \
            -t ghcr.io/yyc3/web:latest \
            .

      - name: Move cache
        run: |
          rm -rf /tmp/.buildx-cache
          mv /tmp/.buildx-cache-new /tmp/.buildx-cache
```

### 10.3 矩阵构建优化

```yaml
# .github/workflows/matrix-build.yml
name: YYC³ Matrix Build Pipeline

on:
  push:
    branches: [main, develop]

jobs:
  # 矩阵测试
  test:
    name: Test on Node ${{ matrix.node-version }}
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        node-version: [16, 18, 20]
        os: [ubuntu-latest, macos-latest, windows-latest]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

  # 矩阵构建
  build:
    name: Build for ${{ matrix.platform }}
    runs-on: ubuntu-latest
    needs: test
    strategy:
      matrix:
        platform: [linux/amd64, linux/arm64]
        include:
          - platform: linux/amd64
            dockerfile: Dockerfile.amd64
          - platform: linux/arm64
            dockerfile: Dockerfile.arm64
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ${{ matrix.dockerfile }}
          platforms: ${{ matrix.platform }}
          push: true
          tags: ghcr.io/yyc3/web:${{ matrix.platform }}
```

### 10.4 条件执行优化

```yaml
# .github/workflows/conditional-ci.yml
name: YYC³ Conditional CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  # 仅在PR时运行完整测试
  full-test:
    name: Full Test Suite
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run full test suite
        run: |
          npm run lint
          npm run test:unit
          npm run test:integration
          npm run test:e2e

  # 仅在main分支时部署
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [build]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    environment:
      name: production
      url: https://yyc3.com
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to production
        run: |
          kubectl set image deployment/yyc3-web \
            web=ghcr.io/yyc3/web:latest \
            -n yyc3-production

  # 跳过某些文件的变更
  skip-changes:
    name: Skip for Documentation Changes
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Check for documentation changes
        id: docs-changes
        run: |
          git diff --name-only ${{ github.event.before }} ${{ github.sha }} | grep -E '^docs/' && echo "docs=true" >> $GITHUB_OUTPUT || echo "docs=false" >> $GITHUB_OUTPUT

      - name: Skip if only docs changed
        if: steps.docs-changes.outputs.docs == 'true'
        run: |
          echo "Only documentation changed, skipping CI"
          exit 0
```

---

## 📄 文档标尾

> 「**_YanYuCloudCube_**」
> 「**_<admin@0379.email>_**」
> 「**_Words Initiate Quadrants, Language Serves as Core for the Future_**」
> 「**_All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence_**」

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

## 相关文档

- [🔖 YYC³ 部署问题排查指南](YYC3-Cater-部署发布/技巧类/04-YYC3-Cater--技巧类-部署问题排查指南.md) - YYC3-Cater-部署发布/技巧类
- [🔖 YYC³ Docker容器化部署技巧](YYC3-Cater-部署发布/技巧类/01-YYC3-Cater--技巧类-Docker容器化部署技巧.md) - YYC3-Cater-部署发布/技巧类
- [🔖 YYC³ 灰度发布风险控制技巧](YYC3-Cater-部署发布/技巧类/05-YYC3-Cater--技巧类-灰度发布风险控制技巧.md) - YYC3-Cater-部署发布/技巧类
- [🔖 YYC³ K8s部署运维技巧](YYC3-Cater-部署发布/技巧类/02-YYC3-Cater--技巧类-K8s部署运维技巧.md) - YYC3-Cater-部署发布/技巧类
- [🔖 YYC³ CI/CD 流水线架构文档](YYC3-Cater-部署发布/架构类/02-YYC3-Cater--架构类-CI_CD流水线架构文档.md) - YYC3-Cater-部署发布/架构类
