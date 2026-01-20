# Layout 布局

协助进行页面级整体布局。

## 何时使用

- 页面整体布局
- 结构化的页面布局

## 代码演示

### 基础用法

```tsx
import { Layout, LayoutHeader, LayoutContent, LayoutSider, LayoutFooter } from '@/components/UI'

export default function LayoutBasic() {
  return (
    <Layout>
      <LayoutHeader>头部</LayoutHeader>
      <LayoutContent>内容</LayoutContent>
      <LayoutFooter>底部</LayoutFooter>
    </Layout>
  )
}
```

### 带侧边栏

```tsx
import { Layout, LayoutHeader, LayoutContent, LayoutSider, LayoutFooter } from '@/components/UI'

export default function LayoutWithSider() {
  return (
    <Layout>
      <LayoutHeader>头部</LayoutHeader>
      <Layout>
        <LayoutSider>侧边栏</LayoutSider>
        <LayoutContent>内容</LayoutContent>
      </Layout>
      <LayoutFooter>底部</LayoutFooter>
    </Layout>
  )
}
```

### 固定头部

```tsx
import { Layout, LayoutHeader, LayoutContent } from '@/components/UI'

export default function LayoutFixedHeader() {
  return (
    <Layout>
      <LayoutHeader fixed>固定头部</LayoutHeader>
      <LayoutContent>内容</LayoutContent>
    </Layout>
  )
}
```

### 固定侧边栏

```tsx
import { Layout, LayoutContent, LayoutSider } from '@/components/UI'

export default function LayoutFixedSider() {
  return (
    <Layout>
      <LayoutSider fixed>固定侧边栏</LayoutSider>
      <LayoutContent>内容</LayoutContent>
    </Layout>
  )
}
```

### 可折叠侧边栏

```tsx
import { Layout, LayoutContent, LayoutSider } from '@/components/UI'
import { ref } from 'vue'

export default function LayoutCollapsibleSider() {
  const collapsed = ref(false)

  return (
    <Layout>
      <LayoutSider collapsible collapsed={collapsed.value}>
        <button onClick={() => collapsed.value = !collapsed.value}>
          {collapsed.value ? '展开' : '收起'}
        </button>
      </LayoutSider>
      <LayoutContent>内容</LayoutContent>
    </Layout>
  )
}
```

## API

### Layout Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| fixed | 是否固定 | `boolean` | `false` |
| className | 自定义类名 | `string` | - |

### LayoutHeader Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| fixed | 是否固定 | `boolean` | `false` |
| height | 高度 | `number` | `64` |
| className | 自定义类名 | `string` | - |

### LayoutContent Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| className | 自定义类名 | `string` | - |

### LayoutSider Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| placement | 位置 | `string` | `left` / `right` | `left` |
| width | 宽度 | `number` | `200` |
| collapsible | 是否可折叠 | `boolean` | `false` |
| collapsed | 是否折叠 | `boolean` | `false` |
| className | 自定义类名 | `string` | - |

### LayoutFooter Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| fixed | 是否固定 | `boolean` | `false` |
| className | 自定义类名 | `string` | - |

## 样式定制

### CSS 变量

```css
.layout {
  --layout-bg: #ffffff;
  --layout-header-bg: #1f2937;
  --layout-header-text: #ffffff;
  --layout-sider-bg: #f9fafb;
  --layout-footer-bg: #f9fafb;
  --layout-footer-text: #6b7280;
}
```

### 自定义样式

```tsx
<Layout className="custom-layout">
  <LayoutHeader>头部</LayoutHeader>
  <LayoutContent>内容</LayoutContent>
</Layout>

<style>
.custom-layout .layout-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.custom-layout .layout-sider {
  background: #f3f4f6;
}
</style>
```

## 最佳实践

### 1. 管理后台布局

```tsx
<Layout>
  <LayoutHeader fixed>
    <div class="flex items-center justify-between">
      <h1>YYC³ 管理后台</h1>
      <div class="flex items-center space-x-4">
        <span>管理员</span>
        <Button onClick={handleLogout}>退出</Button>
      </div>
    </div>
  </LayoutHeader>
  <Layout>
    <LayoutSider width={240}>
      <Menu>
        <MenuItem>首页</MenuItem>
        <MenuItem>用户管理</MenuItem>
        <MenuItem>订单管理</MenuItem>
      </Menu>
    </LayoutSider>
    <LayoutContent>
      <RouterView />
    </LayoutContent>
  </Layout>
</Layout>
```

### 2. 电商前台布局

```tsx
<Layout>
  <LayoutHeader>
    <div class="flex items-center justify-between">
      <h1>YYC³ 商城</h1>
      <div class="flex items-center space-x-4">
        <Button>登录</Button>
        <Button type="primary">注册</Button>
      </div>
    </div>
  </LayoutHeader>
  <LayoutContent>
    <RouterView />
  </LayoutContent>
  <LayoutFooter>
    <div class="text-center">
      <p>© 2024 YYC³. All rights reserved.</p>
    </div>
  </LayoutFooter>
</Layout>
```

### 3. 博客布局

```tsx
<Layout>
  <LayoutHeader>
    <div class="flex items-center justify-between">
      <h1>YYC³ 博客</h1>
      <div class="flex items-center space-x-4">
        <a href="/">首页</a>
        <a href="/about">关于</a>
        <a href="/contact">联系</a>
      </div>
    </div>
  </LayoutHeader>
  <LayoutContent>
    <div class="max-w-4xl mx-auto">
      <RouterView />
    </div>
  </LayoutContent>
  <LayoutFooter>
    <div class="text-center">
      <p>© 2024 YYC³. All rights reserved.</p>
    </div>
  </LayoutFooter>
</Layout>
```

## 常见问题

### Q: 如何固定头部？

A: 使用 `LayoutHeader` 的 `fixed` 属性固定头部。

### Q: 如何实现可折叠侧边栏？

A: 使用 `LayoutSider` 的 `collapsible` 和 `collapsed` 属性实现可折叠侧边栏。

### Q: 如何自定义布局的样式？

A: 使用 `className` 属性添加自定义类名，然后使用 CSS 自定义样式。

---

🌹 Layout 组件文档完成！
