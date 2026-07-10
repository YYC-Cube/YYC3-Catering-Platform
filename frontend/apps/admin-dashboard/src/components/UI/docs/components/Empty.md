# Empty 空状态

空状态时的展示占位图。

## 何时使用

- 当目前没有数据时，用于显式的用户提示。

## 代码演示

### 基础用法

```tsx
import { Empty } from "@/components/UI";

export default function EmptyBasic() {
  return <Empty />;
}
```

### 自定义描述

```tsx
import { Empty } from "@/components/UI";

export default function EmptyDescription() {
  return <Empty description="暂无数据" />;
}
```

### 自定义图片

```tsx
import { Empty } from "@/components/UI";

export default function EmptyImage() {
  return <Empty image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg" description="暂无数据" />;
}
```

### 自定义内容

```tsx
import { Empty } from "@/components/UI";
import { Button } from "@/components/UI";

export default function EmptyContent() {
  return (
    <Empty description="暂无数据">
      <Button type="primary">创建</Button>
    </Empty>
  );
}
```

### 无图片

```tsx
import { Empty } from "@/components/UI";

export default function EmptyNoImage() {
  return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />;
}
```

### 简单模式

```tsx
import { Empty } from "@/components/UI";

export default function EmptySimple() {
  return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />;
}
```

## API

### Empty Props

| 参数        | 说明       | 类型     | 默认值 |
| ----------- | ---------- | -------- | ------ |
| image       | 图片地址   | `string` | -      |
| description | 描述文本   | `string` | -      |
| className   | 自定义类名 | `string` | -      |

### Empty 静态属性

| 属性                    | 说明         | 类型     |
| ----------------------- | ------------ | -------- |
| PRESENTED_IMAGE_SIMPLE  | 简单模式图片 | `string` |
| PRESENTED_IMAGE_DEFAULT | 默认图片     | `string` |

## 样式定制

### CSS 变量

```css
.empty {
  --empty-text: #6b7280;
  --empty-description: #9ca3af;
}
```

### 自定义样式

```tsx
<Empty className="custom-empty" />

<style>
.custom-empty {
  padding: 4rem;
}

.custom-empty .empty-description {
  color: #667eea;
  font-size: 1.125rem;
}
</style>
```

## 最佳实践

### 1. 列表空状态

```tsx
{
  data.length === 0 ? <Empty description="暂无数据" /> : <List data={data} renderItem={renderItem} />;
}
```

### 2. 表格空状态

```tsx
{
  data.length === 0 ? <Empty description="暂无数据" /> : <Table columns={columns} data={data} />;
}
```

### 3. 搜索空状态

```tsx
{
  searchResults.length === 0 ? (
    <Empty description="未找到相关结果">
      <Button onClick={handleReset}>重置</Button>
    </Empty>
  ) : (
    <List data={searchResults} renderItem={renderItem} />
  );
}
```

### 4. 权限空状态

```tsx
{
  hasPermission ? (
    <List data={data} renderItem={renderItem} />
  ) : (
    <Empty description="您没有权限查看此内容">
      <Button onClick={handleApplyPermission}>申请权限</Button>
    </Empty>
  );
}
```

### 5. 错误空状态

```tsx
{
  error ? (
    <Empty image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg" description="加载失败">
      <Button onClick={handleRetry}>重试</Button>
    </Empty>
  ) : (
    <List data={data} renderItem={renderItem} />
  );
}
```

## 常见问题

### Q: 如何自定义空状态的描述？

A: 使用 `description` 属性自定义空状态的描述。

### Q: 如何自定义空状态的图片？

A: 使用 `image` 属性自定义空状态的图片。

### Q: 如何添加操作按钮？

A: 使用默认插槽添加操作按钮。

---

🌹 Empty 组件文档完成！
