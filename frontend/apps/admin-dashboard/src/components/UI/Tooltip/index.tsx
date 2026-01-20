/**
 * @fileoverview YYC³餐饮行业智能化平台 - 提示框组件
 * @description 统一的提示框组件，支持多种位置和样式
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { defineComponent, ref, computed, onMounted, onUnmounted, type PropType } from 'vue'
import { cn } from '@/utils/cn'

export const Tooltip = defineComponent({
  name: 'Tooltip',
  props: {
    content: {
      type: String,
      default: '',
    },
    placement: {
      type: String as PropType<'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end'>,
      default: 'top',
    },
    trigger: {
      type: String as PropType<'hover' | 'click' | 'focus'>,
      default: 'hover',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    delay: {
      type: Number,
      default: 0,
    },
    arrow: {
      type: Boolean,
      default: true,
    },
    color: {
      type: String as PropType<'default' | 'primary' | 'success' | 'warning' | 'danger'>,
      default: 'default',
    },
    maxWidth: {
      type: [String, Number] as PropType<string | number>,
      default: 250,
    },
    zIndex: {
      type: Number,
      default: 1000,
    },
  },
  emits: ['visible-change'],
  setup(props, { emit, slots }) {
    const visible = ref(false)
    const triggerRef = ref<HTMLElement>()
    const tooltipRef = ref<HTMLElement>()
    const arrowRef = ref<HTMLElement>()
    const timer = ref<number>()

    const colorClasses = computed(() => {
      switch (props.color) {
        case 'primary':
          return 'bg-primary-600 text-white'
        case 'success':
          return 'bg-success-600 text-white'
        case 'warning':
          return 'bg-warning-600 text-white'
        case 'danger':
          return 'bg-danger-600 text-white'
        default:
          return 'bg-neutral-900 text-white'
      }
    })

    const arrowColorClasses = computed(() => {
      switch (props.color) {
        case 'primary':
          return 'border-primary-600'
        case 'success':
          return 'border-success-600'
        case 'warning':
          return 'border-warning-600'
        case 'danger':
          return 'border-danger-600'
        default:
          return 'border-neutral-900'
      }
    })

    const placementClasses = computed(() => {
      switch (props.placement) {
        case 'top':
          return 'bottom-full left-1/2 -translate-x-1/2 mb-2'
        case 'bottom':
          return 'top-full left-1/2 -translate-x-1/2 mt-2'
        case 'left':
          return 'right-full top-1/2 -translate-y-1/2 mr-2'
        case 'right':
          return 'left-full top-1/2 -translate-y-1/2 ml-2'
        case 'top-start':
          return 'bottom-full left-0 mb-2'
        case 'top-end':
          return 'bottom-full right-0 mb-2'
        case 'bottom-start':
          return 'top-full left-0 mt-2'
        case 'bottom-end':
          return 'top-full right-0 mt-2'
        case 'left-start':
          return 'right-full top-0 mr-2'
        case 'left-end':
          return 'right-full bottom-0 mr-2'
        case 'right-start':
          return 'left-full top-0 ml-2'
        case 'right-end':
          return 'left-full bottom-0 ml-2'
        default:
          return 'bottom-full left-1/2 -translate-x-1/2 mb-2'
      }
    })

    const arrowPlacementClasses = computed(() => {
      switch (props.placement) {
        case 'top':
          return 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45'
        case 'bottom':
          return 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45'
        case 'left':
          return 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45'
        case 'right':
          return 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rotate-45'
        case 'top-start':
          return 'bottom-0 left-2 translate-y-1/2 rotate-45'
        case 'top-end':
          return 'bottom-0 right-2 translate-y-1/2 rotate-45'
        case 'bottom-start':
          return 'top-0 left-2 -translate-y-1/2 rotate-45'
        case 'bottom-end':
          return 'top-0 right-2 -translate-y-1/2 rotate-45'
        case 'left-start':
          return 'right-0 top-2 translate-x-1/2 rotate-45'
        case 'left-end':
          return 'right-0 bottom-2 translate-x-1/2 rotate-45'
        case 'right-start':
          return 'left-0 top-2 -translate-x-1/2 rotate-45'
        case 'right-end':
          return 'left-0 bottom-2 -translate-x-1/2 rotate-45'
        default:
          return 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45'
      }
    })

    const maxWidthStyle = computed(() => {
      if (typeof props.maxWidth === 'number') {
        return { maxWidth: `${props.maxWidth}px` }
      }
      return { maxWidth: props.maxWidth }
    })

    const show = () => {
      if (props.disabled) {
        return
      }

      if (props.delay > 0) {
        timer.value = window.setTimeout(() => {
          visible.value = true
          emit('visible-change', true)
        }, props.delay)
      } else {
        visible.value = true
        emit('visible-change', true)
      }
    }

    const hide = () => {
      if (timer.value) {
        clearTimeout(timer.value)
        timer.value = undefined
      }
      visible.value = false
      emit('visible-change', false)
    }

    const handleMouseEnter = () => {
      if (props.trigger === 'hover') {
        show()
      }
    }

    const handleMouseLeave = () => {
      if (props.trigger === 'hover') {
        hide()
      }
    }

    const handleClick = () => {
      if (props.trigger === 'click') {
        if (visible.value) {
          hide()
        } else {
          show()
        }
      }
    }

    const handleFocus = () => {
      if (props.trigger === 'focus') {
        show()
      }
    }

    const handleBlur = () => {
      if (props.trigger === 'focus') {
        hide()
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (props.trigger === 'click' && visible.value) {
        if (
          triggerRef.value &&
          !triggerRef.value.contains(event.target as Node) &&
          tooltipRef.value &&
          !tooltipRef.value.contains(event.target as Node)
        ) {
          hide()
        }
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
      if (timer.value) {
        clearTimeout(timer.value)
      }
    })

    return () => (
      <div class="relative inline-block">
        <div
          ref={triggerRef}
          class="inline-block"
          onMouseenter={handleMouseEnter}
          onMouseleave={handleMouseLeave}
          onClick={handleClick}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          {slots.default?.()}
        </div>
        {visible.value && (
          <div
            ref={tooltipRef}
            class={cn(
              'absolute z-50 px-3 py-1.5 text-xs rounded-md shadow-lg',
              colorClasses.value,
              placementClasses.value,
              'animate-in fade-in zoom-in-95 duration-200'
            )}
            style={{ ...maxWidthStyle.value, zIndex: props.zIndex }}
          >
            {slots.content ? slots.content() : props.content}
            {props.arrow && (
              <div
                ref={arrowRef}
                class={cn(
                  'absolute w-2.5 h-2.5 border-2 border-transparent',
                  arrowColorClasses.value,
                  arrowPlacementClasses.value
                )}
              />
            )}
          </div>
        )}
      </div>
    )
  },
})
