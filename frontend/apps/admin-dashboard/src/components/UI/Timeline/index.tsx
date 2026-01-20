/**
 * @fileoverview YYC³餐饮行业智能化平台 - 时间轴组件
 * @description 统一的时间轴组件，支持多种布局和样式
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { defineComponent, type PropType } from 'vue'
import { cn } from '@/utils/cn'
import { Circle, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-vue-next'

export interface TimelineItem {
  id: string | number
  title: string
  description?: string
  time?: string
  icon?: any
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  status?: 'default' | 'success' | 'error' | 'warning' | 'processing'
  extra?: any
  dot?: any
}

export const Timeline = defineComponent({
  name: 'Timeline',
  props: {
    items: {
      type: Array as PropType<TimelineItem[]>,
      default: () => [],
    },
    mode: {
      type: String as PropType<'left' | 'right' | 'alternate' | 'vertical'>,
      default: 'vertical',
      validator: (value: string) => ['left', 'right', 'alternate', 'vertical'].includes(value),
    },
    reverse: {
      type: Boolean,
      default: false,
    },
    pending: {
      type: Boolean,
      default: false,
    },
    pendingDot: {
      type: [String, Object] as PropType<string | any>,
      default: undefined,
    },
    size: {
      type: String as PropType<'sm' | 'md' | 'lg'>,
      default: 'md',
      validator: (value: string) => ['sm', 'md', 'lg'].includes(value),
    },
  },
  emits: ['click'],
  setup(props, { emit, slots }) {
    const sizeClasses = computed(() => {
      switch (props.size) {
        case 'sm':
          return 'text-sm'
        case 'lg':
          return 'text-lg'
        default:
          return 'text-base'
      }
    })

    const dotSize = computed(() => {
      switch (props.size) {
        case 'sm':
          return 'w-3 h-3'
        case 'lg':
          return 'w-5 h-5'
        default:
          return 'w-4 h-4'
      }
    })

    const iconSize = computed(() => {
      switch (props.size) {
        case 'sm':
          return 12
        case 'lg':
          return 20
        default:
          return 16
      }
    })

    const getIconByStatus = (status?: string) => {
      switch (status) {
        case 'success':
          return CheckCircle
        case 'error':
          return XCircle
        case 'warning':
          return AlertCircle
        case 'processing':
          return Clock
        default:
          return Circle
      }
    }

    const getColorByColor = (color?: string) => {
      switch (color) {
        case 'primary':
          return 'bg-primary-600 border-primary-600'
        case 'success':
          return 'bg-success-600 border-success-600'
        case 'warning':
          return 'bg-warning-600 border-warning-600'
        case 'danger':
          return 'bg-danger-600 border-danger-600'
        default:
          return 'bg-neutral-300 border-neutral-300'
      }
    }

    const getColorByStatus = (status?: string) => {
      switch (status) {
        case 'success':
          return 'bg-success-600 border-success-600'
        case 'error':
          return 'bg-danger-600 border-danger-600'
        case 'warning':
          return 'bg-warning-600 border-warning-600'
        case 'processing':
          return 'bg-primary-600 border-primary-600'
        default:
          return 'bg-neutral-300 border-neutral-300'
      }
    }

    const handleClick = (item: TimelineItem, index: number) => {
      emit('click', item, index)
    }

    const displayItems = computed(() => {
      let items = [...props.items]
      if (props.pending && props.pendingDot) {
        items.push({
          id: 'pending',
          title: '进行中',
          status: 'processing',
          dot: props.pendingDot,
        })
      }
      return props.reverse ? items.reverse() : items
    })

    return () => (
      <div
        class={cn(
          'relative',
          sizeClasses.value,
          props.mode === 'vertical' && 'space-y-6'
        )}
      >
        {displayItems.value.map((item, index) => {
          const IconComponent = item.icon || getIconByStatus(item.status)
          const dotColor = item.color ? getColorByColor(item.color) : getColorByStatus(item.status)
          const isLast = index === displayItems.value.length - 1

          return (
            <div
              key={item.id}
              class={cn(
                'relative flex gap-4',
                props.mode === 'vertical' && 'flex-row',
                props.mode === 'left' && 'flex-row',
                props.mode === 'right' && 'flex-row-reverse',
                props.mode === 'alternate' && index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              )}
              onClick={() => handleClick(item, index)}
            >
              <div class="flex-shrink-0 flex flex-col items-center">
                {item.dot ? (
                  <div class={cn('flex items-center justify-center', dotSize.value)}>
                    {item.dot}
                  </div>
                ) : (
                  <div
                    class={cn(
                      'rounded-full border-2 bg-white flex items-center justify-center',
                      dotSize.value,
                      dotColor
                    )}
                  >
                    {typeof IconComponent === 'function' ? (
                      <IconComponent size={iconSize.value} class="text-white" />
                    ) : (
                      <IconComponent size={iconSize.value} class="text-white" />
                    )}
                  </div>
                )}
                {!isLast && (
                  <div
                    class={cn(
                      'w-0.5 bg-neutral-200',
                      props.mode === 'vertical' && 'flex-1',
                      props.mode !== 'vertical' && 'h-full absolute left-1/2 -translate-x-1/2 top-8'
                    )}
                  />
                )}
              </div>
              <div
                class={cn(
                  'flex-1 pb-2',
                  props.mode === 'vertical' && 'pt-1',
                  props.mode === 'left' && 'text-left',
                  props.mode === 'right' && 'text-right',
                  props.mode === 'alternate' && index % 2 === 0 ? 'text-left' : 'text-right'
                )}
              >
                <div class="font-medium text-neutral-900">{item.title}</div>
                {item.description && (
                  <div class="text-sm text-neutral-600 mt-1">{item.description}</div>
                )}
                {item.time && (
                  <div class="text-xs text-neutral-500 mt-1">{item.time}</div>
                )}
                {item.extra && (
                  <div class="mt-2">
                    {item.extra}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  },
})

export const TimelineItem = defineComponent({
  name: 'TimelineItem',
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    time: {
      type: String,
      default: '',
    },
    icon: {
      type: Object as PropType<any>,
      default: undefined,
    },
    color: {
      type: String as PropType<'default' | 'primary' | 'success' | 'warning' | 'danger'>,
      default: 'default',
    },
    status: {
      type: String as PropType<'default' | 'success' | 'error' | 'warning' | 'processing'>,
      default: 'default',
    },
    extra: {
      type: Object as PropType<any>,
      default: undefined,
    },
    dot: {
      type: [String, Object] as PropType<string | any>,
      default: undefined,
    },
  },
  emits: ['click'],
  setup(props, { emit, attrs }) {
    const handleClick = () => {
      emit('click')
    }

    return () => (
      <div
        class={cn('relative flex gap-4 flex-row', attrs.class as string)}
        onClick={handleClick}
      >
        <div class="flex-shrink-0 flex flex-col items-center">
          {props.dot ? (
            <div class="flex items-center justify-center w-4 h-4">
              {props.dot}
            </div>
          ) : (
            <div
              class={cn(
                'rounded-full border-2 bg-white flex items-center justify-center w-4 h-4',
                props.color === 'primary' && 'bg-primary-600 border-primary-600',
                props.color === 'success' && 'bg-success-600 border-success-600',
                props.color === 'warning' && 'bg-warning-600 border-warning-600',
                props.color === 'danger' && 'bg-danger-600 border-danger-600',
                props.color === 'default' && 'bg-neutral-300 border-neutral-300',
                props.status === 'success' && 'bg-success-600 border-success-600',
                props.status === 'error' && 'bg-danger-600 border-danger-600',
                props.status === 'warning' && 'bg-warning-600 border-warning-600',
                props.status === 'processing' && 'bg-primary-600 border-primary-600',
                props.status === 'default' && 'bg-neutral-300 border-neutral-300'
              )}
            >
              {props.icon && <props.icon size={16} class="text-white" />}
            </div>
          )}
        </div>
        <div class="flex-1 pb-2 pt-1">
          <div class="font-medium text-neutral-900">{props.title}</div>
          {props.description && (
            <div class="text-sm text-neutral-600 mt-1">{props.description}</div>
          )}
          {props.time && (
            <div class="text-xs text-neutral-500 mt-1">{props.time}</div>
          )}
          {props.extra && (
            <div class="mt-2">
              {props.extra}
            </div>
          )}
        </div>
      </div>
    )
  },
})
