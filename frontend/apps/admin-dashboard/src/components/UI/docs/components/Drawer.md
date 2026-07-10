# Drawer 抽屉

屏幕边缘滑出的浮层面板。

## 何时使用

- 抽屉从父窗体边缘滑入，覆盖住部分父窗体内容。用户在抽屉内操作时不必离开当前任务，操作完成后，可以平滑地关闭到父窗体。

## 代码演示

### 基础用法

```tsx
import { Drawer, DrawerHeader, DrawerBody, DrawerFooter } from "@/components/UI";
import { Button } from "@/components/UI";
import { ref } from "vue";

export default function DrawerBasic() {
  const visible = ref(false);

  return (
    <div>
      <Button onClick={() => (visible.value = true)}>打开抽屉</Button>
      <Drawer visible={visible.value} title="抽屉标题" onClose={() => (visible.value = false)}>
        <DrawerBody>
          <p>抽屉内容</p>
        </DrawerBody>
        <DrawerFooter>
          <Button onClick={() => (visible.value = false)}>关闭</Button>
        </DrawerFooter>
      </Drawer>
    </div>
  );
}
```

### 位置

```tsx
import { Drawer } from "@/components/UI";
import { Button } from "@/components/UI";
import { ref } from "vue";

export default function DrawerPlacement() {
  const visible = ref(false);
  const placement = ref("right");

  return (
    <div class="space-x-2">
      <Button
        onClick={() => {
          visible.value = true;
          placement.value = "left";
        }}
      >
        左侧
      </Button>
      <Button
        onClick={() => {
          visible.value = true;
          placement.value = "right";
        }}
      >
        右侧
      </Button>
      <Button
        onClick={() => {
          visible.value = true;
          placement.value = "top";
        }}
      >
        顶部
      </Button>
      <Button
        onClick={() => {
          visible.value = true;
          placement.value = "bottom";
        }}
      >
        底部
      </Button>
      <Drawer visible={visible.value} placement={placement.value} onClose={() => (visible.value = false)}>
        <p>抽屉内容</p>
      </Drawer>
    </div>
  );
}
```

### 尺寸

```tsx
import { Drawer } from "@/components/UI";
import { Button } from "@/components/UI";
import { ref } from "vue";

export default function DrawerSize() {
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
      <Drawer visible={visible.value} size={size.value} onClose={() => (visible.value = false)}>
        <p>抽屉内容</p>
      </Drawer>
    </div>
  );
}
```

### 可关闭

```tsx
import { Drawer } from "@/components/UI";
import { Button } from "@/components/UI";
import { ref } from "vue";

export default function DrawerClosable() {
  const visible = ref(false);

  return (
    <div>
      <Button onClick={() => (visible.value = true)}>打开抽屉</Button>
      <Drawer visible={visible.value} closable onClose={() => (visible.value = false)}>
        <p>抽屉内容</p>
      </Drawer>
    </div>
  );
}
```

### 无遮罩

```tsx
import { Drawer } from "@/components/UI";
import { Button } from "@/components/UI";
import { ref } from "vue";

export default function DrawerNoMask() {
  const visible = ref(false);

  return (
    <div>
      <Button onClick={() => (visible.value = true)}>打开抽屉</Button>
      <Drawer visible={visible.value} mask={false} onClose={() => (visible.value = false)}>
        <p>抽屉内容</p>
      </Drawer>
    </div>
  );
}
```

## API

### Drawer Props

| 参数         | 说明             | 类型       | 默认值                              |
| ------------ | ---------------- | ---------- | ----------------------------------- | ------- |
| visible      | 是否显示         | `boolean`  | `false`                             |
| title        | 标题             | `string`   | -                                   |
| placement    | 位置             | `string`   | `left` / `right` / `top` / `bottom` | `right` |
| size         | 尺寸             | `string`   | `sm` / `md` / `lg`                  | `md`    |
| closable     | 是否显示关闭按钮 | `boolean`  | `true`                              |
| mask         | 是否显示遮罩     | `boolean`  | `true`                              |
| maskClosable | 点击遮罩是否关闭 | `boolean`  | `true`                              |
| onClose      | 关闭回调         | `Function` | -                                   |
| className    | 自定义类名       | `string`   | -                                   |

### DrawerHeader Props

| 参数      | 说明       | 类型     | 默认值 |
| --------- | ---------- | -------- | ------ |
| className | 自定义类名 | `string` | -      |

### DrawerBody Props

| 参数      | 说明       | 类型     | 默认值 |
| --------- | ---------- | -------- | ------ |
| className | 自定义类名 | `string` | -      |

### DrawerFooter Props

| 参数      | 说明       | 类型     | 默认值 |
| --------- | ---------- | -------- | ------ |
| className | 自定义类名 | `string` | -      |

## 样式定制

### CSS 变量

```css
.drawer {
  --drawer-bg: #ffffff;
  --drawer-mask-bg: rgba(0, 0, 0, 0.5);
  --drawer-header-bg: #f9fafb;
  --drawer-border: #e5e7eb;
  --drawer-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

### 自定义样式

```tsx
<Drawer className="custom-drawer" visible={visible}>

<style>
.custom-drawer .drawer-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
</style>
```

## 最佳实践

### 1. 表单抽屉

```tsx
const visible = ref(false);
const formData = ref({});

const handleSubmit = () => {
  api.submit(formData.value);
  visible.value = false;
};

<Drawer visible={visible.value} title="编辑用户" onClose={() => (visible.value = false)}>
  <DrawerBody>
    <Form>
      <FormField name="username" label="用户名">
        <Input v-model={formData.value.username} />
      </FormField>
      <FormField name="email" label="邮箱">
        <Input v-model={formData.value.email} />
      </FormField>
    </Form>
  </DrawerBody>
  <DrawerFooter>
    <Button onClick={() => (visible.value = false)}>取消</Button>
    <Button type="primary" onClick={handleSubmit}>
      确定
    </Button>
  </DrawerFooter>
</Drawer>;
```

### 2. 详情抽屉

```tsx
const visible = ref(false);
const detail = ref({});

const showDetail = async (id: string) => {
  const result = await api.getDetail(id);
  detail.value = result.data;
  visible.value = true;
};

<Drawer visible={visible.value} title="详情" onClose={() => (visible.value = false)}>
  <DrawerBody>
    <div>
      <p>用户名: {detail.value.username}</p>
      <p>邮箱: {detail.value.email}</p>
      <p>创建时间: {detail.value.createdAt}</p>
    </div>
  </DrawerBody>
</Drawer>;
```

### 3. 设置抽屉

```tsx
const visible = ref(false);
const settings = ref({
  theme: "light",
  language: "zh-CN",
  notifications: true,
});

const handleSave = () => {
  api.saveSettings(settings.value);
  visible.value = false;
};

<Drawer visible={visible.value} title="设置" onClose={() => (visible.value = false)}>
  <DrawerBody>
    <Form>
      <FormField name="theme" label="主题">
        <Select
          v-model={settings.value.theme}
          options={[
            { label: "浅色", value: "light" },
            { label: "深色", value: "dark" },
          ]}
        />
      </FormField>
      <FormField name="language" label="语言">
        <Select
          v-model={settings.value.language}
          options={[
            { label: "中文", value: "zh-CN" },
            { label: "English", value: "en-US" },
          ]}
        />
      </FormField>
      <FormField name="notifications" label="通知">
        <Switch v-model={settings.value.notifications} />
      </FormField>
    </Form>
  </DrawerBody>
  <DrawerFooter>
    <Button onClick={() => (visible.value = false)}>取消</Button>
    <Button type="primary" onClick={handleSave}>
      保存
    </Button>
  </DrawerFooter>
</Drawer>;
```

## 常见问题

### Q: 如何自定义抽屉的位置？

A: 使用 `placement` 属性设置抽屉的位置。

### Q: 如何禁用点击遮罩关闭？

A: 使用 `maskClosable` 属性设置为 `false`。

### Q: 如何自定义抽屉的尺寸？

A: 使用 `size` 属性设置抽屉的尺寸。

---

🌹 Drawer 组件文档完成！
