# Radio 单选框

单选框。

## 何时使用

- 用于在多个备选项中选中单个状态。
- 和 Select 的区别是，Radio 所有选项默认可见，方便用户在比较中选择，因此选项不宜过多。

## 代码演示

### 基础用法

```tsx
import { Radio } from "@/components/UI";
import { ref } from "vue";

export default function RadioBasic() {
  const value = ref("option1");

  return (
    <div class="space-y-2">
      <Radio v-model={value.value} value="option1" label="选项一" />
      <Radio v-model={value.value} value="option2" label="选项二" />
      <Radio v-model={value.value} value="option3" label="选项三" />
    </div>
  );
}
```

### 禁用状态

```tsx
import { Radio } from "@/components/UI";

export default function RadioDisabled() {
  return (
    <div class="space-y-2">
      <Radio disabled value="option1" label="禁用" />
      <Radio disabled checked value="option2" label="禁用选中" />
    </div>
  );
}
```

### 单选框组

```tsx
import { Radio, RadioGroup } from "@/components/UI";
import { ref } from "vue";

export default function RadioGroup() {
  const value = ref("option1");

  const options = [
    { label: "选项一", value: "option1" },
    { label: "选项二", value: "option2" },
    { label: "选项三", value: "option3" },
  ];

  return <RadioGroup v-model={value.value} options={options} />;
}
```

### 垂直排列

```tsx
import { Radio, RadioGroup } from "@/components/UI";

export default function RadioVertical() {
  const options = [
    { label: "选项一", value: "option1" },
    { label: "选项二", value: "option2" },
    { label: "选项三", value: "option3" },
  ];

  return <RadioGroup direction="vertical" options={options} />;
}
```

### 按钮样式

```tsx
import { Radio } from "@/components/UI";
import { ref } from "vue";

export default function RadioButton() {
  const value = ref("option1");

  return (
    <div class="space-x-2">
      <Radio v-model={value.value} value="option1" className="radio-button">
        选项一
      </Radio>
      <Radio v-model={value.value} value="option2" className="radio-button">
        选项二
      </Radio>
      <Radio v-model={value.value} value="option3" className="radio-button">
        选项三
      </Radio>
    </div>
  );
}
```

## API

### Radio Props

| 参数       | 说明       | 类型               | 默认值             |
| ---------- | ---------- | ------------------ | ------------------ | ---- |
| modelValue | 绑定值     | `string \| number` | -                  |
| value      | 值         | `string \| number` | -                  |
| label      | 文本       | `string`           | -                  |
| disabled   | 是否禁用   | `boolean`          | `false`            |
| readonly   | 是否只读   | `boolean`          | `false`            |
| size       | 尺寸       | `string`           | `sm` / `md` / `lg` | `md` |
| onChange   | 变化回调   | `Function`         | -                  |
| className  | 自定义类名 | `string`           | -                  |

### RadioGroup Props

| 参数       | 说明       | 类型               | 默认值                    |
| ---------- | ---------- | ------------------ | ------------------------- | ------------ |
| modelValue | 绑定值     | `string \| number` | -                         |
| options    | 选项数据   | `Option[]`         | -                         |
| disabled   | 是否禁用   | `boolean`          | `false`                   |
| direction  | 排列方向   | `string`           | `horizontal` / `vertical` | `horizontal` |
| onChange   | 变化回调   | `Function`         | -                         |
| className  | 自定义类名 | `string`           | -                         |

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
.radio {
  --radio-size: 1rem;
  --radio-border-color: #d1d5db;
  --radio-checked-bg: #3b82f6;
  --radio-checked-border: #3b82f6;
  --radio-disabled-bg: #f3f4f6;
  --radio-disabled-border: #d1d5db;
}
```

### 自定义样式

```tsx
<Radio className="custom-radio">自定义</Radio>

<style>
.custom-radio input:checked + span {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}
</style>
```

### 按钮样式

```tsx
<Radio className="radio-button">按钮</Radio>

<style>
.radio-button {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  cursor: pointer;
}

.radio-button input:checked + span {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}
</style>
```

## 最佳实践

### 1. 性别选择

```tsx
<RadioGroup
  v-model={gender}
  options={[
    { label: "男", value: "male" },
    { label: "女", value: "female" },
  ]}
/>
```

### 2. 尺寸选择

```tsx
<RadioGroup
  v-model={size}
  options={[
    { label: "S", value: "s" },
    { label: "M", value: "m" },
    { label: "L", value: "l" },
    { label: "XL", value: "xl" },
  ]}
/>
```

### 3. 支付方式

```tsx
<RadioGroup
  v-model={payment}
  options={[
    { label: "微信支付", value: "wechat" },
    { label: "支付宝", value: "alipay" },
    { label: "银行卡", value: "card" },
  ]}
/>
```

## 常见问题

### Q: 如何设置默认值？

A: 使用 `v-model` 绑定一个初始值。

### Q: 如何实现按钮样式的单选框？

A: 使用自定义类名和 CSS 样式实现按钮样式。

### Q: 如何实现单选框的禁用？

A: 使用 `disabled` 属性禁用单个单选框，或在 RadioGroup 上禁用所有单选框。

---

🌹 Radio 组件文档完成！
