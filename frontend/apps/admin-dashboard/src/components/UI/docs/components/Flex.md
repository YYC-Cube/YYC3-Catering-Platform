# Flex 弹性布局

弹性布局。

## 何时使用

- 布局
- 简单的对齐
- 均分列宽
- 居中布局
- 左右两栏布局
- 自动换行
- 多行对齐

## 代码演示

### 基础用法

```tsx
import { Flex, FlexItem } from "@/components/UI";
import { Button } from "@/components/UI";

export default function FlexBasic() {
  return (
    <Flex>
      <FlexItem>项目1</FlexItem>
      <FlexItem>项目2</FlexItem>
      <FlexItem>项目3</FlexItem>
    </Flex>
  );
}
```

### 方向

```tsx
import { Flex, FlexItem } from "@/components/UI";

export default function FlexDirection() {
  return (
    <div class="space-y-4">
      <Flex direction="row">
        <FlexItem>水平</FlexItem>
        <FlexItem>水平</FlexItem>
      </Flex>
      <Flex direction="column">
        <FlexItem>垂直</FlexItem>
        <FlexItem>垂直</FlexItem>
      </Flex>
    </div>
  );
}
```

### 换行

```tsx
import { Flex, FlexItem } from "@/components/UI";

export default function FlexWrap() {
  return (
    <div class="space-y-4">
      <Flex wrap="nowrap">
        <FlexItem>不换行</FlexItem>
        <FlexItem>不换行</FlexItem>
        <FlexItem>不换行</FlexItem>
      </Flex>
      <Flex wrap="wrap">
        <FlexItem>换行</FlexItem>
        <FlexItem>换行</FlexItem>
        <FlexItem>换行</FlexItem>
      </Flex>
      <Flex wrap="wrap-reverse">
        <FlexItem>反向换行</FlexItem>
        <FlexItem>反向换行</FlexItem>
        <FlexItem>反向换行</FlexItem>
      </Flex>
    </div>
  );
}
```

### 对齐

```tsx
import { Flex, FlexItem } from "@/components/UI";

export default function FlexAlign() {
  return (
    <div class="space-y-4">
      <Flex justify="start">
        <FlexItem>开始</FlexItem>
        <FlexItem>开始</FlexItem>
      </Flex>
      <Flex justify="center">
        <FlexItem>居中</FlexItem>
        <FlexItem>居中</FlexItem>
      </Flex>
      <Flex justify="end">
        <FlexItem>结束</FlexItem>
        <FlexItem>结束</FlexItem>
      </Flex>
      <Flex justify="space-between">
        <FlexItem>两端对齐</FlexItem>
        <FlexItem>两端对齐</FlexItem>
      </Flex>
      <Flex justify="space-around">
        <FlexItem>环绕对齐</FlexItem>
        <FlexItem>环绕对齐</FlexItem>
      </Flex>
    </div>
  );
}
```

### 间距

```tsx
import { Flex, FlexItem } from "@/components/UI";

export default function FlexGap() {
  return (
    <Flex gap={16}>
      <FlexItem>项目1</FlexItem>
      <FlexItem>项目2</FlexItem>
      <FlexItem>项目3</FlexItem>
    </Flex>
  );
}
```

### Flex值

```tsx
import { Flex, FlexItem } from "@/components/UI";

export default function FlexFlex() {
  return (
    <Flex>
      <FlexItem flex={1}>flex:1</FlexItem>
      <FlexItem flex={2}>flex:2</FlexItem>
      <FlexItem flex={1}>flex:1</FlexItem>
    </Flex>
  );
}
```

### Grow

```tsx
import { Flex, FlexItem } from "@/components/UI";

export default function FlexGrow() {
  return (
    <Flex>
      <FlexItem grow={0}>固定</FlexItem>
      <FlexItem grow={1}>自动</FlexItem>
      <FlexItem grow={0}>固定</FlexItem>
    </Flex>
  );
}
```

### Shrink

```tsx
import { Flex, FlexItem } from "@/components/UI";

export default function FlexShrink() {
  return (
    <Flex>
      <FlexItem shrink={0}>不收缩</FlexItem>
      <FlexItem shrink={1}>收缩</FlexItem>
      <FlexItem shrink={0}>不收缩</FlexItem>
    </Flex>
  );
}
```

## API

### Flex Props

| 参数      | 说明       | 类型     | 默认值                                                        |
| --------- | ---------- | -------- | ------------------------------------------------------------- | -------- |
| direction | 方向       | `string` | `row` / `column` / `row-reverse` / `column-reverse`           | `row`    |
| wrap      | 换行       | `string` | `nowrap` / `wrap` / `wrap-reverse`                            | `nowrap` |
| justify   | 水平对齐   | `string` | `start` / `center` / `end` / `space-between` / `space-around` | `start`  |
| align     | 垂直对齐   | `string` | `start` / `center` / `end`                                    | `start`  |
| gap       | 间距       | `number` | `0`                                                           |
| className | 自定义类名 | `string` | -                                                             |

### FlexItem Props

| 参数      | 说明        | 类型     | 默认值 |
| --------- | ----------- | -------- | ------ |
| flex      | flex值      | `number` | -      |
| grow      | flex-grow   | `number` | -      |
| shrink    | flex-shrink | `number` | -      |
| basis     | flex-basis  | `string` | -      |
| className | 自定义类名  | `string` | -      |

## 样式定制

### CSS 变量

```css
.flex {
  --flex-gap: 0;
  --flex-bg: #ffffff;
}
```

### 自定义样式

```tsx
<Flex className="custom-flex">
  <FlexItem>自定义</FlexItem>
  <FlexItem>自定义</FlexItem>
</Flex>

<style>
.custom-flex .flex-item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
}
</style>
```

## 最佳实践

### 1. 居中布局

```tsx
<Flex justify="center" align="center">
  <FlexItem>居中内容</FlexItem>
</Flex>
```

### 2. 两栏布局

```tsx
<Flex>
  <FlexItem flex={1}>左侧</FlexItem>
  <FlexItem flex={2}>右侧</FlexItem>
</Flex>
```

### 3. 均分布局

```tsx
<Flex>
  <FlexItem flex={1}>1/3</FlexItem>
  <FlexItem flex={1}>1/3</FlexItem>
  <FlexItem flex={1}>1/3</FlexItem>
</Flex>
```

### 4. 响应式布局

```tsx
<Flex wrap>
  <FlexItem flex="1 1 300px">项目1</FlexItem>
  <FlexItem flex="1 1 300px">项目2</FlexItem>
  <FlexItem flex="1 1 300px">项目3</FlexItem>
</Flex>
```

## 常见问题

### Q: 如何设置Flex的方向？

A: 使用 `direction` 属性设置Flex的方向。

### Q: 如何实现Flex的换行？

A: 使用 `wrap` 属性实现Flex的换行。

### Q: 如何设置Flex的间距？

A: 使用 `gap` 属性设置Flex的间距。

---

🌹 Flex 组件文档完成！
