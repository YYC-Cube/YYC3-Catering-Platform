# 归档目录 (Archive)

本目录存放**历史遗留代码**,不参与构建、不被任何 workspace 引用,仅用于追溯。

## `legacy-java/`

早期 Spring Boot (`com.intelligenthub`) 源码,包含:
- `controller/` — FormController / KnowledgeGraphController / MenuController
- `domain/` — BaseEntity / EntityStatus / user/User

**状态**: 已废弃。当前后端全部为 TypeScript(Express + Bun),Java 源不被构建。
**保留原因**: 业务逻辑参考;如确认无引用可于后续迭代删除。

> 详见 `PLAN.md` D3「代码卫生」。
