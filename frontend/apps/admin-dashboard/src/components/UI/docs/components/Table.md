# Table 表格

展示行列数据。

## 何时使用

- 当有大量结构化的数据需要展现时。
- 当需要对数据进行排序、搜索、分页、自定义操作等复杂行为时。

## 代码演示

### 基础用法

```tsx
import { Table } from "@/components/UI";

export default function TableBasic() {
  const columns = [
    { key: "name", title: "姓名" },
    { key: "age", title: "年龄" },
    { key: "email", title: "邮箱" },
  ];

  const data = [
    { name: "张三", age: 25, email: "zhangsan@example.com" },
    { name: "李四", age: 30, email: "lisi@example.com" },
    { name: "王五", age: 28, email: "wangwu@example.com" },
  ];

  return <Table columns={columns} data={data} />;
}
```

### 带边框

```tsx
import { Table } from "@/components/UI";

export default function TableBordered() {
  const columns = [
    { key: "name", title: "姓名" },
    { key: "age", title: "年龄" },
  ];

  const data = [
    { name: "张三", age: 25 },
    { name: "李四", age: 30 },
  ];

  return <Table columns={columns} data={data} bordered />;
}
```

### 斑马纹

```tsx
import { Table } from "@/components/UI";

export default function TableStriped() {
  const columns = [
    { key: "name", title: "姓名" },
    { key: "age", title: "年龄" },
  ];

  const data = [
    { name: "张三", age: 25 },
    { name: "李四", age: 30 },
  ];

  return <Table columns={columns} data={data} striped />;
}
```

### 悬停高亮

```tsx
import { Table } from "@/components/UI";

export default function TableHoverable() {
  const columns = [
    { key: "name", title: "姓名" },
    { key: "age", title: "年龄" },
  ];

  const data = [
    { name: "张三", age: 25 },
    { name: "李四", age: 30 },
  ];

  return <Table columns={columns} data={data} hoverable />;
}
```

### 紧凑模式

```tsx
import { Table } from "@/components/UI";

export default function TableCompact() {
  const columns = [
    { key: "name", title: "姓名" },
    { key: "age", title: "年龄" },
  ];

  const data = [
    { name: "张三", age: 25 },
    { name: "李四", age: 30 },
  ];

  return <Table columns={columns} data={data} compact />;
}
```

### 自定义列

```tsx
import { Table } from "@/components/UI";

export default function TableCustomColumn() {
  const columns = [
    {
      key: "name",
      title: "姓名",
      render: (text: string, record: any) => <span style={{ color: "blue" }}>{text}</span>,
    },
    {
      key: "age",
      title: "年龄",
      render: (text: number) => `${text}岁`,
    },
  ];

  const data = [
    { name: "张三", age: 25 },
    { name: "李四", age: 30 },
  ];

  return <Table columns={columns} data={data} />;
}
```

### 操作列

```tsx
import { Table } from "@/components/UI";
import { Button } from "@/components/UI";

export default function TableActions() {
  const columns = [
    { key: "name", title: "姓名" },
    { key: "age", title: "年龄" },
    {
      key: "actions",
      title: "操作",
      render: (_: any, record: any) => (
        <div class="space-x-2">
          <Button size="sm" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button size="sm" type="danger" onClick={() => handleDelete(record)}>
            删除
          </Button>
        </div>
      ),
    },
  ];

  const data = [
    { id: 1, name: "张三", age: 25 },
    { id: 2, name: "李四", age: 30 },
  ];

  const handleEdit = (record: any) => {
    console.log("编辑:", record);
  };

  const handleDelete = (record: any) => {
    console.log("删除:", record);
  };

  return <Table columns={columns} data={data} />;
}
```

### 加载状态

```tsx
import { Table } from "@/components/UI";

export default function TableLoading() {
  const columns = [
    { key: "name", title: "姓名" },
    { key: "age", title: "年龄" },
  ];

  return <Table columns={columns} data={[]} loading />;
}
```

### 空状态

```tsx
import { Table } from "@/components/UI";

export default function TableEmpty() {
  const columns = [
    { key: "name", title: "姓名" },
    { key: "age", title: "年龄" },
  ];

  return <Table columns={columns} data={[]} />;
}
```

## API

### Table Props

| 参数      | 说明           | 类型       | 默认值  |
| --------- | -------------- | ---------- | ------- |
| columns   | 列配置         | `Column[]` | -       |
| data      | 数据源         | `any[]`    | -       |
| bordered  | 是否显示边框   | `boolean`  | `false` |
| striped   | 是否显示斑马纹 | `boolean`  | `false` |
| hoverable | 是否悬停高亮   | `boolean`  | `false` |
| compact   | 是否紧凑模式   | `boolean`  | `false` |
| loading   | 是否加载中     | `boolean`  | `false` |
| onSelect  | 行选择回调     | `Function` | -       |
| className | 自定义类名     | `string`   | -       |

### Column 类型定义

```typescript
interface Column {
  key: string;
  title: string;
  width?: number;
  align?: "left" | "center" | "right";
  render?: (text: any, record: any, index: number) => VNode;
}
```

## 样式定制

### CSS 变量

```css
.table {
  --table-bg: #ffffff;
  --table-border: #e5e7eb;
  --table-header-bg: #f9fafb;
  --table-text: #374151;
  --table-hover-bg: #f3f4f6;
  --table-striped-bg: #f9fafb;
}
```

### 自定义样式

```tsx
<Table className="custom-table" columns={columns} data={data} />

<style>
.custom-table {
  border-radius: 0.5rem;
  overflow: hidden;
}

.custom-table th {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
</style>
```

## 最佳实践

### 1. 分页表格

```tsx
const current = ref(1)
const pageSize = ref(10)
const data = ref([])

const fetchData = async () => {
  const result = await api.getList({
    page: current.value,
    pageSize: pageSize.value
  })
  data.value = result.data
}

<Table
  columns={columns}
  data={data.value}
  loading={loading.value}
/>
<Pagination
  v-model={current.value}
  v-model:pageSize={pageSize.value}
  total={total}
  onChange={fetchData}
/>
```

### 2. 可选表格

```tsx
const selectedRows = ref([]);

const handleSelect = (record: any, selected: boolean) => {
  if (selected) {
    selectedRows.value.push(record);
  } else {
    selectedRows.value = selectedRows.value.filter(r => r.id !== record.id);
  }
};

<Table columns={columns} data={data} onSelect={handleSelect} />;
```

### 3. 排序表格

```tsx
const sortField = ref("");
const sortOrder = ref("asc");

const handleSort = (field: string) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortOrder.value = "asc";
  }
};

<Table columns={columns} data={sortedData.value} />;
```

## 常见问题

### Q: 如何自定义列的内容？

A: 使用 `render` 函数自定义列的内容。

### Q: 如何实现表格分页？

A: 使用 Pagination 组件配合 Table 组件实现分页。

### Q: 如何实现表格排序？

A: 使用 `render` 函数和排序逻辑实现表格排序。

---

🌹 Table 组件文档完成！
