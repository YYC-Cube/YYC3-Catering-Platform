/**
 * @fileoverview YYC³餐饮行业智能化平台 - 分割线组件
 * @description 分割线组件，支持水平和垂直方向
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { defineComponent, computed, type PropType } from 'vue'
import { cn } from '@/utils/cn'

export const Divider = defineComponent({
  name: 'Divider',
  props: {
    className: {
      type: String,
      default: '',
    },
    orientation: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'horizontal',
    },
    dashed: {
      type: Boolean,
      default: false,
    },
    plain: {
      type: Boolean,
      default: false,
    },
    variant: {
      type: String as PropType<'solid' | 'dashed' | 'dotted'>,
      default: 'solid',
    },
    color: {
      type: String,
      default: 'neutral-200',
    },
    thickness: {
      type: [Number, String] as PropType<number | string>,
      default: 1,
    },
    margin: {
      type: [Number, String] as PropType<number | string>,
      default: 16,
    },
  },
  setup(props, { attrs, slots }) {
    const orientationClasses = computed(() => {
      switch (props.orientation) {
        case 'vertical':
          return 'h-full w-px'
        case 'horizontal':
        default:
          return 'h-px w-full'
      }
    })

    const borderStyle = computed(() => {
      switch (props.variant) {
        case 'dashed':
          return 'border-dashed'
        case 'dotted':
          return 'border-dotted'
        case 'solid':
        default:
          return 'border-solid'
      }
    })

    const marginStyle = computed(() => {
      const marginValue = typeof props.margin === 'number' ? `${props.margin}px` : props.margin
      switch (props.orientation) {
        case 'vertical':
          return {
            margin: `0 ${marginValue}`,
          }
        case 'horizontal':
        default:
          return {
            margin: `${marginValue} 0`,
          }
      }
    })

    const borderStyleValue = computed(() => {
      const thicknessValue = typeof props.thickness === 'number' ? `${props.thickness}px` : props.thickness
      switch (props.orientation) {
        case 'vertical':
          return {
            borderWidth: `0 0 0 ${thicknessValue}`,
            borderColor: props.color,
          }
        case 'horizontal':
        default:
          return {
            borderWidth: `${thicknessValue} 0 0 0`,
            borderColor: props.color,
          }
      }
    })

    return () => (
      <div
        class={cn(
          'flex items-center',
          props.orientation === 'horizontal' ? 'w-full' : 'h-full',
          props.className
        )}
        style={marginStyle.value}
      >
        {slots.default && props.orientation === 'horizontal' ? (
          <>
            <div
              class={cn('flex-1', borderStyle.value)}
              style={borderStyleValue.value}
            />
            <span
              class={cn(
                'px-4 text-sm text-neutral-500',
                props.plain && 'text-neutral-400'
              )}
            >
              {slots.default?.()}
            </span>
            <div
              class={cn('flex-1', borderStyle.value)}
              style={borderStyleValue.value}
            />
          </>
        ) : (
          <div
            class={cn(
              'flex-shrink-0',
              borderStyle.value,
              props.orientation === 'vertical' ? 'h-full w-px' : 'h-px w-full'
            )}
            style={borderStyleValue.value}
          />
        )}
      </div>
    )
  },
})
