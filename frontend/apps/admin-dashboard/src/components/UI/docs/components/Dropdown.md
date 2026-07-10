# Dropdown 下拉菜单

向下弹出的列表。

## 何时使用

- 当页面上的操作命令过多时，用此组件可以收纳操作元素。点击或移入元素，出现一个下拉菜单。

## 代码演示

### 基础用法

```tsx
import { Dropdown, DropdownMenu, DropdownItem } from "@/components/UI";
import { Button } from "@/components/UI";

export default function DropdownBasic() {
  const items = [
    { label: "选项一", value: "option1" },
    { label: "选项二", value: "option2" },
    { label: "选项三", value: "option3" },
  ];

  return <Dropdown items={items} trigger={<Button>点击打开</Button>} />;
}
```

### 触发方式

```tsx
import { Dropdown } from "@/components/UI";
import { Button } from "@/components/UI";

export default function DropdownTrigger() {
  const items = [
    { label: "选项一", value: "option1" },
    { label: "选项二", value: "option2" },
  ];

  return (
    <div class="space-x-2">
      <Dropdown trigger="click" items={items} triggerElement={<Button>点击触发</Button>} />
      <Dropdown trigger="hover" items={items} triggerElement={<Button>悬停触发</Button>} />
      <Dropdown trigger="focus" items={items} triggerElement={<Button>聚焦触发</Button>} />
    </div>
  );
}
```

### 菜单项操作

```tsx
import { Dropdown, DropdownMenu, DropdownItem, DropdownDivider } from "@/components/UI";
import { Button } from "@/components/UI";

export default function DropdownActions() {
  return (
    <Dropdown trigger={<Button>操作</Button>}>
      <DropdownMenu>
        <DropdownItem>编辑</DropdownItem>
        <DropdownItem>复制</DropdownItem>
        <DropdownDivider />
        <DropdownItem danger>删除</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
```

### 带图标

```tsx
import { Dropdown, DropdownMenu, DropdownItem } from "@/components/UI";
import { Button } from "@/components/UI";

export default function DropdownWithIcon() {
  return (
    <Dropdown trigger={<Button>带图标</Button>}>
      <DropdownMenu>
        <DropdownItem icon="📝">编辑</DropdownItem>
        <DropdownItem icon="📋">复制</DropdownItem>
        <DropdownItem icon="🗑️">删除</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
```

### 禁用状态

```tsx
import { Dropdown, DropdownMenu, DropdownItem } from "@/components/UI";
import { Button } from "@/components/UI";

export default function DropdownDisabled() {
  return (
    <div class="space-x-2">
      <Dropdown disabled items={[{ label: "选项一", value: "option1" }]} trigger={<Button>禁用</Button>} />
      <Dropdown trigger={<Button>部分禁用</Button>}>
        <DropdownMenu>
          <DropdownItem>可用</DropdownItem>
          <DropdownItem disabled>禁用</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
```

## API

### Dropdown Props

| 参数            | 说明             | 类型       | 可选值                              | 默认值   |
| --------------- | ---------------- | ---------- | ----------------------------------- | -------- |
| items           | 选项数据         | `Option[]` | -                                   | -        |
| trigger         | 触发方式         | `string`   | `click` / `hover` / `focus`         | `click`  |
| triggerElement  | 触发元素         | `VNode`    | -                                   | -        |
| disabled        | 是否禁用         | `boolean`  | -                                   | `false`  |
| placement       | 弹出位置         | `string`   | `top` / `bottom` / `left` / `right` | `bottom` |
| onVisibleChange | 显示状态变化回调 | `Function` | -                                   | -        |
| className       | 自定义类名       | `string`   | -                                   | -        |

### DropdownItem Props

| 参数      | 说明         | 类型               | 默认值  |
| --------- | ------------ | ------------------ | ------- |
| label     | 文本         | `string`           | -       |
| value     | 值           | `string \| number` | -       |
| disabled  | 是否禁用     | `boolean`          | `false` |
| danger    | 是否危险操作 | `boolean`          | `false` |
| icon      | 图标         | `VNode`            | -       |
| onClick   | 点击回调     | `Function`         | -       |
| className | 自定义类名   | `string`           | -       |

### DropdownDivider Props

| 参数      | 说明       | 类型     | 默认值 |
| --------- | ---------- | -------- | ------ |
| className | 自定义类名 | `string` | -      |

## 样式定制

### CSS 变量

```css
.dropdown {
  --dropdown-bg: #ffffff;
  --dropdown-border: #e5e7eb;
  --dropdown-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --dropdown-item-hover: #f3f4f6;
  --dropdown-item-danger: #ef4444;
}
```

### 自定义样式

```tsx
<Dropdown className="custom-dropdown">
  <DropdownMenu>
    <DropdownItem>自定义</DropdownItem>
  </DropdownMenu>
</Dropdown>

<style>
.custom-dropdown .dropdown-menu {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}
</style>
```

## 最佳实践

### 1. 操作菜单

```tsx
<Dropdown trigger={<Button>更多操作</Button>}>
  <DropdownMenu>
    <DropdownItem onClick={() => handleEdit()}>编辑</DropdownItem>
    <DropdownItem onClick={() => handleCopy()}>复制</DropdownItem>
    <DropdownDivider />
    <DropdownItem danger onClick={() => handleDelete()}>
      删除
    </DropdownItem>
  </DropdownMenu>
</Dropdown>
```

### 2. 用户菜单

```tsx
<Dropdown trigger={<Avatar src={user.avatar} />}>
  <DropdownMenu>
    <DropdownItem>个人中心</DropdownItem>
    <DropdownItem>设置</DropdownItem>
    <DropdownDivider />
    <DropdownItem onClick={() => handleLogout()}>退出登录</DropdownItem>
  </DropdownMenu>
</Dropdown>
```

### 3. 导航菜单

```tsx
<Dropdown trigger={<Button>产品</Button>}>
  <DropdownMenu>
    <DropdownItem>产品A</DropdownItem>
    <DropdownItem>产品B</DropdownItem>
    <DropdownItem>产品C</DropdownItem>
  </DropdownMenu>
</Dropdown>
```

## 常见问题

### Q: 如何自定义触发元素？

A: 使用 `trigger` 属性传入自定义的 VNode。

### Q: 如何实现多级菜单？

A: 可以在 DropdownItem 中嵌套 Dropdown 组件。

### Q: 如何处理菜单项点击？

A: 使用 DropdownItem 的 `onClick` 回调函数。

---

🌹 Dropdown 组件文档完成！
