/**
 * @fileoverview YYC³餐饮行业智能化平台 - 分页组件
 * @description 统一的分页组件，支持多种布局和配置
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { defineComponent, computed, type PropType } from 'vue'
import { cn } from '@/utils/cn'
import { ChevronLeft, ChevronRight, MoreHorizontal, ChevronsLeft, ChevronsRight } from 'lucide-vue-next'

export const Pagination = defineComponent({
  name: 'Pagination',
  props: {
    currentPage: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    total: {
      type: Number,
      default: 0,
    },
    showSizeChanger: {
      type: Boolean,
      default: false,
    },
    pageSizeOptions: {
      type: Array as PropType<number[]>,
      default: () => [10, 20, 50, 100],
    },
    showQuickJumper: {
      type: Boolean,
      default: false,
    },
    showTotal: {
      type: [Boolean, Function] as PropType<boolean | ((total: number, range: [number, number]) => string)>,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    simple: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String as PropType<'sm' | 'md' | 'lg'>,
      default: 'md',
      validator: (value: string) => ['sm', 'md', 'lg'].includes(value),
    },
    hideOnSinglePage: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['change', 'show-size-change', 'update:currentPage', 'update:pageSize'],
  setup(props, { emit }) {
    const totalPages = computed(() => {
      return Math.ceil(props.total / props.pageSize) || 1
    })

    const showPagination = computed(() => {
      if (props.hideOnSinglePage && totalPages.value <= 1) {
        return false
      }
      return true
    })

    const sizeClasses = computed(() => {
      switch (props.size) {
        case 'sm':
          return 'text-sm'
        case 'lg':
          return 'text-lg'
        default:
          return 'text-base'
      }
    })

    const buttonSizeClasses = computed(() => {
      switch (props.size) {
        case 'sm':
          return 'w-8 h-8 px-2'
        case 'lg':
          return 'w-12 h-12 px-4'
        default:
          return 'w-10 h-10 px-3'
      }
    })

    const pageNumbers = computed(() => {
      const pages: (number | string)[] = []
      const current = props.currentPage
      const total = totalPages.value

      if (total <= 7) {
        for (let i = 1; i <= total; i++) {
          pages.push(i)
        }
      } else {
        if (current <= 4) {
          for (let i = 1; i <= 5; i++) {
            pages.push(i)
          }
          pages.push('...')
          pages.push(total)
        } else if (current >= total - 3) {
          pages.push(1)
          pages.push('...')
          for (let i = total - 4; i <= total; i++) {
            pages.push(i)
          }
        } else {
          pages.push(1)
          pages.push('...')
          for (let i = current - 1; i <= current + 1; i++) {
            pages.push(i)
          }
          pages.push('...')
          pages.push(total)
        }
      }

      return pages
    })

    const range = computed(() => {
      const start = (props.currentPage - 1) * props.pageSize + 1
      const end = Math.min(props.currentPage * props.pageSize, props.total)
      return [start, end] as [number, number]
    })

    const totalText = computed(() => {
      if (typeof props.showTotal === 'function') {
        return props.showTotal(props.total, range.value)
      }
      if (props.showTotal) {
        return `共 ${props.total} 条`
      }
      return ''
    })

    const handlePageChange = (page: number) => {
      if (page < 1 || page > totalPages.value || page === props.currentPage) {
        return
      }
      emit('update:currentPage', page)
      emit('change', page, props.pageSize)
    }

    const handlePageSizeChange = (size: number) => {
      const newPage = Math.min(props.currentPage, Math.ceil(props.total / size))
      emit('update:pageSize', size)
      emit('update:currentPage', newPage)
      emit('show-size-change', newPage, size)
      emit('change', newPage, size)
    }

    const handleQuickJumper = (event: KeyboardEvent) => {
      const input = event.target as HTMLInputElement
      const page = parseInt(input.value)
      if (!isNaN(page) && page >= 1 && page <= totalPages.value) {
        handlePageChange(page)
        input.value = ''
      }
    }

    return () => {
      if (!showPagination.value) {
        return null
      }

      return (
        <div class={cn('flex items-center gap-4', sizeClasses.value)}>
          {totalText.value && (
            <span class="text-neutral-600">{totalText.value}</span>
          )}

          {props.simple ? (
            <div class="flex items-center gap-2">
              <button
                disabled={props.disabled || props.currentPage === 1}
                class={cn(
                  'flex items-center justify-center rounded-lg border transition-all duration-200',
                  buttonSizeClasses.value,
                  props.disabled || props.currentPage === 1
                    ? 'border-neutral-200 text-neutral-400 cursor-not-allowed'
                    : 'border-neutral-300 text-neutral-700 hover:border-primary-500 hover:text-primary-600'
                )}
                onClick={() => handlePageChange(props.currentPage - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              <span class="text-neutral-700">
                {props.currentPage} / {totalPages.value}
              </span>
              <button
                disabled={props.disabled || props.currentPage === totalPages.value}
                class={cn(
                  'flex items-center justify-center rounded-lg border transition-all duration-200',
                  buttonSizeClasses.value,
                  props.disabled || props.currentPage === totalPages.value
                    ? 'border-neutral-200 text-neutral-400 cursor-not-allowed'
                    : 'border-neutral-300 text-neutral-700 hover:border-primary-500 hover:text-primary-600'
                )}
                onClick={() => handlePageChange(props.currentPage + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          ) : (
            <div class="flex items-center gap-1">
              <button
                disabled={props.disabled || props.currentPage === 1}
                class={cn(
                  'flex items-center justify-center rounded-lg border transition-all duration-200',
                  buttonSizeClasses.value,
                  props.disabled || props.currentPage === 1
                    ? 'border-neutral-200 text-neutral-400 cursor-not-allowed'
                    : 'border-neutral-300 text-neutral-700 hover:border-primary-500 hover:text-primary-600'
                )}
                onClick={() => handlePageChange(1)}
                title="首页"
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                disabled={props.disabled || props.currentPage === 1}
                class={cn(
                  'flex items-center justify-center rounded-lg border transition-all duration-200',
                  buttonSizeClasses.value,
                  props.disabled || props.currentPage === 1
                    ? 'border-neutral-200 text-neutral-400 cursor-not-allowed'
                    : 'border-neutral-300 text-neutral-700 hover:border-primary-500 hover:text-primary-600'
                )}
                onClick={() => handlePageChange(props.currentPage - 1)}
                title="上一页"
              >
                <ChevronLeft size={16} />
              </button>

              {pageNumbers.value.map((page, index) => (
                typeof page === 'string' ? (
                  <span key={index} class="px-2 text-neutral-400">
                    <MoreHorizontal size={16} />
                  </span>
                ) : (
                  <button
                    key={index}
                    disabled={props.disabled}
                    class={cn(
                      'flex items-center justify-center rounded-lg border transition-all duration-200',
                      buttonSizeClasses.value,
                      page === props.currentPage
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'border-neutral-300 text-neutral-700 hover:border-primary-500 hover:text-primary-600',
                      props.disabled && 'opacity-50 cursor-not-allowed'
                    )}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                )
              ))}

              <button
                disabled={props.disabled || props.currentPage === totalPages.value}
                class={cn(
                  'flex items-center justify-center rounded-lg border transition-all duration-200',
                  buttonSizeClasses.value,
                  props.disabled || props.currentPage === totalPages.value
                    ? 'border-neutral-200 text-neutral-400 cursor-not-allowed'
                    : 'border-neutral-300 text-neutral-700 hover:border-primary-500 hover:text-primary-600'
                )}
                onClick={() => handlePageChange(props.currentPage + 1)}
                title="下一页"
              >
                <ChevronRight size={16} />
              </button>
              <button
                disabled={props.disabled || props.currentPage === totalPages.value}
                class={cn(
                  'flex items-center justify-center rounded-lg border transition-all duration-200',
                  buttonSizeClasses.value,
                  props.disabled || props.currentPage === totalPages.value
                    ? 'border-neutral-200 text-neutral-400 cursor-not-allowed'
                    : 'border-neutral-300 text-neutral-700 hover:border-primary-500 hover:text-primary-600'
                )}
                onClick={() => handlePageChange(totalPages.value)}
                title="末页"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          )}

          {props.showSizeChanger && (
            <div class="flex items-center gap-2">
              <span class="text-neutral-600">每页</span>
              <select
                disabled={props.disabled}
                value={props.pageSize}
                class={cn(
                  'rounded-lg border border-neutral-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500/50',
                  props.disabled && 'opacity-50 cursor-not-allowed'
                )}
                onChange={(e: Event) => handlePageSizeChange(parseInt((e.target as HTMLSelectElement).value))}
              >
                {props.pageSizeOptions.map(size => (
                  <option key={size} value={size}>
                    {size} 条/页
                  </option>
                ))}
              </select>
            </div>
          )}

          {props.showQuickJumper && (
            <div class="flex items-center gap-2">
              <span class="text-neutral-600">跳至</span>
              <input
                type="number"
                min={1}
                max={totalPages.value}
                disabled={props.disabled}
                class={cn(
                  'w-16 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-center outline-none focus:ring-2 focus:ring-primary-500/50',
                  props.disabled && 'opacity-50 cursor-not-allowed'
                )}
                onKeyup={handleQuickJumper}
              />
              <span class="text-neutral-600">页</span>
            </div>
          )}
        </div>
      )
    },
  })
