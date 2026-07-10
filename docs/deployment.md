# GitHub Pages 部署说明

> 自定义域名:**cater.yyc3.vip** | 仓库:`YYC-Cube/YYC3-Catering-Platform`

本文档说明如何将管理后台(admin-dashboard)部署到 GitHub Pages,以及如何排查常见问题。

---

## 1. 架构概览

```
开发者 push → main 分支
       │
       ▼
GitHub Actions (.github/workflows/deploy-pages.yml)
       │
       ├─ pnpm install
       ├─ pnpm --filter @yyc3/admin-dashboard build   (Vite 构建)
       ├─ cp index.html → 404.html                    (SPA 回退)
       ├─ touch .nojekyll                             (禁用 Jekyll)
       └─ upload-pages-artifact + deploy-pages
                │
                ▼
       GitHub Pages (Source: GitHub Actions)
                │
                ▼
       cater.yyc3.vip (CNAME 已配置)
```

**部署的是管理后台单应用**(customer-app / staff-app 为 stub,不部署)。

---

## 2. 一次性配置(已在仓库完成)

以下文件均已就位,**无需重复操作**:

| 文件 | 作用 |
|---|---|
| `frontend/apps/admin-dashboard/public/CNAME` | 内容为 `cater.yyc3.vip`,告诉 GitHub Pages 使用此自定义域名 |
| `frontend/apps/admin-dashboard/public/.nojekyll` | 禁用 Jekyll 处理,避免 `_` 开头资源被忽略 |
| `frontend/apps/admin-dashboard/.env.production` | 生产环境变量(`VITE_BASE_PATH=/`、`VITE_API_BASE_URL`) |
| `.github/workflows/deploy-pages.yml` | CI/CD 部署工作流 |
| `vite.config.ts` 的 `base` | 通过 `VITE_BASE_PATH` 控制,自定义域名默认 `/` |

---

## 3. GitHub 仓库端配置(需手动确认)

### 3.1 Pages Source

进入 **Settings → Pages → Build and deployment → Source**,选择:

```
☑ GitHub Actions
```

(不要选 "Deploy from a branch",因为我们用 workflow 部署)

### 3.2 自定义域名

进入 **Settings → Pages → Custom domain**,输入:

```
cater.yyc3.vip
```

勾选 **Enforce HTTPS**(建议)。

> 如果你已在 DNS 提供商配置了 CNAME 记录指向 `<user>.github.io`,此步骤可跳过。

### 3.3 后端 API Secret(可选,后端就绪后配置)

当前前端 API 调用回退到 `localhost`(仅 UI 可用)。后端上线后,添加 Secret:

**Settings → Secrets and variables → Actions → New repository secret**

```
Name:  VITE_API_BASE_URL
Value: https://api.yyc3.vip/api/v1   (替换为真实地址)
```

---

## 4. DNS 配置(参考)

在域名 `yyc3.vip` 的 DNS 管理面板添加:

| 类型 | 主机 | 值 | TTL |
|---|---|---|---|
| CNAME | `cater` | `yyccube.github.io` | 3600 |

验证:

```bash
dig cater.yyc3.vip +short
# 应返回: yyccube.github.io 或 GitHub Pages IP
```

> `<user>` 替换为 GitHub 组织/用户名。若不确定,查看仓库 Settings → Pages 顶部提示。

---

## 5. 触发部署

### 自动触发

push 到 `main` 分支且改动以下路径时自动部署:
- `frontend/apps/admin-dashboard/**`
- `.github/workflows/deploy-pages.yml`

### 手动触发

GitHub 仓库 → **Actions** → **Deploy to GitHub Pages** → **Run workflow**。

### 查看部署状态

```bash
gh run list --workflow=deploy-pages.yml --limit 5
gh run watch
```

---

## 6. 本次解决的问题清单

| # | 问题 | 修复 |
|---|---|---|
| 1 | **无 Pages 部署 workflow** | 新增 `deploy-pages.yml`(独立于 K8s 流水线) |
| 2 | **Vite `base` 未设置** | 改为 `VITE_BASE_PATH` 环境变量驱动,默认 `/` |
| 3 | **`renderBuiltUrl` 硬编码 CDN** | 移除 `https://cdn.yyc3.com/` hack(JS 会 404) |
| 4 | **无 CNAME 文件** | 添加 `public/CNAME`(内容 `cater.yyc3.vip`) |
| 5 | **无 `.nojekyll`** | 添加空文件禁用 Jekyll |
| 6 | **SPA 深层路由刷新 404** | 部署步骤 `cp index.html → 404.html` |
| 7 | **PWA `/sw.js` 不存在导致 404** | `main.ts` 改为先 `HEAD` 探测再注册 |
| 8 | **无生产环境变量** | 添加 `.env.production` |

---

## 7. 本地验证构建

```bash
cd frontend/apps/admin-dashboard
pnpm install
pnpm build
```

产物在 `frontend/apps/admin-dashboard/dist/`,应包含:
- `index.html`
- `404.html`(CI 中生成)
- `CNAME`、`.nojekyll`(从 `public/` 复制)
- `assets/js/*.js`、`assets/css/*.css`

本地预览:

```bash
pnpm preview   # http://localhost:3101
```

---

## 8. 常见问题排查

### Q1: 访问 `cater.yyc3.vip` 显示 GitHub 默认 404

- 检查 **Settings → Pages → Source** 是否为 "GitHub Actions"
- 检查 `deploy-pages.yml` 是否运行成功(Actions 标签页)
- 确认 DNS CNAME 已生效(`dig cater.yyc3.vip`)

### Q2: 页面白屏,控制台 JS 404

- 确认 `vite.config.ts` 的 `base` 与部署路径一致
- 自定义域名 → `base: '/'`
- 未用自定义域名 → `base: '/YYC3-Catering-Platform/'`(设 `VITE_BASE_PATH`)
- 确认 `.nojekyll` 存在(否则 Jekyll 会丢弃部分资源)

### Q3: 刷新 `/dashboard` 等深层路由 404

- 确认 `404.html` 已生成(workflow 中的 `cp` 步骤)
- 这是 GitHub Pages SPA 的标准 workaround

### Q4: 登录功能不可用

- 前端默认调用 `http://localhost:3006/api/v1`,生产环境会失败
- 后端就绪后配置 `VITE_API_BASE_URL` secret
- 当前可用演示账号:UI 会渲染,但 API 调用失败

### Q5: 部署成功但域名访问不到

- DNS 传播可能需要几分钟到几小时
- 确认 **Enforce HTTPS** 已开启(HTTP 可能被重定向)
- 检查 `CNAME` 文件内容是否为纯域名(无协议、无路径)

---

## 9. 相关文件索引

| 文件 | 说明 |
|---|---|
| `.github/workflows/deploy-pages.yml` | 部署工作流 |
| `frontend/apps/admin-dashboard/vite.config.ts` | Vite 构建 + base 路径 |
| `frontend/apps/admin-dashboard/.env.production` | 生产环境变量 |
| `frontend/apps/admin-dashboard/public/CNAME` | 自定义域名声明 |
| `frontend/apps/admin-dashboard/public/.nojekyll` | Jekyll 禁用标记 |
| `frontend/apps/admin-dashboard/src/main.ts` | PWA 守卫修复 |
| `AGENTS.md` | 仓库整体约定 |
| `PLAN.md` | 完善推进方案 |
