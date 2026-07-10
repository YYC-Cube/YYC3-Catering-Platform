# Tree 树形控件

树形控件。

## 何时使用

- 文件夹、组织架构、生物分类、国家地区等等，世间万物的大多数结构都是树形结构。使用 `Tree` 控件可以完整展现其中的层级关系，并具有展开收起选择等交互功能。

## 代码演示

### 基础用法

```tsx
import { Tree, TreeNode } from "@/components/UI";

export default function TreeBasic() {
  const treeData = [
    {
      key: "1",
      title: "节点一",
      children: [
        { key: "1-1", title: "子节点一" },
        { key: "1-2", title: "子节点二" },
      ],
    },
    {
      key: "2",
      title: "节点二",
      children: [
        { key: "2-1", title: "子节点三" },
        { key: "2-2", title: "子节点四" },
      ],
    },
  ];

  return <Tree data={treeData} />;
}
```

### 可选择

```tsx
import { Tree } from "@/components/UI";
import { ref } from "vue";

export default function TreeSelectable() {
  const selectedKeys = ref(["1-1"]);

  const treeData = [
    {
      key: "1",
      title: "节点一",
      children: [
        { key: "1-1", title: "子节点一" },
        { key: "1-2", title: "子节点二" },
      ],
    },
    {
      key: "2",
      title: "节点二",
      children: [
        { key: "2-1", title: "子节点三" },
        { key: "2-2", title: "子节点四" },
      ],
    },
  ];

  const handleSelect = (keys: string[]) => {
    selectedKeys.value = keys;
  };

  return <Tree data={treeData} selectedKeys={selectedKeys.value} onSelect={handleSelect} />;
}
```

### 可勾选

```tsx
import { Tree } from "@/components/UI";
import { ref } from "vue";

export default function TreeCheckable() {
  const checkedKeys = ref(["1-1"]);

  const treeData = [
    {
      key: "1",
      title: "节点一",
      children: [
        { key: "1-1", title: "子节点一" },
        { key: "1-2", title: "子节点二" },
      ],
    },
    {
      key: "2",
      title: "节点二",
      children: [
        { key: "2-1", title: "子节点三" },
        { key: "2-2", title: "子节点四" },
      ],
    },
  ];

  const handleCheck = (keys: string[]) => {
    checkedKeys.value = keys;
  };

  return <Tree data={treeData} checkable checkedKeys={checkedKeys.value} onCheck={handleCheck} />;
}
```

### 可展开

```tsx
import { Tree } from "@/components/UI";
import { ref } from "vue";

export default function TreeExpandable() {
  const expandedKeys = ref(["1"]);

  const treeData = [
    {
      key: "1",
      title: "节点一",
      children: [
        { key: "1-1", title: "子节点一" },
        { key: "1-2", title: "子节点二" },
      ],
    },
    {
      key: "2",
      title: "节点二",
      children: [
        { key: "2-1", title: "子节点三" },
        { key: "2-2", title: "子节点四" },
      ],
    },
  ];

  const handleExpand = (keys: string[]) => {
    expandedKeys.value = keys;
  };

  return <Tree data={treeData} expandedKeys={expandedKeys.value} onExpand={handleExpand} />;
}
```

### 禁用节点

```tsx
import { Tree } from "@/components/UI";

export default function TreeDisabled() {
  const treeData = [
    {
      key: "1",
      title: "节点一",
      children: [
        { key: "1-1", title: "子节点一", disabled: true },
        { key: "1-2", title: "子节点二" },
      ],
    },
    {
      key: "2",
      title: "节点二",
      disabled: true,
      children: [
        { key: "2-1", title: "子节点三" },
        { key: "2-2", title: "子节点四" },
      ],
    },
  ];

  return <Tree data={treeData} />;
}
```

### 带图标

```tsx
import { Tree } from "@/components/UI";

export default function TreeWithIcon() {
  const treeData = [
    {
      key: "1",
      title: "📁 文件夹一",
      children: [
        { key: "1-1", title: "📄 文件一" },
        { key: "1-2", title: "📄 文件二" },
      ],
    },
    {
      key: "2",
      title: "📁 文件夹二",
      children: [
        { key: "2-1", title: "📄 文件三" },
        { key: "2-2", title: "📄 文件四" },
      ],
    },
  ];

  return <Tree data={treeData} showIcon />;
}
```

### 可拖拽

```tsx
import { Tree } from "@/components/UI";

export default function TreeDraggable() {
  const treeData = [
    {
      key: "1",
      title: "节点一",
      children: [
        { key: "1-1", title: "子节点一" },
        { key: "1-2", title: "子节点二" },
      ],
    },
    {
      key: "2",
      title: "节点二",
      children: [
        { key: "2-1", title: "子节点三" },
        { key: "2-2", title: "子节点四" },
      ],
    },
  ];

  return <Tree data={treeData} draggable />;
}
```

## API

### Tree Props

| 参数         | 说明         | 类型         | 默认值  |
| ------------ | ------------ | ------------ | ------- |
| data         | 树形数据     | `TreeNode[]` | -       |
| selectedKeys | 选中的节点   | `string[]`   | -       |
| checkedKeys  | 勾选的节点   | `string[]`   | -       |
| expandedKeys | 展开的节点   | `string[]`   | -       |
| checkable    | 是否可勾选   | `boolean`    | `false` |
| draggable    | 是否可拖拽   | `boolean`    | `false` |
| disabled     | 是否禁用     | `boolean`    | `false` |
| showIcon     | 是否显示图标 | `boolean`    | `false` |
| showLine     | 是否显示连线 | `boolean`    | `false` |
| onSelect     | 选择回调     | `Function`   | -       |
| onCheck      | 勾选回调     | `Function`   | -       |
| onExpand     | 展开回调     | `Function`   | -       |
| className    | 自定义类名   | `string`     | -       |

### TreeNode 类型定义

```typescript
interface TreeNode {
  key: string;
  title: string | VNode;
  children?: TreeNode[];
  disabled?: boolean;
  selectable?: boolean;
  checkable?: boolean;
}
```

## 样式定制

### CSS 变量

```css
.tree {
  --tree-bg: #ffffff;
  --tree-text: #374151;
  --tree-hover-bg: #f3f4f6;
  --tree-selected-bg: #eff6ff;
  --tree-selected-text: #3b82f6;
  --tree-disabled-text: #9ca3af;
}
```

### 自定义样式

```tsx
<Tree className="custom-tree" data={treeData} />

<style>
.custom-tree .tree-node {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
}

.custom-tree .tree-node:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
</style>
```

## 最佳实践

### 1. 文件树

```tsx
const fileTree = [
  {
    key: 'src',
    title: '📁 src',
    children: [
      {
        key: 'components',
        title: '📁 components',
        children: [
          { key: 'Button.tsx', title: '📄 Button.tsx' },
          { key: 'Input.tsx', title: '📄 Input.tsx' },
        ]
      },
      {
        key: 'pages',
        title: '📁 pages',
        children: [
          { key: 'Home.tsx', title: '📄 Home.tsx' },
          { key: 'About.tsx', title: '📄 About.tsx' },
        ]
      },
    ]
  }
]

<Tree
  data={fileTree}
  showIcon
  showLine
/>
```

### 2. 组织架构

```tsx
const organization = [
  {
    key: 'company',
    title: '公司',
    children: [
      {
        key: 'tech',
        title: '技术部',
        children: [
          { key: 'frontend', title: '前端组' },
          { key: 'backend', title: '后端组' },
        ]
      },
      {
        key: 'product',
        title: '产品部',
        children: [
          { key: 'design', title: '设计组' },
          { key: 'pm', title: '产品组' },
        ]
      },
    ]
  }
]

<Tree
  data={organization}
  checkable
  showLine
/>
```

### 3. 权限管理

```tsx
const permissions = [
  {
    key: 'system',
    title: '系统管理',
    children: [
      {
        key: 'user',
        title: '用户管理',
        children: [
          { key: 'user-view', title: '查看用户' },
          { key: 'user-add', title: '添加用户' },
          { key: 'user-edit', title: '编辑用户' },
          { key: 'user-delete', title: '删除用户' },
        ]
      },
      {
        key: 'role',
        title: '角色管理',
        children: [
          { key: 'role-view', title: '查看角色' },
          { key: 'role-add', title: '添加角色' },
        ]
      },
    ]
  }
]

<Tree
  data={permissions}
  checkable
  defaultCheckedKeys={['user-view', 'role-view']}
/>
```

## 常见问题

### Q: 如何实现节点选择？

A: 使用 `selectedKeys` 和 `onSelect` 实现节点选择。

### Q: 如何实现节点勾选？

A: 使用 `checkable`、`checkedKeys` 和 `onCheck` 实现节点勾选。

### Q: 如何实现节点展开？

A: 使用 `expandedKeys` 和 `onExpand` 实现节点展开。

---

🌹 Tree 组件文档完成！
