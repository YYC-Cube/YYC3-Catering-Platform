# Checkbox 复选框

在一组备选项中进行多选。

## 何时使用

- 在一组可选项中进行多项选择时。
- 单独使用可以表示两种状态之间的切换，和 `switch` 类似。区别在于切换 `switch` 会直接触发状态改变，而 `checkbox` 一般用于状态标记，需要配合提交操作。

## 代码演示

### 基础用法

```tsx
import { Checkbox } from "@/components/UI";
import { ref } from "vue";

export default function CheckboxBasic() {
  const checked = ref(false);

  return <Checkbox v-model={checked.value}>同意协议</Checkbox>;
}
```

### 禁用状态

```tsx
import { Checkbox } from "@/components/UI";

export default function CheckboxDisabled() {
  return (
    <div class="space-y-2">
      <Checkbox disabled>禁用</Checkbox>
      <Checkbox disabled checked>
        禁用选中
      </Checkbox>
    </div>
  );
}
```

### 复选框组

```tsx
import { Checkbox, CheckboxGroup } from "@/components/UI";
import { ref } from "vue";

export default function CheckboxGroup() {
  const value = ref(["option1", "option2"]);

  const options = [
    { label: "选项一", value: "option1" },
    { label: "选项二", value: "option2" },
    { label: "选项三", value: "option3" },
  ];

  return <CheckboxGroup v-model={value.value} options={options} />;
}
```

### 垂直排列

```tsx
import { Checkbox, CheckboxGroup } from "@/components/UI";

export default function CheckboxVertical() {
  const options = [
    { label: "选项一", value: "option1" },
    { label: "选项二", value: "option2" },
    { label: "选项三", value: "option3" },
  ];

  return <CheckboxGroup direction="vertical" options={options} />;
}
```

### 半选状态

```tsx
import { Checkbox } from "@/components/UI";

export default function CheckboxIndeterminate() {
  return <Checkbox indeterminate>半选状态</Checkbox>;
}
```

## API

### Checkbox Props

| 参数          | 说明       | 类型       | 默认值             |
| ------------- | ---------- | ---------- | ------------------ | ---- |
| modelValue    | 绑定值     | `boolean`  | `false`            |
| label         | 文本       | `string`   | -                  |
| disabled      | 是否禁用   | `boolean`  | `false`            |
| readonly      | 是否只读   | `boolean`  | `false`            |
| indeterminate | 是否半选   | `boolean`  | `false`            |
| size          | 尺寸       | `string`   | `sm` / `md` / `lg` | `md` |
| error         | 是否错误   | `boolean`  | `false`            |
| onChange      | 变化回调   | `Function` | -                  |
| className     | 自定义类名 | `string`   | -                  |

### CheckboxGroup Props

| 参数       | 说明       | 类型       | 默认值                    |
| ---------- | ---------- | ---------- | ------------------------- | ------------ |
| modelValue | 绑定值     | `string[]` | -                         |
| options    | 选项数据   | `Option[]` | -                         |
| disabled   | 是否禁用   | `boolean`  | `false`                   |
| direction  | 排列方向   | `string`   | `horizontal` / `vertical` | `horizontal` |
| onChange   | 变化回调   | `Function` | -                         |
| className  | 自定义类名 | `string`   | -                         |

### Option 类型定义

```typescript
interface Option {
  label: string;
  value: string | number;
  disabled?: boolean;
}
```

## 样式定制

### CSS 变量

```css
.checkbox {
  --checkbox-size: 1rem;
  --checkbox-border-color: #d1d5db;
  --checkbox-checked-bg: #3b82f6;
  --checkbox-checked-border: #3b82f6;
  --checkbox-disabled-bg: #f3f4f6;
  --checkbox-disabled-border: #d1d5db;
}
```

### 自定义样式

```tsx
<Checkbox className="custom-checkbox">自定义</Checkbox>

<style>
.custom-checkbox input:checked + span {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}
</style>
```

## 最佳实践

### 1. 全选/取消全选

```tsx
const allChecked = computed(() => {
  return value.value.length === options.length;
});

const indeterminate = computed(() => {
  return value.value.length > 0 && value.value.length < options.length;
});

const handleCheckAll = (checked: boolean) => {
  value.value = checked ? options.map(o => o.value) : [];
};
```

### 2. 限制选择数量

```tsx
const handleChange = (checked: boolean, value: string) => {
  if (checked && selectedValues.value.length >= maxCount) {
    message.warning(`最多选择${maxCount}项`);
    return;
  }
  // 处理选择逻辑
};
```

### 3. 联动选择

```tsx
const handleParentChange = (checked: boolean) => {
  if (checked) {
    value.value = [...parentValue, ...childrenValues];
  } else {
    value.value = value.value.filter(v => !childrenValues.includes(v));
  }
};
```

## 常见问题

### Q: 如何实现全选功能？

A: 使用一个独立的 Checkbox 控制所有子选项的选择状态。

### Q: 如何限制选择数量？

A: 在 `onChange` 回调中检查已选择的数量。

### Q: 如何实现联动选择？

A: 使用 `computed` 计算属性根据父选项的选择状态更新子选项。

---

🌹 Checkbox 组件文档完成！
