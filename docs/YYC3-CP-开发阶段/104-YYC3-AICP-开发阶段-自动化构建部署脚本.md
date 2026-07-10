---
@file: 104-YYC3-AICP-开发阶段-自动化构建部署脚本.md
@description: YYC3-AICP 前端、后端的自动化构建、打包、部署脚本与规范
@author: YanYuCloudCube Team
@version: v1.0.0
@created: 2025-12-29
@updated: 2025-12-29
@status: published
@tags: [开发阶段],[自动化],[构建部署]
---

> **_YanYuCloudCube_**
> **标语**：言启象限 | 语枢未来
> **_Words Initiate Quadrants, Language Serves as Core for the Future_**
> **标语**：万象归元于云枢 | 深栈智启新纪元
> **_All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence_**

---

# 104-YYC3-AICP-开发阶段-自动化构建部署脚本

## 概述

本文档详细描述YYC3-YYC3-AICP-开发阶段-自动化构建部署脚本相关内容，确保项目按照YYC³标准规范进行开发和实施。

## 核心内容

### 1. 背景与目标

#### 1.1 项目背景

YYC³(YanYuCloudCube)-「智能教育」项目是一个基于「五高五标五化」理念的智能化应用系统，致力于提供高质量、高可用、高安全的成长守护体系。

#### 1.2 文档目标

- 规范自动化构建部署脚本相关的业务标准与技术落地要求
- 为项目相关人员提供清晰的参考依据
- 保障相关模块开发、实施、运维的一致性与规范性

### 2. 设计原则

#### 2.1 五高原则

- **高可用性**：确保系统7x24小时稳定运行
- **高性能**：优化响应时间和处理能力
- **高安全性**：保护用户数据和隐私安全
- **高扩展性**：支持业务快速扩展
- **高可维护性**：便于后续维护和升级

#### 2.2 五标体系

- **标准化**：统一的技术和流程标准
- **规范化**：严格的开发和管理规范
- **自动化**：提高开发效率和质量
- **智能化**：利用AI技术提升能力
- **可视化**：直观的监控和管理界面

#### 2.3 五化架构

- **流程化**：标准化的开发流程
- **文档化**：完善的文档体系
- **工具化**：高效的开发工具链
- **数字化**：数据驱动的决策
- **生态化**：开放的生态系统

### 3. 自动化构建部署脚本

#### 3.1 构建自动化规范

##### 3.1.1 前端构建规范

**构建工具配置**

- 使用 Next.js 14+ 作为前端框架
- 使用 pnpm 作为包管理器
- Node.js 版本：18.x

**构建命令**

```bash
# 安装依赖
pnpm install

# 开发环境构建
pnpm run build:dev

# 生产环境构建
pnpm run build:prod

# 类型检查
pnpm run type-check

# 代码格式化
pnpm run format

# 代码质量检查
pnpm run lint
```

**构建产物规范**

- 输出目录：`frontend/dist/`
- 静态资源：`frontend/dist/static/`
- 构建产物必须包含：
  - HTML 文件
  - JavaScript 文件（压缩、混淆）
  - CSS 文件（压缩）
  - 静态资源（图片、字体等）

##### 3.1.2 后端构建规范

**构建工具配置**

- 使用 Bun 作为运行时和构建工具
- TypeScript 版本：5.0+
- 依赖管理：Bun lockfile

**构建命令**

```bash
# 安装依赖
bun install --frozen-lockfile

# 开发环境构建
bun run build:dev

# 生产环境构建
bun run build

# 类型检查
bun run type-check

# 代码格式化
bun run format

# 代码质量检查
bun run lint
```

**构建产物规范**

- 输出目录：`backend/dist/`
- 必须包含：
  - 编译后的 JavaScript 文件
  - TypeScript 声明文件（.d.ts）
  - 配置文件
  - 必要的依赖

#### 3.2 CI/CD流水线配置

##### 3.2.1 主流水线架构

**流水线阶段**

1. 代码质量检查
2. SonarQube 代码质量分析
3. 单元测试
4. 构建
5. 安全扫描
6. 部署

**触发条件**

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
```

##### 3.2.2 代码质量检查

**检查项**

- 代码格式化检查
- 代码质量检查
- TypeScript 类型检查
- 安全审计

**配置示例**

```yaml
lint-and-format:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: 设置 Node.js
      uses: actions/setup-node@v4
      with:
        node-version: "18.x"
        cache: "pnpm"

    - name: 安装依赖
      run: npm install -g pnpm && pnpm install

    - name: 代码格式检查
      run: pnpm run format

    - name: 代码质量检查
      run: pnpm run lint

    - name: TypeScript 类型检查
      run: pnpm run type-check
```

##### 3.2.3 SonarQube 代码质量分析

**质量门配置**

- 代码覆盖率：≥ 80%
- 代码重复率：≤ 3%
- 代码异味：≤ 5
- 安全热点：0

**配置示例**

```yaml
sonarqube-analysis:
  runs-on: ubuntu-latest
  needs: lint-and-format
  steps:
    - uses: actions/checkout@v4
      with:
        fetch-depth: 0

    - name: 设置 Node.js
      uses: actions/setup-node@v4
      with:
        node-version: "18.x"
        cache: "pnpm"

    - name: 安装依赖
      run: npm install -g pnpm && pnpm install

    - name: 运行测试获取覆盖率报告
      run: pnpm run test:coverage

    - name: SonarQube 扫描
      uses: SonarSource/sonarqube-scan-action@master
      env:
        SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
        SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}

    - name: 等待质量门结果
      uses: SonarSource/sonarqube-quality-gate-action@master
      timeout-minutes: 5
      env:
        SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

##### 3.2.4 单元测试

**测试框架**

- 前端：Jest / Vitest
- 后端：Bun Test

**测试要求**

- 单元测试覆盖率：≥ 80%
- 关键路径覆盖率：100%
- 所有测试必须通过

**配置示例**

```yaml
test:
  runs-on: ubuntu-latest
  needs: sonarqube-analysis
  steps:
    - uses: actions/checkout@v4
    - name: 设置 Node.js
      uses: actions/setup-node@v4
      with:
        node-version: "18.x"
        cache: "pnpm"

    - name: 安装依赖
      run: npm install -g pnpm && pnpm install

    - name: 运行单元测试
      run: pnpm run test:unit

    - name: 生成测试覆盖率报告
      run: pnpm run test:coverage

    - name: 上传测试覆盖率报告
      uses: actions/upload-artifact@v4
      with:
        name: test-coverage
        path: coverage/
```

##### 3.2.5 构建阶段

**后端构建**

```yaml
build-backend:
  runs-on: ubuntu-latest
  needs: test
  steps:
    - uses: actions/checkout@v4
    - name: 设置 Node.js
      uses: actions/setup-node@v4
      with:
        node-version: "18.x"
        cache: "pnpm"

    - name: 安装依赖
      run: npm install -g pnpm && pnpm install

    - name: 构建后端
      run: pnpm run build:backend

    - name: 上传后端构建产物
      uses: actions/upload-artifact@v4
      with:
        name: backend-build
        path: dist/backend/
```

**前端构建**

```yaml
build-frontend:
  runs-on: ubuntu-latest
  needs: test
  steps:
    - uses: actions/checkout@v4
    - name: 设置 Node.js
      uses: actions/setup-node@v4
      with:
        node-version: "18.x"
        cache: "pnpm"

    - name: 安装依赖
      run: npm install -g pnpm && pnpm install

    - name: 构建前端
      run: pnpm run build:frontend

    - name: 上传前端构建产物
      uses: actions/upload-artifact@v4
      with:
        name: frontend-build
        path: frontend/dist/
```

##### 3.2.6 安全扫描

**扫描项**

- 代码安全扫描
- 依赖漏洞扫描
- 容器镜像扫描

**配置示例**

```yaml
security-scan:
  runs-on: ubuntu-latest
  needs: [build-backend, build-frontend]
  steps:
    - uses: actions/checkout@v4

    - name: 设置 Node.js
      uses: actions/setup-node@v4
      with:
        node-version: "18.x"
        cache: "pnpm"

    - name: 安装依赖
      run: npm install -g pnpm && pnpm install

    # 代码安全扫描
    - name: 安装安全扫描工具
      run: pnpm add -D eslint-plugin-security

    - name: 运行代码安全扫描
      run: pnpm run lint:security

    # 容器镜像扫描
    - name: 设置 Docker Buildx
      uses: docker/setup-buildx-action@v2

    - name: 构建后端Docker镜像
      uses: docker/build-push-action@v4
      with:
        context: ./backend
        push: false
        load: true
        tags: yyc3-backend:latest
        cache-from: type=gha
        cache-to: type=gha,mode=max

    - name: 运行Trivy漏洞扫描
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: "yyc3-backend:latest"
        format: "sarif"
        output: "trivy-results.sarif"
        severity: "CRITICAL,HIGH"

    - name: 上传Trivy扫描结果到GitHub Security tab
      uses: github/codeql-action/upload-sarif@v2
      with:
        sarif_file: "trivy-results.sarif"
      if: always()
```

#### 3.3 部署自动化

##### 3.3.1 环境配置

**环境定义**

- 开发环境（development）：开发、测试
- 测试环境（testing）：集成测试、验收测试
- 预发布环境（staging）：生产前验证
- 生产环境（production）：正式运行

**环境变量管理**

- 使用 GitHub Secrets 管理敏感信息
- 不同环境使用不同的 Secrets
- 环境变量命名规范：`{ENV}_{SERVICE}_{KEY}`

##### 3.3.2 开发环境部署

**部署策略**

- 自动部署：develop 分支推送时自动部署
- 部署目标：开发环境命名空间
- 副本数：2

**配置示例**

```yaml
deploy-dev:
  name: Deploy to Development Environment
  runs-on: ubuntu-latest
  needs: [security-scan]
  if: github.ref == 'refs/heads/develop'
  environment:
    name: development
    url: https://dev.yyc3-catering.com
  steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Set up Helm
      uses: azure/setup-helm@v3
      with:
        version: v3.9.0

    - name: Set up Kubernetes context
      uses: azure/k8s-set-context@v3
      with:
        kubeconfig: ${{ secrets.KUBE_CONFIG_DEV }}

    - name: Deploy API Gateway with Helm
      run: |
        helm upgrade --install yyc3-api-gateway ./helm \
          --namespace yyc3-dev \
          --create-namespace \
          --set gateway.image.tag=${{ github.sha }} \
          --set gateway.replicaCount=2 \
          --set environment=development \
          --set database.host=$DB_HOST \
          --set database.port=$DB_PORT \
          --set database.name=$DB_NAME \
          --set database.user=$DB_USER \
          --set database.password=$DB_PASSWORD \
          --set redis.host=$REDIS_HOST \
          --set redis.port=$REDIS_PORT \
          --set jwt.secret=$JWT_SECRET
```

##### 3.3.3 生产环境部署

**部署策略**

- 手动审批：需要人工审批才能部署
- 部署目标：生产环境命名空间
- 副本数：3
- 自动扩缩容：启用

**配置示例**

```yaml
deploy-prod:
  name: Deploy to Production Environment
  runs-on: ubuntu-latest
  needs: [security-scan]
  if: github.ref == 'refs/heads/main'
  environment:
    name: production
    url: https://api.yyc3-catering.com
  steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Backup database before migration
      run: |
        kubectl run backup-job --rm -i --restart=Never \
          --image=yyc3-backend:${{ github.sha }} \
          --namespace=yyc3-prod \
          --env="DB_HOST=$DB_HOST" \
          --env="DB_PORT=$DB_PORT" \
          --env="DB_NAME=$DB_NAME" \
          --env="DB_USER=$DB_USER" \
          --env="DB_PASSWORD=$DB_PASSWORD" \
          -- npm run backup

    - name: Run database migrations
      run: |
        kubectl run migration-job --rm -i --restart=Never \
          --image=yyc3-backend:${{ github.sha }} \
          --namespace=yyc3-prod \
          --env="DB_HOST=$DB_HOST" \
          --env="DB_PORT=$DB_PORT" \
          --env="DB_NAME=$DB_NAME" \
          --env="DB_USER=$DB_USER" \
          --env="DB_PASSWORD=$DB_PASSWORD" \
          -- npm run migrate

    - name: Deploy API Gateway with Helm
      run: |
        helm upgrade --install yyc3-api-gateway ./helm \
          --namespace yyc3-prod \
          --create-namespace \
          --set gateway.image.tag=${{ github.sha }} \
          --set gateway.replicaCount=3 \
          --set environment=production \
          --set database.host=$DB_HOST \
          --set database.port=$DB_PORT \
          --set database.name=$DB_NAME \
          --set database.user=$DB_USER \
          --set database.password=$DB_PASSWORD \
          --set redis.host=$REDIS_HOST \
          --set redis.port=$REDIS_PORT \
          --set jwt.secret=$JWT_SECRET \
          --set resources.requests.cpu=500m \
          --set resources.requests.memory=512Mi \
          --set resources.limits.cpu=1000m \
          --set resources.limits.memory=1Gi \
          --set autoscaling.enabled=true \
          --set autoscaling.minReplicas=3 \
          --set autoscaling.maxReplicas=10

    - name: Rollback on failure
      if: failure()
      run: |
        helm rollback yyc3-api-gateway -n yyc3-prod
```

##### 3.3.4 Helm 部署脚本

**脚本功能**

- 检查 Helm 和 Kubernetes 连接
- 创建命名空间
- 更新 Chart 依赖
- 部署或升级 Release
- 查看部署状态

**脚本示例**

```bash
#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CHART_DIR="${SCRIPT_DIR}/charts/yyc3-catering-platform"
RELEASE_NAME="${RELEASE_NAME:-yyc3-test}"
NAMESPACE="${NAMESPACE:-test}"
VALUES_FILE="${VALUES_FILE:-${CHART_DIR}/values-test.yaml}"

echo "=== YYC³ 餐饮平台 Helm 部署脚本 ==="
echo ""
echo "配置信息:"
echo "  Release 名称: ${RELEASE_NAME}"
echo "  命名空间: ${NAMESPACE}"
echo "  Values 文件: ${VALUES_FILE}"
echo ""

echo "1. 检查 Helm 是否安装..."
if ! command -v helm &> /dev/null; then
    echo "❌ Helm 未安装，请先安装 Helm"
    echo "   安装命令: brew install helm"
    exit 1
fi
echo "✅ Helm 已安装: $(helm version --short)"
echo ""

echo "2. 检查 Kubernetes 连接..."
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ 无法连接到 Kubernetes 集群"
    echo "   请确保 kubectl 配置正确"
    exit 1
fi
echo "✅ Kubernetes 连接正常"
echo ""

echo "3. 创建命名空间 (如果不存在)..."
if ! kubectl get namespace "${NAMESPACE}" &> /dev/null; then
    echo "   创建命名空间: ${NAMESPACE}"
    kubectl create namespace "${NAMESPACE}"
else
    echo "   命名空间已存在: ${NAMESPACE}"
fi
echo ""

echo "4. 更新 Chart 依赖..."
helm dependency update "${CHART_DIR}"
echo "✅ 依赖更新完成"
echo ""

echo "5. 检查 Release 是否已存在..."
if helm status "${RELEASE_NAME}" -n "${NAMESPACE}" &> /dev/null; then
    echo "⚠️  Release 已存在，准备升级..."
    helm upgrade "${RELEASE_NAME}" "${CHART_DIR}" \
        -f "${VALUES_FILE}" \
        -n "${NAMESPACE}" \
        --wait \
        --timeout 10m
    echo "✅ Release 升级成功"
else
    echo "📦 准备安装新 Release..."
    helm install "${RELEASE_NAME}" "${CHART_DIR}" \
        -f "${VALUES_FILE}" \
        -n "${NAMESPACE}" \
        --wait \
        --timeout 10m
    echo "✅ Release 安装成功"
fi
echo ""

echo "6. 查看部署状态..."
helm status "${RELEASE_NAME}" -n "${NAMESPACE}"
echo ""

echo "7. 查看 Pod 状态..."
kubectl get pods -n "${NAMESPACE}" -l "app.kubernetes.io/instance=${RELEASE_NAME}"
echo ""

echo "8. 查看 Service 状态..."
kubectl get svc -n "${NAMESPACE}" -l "app.kubernetes.io/instance=${RELEASE_NAME}"
echo ""

echo "=== ✅ 部署完成 ==="
echo ""
echo "📋 部署摘要:"
echo "   - Release 名称: ${RELEASE_NAME}"
echo "   - 命名空间: ${NAMESPACE}"
echo "   - 状态: 已部署"
echo ""
echo "🔍 常用命令:"
echo "   查看状态: helm status ${RELEASE_NAME} -n ${NAMESPACE}"
echo "   查看 Pod: kubectl get pods -n ${NAMESPACE}"
echo "   查看日志: kubectl logs -n ${NAMESPACE} -l app.kubernetes.io/instance=${RELEASE_NAME} --tail=100"
echo "   卸载: helm uninstall ${RELEASE_NAME} -n ${NAMESPACE}"
```

#### 3.4 Docker 镜像构建

##### 3.4.1 多阶段构建规范

**构建阶段**

1. builder：依赖安装和构建
2. deps：生产依赖安装
3. production：最终镜像

**Dockerfile 示例**

```dockerfile
# YYC³ API网关 Dockerfile
# 多阶段构建，优化镜像大小和安全性

# 构建阶段 - 使用Bun进行依赖安装和构建
FROM oven/bun:1-alpine AS builder

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV NODE_ENV=development

# 复制依赖文件（先复制这些文件可以利用Docker缓存）
COPY package.json bun.lockb ./

# 安装依赖（包括开发依赖）
RUN bun install --frozen-lockfile --prod=false

# 复制源代码
COPY . .

# 构建应用
RUN bun run build

# 生产依赖安装阶段 - 只安装生产依赖
FROM oven/bun:1-alpine AS deps

WORKDIR /app

ENV NODE_ENV=production

COPY package.json bun.lockb ./

# 只安装生产依赖，减少镜像大小
RUN bun install --frozen-lockfile --production

# 生产阶段
FROM oven/bun:1-alpine AS production

# 安全配置
RUN addgroup -g 1001 -S yyc3 && \
    adduser -S yyc3 -u 1001 -G yyc3

# 安装必要的系统包（最小化安装）
RUN apk add --no-cache \
    curl=7.88.1-r1 \
    dumb-init=1.2.5-r1

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=8080
ENV LOG_LEVEL=info
ENV LOG_DIR=/app/logs

# 复制生产依赖
COPY --from=deps --chown=yyc3:yyc3 /app/node_modules ./node_modules

# 复制构建产物
COPY --from=builder --chown=yyc3:yyc3 /app/dist ./dist

# 复制必要的配置文件
COPY --from=builder --chown=yyc3:yyc3 /app/package.json ./package.json
COPY --from=builder --chown=yyc3:yyc3 /app/.env.example ./

# 创建必要的目录
RUN mkdir -p $LOG_DIR && \
    chown -R yyc3:yyc3 $LOG_DIR && \
    chmod 755 $LOG_DIR

# 切换到非root用户
USER yyc3

# 暴露端口
EXPOSE $PORT

# 健康检查 - 更详细的健康检查配置
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -s -f -X GET http://localhost:$PORT/health \
  && echo "OK" || exit 1

# 使用dumb-init作为PID 1，确保信号正确处理
ENTRYPOINT ["dumb-init", "--"]

# 启动应用
CMD ["bun", "run", "start"]
```

##### 3.4.2 镜像安全规范

**安全要求**

- 使用非 root 用户运行
- 最小化系统包安装
- 使用 Alpine Linux 基础镜像
- 定期更新基础镜像
- 扫描镜像漏洞

**安全检查**

```bash
# 使用 Trivy 扫描镜像
trivy image yyc3-backend:latest

# 使用 Docker Scout 扫描
docker scout quickview yyc3-backend:latest
```

#### 3.5 最佳实践

##### 3.5.1 构建优化

**依赖缓存**

- 使用 Docker 层缓存
- 使用 GitHub Actions 缓存
- 分离依赖安装和代码复制

**构建加速**

- 并行构建
- 增量构建
- 缓存构建产物

##### 3.5.2 部署优化

**滚动更新**

- 使用 Kubernetes 滚动更新
- 设置就绪探针
- 配置优雅停机

**回滚策略**

- 自动回滚：部署失败时自动回滚
- 手动回滚：提供快速回滚命令
- 版本保留：保留最近 N 个版本

##### 3.5.3 监控与告警

**部署监控**

- 部署状态监控
- Pod 健康状态监控
- 资源使用监控

**告警配置**

- 部署失败告警
- Pod 异常告警
- 资源超限告警

##### 3.5.4 安全最佳实践

**密钥管理**

- 使用 Kubernetes Secrets
- 使用 GitHub Secrets
- 定期轮换密钥
- 最小权限原则

**网络安全**

- 使用 Network Policy
- 限制 Pod 间通信
- 使用 TLS 加密

---

> 「**_YanYuCloudCube_**」
> 「**_<admin@0379.email>_**」
> 「**_Words Initiate Quadrants, Language Serves as Core for the Future_**」
> 「**_All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence_**」
