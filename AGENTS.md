# AGENTS.md

Guidance for AI agents working in the **YYC³ 餐饮行业智能化平台** (YYC³ Catering Intelligence Platform) repository. This is a polyglot pnpm monorepo combining a Vue 3 frontend, multiple Express/Bun backend microservices, shared TypeScript types, an agentic AI core, and Kubernetes/Helm deployment manifests.

> **Note on documentation language:** Code comments, log messages, error messages, and most docs are in **Chinese (Simplified)**. The codebase is bilingual: identifiers/keywords are English, but user-facing strings, log text, and many comments are Chinese. Match this convention when editing.

---

## 1. Repository Layout

```
yyc3-catering-platform/
├── frontend/apps/                 # pnpm workspace: Vue 3 apps
│   ├── admin-dashboard/           # @yyc3/admin-dashboard (primary UI, Element Plus, Pinia, ECharts)
│   ├── customer-app/              # customer-facing app
│   └── staff-app/                 # staff-facing app
├── backend/
│   ├── services/                  # pnpm workspace: microservices
│   │   ├── api-gateway/           # Express reverse-proxy gateway (port 3200) — CANONICAL gateway
│   │   ├── api-service/           # Bun-based core API service
│   │   ├── user-service/          # Express + Sequelize (MySQL) - port 3201
│   │   ├── order-service/         # port 3203
│   │   ├── payment-service/       # port 3204
│   │   ├── notification-service/  # port 3205 (RabbitMQ)
│   │   ├── menu-service/
│   │   ├── analytics-service/     # port 3303
│   │   ├── smart-kitchen/         # has own docker-compose, Prometheus, Mosquitto
│   │   ├── smart-ops-service/
│   │   ├── service-registry/      # Consul-based discovery
│   │   ├── redis-cache/
│   │   ├── ai-assistant/
│   │   ├── delivery-service/      # ⚠️ stub (no tests/tsconfig)
│   │   ├── chain-operation/       # ⚠️ stub
│   │   ├── food-safety/           # ⚠️ stub
│   │   ├── o2o-system/            # ⚠️ stub
│   │   └── microservice-template/ # 📌 canonical scaffold for new services
│   ├── shared/                    # @yyc3/shared-types (ApiResponse, Auth)
│   ├── common/                    # @yyc3/common (LoggerService, EventBusService, CommunicationService)
│   ├── api-gateway/               # ⚠️ LEGACY gateway dir (6 unit tests; not in docker-compose)
│   └── monitoring/
├── agentic-core/                  # AI agent framework (workspace pkg)
├── types/                         # @yyc3/types shared .d.ts entity definitions
├── archive/legacy-java/           # 📦 archived Spring (com.intelligenthub) sources — not built
├── helm/                          # Root Helm chart (yyc3-catering-platform)
├── infra/phase1/                  # Multi-cloud IaC: Terraform (AWS/Aliyun/Tencent),
│                                  #   Kubernetes manifests (EKS/TKE/ACK), per-service Helm charts
├── prometheus/ grafana/           # Monitoring configs
├── docker-compose.yaml            # Local infra: MySQL, Redis, Kafka, RabbitMQ, Consul,
│                                  #   Nacos, ELK, Prometheus, Grafana
├── tests/                         # Top-level integration/API tests
├── docs/                          # Mostly Chinese .md docs (planning, ops, design)
├── scripts/                       # setup-env.js, security fix shell scripts
├── AGENTS.md  PLAN.md             # 🤖 agent guide + 📋 improvement roadmap
└── package.json  pnpm-workspace.yaml  # workspace defs (kept in sync)
```

### Workspace definitions
- `package.json` `workspaces` **and** `pnpm-workspace.yaml` are now **aligned**: `frontend/*`, `backend/services/*`, `backend/common`, `backend/shared`, `agentic-core`.
- Use `pnpm --filter <pkg-name> <cmd>` to target a specific package.

---

## 2. Toolchain & Prerequisites

- **Node.js** ≥ 18, **npm** ≥ 9, **pnpm** 9 (CI pins pnpm 9 + Node 18.x)
- **Bun** ≥ 1.0 (used by `api-service` and referenced in CONTRIBUTING.md; gateway CI uses `oven-sh/setup-bun`)
- **PostgreSQL** 13+ *and* **MySQL** 8 (services are heterogeneous — see gotchas)
- **Redis** 6+, **RabbitMQ**, **Kafka**, **Consul**, **Nacos** (via docker-compose)
- **Helm** 3.9+ for deployments
- Engines declared in root `package.json`: `"node": ">=18.0.0"`, `"npm": ">=9.0.0"`

---

## 3. Essential Commands

All commands run from repo root unless noted. **Prefer `pnpm`** (CI uses pnpm; lockfile is `pnpm-lock.yaml`).

### Install
```bash
pnpm install            # runs scripts/setup-env.js via postinstall
```

### Development
```bash
pnpm dev                # concurrently: admin-dashboard + api-service
pnpm dev:admin          # @yyc3/admin-dashboard only
pnpm dev:customer       # customer-app
pnpm dev:staff          # staff-app
pnpm dev:backend        # api-service (Bun)
pnpm dev:all            # admin + customer + staff + backend concurrently
```

### Build
```bash
pnpm build              # build:frontend && build:backend
pnpm build:frontend     # pnpm --filter "frontend/*" build
pnpm build:backend      # pnpm --filter "backend/services/*" build
```

### Test
```bash
pnpm test               # unit + integration (via vitest configs)
pnpm test:unit          # vitest run --config vitest.unit.config.ts --coverage
pnpm test:integration   # vitest run --config vitest.integration.config.ts
pnpm test:smoke         # vitest run --config vitest.smoke.config.ts
pnpm test:coverage      # same as test:unit
pnpm test:e2e           # playwright test (admin-dashboard)
```
- Per-service tests: `pnpm --filter yyc3-user-service test` (most use `vitest run`; `api-service` uses `bun test`).
- Frontend component tests live next to source as `__tests__/*.test.ts` or `*.spec.ts`.
- Playwright config: `frontend/apps/admin-dashboard/playwright.config.ts` (baseURL `http://localhost:3200`, webServer auto-starts `pnpm dev`).

### Lint / Format / Type-check
```bash
pnpm lint               # eslint . --ext .ts,.tsx,.js,.jsx
pnpm lint:backend       # eslint backend --ext .ts
pnpm lint:frontend      # eslint frontend --ext .ts,.tsx
pnpm lint:security      # npm audit + eslint with security plugin
pnpm format             # prettier --write "**/*.{ts,tsx,js,jsx,json,md}"
pnpm format:check
pnpm type-check         # tsc --noEmit (root)
pnpm type-check:backend # tsc --noEmit -p backend/tsconfig.json
pnpm type-check:frontend# tsc --noEmit -p frontend/tsconfig.json
```

### Docker / Infra locally
```bash
pnpm docker:up          # docker-compose up -d (MySQL, Redis, Kafka, RabbitMQ, ...)
pnpm docker:down
pnpm docker:logs
```

### Database (delegated to api-service)
```bash
pnpm db:migrate
pnpm db:migrate:rollback
pnpm db:seed
pnpm db:backup
pnpm db:restore
```

### Deploy (Helm)
```bash
pnpm deploy:dev         # build + helm upgrade ... --namespace yyc3-dev
pnpm deploy:prod        # build + helm upgrade ... --namespace yyc3-prod
```

---

## 4. Backend Service Architecture

### Canonical microservice layout
See `backend/services/microservice-template/`. New services should follow:
```
src/
├── config/         config.ts, database.ts, logger.ts
├── controllers/    HTTP handlers (one per resource)
├── services/       business logic (instantiated as singletons, exported default)
├── models/         Sequelize/TypeORM models
├── routes/         express Router definitions
├── middleware/
├── __tests__/unit/ # mirrors src/ structure
└── app.ts          Express bootstrap
```

### Conventions observed
- **Express apps** (`user-service`, `order-service`, `payment-service`, `api-gateway`, ...):
  - Bootstrap pattern: `cors` → `helmet` → `compression` → `express.json` → `morgan` → routes → 404 → global error handler → `SIGINT`/`SIGTERM` graceful shutdown.
  - Health endpoint: `GET /health` returns `{ status: 'UP', service, timestamp }`.
  - Routes mounted at `/api/v1/<service-name>` for domain services; gateway proxies `/api/<resource>` → backend service URL.
  - Example: `backend/services/user-service/src/app.ts`, `backend/services/api-gateway/src/app.ts`.
- **Controllers** are classes with async methods, exported as a singleton instance (`export default new UserController()`). Response envelope:
  ```json
  { "code": 200, "message": "...", "data": {...} }
  ```
  (`backend/shared/types/ApiResponse.ts` defines `ApiResponse<T>` with `code/message/data/timestamp/success`.)
- **Models** use `sequelize-typescript` decorators (`@Table`, `@Column`, `@ForeignKey`, `@BelongsTo`, `@HasMany`). UUIDs as primary keys (`DataType.UUIDV4`). snake_case column names (`role_id`, `last_login_at`); tables plural (`users`, `order_items`).
- **Services** contain business logic; controllers are thin. See `user-service/src/controllers/UserController.ts` → `services/UserService.ts`.
- **Logging**: `winston` via per-service `config/logger.ts`. Chinese log messages are the norm (e.g. `'数据库连接成功'`).
- **Every TypeScript file has a JSDoc file header** with `@fileoverview`, `@description`, `@author YYC³`, `@version`, `@created`, `@copyright`, `@license`. The gateway CI explicitly checks for `@author YYC³` in headers.

### Service port map (from `api-gateway/src/config/services.ts`)
| Service | Default port |
|---|---|
| api-gateway | 3200 |
| user-service | 3201 |
| restaurant/menu | 3202 |
| order-service | 3203 |
| payment-service | 3204 |
| notification-service | 3205 |
| analytics-service | 3303 |

### Heterogeneity — read the package.json before assuming
- `api-service` (the one wired into `pnpm dev:backend`) is **Bun + PostgreSQL** — scripts use `bun --watch`, `bun build`, `bun test`. No Express; uses Bun's native HTTP.
- `user-service`, `order-service`, etc. are **Node + Express + MySQL (mysql2/sequelize-typescript)** — scripts use `nodemon`, `tsc`, `vitest`.
- `smart-kitchen` has its **own** `docker-compose.yml`, `vitest.config.ts`, Mosquitto, Prometheus scraping.
- `agentic-core` is a separate workspace package with its own `tsconfig.json`.
- Shared types split across `backend/shared/` (Auth, ApiResponse) and root `types/` (entities: menu, order, payment, table, user).

### API Gateway (`backend/services/api-gateway/`)
- Reverse proxy via `http-proxy-middleware`. Per-route factory `createProxyRoute(path, serviceName, secure)`.
- Authenticated routes use `authMiddleware`; public routes use `optionalAuthMiddleware`.
- On proxy, user identity is forwarded as `X-User-ID` / `X-User-Email` headers.
- Rate limiting middleware in `src/middleware/rateLimiter.ts`.

---

## 5. Frontend Architecture (`frontend/apps/`)

All three apps are **Vue 3 + `<script setup lang="ts">` + Vite + TypeScript**.

### admin-dashboard (`@yyc3/admin-dashboard`) — primary app
- **UI**: Element Plus + `@element-plus/icons-vue` + `radix-vue` + `lucide-vue-next`
- **State**: Pinia (`@/stores/auth`, `app`, `notification`, ...)
- **Router**: vue-router 4
- **Charts**: ECharts via `vue-echarts`; also `recharts`
- **Styling**: SCSS + Tailwind CSS 4 + CSS custom properties (`var(--color-primary)`, `--page-theme-color`). Design tokens imported from `@/styles/tokens.scss`.
- **Composables**: `@/composables/usePageTheme`, etc.
- **i18n**: `src/locales/{en-US,zh-CN,ja-JP}.ts`
- **Path alias**: `@` → `frontend/apps/admin-dashboard/src` (per-app tsconfig) *and* `@admin-dashboard` (root vitest config).
- **AI subsystem**: substantial code under `src/lib/` — `ai-widget/` (AutonomousAIEngine, MemorySystem, ToolRegistry, model adapters for OpenAI/internal), `closed-loop/`, `industries/`, `integration/`.

### Component conventions
- PascalCase filenames: `OrderDetailDialog.vue`, `MetricCard.vue`.
- Layout primitives prefixed `YT`: `YTGrid`, `YTLayout`, `YTResponsive`, `YTAnnouncer`, `YTFocusManager` (accessibility-aware).
- Views are flat under `src/views/` (one `.vue` per feature page). Tests sit in `src/views/__tests__/`.
- `<template>` → `<script setup lang="ts">` → `<style lang="scss" scoped>` ordering (see `App.vue`, CONTRIBUTING.md).
- Heavy use of `defineProps<Props>()` / `defineEmits<Emits>()` with TS interfaces.

### Frontend testing
- Unit: **Vitest** + `@vue/test-utils` + `@testing-library/vue` + jsdom. Config in `vitest.config.ts` (root) and per-app.
- E2E: **Playwright** — `admin-dashboard/tests/e2e/*.spec.ts`. `playwright.config.ts` auto-starts the dev server on port 3200.
- Pattern: mock Element Plus, icons, and child components with `vi.mock(...)` before mounting (see `views/__tests__/CustomerManagement.test.ts`).

---

## 6. TypeScript Configuration

Root `tsconfig.json` is **very strict**:
- `"strict": true` plus `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitReturns`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `strictPropertyInitialization`, etc.
- `target: ES2022`, `module: ESNext`, `moduleResolution: "bundler"`, `noEmit: true` (type-checking only).
- Root config **excludes** `frontend`, `backend`, `agentic-core`, `docs`, `tests` — each sub-project has its own `tsconfig.json`. Run `pnpm type-check:backend` / `type-check:frontend` for those.
- Path aliases (root): `@/*`, `@backend/*`, `@frontend/*`, `@agentic-core/*`, `@yyc3/types/*`.

### ESLint (`.eslintrc.cjs`)
- `@typescript-eslint/no-explicit-any: error`, `explicit-module-boundary-types: error`, `no-misused-promises: error`, `no-floating-promises: warn`.
- Root eslint **ignores** most sub-trees (`frontend`, `backend`, `agentic-core`, `packages`, `tests`, `types/unified.d.ts`, `test-*.js`, `ts-checker.js`, etc.). Sub-projects have their own eslint configs (e.g. `microservice-template/.eslintrc.json`).
- When adding a new TS file, ensure explicit return types on exported functions.

### Prettier (`.prettierrc.js`)
- `printWidth: 120`, `tabWidth: 2`, single quotes, `arrowParens: 'avoid'`, `trailingComma: 'es5'` (TS/TSX override: `'all'`), `endOfLine: 'lf'`, `semi: true`.

### Husky / lint-staged
- `pre-commit`: lint-staged (`eslint --fix` + `prettier --write` on `*.{ts,js}`; `prettier --write` on `*.{json,md}`).
- `pre-push`: `npm test`.

---

## 7. API & Naming Conventions

- **REST**: lowercase-hyphenated paths (`/api/v1/user-service/users/{id}/orders`).
- **DB tables**: plural, snake_case (`users`, `order_items`, `food_safety_records`).
- **DB columns**: snake_case; PK `id` (UUID); FK `{table_singular}_id` (`role_id`, `user_id`); timestamps `*_at` (`created_at`, `updated_at`, `last_login_at`).
- **Files**:
  - TS classes / Vue components: PascalCase (`UserController.ts`, `OrderDetailDialog.vue`).
  - Non-class TS modules: kebab-case or camelCase (template recommends kebab-case for non-class files).
- **Identifiers**:
  - Classes PascalCase; interfaces PascalCase (optionally `I`-prefixed for repository contracts, e.g. `IOrderRepository`).
  - Variables/functions camelCase, verb-first (`getUserById`, `createOrder`).
  - Constants UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`).
- **Service names**: kebab-case suffixed with `-service` (`user-service`, `payment-service`).
- **Commits**: Conventional Commits — `feat(scope):`, `fix(scope):`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `chore`. Common scopes: `order`, `kitchen`, `api`, `ui`, `service`, `deps`.
- **Branches** (Git Flow): `main` (prod), `develop`, `feature/*`, `hotfix/*`, `release/*`.

---

## 8. Response & Error Envelope

Unified response shape (see `backend/shared/types/ApiResponse.ts`):
```ts
interface ApiResponse<T = any> {
  code: number;        // HTTP-style status code
  message: string;     // human-readable (usually Chinese)
  data?: T;
  timestamp: number;
  requestId?: string;
  success: boolean;
}
```
- HTTP status code is also set on the response (e.g. `res.status(404).json({ code: 404, ... })`).
- Errors are logged via `winston` with Chinese messages; production should not leak stack traces.
- The api-gateway uses a slightly different shape (`{ success, error, code: 'NOT_FOUND' }`) — check the service you're editing.

---

## 9. Infrastructure & Deployment

- **`docker-compose.yaml`** (root): full local stack — MySQL 8 (`yyc3_catering` db, user `yyc3_user`), Redis 7 (password `123456`), Kafka + Zookeeper, RabbitMQ (vhost `/yyc3`), Consul, Nacos, ELK, Prometheus, Grafana. Builds `api-gateway` and `notification-service` images from their Dockerfiles.
- **Helm**: root chart at `helm/` (`yyc3-catering-platform`); per-service charts under `infra/phase1/iac/helm/charts/` (api-gateway, business-gateway, user-service, menu-service, order-service, payment-service, yyc3-catering-platform umbrella). Each chart includes `_helpers.tpl`, `deployment.yaml`, `service.yaml`, `hpa.yaml`, and (for edge services) `ingress.yaml`.
- **Multi-cloud IaC** under `infra/phase1/iac/`:
  - `terraform/{aws,aliyun,tencent}/main.tf`
  - `kubernetes/{eks,ack,tke}/` (EKS uses cert-manager, cilium, ingress-controller)
  - Setup scripts: `infra/phase1/scripts/setup-{aliyun,aws,tencent}.sh`
- **Service ports** in helm `values.yaml` mirror the dev port map above.
- **Production resources** (from CI): `requests: 500m/512Mi`, `limits: 1000m/1Gi`, HPA `minReplicas: 3, maxReplicas: 10`.

---

## 10. CI/CD

Three workflows in `.github/workflows/`:

### `ci-cd.yml` (root, pnpm-based)
Triggered on push/PR to `main`/`develop`. Jobs (sequential):
1. `lint-and-format` — pnpm 9, Node 18.x: `format`, `lint`, `type-check`.
2. `sonarqube-analysis` — runs `test:coverage`, uploads to SonarQube (needs `SONAR_TOKEN`, `SONAR_HOST_URL` secrets).
3. `test` — `test:unit` + `test:coverage`, uploads `coverage/` artifact.
4. `build-backend` / `build-frontend` (parallel) — uploads `dist/backend/` and `frontend/dist/`.
5. `security-scan` — `eslint-plugin-security`, Docker build of backend, **Trivy** scan (CRITICAL/HIGH), SARIF uploaded to GitHub Security tab.
6. `deploy-dev` (on `develop`) — Helm upgrade to `yyc3-dev`, runs kubectl migration job, health check, Slack notification. Auto-rollback not configured for dev.
7. `deploy-prod` (on `main`) — DB backup → migration → Helm upgrade to `yyc3-prod` (3 replicas, HPA), smoke tests, **helm rollback on failure**, Slack notify.

### `gateway-ci.yml` (Bun-based, scoped to `backend/gateway/**`)
Uses `oven-sh/setup-bun`. Includes quality check, SonarQube, test (with Redis service container), Docker build/push to `ghcr.io/<repo>/gateway` (multi-arch `linux/amd64,linux/arm64`), Trivy scan, integration test (k6 load test), staging/prod deploy, production performance test.

### `codeql.yml`
GitHub CodeQL analysis.

**Required GitHub secrets** (inferred): `SONAR_TOKEN`, `SONAR_HOST_URL`, `KUBE_CONFIG_DEV`, `KUBE_CONFIG_PROD`, `DB_*_DEV/PROD`, `REDIS_*_DEV/PROD`, `JWT_SECRET_DEV/PROD`, `SLACK_WEBHOOK`.

---

## 11. Testing Patterns

### Backend (Vitest)
- Location: `backend/services/<svc>/src/__tests__/unit/**/*.test.ts` — mirrors the `src/` tree (e.g. `services/UserService.test.ts` next to `services/UserService.ts`).
- Pattern: `vi.mock('<model-module>')` to stub Sequelize models, then `vi.spyOn(Model, 'findOne' | 'findByPk' | 'findAndCountAll' | 'create' | 'update' | 'destroy')` returning mock data. See `user-service/src/__tests__/unit/services/UserService.test.ts`.
- `beforeEach(() => vi.clearAllMocks())`.
- Test descriptions are in **Chinese** (e.g. `'应该成功注册新用户'`).
- Run via root `pnpm test:unit` or `pnpm --filter yyc3-<svc> test`.

### Frontend (Vitest + Vue Test Utils)
- Location: `frontend/apps/admin-dashboard/src/**/__tests__/*.test.ts` or `*.spec.ts`.
- Pattern: mock `@/api/*` modules, Element Plus (`ElMessage`, `ElMessageBox`, component stubs), `@element-plus/icons-vue`, and child `.vue` components with `vi.mock(..., () => ({ default: vi.fn() }))` before importing the component under test.
- Playwright E2E in `admin-dashboard/tests/e2e/` — tests `login` and `order-management` flows.

### Top-level tests
- `tests/api/{auth,menu,orders,ai-assistant}.test.ts` and `tests/example.test.ts`.
- `tests/run-tests.ts` is a custom runner.

---

## 12. Gotchas & Non-Obvious Patterns

1. ~~**README is partially out of date.**~~ **FIXED (2026-07-10):** README now reflects the actual Vue 3 + Element Plus stack and real directory structure. See `PLAN.md` D1.
2. **Mixed runtimes.** `api-service` runs on **Bun** (PostgreSQL); most other services run on **Node + Express** (MySQL via `sequelize-typescript`). Don't assume one runtime/DB — always check the service's `package.json`.
3. **Two databases.** MySQL (most services, docker-compose `yyc3_catering`) **and** PostgreSQL (api-service). Pick based on the specific service you're editing.
4. **Two "shared type" locations**: `backend/shared/` (runtime TS, workspace `@yyc3/shared-types`) and root `types/` (`.d.ts` only, `@yyc3/types/*`). They are not the same package. Note `backend/common/` (`@yyc3/common`) is a *third* shared package providing runtime services (LoggerService / EventBusService / CommunicationService).
5. **Root `tsconfig.json` excludes `frontend`, `backend`, `agentic-core`** — `pnpm type-check` only checks the root `src/`. Use `pnpm type-check:backend` / `type-check:frontend` for those trees. Each service also has its own `tsconfig.json`.
6. **Root ESLint also ignores** `frontend`, `backend`, `agentic-core`, `packages`, `tests`, `types/unified.d.ts`, `types/global.d.ts`, `test-*.js`, `ts-checker.js`, `check-versions.js`, `generate-test-token.js`, and `scripts/**`. Use the per-project eslint config or the `lint:backend` / `lint:frontend` scripts.
7. **Bilingual codebase.** Identifiers/keywords are English; log messages, error strings, JSDoc descriptions, and most docs/comments are Chinese. Don't translate existing Chinese strings to English unless asked.
8. **File headers are enforced.** Every backend `.ts` file should start with the YYC³ JSDoc block (`@fileoverview`, `@author YYC³`, `@version`, `@created`, `@copyright Copyright (c) <year> YYC³`, `@license MIT`). The gateway CI greps for `@author YYC³`.
9. **Vite/Vitest path aliases differ per config.** Root `vitest.config.ts` defines `@`, `@backend`, `@frontend`, `@utils`, `@admin-dashboard`; `vitest.unit.config.ts` defines a subset. The admin-dashboard's own tsconfig defines `@` → its `src/`. When writing imports in a service, prefer **relative paths** to avoid alias confusion. ⚠️ `vitest.api-gateway.config.ts` aliases `@` → `backend/api-gateway/src` (the **old** gateway dir) — tracked in `PLAN.md` P2-2.
10. **`smart-kitchen` is self-contained** — it has its own `docker-compose.yml`, `vitest.config.ts`, Mosquitto config, Prometheus scraper, and `.github/workflows/ci-cd.yml`. Treat it as a sub-project.
11. **`agentic-core/`** is a workspace package. Legacy Java sources under `com.intelligenthub` have been **moved to `archive/legacy-java/`** (not built, not referenced). The root `src/` now only holds `styles/`.
12. **Default dev credentials** in `docker-compose.yaml`: MySQL root/`yyc3_user` password `123456`, Redis password `123456`, RabbitMQ `admin`/`123456`, Grafana `admin`/`admin`. Never copy these into real env files; use `.env.example` as the template. Hardening tracked in `PLAN.md` D5.
13. **`postinstall` runs `scripts/setup-env.js`** — be aware that `pnpm install` executes this hook automatically.
14. ~~**`bun.lockb` exists alongside `pnpm-lock.yaml`**~~ **FIXED (2026-07-10):** `bun.lockb` and `*.backup` files removed; the repo now uses **pnpm only** (matches CI). `.npmrc` populated with sane pnpm defaults.
15. **Several services are stubs**: `delivery-service`, `chain-operation`, `food-safety`, `o2o-system` have minimal `src/` (often just `app.ts`) and **no tsconfig.json**. Don't assume a full implementation exists. Tracked in `PLAN.md` D4/P1-1.
16. **Three gateway directories** coexist: `backend/gateway/` (targeted by `gateway-ci.yml`, has own docker-compose), `backend/api-gateway/` (older, 6 unit tests, referenced by `vitest.api-gateway.config.ts`), and `backend/services/api-gateway/` (the **active** one built by root `docker-compose.yaml`). Consolidation tracked in `PLAN.md` P2-1 — until resolved, treat `backend/services/api-gateway/` as canonical.
17. **CI artifact paths were broken** (uploaded `dist/backend/` and `frontend/dist/` which never existed). **FIXED (2026-07-10):** `ci-cd.yml` now globs `backend/services/*/dist/` and `frontend/apps/*/dist/`; Docker build context pointed at `./backend/services/api-gateway`. See `PLAN.md` D6.
18. **`.gitignore` hardened** to prevent re-introduction of `*.bak`, `*.fileloc`, `*.lockb`, `*.backup`, and `test-results/`.

---

## 13. Agent Workflow Checklist

When making changes in this repo:

- [ ] Identify whether the target is frontend (Vue/Vite) or backend (Node/Express or Bun) — read the nearest `package.json`.
- [ ] Use `pnpm --filter <pkg-name> <script>` to run commands scoped to one workspace package.
- [ ] For backend changes: add/update the JSDoc `@author YYC³` file header.
- [ ] Match the existing response envelope (`{ code, message, data }` for domain services).
- [ ] Keep log/error messages in Chinese to match the codebase.
- [ ] Write tests under `src/__tests__/unit/...` mirroring the source path; mock Sequelize models with `vi.mock` + `vi.spyOn`.
- [ ] Run the scoped test command before finishing (`pnpm --filter <pkg> test` or root `pnpm test:unit`).
- [ ] Run `pnpm lint` and `pnpm type-check:<area>` on the affected tree.
- [ ] Use Conventional Commits with an appropriate scope (`feat(order): ...`).
- [ ] Don't push or commit unless explicitly instructed.

---

## 14. Key Reference Files

| Need | Look at |
|---|---|
| Microservice scaffold | `backend/services/microservice-template/` |
| Express + Sequelize example | `backend/services/user-service/src/` |
| Gateway proxy pattern | `backend/services/api-gateway/src/routes/index.ts` |
| Bun + Postgres service | `backend/services/api-service/` |
| Vue 3 app shell | `frontend/apps/admin-dashboard/src/App.vue` |
| Component test pattern | `frontend/apps/admin-dashboard/src/views/__tests__/CustomerManagement.test.ts` |
| Service test pattern | `backend/services/user-service/src/__tests__/unit/services/UserService.test.ts` |
| Shared API types | `backend/shared/types/ApiResponse.ts`, `backend/shared/types/Auth.ts` |
| Entity type defs | `types/entities/{menu,order,payment,table,user}.d.ts` |
| Dockerized infra | `docker-compose.yaml` |
| Helm umbrella chart | `helm/`, `infra/phase1/iac/helm/charts/yyc3-catering-platform/` |
| CI pipelines | `.github/workflows/{ci-cd,gateway-ci,codeql}.yml` |
| Contribution / commit rules | `CONTRIBUTING.md` |
