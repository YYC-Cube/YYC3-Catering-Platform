# 🔖 YYC³ 监控告警模块

> **_YanYuCloudCube_**
> **标语**：言启象限 | 语枢未来
> **_Words Initiate Quadrants, Language Serves as Core for the Future_**
> **标语**：万象归元于云枢 | 深栈智启新纪元
> **_All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence_**

## 📋 概述

YYC³ 监控告警模块是一个基于 Prometheus 和 Grafana 的企业级监控系统，为 YYC³ 餐饮平台提供全面的指标收集、可视化展示和智能告警功能。该模块支持 HTTP 请求监控、数据库性能监控、业务指标监控和系统资源监控，帮助团队及时发现和解决问题。

## ✨ 核心特性

- **指标收集**: 自动收集应用程序、数据库和系统指标
- **实时监控**: 提供实时的性能指标和状态监控
- **智能告警**: 基于规则的智能告警，支持多级别告警
- **可视化仪表盘**: 预配置的 Grafana 仪表盘，直观展示关键指标
- **中间件支持**: Express 中间件，自动记录 HTTP 请求指标
- **自定义指标**: 支持创建自定义计数器、直方图和仪表盘
- **告警规则**: 内置丰富的告警规则，覆盖 API、数据库、系统和业务层面
- **多维度分析**: 支持按方法、路径、状态码等多维度分析

## 🏗️ 技术架构

### 核心组件

1. **PrometheusMetricsManager**: Prometheus 指标管理器
2. **AlertRules**: 告警规则配置和管理
3. **Grafana Dashboard**: 可视化仪表盘

### 监控指标类型

| 指标类型  | 说明             | 示例                    |
| --------- | ---------------- | ----------------------- |
| Counter   | 计数器，只增不减 | HTTP 请求总数、订单总数 |
| Histogram | 直方图，记录分布 | 请求延迟、订单金额      |
| Gauge     | 仪表盘，可增可减 | 活跃连接数、内存使用    |
| Summary   | 摘要，统计百分位 | 响应时间摘要            |

### 告警级别

| 级别     | 说明     | 响应时间     |
| -------- | -------- | ------------ |
| critical | 严重告警 | 立即响应     |
| warning  | 警告告警 | 30分钟内响应 |
| info     | 信息告警 | 1小时内响应  |

## 🚀 快速开始

### 安装依赖

```bash
cd backend/monitoring
pnpm install
```

### 构建项目

```bash
pnpm build
```

### 启动 Prometheus

```bash
# 使用 Docker Compose 启动
docker-compose up -d prometheus
```

### 启动 Grafana

```bash
# 使用 Docker Compose 启动
docker-compose up -d grafana
```

### 访问监控面板

- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (默认用户名/密码: admin/admin)

## 📖 使用指南

### 1. 初始化监控

```typescript
import { initMonitoring } from "@yyc3/monitoring";

const { metricsManager } = initMonitoring({
  prometheus: {
    defaultLabels: {
      service: "order-service",
      environment: "production",
    },
    prefix: "yyc3_catering",
    port: 9090,
  },
});
```

### 2. 使用 Express 中间件

```typescript
import express from "express";
import { prometheusMiddleware, initMonitoring } from "@yyc3/monitoring";

const app = express();

// 初始化监控
const { metricsManager } = initMonitoring();

// 添加 Prometheus 中间件
app.use(prometheusMiddleware(metricsManager));

// 添加指标端点
app.get("/metrics", async (req, res) => {
  const metrics = await metricsManager.getMetrics();
  res.set("Content-Type", "text/plain");
  res.end(metrics);
});

app.listen(3000);
```

### 3. 记录 HTTP 请求

```typescript
import { recordHttpRequest } from "@yyc3/monitoring";

// 手动记录 HTTP 请求
recordHttpRequest("GET", "/api/users", 200, 0.123);
```

### 4. 记录数据库查询

```typescript
import { recordDatabaseQuery } from "@yyc3/monitoring";

// 记录数据库查询
recordDatabaseQuery("select", "users", 0.045, "success");
recordDatabaseQuery("insert", "orders", 0.123, "error");
```

### 5. 记录业务指标

```typescript
import { recordOrder, recordUserAction } from "@yyc3/monitoring";

// 记录订单
recordOrder("completed", "wechat", 158.5);

// 记录用户操作
recordUserAction("login");
recordUserAction("register");
```

### 6. 创建自定义指标

```typescript
import { PrometheusMetricsManagerFactory } from "@yyc3/monitoring";

const metricsManager = PrometheusMetricsManagerFactory.getInstance();

// 创建自定义计数器
const productViewCounter = metricsManager.createCounter("product_views_total", "Total number of product views", [
  "product_id",
  "category",
]);

// 创建自定义直方图
const paymentDurationHistogram = metricsManager.createHistogram(
  "payment_duration_seconds",
  "Payment processing duration",
  ["payment_method"],
  [0.1, 0.5, 1, 2, 5]
);

// 创建自定义仪表盘
const queueSizeGauge = metricsManager.createGauge("queue_size", "Current queue size", ["queue_name"]);

// 使用自定义指标
productViewCounter.inc({ product_id: "123", category: "food" });
paymentDurationHistogram.observe({ payment_method: "alipay" }, 1.5);
queueSizeGauge.set({ queue_name: "order-queue" }, 42);
```

### 7. 导出告警规则

```typescript
import { exportAlertRulesToFile } from "@yyc3/monitoring";

// 导出告警规则到 YAML 文件
await exportAlertRulesToFile("./prometheus/rules/alerts.yml");
```

## 📊 监控指标

### HTTP 请求指标

| 指标名称                                      | 类型      | 说明                  |
| --------------------------------------------- | --------- | --------------------- |
| `yyc3_catering_http_requests_total`           | Counter   | HTTP 请求总数         |
| `yyc3_catering_http_request_duration_seconds` | Histogram | HTTP 请求持续时间     |
| `yyc3_catering_http_request_duration_summary` | Summary   | HTTP 请求持续时间摘要 |

### 数据库指标

| 指标名称                                        | 类型      | 说明               |
| ----------------------------------------------- | --------- | ------------------ |
| `yyc3_catering_database_queries_total`          | Counter   | 数据库查询总数     |
| `yyc3_catering_database_query_duration_seconds` | Histogram | 数据库查询持续时间 |
| `yyc3_catering_database_active_connections`     | Gauge     | 活跃数据库连接数   |
| `yyc3_catering_database_idle_connections`       | Gauge     | 空闲数据库连接数   |

### 业务指标

| 指标名称                        | 类型      | 说明         |
| ------------------------------- | --------- | ------------ |
| `yyc3_catering_orders_total`    | Counter   | 订单总数     |
| `yyc3_catering_order_amount`    | Histogram | 订单金额分布 |
| `yyc3_catering_users_total`     | Counter   | 用户总数     |
| `yyc3_catering_active_sessions` | Gauge     | 活跃会话数   |

## 🚨 告警规则

### API 告警

| 告警名称       | 触发条件      | 级别     |
| -------------- | ------------- | -------- |
| HighErrorRate  | 错误率 > 5%   | critical |
| HighLatency    | P95 延迟 > 1s | warning  |
| LowRequestRate | 请求率过低    | warning  |

### 数据库告警

| 告警名称                        | 触发条件           | 级别     |
| ------------------------------- | ------------------ | -------- |
| DatabaseConnectionPoolExhausted | 连接池使用率 > 90% | critical |
| DatabaseQuerySlow               | P95 延迟 > 500ms   | warning  |
| DatabaseErrorRate               | 错误率 > 1%        | critical |

### 系统告警

| 告警名称        | 触发条件           | 级别     |
| --------------- | ------------------ | -------- |
| HighCPUUsage    | CPU 使用率 > 80%   | warning  |
| HighMemoryUsage | 内存使用率 > 80%   | critical |
| DiskSpaceLow    | 磁盘可用空间 < 10% | critical |

### 业务告警

| 告警名称           | 触发条件         | 级别     |
| ------------------ | ---------------- | -------- |
| OrderRateLow       | 订单率过低       | warning  |
| OrderErrorRate     | 订单失败率 > 10% | critical |
| ActiveSessionsDrop | 活跃会话数 < 10  | info     |

## 🔧 API 文档

### PrometheusMetricsManager

| 方法                        | 说明             | 参数                                 |
| --------------------------- | ---------------- | ------------------------------------ |
| `recordHttpRequest`         | 记录 HTTP 请求   | `method, path, statusCode, duration` |
| `recordDatabaseQuery`       | 记录数据库查询   | `operation, table, duration, status` |
| `updateDatabaseConnections` | 更新数据库连接数 | `active, idle`                       |
| `recordOrder`               | 记录订单         | `status, paymentMethod, amount`      |
| `recordUserAction`          | 记录用户操作     | `action`                             |
| `updateActiveSessions`      | 更新活跃会话数   | `count`                              |
| `createCounter`             | 创建自定义计数器 | `name, help, labelNames`             |
| `createHistogram`           | 创建自定义直方图 | `name, help, labelNames, buckets`    |
| `createGauge`               | 创建自定义仪表盘 | `name, help, labelNames`             |
| `getMetrics`                | 获取指标数据     | -                                    |
| `clearMetrics`              | 清空所有指标     | -                                    |

### AlertRules

| 方法                         | 说明               | 参数       |
| ---------------------------- | ------------------ | ---------- |
| `generateAlertRulesYaml`     | 生成告警规则 YAML  | -          |
| `exportAlertRulesToFile`     | 导出告警规则到文件 | `filePath` |
| `findAlertRule`              | 查找告警规则       | `name`     |
| `filterAlertRulesBySeverity` | 按严重级别筛选     | `severity` |
| `getAllAlertRules`           | 获取所有告警规则   | -          |

## 🧪 测试

```bash
# 运行测试
pnpm test

# 运行测试并生成覆盖率报告
pnpm test:coverage
```

## 📊 性能指标

- **指标收集延迟**: < 1ms
- **内存占用**: < 50MB
- **CPU 使用率**: < 1%
- **最大并发连接**: 10000+

## 🔒 安全性

- 支持 Prometheus 基本认证
- 支持 TLS/SSL 加密通信
- 指标数据访问控制
- 告警通知加密

## 📝 配置说明

### Prometheus 配置

| 配置项          | 说明     | 默认值        |
| --------------- | -------- | ------------- |
| `defaultLabels` | 默认标签 | -             |
| `prefix`        | 指标前缀 | yyc3_catering |
| `port`          | 端口     | 9090          |
| `path`          | 指标路径 | /metrics      |

### Grafana 配置

| 配置项                    | 说明            | 默认值                 |
| ------------------------- | --------------- | ---------------------- |
| `datasource.url`          | Prometheus 地址 | http://prometheus:9090 |
| `datasource.timeInterval` | 查询间隔        | 15s                    |
| `dashboard.refresh`       | 刷新间隔        | 10s                    |

## 🐛 故障排查

### 问题1: 指标未显示

**症状**: Grafana 仪表盘显示无数据

**解决方案**:

1. 检查 Prometheus 是否正常运行
2. 验证指标端点是否可访问
3. 检查指标名称是否正确
4. 查看 Prometheus 日志

### 问题2: 告警未触发

**症状**: 告警条件满足但未收到告警

**解决方案**:

1. 检查告警规则是否正确加载
2. 验证告警持续时间是否满足
3. 检查 Alertmanager 配置
4. 查看告警日志

### 问题3: 指标延迟过高

**症状**: 指标收集延迟超过预期

**解决方案**:

1. 检查系统资源使用情况
2. 优化指标收集频率
3. 减少不必要的指标
4. 使用批量写入

## 📚 更多资源

- [Prometheus 官方文档](https://prometheus.io/docs/)
- [Grafana 官方文档](https://grafana.com/docs/)
- [Prometheus 最佳实践](https://prometheus.io/docs/practices/)
- [YYC³ 团队规范文档](../../../../../docs/YYC³团队标准化规范文档.md)

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: 添加某个功能'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 📄 文档标尾 (Footer)

> 「**_YanYuCloudCube_**」
> 「**_<admin@0379.email>_**」
> 「**_Words Initiate Quadrants, Language Serves as Core for the Future_**」
> 「**_All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence_**」
