# Breadcrumb 面包屑

显示当前页面在系统层级结构中的位置，并能向上返回。

## 何时使用

- 当系统拥有超过两级层级时。
- 当需要告知用户『你在哪里』时。
- 当需要向上导航的功能时。

## 代码演示

### 基础用法

```tsx
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from "@/components/UI";

export default function BreadcrumbBasic() {
  return (
    <Breadcrumb>
      <BreadcrumbItem href="/">首页</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem href="/products">产品</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>详情</BreadcrumbItem>
    </Breadcrumb>
  );
}
```

### 自定义分隔符

```tsx
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from "@/components/UI";

export default function BreadcrumbSeparator() {
  return (
    <div class="space-y-2">
      <Breadcrumb separator="/">
        <BreadcrumbItem href="/">首页</BreadcrumbItem>
        <BreadcrumbItem href="/products">产品</BreadcrumbItem>
        <BreadcrumbItem>详情</BreadcrumbItem>
      </Breadcrumb>
      <Breadcrumb separator=">">
        <BreadcrumbItem href="/">首页</BreadcrumbItem>
        <BreadcrumbItem href="/products">产品</BreadcrumbItem>
        <BreadcrumbItem>详情</BreadcrumbItem>
      </Breadcrumb>
    </div>
  );
}
```

### 带图标

```tsx
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from "@/components/UI";

export default function BreadcrumbWithIcon() {
  return (
    <Breadcrumb>
      <BreadcrumbItem href="/">🏠 首页</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem href="/products">📦 产品</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>📄 详情</BreadcrumbItem>
    </Breadcrumb>
  );
}
```

### 可点击

```tsx
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from "@/components/UI";

export default function BreadcrumbClickable() {
  return (
    <Breadcrumb>
      <BreadcrumbItem href="/" onClick={() => console.log("首页")}>
        首页
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem href="/products" onClick={() => console.log("产品")}>
        产品
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>详情</BreadcrumbItem>
    </Breadcrumb>
  );
}
```

### 禁用状态

```tsx
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from "@/components/UI";

export default function BreadcrumbDisabled() {
  return (
    <Breadcrumb>
      <BreadcrumbItem href="/">首页</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem href="/products">产品</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem disabled>详情</BreadcrumbItem>
    </Breadcrumb>
  );
}
```

## API

### Breadcrumb Props

| 参数      | 说明       | 类型     | 默认值 |
| --------- | ---------- | -------- | ------ |
| separator | 分隔符     | `string` | `/`    |
| className | 自定义类名 | `string` | -      |

### BreadcrumbItem Props

| 参数      | 说明       | 类型       | 默认值  |
| --------- | ---------- | ---------- | ------- |
| href      | 链接地址   | `string`   | -       |
| disabled  | 是否禁用   | `boolean`  | `false` |
| onClick   | 点击回调   | `Function` | -       |
| className | 自定义类名 | `string`   | -       |

### BreadcrumbSeparator Props

| 参数      | 说明       | 类型     | 默认值 |
| --------- | ---------- | -------- | ------ |
| className | 自定义类名 | `string` | -      |

## 样式定制

### CSS 变量

```css
.breadcrumb {
  --breadcrumb-item-color: #6b7280;
  --breadcrumb-item-hover: #3b82f6;
  --breadcrumb-separator-color: #9ca3af;
  --breadcrumb-font-size: 0.875rem;
}
```

### 自定义样式

```tsx
<Breadcrumb className="custom-breadcrumb">
  <BreadcrumbItem href="/">首页</BreadcrumbItem>
  <BreadcrumbSeparator />
  <BreadcrumbItem>详情</BreadcrumbItem>
</Breadcrumb>

<style>
.custom-breadcrumb .breadcrumb-item {
  color: #667eea;
}

.custom-breadcrumb .breadcrumb-item:hover {
  color: #764ba2;
}
</style>
```

## 最佳实践

### 1. 动态面包屑

```tsx
const routes = [
  { path: "/", name: "首页" },
  { path: "/products", name: "产品" },
  { path: "/products/detail", name: "详情" },
];

const breadcrumbItems = computed(() => {
  return routes.map((route, index) => (
    <Fragment key={route.path}>
      <BreadcrumbItem href={route.path}>{route.name}</BreadcrumbItem>
      {index < routes.length - 1 && <BreadcrumbSeparator />}
    </Fragment>
  ));
});
```

### 2. 带路由的面包屑

```tsx
import { useRouter } from "vue-router";

const router = useRouter();

const handleClick = (path: string) => {
  router.push(path);
};

<Breadcrumb>
  <BreadcrumbItem href="/" onClick={() => handleClick("/")}>
    首页
  </BreadcrumbItem>
  <BreadcrumbSeparator />
  <BreadcrumbItem href="/products" onClick={() => handleClick("/products")}>
    产品
  </BreadcrumbItem>
</Breadcrumb>;
```

### 3. 面包屑导航

```tsx
<Breadcrumb>
  <BreadcrumbItem href="/">首页</BreadcrumbItem>
  <BreadcrumbSeparator />
  <BreadcrumbItem href="/category">分类</BreadcrumbItem>
  <BreadcrumbSeparator />
  <BreadcrumbItem href="/category/123">子分类</BreadcrumbItem>
  <BreadcrumbSeparator />
  <BreadcrumbItem>商品详情</BreadcrumbItem>
</Breadcrumb>
```

## 常见问题

### Q: 如何自定义分隔符？

A: 使用 `separator` 属性设置自定义分隔符。

### Q: 如何实现点击导航？

A: 使用 `href` 属性和 `onClick` 回调实现点击导航。

### Q: 如何禁用某个面包屑项？

A: 使用 `disabled` 属性禁用面包屑项。

---

🌹 Breadcrumb 组件文档完成！
