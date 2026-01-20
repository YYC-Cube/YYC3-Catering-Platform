/**
 * @fileoverview YYC³餐饮行业智能化平台 - 骨架屏组件
 * @description 骨架屏加载占位组件
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { defineComponent, computed, type PropType } from 'vue'
import { cn } from '@/utils/cn'

export const Skeleton = defineComponent({
  name: 'Skeleton',
  props: {
    className: {
      type: String,
      default: '',
    },
    variant: {
      type: String as PropType<'default' | 'circle' | 'rounded'>,
      default: 'default',
    },
    width: {
      type: [String, Number] as PropType<string | number>,
      default: '100%',
    },
    height: {
      type: [String, Number] as PropType<string | number>,
      default: '100%',
    },
    count: {
      type: Number,
      default: 1,
    },
    animation: {
      type: String as PropType<'pulse' | 'wave' | 'none'>,
      default: 'pulse',
    },
    color: {
      type: String,
      default: 'neutral-200',
    },
    highlightColor: {
      type: String,
      default: 'neutral-100',
    },
  },
  setup(props, { attrs, slots }) {
    const widthStyle = computed(() => {
      if (typeof props.width === 'number') {
        return { width: `${props.width}px` }
      }
      return { width: props.width }
    })

    const heightStyle = computed(() => {
      if (typeof props.height === 'number') {
        return { height: `${props.height}px` }
      }
      return { height: props.height }
    })

    const variantClasses = computed(() => {
      switch (props.variant) {
        case 'circle':
          return 'rounded-full'
        case 'rounded':
          return 'rounded-lg'
        case 'default':
        default:
          return 'rounded-md'
      }
    })

    const animationClasses = computed(() => {
      switch (props.animation) {
        case 'pulse':
          return 'animate-pulse'
        case 'wave':
          return 'animate-shimmer'
        case 'none':
        default:
          return ''
      }
    })

    const renderSkeleton = () => {
      const skeletons = []
      for (let i = 0; i < props.count; i++) {
        skeletons.push(
          <div
            key={i}
            class={cn(
              'bg-neutral-200',
              variantClasses.value,
              animationClasses.value,
              props.className
            )}
            style={{
              ...widthStyle.value,
              ...heightStyle.value,
              backgroundColor: props.color === 'neutral-200' ? undefined : `var(--color-${props.color})`,
            }}
          />
        )
      }
      return skeletons
    }

    return () => (
      <div class="space-y-2">
        {renderSkeleton()}
      </div>
    )
  },
})

export const SkeletonAvatar = defineComponent({
  name: 'SkeletonAvatar',
  props: {
    className: {
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
  },
  setup(props, { attrs }) {
    const sizeMap = {
      xs: 24,
      sm: 32,
      md: 40,
      lg: 48,
      xl: 64,
      xxl: 80,
    }
    const size = typeof props.size === 'number' ? props.size : sizeMap[props.size as keyof typeof sizeMap] || 40

    return () => (
      <Skeleton
        class={props.className}
        variant={props.shape === 'circle' ? 'circle' : 'rounded'}
        width={size}
        height={size}
      />
    )
  },
})

export const SkeletonText = defineComponent({
  name: 'SkeletonText',
  props: {
    className: {
      type: String,
      default: '',
    },
    lines: {
      type: Number,
      default: 3,
    },
    width: {
      type: [String, Number] as PropType<string | number>,
      default: '100%',
    },
    height: {
      type: [String, Number] as PropType<string | number>,
      default: 16,
    },
  },
  setup(props, { attrs }) {
    return () => (
      <div class="space-y-2">
        {Array.from({ length: props.lines }).map((_, index) => (
          <Skeleton
            key={index}
            class={props.className}
            width={index === props.lines - 1 ? '60%' : props.width}
            height={props.height}
          />
        ))}
      </div>
    )
  },
})

export const SkeletonButton = defineComponent({
  name: 'SkeletonButton',
  props: {
    className: {
      type: String,
      default: '',
    },
    width: {
      type: [String, Number] as PropType<string | number>,
      default: 120,
    },
    height: {
      type: [String, Number] as PropType<string | number>,
      default: 36,
    },
  },
  setup(props, { attrs }) {
    return () => (
      <Skeleton
        class={props.className}
        variant="rounded"
        width={props.width}
        height={props.height}
      />
    )
  },
})

export const SkeletonInput = defineComponent({
  name: 'SkeletonInput',
  props: {
    className: {
      type: String,
      default: '',
    },
    width: {
      type: [String, Number] as PropType<string | number>,
      default: '100%',
    },
    height: {
      type: [String, Number] as PropType<string | number>,
      default: 40,
    },
  },
  setup(props, { attrs }) {
    return () => (
      <Skeleton
        class={props.className}
        variant="rounded"
        width={props.width}
        height={props.height}
      />
    )
  },
})

export const SkeletonImage = defineComponent({
  name: 'SkeletonImage',
  props: {
    className: {
      type: String,
      default: '',
    },
    width: {
      type: [String, Number] as PropType<string | number>,
      default: 200,
    },
    height: {
      type: [String, Number] as PropType<string | number>,
      default: 200,
    },
  },
  setup(props, { attrs }) {
    return () => (
      <Skeleton
        class={props.className}
        variant="rounded"
        width={props.width}
        height={props.height}
      />
    )
  },
})
