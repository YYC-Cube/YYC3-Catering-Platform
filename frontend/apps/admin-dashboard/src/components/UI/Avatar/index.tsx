/**
 * @fileoverview YYC³餐饮行业智能化平台 - 头像组件
 * @description 头像组件，支持图片、文字和图标
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { defineComponent, computed, type PropType } from 'vue'
import { cn } from '@/utils/cn'
import { User } from 'lucide-vue-next'

export const Avatar = defineComponent({
  name: 'Avatar',
  props: {
    className: {
      type: String,
      default: '',
    },
    src: {
      type: String,
      default: '',
    },
    alt: {
      type: String,
      default: '',
    },
    size: {
      type: [String, Number] as PropType<string | number>,
      default: 'md',
    },
    shape: {
      type: String as PropType<'circle' | 'square'>,
      default: 'circle',
    },
    icon: {
      type: Object,
      default: undefined,
    },
    text: {
      type: String,
      default: '',
    },
    gap: {
      type: Number,
      default: 4,
    },
  },
  setup(props, { attrs, slots }) {
    const sizeStyle = computed(() => {
      const sizeMap = {
        xs: 24,
        sm: 32,
        md: 40,
        lg: 48,
        xl: 64,
        xxl: 80,
      }
      const size = typeof props.size === 'number' ? props.size : sizeMap[props.size as keyof typeof sizeMap] || 40
      return {
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size * 0.4}px`,
      }
    })

    const shapeClass = computed(() => {
      return props.shape === 'circle' ? 'rounded-full' : 'rounded-lg'
    })

    const displayText = computed(() => {
      if (props.text) {
        return props.text.slice(0, 2).toUpperCase()
      }
      return ''
    })

    return () => (
      <div
        class={cn(
          'relative flex items-center justify-center overflow-hidden bg-neutral-200 text-neutral-600',
          shapeClass.value,
          props.className
        )}
        style={sizeStyle.value}
      >
        {props.src ? (
          <img
            src={props.src}
            alt={props.alt}
            class="w-full h-full object-cover"
            onError={(e: Event) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
        ) : slots.default ? (
          slots.default()
        ) : props.icon ? (
          <props.icon size={sizeStyle.value.fontSize} />
        ) : displayText.value ? (
          <span class="font-medium">{displayText.value}</span>
        ) : (
          <User size={sizeStyle.value.fontSize} />
        )}
      </div>
    )
  },
})

export const AvatarGroup = defineComponent({
  name: 'AvatarGroup',
  props: {
    className: {
      type: String,
      default: '',
    },
    max: {
      type: Number,
      default: undefined,
    },
    maxStyle: {
      type: Object,
      default: undefined,
    },
    size: {
      type: [String, Number] as PropType<string | number>,
      default: 'md',
    },
    shape: {
      type: String as PropType<'circle' | 'square'>,
      default: 'circle',
    },
  },
  setup(props, { attrs, slots }) {
    const children = computed(() => {
      const avatars = slots.default?.() || []
      if (props.max && avatars.length > props.max) {
        return avatars.slice(0, props.max)
      }
      return avatars
    })

    const remainingCount = computed(() => {
      const avatars = slots.default?.() || []
      if (props.max && avatars.length > props.max) {
        return avatars.length - props.max
      }
      return 0
    })

    const sizeMap = {
      xs: 24,
      sm: 32,
      md: 40,
      lg: 48,
      xl: 64,
      xxl: 80,
    }
    const size = typeof props.size === 'number' ? props.size : sizeMap[props.size as keyof typeof sizeMap] || 40
    const gap = size * 0.25

    return () => (
      <div
        class={cn('flex items-center', props.className)}
        style={{ marginLeft: `-${gap}px` }}
      >
        {children.value.map((child, index) => (
          <div
            key={index}
            class="relative"
            style={{ marginLeft: index === 0 ? '0' : `${gap}px` }}
          >
            {child}
          </div>
        ))}
        {remainingCount.value > 0 && (
          <div
            class={cn(
              'relative flex items-center justify-center bg-neutral-200 text-neutral-600 font-medium',
              props.shape === 'circle' ? 'rounded-full' : 'rounded-lg'
            )}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              fontSize: `${size * 0.4}px`,
              marginLeft: `${gap}px`,
              ...props.maxStyle,
            }}
          >
            +{remainingCount.value}
          </div>
        )}
      </div>
    )
  },
})
