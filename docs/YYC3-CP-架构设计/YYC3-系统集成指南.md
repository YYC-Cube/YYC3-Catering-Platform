# YYC³餐饮行业智能化平台 - 系统集成指南

## 文档信息

| 项目 | 内容 |
|-----|------|
| 文档编号 | YYC3-AICP-SIG-001 |
| 文档名称 | 系统集成指南 |
| 版本号 | v1.0.0 |
| 创建日期 | 2026-01-21 |
| 最后更新 | 2026-01-21 |
| 文档状态 | 正式发布 |
| 作者 | YYC³ |

---

## 1. 快速开始

### 1.1 安装依赖

```bash
# 安装必要的依赖
npm install zustand immer
npm install -D @types/node
```

### 1.2 配置环境变量

在`.env.local`文件中添加以下环境变量：

```env
# API基础URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# WebSocket基础URL
NEXT_PUBLIC_WS_BASE_URL=ws://localhost:3000

# 租户ID（可选）
NEXT_PUBLIC_TENANT_ID=your-tenant-id
```

### 1.3 初始化API客户端

```typescript
import { apiClient } from '@/lib/integration/ui-business-integration';

// 设置认证令牌
apiClient.setToken('your-jwt-token');

// 设置租户ID
apiClient.setTenantId('your-tenant-id');
```

---

## 2. UI层与业务逻辑层集成

### 2.1 基础API调用

#### 2.1.1 使用API客户端

```typescript
import { apiClient } from '@/lib/integration/ui-business-integration';

// GET请求
const response = await apiClient.get('/orders');
if (response.success) {
  console.log(response.data);
}

// POST请求
const response = await apiClient.post('/orders', {
  customerId: 'customer-123',
  items: [
    { productId: 'product-1', quantity: 2 },
  ],
});

// PUT请求
const response = await apiClient.put('/orders/123', {
  status: 'completed',
});

// DELETE请求
const response = await apiClient.delete('/orders/123');
```

#### 2.1.2 使用React Hooks

```typescript
import { useApi, useApiMutation } from '@/lib/integration/ui-business-integration';

// 使用API数据
function OrderList() {
  const { data, loading, error, refetch } = useApi('/orders');

  if (loading) return <div>加载中...</div>;
  if (error) return <div>加载失败: {error.message}</div>;

  return (
    <div>
      {data?.map(order => (
        <div key={order.id}>{order.id}</div>
      ))}
      <button onClick={refetch}>刷新</button>
    </div>
  );
}

// 使用API操作
function CreateOrder() {
  const { mutate, loading, error } = useApiMutation('/orders', 'POST');

  const handleSubmit = async (orderData) => {
    const response = await mutate(orderData);
    if (response.success) {
      console.log('订单创建成功');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button disabled={loading} type="submit">
        {loading ? '提交中...' : '创建订单'}
      </button>
    </form>
  );
}
```

### 2.2 业务服务层

```typescript
import { orderService, menuService, userService } from '@/lib/integration/ui-business-integration';

// 订单服务
async function fetchOrders() {
  const response = await orderService.getOrders({
    page: 1,
    pageSize: 20,
    status: 'pending',
  });

  if (response.success) {
    return response.data;
  }
}

async function createOrder(orderData) {
  const response = await orderService.createOrder(orderData);

  if (response.success) {
    return response.data;
  }
}

// 菜单服务
async function fetchMenus() {
  const response = await menuService.getMenus({
    page: 1,
    pageSize: 20,
    category: 'main',
  });

  if (response.success) {
    return response.data;
  }
}

// 用户服务
async function login(email, password) {
  const response = await userService.login({ email, password });

  if (response.success) {
    const { token, user } = response.data;
    apiClient.setToken(token);
    return user;
  }
}
```

### 2.3 实时数据

```typescript
import { useRealtimeData } from '@/lib/integration/ui-business-integration';

// 使用实时数据
function RealtimeOrderList() {
  const { data, connected } = useRealtimeData('ws://localhost:3000/orders');

  return (
    <div>
      <div>连接状态: {connected ? '已连接' : '未连接'}</div>
      {data?.map(order => (
        <div key={order.id}>{order.id}</div>
      ))}
    </div>
  );
}
```

---

## 3. 数据层与UI层集成

### 3.1 缓存管理

#### 3.1.1 使用缓存管理器

```typescript
import { cacheManager, CacheStrategy } from '@/lib/integration/data-layer-integration';

// 内存缓存
await cacheManager.set('user:123', userData, {
  key: 'user:123',
  strategy: CacheStrategy.MEMORY,
  ttl: 3600000, // 1小时
  version: '1.0',
});

const cachedUser = await cacheManager.get('user:123', CacheStrategy.MEMORY);

// IndexedDB缓存
await cacheManager.set('orders:page:1', ordersData, {
  key: 'orders:page:1',
  strategy: CacheStrategy.INDEXED_DB,
  ttl: 1800000, // 30分钟
  version: '1.0',
});

const cachedOrders = await cacheManager.get('orders:page:1', CacheStrategy.INDEXED_DB);

// LocalStorage缓存
await cacheManager.set('theme', 'dark', {
  key: 'theme',
  strategy: CacheStrategy.LOCAL_STORAGE,
  ttl: 86400000, // 24小时
  version: '1.0',
});

const cachedTheme = await cacheManager.get('theme', CacheStrategy.LOCAL_STORAGE);
```

#### 3.1.2 使用React Hooks

```typescript
import { useCachedData } from '@/lib/integration/data-layer-integration';

// 使用缓存数据
function UserProfile({ userId }) {
  const { data, loading, error, refresh, invalidate } = useCachedData(
    `user:${userId}`,
    () => fetchUser(userId),
    {
      key: `user:${userId}`,
      strategy: CacheStrategy.MEMORY,
      ttl: 3600000,
      version: '1.0',
    }
  );

  return (
    <div>
      {loading && <div>加载中...</div>}
      {error && <div>加载失败: {error.message}</div>}
      {data && (
        <div>
          <h1>{data.name}</h1>
          <p>{data.email}</p>
          <button onClick={refresh}>刷新</button>
          <button onClick={invalidate}>清除缓存</button>
        </div>
      )}
    </div>
  );
}
```

### 3.2 状态管理

#### 3.2.1 应用状态

```typescript
import { useAppStore } from '@/lib/integration/data-layer-integration';

function App() {
  const { user, tenant, theme, language, setUser, setTenant, setTheme, setLanguage } = useAppStore();

  useEffect(() => {
    // 初始化用户信息
    setUser({
      id: 'user-123',
      name: '张三',
      email: 'zhangsan@example.com',
      role: 'admin',
    });

    // 初始化租户信息
    setTenant({
      id: 'tenant-123',
      name: 'YYC³餐饮',
      config: {},
    });
  }, []);

  return (
    <div>
      <h1>欢迎, {user?.name}</h1>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        切换主题
      </button>
      <button onClick={() => setLanguage(language === 'zh-CN' ? 'en-US' : 'zh-CN')}>
        切换语言
      </button>
    </div>
  );
}
```

#### 3.2.2 订单状态

```typescript
import { useOrderStore } from '@/lib/integration/data-layer-integration';

function OrderList() {
  const { orders, loading, error, addOrder, updateOrder, removeOrder } = useOrderStore();

  const handleAddOrder = async (orderData) => {
    const response = await apiClient.post('/orders', orderData);
    if (response.success) {
      addOrder(response.data);
    }
  };

  const handleUpdateOrder = async (orderId, updates) => {
    const response = await apiClient.put(`/orders/${orderId}`, updates);
    if (response.success) {
      updateOrder(orderId, updates);
    }
  };

  const handleRemoveOrder = async (orderId) => {
    const response = await apiClient.delete(`/orders/${orderId}`);
    if (response.success) {
      removeOrder(orderId);
    }
  };

  return (
    <div>
      {orders.map(order => (
        <div key={order.id}>
          <span>{order.id}</span>
          <button onClick={() => handleUpdateOrder(order.id, { status: 'completed' })}>
            完成
          </button>
          <button onClick={() => handleRemoveOrder(order.id)}>
            删除
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## 4. 多端适配

### 4.1 设备信息

```typescript
import { useDeviceInfo, usePlatformInfo } from '@/lib/integration/multi-platform-adapter';

function DeviceInfo() {
  const deviceInfo = useDeviceInfo();
  const platformInfo = usePlatformInfo();

  return (
    <div>
      <div>设备类型: {deviceInfo.type}</div>
      <div>屏幕尺寸: {deviceInfo.width} x {deviceInfo.height}</div>
      <div>方向: {deviceInfo.orientation}</div>
      <div>触摸设备: {deviceInfo.isTouch ? '是' : '否'}</div>
      <div>平台: {platformInfo.name}</div>
      <div>操作系统: {platformInfo.os}</div>
      <div>浏览器: {platformInfo.browser}</div>
    </div>
  );
}
```

### 4.2 响应式断点

```typescript
import { useBreakpoint, useResponsive } from '@/lib/integration/multi-platform-adapter';

function ResponsiveComponent() {
  const breakpoint = useBreakpoint();

  const columns = useResponsive({
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
    '2xl': 6,
  });

  return (
    <div>
      <div>当前断点: {breakpoint}</div>
      <div>列数: {columns}</div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {/* 渲染内容 */}
      </div>
    </div>
  );
}
```

### 4.3 媒体查询

```typescript
import { useMediaQuery } from '@/lib/integration/multi-platform-adapter';

function MediaQueryComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  return (
    <div>
      {isMobile && <div>移动端布局</div>}
      {isTablet && <div>平板端布局</div>}
      {isDesktop && <div>桌面端布局</div>}
    </div>
  );
}
```

### 4.4 触摸手势

```typescript
import { useTouchGesture } from '@/lib/integration/multi-platform-adapter';

function SwipeableCard() {
  const ref = useRef<HTMLDivElement>(null);

  useTouchGesture(ref, {
    onSwipeLeft: () => console.log('向左滑动'),
    onSwipeRight: () => console.log('向右滑动'),
    onSwipeUp: () => console.log('向上滑动'),
    onSwipeDown: () => console.log('向下滑动'),
    onTap: () => console.log('点击'),
    onLongPress: () => console.log('长按'),
  });

  return (
    <div ref={ref} style={{ padding: '20px', border: '1px solid #ccc' }}>
      滑动我
    </div>
  );
}
```

### 4.5 平台适配器

```typescript
import { usePlatformAdapter } from '@/lib/integration/multi-platform-adapter';

function PlatformAdapterComponent() {
  const adapter = usePlatformAdapter();

  const handleOpenURL = () => {
    adapter.openURL('https://example.com');
  };

  const handleShare = () => {
    adapter.share({
      title: 'YYC³餐饮平台',
      description: '智能餐饮管理平台',
      url: 'https://yyc3.com',
    });
  };

  const handleCopy = async () => {
    const success = await adapter.copyToClipboard('复制的内容');
    console.log('复制结果:', success);
  };

  const handleVibrate = () => {
    adapter.vibrate(200);
  };

  return (
    <div>
      <button onClick={handleOpenURL}>打开链接</button>
      <button onClick={handleShare}>分享</button>
      <button onClick={handleCopy}>复制</button>
      <button onClick={handleVibrate}>震动</button>
    </div>
  );
}
```

---

## 5. 跨维度数据交互与状态同步

### 5.1 事件总线

```typescript
import { eventBus } from '@/lib/integration/cross-dimension-sync';

// 监听事件
eventBus.on('data:orders:created', (order) => {
  console.log('新订单创建:', order);
});

eventBus.on('data:orders:updated', (order) => {
  console.log('订单更新:', order);
});

eventBus.on('data:orders:deleted', (order) => {
  console.log('订单删除:', order);
});

// 发送事件
eventBus.emit('data:orders:created', orderData);

// 取消监听
eventBus.off('data:orders:created', handler);
```

### 5.2 数据同步

```typescript
import { crossDimensionDataManager, DataSyncConfig } from '@/lib/integration/cross-dimension-sync';

// 注册数据同步
const config: DataSyncConfig = {
  entity: 'orders',
  endpoint: 'http://localhost:3000/api/orders',
  syncInterval: 5000,
  autoSync: true,
  conflictResolution: 'server',
  offlineSupport: true,
  realTime: true,
};

crossDimensionDataManager.register(config);

// 创建数据
const order = await crossDimensionDataManager.create('orders', {
  customerId: 'customer-123',
  items: [
    { productId: 'product-1', quantity: 2 },
  ],
});

// 更新数据
const updatedOrder = await crossDimensionDataManager.update('orders', order.id, {
  status: 'completed',
});

// 删除数据
await crossDimensionDataManager.delete('orders', order.id);

// 获取同步状态
const syncState = crossDimensionDataManager.getSyncState('orders');

// 取消注册
crossDimensionDataManager.unregister('orders');
```

### 5.3 离线队列

```typescript
import { offlineQueueManager } from '@/lib/integration/cross-dimension-sync';

// 添加离线操作
const operationId = offlineQueueManager.add({
  operation: DataOperationType.CREATE,
  entity: 'orders',
  entityId: 'pending-123',
  data: orderData,
  maxRetries: 3,
});

// 获取所有离线操作
const operations = offlineQueueManager.getAll();

// 同步离线队列
await crossDimensionDataManager.syncOfflineQueue();

// 清除离线队列
offlineQueueManager.clear();
```

### 5.4 React Hooks

```typescript
import {
  useDataEvent,
  useSyncState,
  useOfflineQueue,
} from '@/lib/integration/cross-dimension-sync';

// 使用数据事件
function OrderList() {
  const orders = useDataEvent('orders', DataOperationType.CREATE);

  return (
    <div>
      {orders?.map(order => (
        <div key={order.id}>{order.id}</div>
      ))}
    </div>
  );
}

// 使用同步状态
function SyncStatus() {
  const syncState = useSyncState('orders');

  return (
    <div>
      同步状态: {syncState}
    </div>
  );
}

// 使用离线队列
function OfflineQueue() {
  const { operations, size, syncQueue } = useOfflineQueue();

  return (
    <div>
      <div>离线操作数量: {size}</div>
      <button onClick={syncQueue}>同步离线操作</button>
      <ul>
        {operations.map(op => (
          <li key={op.id}>{op.operation} - {op.entity}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 6. 完整示例

### 6.1 订单管理页面

```typescript
import { useState, useEffect } from 'react';
import { useApi, useApiMutation } from '@/lib/integration/ui-business-integration';
import { useOrderStore } from '@/lib/integration/data-layer-integration';
import { useCachedData } from '@/lib/integration/data-layer-integration';
import { useBreakpoint } from '@/lib/integration/multi-platform-adapter';
import { useDataEvent } from '@/lib/integration/cross-dimension-sync';

function OrderManagementPage() {
  const breakpoint = useBreakpoint();
  const { orders, addOrder, updateOrder, removeOrder } = useOrderStore();
  
  const { data, loading, error, refetch } = useCachedData(
    'orders:page:1',
    () => apiClient.get('/orders'),
    {
      key: 'orders:page:1',
      strategy: CacheStrategy.MEMORY,
      ttl: 300000,
      version: '1.0',
    }
  );

  const { mutate: createOrder, loading: creating } = useApiMutation('/orders', 'POST');

  const newOrder = useDataEvent('orders', DataOperationType.CREATE);

  useEffect(() => {
    if (newOrder) {
      addOrder(newOrder);
    }
  }, [newOrder, addOrder]);

  const handleCreateOrder = async (orderData) => {
    const response = await createOrder(orderData);
    if (response.success) {
      addOrder(response.data);
    }
  };

  const handleUpdateOrder = async (orderId, updates) => {
    const response = await apiClient.put(`/orders/${orderId}`, updates);
    if (response.success) {
      updateOrder(orderId, updates);
    }
  };

  const handleRemoveOrder = async (orderId) => {
    const response = await apiClient.delete(`/orders/${orderId}`);
    if (response.success) {
      removeOrder(orderId);
    }
  };

  if (loading) return <div>加载中...</div>;
  if (error) return <div>加载失败: {error.message}</div>;

  return (
    <div>
      <h1>订单管理</h1>
      <div>当前断点: {breakpoint}</div>
      <button onClick={refetch}>刷新</button>
      <button onClick={() => handleCreateOrder({ customerId: 'customer-123', items: [] })}>
        创建订单
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: breakpoint === 'xs' ? '1fr' : 'repeat(3, 1fr)' }}>
        {orders.map(order => (
          <div key={order.id} style={{ padding: '10px', border: '1px solid #ccc' }}>
            <h3>订单 #{order.id}</h3>
            <p>状态: {order.status}</p>
            <button onClick={() => handleUpdateOrder(order.id, { status: 'completed' })}>
              完成
            </button>
            <button onClick={() => handleRemoveOrder(order.id)}>
              删除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderManagementPage;
```

---

## 7. 常见问题

### 7.1 如何处理API错误？

```typescript
const { data, loading, error } = useApi('/orders');

if (error) {
  // 显示错误信息
  return <div>错误: {error.message}</div>;
}
```

### 7.2 如何实现离线支持？

```typescript
import { offlineQueueManager } from '@/lib/integration/cross-dimension-sync';

// 添加离线操作
offlineQueueManager.add({
  operation: DataOperationType.CREATE,
  entity: 'orders',
  entityId: 'pending-123',
  data: orderData,
  maxRetries: 3,
});

// 同步离线操作
await crossDimensionDataManager.syncOfflineQueue();
```

### 7.3 如何实现实时数据更新？

```typescript
import { useRealtimeData } from '@/lib/integration/ui-business-integration';

function RealtimeOrderList() {
  const { data, connected } = useRealtimeData('ws://localhost:3000/orders');

  return (
    <div>
      <div>连接状态: {connected ? '已连接' : '未连接'}</div>
      {data?.map(order => (
        <div key={order.id}>{order.id}</div>
      ))}
    </div>
  );
}
```

### 7.4 如何实现响应式布局？

```typescript
import { useBreakpoint, useResponsive } from '@/lib/integration/multi-platform-adapter';

function ResponsiveComponent() {
  const breakpoint = useBreakpoint();
  const columns = useResponsive({
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {/* 渲染内容 */}
    </div>
  );
}
```

---

## 8. 总结

YYC³餐饮行业智能化平台的系统集成架构提供了完整的解决方案，包括：

1. **UI层与业务逻辑层无缝对接**: 提供统一的API客户端和React Hooks
2. **数据层与UI层深度集成**: 提供多级缓存策略和统一状态管理
3. **多端适配策略**: 支持Web端、移动端、小程序等多终端
4. **跨维度数据交互与状态同步**: 提供实时数据同步和离线支持

通过这套完整的系统集成架构，开发者可以快速构建高质量、高性能、高可用的餐饮管理应用。

---

**文档版本**: v1.0.0
**最后更新**: 2026-01-21
**文档状态**: 正式发布
