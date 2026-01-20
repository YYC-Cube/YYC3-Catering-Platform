/**
 * @fileoverview YYC³餐饮行业智能化平台 - 面包屑导航组件
 * @description 统一的面包屑导航组件，支持多种样式和分隔符
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { defineComponent, computed, type PropType } from 'vue'
import { cn } from '@/utils/cn'
import { ChevronRight, Slash, MoreHorizontal } from 'lucide-vue-next'

export interface BreadcrumbItem {
  label: string
  path?: string
  disabled?: boolean
}

export const Breadcrumb = defineComponent({
  name: 'Breadcrumb',
  props: {
    items: {
      type: Array as PropType<BreadcrumbItem[]>,
      default: () => [],
    },
    separator: {
      type: String as PropType<'slash' | 'chevron' | 'arrow'>,
      default: 'chevron',
      validator: (value: string) => ['slash', 'chevron', 'arrow'].includes(value),
    },
    maxItems: {
      type: Number,
      default: undefined,
    },
    separatorClass: {
      type: String,
      default: '',
    },
    itemClass: {
      type: String,
      default: '',
    },
    activeClass: {
      type: String,
      default: '',
    },
  },
  emits: ['click'],
  setup(props, { emit }) {
    const separatorIcon = computed(() => {
      switch (props.separator) {
        case 'slash':
          return Slash
        case 'arrow':
          return ChevronRight
        case 'chevron':
        default:
          return ChevronRight
      }
    })

    const separatorClasses = computed(() => {
      return cn(
        'text-neutral-400 mx-2',
        props.separator === 'slash' && 'text-neutral-300',
        props.separatorClass
      )
    })

    const itemClasses = computed(() => {
      return cn(
        'text-sm transition-colors hover:text-primary-600 cursor-pointer',
        props.itemClass
      )
    })

    const activeClasses = computed(() => {
      return cn(
        'text-neutral-900 font-medium cursor-default',
        props.activeClass
      )
    })

    const displayItems = computed(() => {
      if (!props.maxItems || props.items.length <= props.maxItems) {
        return props.items
      }

      const items = [...props.items]
      const lastItem = items.pop()
      const firstItem = items.shift()

      return [
        firstItem,
        { label: '...', disabled: true },
        lastItem,
      ].filter(Boolean) as BreadcrumbItem[]
    })

    const handleClick = (item: BreadcrumbItem, index: number) => {
      if (item.disabled || index === displayItems.value.length - 1) {
        return
      }
      emit('click', item, index)
    }

    return () => (
      <nav aria-label="breadcrumb" class="flex items-center">
        <ol class="flex items-center flex-wrap gap-1">
          {displayItems.value.map((item, index) => (
            <li key={index} class="flex items-center">
              {index > 0 && (
                <span class={separatorClasses.value}>
                  <separatorIcon.value size={16} />
                </span>
              )}
              <span
                class={cn(
                  index === displayItems.value.length - 1 ? activeClasses.value : itemClasses.value,
                  item.disabled && 'opacity-50 cursor-not-allowed'
                )}
                onClick={() => handleClick(item, index)}
              >
                {item.label}
              </span>
            </li>
          ))}
        </ol>
      </nav>
    )
  },
})

export const BreadcrumbItem = defineComponent({
  name: 'BreadcrumbItem',
  props: {
    label: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
  setup(props, { emit, attrs }) {
    const handleClick = () => {
      if (!props.disabled && !props.active) {
        emit('click')
      }
    }

    return () => (
      <li class="flex items-center">
        <span
          class={cn(
            'text-sm transition-colors',
            props.active ? 'text-neutral-900 font-medium cursor-default' : 'hover:text-primary-600 cursor-pointer',
            props.disabled && 'opacity-50 cursor-not-allowed',
            attrs.class as string
          )}
          onClick={handleClick}
        >
          {props.label}
        </span>
      </li>
    )
  },
})

export const BreadcrumbSeparator = defineComponent({
  name: 'BreadcrumbSeparator',
  props: {
    separator: {
      type: String as PropType<'slash' | 'chevron' | 'arrow'>,
      default: 'chevron',
    },
  },
  setup(props) {
    const separatorIcon = computed(() => {
      switch (props.separator) {
        case 'slash':
          return Slash
        case 'arrow':
          return ChevronRight
        case 'chevron':
        default:
          return ChevronRight
      }
    })

    return () => (
      <li class="flex items-center">
        <span class="text-neutral-400 mx-2">
          <separatorIcon.value size={16} />
        </span>
      </li>
    )
  },
})

export const BreadcrumbEllipsis = defineComponent({
  name: 'BreadcrumbEllipsis',
  setup(props, { attrs }) {
    return () => (
      <li class="flex items-center">
        <span class={cn('text-neutral-400 mx-2', attrs.class as string)}>
          <MoreHorizontal size={16} />
        </span>
      </li>
    )
  },
})
