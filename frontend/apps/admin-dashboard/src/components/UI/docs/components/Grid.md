# Grid 栅格

24 栅格系统。

## 何时使用

- 在多数业务情况下，Ant Design 需要在设计区域内解决大量信息收纳的问题，因此，在设计层面采用栅格系统来解决布局问题。将页面宽度划分为 24 等分，通过 `col` 组件在需要的位置引入。

## 代码演示

### 基础用法

```tsx
import { Grid, GridRow, GridCol } from "@/components/UI";

export default function GridBasic() {
  return (
    <Grid>
      <GridRow>
        <GridCol span={8}>col-8</GridCol>
        <GridCol span={8}>col-8</GridCol>
        <GridCol span={8}>col-8</GridCol>
      </GridRow>
    </Grid>
  );
}
```

### 间距

```tsx
import { Grid, GridRow, GridCol } from "@/components/UI";

export default function GridGutter() {
  return (
    <Grid>
      <GridRow gutter={16}>
        <GridCol span={8}>col-8</GridCol>
        <GridCol span={8}>col-8</GridCol>
        <GridCol span={8}>col-8</GridCol>
      </GridRow>
    </Grid>
  );
}
```

### 对齐

```tsx
import { Grid, GridRow, GridCol } from "@/components/UI";

export default function GridAlign() {
  return (
    <Grid>
      <GridRow align="center">
        <GridCol span={8}>居中对齐</GridCol>
        <GridCol span={8}>居中对齐</GridCol>
        <GridCol span={8}>居中对齐</GridCol>
      </GridRow>
    </Grid>
  );
}
```

### 偏移

```tsx
import { Grid, GridRow, GridCol } from "@/components/UI";

export default function GridOffset() {
  return (
    <Grid>
      <GridRow>
        <GridCol span={6}>col-6</GridCol>
        <GridCol span={6} offset={6}>
          col-6 offset-6
        </GridCol>
        <GridCol span={6} offset={6}>
          col-6 offset-6
        </GridCol>
      </GridRow>
    </Grid>
  );
}
```

### 推拉

```tsx
import { Grid, GridRow, GridCol } from "@/components/UI";

export default function GridPushPull() {
  return (
    <Grid>
      <GridRow>
        <GridCol span={18} push={6}>
          col-18 push-6
        </GridCol>
        <GridCol span={6} pull={18}>
          col-6 pull-18
        </GridCol>
      </GridRow>
    </Grid>
  );
}
```

### 响应式

```tsx
import { Grid, GridRow, GridCol } from "@/components/UI";

export default function GridResponsive() {
  return (
    <Grid>
      <GridRow>
        <GridCol xs={24} sm={12} md={8} lg={6} xl={4}>
          xs-24 sm-12 md-8 lg-6 xl-4
        </GridCol>
        <GridCol xs={24} sm={12} md={8} lg={6} xl={4}>
          xs-24 sm-12 md-8 lg-6 xl-4
        </GridCol>
        <GridCol xs={24} sm={12} md={8} lg={6} xl={4}>
          xs-24 sm-12 md-8 lg-6 xl-4
        </GridCol>
        <GridCol xs={24} sm={12} md={8} lg={6} xl={4}>
          xs-24 sm-12 md-8 lg-6 xl-4
        </GridCol>
        <GridCol xs={24} sm={12} md={8} lg={6} xl={4}>
          xs-24 sm-12 md-8 lg-6 xl-4
        </GridCol>
        <GridCol xs={24} sm={12} md={8} lg={6} xl={4}>
          xs-24 sm-12 md-8 lg-6 xl-4
        </GridCol>
      </GridRow>
    </Grid>
  );
}
```

## API

### Grid Props

| 参数      | 说明       | 类型     | 默认值 |
| --------- | ---------- | -------- | ------ |
| className | 自定义类名 | `string` | -      |

### GridRow Props

| 参数      | 说明       | 类型     | 默认值                                                        |
| --------- | ---------- | -------- | ------------------------------------------------------------- | ------- |
| gutter    | 栅格间距   | `number` | `0`                                                           |
| align     | 垂直对齐   | `string` | `top` / `middle` / `bottom`                                   | `top`   |
| justify   | 水平排列   | `string` | `start` / `center` / `end` / `space-between` / `space-around` | `start` |
| className | 自定义类名 | `string` | -                                                             |

### GridCol Props

| 参数      | 说明                 | 类型     | 默认值 |
| --------- | -------------------- | -------- | ------ |
| span      | 栅格占位格数         | `number` | `24`   |
| offset    | 栅格左侧的间隔格数   | `number` | `0`    |
| push      | 栅格向右移动格数     | `number` | `0`    |
| pull      | 栅格向左移动格数     | `number` | `0`    |
| xs        | `<576px` 响应式栅格  | `number` | -      |
| sm        | `≥576px` 响应式栅格  | `number` | -      |
| md        | `≥768px` 响应式栅格  | `number` | -      |
| lg        | `≥992px` 响应式栅格  | `number` | -      |
| xl        | `≥1200px` 响应式栅格 | `number` | -      |
| className | 自定义类名           | `string` | -      |

## 样式定制

### CSS 变量

```css
.grid {
  --grid-gap: 0;
  --grid-bg: #ffffff;
  --grid-border: #e5e7eb;
}
```

### 自定义样式

```tsx
<Grid className="custom-grid">
  <GridRow>
    <GridCol span={8}>自定义</GridCol>
  </GridRow>
</Grid>

<style>
.custom-grid .grid-col {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
}
</style>
```

## 最佳实践

### 1. 基础布局

```tsx
<Grid>
  <GridRow gutter={16}>
    <GridCol span={8}>
      <Card>左侧</Card>
    </GridCol>
    <GridCol span={16}>
      <Card>右侧</Card>
    </GridCol>
  </GridRow>
</Grid>
```

### 2. 响应式布局

```tsx
<Grid>
  <GridRow gutter={16}>
    <GridCol xs={24} sm={12} md={8} lg={6}>
      <Card>卡片1</Card>
    </GridCol>
    <GridCol xs={24} sm={12} md={8} lg={6}>
      <Card>卡片2</Card>
    </GridCol>
    <GridCol xs={24} sm={12} md={8} lg={6}>
      <Card>卡片3</Card>
    </GridCol>
    <GridCol xs={24} sm={12} md={8} lg={6}>
      <Card>卡片4</Card>
    </GridCol>
  </GridRow>
</Grid>
```

### 3. 表单布局

```tsx
<Grid>
  <GridRow gutter={16}>
    <GridCol xs={24} sm={12}>
      <FormField name="username" label="用户名">
        <Input type="text" />
      </FormField>
    </GridCol>
    <GridCol xs={24} sm={12}>
      <FormField name="email" label="邮箱">
        <Input type="email" />
      </FormField>
    </GridCol>
    <GridCol xs={24}>
      <FormField name="address" label="地址">
        <Input type="text" />
      </FormField>
    </GridCol>
  </GridRow>
</Grid>
```

## 常见问题

### Q: 如何设置栅格间距？

A: 使用 `GridRow` 的 `gutter` 属性设置栅格间距。

### Q: 如何实现响应式布局？

A: 使用 `xs`、`sm`、`md`、`lg`、`xl` 属性设置响应式栅格。

### Q: 如何实现栅格的偏移？

A: 使用 `offset`、`push`、`pull` 属性实现栅格的偏移。

---

🌹 Grid 组件文档完成！
