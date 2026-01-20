/**
 * @fileoverview YYC³餐饮行业智能化平台 - 下拉菜单组件
 * @description 统一的下拉菜单组件，支持多种菜单项和操作
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { defineComponent, ref, computed, onMounted, onUnmounted, type PropType } from 'vue'
import { cn } from '@/utils/cn'
import { ChevronRight, Check, Circle } from 'lucide-vue-next'
import { Button } from '../Button'

export interface DropdownItem {
  label: string
  value?: string
  icon?: any
  disabled?: boolean
  danger?: boolean
  divided?: boolean
  children?: DropdownItem[]
}

export const Dropdown = defineComponent({
  name: 'Dropdown',
  props: {
    trigger: {
      type: [String, Object, Function] as PropType<string | object | (() => any)>,
      required: true,
    },
    items: {
      type: Array as PropType<DropdownItem[]>,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placement: {
      type: String as PropType<'bottom-start' | 'bottom' | 'bottom-end' | 'top-start' | 'top' | 'top-end' | 'left-start' | 'left' | 'left-end' | 'right-start' | 'right' | 'right-end'>,
      default: 'bottom-start',
    },
    triggerMode: {
      type: String as PropType<'click' | 'hover'>,
      default: 'click',
    },
    hideOnClick: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['select', 'visible-change'],
  setup(props, { emit, slots }) {
    const visible = ref(false)
    const triggerRef = ref<HTMLElement>()
    const dropdownRef = ref<HTMLElement>()

    const placementClasses = computed(() => {
      switch (props.placement) {
        case 'bottom-start':
          return 'top-full left-0'
        case 'bottom':
          return 'top-full left-1/2 -translate-x-1/2'
        case 'bottom-end':
          return 'top-full right-0'
        case 'top-start':
          return 'bottom-full left-0'
        case 'top':
          return 'bottom-full left-1/2 -translate-x-1/2'
        case 'top-end':
          return 'bottom-full right-0'
        case 'left-start':
          return 'right-full top-0'
        case 'left':
          return 'right-full top-1/2 -translate-y-1/2'
        case 'left-end':
          return 'right-full bottom-0'
        case 'right-start':
          return 'left-full top-0'
        case 'right':
          return 'left-full top-1/2 -translate-y-1/2'
        case 'right-end':
          return 'left-full bottom-0'
        default:
          return 'top-full left-0'
      }
    })

    const toggleDropdown = () => {
      if (props.disabled) {
        return
      }
      visible.value = !visible.value
      emit('visible-change', visible.value)
    }

    const showDropdown = () => {
      if (props.disabled || props.triggerMode !== 'hover') {
        return
      }
      visible.value = true
      emit('visible-change', true)
    }

    const hideDropdown = () => {
      if (props.disabled || props.triggerMode !== 'hover') {
        return
      }
      visible.value = false
      emit('visible-change', false)
    }

    const closeDropdown = () => {
      visible.value = false
      emit('visible-change', false)
    }

    const handleSelect = (item: DropdownItem) => {
      if (item.disabled) {
        return
      }
      emit('select', item)
      if (props.hideOnClick) {
        closeDropdown()
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.value &&
        !triggerRef.value.contains(event.target as Node) &&
        dropdownRef.value &&
        !dropdownRef.value.contains(event.target as Node)
      ) {
        closeDropdown()
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return () => (
      <div class="relative inline-block">
        <div
          ref={triggerRef}
          class="inline-block"
          onClick={toggleDropdown}
          onMouseenter={showDropdown}
          onMouseleave={hideDropdown}
        >
          {typeof props.trigger === 'string' ? (
            <Button>{props.trigger}</Button>
          ) : typeof props.trigger === 'function' ? (
            props.trigger()
          ) : (
            props.trigger
          )}
        </div>

        {visible.value && (
          <div
            ref={dropdownRef}
            class={cn(
              'absolute z-50 min-w-[8rem] bg-white border border-neutral-200 rounded-lg shadow-lg py-1',
              'animate-in fade-in zoom-in-95 duration-200',
              placementClasses.value
            )}
            onMouseenter={showDropdown}
            onMouseleave={hideDropdown}
          >
            {props.items.map((item, index) => (
              <div key={index}>
                {item.children ? (
                  <div class="relative">
                    <div
                      class={cn(
                        'px-3 py-2 text-sm flex items-center justify-between',
                        item.disabled && 'opacity-50 cursor-not-allowed',
                        !item.disabled && 'hover:bg-neutral-100 cursor-pointer'
                      )}
                    >
                      <div class="flex items-center gap-2">
                        {item.icon && <item.icon size={16} />}
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight size={16} class="text-neutral-400" />
                    </div>
                  </div>
                ) : (
                  <div
                    class={cn(
                      'px-3 py-2 text-sm flex items-center gap-2 cursor-pointer transition-colors',
                      item.disabled && 'opacity-50 cursor-not-allowed',
                      !item.disabled && 'hover:bg-neutral-100',
                      item.danger && 'text-danger-600 hover:bg-danger-50',
                      item.divided && 'border-t border-neutral-200 mt-1 pt-2'
                    )}
                    onClick={() => handleSelect(item)}
                  >
                    {item.icon && <item.icon size={16} />}
                    <span>{item.label}</span>
                  </div>
                )}
              </div>
            ))}
            {props.items.length === 0 && (
              <div class="px-3 py-8 text-center text-neutral-500 text-sm">
                无数据
              </div>
            )}
          </div>
        )}
      </div>
    )
  },
})
