# Kafka主题配置文档

## 📋 概述

本文档定义了YYC³餐饮平台使用的所有Kafka主题及其配置规范。

## 🎯 主题命名规范

主题命名遵循以下格式：

```
{service}.{entity}.{action}
```

- **service**: 服务名称（user, order, restaurant, payment, delivery, notification, analytics）
- **entity**: 实体类型（user, order, payment, delivery, notification, event）
- **action**: 操作类型（created, updated, deleted, status, events）

## 📊 主题列表

### 1. 用户服务主题

#### `user.user.created`

- **描述**: 新用户创建事件
- **分区数**: 3
- **副本因子**: 2
- **保留时间**: 7天
- **用途**: 通知其他服务有新用户注册

#### `user.user.updated`

- **描述**: 用户信息更新事件
- **分区数**: 3
- **副本因子**: 2
- **保留时间**: 7天
- **用途**: 同步用户信息变更

#### `user.user.deleted`

- **描述**: 用户删除事件
- **分区数**: 3
- **副本因子**: 2
- **保留时间**: 7天
- **用途**: 清理相关用户数据

### 2. 订单服务主题

#### `order.order.created`

- **描述**: 新订单创建事件
- **分区数**: 5
- **副本因子**: 2
- **保留时间**: 30天
- **用途**: 触发订单处理流程

#### `order.order.updated`

- **描述**: 订单状态更新事件
- **分区数**: 5
- **副本因子**: 2
- **保留时间**: 30天
- **用途**: 同步订单状态变更

#### `order.order.status`

- **描述**: 订单状态变更通知
- **分区数**: 5
- **副本因子**: 2
- **保留时间**: 30天
- **用途**: 实时订单状态推送

#### `order.order.events`

- **描述**: 订单事件流（所有订单相关事件）
- **分区数**: 5
- **副本因子**: 2
- **保留时间**: 90天
- **用途**: 数据分析和审计

### 3. 餐厅服务主题

#### `restaurant.restaurant.created`

- **描述**: 新餐厅注册事件
- **分区数**: 3
- **副本因子**: 2
- **保留时间**: 7天
- **用途**: 通知新餐厅加入

#### `restaurant.restaurant.updated`

- **描述**: 餐厅信息更新事件
- **分区数**: 3
- **副本因子**: 2
- **保留时间**: 7天
- **用途**: 同步餐厅信息变更

#### `restaurant.menu.updated`

- **描述**: 菜单更新事件
- **分区数**: 3
- **副本因子**: 2
- **保留时间**: 7天
- **用途**: 更新缓存和搜索索引

### 4. 支付服务主题

#### `payment.payment.created`

- **描述**: 支付创建事件
- **分区数**: 5
- **副本因子**: 2
- **保留时间**: 30天
- **用途**: 触发支付处理

#### `payment.payment.status`

- **描述**: 支付状态变更事件
- **分区数**: 5
- **副本因子**: 2
- **保留时间**: 30天
- **用途**: 通知支付结果

#### `payment.payment.events`

- **描述**: 支付事件流
- **分区数**: 5
- **副本因子**: 2
- **保留时间**: 90天
- **用途**: 支付数据分析和审计

### 5. 配送服务主题

#### `delivery.delivery.created`

- **描述**: 配送任务创建事件
- **分区数**: 5
- **副本因子**: 2
- **保留时间**: 30天
- **用途**: 分配送送任务

#### `delivery.delivery.updated`

- **描述**: 配送状态更新事件
- **分区数**: 5
- **副本因子**: 2
- **保留时间**: 30天
- **用途**: 同步配送状态

#### `delivery.delivery.status`

- **描述**: 配送状态通知
- **分区数**: 5
- **副本因子**: 2
- **保留时间**: 30天
- **用途**: 实时配送状态推送

### 6. 通知服务主题

#### `notification.notification.events`

- **描述**: 通知事件流
- **分区数**: 3
- **副本因子**: 2
- **保留时间**: 7天
- **用途**: 统一通知处理

#### `notification.email.events`

- **描述**: 邮件通知事件
- **分区数**: 3
- **副本因子**: 2
- **保留时间**: 30天
- **用途**: 邮件发送记录

#### `notification.sms.events`

- **描述**: 短信通知事件
- **分区数**: 3
- **副本因子**: 2
- **保留时间**: 30天
- **用途**: 短信发送记录

### 7. 分析服务主题

#### `analytics.user.events`

- **描述**: 用户行为事件
- **分区数**: 10
- **副本因子**: 2
- **保留时间**: 90天
- **用途**: 用户行为分析

#### `analytics.order.events`

- **描述**: 订单分析事件
- **分区数**: 10
- **副本因子**: 2
- **保留时间**: 90天
- **用途**: 订单数据分析

#### `analytics.restaurant.events`

- **描述**: 餐厅分析事件
- **分区数**: 10
- **副本因子**: 2
- **保留时间**: 90天
- **用途**: 餐厅数据分析

## 🔧 主题创建脚本

### 自动创建所有主题

```bash
# 使用API网关的Kafka管理接口
curl -X POST http://localhost:3200/api/kafka/topics/create \
  -H "Content-Type: application/json" \
  -d '{
    "topics": [
      {
        "name": "user.user.created",
        "partitions": 3,
        "replicationFactor": 2
      },
      {
        "name": "user.user.updated",
        "partitions": 3,
        "replicationFactor": 2
      },
      {
        "name": "user.user.deleted",
        "partitions": 3,
        "replicationFactor": 2
      },
      {
        "name": "order.order.created",
        "partitions": 5,
        "replicationFactor": 2
      },
      {
        "name": "order.order.updated",
        "partitions": 5,
        "replicationFactor": 2
      },
      {
        "name": "order.order.status",
        "partitions": 5,
        "replicationFactor": 2
      },
      {
        "name": "order.order.events",
        "partitions": 5,
        "replicationFactor": 2
      },
      {
        "name": "restaurant.restaurant.created",
        "partitions": 3,
        "replicationFactor": 2
      },
      {
        "name": "restaurant.restaurant.updated",
        "partitions": 3,
        "replicationFactor": 2
      },
      {
        "name": "restaurant.menu.updated",
        "partitions": 3,
        "replicationFactor": 2
      },
      {
        "name": "payment.payment.created",
        "partitions": 5,
        "replicationFactor": 2
      },
      {
        "name": "payment.payment.status",
        "partitions": 5,
        "replicationFactor": 2
      },
      {
        "name": "payment.payment.events",
        "partitions": 5,
        "replicationFactor": 2
      },
      {
        "name": "delivery.delivery.created",
        "partitions": 5,
        "replicationFactor": 2
      },
      {
        "name": "delivery.delivery.updated",
        "partitions": 5,
        "replicationFactor": 2
      },
      {
        "name": "delivery.delivery.status",
        "partitions": 5,
        "replicationFactor": 2
      },
      {
        "name": "notification.notification.events",
        "partitions": 3,
        "replicationFactor": 2
      },
      {
        "name": "notification.email.events",
        "partitions": 3,
        "replicationFactor": 2
      },
      {
        "name": "notification.sms.events",
        "partitions": 3,
        "replicationFactor": 2
      },
      {
        "name": "analytics.user.events",
        "partitions": 10,
        "replicationFactor": 2
      },
      {
        "name": "analytics.order.events",
        "partitions": 10,
        "replicationFactor": 2
      },
      {
        "name": "analytics.restaurant.events",
        "partitions": 10,
        "replicationFactor": 2
      }
    ]
  }'
```

### 单独创建主题

```bash
# 创建单个主题
curl -X POST http://localhost:3200/api/kafka/topics \
  -H "Content-Type: application/json" \
  -d '{
    "name": "user.user.created",
    "partitions": 3,
    "replicationFactor": 2
  }'
```

### 查看所有主题

```bash
curl http://localhost:3200/api/kafka/topics
```

### 查看主题详情

```bash
curl http://localhost:3200/api/kafka/topics/user.user.created
```

## 📝 消息格式规范

### 事件消息格式

```json
{
  "eventId": "uuid",
  "eventType": "created|updated|deleted|status",
  "eventTime": "ISO8601 timestamp",
  "source": "service-name",
  "data": {
    // 具体业务数据
  },
  "metadata": {
    "version": "1.0.0",
    "correlationId": "uuid",
    "causationId": "uuid"
  }
}
```

### 示例消息

#### 用户创建事件

```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440000",
  "eventType": "created",
  "eventTime": "2025-01-30T10:00:00Z",
  "source": "user-service",
  "data": {
    "userId": "user-123",
    "email": "user@example.com",
    "name": "张三",
    "phone": "13800138000"
  },
  "metadata": {
    "version": "1.0.0",
    "correlationId": "550e8400-e29b-41d4-a716-446655440001",
    "causationId": "550e8400-e29b-41d4-a716-446655440002"
  }
}
```

#### 订单创建事件

```json
{
  "eventId": "660e8400-e29b-41d4-a716-446655440000",
  "eventType": "created",
  "eventTime": "2025-01-30T10:05:00Z",
  "source": "order-service",
  "data": {
    "orderId": "order-456",
    "userId": "user-123",
    "restaurantId": "restaurant-789",
    "items": [
      {
        "menuItemId": "item-1",
        "name": "宫保鸡丁",
        "quantity": 2,
        "price": 38.0
      }
    ],
    "totalAmount": 76.0,
    "deliveryAddress": "北京市朝阳区xxx"
  },
  "metadata": {
    "version": "1.0.0",
    "correlationId": "660e8400-e29b-41d4-a716-446655440001",
    "causationId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

## 🚀 消费者组配置

### 推荐消费者组配置

| 服务     | 消费者组ID                 | 订阅主题                                   | 说明               |
| -------- | -------------------------- | ------------------------------------------ | ------------------ |
| 用户服务 | user-service-group         | user.user.\*                               | 用户相关事件       |
| 订单服务 | order-service-group        | user.user._, restaurant.restaurant._       | 用户和餐厅事件     |
| 支付服务 | payment-service-group      | order.order.created                        | 订单创建事件       |
| 配送服务 | delivery-service-group     | order.order.status, payment.payment.status | 订单和支付状态     |
| 通知服务 | notification-service-group | _.status, _.created                        | 所有状态和创建事件 |
| 分析服务 | analytics-service-group    | \*.events                                  | 所有事件流         |

### 消费者配置示例

```javascript
{
  "groupId": "order-service-group",
  "topics": ["user.user.created", "user.user.updated", "restaurant.restaurant.updated"],
  "autoCommit": true,
  "autoCommitInterval": 5000,
  "sessionTimeout": 30000,
  "heartbeatInterval": 3000,
  "maxPollRecords": 100,
  "maxPollInterval": 300000
}
```

## 🔍 监控与告警

### 关键指标

- **消息积压量**: 监控各主题的消费者延迟
- **消息吞吐量**: 监控每秒消息生产/消费数量
- **消费者延迟**: 监控消费者处理延迟
- **主题分区健康**: 监控分区是否均衡

### 告警规则

- 消息积压量 > 10000: 发送警告
- 消费者延迟 > 5分钟: 发送警告
- 消息吞吐量异常下降: 发送警告
- 主题分区不均衡: 发送警告

## 📚 最佳实践

1. **主题设计**
   - 使用有意义的前缀组织主题
   - 根据消息量合理设置分区数
   - 生产环境至少2个副本因子

2. **消息生产**
   - 使用批处理提高吞吐量
   - 设置合理的消息压缩
   - 实现消息幂等性

3. **消息消费**
   - 使用消费者组实现负载均衡
   - 实现优雅的消费者关闭
   - 处理消费异常和重试

4. **监控运维**
   - 定期监控主题健康状态
   - 及时清理过期主题
   - 定期备份重要主题数据

## 🔄 版本历史

| 版本  | 日期       | 说明                   |
| ----- | ---------- | ---------------------- |
| 1.0.0 | 2025-01-30 | 初始版本，定义23个主题 |

---

> 「**_YanYuCloudCube_**」
> 「**_<admin@0379.email>_**」
> 「**_Words Initiate Quadrants, Language Serves as Core for the Future_**」
> 「**_All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence_**」
