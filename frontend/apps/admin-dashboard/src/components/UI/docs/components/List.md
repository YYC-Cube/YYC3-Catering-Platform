# List 列表

最基础的列表展示，可承载文字、列表、图片、段落，常用于后台数据展示页面。

## 何时使用

- 最基础的列表展示，可承载文字、列表、图片、段落，常用于后台数据展示页面。

## 代码演示

### 基础用法

```tsx
import { List, ListItem, ListItemMeta } from '@/components/UI'

export default function ListBasic() {
  const data = [
    { title: '项目一', description: '项目一的描述' },
    { title: '项目二', description: '项目二的描述' },
    { title: '项目三', description: '项目三的描述' },
  ]

  return (
    <List
      data={data}
      renderItem={(item: any) => (
        <ListItem>
          <ListItemMeta title={item.title} description={item.description} />
        </ListItem>
      )}
    />
  )
}
```

### 带边框

```tsx
import { List, ListItem, ListItemMeta } from '@/components/UI'

export default function ListBordered() {
  const data = [
    { title: '项目一', description: '项目一的描述' },
    { title: '项目二', description: '项目二的描述' },
  ]

  return (
    <List
      bordered
      data={data}
      renderItem={(item: any) => (
        <ListItem>
          <ListItemMeta title={item.title} description={item.description} />
        </ListItem>
      )}
    />
  )
}
```

### 分割线

```tsx
import { List, ListItem, ListItemMeta } from '@/components/UI'

export default function ListSplit() {
  const data = [
    { title: '项目一', description: '项目一的描述' },
    { title: '项目二', description: '项目二的描述' },
  ]

  return (
    <List
      split
      data={data}
      renderItem={(item: any) => (
        <ListItem>
          <ListItemMeta title={item.title} description={item.description} />
        </ListItem>
      )}
    />
  )
}
```

### 带头像

```tsx
import { List, ListItem, ListItemMeta } from '@/components/UI'

export default function ListWithAvatar() {
  const data = [
    { 
      title: '张三', 
      description: '前端开发工程师',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    { 
      title: '李四', 
      description: '后端开发工程师',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
  ]

  return (
    <List
      data={data}
      renderItem={(item: any) => (
        <ListItem>
          <ListItemMeta 
            title={item.title} 
            description={item.description}
            avatar={item.avatar}
          />
        </ListItem>
      )}
    />
  )
}
```

### 操作按钮

```tsx
import { List, ListItem, ListItemMeta } from '@/components/UI'
import { Button } from '@/components/UI'

export default function ListWithActions() {
  const data = [
    { title: '项目一', description: '项目一的描述' },
    { title: '项目二', description: '项目二的描述' },
  ]

  return (
    <List
      data={data}
      renderItem={(item: any) => (
        <ListItem actions={['编辑', '删除']}>
          <ListItemMeta title={item.title} description={item.description} />
        </ListItem>
      )}
    />
  )
}
```

### 分页列表

```tsx
import { List, ListItem, ListItemMeta } from '@/components/UI'
import { Pagination } from '@/components/UI'
import { ref } from 'vue'

export default function ListWithPagination() {
  const current = ref(1)
  const data = Array.from({ length: 50 }, (_, i) => ({
    title: `项目 ${i + 1}`,
    description: `项目 ${i + 1} 的描述`
  }))

  const pageSize = 10
  const startIndex = (current.value - 1) * pageSize
  const endIndex = startIndex + pageSize
  const visibleData = data.slice(startIndex, endIndex)

  return (
    <div>
      <List
        data={visibleData}
        renderItem={(item: any) => (
          <ListItem>
            <ListItemMeta title={item.title} description={item.description} />
          </ListItem>
        )}
      />
      <Pagination
        v-model={current.value}
        total={data.length}
        pageSize={pageSize}
      />
    </div>
  )
}
```

### 加载状态

```tsx
import { List, ListItem, ListItemMeta } from '@/components/UI'

export default function ListLoading() {
  return (
    <List
      loading
      data={[]}
      renderItem={() => (
        <ListItem>
          <ListItemMeta title="加载中..." />
        </ListItem>
      )}
    />
  )
}
```

### 空状态

```tsx
import { List, ListItem, ListItemMeta } from '@/components/UI'

export default function ListEmpty() {
  return (
    <List
      data={[]}
      renderItem={() => (
        <ListItem>
          <ListItemMeta title="暂无数据" />
        </ListItem>
      )}
    />
  )
}
```

## API

### List Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| data | 数据源 | `any[]` | - |
| renderItem | 自定义渲染项 | `Function` | - |
| bordered | 是否显示边框 | `boolean` | `false` |
| split | 是否显示分割线 | `boolean` | `false` |
| loading | 是否加载中 | `boolean` | `false` |
| pagination | 分页配置 | `PaginationProps` | - |
| onSelect | 选择回调 | `Function` | - |
| className | 自定义类名 | `string` | - |

### ListItem Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| actions | 操作按钮 | `string[]` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| selected | 是否选中 | `boolean` | `false` |
| className | 自定义类名 | `string` | - |

### ListItemMeta Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| title | 标题 | `string` | - |
| description | 描述 | `string` | - |
| avatar | 头像 | `string` | - |
| className | 自定义类名 | `string` | - |

## 样式定制

### CSS 变量

```css
.list {
  --list-bg: #ffffff;
  --list-border: #e5e7eb;
  --list-hover-bg: #f3f4f6;
  --list-text: #374151;
  --list-meta-title: #111827;
  --list-meta-description: #6b7280;
}
```

### 自定义样式

```tsx
<List className="custom-list" data={data} renderItem={renderItem} />

<style>
.custom-list .list-item {
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
}

.custom-list .list-item:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
</style>
```

## 最佳实践

### 1. 用户列表

```tsx
const users = [
  { 
    id: 1,
    name: '张三', 
    description: '前端开发工程师',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  { 
    id: 2,
    name: '李四', 
    description: '后端开发工程师',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
]

<List
  data={users}
  renderItem={(user) => (
    <ListItem>
      <ListItemMeta 
        title={user.name} 
        description={user.description}
        avatar={user.avatar}
      />
    </ListItem>
  )}
/>
```

### 2. 文章列表

```tsx
const articles = [
  { 
    id: 1,
    title: 'Vue 3 新特性介绍', 
    description: 'Vue 3 带来了许多新特性...',
    date: '2024-01-01'
  },
  { 
    id: 2,
    title: 'TypeScript 最佳实践', 
    description: 'TypeScript 是 JavaScript 的超集...',
    date: '2024-01-02'
  },
]

<List
  data={articles}
  renderItem={(article) => (
    <ListItem>
      <div class="flex-1">
        <h3 class="font-bold">{article.title}</h3>
        <p class="text-neutral-600">{article.description}</p>
        <span class="text-sm text-neutral-400">{article.date}</span>
      </div>
    </ListItem>
  )}
/>
```

### 3. 任务列表

```tsx
const tasks = [
  { id: 1, title: '完成文档', status: 'pending' },
  { id: 2, title: '修复bug', status: 'completed' },
  { id: 3, title: '代码审查', status: 'in-progress' },
]

<List
  data={tasks}
  renderItem={(task) => (
    <ListItem>
      <div class="flex items-center space-x-2">
        <span class={`w-2 h-2 rounded-full ${
          task.status === 'completed' ? 'bg-success-500' :
          task.status === 'in-progress' ? 'bg-warning-500' :
          'bg-neutral-400'
        }`} />
        <span>{task.title}</span>
      </div>
    </ListItem>
  )}
/>
```

## 常见问题

### Q: 如何自定义列表项的内容？

A: 使用 `renderItem` 函数自定义列表项的内容。

### Q: 如何实现列表分页？

A: 使用 `pagination` 属性或配合 Pagination 组件实现分页。

### Q: 如何实现列表项的选择？

A: 使用 `onSelect` 回调函数实现列表项的选择。

---

🌹 List 组件文档完成！
