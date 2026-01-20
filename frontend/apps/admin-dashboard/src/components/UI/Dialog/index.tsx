/**
 * @fileoverview YYC³餐饮行业智能化平台 - 对话框组件
 * @description 轻量级对话框组件，用于简单的确认和提示
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { defineComponent, ref, computed, watch, onMounted, onUnmounted, type PropType } from 'vue'
import { cn } from '@/utils/cn'
import { X, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-vue-next'

export const Dialog = defineComponent({
  name: 'Dialog',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    type: {
      type: String as PropType<'info' | 'success' | 'warning' | 'error'>,
      default: 'info',
      validator: (value: string) => ['info', 'success', 'warning', 'error'].includes(value),
    },
    content: {
      type: String,
      default: '',
    },
    showIcon: {
      type: Boolean,
      default: true,
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
    okText: {
      type: String,
      default: '确定',
    },
    cancelText: {
      type: String,
      default: '取消',
    },
    showCancel: {
      type: Boolean,
      default: true,
    },
    okButtonProps: {
      type: Object as PropType<any>,
      default: undefined,
    },
    cancelButtonProps: {
      type: Object as PropType<any>,
      default: undefined,
    },
    zIndex: {
      type: Number,
      default: 1000,
    },
    width: {
      type: [String, Number] as PropType<string | number>,
      default: 420,
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
  emits: ['update:visible', 'ok', 'cancel', 'afterClose', 'afterOpenChange'],
  setup(props, { emit, slots }) {
    const dialogRef = ref<HTMLElement>()

    const widthStyle = computed(() => {
      if (typeof props.width === 'number') {
        return { width: `${props.width}px` }
      }
      return { width: props.width }
    })

    const iconComponent = computed(() => {
      switch (props.type) {
        case 'success':
          return CheckCircle
        case 'warning':
          return AlertTriangle
        case 'error':
          return XCircle
        case 'info':
        default:
          return Info
      }
    })

    const iconColor = computed(() => {
      switch (props.type) {
        case 'success':
          return 'text-success-600 bg-success-100'
        case 'warning':
          return 'text-warning-600 bg-warning-100'
        case 'error':
          return 'text-danger-600 bg-danger-100'
        case 'info':
        default:
          return 'text-primary-600 bg-primary-100'
      }
    })

    const handleMaskClick = () => {
      if (props.maskClosable) {
        handleClose()
      }
    }

    const handleClose = () => {
      emit('update:visible', false)
      emit('cancel')
      props.afterClose?.()
      props.afterOpenChange?.(false)
    }

    const handleOk = () => {
      emit('ok')
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
        ref={dialogRef}
        class="fixed inset-0 z-50 flex items-center justify-center"
        style={{ zIndex: props.zIndex }}
      >
        {props.mask && (
          <div
            class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200"
            onClick={handleMaskClick}
          />
        )}
        <div
          class={cn(
            'relative bg-white rounded-lg shadow-xl max-w-[90vw] flex flex-col',
            'animate-in fade-in zoom-in-95 duration-200'
          )}
          style={{ ...widthStyle.value }}
        >
          <div class="flex items-start gap-4 p-6">
            {props.showIcon && (
              <div class={cn('flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center', iconColor.value)}>
                <iconComponent.value size={24} />
              </div>
            )}
            <div class="flex-1">
              {props.title && (
                <div class="text-lg font-semibold text-neutral-900 mb-2">
                  {props.title}
                </div>
              )}
              <div class="text-sm text-neutral-600">
                {slots.content ? slots.content() : props.content}
              </div>
            </div>
            {props.closable && (
              <button
                type="button"
                class="flex-shrink-0 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                onClick={handleClose}
              >
                <X size={20} class="text-neutral-600" />
              </button>
            )}
          </div>
          <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200">
            {props.showCancel && (
              <button
                type="button"
                class="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors"
                onClick={handleClose}
                {...props.cancelButtonProps}
              >
                {props.cancelText}
              </button>
            )}
            <button
              type="button"
              class={cn(
                'px-4 py-2 rounded-lg text-white transition-colors',
                props.type === 'success' && 'bg-success-600 hover:bg-success-700',
                props.type === 'warning' && 'bg-warning-600 hover:bg-warning-700',
                props.type === 'error' && 'bg-danger-600 hover:bg-danger-700',
                props.type === 'info' && 'bg-primary-600 hover:bg-primary-700'
              )}
              onClick={handleOk}
              {...props.okButtonProps}
            >
              {props.okText}
            </button>
          </div>
        </div>
      </div>
    )
  },
})

export const DialogHeader = defineComponent({
  name: 'DialogHeader',
  setup(props, { attrs, slots }) {
    return () => (
      <div
        class={cn('flex items-start gap-4 p-6', attrs.class as string)}
      >
        {slots.default?.()}
      </div>
    )
  },
})

export const DialogTitle = defineComponent({
  name: 'DialogTitle',
  setup(props, { attrs, slots }) {
    return () => (
      <div class={cn('text-lg font-semibold text-neutral-900 mb-2', attrs.class as string)}>
        {slots.default?.()}
      </div>
    )
  },
})

export const DialogContent = defineComponent({
  name: 'DialogContent',
  setup(props, { attrs, slots }) {
    return () => (
      <div class={cn('text-sm text-neutral-600', attrs.class as string)}>
        {slots.default?.()}
      </div>
    )
  },
})

export const DialogFooter = defineComponent({
  name: 'DialogFooter',
  setup(props, { attrs, slots }) {
    return () => (
      <div class={cn('flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200', attrs.class as string)}>
        {slots.default?.()}
      </div>
    )
  },
})
