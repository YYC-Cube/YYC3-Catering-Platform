# Alert 警告提示

警告提示，展现需要关注的信息。

## 何时使用

- 当某个页面需要向用户显示警告的信息时。
- 非浮层的静态展现形式，始终展现，不会自动消失，用户可以点击关闭。

## 代码演示

### 基础用法

使用 `variant` 属性来设置警告的类型。

```tsx
import { Alert } from "@/components/UI";

export default function AlertBasic() {
  return (
    <div class="space-y-4">
      <Alert variant="info">这是一条信息提示</Alert>
      <Alert variant="success">这是一条成功提示</Alert>
      <Alert variant="warning">这是一条警告提示</Alert>
      <Alert variant="danger">这是一条错误提示</Alert>
    </div>
  );
}
```

### 可关闭

使用 `closable` 属性来显示关闭按钮。

```tsx
import { Alert } from "@/components/UI";

export default function AlertClosable() {
  return <Alert closable>这是一条可关闭的警告提示</Alert>;
}
```

### 带图标

使用 `showIcon` 属性来显示图标。

```tsx
import { Alert } from "@/components/UI";

export default function AlertWithIcon() {
  return (
    <div class="space-y-4">
      <Alert variant="info" showIcon>
        这是一条带图标的信息提示
      </Alert>
      <Alert variant="success" showIcon>
        这是一条带图标的成功提示
      </Alert>
      <Alert variant="warning" showIcon>
        这是一条带图标的警告提示
      </Alert>
      <Alert variant="danger" showIcon>
        这是一条带图标的错误提示
      </Alert>
    </div>
  );
}
```

### 横幅模式

使用 `banner` 属性来显示横幅模式。

```tsx
import { Alert } from "@/components/UI";

export default function AlertBanner() {
  return (
    <Alert banner showIcon>
      这是一条横幅警告提示
    </Alert>
  );
}
```

### 组合使用

使用 `AlertTitle` 和 `AlertDescription` 组件来组合使用。

```tsx
import { Alert, AlertTitle, AlertDescription } from "@/components/UI";

export default function AlertCombined() {
  return (
    <Alert variant="warning" showIcon>
      <AlertTitle>警告标题</AlertTitle>
      <AlertDescription>这是一条警告提示的详细描述内容</AlertDescription>
    </Alert>
  );
}
```

## API

### Alert Props

| 参数      | 说明         | 类型       | 可选值                                                | 默认值    |
| --------- | ------------ | ---------- | ----------------------------------------------------- | --------- |
| variant   | 警告类型     | `string`   | `default` / `info` / `success` / `warning` / `danger` | `default` |
| showIcon  | 是否显示图标 | `boolean`  | -                                                     | `false`   |
| closable  | 是否可关闭   | `boolean`  | -                                                     | `false`   |
| banner    | 是否横幅模式 | `boolean`  | -                                                     | `false`   |
| onClose   | 关闭时的回调 | `Function` | -                                                     | -         |
| className | 自定义类名   | `string`   | -                                                     | -         |

### Alert Slots

| 插槽名  | 说明       |
| ------- | ---------- |
| default | 默认内容   |
| icon    | 自定义图标 |

### AlertTitle Props

| 参数      | 说明       | 类型     | 默认值 |
| --------- | ---------- | -------- | ------ |
| className | 自定义类名 | `string` | -      |

### AlertDescription Props

| 参数      | 说明       | 类型     | 默认值 |
| --------- | ---------- | -------- | ------ |
| className | 自定义类名 | `string` | -      |

## 样式定制

### CSS 变量

```css
.alert {
  --alert-bg-color: #ffffff;
  --alert-border-color: #e5e7eb;
  --alert-text-color: #374151;
  --alert-icon-color: #3b82f6;
  --alert-padding: 1rem;
  --alert-border-radius: 0.375rem;
}
```

### 自定义样式

```tsx
<Alert className="custom-alert">自定义警告</Alert>

<style>
.custom-alert {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}
</style>
```

## 最佳实践

### 1. 表单验证提示

```tsx
<Alert variant="danger" showIcon>
  <AlertTitle>表单验证失败</AlertTitle>
  <AlertDescription>请检查表单中的错误信息并重新提交</AlertDescription>
</Alert>
```

### 2. 操作成功提示

```tsx
<Alert variant="success" showIcon closable>
  <AlertTitle>操作成功</AlertTitle>
  <AlertDescription>您的数据已成功保存</AlertDescription>
</Alert>
```

### 3. 重要通知

```tsx
<Alert variant="warning" banner showIcon>
  <AlertTitle>重要通知</AlertTitle>
  <AlertDescription>系统将于今晚进行维护，请提前保存您的工作</AlertDescription>
</Alert>
```

## 常见问题

### Q: 如何自定义图标？

A: 可以通过 `icon` 插槽自定义图标。

### Q: 如何控制警告的显示和隐藏？

A: 可以使用 `v-if` 或 `v-show` 控制警告的显示。

### Q: 如何在关闭时执行操作？

A: 可以通过 `onClose` 回调函数在关闭时执行操作。

---

🌹 Alert 组件文档完成！
