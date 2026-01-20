# Pagination 分页

采用分页形式分隔长列表，每次只加载一个页面。

## 何时使用

- 当加载/渲染所有数据将花费很多时间时。
- 可切换页码改变数据展示。

## 代码演示

### 基础用法

```tsx
import { Pagination } from '@/components/UI'
import { ref } from 'vue'

export default function PaginationBasic() {
  const current = ref(1)

  return (
    <Pagination
      v-model={current.value}
      total={100}
      pageSize={10}
    />
  )
}
```

### 更多功能

```tsx
import { Pagination } from '@/components/UI'
import { ref } from 'vue'

export default function PaginationMore() {
  const current = ref(1)
  const pageSize = ref(10)

  return (
    <Pagination
      v-model={current.value}
      v-model:pageSize={pageSize.value}
      total={100}
      showTotal
      showSizeChanger
      showQuickJumper
    />
  )
}
```

### 迷你版

```tsx
import { Pagination } from '@/components/UI'
import { ref } from 'vue'

export default function PaginationMini() {
  const current = ref(1)

  return (
    <Pagination
      v-model={current.value}
      total={100}
      pageSize={10}
      size="sm"
      simple
    />
  )
}
```

### 改变每页数量

```tsx
import { Pagination } from '@/components/UI'
import { ref } from 'vue'

export default function PaginationSizeChanger() {
  const current = ref(1)
  const pageSize = ref(10)

  const handlePageSizeChange = (size: number) => {
    console.log('每页数量:', size)
  }

  return (
    <Pagination
      v-model={current.value}
      v-model:pageSize={pageSize.value}
      total={100}
      showSizeChanger
      onPageSizeChange={handlePageSizeChange}
    />
  )
}
```

### 快速跳转

```tsx
import { Pagination } from '@/components/UI'
import { ref } from 'vue'

export default function PaginationQuickJumper() {
  const current = ref(1)

  return (
    <Pagination
      v-model={current.value}
      total={100}
      pageSize={10}
      showQuickJumper
    />
  )
}
```

### 显示总数

```tsx
import { Pagination } from '@/components/UI'
import { ref } from 'vue'

export default function PaginationShowTotal() {
  const current = ref(1)

  return (
    <Pagination
      v-model={current.value}
      total={100}
      pageSize={10}
      showTotal
    />
  )
}
```

## API

### Pagination Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| modelValue | 当前页数 | `number` | `1` |
| total | 数据总数 | `number` | `0` |
| pageSize | 每页条数 | `number` | `10` |
| disabled | 是否禁用 | `boolean` | `false` |
| size | 尺寸 | `string` | `sm` / `md` / `lg` | `md` |
| simple | 是否简洁模式 | `boolean` | `false` |
| showTotal | 是否显示总数 | `boolean` | `false` |
| showSizeChanger | 是否显示每页条数选择器 | `boolean` | `false` |
| showQuickJumper | 是否显示快速跳转 | `boolean` | `false` |
| pageSizeOptions | 每页条数选项 | `number[]` | `[10, 20, 50, 100]` |
| onChange | 页码变化回调 | `Function` | - |
| onPageSizeChange | 每页条数变化回调 | `Function` | - |
| className | 自定义类名 | `string` | - |

## 样式定制

### CSS 变量

```css
.pagination {
  --pagination-bg: #ffffff;
  --pagination-border: #e5e7eb;
  --pagination-text: #374151;
  --pagination-hover-bg: #f3f4f6;
  --pagination-active-bg: #3b82f6;
  --pagination-active-text: #ffffff;
  --pagination-disabled-bg: #f9fafb;
  --pagination-disabled-text: #9ca3af;
}
```

### 自定义样式

```tsx
<Pagination className="custom-pagination" total={100} />

<style>
.custom-pagination .pagination-item {
  border-radius: 0.5rem;
}

.custom-pagination .pagination-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}
</style>
```

## 最佳实践

### 1. 表格分页

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

watch([current, pageSize], () => {
  fetchData()
})

<Table data={data.value} />
<Pagination
  v-model={current.value}
  v-model:pageSize={pageSize.value}
  total={total}
  showTotal
  showSizeChanger
/>
```

### 2. 列表分页

```tsx
const current = ref(1)
const pageSize = ref(20)

<List
  data={visibleData.value}
  renderItem={(item) => (
    <ListItem>{item.title}</ListItem>
  )}
/>
<Pagination
  v-model={current.value}
  total={total}
  pageSize={pageSize.value}
  simple
/>
```

### 3. 自定义总数显示

```tsx
<Pagination
  total={total}
  showTotal={(total, range) => `${range[0]}-${range[1]} 共 ${total} 条`}
/>
```

## 常见问题

### Q: 如何设置默认页码？

A: 使用 `v-model` 绑定一个初始值。

### Q: 如何自定义每页条数选项？

A: 使用 `pageSizeOptions` 属性设置自定义选项。

### Q: 如何实现服务端分页？

A: 监听 `onChange` 和 `onPageSizeChange` 事件，从服务端获取数据。

---

🌹 Pagination 组件文档完成！
