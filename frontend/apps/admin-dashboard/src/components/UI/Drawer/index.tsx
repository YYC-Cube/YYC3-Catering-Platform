/**
 * @fileoverview YYC³餐饮行业智能化平台 - 抽屉组件
 * @description 统一的抽屉组件，支持多种位置和尺寸
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { defineComponent, ref, computed, watch, onMounted, onUnmounted, type PropType } from 'vue'
import { cn } from '@/utils/cn'
import { X } from 'lucide-vue-next'

export const Drawer = defineComponent({
  name: 'Drawer',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    placement: {
      type: String as PropType<'top' | 'right' | 'bottom' | 'left'>,
      default: 'right',
      validator: (value: string) => ['top', 'right', 'bottom', 'left'].includes(value),
    },
    title: {
      type: String,
      default: '',
    },
    width: {
      type: [String, Number] as PropType<string | number>,
      default: 280,
    },
    height: {
      type: [String, Number] as PropType<string | number>,
      default: undefined,
    },
    closable: {
      type: Boolean,
      default: true,
    },
    maskClosable: {
      type: Boolean,
      default: true,
    },
    mask: {
      type: Boolean,
      default: true,
    },
    keyboard: {
      type: Boolean,
      default: true,
    },
    level: {
      type: [String, Number] as PropType<string | number>,
      default: undefined,
    },
    getContainer: {
      type: [String, Function] as PropType<string | (() => HTMLElement)>,
      default: undefined,
    },
    destroyOnClose: {
      type: Boolean,
      default: false,
    },
    forceRender: {
      type: Boolean,
      default: false,
    },
    wrapClassName: {
      type: String,
      default: '',
    },
    zIndex: {
      type: Number,
      default: 1000,
    },
    bodyStyle: {
      type: Object as PropType<Record<string, any>>,
      default: undefined,
    },
    afterClose: {
      type: Function as PropType<() => void>,
      default: undefined,
    },
    afterOpenChange: {
      type: Function as PropType<(visible: boolean) => void>,
      default: undefined,
    },
  },
  emits: ['update:visible', 'close', 'afterClose', 'afterOpenChange'],
  setup(props, { emit, slots }) {
    const drawerRef = ref<HTMLElement>()
    const contentRef = ref<HTMLElement>()

    const placementClasses = computed(() => {
      switch (props.placement) {
        case 'top':
          return 'top-0 left-0 right-0 h-auto max-h-[80vh]'
        case 'bottom':
          return 'bottom-0 left-0 right-0 h-auto max-h-[80vh]'
        case 'left':
          return 'left-0 top-0 bottom-0 w-auto max-w-[80vw]'
        case 'right':
        default:
          return 'right-0 top-0 bottom-0 w-auto max-w-[80vw]'
      }
    })

    const sizeStyle = computed(() => {
      const style: Record<string, any> = {}
      
      if (props.placement === 'top' || props.placement === 'bottom') {
        if (props.height !== undefined) {
          style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
        }
      } else {
        if (props.width !== undefined) {
          style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
        }
      }
      
      return style
    })

    const handleMaskClick = () => {
      if (props.maskClosable) {
        handleClose()
      }
    }

    const handleClose = () => {
      emit('update:visible', false)
      emit('close')
      props.afterClose?.()
      props.afterOpenChange?.(false)
    }

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && props.visible && props.keyboard) {
        handleClose()
      }
    }

    const disableBodyScroll = () => {
      document.body.style.overflow = 'hidden'
    }

    const enableBodyScroll = () => {
      document.body.style.overflow = ''
    }

    watch(() => props.visible, (newVal) => {
      if (newVal) {
        disableBodyScroll()
        props.afterOpenChange?.(true)
      } else {
        enableBodyScroll()
        props.afterOpenChange?.(false)
      }
    })

    onMounted(() => {
      document.addEventListener('keydown', handleEsc)
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', handleEsc)
      enableBodyScroll()
    })

    return () => (
      <div
        v-show={props.visible}
        ref={drawerRef}
        class={cn(
          'fixed inset-0 z-50 flex',
          props.wrapClassName
        )}
        style={{ zIndex: props.zIndex }}
      >
        {props.mask && (
          <div
            class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200"
            onClick={handleMaskClick}
          />
        )}
        <div
          ref={contentRef}
          class={cn(
            'relative bg-white shadow-xl flex flex-col',
            placementClasses.value,
            'animate-in fade-in zoom-in-95 duration-200',
            props.placement === 'top' && 'rounded-b-lg',
            props.placement === 'bottom' && 'rounded-t-lg',
            props.placement === 'left' && 'rounded-r-lg',
            props.placement === 'right' && 'rounded-l-lg'
          )}
          style={{ ...sizeStyle.value, ...props.bodyStyle }}
        >
          <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
            <div class="text-lg font-semibold text-neutral-900">
              {props.title}
            </div>
            {props.closable && (
              <button
                type="button"
                class="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                onClick={handleClose}
              >
                <X size={20} class="text-neutral-600" />
              </button>
            )}
          </div>
          <div class="flex-1 overflow-auto p-6">
            {slots.default?.()}
          </div>
          {slots.footer && (
            <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200">
              {slots.footer()}
            </div>
          )}
        </div>
      </div>
    )
  },
})

export const DrawerHeader = defineComponent({
  name: 'DrawerHeader',
  setup(props, { attrs, slots }) {
    return () => (
      <div
        class={cn('flex items-center justify-between px-6 py-4 border-b border-neutral-200', attrs.class as string)}
      >
        {slots.default?.()}
      </div>
    )
  },
})

export const DrawerTitle = defineComponent({
  name: 'DrawerTitle',
  setup(props, { attrs, slots }) {
    return () => (
      <div class={cn('text-lg font-semibold text-neutral-900', attrs.class as string)}>
        {slots.default?.()}
      </div>
    )
  },
})

export const DrawerContent = defineComponent({
  name: 'DrawerContent',
  setup(props, { attrs, slots }) {
    return () => (
      <div class={cn('flex-1 overflow-auto p-6', attrs.class as string)}>
        {slots.default?.()}
      </div>
    )
  },
})

export const DrawerFooter = defineComponent({
  name: 'DrawerFooter',
  setup(props, { attrs, slots }) {
    return () => (
      <div class={cn('flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200', attrs.class as string)}>
        {slots.default?.()}
      </div>
    )
  },
})
