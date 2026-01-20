/**
 * @fileoverview Tree组件单元测试
 * @description 测试Tree组件的功能
 * @module Tree.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Tree, TreeNode } from '@/components/UI/Tree'

describe('Tree组件', () => {
  const treeData = [
    {
      key: '1',
      title: '节点一',
      children: [
        { key: '1-1', title: '子节点一' },
        { key: '1-2', title: '子节点二' },
      ]
    },
    {
      key: '2',
      title: '节点二',
      children: [
        { key: '2-1', title: '子节点三' },
        { key: '2-2', title: '子节点四' },
      ]
    },
    {
      key: '3',
      title: '节点三',
    },
  ]

  it('应该正确渲染默认树', () => {
    const wrapper = mount(Tree, {
      props: {
        data: treeData
      }
    })

    expect(wrapper.text()).toContain('节点一')
    expect(wrapper.text()).toContain('节点二')
    expect(wrapper.text()).toContain('节点三')
  })

  it('应该正确渲染展开状态', () => {
    const wrapper = mount(Tree, {
      props: {
        data: treeData,
        defaultExpandedKeys: ['1', '2']
      }
    })

    expect(wrapper.text()).toContain('子节点一')
    expect(wrapper.text()).toContain('子节点二')
  })

  it('应该正确渲染选中状态', () => {
    const wrapper = mount(Tree, {
      props: {
        data: treeData,
        defaultSelectedKeys: ['1']
      }
    })

    expect(wrapper.classes()).toContain('selected')
  })

  it('应该正确渲染勾选状态', () => {
    const wrapper = mount(Tree, {
      props: {
        data: treeData,
        checkable: true,
        defaultCheckedKeys: ['1']
      }
    })

    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
  })

  it('应该正确渲染禁用状态', () => {
    const wrapper = mount(Tree, {
      props: {
        data: treeData,
        disabled: true
      }
    })

    expect(wrapper.classes()).toContain('opacity-50')
  })

  it('应该正确渲染可拖拽', () => {
    const wrapper = mount(Tree, {
      props: {
        data: treeData,
        draggable: true
      }
    })

    expect(wrapper.classes()).toContain('draggable')
  })

  it('应该正确渲染显示图标', () => {
    const wrapper = mount(Tree, {
      props: {
        data: treeData,
        showIcon: true
      }
    })

    expect(wrapper.find('.tree-icon').exists()).toBe(true)
  })

  it('应该正确渲染显示连线', () => {
    const wrapper = mount(Tree, {
      props: {
        data: treeData,
        showLine: true
      }
    })

    expect(wrapper.classes()).toContain('show-line')
  })

  it('应该正确触发select事件', async () => {
    const onSelect = vi.fn()
    const wrapper = mount(Tree, {
      props: {
        data: treeData,
        onSelect
      }
    })

    const node = wrapper.find('.tree-node')
    await node.trigger('click')
    expect(onSelect).toHaveBeenCalled()
  })

  it('应该正确触发check事件', async () => {
    const onCheck = vi.fn()
    const wrapper = mount(Tree, {
      props: {
        data: treeData,
        checkable: true,
        onCheck
      }
    })

    const checkbox = wrapper.find('input[type="checkbox"]')
    await checkbox.setChecked(true)
    expect(onCheck).toHaveBeenCalled()
  })

  it('应该正确触发expand事件', async () => {
    const onExpand = vi.fn()
    const wrapper = mount(Tree, {
      props: {
        data: treeData,
        onExpand
      }
    })

    const expandButton = wrapper.find('.tree-expand-button')
    await expandButton.trigger('click')
    expect(onExpand).toHaveBeenCalled()
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(Tree, {
      props: {
        className: 'custom-tree',
        data: treeData
      }
    })

    expect(wrapper.classes()).toContain('custom-tree')
  })
})

describe('TreeNode组件', () => {
  it('应该正确渲染树节点', () => {
    const wrapper = mount(TreeNode, {
      props: {
        title: '节点标题'
      }
    })

    expect(wrapper.text()).toContain('节点标题')
  })

  it('应该正确渲染禁用状态', () => {
    const wrapper = mount(TreeNode, {
      props: {
        title: '禁用节点',
        disabled: true
      }
    })

    expect(wrapper.classes()).toContain('opacity-50')
  })

  it('应该正确渲染选中状态', () => {
    const wrapper = mount(TreeNode, {
      props: {
        title: '选中节点',
        selected: true
      }
    })

    expect(wrapper.classes()).toContain('selected')
  })

  it('应该正确渲染展开状态', () => {
    const wrapper = mount(TreeNode, {
      props: {
        title: '展开节点',
        expanded: true
      }
    })

    expect(wrapper.classes()).toContain('expanded')
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(TreeNode, {
      props: {
        className: 'custom-node',
        title: '自定义节点'
      }
    })

    expect(wrapper.classes()).toContain('custom-node')
  })
})
