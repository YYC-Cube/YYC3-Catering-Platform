/**
 * @fileoverview 性能优化配置
 * @description 性能优化相关的配置项
 * @module performance-config
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

/**
 * 虚拟滚动配置
 */
export const VIRTUAL_SCROLL_CONFIG = {
  DEFAULT_ITEM_HEIGHT: 50,
  DEFAULT_CONTAINER_HEIGHT: 400,
  BUFFER_SIZE: 3,
  MAX_VISIBLE_ITEMS: 100
}

/**
 * 防抖配置
 */
export const DEBOUNCE_CONFIG = {
  DEFAULT_DELAY: 300,
  SEARCH_DELAY: 500,
  RESIZE_DELAY: 200,
  SCROLL_DELAY: 100
}

/**
 * 节流配置
 */
export const THROTTLE_CONFIG = {
  DEFAULT_DELAY: 300,
  SCROLL_DELAY: 100,
  RESIZE_DELAY: 200,
  CLICK_DELAY: 500
}

/**
 * 懒加载配置
 */
export const LAZY_LOAD_CONFIG = {
  DEFAULT_THRESHOLD: 0.1,
  DEFAULT_ROOT_MARGIN: '0px',
  IMAGE_LAZY_LOAD: true,
  COMPONENT_LAZY_LOAD: true
}

/**
 * 缓存配置
 */
export const CACHE_CONFIG = {
  DEFAULT_MAX_SIZE: 100,
  DEFAULT_TTL: 60000,
  ENABLE_MEMORY_CACHE: true,
  ENABLE_LOCAL_STORAGE_CACHE: true
}

/**
 * 动画配置
 */
export const ANIMATION_CONFIG = {
  DEFAULT_DURATION: 300,
  DEFAULT_EASING: 'ease-in-out',
  ENABLE_RAF: true,
  DISABLE_ANIMATION_ON_LOW_PERFORMANCE: false
}

/**
 * 性能监控配置
 */
export const PERFORMANCE_MONITOR_CONFIG = {
  ENABLE_MONITORING: true,
  RENDER_TIME_THRESHOLD: 16,
  MEMORY_THRESHOLD: 50 * 1024 * 1024,
  FPS_THRESHOLD: 30,
  ENABLE_CONSOLE_LOG: true,
  ENABLE_WARNING: true
}

/**
 * 代码分割配置
 */
export const CODE_SPLITTING_CONFIG = {
  ENABLE_ROUTE_BASED_SPLITTING: true,
  ENABLE_COMPONENT_BASED_SPLITTING: true,
  CHUNK_SIZE_LIMIT: 244 * 1024,
  PREFETCH_ENABLED: true,
  PRELOAD_ENABLED: true
}

/**
 * 资源优化配置
 */
export const RESOURCE_OPTIMIZATION_CONFIG = {
  ENABLE_IMAGE_OPTIMIZATION: true,
  ENABLE_FONT_OPTIMIZATION: true,
  ENABLE_CSS_OPTIMIZATION: true,
  ENABLE_JS_OPTIMIZATION: true,
  IMAGE_FORMATS: ['webp', 'avif'],
  IMAGE_QUALITY: 0.8
}

/**
 * 渲染优化配置
 */
export const RENDER_OPTIMIZATION_CONFIG = {
  ENABLE_VUE_MESSENGER: true,
  ENABLE_SHALLOW_REF: true,
  ENABLE_SHALLOW_REACTIVE: true,
  ENABLE_COMPUTED: true,
  ENABLE_V_MEMO: true,
  ENABLE_V_ONCE: true,
  ENABLE_KEY_OPTIMIZATION: true
}

/**
 * 网络优化配置
 */
export const NETWORK_OPTIMIZATION_CONFIG = {
  ENABLE_HTTP2: true,
  ENABLE_COMPRESSION: true,
  ENABLE_CDN: true,
  ENABLE_CACHE_CONTROL: true,
  REQUEST_TIMEOUT: 30000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000
}

/**
 * 内存管理配置
 */
export const MEMORY_MANAGEMENT_CONFIG = {
  ENABLE_AUTO_GC: false,
  GC_INTERVAL: 60000,
  MAX_MEMORY_USAGE: 100 * 1024 * 1024,
  ENABLE_MEMORY_LEAK_DETECTION: true
}

/**
 * 性能优化总配置
 */
export const PERFORMANCE_CONFIG = {
  virtualScroll: VIRTUAL_SCROLL_CONFIG,
  debounce: DEBOUNCE_CONFIG,
  throttle: THROTTLE_CONFIG,
  lazyLoad: LAZY_LOAD_CONFIG,
  cache: CACHE_CONFIG,
  animation: ANIMATION_CONFIG,
  monitor: PERFORMANCE_MONITOR_CONFIG,
  codeSplitting: CODE_SPLITTING_CONFIG,
  resource: RESOURCE_OPTIMIZATION_CONFIG,
  render: RENDER_OPTIMIZATION_CONFIG,
  network: NETWORK_OPTIMIZATION_CONFIG,
  memory: MEMORY_MANAGEMENT_CONFIG
}

/**
 * 获取性能优化配置
 * @param key - 配置键
 * @returns 配置值
 */
export function getPerformanceConfig<K extends keyof typeof PERFORMANCE_CONFIG>(
  key: K
): typeof PERFORMANCE_CONFIG[K] {
  return PERFORMANCE_CONFIG[key]
}

/**
 * 更新性能优化配置
 * @param key - 配置键
 * @param value - 配置值
 */
export function updatePerformanceConfig<K extends keyof typeof PERFORMANCE_CONFIG>(
  key: K,
  value: Partial<typeof PERFORMANCE_CONFIG[K]>
) {
  Object.assign(PERFORMANCE_CONFIG[key], value)
}
