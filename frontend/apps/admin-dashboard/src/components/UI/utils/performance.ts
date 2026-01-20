/**
 * @fileoverview 性能优化工具函数
 * @description 提供组件性能优化相关的工具函数
 * @module performance
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { ref, shallowRef, shallowReactive, computed, watchEffect, onMounted, onUnmounted } from 'vue'

/**
 * 使用虚拟滚动
 * @description 优化大列表渲染性能，只渲染可见区域的项目
 * @param list - 列表数据
 * @param itemHeight - 单项高度
 * @param containerHeight - 容器高度
 * @returns 虚拟滚动相关数据和方法
 */
export function useVirtualScroll<T>(
  list: T[],
  itemHeight: number,
  containerHeight: number
) {
  const scrollTop = ref(0)
  const visibleCount = Math.ceil(containerHeight / itemHeight) + 2
  const startIndex = computed(() => Math.max(0, Math.floor(scrollTop.value / itemHeight) - 1))
  const endIndex = computed(() => Math.min(list.length, startIndex.value + visibleCount))
  
  const visibleList = computed(() => {
    return list.slice(startIndex.value, endIndex.value)
  })
  
  const offsetY = computed(() => startIndex.value * itemHeight)
  const totalHeight = computed(() => list.length * itemHeight)
  
  const handleScroll = (e: Event) => {
    scrollTop.value = (e.target as HTMLElement).scrollTop
  }
  
  return {
    visibleList,
    offsetY,
    totalHeight,
    handleScroll,
    startIndex,
    endIndex
  }
}

/**
 * 使用防抖
 * @description 延迟执行函数，避免频繁触发
 * @param fn - 要执行的函数
 * @param delay - 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

/**
 * 使用节流
 * @description 限制函数执行频率，避免短时间内多次执行
 * @param fn - 要执行的函数
 * @param delay - 延迟时间（毫秒）
 * @returns 节流后的函数
 */
export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  let lastTime = 0
  
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastTime >= delay) {
      lastTime = now
      fn(...args)
    }
  }
}

/**
 * 使用懒加载
 * @description 延迟加载组件或资源
 * @param loader - 加载函数
 * @returns 懒加载相关数据和方法
 */
export function useLazyLoad<T>(loader: () => Promise<T>) {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const loaded = ref(false)
  
  const load = async () => {
    if (loaded.value || loading.value) return
    
    loading.value = true
    error.value = null
    
    try {
      data.value = await loader()
      loaded.value = true
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }
  
  return {
    data,
    loading,
    error,
    loaded,
    load
  }
}

/**
 * 使用Intersection Observer
 * @description 监听元素是否进入视口，实现懒加载等效果
 * @param target - 目标元素
 * @param callback - 回调函数
 * @param options - Intersection Observer选项
 * @returns 停止观察的函数
 */
export function useIntersectionObserver(
  target: Ref<HTMLElement | null>,
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
) {
  let observer: IntersectionObserver | null = null
  
  const stop = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }
  
  onMounted(() => {
    if (target.value) {
      observer = new IntersectionObserver(callback, options)
      observer.observe(target.value)
    }
  })
  
  onUnmounted(() => {
    stop()
  })
  
  return { stop }
}

/**
 * 使用requestAnimationFrame
 * @description 优化动画性能，使用RAF执行动画
 * @param callback - 回调函数
 * @returns 取消动画的函数
 */
export function useRequestAnimationFrame(callback: () => void) {
  let rafId: number | null = null
  
  const start = () => {
    const animate = () => {
      callback()
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)
  }
  
  const stop = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }
  
  onUnmounted(() => {
    stop()
  })
  
  return { start, stop }
}

/**
 * 使用内存缓存
 * @description 缓存计算结果，避免重复计算
 * @param fn - 要缓存的函数
 * @param keyGenerator - 键生成函数
 * @returns 带缓存的函数
 */
export function useMemoCache<T extends (...args: any[]) => any>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>()
  
  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)!
    }
    
    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

/**
 * 使用Web Worker
 * @description 将计算密集型任务放到Web Worker中执行
 * @param workerScript - Worker脚本
 * @returns Worker实例
 */
export function useWebWorker(workerScript: string) {
  const worker = ref<Worker | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)
  
  const init = () => {
    try {
      const blob = new Blob([workerScript], { type: 'application/javascript' })
      const url = URL.createObjectURL(blob)
      worker.value = new Worker(url)
    } catch (e) {
      error.value = e as Error
    }
  }
  
  const terminate = () => {
    if (worker.value) {
      worker.value.terminate()
      worker.value = null
    }
  }
  
  onMounted(() => {
    init()
  })
  
  onUnmounted(() => {
    terminate()
  })
  
  return {
    worker,
    loading,
    error,
    terminate
  }
}

/**
 * 使用性能监控
 * @description 监控组件渲染性能
 * @param componentName - 组件名称
 * @returns 性能监控相关数据
 */
export function usePerformanceMonitor(componentName: string) {
  const renderTimes = ref<number[]>([])
  const averageRenderTime = computed(() => {
    if (renderTimes.value.length === 0) return 0
    const sum = renderTimes.value.reduce((a, b) => a + b, 0)
    return sum / renderTimes.value.length
  })
  
  const measureRender = (fn: () => void) => {
    const start = performance.now()
    fn()
    const end = performance.now()
    const duration = end - start
    renderTimes.value.push(duration)
    
    if (duration > 16) {
      console.warn(`[Performance] ${componentName} 渲染耗时 ${duration.toFixed(2)}ms`)
    }
  }
  
  return {
    renderTimes,
    averageRenderTime,
    measureRender
  }
}
