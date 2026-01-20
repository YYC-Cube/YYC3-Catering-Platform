/**
 * @fileoverview YYC³餐饮行业智能化平台 - 模态框组件
 * @description 统一的模态框组件，支持多种尺寸和样式
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { defineComponent, ref, computed, watch, onMounted, onUnmounted, type PropType } from 'vue'
import { cn } from '@/utils/cn'
import { X } from 'lucide-vue-next'

export const Modal = defineComponent({
  name: 'Modal',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    width: {
      type: [String, Number] as PropType<string | number>,
      default: 520,
    },
    centered: {
      type: Boolean,
      default: false,
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
    footer: {
      type: [Boolean, Object] as PropType<boolean | { okText?: string; cancelText?: string }>,
      default: undefined,
    },
    okText: {
      type: String,
      default: '确定',
    },
    cancelText: {
      type: String,
      default: '取消',
    },
    okButtonProps: {
      type: Object as PropType<any>,
      default: undefined,
    },
    cancelButtonProps: {
      type: Object as PropType<any>,
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
  emits: ['update:visible', 'ok', 'cancel', 'afterClose', 'afterOpenChange'],
  setup(props, { emit, slots }) {
    const modalRef = ref<HTMLElement>()
    const contentRef = ref<HTMLElement>()

    const widthStyle = computed(() => {
      if (typeof props.width === 'number') {
        return { width: `${props.width}px` }
      }
      return { width: props.width }
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
        ref={modalRef}
        class={cn(
          'fixed inset-0 z-50 flex items-center justify-center',
          props.centered ? 'items-center' : 'items-start pt-20',
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
            'relative bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col',
            'animate-in fade-in zoom-in-95 duration-200'
          )}
          style={{ ...widthStyle, ...props.bodyStyle }}
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
          {props.footer !== false && (
            <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200">
              {slots.footer ? (
                slots.footer()
              ) : props.footer === true ? (
                <>
                  <Button onClick={handleClose}>
                    {props.cancelText}
                  </Button>
                  <Button variant="primary" onClick={handleOk} {...props.okButtonProps}>
                    {props.okText}
                  </Button>
                </>
              ) : props.footer ? (
                <>
                  <Button onClick={handleClose} {...props.cancelButtonProps}>
                    {props.footer.cancelText || props.cancelText}
                  </Button>
                  <Button variant="primary" onClick={handleOk} {...props.okButtonProps}>
                    {props.footer.okText || props.okText}
                  </Button>
                </>
              ) : null}
            </div>
          )}
        </div>
      </div>
    )
  },
})

export const ModalHeader = defineComponent({
  name: 'ModalHeader',
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

export const ModalTitle = defineComponent({
  name: 'ModalTitle',
  setup(props, { attrs, slots }) {
    return () => (
      <div class={cn('text-lg font-semibold text-neutral-900', attrs.class as string)}>
        {slots.default?.()}
      </div>
    )
  },
})

export const ModalContent = defineComponent({
  name: 'ModalContent',
  setup(props, { attrs, slots }) {
    return () => (
      <div class={cn('flex-1 overflow-auto p-6', attrs.class as string)}>
        {slots.default?.()}
      </div>
    )
  },
})

export const ModalFooter = defineComponent({
  name: 'ModalFooter',
  setup(props, { attrs, slots }) {
    return () => (
      <div class={cn('flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200', attrs.class as string)}>
        {slots.default?.()}
      </div>
    )
  },
})
