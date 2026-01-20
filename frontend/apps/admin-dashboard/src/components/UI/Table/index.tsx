/**
 * @fileoverview YYC³餐饮行业智能化平台 - 表格组件
 * @description 统一的表格组件，支持排序、选择、分页等功能
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { defineComponent, ref, computed, type PropType } from 'vue'
import { cn } from '@/utils/cn'
import { ChevronUp, ChevronDown, MoreHorizontal, Check } from 'lucide-vue-next'
import { Pagination } from '../Pagination'

export interface TableColumn {
  key: string
  title: string
  dataIndex?: string
  width?: number | string
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right'
  sortable?: boolean
  filterable?: boolean
  filters?: Array<{ text: string; value: any }>
  render?: (value: any, record: any, index: number) => any
}

export const Table = defineComponent({
  name: 'Table',
  props: {
    columns: {
      type: Array as PropType<TableColumn[]>,
      default: () => [],
    },
    data: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    rowKey: {
      type: [String, Function] as PropType<string | ((record: any) => string)>,
      default: 'id',
    },
    bordered: {
      type: Boolean,
      default: false,
    },
    striped: {
      type: Boolean,
      default: false,
    },
    hoverable: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String as PropType<'sm' | 'md' | 'lg'>,
      default: 'md',
      validator: (value: string) => ['sm', 'md', 'lg'].includes(value),
    },
    loading: {
      type: Boolean,
      default: false,
    },
    pagination: {
      type: [Boolean, Object] as PropType<boolean | { current: number; pageSize: number; total: number }>,
      default: false,
    },
    rowSelection: {
      type: Object as PropType<{
        selectedRowKeys?: string[]
        onChange?: (selectedRowKeys: string[], selectedRows: any[]) => void
        type?: 'checkbox' | 'radio'
      }>,
      default: undefined,
    },
    expandable: {
      type: Object as PropType<{
        expandedRowKeys?: string[]
        onChange?: (expandedRowKeys: string[]) => void
        expandedRowRender?: (record: any, index: number) => any
      }>,
      default: undefined,
    },
    scroll: {
      type: Object as PropType<{ x?: number | string; y?: number | string }>,
      default: undefined,
    },
  },
  emits: ['row-click', 'row-dblclick', 'change', 'sort-change', 'filter-change'],
  setup(props, { emit, slots }) {
    const sortField = ref<string>()
    const sortOrder = ref<'asc' | 'desc'>()
    const selectedRowKeys = ref<string[]>(props.rowSelection?.selectedRowKeys || [])
    const expandedRowKeys = ref<string[]>(props.expandable?.expandedRowKeys || [])

    const getRowKey = (record: any, index: number) => {
      if (typeof props.rowKey === 'function') {
        return props.rowKey(record)
      }
      return record[props.rowKey] || index
    }

    const getCellValue = (record: any, column: TableColumn) => {
      const value = column.dataIndex ? record[column.dataIndex] : record[column.key]
      return column.render ? column.render(value, record, props.data.indexOf(record)) : value
    }

    const sizeClasses = computed(() => {
      switch (props.size) {
        case 'sm':
          return 'text-xs'
        case 'lg':
          return 'text-base'
        default:
          return 'text-sm'
      }
    })

    const handleSort = (column: TableColumn) => {
      if (!column.sortable) {
        return
      }

      if (sortField.value === column.key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortField.value = column.key
        sortOrder.value = 'asc'
      }

      emit('sort-change', { field: sortField.value, order: sortOrder.value })
    }

    const handleRowClick = (record: any, index: number) => {
      emit('row-click', record, index)
    }

    const handleRowDblclick = (record: any, index: number) => {
      emit('row-dblclick', record, index)
    }

    const handleSelect = (record: any, selected: boolean) => {
      const rowKey = getRowKey(record, props.data.indexOf(record))
      const newSelectedKeys = [...selectedRowKeys.value]

      if (selected) {
        if (!newSelectedKeys.includes(rowKey)) {
          newSelectedKeys.push(rowKey)
        }
      } else {
        const index = newSelectedKeys.indexOf(rowKey)
        if (index > -1) {
          newSelectedKeys.splice(index, 1)
        }
      }

      selectedRowKeys.value = newSelectedKeys

      if (props.rowSelection?.onChange) {
        const selectedRows = props.data.filter(row => 
          newSelectedKeys.includes(getRowKey(row, props.data.indexOf(row)))
        )
        props.rowSelection.onChange(newSelectedKeys, selectedRows)
      }
    }

    const handleSelectAll = (selected: boolean) => {
      const newSelectedKeys = selected
        ? props.data.map((record, index) => getRowKey(record, index))
        : []

      selectedRowKeys.value = newSelectedKeys

      if (props.rowSelection?.onChange) {
        props.rowSelection.onChange(newSelectedKeys, selected ? [...props.data] : [])
      }
    }

    const handleExpand = (record: any, expanded: boolean) => {
      const rowKey = getRowKey(record, props.data.indexOf(record))
      const newExpandedKeys = [...expandedRowKeys.value]

      if (expanded) {
        if (!newExpandedKeys.includes(rowKey)) {
          newExpandedKeys.push(rowKey)
        }
      } else {
        const index = newExpandedKeys.indexOf(rowKey)
        if (index > -1) {
          newExpandedKeys.splice(index, 1)
        }
      }

      expandedRowKeys.value = newExpandedKeys

      if (props.expandable?.onChange) {
        props.expandable.onChange(newExpandedKeys)
      }
    }

    const isRowSelected = (record: any) => {
      const rowKey = getRowKey(record, props.data.indexOf(record))
      return selectedRowKeys.value.includes(rowKey)
    }

    const isRowExpanded = (record: any) => {
      const rowKey = getRowKey(record, props.data.indexOf(record))
      return expandedRowKeys.value.includes(rowKey)
    }

    const isAllSelected = computed(() => {
      if (props.data.length === 0) {
        return false
      }
      return props.data.every(record => isRowSelected(record))
    })

    const isIndeterminate = computed(() => {
      if (isAllSelected.value) {
        return false
      }
      return props.data.some(record => isRowSelected(record))
    })

    return () => (
      <div class="w-full">
        <div
          class={cn(
            'relative w-full overflow-auto',
            props.bordered && 'border border-neutral-200 rounded-lg',
            sizeClasses.value
          )}
          style={props.scroll ? { maxHeight: typeof props.scroll.y === 'number' ? `${props.scroll.y}px` : props.scroll.y } : {}}
        >
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-neutral-50 border-b border-neutral-200">
                {props.rowSelection && (
                  <th class="w-12 px-4 py-3 text-left font-semibold text-neutral-700">
                    <input
                      type={props.rowSelection.type === 'radio' ? 'radio' : 'checkbox'}
                      checked={isAllSelected.value}
                      indeterminate={isIndeterminate.value}
                      class="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                      onChange={(e: Event) => handleSelectAll((e.target as HTMLInputElement).checked)}
                    />
                  </th>
                )}
                {props.expandable && (
                  <th class="w-12 px-4 py-3 text-left font-semibold text-neutral-700">
                  </th>
                )}
                {props.columns.map(column => (
                  <th
                    key={column.key}
                    class={cn(
                      'px-4 py-3 text-left font-semibold text-neutral-700 whitespace-nowrap',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right',
                      column.sortable && 'cursor-pointer hover:bg-neutral-100 transition-colors'
                    )}
                    style={{ width: column.width }}
                    onClick={() => handleSort(column)}
                  >
                    <div class="flex items-center gap-2">
                      <span>{column.title}</span>
                      {column.sortable && sortField.value === column.key && (
                        <span>
                          {sortOrder.value === 'asc' ? (
                            <ChevronUp size={14} class="text-primary-600" />
                          ) : (
                            <ChevronDown size={14} class="text-primary-600" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {props.loading ? (
                <tr>
                  <td colSpan={props.columns.length + (props.rowSelection ? 1 : 0) + (props.expandable ? 1 : 0)} class="px-4 py-8 text-center">
                    <div class="flex items-center justify-center">
                      <svg class="animate-spin h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </td>
                </tr>
              ) : props.data.length === 0 ? (
                <tr>
                  <td colSpan={props.columns.length + (props.rowSelection ? 1 : 0) + (props.expandable ? 1 : 0)} class="px-4 py-8 text-center text-neutral-500">
                    暂无数据
                  </td>
                </tr>
              ) : (
                props.data.map((record, index) => (
                  <tr
                    key={getRowKey(record, index)}
                    class={cn(
                      'border-b border-neutral-100 transition-colors',
                      props.hoverable && 'hover:bg-neutral-50',
                      props.striped && index % 2 === 0 && 'bg-neutral-50',
                      isRowSelected(record) && 'bg-primary-50'
                    )}
                    onClick={() => handleRowClick(record, index)}
                    onDblclick={() => handleRowDblclick(record, index)}
                  >
                    {props.rowSelection && (
                      <td class="px-4 py-3">
                        <input
                          type={props.rowSelection.type === 'radio' ? 'radio' : 'checkbox'}
                          checked={isRowSelected(record)}
                          class="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                          onChange={(e: Event) => handleSelect(record, (e.target as HTMLInputElement).checked)}
                        />
                      </td>
                    )}
                    {props.expandable && (
                      <td class="px-4 py-3">
                        <button
                          class="w-8 h-8 flex items-center justify-center rounded hover:bg-neutral-100 transition-colors"
                          onClick={() => handleExpand(record, !isRowExpanded(record))}
                        >
                          {isRowExpanded(record) ? (
                            <ChevronUp size={16} class="text-neutral-600" />
                          ) : (
                            <ChevronDown size={16} class="text-neutral-600" />
                          )}
                        </button>
                      </td>
                    )}
                    {props.columns.map(column => (
                      <td
                        key={column.key}
                        class={cn(
                          'px-4 py-3 whitespace-nowrap',
                          column.align === 'center' && 'text-center',
                          column.align === 'right' && 'text-right'
                        )}
                      >
                        {getCellValue(record, column)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {props.expandable && props.data.some(record => isRowExpanded(record)) && (
          <div class="mt-2">
            {props.data.map((record, index) => {
              if (!isRowExpanded(record)) {
                return null
              }
              return (
                <div key={`expanded-${getRowKey(record, index)}`} class="p-4 bg-neutral-50 rounded-lg">
                  {props.expandable?.expandedRowRender?.(record, index)}
                </div>
              )
            })}
          </div>
        )}

        {props.pagination && typeof props.pagination === 'object' && (
          <div class="mt-4 flex justify-end">
            <Pagination
              currentPage={props.pagination.current}
              pageSize={props.pagination.pageSize}
              total={props.pagination.total}
              onChange={(page: number, pageSize: number) => emit('change', { pagination: { current: page, pageSize } })}
            />
          </div>
        )}
      </div>
    )
  },
})
