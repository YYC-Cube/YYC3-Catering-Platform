# Space 间距

设置组件之间的间距。

## 何时使用

- 避免组件紧贴在一起，设置统一的空间。
- 适用于行、列中多种对齐方式的布局。

## 代码演示

### 基础用法

```tsx
import { Space } from '@/components/UI'
import { Button } from '@/components/UI'

export default function SpaceBasic() {
  return (
    <Space>
      <Button>按钮1</Button>
      <Button>按钮2</Button>
      <Button>按钮3</Button>
    </Space>
  )
}
```

### 方向

```tsx
import { Space } from '@/components/UI'
import { Button } from '@/components/UI'

export default function SpaceDirection() {
  return (
    <div class="space-y-4">
      <Space direction="horizontal">
        <Button>水平1</Button>
        <Button>水平2</Button>
        <Button>水平3</Button>
      </Space>
      <Space direction="vertical">
        <Button>垂直1</Button>
        <Button>垂直2</Button>
        <Button>垂直3</Button>
      </Space>
    </div>
  )
}
```

### 尺寸

```tsx
import { Space } from '@/components/UI'
import { Button } from '@/components/UI'

export default function SpaceSize() {
  return (
    <div class="space-y-4">
      <Space size="sm">
        <Button>小间距</Button>
        <Button>小间距</Button>
      </Space>
      <Space size="md">
        <Button>中等间距</Button>
        <Button>中等间距</Button>
      </Space>
      <Space size="lg">
        <Button>大间距</Button>
        <Button>大间距</Button>
      </Space>
    </div>
  )
}
```

### 自定义间距

```tsx
import { Space } from '@/components/UI'
import { Button } from '@/components/UI'

export default function SpaceCustomSize() {
  return (
    <Space size={24}>
      <Button>自定义间距</Button>
      <Button>自定义间距</Button>
    </Space>
  )
}
```

### 对齐

```tsx
import { Space } from '@/components/UI'
import { Button } from '@/components/UI'

export default function SpaceAlign() {
  return (
    <div class="space-y-4">
      <Space align="start">
        <Button>开始对齐</Button>
        <Button>开始对齐</Button>
      </Space>
      <Space align="center">
        <Button>居中对齐</Button>
        <Button>居中对齐</Button>
      </Space>
      <Space align="end">
        <Button>结束对齐</Button>
        <Button>结束对齐</Button>
      </Space>
    </div>
  )
}
```

### 换行

```tsx
import { Space } from '@/components/UI'
import { Button } from '@/components/UI'

export default function SpaceWrap() {
  return (
    <Space wrap>
      <Button>按钮1</Button>
      <Button>按钮2</Button>
      <Button>按钮3</Button>
      <Button>按钮4</Button>
      <Button>按钮5</Button>
    </Space>
  )
}
```

### 填充

```tsx
import { Space } from '@/components/UI'
import { Button } from '@/components/UI'

export default function SpaceFill() {
  return (
    <Space fill>
      <Button>按钮1</Button>
      <Button>按钮2</Button>
      <Button>按钮3</Button>
    </Space>
  )
}
```

## API

### Space Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| direction | 方向 | `string` | `horizontal` / `vertical` | `horizontal` |
| size | 间距大小 | `string \| number` | `sm` / `md` / `lg` | `md` |
| align | 对齐方式 | `string` | `start` / `center` / `end` | `start` |
| wrap | 是否换行 | `boolean` | `false` |
| fill | 是否填充 | `boolean` | `false` |
| className | 自定义类名 | `string` | - |

## 样式定制

### CSS 变量

```css
.space {
  --space-gap-sm: 0.5rem;
  --space-gap-md: 1rem;
  --space-gap-lg: 1.5rem;
}
```

### 自定义样式

```tsx
<Space className="custom-space">
  <Button>自定义</Button>
  <Button>自定义</Button>
</Space>

<style>
.custom-space {
  gap: 2rem;
}
</style>
```

## 最佳实践

### 1. 按钮组

```tsx
<Space>
  <Button>取消</Button>
  <Button type="primary">确定</Button>
</Space>
```

### 2. 表单操作

```tsx
<Space>
  <Button onClick={handleReset}>重置</Button>
  <Button onClick={handleCancel}>取消</Button>
  <Button type="primary" onClick={handleSubmit}>提交</Button>
</Space>
```

### 3. 操作栏

```tsx
<Space>
  <Button onClick={handleEdit}>编辑</Button>
  <Button onClick={handleCopy}>复制</Button>
  <Button type="danger" onClick={handleDelete}>删除</Button>
</Space>
```

### 4. 响应式按钮组

```tsx
<Space wrap>
  <Button>按钮1</Button>
  <Button>按钮2</Button>
  <Button>按钮3</Button>
  <Button>按钮4</Button>
  <Button>按钮5</Button>
</Space>
```

## 常见问题

### Q: 如何设置间距的大小？

A: 使用 `size` 属性设置间距的大小。

### Q: 如何实现垂直排列？

A: 使用 `direction` 属性设置为 `vertical`。

### Q: 如何实现换行？

A: 使用 `wrap` 属性实现换行。

---

🌹 Space 组件文档完成！
