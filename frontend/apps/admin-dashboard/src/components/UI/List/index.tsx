/**
 * @fileoverview YYC³餐饮行业智能化平台 - 列表组件
 * @description 统一的列表组件，支持多种布局和样式
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { defineComponent, computed, type PropType } from 'vue'
import { cn } from '@/utils/cn'
import { ChevronRight, MoreVertical } from 'lucide-vue-next'

export interface ListItem {
  id: string | number
  title: string
  description?: string
  avatar?: string
  icon?: any
  extra?: any
  disabled?: boolean
  actions?: Array<{
    label: string
    icon?: any
    onClick: () => void
  }>
}

export const List = defineComponent({
  name: 'List',
  props: {
    items: {
      type: Array as PropType<ListItem[]>,
      default: () => [],
    },
    bordered: {
      type: Boolean,
      default: false,
    },
    split: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String as PropType<'sm' | 'md' | 'lg'>,
      default: 'md',
      validator: (value: string) => ['sm', 'md', 'lg'].includes(value),
    },
    loading: {
      type: Boolean,
      default: false,
    },
    emptyText: {
      type: String,
      default: '暂无数据',
    },
  },
  emits: ['click', 'item-click'],
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

    const paddingClasses = computed(() => {
      switch (props.size) {
        case 'sm':
          return 'px-3 py-2'
        case 'lg':
          return 'px-6 py-4'
        default:
          return 'px-4 py-3'
      }
    })

    const avatarSize = computed(() => {
      switch (props.size) {
        case 'sm':
          return 'w-8 h-8'
        case 'lg':
          return 'w-12 h-12'
        default:
          return 'w-10 h-10'
      }
    })

    const handleClick = (item: ListItem, index: number) => {
      if (item.disabled) {
        return
      }
      emit('item-click', item, index)
      emit('click', item, index)
    }

    return () => (
      <div
        class={cn(
          'w-full',
          props.bordered && 'border border-neutral-200 rounded-lg',
          sizeClasses.value
        )}
      >
        {props.loading ? (
          <div class="flex items-center justify-center py-8">
            <svg class="animate-spin h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : props.items.length === 0 ? (
          <div class="flex items-center justify-center py-8 text-neutral-500">
            {props.emptyText}
          </div>
        ) : (
          <div class="divide-y divide-neutral-100">
            {props.items.map((item, index) => (
              <div
                key={item.id}
                class={cn(
                  'flex items-center gap-4 transition-colors',
                  !item.disabled && 'hover:bg-neutral-50 cursor-pointer',
                  item.disabled && 'opacity-50 cursor-not-allowed',
                  paddingClasses.value,
                  !props.split && index === props.items.length - 1 && 'border-b-0',
                  props.split && 'border-b border-neutral-100',
                  index === props.items.length - 1 && 'border-b-0'
                )}
                onClick={() => handleClick(item, index)}
              >
                {item.avatar && (
                  <div class={cn('rounded-full bg-neutral-200 flex-shrink-0', avatarSize.value)}>
                    <img src={item.avatar} alt={item.title} class="w-full h-full rounded-full object-cover" />
                  </div>
                )}
                {item.icon && (
                  <div class={cn('flex items-center justify-center rounded-lg bg-primary-100 text-primary-600 flex-shrink-0', avatarSize.value)}>
                    <item.icon size={props.size === 'sm' ? 16 : props.size === 'lg' ? 24 : 20} />
                  </div>
                )}
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-neutral-900 truncate">{item.title}</div>
                  {item.description && (
                    <div class="text-sm text-neutral-600 truncate mt-0.5">{item.description}</div>
                  )}
                </div>
                {item.extra && (
                  <div class="flex-shrink-0">
                    {item.extra}
                  </div>
                )}
                {item.actions && item.actions.length > 0 && (
                  <div class="flex-shrink-0">
                    <button
                      type="button"
                      class="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                      onClick={(e: Event) => e.stopPropagation()}
                    >
                      <MoreVertical size={16} class="text-neutral-600" />
                    </button>
                  </div>
                )}
                {!item.disabled && (
                  <ChevronRight size={16} class="text-neutral-400 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  },
})

export const ListItem = defineComponent({
  name: 'ListItem',
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    icon: {
      type: Object as PropType<any>,
      default: undefined,
    },
    extra: {
      type: Object as PropType<any>,
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    actions: {
      type: Array as PropType<Array<{
        label: string
        icon?: any
        onClick: () => void
      }>>,
      default: () => [],
    },
  },
  emits: ['click'],
  setup(props, { emit, attrs }) {
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

    const paddingClasses = computed(() => {
      switch (props.size) {
        case 'sm':
          return 'px-3 py-2'
        case 'lg':
          return 'px-6 py-4'
        default:
          return 'px-4 py-3'
      }
    })

    const avatarSize = computed(() => {
      switch (props.size) {
        case 'sm':
          return 'w-8 h-8'
        case 'lg':
          return 'w-12 h-12'
        default:
          return 'w-10 h-10'
      }
    })

    const handleClick = () => {
      if (!props.disabled) {
        emit('click')
      }
    }

    return () => (
      <div
        class={cn(
          'flex items-center gap-4 transition-colors',
          !props.disabled && 'hover:bg-neutral-50 cursor-pointer',
          props.disabled && 'opacity-50 cursor-not-allowed',
          paddingClasses.value,
          attrs.class as string
        )}
        onClick={handleClick}
      >
        {props.avatar && (
          <div class={cn('rounded-full bg-neutral-200 flex-shrink-0', avatarSize.value)}>
            <img src={props.avatar} alt={props.title} class="w-full h-full rounded-full object-cover" />
          </div>
        )}
        {props.icon && (
          <div class={cn('flex items-center justify-center rounded-lg bg-primary-100 text-primary-600 flex-shrink-0', avatarSize.value)}>
            <props.icon size={props.size === 'sm' ? 16 : props.size === 'lg' ? 24 : 20} />
          </div>
        )}
        <div class="flex-1 min-w-0">
          <div class="font-medium text-neutral-900 truncate">{props.title}</div>
          {props.description && (
            <div class="text-sm text-neutral-600 truncate mt-0.5">{props.description}</div>
          )}
        </div>
        {props.extra && (
          <div class="flex-shrink-0">
            {props.extra}
          </div>
        )}
        {props.actions && props.actions.length > 0 && (
          <div class="flex-shrink-0">
            <button
              type="button"
              class="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              onClick={(e: Event) => e.stopPropagation()}
            >
              <MoreVertical size={16} class="text-neutral-600" />
            </button>
          </div>
        )}
        {!props.disabled && (
          <ChevronRight size={16} class="text-neutral-400 flex-shrink-0" />
        )}
      </div>
    )
  },
})
