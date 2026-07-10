# YYC³餐饮平台 - UI交互体验演示文档

## 文档信息

| 项目     | 内容               |
| -------- | ------------------ |
| 文档名称 | UI交互体验演示文档 |
| 版本号   | v1.0.0             |
| 创建日期 | 2026-01-21         |
| 作者     | YYC³团队           |
| 文档状态 | 正式发布           |

---

## 1. 概述

### 1.1 文档目的

本文档详细说明YYC³餐饮平台UI组件的交互体验设计，包括：

- 组件的交互状态和反馈机制
- 动画效果和过渡效果
- 用户操作流程和体验优化
- 响应式设计和多终端适配
- 可访问性和无障碍设计

### 1.2 交互设计原则

YYC³平台的交互设计遵循以下核心原则：

- **即时反馈**: 用户操作后立即提供视觉反馈
- **清晰引导**: 通过视觉层次引导用户注意力
- **一致性体验**: 统一的交互模式和视觉语言
- **容错设计**: 提供撤销、确认等容错机制
- **性能优先**: 流畅的动画和快速的响应时间

---

## 2. 核心组件交互体验

### 2.1 按钮组件 (YUButton)

#### 2.1.1 交互状态

```typescript
interface ButtonInteractionStates {
  normal: {
    backgroundColor: "var(--primary-color)";
    color: "#FFFFFF";
    transform: "translateY(0)";
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)";
  };
  hover: {
    backgroundColor: "var(--primary-color)";
    color: "#FFFFFF";
    transform: "translateY(-2px)";
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)";
    transition: "all 0.2s ease-out";
  };
  active: {
    backgroundColor: "var(--primary-color)";
    color: "#FFFFFF";
    transform: "translateY(0)";
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)";
    transition: "all 0.1s ease-in";
  };
  disabled: {
    backgroundColor: "#E5E7EB";
    color: "#9CA3AF";
    cursor: "not-allowed";
    opacity: 0.6;
  };
  loading: {
    backgroundColor: "var(--primary-color)";
    color: "#FFFFFF";
    cursor: "wait";
    opacity: 0.8;
    pointerEvents: "none";
  };
}
```

#### 2.1.2 交互示例

**场景一：主要按钮**

```
┌─────────────────────────────────────────────────────────────┐
│  [确认订单]                                            │
│                                                             │
│  正常状态: 蓝色背景，白色文字，轻微阴影            │
│  悬停状态: 向上移动2px，阴影增强，0.2s过渡      │
│  点击状态: 恢复原位，阴影减弱，0.1s过渡        │
│  禁用状态: 灰色背景，不可点击，0.6透明度        │
│  加载状态: 显示旋转加载图标，不可点击              │
└─────────────────────────────────────────────────────────────┘
```

**场景二：幽灵按钮**

```
┌─────────────────────────────────────────────────────────────┐
│  [取消订单]                                            │
│                                                             │
│  正常状态: 透明背景，主题色文字，无阴影            │
│  悬停状态: 浅灰色背景，0.2s过渡                │
│  点击状态: 深灰色背景，0.1s过渡                │
│  禁用状态: 灰色文字，不可点击，0.6透明度        │
└─────────────────────────────────────────────────────────────┘
```

#### 2.1.3 动画效果

```css
@keyframes buttonHover {
  0% {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  100% {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

@keyframes buttonActive {
  0% {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  100% {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}
```

---

### 2.2 输入组件 (YUInput)

#### 2.2.1 交互状态

```typescript
interface InputInteractionStates {
  normal: {
    borderColor: "#D1D5DB";
    backgroundColor: "#FFFFFF";
    boxShadow: "none";
  };
  focus: {
    borderColor: "var(--primary-color)";
    backgroundColor: "#FFFFFF";
    boxShadow: "0 0 0 3px rgba(var(--primary-color), 0.1)";
    transition: "all 0.2s ease-out";
  };
  error: {
    borderColor: "#E74C3C";
    backgroundColor: "#FEF2F2";
    animation: "shake 0.3s ease-in-out";
  };
  success: {
    borderColor: "#27AE60";
    backgroundColor: "#F0FDF4";
  };
  disabled: {
    backgroundColor: "#F3F4F6";
    borderColor: "#E5E7EB";
    color: "#9CA3AF";
    cursor: "not-allowed";
  };
}
```

#### 2.2.2 交互示例

**场景一：普通输入框**

```
┌─────────────────────────────────────────────────────────────┐
│  请输入订单号...                                        │
│                                                             │
│  正常状态: 浅灰色边框，白色背景                      │
│  聚焦状态: 主题色边框，外发光效果，0.2s过渡    │
│  输入状态: 保持聚焦状态，实时输入反馈                │
│  失焦状态: 恢复正常状态，保留输入值              │
└─────────────────────────────────────────────────────────────┘
```

**场景二：带前缀的输入框**

```
┌─────────────────────────────────────────────────────────────┐
│  🔍 请输入订单号...                                    │
│                                                             │
│  前缀图标: 灰色图标，左侧固定位置                │
│  输入区域: 右侧自适应宽度，聚焦时边框变色        │
│  交互反馈: 聚焦时图标也跟随边框变色              │
└─────────────────────────────────────────────────────────────┘
```

#### 2.2.3 验证反馈

```css
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-5px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(5px);
  }
}

/* 错误状态应用 */
.input-error {
  border-color: #e74c3c;
  background-color: #fef2f2;
  animation: shake 0.3s ease-in-out;
}

/* 成功状态应用 */
.input-success {
  border-color: #27ae60;
  background-color: #f0fdf4;
}
```

---

### 2.3 表格组件 (YUTable)

#### 2.3.1 交互状态

```typescript
interface TableInteractionStates {
  normal: {
    backgroundColor: "#FFFFFF";
    borderColor: "#E5E7EB";
  };
  hover: {
    backgroundColor: "rgba(var(--primary-color), 0.05)";
    cursor: "pointer";
    transition: "all 0.2s ease-out";
  };
  selected: {
    backgroundColor: "rgba(var(--primary-color), 0.1)";
    borderLeft: "3px solid var(--primary-color)";
  };
  loading: {
    opacity: 0.6;
    pointerEvents: "none";
  };
}
```

#### 2.3.2 交互示例

**场景一：表格行悬停**

```
┌─────────────────────────────────────────────────────────────┐
│  订单号    │ 客户    │ 类型  │ 状态    │ 金额  │操作│
│  ├─────────────────────────────────────────────────────────────┤
│  #20240121 │ 张三    │ 堂食  │ 制作中  │ ¥68  │详情│
│  [悬停状态: 浅蓝色背景，鼠标指针]                │
│  #20240120 │ 李四    │ 外送  │ 已完成  │ ¥35  │详情│
│  [正常状态: 白色背景，无特殊效果]                │
│  #20240119 │ 王五    │ 自提  │ 待确认  │ ¥58  │详情│
│  [正常状态: 白色背景，无特殊效果]                │
└─────────────────────────────────────────────────────────────┘
```

**场景二：表格行选中**

```
┌─────────────────────────────────────────────────────────────┐
│  订单号    │ 客户    │ 类型  │ 状态    │ 金额  │操作│
│  ├─────────────────────────────────────────────────────────────┤
│  #20240121 │ 张三    │ 堂食  │ 制作中  │ ¥68  │详情│
│  [选中状态: 深蓝色背景，左侧蓝色边框]            │
│  #20240120 │ 李四    │ 外送  │ 已完成  │ ¥35  │详情│
│  [正常状态: 白色背景，无特殊效果]                │
│  #20240119 │ 王五    │ 自提  │ 待确认  │ ¥58  │详情│
│  [正常状态: 白色背景，无特殊效果]                │
└─────────────────────────────────────────────────────────────┘
```

#### 2.3.3 分页交互

```
┌─────────────────────────────────────────────────────────────┐
│  ◀ 上一页  1 / 10  下一页 ▶                      │
│                                                             │
│  上一页: 禁用时灰色，启用时蓝色，点击后翻页      │
│  当前页: 蓝色高亮，显示当前页/总页数          │
│  下一页: 禁用时灰色，启用时蓝色，点击后翻页      │
│  交互反馈: 点击后立即更新表格内容，0.3s过渡        │
└─────────────────────────────────────────────────────────────┘
```

---

### 2.4 卡片组件 (YUCard)

#### 2.4.1 交互状态

```typescript
interface CardInteractionStates {
  normal: {
    backgroundColor: "#FFFFFF";
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)";
    borderRadius: "0.5rem";
  };
  hover: {
    backgroundColor: "#FFFFFF";
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)";
    transform: "translateY(-4px)";
    transition: "all 0.3s ease-out";
  };
  loading: {
    opacity: 0.6;
    pointerEvents: "none";
  };
}
```

#### 2.4.2 交互示例

**场景一：数据卡片悬停**

```
┌─────────────────────────────────────────────────────────────┐
│  ┌──────────┐                                         │
│  │今日订单  │                                         │
│  │  128    │                                         │
│  │  📈+12% │                                         │
│  └──────────┘                                         │
│  [正常状态: 白色背景，轻微阴影]                      │
│                                                             │
│  ┌──────────┐                                         │
│  │今日营收  │                                         │
│  │ ¥12,580  │                                         │
│  │  📈+8%  │                                         │
│  └──────────┘                                         │
│  [悬停状态: 向上移动4px，阴影增强，0.3s过渡]    │
└─────────────────────────────────────────────────────────────┘
```

**场景二：内容卡片悬停**

```
┌─────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 订单详情                                       │   │
│  │ ────────────────────────────────────────────────   │   │
│  │ 订单号: #20240121001                          │   │
│  │ 客户: 张三 (138****8888)                      │   │
│  │ 类型: 堂食 | 桌号: A08                       │   │
│  └─────────────────────────────────────────────────────┘   │
│  [正常状态: 白色背景，轻微阴影]                      │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 订单详情                                       │   │
│  │ ────────────────────────────────────────────────   │   │
│  │ 订单号: #20240121001                          │   │
│  │ 客户: 张三 (138****8888)                      │   │
│  │ 类型: 堂食 | 桌号: A08                       │   │
│  └─────────────────────────────────────────────────────┘   │
│  [悬停状态: 向上移动4px，阴影增强，0.3s过渡]    │
└─────────────────────────────────────────────────────────────┘
```

---

### 2.5 弹窗组件 (YUModal)

#### 2.5.1 交互状态

```typescript
interface ModalInteractionStates {
  closed: {
    opacity: 0;
    visibility: "hidden";
    transform: "scale(0.95)";
  };
  opening: {
    opacity: 1;
    visibility: "visible";
    transform: "scale(1)";
    transition: "all 0.2s ease-out";
  };
  closing: {
    opacity: 0;
    visibility: "hidden";
    transform: "scale(0.95)";
    transition: "all 0.2s ease-in";
  };
}
```

#### 2.5.2 交互示例

**场景一：弹窗打开**

```
┌─────────────────────────────────────────────────────────────┐
│  [遮罩层: 半透明黑色背景，0.2s淡入]                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 订单详情                          [✕]          │   │
│  │ ────────────────────────────────────────────────   │   │
│  │ 订单号: #20240121001                          │   │
│  │ 客户: 张三 (138****8888)                      │   │
│  │ 类型: 堂食 | 桌号: A08                       │   │
│  │ ────────────────────────────────────────────────   │   │
│  │ [取消订单]  [确认订单]                        │   │
│  └─────────────────────────────────────────────────────┘   │
│  [弹窗: 白色背景，圆角，从0.95放大到1]        │
└─────────────────────────────────────────────────────────────┘
```

**场景二：弹窗关闭**

```
┌─────────────────────────────────────────────────────────────┐
│  [遮罩层: 半透明黑色背景，0.2s淡出]                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 订单详情                          [✕]          │   │
│  │ ────────────────────────────────────────────────   │   │
│  │ 订单号: #20240121001                          │   │
│  │ 客户: 张三 (138****8888)                      │   │
│  │ 类型: 堂食 | 桌号: A08                       │   │
│  │ ────────────────────────────────────────────────   │   │
│  │ [取消订单]  [确认订单]                        │   │
│  └─────────────────────────────────────────────────────┘   │
│  [弹窗: 白色背景，圆角，从1缩小到0.95]          │
└─────────────────────────────────────────────────────────────┘
```

#### 2.5.3 动画效果

```css
@keyframes modalFadeIn {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes modalFadeOut {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.95);
  }
}

@keyframes backdropFadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.5;
  }
}

@keyframes backdropFadeOut {
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 0;
  }
}
```

---

### 2.6 标签组件 (YUTag)

#### 2.6.1 交互状态

```typescript
interface TagInteractionStates {
  normal: {
    opacity: 1;
    transform: "scale(1)";
  };
  hover: {
    opacity: 0.8;
    transform: "scale(1.05)";
    transition: "all 0.2s ease-out";
  };
  closing: {
    opacity: 0;
    transform: "scale(0)";
    transition: "all 0.3s ease-out";
  };
}
```

#### 2.6.2 交互示例

**场景一：可关闭标签**

```
┌─────────────────────────────────────────────────────────────┐
│  [招牌 ×]  [辣 ×]  [素食 ×]  [健康 ×]          │
│                                                             │
│  正常状态: 彩色背景，白色文字，圆角              │
│  悬停状态: 透明度0.8，放大1.05倍，0.2s过渡      │
│  点击关闭: 透明度0，缩小到0，0.3s过渡            │
│  关闭动画: 从当前状态平滑过渡到消失                  │
└─────────────────────────────────────────────────────────────┘
```

**场景二：状态标签**

```
┌─────────────────────────────────────────────────────────────┐
│  [待确认]  [制作中]  [已完成]  [已取消]          │
│                                                             │
│  待确认: 黄色背景，表示需要处理                      │
│  制作中: 蓝色背景，表示正在处理                      │
│  已完成: 绿色背景，表示已完成                        │
│  已取消: 灰色背景，表示已取消                        │
│  视觉层次: 不同状态使用不同颜色，一目了然            │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. 动画效果系统

### 3.1 页面过渡

#### 3.1.1 页面切换动画

```css
/* 页面进入动画 */
.page-enter {
  animation: pageSlideIn 0.3s ease-out;
}

@keyframes pageSlideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 页面退出动画 */
.page-exit {
  animation: pageSlideOut 0.3s ease-in;
}

@keyframes pageSlideOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-20px);
  }
}
```

#### 3.1.2 页面加载动画

```css
/* 页面加载动画 */
.page-loading {
  animation: pageFadeIn 0.5s ease-out;
}

@keyframes pageFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

### 3.2 列表动画

#### 3.2.1 列表项进入动画

```css
/* 列表项交错进入动画 */
.list-item-enter {
  animation: listItemSlideIn 0.3s ease-out;
  animation-fill-mode: both;
}

.list-item-enter:nth-child(1) {
  animation-delay: 0ms;
}

.list-item-enter:nth-child(2) {
  animation-delay: 50ms;
}

.list-item-enter:nth-child(3) {
  animation-delay: 100ms;
}

@keyframes listItemSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### 3.2.2 列表项退出动画

```css
/* 列表项退出动画 */
.list-item-exit {
  animation: listItemSlideOut 0.3s ease-in;
  animation-fill-mode: both;
}

@keyframes listItemSlideOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-20px);
  }
}
```

### 3.3 加载动画

#### 3.3.1 旋转加载

```css
/* 旋转加载动画 */
.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

#### 3.3.2 骨架屏动画

```css
/* 骨架屏闪烁动画 */
.skeleton-shimmer {
  animation: shimmer 1.5s ease-in-out infinite;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

---

## 4. 响应式设计

### 4.1 断点系统

| 断点名称 | 屏幕宽度        | 设备类型   | 布局策略               |
| -------- | --------------- | ---------- | ---------------------- |
| xs       | 0px - 640px     | 手机       | 单列布局，垂直堆叠     |
| sm       | 640px - 768px   | 大屏手机   | 单列布局，优化触摸     |
| md       | 768px - 1024px  | 平板       | 两列布局，水平排列     |
| lg       | 1024px - 1280px | 小屏笔记本 | 三列布局，充分利用空间 |
| xl       | 1280px - 1536px | 大屏笔记本 | 四列布局，信息密度高   |
| 2xl      | 1536px+         | 桌面显示器 | 四列布局，最大信息密度 |

### 4.2 响应式布局示例

#### 4.2.1 订单列表响应式

```css
/* 手机端 (xs, sm) */
@media (max-width: 767px) {
  .order-list {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .order-card {
    padding: 1rem;
  }

  .order-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}

/* 平板端 (md) */
@media (min-width: 768px) and (max-width: 1023px) {
  .order-list {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .order-card {
    padding: 1.5rem;
  }

  .order-actions {
    flex-direction: row;
    gap: 1rem;
  }
}

/* 桌面端 (lg, xl, 2xl) */
@media (min-width: 1024px) {
  .order-list {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  .order-card {
    padding: 2rem;
  }

  .order-actions {
    flex-direction: row;
    gap: 1.5rem;
  }
}
```

#### 4.2.2 菜单网格响应式

```css
/* 手机端 */
@media (max-width: 639px) {
  .menu-grid {
    grid-template-columns: 1fr;
  }
}

/* 大屏手机 */
@media (min-width: 640px) and (max-width: 767px) {
  .menu-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 平板端 */
@media (min-width: 768px) and (max-width: 1023px) {
  .menu-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 小屏笔记本 */
@media (min-width: 1024px) and (max-width: 1279px) {
  .menu-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 大屏笔记本 */
@media (min-width: 1280px) and (max-width: 1535px) {
  .menu-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* 桌面显示器 */
@media (min-width: 1536px) {
  .menu-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

---

## 5. 可访问性设计

### 5.1 键盘导航

#### 5.1.1 焦点管理

```typescript
// 焦点可见性
:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

// 焦点顺序
.keyboard-navigable {
  &:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
}

// 跳过链接
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--primary-color);
  color: white;
  padding: 8px;
  z-index: 100;

  &:focus {
    top: 0;
  }
}
```

#### 5.1.2 快捷键支持

```typescript
// 快捷键映射
const keyboardShortcuts: Record<string, string> = {
  "Ctrl+S": "保存",
  "Ctrl+F": "搜索",
  "Ctrl+N": "新建",
  Escape: "关闭/取消",
  Enter: "确认",
  Delete: "删除",
  ArrowUp: "上一项",
  ArrowDown: "下一项",
  ArrowLeft: "返回",
  ArrowRight: "前进",
};

// 快捷键处理
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    const shortcut = `${event.ctrlKey ? "Ctrl+" : ""}${event.key}`;
    const action = keyboardShortcuts[shortcut];

    if (action) {
      event.preventDefault();
      executeAction(action);
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, []);
```

### 5.2 屏幕阅读器支持

#### 5.2.1 ARIA属性

```typescript
// 按钮ARIA属性
<button
  aria-label="确认订单"
  aria-pressed={false}
  aria-disabled={false}
>
  确认订单
</button>

// 输入框ARIA属性
<input
  type="text"
  aria-label="订单号"
  aria-required="true"
  aria-invalid={false}
  aria-describedby="order-help"
/>
<span id="order-help">请输入订单号，支持模糊搜索</span>

// 表格ARIA属性
<table
  role="table"
  aria-label="订单列表"
  aria-describedby="table-info"
>
  <caption id="table-info">共128条订单记录</caption>
  <thead>
    <tr>
      <th scope="col" aria-sort="none">订单号</th>
      <th scope="col" aria-sort="ascending">客户信息</th>
    </tr>
  </thead>
  <tbody>
    <tr role="row">
      <td role="gridcell">#20240121</td>
      <td role="gridcell">张三</td>
    </tr>
  </tbody>
</table>
```

#### 5.2.2 语义化HTML

```html
<!-- 正确的语义化结构 -->
<nav aria-label="主导航">
  <ul role="menubar">
    <li role="none">
      <a role="menuitem" href="/orders">订单管理</a>
    </li>
    <li role="none">
      <a role="menuitem" href="/menu">菜单管理</a>
    </li>
  </ul>
</nav>

<main role="main" aria-label="主要内容">
  <section aria-labelledby="orders-heading">
    <h2 id="orders-heading">订单列表</h2>
    <!-- 订单列表内容 -->
  </section>
</main>

<aside role="complementary" aria-label="侧边栏">
  <!-- 侧边栏内容 -->
</aside>

<footer role="contentinfo" aria-label="页脚">
  <!-- 页脚内容 -->
</footer>
```

---

## 6. 性能优化

### 6.1 动画性能

#### 6.1.1 使用transform和opacity

```css
/* 优化前：使用left和top */
.bad-performance {
  left: 0;
  top: 0;
  transition:
    left 0.3s,
    top 0.3s;
}

/* 优化后：使用transform */
.good-performance {
  transform: translate(0, 0);
  transition: transform 0.3s;
}
```

#### 6.1.2 使用will-change

```css
/* 提前告知浏览器属性变化 */
.animated-element {
  will-change: transform, opacity;
}

/* 动画结束后移除will-change */
.animated-element.finished {
  will-change: auto;
}
```

### 6.2 渲染性能

#### 6.2.1 虚拟滚动

```typescript
// 虚拟滚动实现
interface VirtualScrollProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
}

function VirtualScroll<T>({ items, itemHeight, containerHeight, renderItem }: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = items.slice(visibleStart, visibleEnd);

  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        <div style={{ position: 'absolute', top: visibleStart * itemHeight }}>
          {visibleItems.map((item, index) => (
            <div key={index} style={{ height: itemHeight }}>
              {renderItem(item, visibleStart + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

#### 6.2.2 图片懒加载

```typescript
// 图片懒加载实现
function LazyImage({ src, alt, placeholder }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={imgRef}
      src={isInView ? src : placeholder}
      alt={alt}
      onLoad={() => setIsLoaded(true)}
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
    />
  );
}
```

---

## 7. 总结

### 7.1 交互设计优势

1. **即时反馈**: 用户操作后立即提供视觉反馈，提升感知性能
2. **流畅动画**: 使用CSS transform和opacity，确保60fps流畅度
3. **一致性体验**: 统一的交互模式和视觉语言，降低学习成本
4. **响应式布局**: 支持多终端适配，提供一致的用户体验
5. **可访问性**: 遵循WCAG标准，支持键盘导航和屏幕阅读器
6. **性能优化**: 虚拟滚动、图片懒加载等优化，提升渲染性能

### 7.2 最佳实践

1. **动画时长**: 微交互0.2s，页面过渡0.3s，复杂动画0.5s
2. **缓动函数**: 优先使用ease-out，避免linear
3. **性能监控**: 使用Performance API监控动画性能
4. **用户测试**: 进行可用性测试，收集用户反馈
5. **持续优化**: 根据用户反馈持续优化交互体验

---

**文档版本**: v1.0.0
**最后更新**: 2026-01-21
**文档状态**: 正式发布
