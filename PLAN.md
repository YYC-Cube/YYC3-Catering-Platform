# YYC³ 餐饮平台 — 全局多维度完善拓展推进方案

> 本文档基于对全仓库的深度调研,系统梳理 7 大维度的问题现状、风险定级与分阶段执行计划。
> 制定日期:2026-07-10 | 维护者:YYC³ 团队 | 配套文档:`AGENTS.md`

---

## 0. 执行摘要 (Executive Summary)

本仓库是一个 **pnpm 单仓多包** 的餐饮智能化平台,包含 Vue 3 前端、多个 Express/Bun 微服务、agentic-core、Helm/IaC 部署。
调研发现:**文档与实现严重脱节**、**配置定义不一致**、**大量遗留文件被 git 跟踪**、**CI 产物路径错误**。
本方案按 **影响×风险** 矩阵划分 P0~P3,先执行低风险高价值的清理与修正,再推进中高风险的架构与安全项。

| 维度 | 现状摘要 | 风险 | 本轮处理 |
|---|---|---|---|
| D1 文档准确性 | README 把前端写成 React,实际是 Vue 3 | 中 | ✅ P0 |
| D2 配置一致性 | workspaces 双源不一致;双 lockfile;空 .npmrc | 中 | ✅ P0 |
| D3 代码卫生 | 18 个遗留文件被跟踪(.bak/.fileloc/游离脚本/备份) | 低 | ✅ P0 |
| D4 测试覆盖 | 4 个 stub 服务无 tsconfig/无测试 | 中 | 📋 P1(文档化) |
| D5 安全加固 | docker-compose 硬编码弱口令 | 高 | 📋 P1(文档化,不擅改) |
| D6 构建可靠性 | ci-cd.yml 产物路径 `dist/backend/` 不存在;Docker 上下文缺 Dockerfile | 高 | ✅ P0 |
| D7 开发者体验 | AGENTS.md 已建;.npmrc 空;别名不一致 | 低 | ✅ P0 |

**本轮执行范围(P0)**: D1 + D2 + D3 + D6 + D7,均为只读/删除/配置修正,不改业务代码,不触碰运行时凭据。
**延后范围(P1~P3)**: D4 测试补齐、D5 凭据轮换、stub 服务实现,需产品决策与业务知识,在 PLAN 中登记跟踪。

---

## 1. 调研方法与证据基线

| 检查项 | 命令 | 关键发现 |
|---|---|---|
| 遗留文件清单 | `git ls-files \| grep -E ...` | 18 个非源码文件被跟踪 |
| 服务完整性 | `for d in backend/services/*/` | 4 服务缺 tsconfig,12 服务缺 Dockerfile |
| CI 产物路径 | `grep dist/backend ci-cd.yml` | 上传 `dist/backend/` 但构建输出在 `backend/services/*/dist` |
| 配置一致性 | 对比 `package.json` workspaces vs `pnpm-workspace.yaml` | 后者多 `backend/common`,前者缺失 |
| 别名一致性 | 对比 5 个 vitest 配置 | `vitest.api-gateway.config.ts` 指向旧目录 `backend/api-gateway/src` |
| 网关目录 | `ls backend/gateway backend/api-gateway backend/services/api-gateway` | **三个** gateway 相关目录并存 |

---

## 2. D1 — 文档准确性 (P0 ✅)

### 问题
- `README.md` 技术栈写 **React 18 + YUButton/YUTable**,实际为 **Vue 3 + Element Plus + Pinia + ECharts**。
- 项目结构图引用 `ui/` 目录(早期),实际代码在 `frontend/apps/{admin,customer,staff}-app`。
- 完成度表格把"部署配置 0%"写成待开发,但 `helm/` 与 `infra/phase1/` 已存在多云 IaC。

### 处置
- 重写 README 的「技术栈」「项目结构」「快速开始」三段,以源码为准。
- 不删除既有徽章与品牌信息。

---

## 3. D2 — 配置一致性 (P0 ✅)

### 问题
| 项 | `package.json` | `pnpm-workspace.yaml` | 处置 |
|---|---|---|---|
| workspaces | `frontend/*, backend/services/*, agentic-core` | `frontend/*, backend/services/*, backend/common, agentic-core` | 对齐:加入 `backend/common` |
| lockfile | `pnpm-lock.yaml` + `bun.lockb` 并存 | — | 删 `bun.lockb`(CI 用 pnpm) |
| 备份 | `package.json.backup`, `pnpm-lock.yaml.backup` | — | 删除(git 历史可追溯) |
| `.npmrc` | 空文件 | — | 删除或填充合理默认 |

### 风险评估
- 删 `bun.lockb`:CI 全程 pnpm,`api-service` 虽用 Bun 但其依赖由各自 `package.json` 管理,不影响。低风险。

---

## 4. D3 — 代码卫生 (P0 ✅)

### 待移除(git-tracked,18 项)
**根目录游离脚本**(8): `test-nlp.js`, `test-nlp-simple.js`, `test-nlp-simple-2.js`, `test-nlp-complex.js`, `test-nlp-direct.js`, `test-nlp-with-auth.js`, `test-entity-regex.js`, `test-regex.js`, `ts-checker.js`, `check-versions.js`, `generate-test-token.js`, `demo-ts-checker.sh`
**macOS 残留**(3): `Users:.fileloc`, `docs/Users:.fileloc`, `docs/Users: 2.fileloc`
**备份/冗余**(4): `bun.lockb`, `package.json.backup`, `pnpm-lock.yaml.backup`, `frontend/.../MultiAgentCollaboration.vue.bak`
**孤立 Java 源**(6 文件): `src/main/java/com/intelligenthub/**` — 早期 Spring 残留,不在任何 workspace,无构建配置 → 移至 `archive/legacy-java/`。

### 处置原则
- 用 `git rm` 移除,保留 git 历史,可随时恢复。
- Java 源不直接删,先归档(`archive/`),便于追溯。

---

## 5. D4 — 测试覆盖 (P1 📋 文档化,本轮不执行)

### 现状
| 服务 | 文件数 | tsconfig | 测试 |
|---|---|---|---|
| o2o-system | 1 | ❌ | ❌ |
| chain-operation | 4 | ❌ | ❌ |
| food-safety | 4 | ❌ | ❌ |
| delivery-service | 15 | ✅ | ❌ |

### 建议(后续迭代)
1. 按 `microservice-template/` 补齐 tsconfig 与 `__tests__/unit/` 骨架。
2. `backend/common` 的 `package.json` 用 `jest`,应统一为 `vitest`(仓库标准)。
3. 为 `backend/api-gateway`(旧目录,6 个测试)与 `backend/services/api-gateway`(新)明确归属,合并或废弃其一。

### 不本轮执行的理由
需理解各服务业务逻辑与依赖边界,属功能开发,非清理范围。

---

## 6. D5 — 安全加固 (P1 📋 文档化,不擅改)

### 现状(`docker-compose.yaml`)
- MySQL/Redis/RabbitMQ 口令均为 `123456`;Grafana `admin/admin`;Nacos token 硬编码。
- 多处历史 commit 提到 "Fix hardcoded JWT secrets",说明已有治理但未完成。

### 建议
- 所有凭据改用 `${VAR:-default}` 从 `.env` 注入;`.env.example` 提供占位。
- 生产 Helm `values.yaml` 强制 `existingSecret` 引用。
- **本轮不修改**:改凭据会破坏本地开发栈,需与团队协调切换窗口。

---

## 7. D6 — 构建可靠性 (P0 ✅)

### 问题 1:CI 产物路径错误
```yaml
# .github/workflows/ci-cd.yml:138
- name: 上传后端构建产物
  uses: actions/upload-artifact@v4
  with:
    name: backend-build
    path: dist/backend/   # ❌ 不存在
```
`pnpm build:backend` 执行 `pnpm --filter "backend/services/*" build`,各服务 `tsc` 输出到 `backend/services/<svc>/dist/`,**不会**产出根 `dist/backend/`。
→ 该步骤自始至今在上传空目录/失败。

### 问题 2:Docker 构建上下文缺 Dockerfile
```yaml
# ci-cd.yml security-scan job
context: ./backend   # ❌ 无 backend/Dockerfile
```

### 问题 3:gateway 三目录并存
- `backend/gateway/`(gateway-ci.yml 目标,有独立 docker-compose)
- `backend/api-gateway/`(旧,含 6 测试,被 `vitest.api-gateway.config.ts` 引用)
- `backend/services/api-gateway/`(docker-compose.yaml 实际构建)

### 处置(本轮)
- 修正 ci-cd.yml 的 `path` 为 `backend/services/*/dist` 通配(artifact 支持glob)。
- Docker 上下文指向具体服务 `./backend/services/api-gateway`。
- 三 gateway 目录的归并登记为 P2(需确认哪个为权威实现)。

---

## 8. D7 — 开发者体验 (P0 ✅)
- `AGENTS.md` 已建立(上一轮)。
- `.npmrc` 空文件 → 删除或写默认(`shamefully-hoist=true` 等,依团队习惯)。
- vitest 别名不一致(`vitest.api-gateway.config.ts` 指旧目录)→ 登记 P2。

---

## 9. 执行顺序与验证

### Phase A — 文档(只读为主)
1. 撰写本 PLAN.md ✅
2. 修正 README.md

### Phase B — 清理(git rm)
3. 移除 18 个遗留跟踪文件
4. 归档 Java 源至 `archive/legacy-java/`

### Phase C — 配置
5. 对齐 `package.json` workspaces 加入 `backend/common`
6. 处理空 `.npmrc`

### Phase D — CI 修正
7. 修正 ci-cd.yml 产物路径与 Docker 上下文

### Phase E — 验证
8. `git status` 确认变更集
9. `pnpm type-check` / `pnpm lint`(若环境可用)干跑
10. 更新 AGENTS.md「Gotchas」反映已修复项

### 验证标准
- `git ls-files | grep -E '\.(bak|lockb|backup|fileloc)$'` 返回空。
- `package.json` 与 `pnpm-workspace.yaml` 的 workspaces 集合一致。
- ci-cd.yml 中 `path:` 指向真实存在的输出目录。

---

## 10. 风险矩阵与回滚

| 变更 | 风险 | 回滚 |
|---|---|---|
| 删 bun.lockb | 低(CI 用 pnpm) | `git checkout bun.lockb` |
| 删 .backup 文件 | 零 | git 历史 |
| 删游离 test-*.js | 低(已被 eslint ignore,非构建路径) | git 历史 |
| 改 README | 零(纯文档) | git revert |
| 对齐 workspaces | 低(新增 backend/common,不删既有) | 还原 package.json |
| 改 ci-cd.yml path | 低(原路径本就失败) | git revert |

所有变更为 **删除/文档/配置** 三类,不触碰业务源码,可独立 revert。

---

## 11. 后续路线图 (P1~P3,登记跟踪)

| ID | 项 | 维度 | 优先级 | 负责人 | 备注 |
|---|---|---|---|---|---|
| P1-1 | stub 服务补 tsconfig+测试骨架 | D4 | 高 | 后端 | o2o/chain/food-safety/delivery |
| P1-2 | backend.common 测试框架统一为 vitest | D4 | 中 | 后端 | 当前 jest |
| P1-3 | docker-compose 凭据改环境变量注入 | D5 | 高 | DevOps | 需切换窗口 |
| P1-4 | 生产 Helm 强制 existingSecret | D5 | 高 | DevOps | |
| P2-1 | 三 gateway 目录归并 | D6 | 中 | 架构 | 确认权威实现 |
| P2-2 | vitest.api-gateway.config 别名修正 | D7 | 中 | 前端 | |
| P2-3 | 补齐 12 服务的 Dockerfile | D6 | 中 | DevOps | |
| P3-1 | 全量 type-check 修复 | D2 | 低 | 全员 | strict 模式存量错误 |
| P3-2 | 国际化:英文文档镜像 | D1 | 低 | 文档 | |

---

## 12. 变更日志
| 日期 | 执行 | 结果 |
|---|---|---|
| 2026-07-10 | Phase A 撰写 PLAN.md | ✅ 完成 |
| 2026-07-10 | Phase B D1 修正 README.md(技术栈 React→Vue3 / 项目结构 / 完成度 / 部署 / 文档索引) | ✅ 完成 |
| 2026-07-10 | Phase B D3 清理 18 遗留文件 + 归档 Java 至 `archive/legacy-java/` | ✅ 完成 |
| 2026-07-10 | Phase B D3 `.gitignore` 加固(`*.bak/*.fileloc/*.lockb/*.backup/test-results/`) | ✅ 完成 |
| 2026-07-10 | Phase C D2 workspaces 对齐(加入 `backend/common` + `backend/shared`) + 填充 `.npmrc` | ✅ 完成 |
| 2026-07-10 | Phase D D6 修正 ci-cd.yml 产物路径(`backend/services/*/dist`、`frontend/apps/*/dist`)+ Docker 上下文 | ✅ 完成 |
| 2026-07-10 | Phase E 更新 AGENTS.md(Gotchas 标注已修复项 + 仓库结构同步) | ✅ 完成 |
| 待排期 | P1-1 stub 服务补 tsconfig+测试骨架 | 📋 已登记 |
| 待排期 | P1-3 docker-compose 凭据环境变量化 | 📋 已登记 |
| 待排期 | P2-1 三 gateway 目录归并 | 📋 已登记 |
| 2026-07-11 | D6+ GitHub Pages 部署(cater.yyc3.vip):新增 `deploy-pages.yml`、修复 Vite CDN hack / base 路径 / PWA 守卫、添加 CNAME / .nojekyll / 404 回退 / .env.production / 部署文档 | ✅ 完成 |
