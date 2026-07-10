# Dialog 对话框

模态对话框，在保留当前页面状态的情况下，提示用户进行相关操作。

## 何时使用

- 需要用户处理事务，又不希望跳转页面以致打断工作流程时，可以使用 `Modal` 在当前页面正中打开一个浮层，承载相应的操作。

## 代码演示

### 基础用法

```tsx
import { Dialog, DialogHeader, DialogBody, DialogFooter } from "@/components/UI";
import { Button } from "@/components/UI";
import { ref } from "vue";

export default function DialogBasic() {
  const visible = ref(false);

  return (
    <div>
      <Button onClick={() => (visible.value = true)}>打开对话框</Button>
      <Dialog visible={visible.value} title="对话框标题" onClose={() => (visible.value = false)}>
        <DialogBody>
          <p>对话框内容</p>
        </DialogBody>
        <DialogFooter>
          <Button onClick={() => (visible.value = false)}>关闭</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
```

### 尺寸

```tsx
import { Dialog } from "@/components/UI";
import { Button } from "@/components/UI";
import { ref } from "vue";

export default function DialogSize() {
  const visible = ref(false);
  const size = ref("md");

  return (
    <div class="space-x-2">
      <Button
        onClick={() => {
          visible.value = true;
          size.value = "sm";
        }}
      >
        小型
      </Button>
      <Button
        onClick={() => {
          visible.value = true;
          size.value = "md";
        }}
      >
        中型
      </Button>
      <Button
        onClick={() => {
          visible.value = true;
          size.value = "lg";
        }}
      >
        大型
      </Button>
      <Dialog visible={visible.value} size={size.value} onClose={() => (visible.value = false)}>
        <DialogBody>
          <p>对话框内容</p>
        </DialogBody>
      </Dialog>
    </div>
  );
}
```

### 全屏

```tsx
import { Dialog } from "@/components/UI";
import { Button } from "@/components/UI";
import { ref } from "vue";

export default function DialogFullscreen() {
  const visible = ref(false);

  return (
    <div>
      <Button onClick={() => (visible.value = true)}>全屏对话框</Button>
      <Dialog visible={visible.value} fullscreen onClose={() => (visible.value = false)}>
        <DialogBody>
          <p>全屏对话框内容</p>
        </DialogBody>
      </Dialog>
    </div>
  );
}
```

### 居中

```tsx
import { Dialog } from "@/components/UI";
import { Button } from "@/components/UI";
import { ref } from "vue";

export default function DialogCentered() {
  const visible = ref(false);

  return (
    <div>
      <Button onClick={() => (visible.value = true)}>居中对话框</Button>
      <Dialog visible={visible.value} centered onClose={() => (visible.value = false)}>
        <DialogBody>
          <p>居中对话框内容</p>
        </DialogBody>
      </Dialog>
    </div>
  );
}
```

### 可关闭

```tsx
import { Dialog } from "@/components/UI";
import { Button } from "@/components/UI";
import { ref } from "vue";

export default function DialogClosable() {
  const visible = ref(false);

  return (
    <div>
      <Button onClick={() => (visible.value = true)}>可关闭对话框</Button>
      <Dialog visible={visible.value} closable onClose={() => (visible.value = false)}>
        <DialogBody>
          <p>可关闭对话框内容</p>
        </DialogBody>
      </Dialog>
    </div>
  );
}
```

### 无遮罩

```tsx
import { Dialog } from "@/components/UI";
import { Button } from "@/components/UI";
import { ref } from "vue";

export default function DialogNoMask() {
  const visible = ref(false);

  return (
    <div>
      <Button onClick={() => (visible.value = true)}>无遮罩对话框</Button>
      <Dialog visible={visible.value} mask={false} onClose={() => (visible.value = false)}>
        <DialogBody>
          <p>无遮罩对话框内容</p>
        </DialogBody>
      </Dialog>
    </div>
  );
}
```

### 确认对话框

```tsx
import { Dialog } from "@/components/UI";
import { Button } from "@/components/UI";
import { ref } from "vue";

export default function DialogConfirm() {
  const visible = ref(false);

  const handleConfirm = () => {
    console.log("确认");
    visible.value = false;
  };

  return (
    <div>
      <Button onClick={() => (visible.value = true)}>确认对话框</Button>
      <Dialog
        visible={visible.value}
        title="确认删除"
        showConfirmButton
        showCancelButton
        onConfirm={handleConfirm}
        onCancel={() => (visible.value = false)}
      >
        <DialogBody>
          <p>确定要删除吗？</p>
        </DialogBody>
      </Dialog>
    </div>
  );
}
```

## API

### Dialog Props

| 参数              | 说明             | 类型       | 默认值             |
| ----------------- | ---------------- | ---------- | ------------------ | ---- |
| visible           | 是否显示         | `boolean`  | `false`            |
| title             | 标题             | `string`   | -                  |
| size              | 尺寸             | `string`   | `sm` / `md` / `lg` | `md` |
| fullscreen        | 是否全屏         | `boolean`  | `false`            |
| centered          | 是否居中         | `boolean`  | `false`            |
| closable          | 是否显示关闭按钮 | `boolean`  | `true`             |
| mask              | 是否显示遮罩     | `boolean`  | `true`             |
| maskClosable      | 点击遮罩是否关闭 | `boolean`  | `true`             |
| showConfirmButton | 是否显示确认按钮 | `boolean`  | `false`            |
| showCancelButton  | 是否显示取消按钮 | `boolean`  | `false`            |
| onClose           | 关闭回调         | `Function` | -                  |
| onConfirm         | 确认回调         | `Function` | -                  |
| onCancel          | 取消回调         | `Function` | -                  |
| className         | 自定义类名       | `string`   | -                  |

### DialogHeader Props

| 参数      | 说明       | 类型     | 默认值 |
| --------- | ---------- | -------- | ------ |
| className | 自定义类名 | `string` | -      |

### DialogBody Props

| 参数      | 说明       | 类型     | 默认值 |
| --------- | ---------- | -------- | ------ |
| className | 自定义类名 | `string` | -      |

### DialogFooter Props

| 参数      | 说明       | 类型     | 默认值 |
| --------- | ---------- | -------- | ------ |
| className | 自定义类名 | `string` | -      |

## 样式定制

### CSS 变量

```css
.dialog {
  --dialog-bg: #ffffff;
  --dialog-mask-bg: rgba(0, 0, 0, 0.5);
  --dialog-header-bg: #f9fafb;
  --dialog-border: #e5e7eb;
  --dialog-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

### 自定义样式

```tsx
<Dialog className="custom-dialog" visible={visible}>

<style>
.custom-dialog .dialog-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}
</style>
```

## 最佳实践

### 1. 表单对话框

```tsx
const visible = ref(false);
const formData = ref({});

const handleSubmit = () => {
  api.submit(formData.value);
  visible.value = false;
};

<Dialog visible={visible.value} title="编辑用户" onClose={() => (visible.value = false)}>
  <DialogBody>
    <Form>
      <FormField name="username" label="用户名">
        <Input v-model={formData.value.username} />
      </FormField>
      <FormField name="email" label="邮箱">
        <Input v-model={formData.value.email} />
      </FormField>
    </Form>
  </DialogBody>
  <DialogFooter>
    <Button onClick={() => (visible.value = false)}>取消</Button>
    <Button type="primary" onClick={handleSubmit}>
      确定
    </Button>
  </DialogFooter>
</Dialog>;
```

### 2. 确认对话框

```tsx
const visible = ref(false);

const handleDelete = async () => {
  try {
    await api.delete(id);
    message.success("删除成功");
    visible.value = false;
  } catch (error) {
    message.error("删除失败");
  }
};

<Dialog
  visible={visible.value}
  title="确认删除"
  showConfirmButton
  showCancelButton
  onConfirm={handleDelete}
  onCancel={() => (visible.value = false)}
>
  <DialogBody>
    <p>确定要删除吗？此操作不可恢复。</p>
  </DialogBody>
</Dialog>;
```

### 3. 详情对话框

```tsx
const visible = ref(false);
const detail = ref({});

const showDetail = async (id: string) => {
  const result = await api.getDetail(id);
  detail.value = result.data;
  visible.value = true;
};

<Dialog visible={visible.value} title="详情" onClose={() => (visible.value = false)}>
  <DialogBody>
    <div>
      <p>用户名: {detail.value.username}</p>
      <p>邮箱: {detail.value.email}</p>
      <p>创建时间: {detail.value.createdAt}</p>
    </div>
  </DialogBody>
</Dialog>;
```

## 常见问题

### Q: 如何自定义对话框的尺寸？

A: 使用 `size` 属性设置对话框的尺寸。

### Q: 如何禁用点击遮罩关闭？

A: 使用 `maskClosable` 属性设置为 `false`。

### Q: 如何实现确认对话框？

A: 使用 `showConfirmButton` 和 `showCancelButton` 属性显示确认和取消按钮。

---

🌹 Dialog 组件文档完成！
