# Timeline 时间轴

垂直展示的时间流信息。

## 何时使用

- 当有一系列信息需按时间排列时，可正序和倒序。
- 需要有一条时间轴进行视觉上的串联时。

## 代码演示

### 基础用法

```tsx
import { Timeline, TimelineItem } from '@/components/UI'

export default function TimelineBasic() {
  return (
    <Timeline>
      <TimelineItem>创建服务</TimelineItem>
      <TimelineItem>完成初步设计</TimelineItem>
      <TimelineItem>技术评审</TimelineItem>
      <TimelineItem>开发完成</TimelineItem>
      <TimelineItem>测试通过</TimelineItem>
    </Timeline>
  )
}
```

### 带时间

```tsx
import { Timeline, TimelineItem } from '@/components/UI'

export default function TimelineWithTime() {
  return (
    <Timeline>
      <TimelineItem time="2024-01-01">创建服务</TimelineItem>
      <TimelineItem time="2024-01-15">完成初步设计</TimelineItem>
      <TimelineItem time="2024-02-01">技术评审</TimelineItem>
      <TimelineItem time="2024-03-01">开发完成</TimelineItem>
      <TimelineItem time="2024-03-15">测试通过</TimelineItem>
    </Timeline>
  )
}
```

### 颜色标记

```tsx
import { Timeline, TimelineItem } from '@/components/UI'

export default function TimelineColor() {
  return (
    <Timeline>
      <TimelineItem color="primary">创建服务</TimelineItem>
      <TimelineItem color="success">完成初步设计</TimelineItem>
      <TimelineItem color="warning">技术评审</TimelineItem>
      <TimelineItem color="danger">开发完成</TimelineItem>
      <TimelineItem color="success">测试通过</TimelineItem>
    </Timeline>
  )
}
```

### 带图标

```tsx
import { Timeline, TimelineItem } from '@/components/UI'

export default function TimelineWithIcon() {
  return (
    <Timeline>
      <TimelineItem dot="📝">创建服务</TimelineItem>
      <TimelineItem dot="✏️">完成初步设计</TimelineItem>
      <TimelineItem dot="🔍">技术评审</TimelineItem>
      <TimelineItem dot="💻">开发完成</TimelineItem>
      <TimelineItem dot="✅">测试通过</TimelineItem>
    </Timeline>
  )
}
```

### 禁用状态

```tsx
import { Timeline, TimelineItem } from '@/components/UI'

export default function TimelineDisabled() {
  return (
    <Timeline>
      <TimelineItem>创建服务</TimelineItem>
      <TimelineItem>完成初步设计</TimelineItem>
      <TimelineItem disabled>技术评审</TimelineItem>
      <TimelineItem disabled>开发完成</TimelineItem>
      <TimelineItem disabled>测试通过</TimelineItem>
    </Timeline>
  )
}
```

### 交替排列

```tsx
import { Timeline, TimelineItem } from '@/components/UI'

export default function TimelineAlternate() {
  return (
    <Timeline position="alternate">
      <TimelineItem>创建服务</TimelineItem>
      <TimelineItem>完成初步设计</TimelineItem>
      <TimelineItem>技术评审</TimelineItem>
      <TimelineItem>开发完成</TimelineItem>
      <TimelineItem>测试通过</TimelineItem>
    </Timeline>
  )
}
```

### 右侧排列

```tsx
import { Timeline, TimelineItem } from '@/components/UI'

export default function TimelineRight() {
  return (
    <Timeline position="right">
      <TimelineItem>创建服务</TimelineItem>
      <TimelineItem>完成初步设计</TimelineItem>
      <TimelineItem>技术评审</TimelineItem>
      <TimelineItem>开发完成</TimelineItem>
      <TimelineItem>测试通过</TimelineItem>
    </Timeline>
  )
}
```

### 反向时间轴

```tsx
import { Timeline, TimelineItem } from '@/components/UI'

export default function TimelineReverse() {
  return (
    <Timeline reverse>
      <TimelineItem>测试通过</TimelineItem>
      <TimelineItem>开发完成</TimelineItem>
      <TimelineItem>技术评审</TimelineItem>
      <TimelineItem>完成初步设计</TimelineItem>
      <TimelineItem>创建服务</TimelineItem>
    </Timeline>
  )
}
```

### 自定义颜色

```tsx
import { Timeline, TimelineItem } from '@/components/UI'

export default function TimelineCustomColor() {
  return (
    <Timeline>
      <TimelineItem color="#ff0000">创建服务</TimelineItem>
      <TimelineItem color="#00ff00">完成初步设计</TimelineItem>
      <TimelineItem color="#0000ff">技术评审</TimelineItem>
      <TimelineItem color="#ffff00">开发完成</TimelineItem>
      <TimelineItem color="#ff00ff">测试通过</TimelineItem>
    </Timeline>
  )
}
```

## API

### Timeline Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| position | 时间轴位置 | `string` | `left` / `right` / `alternate` | `left` |
| reverse | 是否反向 | `boolean` | `false` |
| bordered | 是否带边框 | `boolean` | `false` |
| className | 自定义类名 | `string` | - |

### TimelineItem Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| time | 时间 | `string` | - |
| color | 颜色 | `string` | `primary` / `success` / `warning` / `danger` |
| dot | 自定义节点 | `VNode` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| className | 自定义类名 | `string` | - |

## 样式定制

### CSS 变量

```css
.timeline {
  --timeline-bg: #ffffff;
  --timeline-border: #e5e7eb;
  --timeline-text: #374151;
  --timeline-time: #6b7280;
  --timeline-line: #d1d5db;
}
```

### 自定义样式

```tsx
<Timeline className="custom-timeline">
  <TimelineItem>创建服务</TimelineItem>
</Timeline>

<style>
.custom-timeline .timeline-item {
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.custom-timeline .timeline-item-dot {
  width: 1.5rem;
  height: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
}
</style>
```

## 最佳实践

### 1. 项目进度

```tsx
const projectProgress = [
  { 
    time: '2024-01-01',
    title: '项目启动',
    description: '项目正式启动，组建团队'
  },
  { 
    time: '2024-02-01',
    title: '需求分析',
    description: '完成需求调研和分析'
  },
  { 
    time: '2024-03-01',
    title: '设计阶段',
    description: '完成UI/UX设计'
  },
  { 
    time: '2024-04-01',
    title: '开发阶段',
    description: '进行功能开发'
  },
  { 
    time: '2024-05-01',
    title: '测试阶段',
    description: '进行系统测试'
  },
]

<Timeline>
  {projectProgress.map(item => (
    <TimelineItem key={item.time} time={item.time}>
      <div>
        <h3 class="font-bold">{item.title}</h3>
        <p class="text-neutral-600">{item.description}</p>
      </div>
    </TimelineItem>
  ))}
</Timeline>
```

### 2. 订单流程

```tsx
const orderFlow = [
  { 
    time: '2024-01-01 10:00',
    title: '订单创建',
    color: 'primary'
  },
  { 
    time: '2024-01-01 10:30',
    title: '支付成功',
    color: 'success'
  },
  { 
    time: '2024-01-01 11:00',
    title: '商家接单',
    color: 'primary'
  },
  { 
    time: '2024-01-01 12:00',
    title: '配送中',
    color: 'warning'
  },
  { 
    time: '2024-01-01 12:30',
    title: '已送达',
    color: 'success'
  },
]

<Timeline>
  {orderFlow.map(item => (
    <TimelineItem 
      key={item.time} 
      time={item.time}
      color={item.color}
    >
      <div>
        <h3 class="font-bold">{item.title}</h3>
      </div>
    </TimelineItem>
  ))}
</Timeline>
```

### 3. 用户操作记录

```tsx
const userActions = [
  { 
    time: '2024-01-01 09:00',
    title: '登录系统',
    icon: '🔐'
  },
  { 
    time: '2024-01-01 09:30',
    title: '查看订单',
    icon: '📋'
  },
  { 
    time: '2024-01-01 10:00',
    title: '提交订单',
    icon: '🛒'
  },
  { 
    time: '2024-01-01 10:30',
    title: '支付订单',
    icon: '💳'
  },
  { 
    time: '2024-01-01 11:00',
    title: '退出登录',
    icon: '🚪'
  },
]

<Timeline>
  {userActions.map(item => (
    <TimelineItem 
      key={item.time} 
      time={item.time}
      dot={item.icon}
    >
      <div>
        <h3 class="font-bold">{item.title}</h3>
      </div>
    </TimelineItem>
  ))}
</Timeline>
```

## 常见问题

### Q: 如何自定义时间轴的位置？

A: 使用 `position` 属性设置时间轴的位置。

### Q: 如何自定义节点的样式？

A: 使用 `dot` 属性自定义节点的内容。

### Q: 如何实现反向时间轴？

A: 使用 `reverse` 属性实现反向时间轴。

---

🌹 Timeline 组件文档完成！
