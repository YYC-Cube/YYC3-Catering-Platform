/**
 * @fileoverview YYC³餐饮行业智能化平台 - 树形组件
 * @description 统一的树形组件，支持展开、选择、拖拽等功能
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { defineComponent, ref, computed, type PropType } from 'vue'
import { cn } from '@/utils/cn'
import { ChevronRight, ChevronDown, Minus, Square, CheckSquare } from 'lucide-vue-next'

export interface TreeNode {
  id: string | number
  title: string
  key?: string
  children?: TreeNode[]
  disabled?: boolean
  selectable?: boolean
  checkable?: boolean
  isLeaf?: boolean
  icon?: any
  extra?: any
  data?: any
}

export const Tree = defineComponent({
  name: 'Tree',
  props: {
    treeData: {
      type: Array as PropType<TreeNode[]>,
      default: () => [],
    },
    expandedKeys: {
      type: Array as PropType<(string | number)[]>,
      default: () => [],
    },
    selectedKeys: {
      type: Array as PropType<(string | number)[]>,
      default: () => [],
    },
    checkedKeys: {
      type: Array as PropType<(string | number)[]>,
      default: () => [],
    },
    checkable: {
      type: Boolean,
      default: false,
    },
    selectable: {
      type: Boolean,
      default: true,
    },
    showLine: {
      type: Boolean,
      default: false,
    },
    showIcon: {
      type: Boolean,
      default: false,
    },
    draggable: {
      type: Boolean,
      default: false,
    },
    defaultExpandAll: {
      type: Boolean,
      default: false,
    },
    defaultExpandParent: {
      type: Boolean,
      default: false,
    },
    blockNode: {
      type: Boolean,
      default: false,
    },
    virtual: {
      type: Boolean,
      default: false,
    },
    height: {
      type: Number,
      default: undefined,
    },
  },
  emits: ['expand', 'select', 'check', 'drop', 'drag-start', 'drag-over', 'drag-leave', 'drag-end'],
  setup(props, { emit, slots }) {
    const internalExpandedKeys = ref<(string | number)[]>([...props.expandedKeys])
    const internalSelectedKeys = ref<(string | number)[]>([...props.selectedKeys])
    const internalCheckedKeys = ref<(string | number)[]>([...props.checkedKeys])

    const flattenNodes = (nodes: TreeNode[]): TreeNode[] => {
      const result: TreeNode[] = []
      const traverse = (items: TreeNode[]) => {
        items.forEach(item => {
          result.push(item)
          if (item.children) {
            traverse(item.children)
          }
        })
      }
      traverse(nodes)
      return result
    }

    const isExpanded = (key: string | number) => {
      return internalExpandedKeys.value.includes(key)
    }

    const isSelected = (key: string | number) => {
      return internalSelectedKeys.value.includes(key)
    }

    const isChecked = (key: string | number) => {
      return internalCheckedKeys.value.includes(key)
    }

    const isIndeterminate = (node: TreeNode) => {
      if (!node.children || node.children.length === 0) {
        return false
      }

      const allChildren = getAllChildrenKeys(node)
      const checkedChildren = allChildren.filter(key => internalCheckedKeys.value.includes(key))

      return checkedChildren.length > 0 && checkedChildren.length < allChildren.length
    }

    const getAllChildrenKeys = (node: TreeNode): (string | number)[] => {
      const keys: (string | number)[] = []
      const traverse = (item: TreeNode) => {
        keys.push(item.id)
        if (item.children) {
          item.children.forEach(child => traverse(child))
        }
      }
      traverse(node)
      return keys
    }

    const handleExpand = (node: TreeNode) => {
      const key = node.key || node.id
      const index = internalExpandedKeys.value.indexOf(key)

      if (index > -1) {
        internalExpandedKeys.value.splice(index, 1)
      } else {
        internalExpandedKeys.value.push(key)
      }

      emit('expand', internalExpandedKeys.value, { node, expanded: index === -1 })
    }

    const handleSelect = (node: TreeNode) => {
      if (!props.selectable || node.disabled || node.selectable === false) {
        return
      }

      const key = node.key || node.id
      internalSelectedKeys.value = [key]
      emit('select', [key], { node, selected: true })
    }

    const handleCheck = (node: TreeNode, checked: boolean) => {
      if (!props.checkable || node.disabled || node.checkable === false) {
        return
      }

      const key = node.key || node.id
      const index = internalCheckedKeys.value.indexOf(key)

      if (checked) {
        if (index === -1) {
          internalCheckedKeys.value.push(key)
        }
        if (node.children) {
          const childrenKeys = getAllChildrenKeys(node)
          childrenKeys.forEach(childKey => {
            if (!internalCheckedKeys.value.includes(childKey)) {
              internalCheckedKeys.value.push(childKey)
            }
          })
        }
      } else {
        if (index > -1) {
          internalCheckedKeys.value.splice(index, 1)
        }
        if (node.children) {
          const childrenKeys = getAllChildrenKeys(node)
          childrenKeys.forEach(childKey => {
            const childIndex = internalCheckedKeys.value.indexOf(childKey)
            if (childIndex > -1) {
              internalCheckedKeys.value.splice(childIndex, 1)
            }
          })
        }
      }

      emit('check', internalCheckedKeys.value, { node, checked })
    }

    const renderTreeNode = (node: TreeNode, level: number = 0) => {
      const key = node.key || node.id
      const expanded = isExpanded(key)
      const selected = isSelected(key)
      const checked = isChecked(key)
      const indeterminate = isIndeterminate(node)

      return (
        <div key={key} class="tree-node">
          <div
            class={cn(
              'flex items-center gap-2 py-1.5 transition-colors',
              !node.disabled && 'hover:bg-neutral-100 cursor-pointer',
              node.disabled && 'opacity-50 cursor-not-allowed',
              selected && 'bg-primary-50',
              props.blockNode && 'w-full'
            )}
            style={{ paddingLeft: `${level * 20}px` }}
            onClick={() => handleSelect(node)}
          >
            {node.children && node.children.length > 0 && (
              <button
                type="button"
                class="w-5 h-5 flex items-center justify-center hover:bg-neutral-200 rounded transition-colors"
                onClick={(e: Event) => {
                  e.stopPropagation()
                  handleExpand(node)
                }}
              >
                {expanded ? (
                  <ChevronDown size={16} class="text-neutral-600" />
                ) : (
                  <ChevronRight size={16} class="text-neutral-600" />
                )}
              </button>
            )}
            {!node.children && <div class="w-5 h-5" />}
            {props.checkable && (
              <button
                type="button"
                class="w-5 h-5 flex items-center justify-center hover:bg-neutral-200 rounded transition-colors"
                onClick={(e: Event) => {
                  e.stopPropagation()
                  handleCheck(node, !checked)
                }}
              >
                {indeterminate ? (
                  <Minus size={16} class="text-neutral-600" />
                ) : checked ? (
                  <CheckSquare size={16} class="text-primary-600" />
                ) : (
                  <Square size={16} class="text-neutral-400" />
                )}
              </button>
            )}
            {props.showIcon && node.icon && (
              <node.icon size={16} class="text-neutral-600" />
            )}
            <span class="flex-1 truncate">{node.title}</span>
            {node.extra && (
              <div class="flex-shrink-0">
                {node.extra}
              </div>
            )}
          </div>
          {expanded && node.children && node.children.length > 0 && (
            <div class="tree-children">
              {node.children.map(child => renderTreeNode(child, level + 1))}
            </div>
          )}
        </div>
      )
    }

    return () => (
      <div
        class={cn(
          'w-full',
          props.showLine && 'tree-show-line'
        )}
        style={props.height ? { height: `${props.height}px`, overflow: 'auto' } : {}}
      >
        {props.treeData.length === 0 ? (
          <div class="flex items-center justify-center py-8 text-neutral-500">
            暂无数据
          </div>
        ) : (
          props.treeData.map(node => renderTreeNode(node))
        )}
      </div>
    )
  },
})
