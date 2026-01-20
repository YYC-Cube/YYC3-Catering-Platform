# YYC³ UI 组件库 - 性能优化指南

## 📚 目录

- [概述](#概述)
- [虚拟滚动](#虚拟滚动)
- [防抖和节流](#防抖和节流)
- [懒加载](#懒加载)
- [内存缓存](#内存缓存)
- [动画优化](#动画优化)
- [渲染优化](#渲染优化)
- [性能监控](#性能监控)

---

## 概述

YYC³ UI 组件库提供了多种性能优化技术，帮助您构建高性能的应用程序。本指南将详细介绍如何使用这些优化技术。

---

## 虚拟滚动

### 使用场景

当需要渲染大量数据（如1000+条记录）时，使用虚拟滚动可以显著提升性能。

### 使用方法

```tsx
import { useVirtualScroll } from '@/components/UI/utils/performance'
import { List } from '@/components/UI/List'

export default function VirtualScrollList() {
  const list = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    title: `项目 ${i}`,
    description: `这是项目 ${i} 的描述`
  }))
  
  const {
    visibleList,
    offsetY,
    totalHeight,
    handleScroll
  } = useVirtualScroll(list, 50, 400)
  
  return (
    <div
      class="h-[400px] overflow-auto"
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight.value }}>
        <div style={{ transform: `translateY(${offsetY.value}px)` }}>
          {visibleList.value.map(item => (
            <div key={item.id} class="h-[50px] border-b">
              {item.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

### 配置选项

```typescript
import { VIRTUAL_SCROLL_CONFIG } from '@/components/UI/utils/performance-config'

VIRTUAL_SCROLL_CONFIG.DEFAULT_ITEM_HEIGHT = 50
VIRTUAL_SCROLL_CONFIG.DEFAULT_CONTAINER_HEIGHT = 400
VIRTUAL_SCROLL_CONFIG.BUFFER_SIZE = 3
VIRTUAL_SCROLL_CONFIG.MAX_VISIBLE_ITEMS = 100
```

---

## 防抖和节流

### 使用场景

- **防抖**: 搜索输入、窗口调整大小
- **节流**: 滚动事件、鼠标移动

### 使用方法

```tsx
import { useDebounce, useThrottle } from '@/components/UI/utils/performance'
import { Input } from '@/components/UI/Input'

export default function SearchExample() {
  const [searchValue, setSearchValue] = useState('')
  
  const handleSearch = useDebounce((value: string) => {
    console.log('搜索:', value)
  }, 500)
  
  const handleScroll = useThrottle(() => {
    console.log('滚动中...')
  }, 100)
  
  return (
    <div>
      <Input
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value)
          handleSearch(e.target.value)
        }}
        placeholder="搜索..."
      />
      <div
        class="h-[200px] overflow-auto"
        onScroll={handleScroll}
      >
        {Array.from({ length: 100 }).map((_, i) => (
          <div key={i} class="h-[20px]">
            内容 {i}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 配置选项

```typescript
import { DEBOUNCE_CONFIG, THROTTLE_CONFIG } from '@/components/UI/utils/performance-config'

DEBOUNCE_CONFIG.DEFAULT_DELAY = 300
DEBOUNCE_CONFIG.SEARCH_DELAY = 500
DEBOUNCE_CONFIG.RESIZE_DELAY = 200

THROTTLE_CONFIG.DEFAULT_DELAY = 300
THROTTLE_CONFIG.SCROLL_DELAY = 100
THROTTLE_CONFIG.RESIZE_DELAY = 200
```

---

## 懒加载

### 使用场景

- 图片懒加载
- 组件懒加载
- 路由懒加载

### 使用方法

```tsx
import { useLazyLoad, useIntersectionObserver } from '@/components/UI/utils/performance'
import { ref } from 'vue'

export default function LazyLoadExample() {
  const imageRef = ref<HTMLElement | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  
  useIntersectionObserver(
    imageRef,
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setImageUrl('https://example.com/image.jpg')
        }
      })
    },
    { threshold: 0.1 }
  )
  
  return (
    <div ref={imageRef} class="h-[400px]">
      {imageUrl ? (
        <img src={imageUrl} alt="懒加载图片" />
      ) : (
        <div class="flex items-center justify-center h-full bg-neutral-100">
          加载中...
        </div>
      )}
    </div>
  )
}
```

### 配置选项

```typescript
import { LAZY_LOAD_CONFIG } from '@/components/UI/utils/performance-config'

LAZY_LOAD_CONFIG.DEFAULT_THRESHOLD = 0.1
LAZY_LOAD_CONFIG.DEFAULT_ROOT_MARGIN = '0px'
LAZY_LOAD_CONFIG.IMAGE_LAZY_LOAD = true
LAZY_LOAD_CONFIG.COMPONENT_LAZY_LOAD = true
```

---

## 内存缓存

### 使用场景

- 计算密集型操作
- API响应缓存
- 复杂数据处理

### 使用方法

```tsx
import { useMemoCache } from '@/components/UI/utils/performance'

const expensiveCalculation = useMemoCache((data: any[]) => {
  console.log('执行复杂计算...')
  return data.map(item => ({
    ...item,
    processed: true
  }))
})

export default function CacheExample({ data }: { data: any[] }) {
  const processedData = expensiveCalculation(data)
  
  return (
    <div>
      {processedData.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  )
}
```

### 配置选项

```typescript
import { CACHE_CONFIG } from '@/components/UI/utils/performance-config'

CACHE_CONFIG.DEFAULT_MAX_SIZE = 100
CACHE_CONFIG.DEFAULT_TTL = 60000
CACHE_CONFIG.ENABLE_MEMORY_CACHE = true
CACHE_CONFIG.ENABLE_LOCAL_STORAGE_CACHE = true
```

---

## 动画优化

### 使用场景

- 页面过渡动画
- 组件动画
- 列表动画

### 使用方法

```tsx
import { useRequestAnimationFrame } from '@/components/UI/utils/performance'

export default function AnimationExample() {
  const [progress, setProgress] = useState(0)
  
  const { start, stop } = useRequestAnimationFrame(() => {
    setProgress(prev => {
      if (prev >= 100) {
        stop()
        return 100
      }
      return prev + 1
    })
  })
  
  return (
    <div>
      <button onClick={start}>开始动画</button>
      <div class="w-full h-4 bg-neutral-200 rounded">
        <div
          class="h-full bg-primary-600 rounded transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
```

### 配置选项

```typescript
import { ANIMATION_CONFIG } from '@/components/UI/utils/performance-config'

ANIMATION_CONFIG.DEFAULT_DURATION = 300
ANIMATION_CONFIG.DEFAULT_EASING = 'ease-in-out'
ANIMATION_CONFIG.ENABLE_RAF = true
ANIMATION_CONFIG.DISABLE_ANIMATION_ON_LOW_PERFORMANCE = false
```

---

## 渲染优化

### 使用场景

- 大型组件渲染
- 频繁更新的组件
- 列表渲染

### 使用方法

```tsx
import { shallowRef, shallowReactive, computed, vMemo } from 'vue'

export default function RenderOptimizationExample() {
  const data = shallowRef({ count: 0 })
  const items = shallowReactive([{ id: 1, name: '项目1' }])
  
  const doubledCount = computed(() => data.value.count * 2)
  
  return (
    <div>
      <div>计数: {data.value.count}</div>
      <div>双倍: {doubledCount.value}</div>
      
      <div v-memo={[items.length]}>
        {items.map(item => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>
    </div>
  )
}
```

### 优化技巧

1. **使用 `shallowRef` 和 `shallowReactive`** 避免深层响应式
2. **使用 `computed`** 缓存计算结果
3. **使用 `v-memo`** 缓存组件渲染
4. **使用 `v-once`** 静态内容只渲染一次
5. **使用 `key`** 优化列表渲染

### 配置选项

```typescript
import { RENDER_OPTIMIZATION_CONFIG } from '@/components/UI/utils/performance-config'

RENDER_OPTIMIZATION_CONFIG.ENABLE_VUE_MESSENGER = true
RENDER_OPTIMIZATION_CONFIG.ENABLE_SHALLOW_REF = true
RENDER_OPTIMIZATION_CONFIG.ENABLE_COMPUTED = true
RENDER_OPTIMIZATION_CONFIG.ENABLE_V_MEMO = true
RENDER_OPTIMIZATION_CONFIG.ENABLE_KEY_OPTIMIZATION = true
```

---

## 性能监控

### 使用场景

- 监控组件渲染性能
- 检测性能瓶颈
- 优化用户体验

### 使用方法

```tsx
import { usePerformanceMonitor } from '@/components/UI/utils/performance'

export default function PerformanceMonitorExample() {
  const { measureRender, averageRenderTime } = usePerformanceMonitor('MyComponent')
  
  measureRender(() => {
    return (
      <div>
        <h1>我的组件</h1>
        <p>平均渲染时间: {averageRenderTime.value.toFixed(2)}ms</p>
      </div>
    )
  })
}
```

### 配置选项

```typescript
import { PERFORMANCE_MONITOR_CONFIG } from '@/components/UI/utils/performance-config'

PERFORMANCE_MONITOR_CONFIG.ENABLE_MONITORING = true
PERFORMANCE_MONITOR_CONFIG.RENDER_TIME_THRESHOLD = 16
PERFORMANCE_MONITOR_CONFIG.MEMORY_THRESHOLD = 50 * 1024 * 1024
PERFORMANCE_MONITOR_CONFIG.FPS_THRESHOLD = 30
PERFORMANCE_MONITOR_CONFIG.ENABLE_CONSOLE_LOG = true
PERFORMANCE_MONITOR_CONFIG.ENABLE_WARNING = true
```

---

## 最佳实践

### 1. 按需加载

```tsx
const LazyComponent = defineAsyncComponent(() => import('./LazyComponent'))
```

### 2. 代码分割

```tsx
const routes = [
  {
    path: '/',
    component: () => import('./views/Home')
  },
  {
    path: '/about',
    component: () => import('./views/About')
  }
]
```

### 3. 图片优化

```tsx
<img
  src="image.webp"
  loading="lazy"
  decoding="async"
  alt="优化图片"
/>
```

### 4. CSS优化

```css
/* 使用CSS变量 */
:root {
  --primary-color: #3b82f6;
}

/* 使用will-change优化动画 */
.animated-element {
  will-change: transform;
}
```

### 5. 减少重排重绘

```tsx
// 批量DOM操作
const fragment = document.createDocumentFragment()
items.forEach(item => {
  const element = document.createElement('div')
  element.textContent = item
  fragment.appendChild(element)
})
document.body.appendChild(fragment)
```

---

## 性能检查清单

- [ ] 使用虚拟滚动处理大列表
- [ ] 使用防抖/节流优化频繁事件
- [ ] 使用懒加载延迟加载资源
- [ ] 使用缓存避免重复计算
- [ ] 使用RAF优化动画
- [ ] 使用shallowRef/shallowReactive避免深层响应式
- [ ] 使用computed缓存计算结果
- [ ] 使用v-memo缓存组件渲染
- [ ] 使用v-once静态内容
- [ ] 使用key优化列表渲染
- [ ] 使用性能监控检测瓶颈
- [ ] 按需加载组件和路由
- [ ] 优化图片和资源
- [ ] 减少重排重绘
- [ ] 使用Web Worker处理密集计算

---

## 相关资源

- [Vue 3 性能优化指南](https://vuejs.org/guide/best-practices/performance.html)
- [Web性能优化](https://web.dev/performance/)
- [性能API](https://developer.mozilla.org/en-US/docs/Web/API/Performance)

---

🌹 性能优化指南完成！
