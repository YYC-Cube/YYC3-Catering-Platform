# Tooltip 文字提示

简单的文字提示气泡框。

## 何时使用

- 鼠标移入则显示提示，移出消失，气泡浮层不承载复杂文本和操作。
- 可以对文字进行简单提示。

## 代码演示

### 基础用法

```tsx
import { Tooltip } from '@/components/UI'
import { Button } from '@/components/UI'

export default function TooltipBasic() {
  return (
    <Tooltip title="提示内容">
      <Button>悬停显示</Button>
    </Tooltip>
  )
}
```

### 位置

```tsx
import { Tooltip } from '@/components/UI'
import { Button } from '@/components/UI'

export default function TooltipPlacement() {
  return (
    <div class="space-x-2">
      <Tooltip title="顶部提示" placement="top">
        <Button>顶部</Button>
      </Tooltip>
      <Tooltip title="底部提示" placement="bottom">
        <Button>底部</Button>
      </Tooltip>
      <Tooltip title="左侧提示" placement="left">
        <Button>左侧</Button>
      </Tooltip>
      <Tooltip title="右侧提示" placement="right">
        <Button>右侧</Button>
      </Tooltip>
    </div>
  )
}
```

### 触发方式

```tsx
import { Tooltip } from '@/components/UI'
import { Button } from '@/components/UI'

export default function TooltipTrigger() {
  return (
    <div class="space-x-2">
      <Tooltip
        title="悬停提示"
        trigger="hover"
        triggerElement={<Button>悬停</Button>}
      />
      <Tooltip
        title="点击提示"
        trigger="click"
        triggerElement={<Button>点击</Button>}
      />
      <Tooltip
        title="聚焦提示"
        trigger="focus"
        triggerElement={<Button>聚焦</Button>}
      />
    </div>
  )
}
```

### 禁用

```tsx
import { Tooltip } from '@/components/UI'
import { Button } from '@/components/UI'

export default function TooltipDisabled() {
  return (
    <div class="space-x-2">
      <Tooltip title="禁用提示" disabled>
        <Button>禁用</Button>
      </Tooltip>
      <Tooltip title="可用提示">
        <Button>可用</Button>
      </Tooltip>
    </div>
  )
}
```

### 带箭头

```tsx
import { Tooltip } from '@/components/UI'
import { Button } from '@/components/UI'

export default function TooltipArrow() {
  return (
    <Tooltip
      title="带箭头提示"
      arrow
      triggerElement={<Button>带箭头</Button>}
    />
  )
}
```

### 延迟显示

```tsx
import { Tooltip } from '@/components/UI'
import { Button } from '@/components/UI'

export default function TooltipDelay() {
  return (
    <Tooltip
      title="延迟提示"
      delay={500}
      triggerElement={<Button>延迟500ms</Button>}
    />
  )
}
```

### 富文本

```tsx
import { Tooltip } from '@/components/UI'
import { Button } from '@/components/UI'

export default function TooltipRichText() {
  return (
    <Tooltip
      title={
        <div>
          <p><strong>加粗文本</strong></p>
          <p><em>斜体文本</em></p>
        </div>
      }
      triggerElement={<Button>富文本</Button>}
    />
  )
}
```

### 自定义颜色

```tsx
import { Tooltip } from '@/components/UI'
import { Button } from '@/components/UI'

export default function TooltipColor() {
  return (
    <div class="space-x-2">
      <Tooltip
        title="主要提示"
        color="primary"
        triggerElement={<Button>主要</Button>}
      />
      <Tooltip
        title="成功提示"
        color="success"
        triggerElement={<Button>成功</Button>}
      />
      <Tooltip
        title="警告提示"
        color="warning"
        triggerElement={<Button>警告</Button>}
      />
      <Tooltip
        title="危险提示"
        color="danger"
        triggerElement={<Button>危险</Button>}
      />
    </div>
  )
}
```

## API

### Tooltip Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| title | 提示内容 | `string \| VNode` | - |
| trigger | 触发方式 | `string` | `hover` / `click` / `focus` | `hover` |
| triggerElement | 触发元素 | `VNode` | - |
| placement | 位置 | `string` | `top` / `bottom` / `left` / `right` | `top` |
| disabled | 是否禁用 | `boolean` | `false` |
| arrow | 是否显示箭头 | `boolean` | `false` |
| delay | 延迟显示（毫秒） | `number` | - |
| onVisibleChange | 显示状态变化回调 | `Function` | - |
| className | 自定义类名 | `string` | - |

## 样式定制

### CSS 变量

```css
.tooltip {
  --tooltip-bg: #1f2937;
  --tooltip-text: #ffffff;
  --tooltip-arrow-color: #1f2937;
  --tooltip-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  --tooltip-padding: 0.5rem 0.75rem;
  --tooltip-font-size: 0.875rem;
}
```

### 自定义样式

```tsx
<Tooltip
  className="custom-tooltip"
  title="自定义提示"
  triggerElement={<Button>自定义</Button>}
/>

<style>
.custom-tooltip .tooltip-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
}
</style>
```

## 最佳实践

### 1. 表单提示

```tsx
<FormField name="username" label="用户名" required>
  <div class="relative">
    <Input type="text" placeholder="请输入用户名" />
    <Tooltip
      title="用户名长度为4-20个字符"
      placement="right"
      triggerElement={
        <span class="absolute right-2 top-1/2 -translate-y-1/2">
          ❓
        </span>
      }
    />
  </div>
</FormField>
```

### 2. 操作提示

```tsx
<Tooltip
  title="点击删除此项目"
  trigger="hover"
  triggerElement={
    <Button type="danger" size="sm">
      删除
    </Button>
  }
/>
```

### 3. 状态提示

```tsx
<div class="flex items-center space-x-2">
  <span>状态:</span>
  <span class="inline-flex items-center">
    <span class="w-2 h-2 rounded-full bg-success-500 mr-1"></span>
    在线
    <Tooltip
      title="最后活跃时间: 2024-01-01 10:00"
      placement="right"
      triggerElement={
        <span class="text-neutral-400 cursor-help">ℹ️</span>
      }
    />
  </span>
</div>
```

### 4. 帮助提示

```tsx
<div class="flex items-center space-x-2">
  <span>高级设置</span>
  <Tooltip
    title={
      <div>
        <p>启用高级设置后，您可以：</p>
        <ul class="list-disc list-inside">
          <li>自定义主题</li>
          <li>配置插件</li>
          <li>设置权限</li>
        </ul>
      </div>
    }
    placement="right"
    triggerElement={
      <span class="text-primary-500 cursor-help">❓</span>
    }
  />
</div>
```

## 常见问题

### Q: 如何自定义提示的位置？

A: 使用 `placement` 属性设置提示的位置。

### Q: 如何自定义提示的触发方式？

A: 使用 `trigger` 属性设置提示的触发方式。

### Q: 如何禁用提示？

A: 使用 `disabled` 属性禁用提示。

### Q: 如何实现富文本提示？

A: 使用 `title` 属性传入 VNode 实现富文本提示。

---

🌹 Tooltip 组件文档完成！
