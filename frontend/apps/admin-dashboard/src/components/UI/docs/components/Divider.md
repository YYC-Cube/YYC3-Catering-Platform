# Divider 分割线

区隔内容的分割线。

## 何时使用

- 对不同章节的文本段落进行分割。
- 对行内文字/链接进行分割，例如表格的操作列。

## 代码演示

### 基础用法

```tsx
import { Divider } from "@/components/UI";

export default function DividerBasic() {
  return (
    <div>
      <p>文本1</p>
      <Divider />
      <p>文本2</p>
    </div>
  );
}
```

### 带文字

```tsx
import { Divider } from "@/components/UI";

export default function DividerWithText() {
  return (
    <div>
      <p>文本1</p>
      <Divider>文字</Divider>
      <p>文本2</p>
    </div>
  );
}
```

### 位置

```tsx
import { Divider } from "@/components/UI";

export default function DividerPosition() {
  return (
    <div>
      <p>文本1</p>
      <Divider orientation="left">左侧文字</Divider>
      <p>文本2</p>
      <Divider orientation="center">居中文字</Divider>
      <p>文本3</p>
      <Divider orientation="right">右侧文字</Divider>
      <p>文本4</p>
    </div>
  );
}
```

### 垂直分割线

```tsx
import { Divider } from "@/components/UI";

export default function DividerVertical() {
  return (
    <div>
      <span>文本1</span>
      <Divider vertical />
      <span>文本2</span>
      <Divider vertical />
      <span>文本3</span>
    </div>
  );
}
```

### 虚线

```tsx
import { Divider } from "@/components/UI";

export default function DividerDashed() {
  return (
    <div>
      <p>文本1</p>
      <Divider dashed />
      <p>文本2</p>
    </div>
  );
}
```

### 自定义样式

```tsx
import { Divider } from "@/components/UI";

export default function DividerCustom() {
  return (
    <div>
      <p>文本1</p>
      <Divider style={{ borderColor: "#667eea", borderWidth: "2px" }} />
      <p>文本2</p>
    </div>
  );
}
```

## API

### Divider Props

| 参数        | 说明       | 类型      | 默认值                      |
| ----------- | ---------- | --------- | --------------------------- | -------- |
| orientation | 文本位置   | `string`  | `left` / `center` / `right` | `center` |
| dashed      | 是否虚线   | `boolean` | `false`                     |
| vertical    | 是否垂直   | `boolean` | `false`                     |
| className   | 自定义类名 | `string`  | -                           |

## 样式定制

### CSS 变量

```css
.divider {
  --divider-border: #e5e7eb;
  --divider-text: #6b7280;
  --divider-font-size: 0.875rem;
}
```

### 自定义样式

```tsx
<Divider className="custom-divider" />

<style>
.custom-divider {
  border-color: #667eea;
  border-width: 2px;
}

.custom-divider::after {
  color: #667eea;
  font-weight: bold;
}
</style>
```

## 最佳实践

### 1. 文章分割

```tsx
<div>
  <h1>文章标题</h1>
  <p>文章内容...</p>
  <Divider />
  <h2>相关推荐</h2>
  <p>推荐内容...</p>
</div>
```

### 2. 表格操作

```tsx
<div class="flex items-center space-x-2">
  <Button size="sm">编辑</Button>
  <Divider vertical />
  <Button size="sm">删除</Button>
</div>
```

### 3. 分组标题

```tsx
<div>
  <h2>基本信息</h2>
  <Divider />
  <div>基本信息内容...</div>
  <Divider>联系方式</Divider>
  <div>联系方式内容...</div>
</div>
```

## 常见问题

### Q: 如何设置分割线的文字位置？

A: 使用 `orientation` 属性设置分割线的文字位置。

### Q: 如何实现垂直分割线？

A: 使用 `vertical` 属性实现垂直分割线。

### Q: 如何实现虚线分割线？

A: 使用 `dashed` 属性实现虚线分割线。

---

🌹 Divider 组件文档完成！
