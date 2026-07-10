---

**@file**：YYC³-运维手册
**@description**：YYC³餐饮行业智能化平台的运维手册
**@author**：YYC³
**@version**：v1.0.0
**@created**：2025-01-30
**@updated**：2025-01-30
**@status**：published
**@tags**：YYC³,文档

---

# 🔖 YYC³ 运维手册

> **_YanYuCloudCube_**
> **标语**：言启象限 | 语枢未来
> **_Words Initiate Quadrants, Language Serves as Core for the Future_**
> **标语**：万象归元于云枢 | 深栈智启新纪元
> **_All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence_**

---

## 📋 文档信息

| 属性         | 内容                       |
| ------------ | -------------------------- |
| **文档标题** | YYC³ 运维手册              |
| **文档类型** | 技巧类文档                 |
| **所属阶段** | 运维运营                   |
| **遵循规范** | YYC³ 团队标准化规范 v1.0.0 |
| **版本号**   | v1.0.0                     |
| **创建日期** | 2025-01-30                 |
| **作者**     | YYC³ Team                  |
| **更新日期** | 2025-01-30                 |

---

## 📑 目录

1. [运维概述](#1-运维概述)
2. [环境管理](#2-环境管理)
3. [服务管理](#3-服务管理)
4. [配置管理](#4-配置管理)
5. [日志管理](#5-日志管理)
6. [监控管理](#6-监控管理)
7. [故障处理](#7-故障处理)
8. [运维最佳实践](#8-运维最佳实践)

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

## 1. 运维概述

### 1.1 运维目标

YYC³ 运维体系旨在确保系统的高可用性、高性能、高安全性和高可维护性，为业务提供稳定可靠的技术支撑。

### 1.2 运维原则

- **自动化优先**：尽可能自动化运维操作，减少人工干预
- **可观测性**：建立完善的监控和日志体系，确保系统可观测
- **快速响应**：建立快速响应机制，及时处理故障和问题
- **持续改进**：持续优化运维流程和工具，提升运维效率
- **安全合规**：确保运维操作符合安全和合规要求

---

## 2. 环境管理

### 2.1 环境分类

#### 2.1.1 环境类型

| 环境     | 用途       | 访问权限 | 数据来源     |
| -------- | ---------- | -------- | ------------ |
| 开发环境 | 开发测试   | 开发团队 | 测试数据     |
| 测试环境 | 集成测试   | 测试团队 | 测试数据     |
| 预发环境 | 预发布验证 | 运维团队 | 生产数据脱敏 |
| 生产环境 | 线上运行   | 运维团队 | 生产数据     |

### 2.2 环境配置

#### 2.2.1 环境变量管理

```bash
#!/bin/bash
# === env-setup.sh ===

# 开发环境
export NODE_ENV="development"
export API_BASE_URL="http://dev-api.yyc3.com"
export DB_HOST="dev-db.yyc3.com"
export DB_PORT="5432"
export DB_NAME="yyc3_dev"
export REDIS_HOST="dev-redis.yyc3.com"
export REDIS_PORT="6379"

# 测试环境
# export NODE_ENV="testing"
# export API_BASE_URL="http://test-api.yyc3.com"
# export DB_HOST="test-db.yyc3.com"
# export DB_PORT="5432"
# export DB_NAME="yyc3_test"
# export REDIS_HOST="test-redis.yyc3.com"
# export REDIS_PORT="6379"

# 预发环境
# export NODE_ENV="staging"
# export API_BASE_URL="http://staging-api.yyc3.com"
# export DB_HOST="staging-db.yyc3.com"
# export DB_PORT="5432"
# export DB_NAME="yyc3_staging"
# export REDIS_HOST="staging-redis.yyc3.com"
# export REDIS_PORT="6379"

# 生产环境
# export NODE_ENV="production"
# export API_BASE_URL="https://api.yyc3.com"
# export DB_HOST="prod-db.yyc3.com"
# export DB_PORT="5432"
# export DB_NAME="yyc3_prod"
# export REDIS_HOST="prod-redis.yyc3.com"
# export REDIS_PORT="6379"
```

### 2.3 环境切换

#### 2.3.1 环境切换脚本

```bash
#!/bin/bash
# === switch-env.sh ===

set -euo pipefail

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查参数
if [ $# -ne 1 ]; then
    log_error "Usage: $0 <env>"
    exit 1
fi

ENV=$1

# 验证环境
case $ENV in
    dev|test|staging|prod)
        ;;
    *)
        log_error "Invalid environment: $ENV"
        log_error "Valid environments: dev, test, staging, prod"
        exit 1
        ;;
esac

# 切换环境
log_info "Switching to $ENV environment..."

# 加载环境配置
source .env.$ENV

# 验证配置
if [ -z "$API_BASE_URL" ]; then
    log_error "API_BASE_URL not set"
    exit 1
fi

# 更新配置文件
sed -i.bak "s|API_BASE_URL=.*|API_BASE_URL=$API_BASE_URL|" .env

log_info "Environment switched successfully!"
log_info "Current environment: $ENV"
log_info "API Base URL: $API_BASE_URL"
```

---

## 3. 服务管理

### 3.1 服务启动

#### 3.1.1 服务启动脚本

```bash
#!/bin/bash
# === start-service.sh ===

set -euo pipefail

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查服务名称
if [ $# -ne 1 ]; then
    log_error "Usage: $0 <service-name>"
    exit 1
fi

SERVICE_NAME=$1

# 启动服务
log_info "Starting service: $SERVICE_NAME..."

# 使用 systemd 启动服务
if systemctl is-active --quiet $SERVICE_NAME; then
    log_warn "Service $SERVICE_NAME is already running"
    exit 0
fi

systemctl start $SERVICE_NAME

# 检查服务状态
if systemctl is-active --quiet $SERVICE_NAME; then
    log_info "Service $SERVICE_NAME started successfully"
else
    log_error "Failed to start service $SERVICE_NAME"
    exit 1
fi
```

### 3.2 服务停止

#### 3.2.1 服务停止脚本

```bash
#!/bin/bash
# === stop-service.sh ===

set -euo pipefail

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查服务名称
if [ $# -ne 1 ]; then
    log_error "Usage: $0 <service-name>"
    exit 1
fi

SERVICE_NAME=$1

# 停止服务
log_info "Stopping service: $SERVICE_NAME..."

# 使用 systemd 停止服务
if ! systemctl is-active --quiet $SERVICE_NAME; then
    log_warn "Service $SERVICE_NAME is not running"
    exit 0
fi

systemctl stop $SERVICE_NAME

# 检查服务状态
if ! systemctl is-active --quiet $SERVICE_NAME; then
    log_info "Service $SERVICE_NAME stopped successfully"
else
    log_error "Failed to stop service $SERVICE_NAME"
    exit 1
fi
```

### 3.3 服务重启

#### 3.3.1 服务重启脚本

```bash
#!/bin/bash
# === restart-service.sh ===

set -euo pipefail

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查服务名称
if [ $# -ne 1 ]; then
    log_error "Usage: $0 <service-name>"
    exit 1
fi

SERVICE_NAME=$1

# 重启服务
log_info "Restarting service: $SERVICE_NAME..."

# 使用 systemd 重启服务
systemctl restart $SERVICE_NAME

# 检查服务状态
if systemctl is-active --quiet $SERVICE_NAME; then
    log_info "Service $SERVICE_NAME restarted successfully"
else
    log_error "Failed to restart service $SERVICE_NAME"
    exit 1
fi
```

### 3.4 服务状态

#### 3.4.1 服务状态检查脚本

```bash
#!/bin/bash
# === check-service.sh ===

set -euo pipefail

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查服务名称
if [ $# -ne 1 ]; then
    log_error "Usage: $0 <service-name>"
    exit 1
fi

SERVICE_NAME=$1

# 检查服务状态
log_info "Checking service status: $SERVICE_NAME..."

if systemctl is-active --quiet $SERVICE_NAME; then
    log_info "Service $SERVICE_NAME is running"

    # 显示详细信息
    systemctl status $SERVICE_NAME --no-pager
else
    log_error "Service $SERVICE_NAME is not running"
    exit 1
fi
```

---

## 4. 配置管理

### 4.1 配置文件

#### 4.1.1 配置文件结构

```
/opt/yyc3/config/
├── application.yml       # 应用配置
├── database.yml          # 数据库配置
├── redis.yml            # Redis 配置
├── logging.yml          # 日志配置
└── monitoring.yml       # 监控配置
```

### 4.2 配置更新

#### 4.2.1 配置更新脚本

```bash
#!/bin/bash
# === update-config.sh ===

set -euo pipefail

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查参数
if [ $# -ne 2 ]; then
    log_error "Usage: $0 <config-file> <new-value>"
    exit 1
fi

CONFIG_FILE=$1
NEW_VALUE=$2

# 备份配置文件
BACKUP_FILE="${CONFIG_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
cp $CONFIG_FILE $BACKUP_FILE
log_info "Configuration file backed up to: $BACKUP_FILE"

# 更新配置
echo "$NEW_VALUE" >> $CONFIG_FILE

log_info "Configuration updated successfully!"
log_info "Backup file: $BACKUP_FILE"
```

### 4.3 配置验证

#### 4.3.1 配置验证脚本

```bash
#!/bin/bash
# === validate-config.sh ===

set -euo pipefail

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查参数
if [ $# -ne 1 ]; then
    log_error "Usage: $0 <config-file>"
    exit 1
fi

CONFIG_FILE=$1

# 验证配置文件
log_info "Validating configuration file: $CONFIG_FILE..."

# 检查文件是否存在
if [ ! -f "$CONFIG_FILE" ]; then
    log_error "Configuration file not found: $CONFIG_FILE"
    exit 1
fi

# 检查 YAML 语法
if command -v yamllint &> /dev/null; then
    if yamllint $CONFIG_FILE; then
        log_info "YAML syntax is valid"
    else
        log_error "YAML syntax is invalid"
        exit 1
    fi
fi

log_info "Configuration file is valid"
```

---

## 5. 日志管理

### 5.1 日志收集

#### 5.1.1 日志收集配置

```yaml
# === fluentd-config.yaml ===
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluentd-config
  namespace: yyc3-production
data:
  fluent.conf: |
    <source>
      @type tail
      path /var/log/containers/*.log
      pos_file /var/log/fluentd-containers.log.pos
      tag kubernetes.*
      read_from_head true
      <parse>
        @type json
      </parse>
    </source>

    <filter kubernetes.**>
      @type kubernetes_metadata
    </filter>

    <match **>
      @type elasticsearch
      host elasticsearch.logging.svc.cluster.local
      port 9200
      logstash_format true
      logstash_prefix yyc3
      logstash_dateformat %Y.%m.%d
      include_tag_key true
      type_name _doc
    </match>
```

### 5.2 日志查询

#### 5.2.1 日志查询脚本

```bash
#!/bin/bash
# === query-logs.sh ===

set -euo pipefail

# 配置
ELASTICSEARCH_HOST="elasticsearch.logging.svc.cluster.local"
ELASTICSEARCH_PORT="9200"
INDEX_PREFIX="yyc3"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 查询日志
query_logs() {
    local query=$1
    local time_range=$2

    log_info "Querying logs..."
    log_info "Query: $query"
    log_info "Time range: $time_range"

    # 使用 Elasticsearch API 查询日志
    curl -X GET "http://${ELASTICSEARCH_HOST}:${ELASTICSEARCH_PORT}/${INDEX_PREFIX}-*/_search" -H 'Content-Type: application/json' -d"
    {
      \"query\": {
        \"bool\": {
          \"must\": [
            { \"query_string\": { \"query\": \"$query\" } },
            { \"range\": { \"@timestamp\": { \"gte\": \"now-$time_range\" } } }
          ]
        }
      },
      \"sort\": [
        { \"@timestamp\": { \"order\": \"desc\" } }
      ],
      \"size\": 100
    }
    "
}

# 检查参数
if [ $# -ne 2 ]; then
    log_error "Usage: $0 <query> <time-range>"
    exit 1
fi

query_logs "$1" "$2"
```

### 5.3 日志清理

#### 5.3.1 日志清理脚本

```bash
#!/bin/bash
# === cleanup-logs.sh ===

set -euo pipefail

# 配置
LOG_DIR="/var/log/yyc3"
RETENTION_DAYS=30

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 清理日志
cleanup_logs() {
    log_info "Cleaning up old logs..."

    # 删除超过保留期的日志文件
    find $LOG_DIR -type f -name "*.log" -mtime +$RETENTION_DAYS -delete

    # 删除超过保留期的归档文件
    find $LOG_DIR -type f -name "*.gz" -mtime +$RETENTION_DAYS -delete

    log_info "Log cleanup completed"
}

# 主流程
main() {
    cleanup_logs
}

main "$@"
```

---

## 6. 监控管理

### 6.1 监控配置

#### 6.1.1 Prometheus 配置

```yaml
# === prometheus-config.yaml ===
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: "yyc3-app"
    static_configs:
      - targets: ["app.yyc3.com:9090"]
        labels:
          service: "yyc3-app"
          env: "production"

  - job_name: "yyc3-api"
    static_configs:
      - targets: ["api.yyc3.com:9090"]
        labels:
          service: "yyc3-api"
          env: "production"

  - job_name: "yyc3-db"
    static_configs:
      - targets: ["db.yyc3.com:9104"]
        labels:
          service: "yyc3-db"
          env: "production"

  - job_name: "yyc3-redis"
    static_configs:
      - targets: ["redis.yyc3.com:9121"]
        labels:
          service: "yyc3-redis"
          env: "production"
```

### 6.2 告警规则

#### 6.2.1 告警规则配置

```yaml
# === alert-rules.yaml ===
groups:
  - name: yyc3_alerts
    rules:
      - alert: HighCPUUsage
        expr: 100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage on {{ $labels.instance }}"
          description: "CPU usage is above 80% for more than 5 minutes"

      - alert: HighMemoryUsage
        expr: (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100 > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage on {{ $labels.instance }}"
          description: "Memory usage is above 80% for more than 5 minutes"

      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service {{ $labels.job }} is down"
          description: "Service {{ $labels.job }} on {{ $labels.instance }} has been down for more than 1 minute"
```

---

## 7. 故障处理

### 7.1 故障响应

#### 7.1.1 故障响应流程

```markdown
## 故障响应流程

### 1. 故障发现

- 监控告警触发
- 用户反馈问题
- 主动巡检发现

### 2. 故障确认

- 确认故障范围
- 确认故障影响
- 确认故障级别

### 3. 故障定位

- 查看日志
- 查看监控
- 分析原因

### 4. 故障处理

- 执行应急方案
- 修复故障
- 验证修复

### 5. 故障恢复

- 恢复服务
- 验证功能
- 通知相关人员

### 6. 故障总结

- 编写故障报告
- 分析根本原因
- 制定改进措施
```

### 7.2 故障分级

#### 7.2.1 故障级别定义

| 级别 | 响应时间 | 影响范围           | 处理优先级 |
| ---- | -------- | ------------------ | ---------- |
| P0   | 15 分钟  | 核心业务完全不可用 | 最高       |
| P1   | 30 分钟  | 核心功能不可用     | 高         |
| P2   | 1 小时   | 部分功能不可用     | 中         |
| P3   | 4 小时   | 非核心功能不可用   | 低         |
| P4   | 24 小时  | 轻微影响           | 最低       |

---

## 8. 运维最佳实践

### 8.1 最佳实践

#### 8.1.1 实践建议

```markdown
## 运维最佳实践

### 1. 自动化

- 使用自动化工具进行部署
- 使用自动化工具进行监控
- 使用自动化工具进行故障处理
- 减少人工干预

### 2. 可观测性

- 建立完善的监控体系
- 建立完善的日志体系
- 建立完善的告警体系
- 确保系统可观测

### 3. 安全性

- 定期进行安全扫描
- 定期更新安全补丁
- 定期进行安全审计
- 确保系统安全

### 4. 可靠性

- 建立灾备体系
- 定期进行灾备演练
- 建立故障恢复机制
- 确保系统可靠

### 5. 效率

- 优化运维流程
- 使用高效的工具
- 提升运维效率
- 降低运维成本
```

---

## 📄 文档标尾 (Footer)

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

- [🔖 YYC³ 日志分析与问题定位技巧](YYC3-Cater-运维运营/技巧类/03-YYC3-Cater--技巧类-日志分析与问题定位技巧.md) - YYC3-Cater-运维运营/技巧类
- [🔖 YYC³ 智能运维平台操作指南](YYC3-Cater-运维运营/技巧类/04-YYC3-Cater--技巧类-智能运维平台操作指南.md) - YYC3-Cater-运维运营/技巧类
- [🔖 YYC³ 灾备演练与恢复技巧](YYC3-Cater-运维运营/技巧类/05-YYC3-Cater--技巧类-灾备演练与恢复技巧.md) - YYC3-Cater-运维运营/技巧类
- [🔖 YYC³ 监控告警配置技巧](YYC3-Cater-运维运营/技巧类/02-YYC3-Cater--技巧类-监控告警配置技巧.md) - YYC3-Cater-运维运营/技巧类
- [🔖 YYC³ 系统性能优化运维技巧](YYC3-Cater-运维运营/技巧类/06-YYC3-Cater--技巧类-系统性能优化运维技巧.md) - YYC3-Cater-运维运营/技巧类
