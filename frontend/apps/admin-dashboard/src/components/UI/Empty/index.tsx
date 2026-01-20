/**
 * @fileoverview YYC³餐饮行业智能化平台 - 空状态组件
 * @description 空状态占位组件
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { defineComponent, computed, type PropType } from 'vue'
import { cn } from '@/utils/cn'
import { Inbox, FileX, SearchX, WifiOff, AlertCircle } from 'lucide-vue-next'

export const Empty = defineComponent({
  name: 'Empty',
  props: {
    className: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '暂无数据',
    },
    type: {
      type: String as PropType<'default' | 'error' | 'search' | 'network'>,
      default: 'default',
    },
    size: {
      type: String as PropType<'sm' | 'md' | 'lg' | 'xl'>,
      default: 'md',
    },
    showAction: {
      type: Boolean,
      default: false,
    },
    actionText: {
      type: String,
      default: '刷新',
    },
  },
  emits: ['action'],
  setup(props, { emit, slots }) {
    const iconComponent = computed(() => {
      switch (props.type) {
        case 'error':
          return FileX
        case 'search':
          return SearchX
        case 'network':
          return WifiOff
        case 'default':
        default:
          return Inbox
      }
    })

    const sizeClasses = computed(() => {
      switch (props.size) {
        case 'sm':
          return 'w-16 h-16'
        case 'lg':
          return 'w-32 h-32'
        case 'xl':
          return 'w-48 h-48'
        case 'md':
        default:
          return 'w-24 h-24'
      }
    })

    const textSizeClasses = computed(() => {
      switch (props.size) {
        case 'sm':
          return 'text-sm'
        case 'lg':
          return 'text-lg'
        case 'xl':
          return 'text-xl'
        case 'md':
        default:
          return 'text-base'
      }
    })

    const iconSize = computed(() => {
      switch (props.size) {
        case 'sm':
          return 32
        case 'lg':
          return 64
        case 'xl':
          return 96
        case 'md':
        default:
          return 48
      }
    })

    const handleAction = () => {
      emit('action')
    }

    return () => (
      <div
        class={cn(
          'flex flex-col items-center justify-center p-8 text-neutral-400',
          props.className
        )}
      >
        {props.image ? (
          <img
            src={props.image}
            alt="empty"
            class={cn('mb-4', sizeClasses.value)}
          />
        ) : slots.image ? (
          <div class={cn('mb-4', sizeClasses.value)}>
            {slots.image()}
          </div>
        ) : (
          <div class={cn('mb-4', sizeClasses.value, 'flex items-center justify-center')}>
            <iconComponent.value size={iconSize.value} class="text-neutral-300" />
          </div>
        )}
        <p class={cn('mb-2 text-neutral-600', textSizeClasses.value)}>
          {slots.description ? slots.description() : props.description}
        </p>
        {slots.default && (
          <p class="text-sm text-neutral-400 mb-4">
            {slots.default()}
          </p>
        )}
        {props.showAction && (
          <button
            type="button"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            onClick={handleAction}
          >
            {props.actionText}
          </button>
        )}
        {slots.action && (
          <div class="mt-4">
            {slots.action()}
          </div>
        )}
      </div>
    )
  },
})

export const EmptyState = defineComponent({
  name: 'EmptyState',
  props: {
    className: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '暂无数据',
    },
    description: {
      type: String,
      default: '当前没有可显示的内容',
    },
    icon: {
      type: Object,
      default: undefined,
    },
    image: {
      type: String,
      default: '',
    },
    action: {
      type: Object,
      default: undefined,
    },
  },
  emits: ['action'],
  setup(props, { emit, slots }) {
    const handleAction = () => {
      emit('action')
    }

    return () => (
      <div
        class={cn(
          'flex flex-col items-center justify-center min-h-[400px] p-8',
          props.className
        )}
      >
        {props.image ? (
          <img
            src={props.image}
            alt="empty"
            class="w-32 h-32 mb-6 opacity-50"
          />
        ) : slots.image ? (
          <div class="w-32 h-32 mb-6">
            {slots.image()}
          </div>
        ) : props.icon ? (
          <div class="w-32 h-32 mb-6 flex items-center justify-center">
            <props.icon size={64} class="text-neutral-300" />
          </div>
        ) : (
          <div class="w-32 h-32 mb-6 flex items-center justify-center">
            <Inbox size={64} class="text-neutral-300" />
          </div>
        )}
        <h3 class="text-lg font-semibold text-neutral-700 mb-2">
          {slots.title ? slots.title() : props.title}
        </h3>
        <p class="text-sm text-neutral-500 mb-6 text-center max-w-md">
          {slots.description ? slots.description() : props.description}
        </p>
        {slots.action ? (
          slots.action()
        ) : props.action ? (
          <props.action onClick={handleAction} />
        ) : null}
      </div>
    )
  },
})
