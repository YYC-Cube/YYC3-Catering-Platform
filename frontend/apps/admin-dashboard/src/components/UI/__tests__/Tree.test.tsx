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

import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { Tree } from '@/components/UI/Tree';

describe('Tree组件', () => {
  const treeData = [
    {
      id: '1',
      title: '节点一',
      children: [
        { id: '1-1', title: '子节点一' },
        { id: '1-2', title: '子节点二' },
      ],
    },
    {
      id: '2',
      title: '节点二',
      children: [
        { id: '2-1', title: '子节点三' },
        { id: '2-2', title: '子节点四' },
      ],
    },
    {
      id: '3',
      title: '节点三',
    },
  ];

  it('应该正确渲染默认树', () => {
    const wrapper = mount(Tree, {
      props: {
        treeData: treeData,
      },
    });

    expect(wrapper.text()).toContain('节点一');
    expect(wrapper.text()).toContain('节点二');
    expect(wrapper.text()).toContain('节点三');
  });

  it('应该正确渲染展开状态', () => {
    const wrapper = mount(Tree, {
      props: {
        treeData: treeData,
        expandedKeys: ['1', '2'],
      },
    });

    expect(wrapper.text()).toContain('子节点一');
    expect(wrapper.text()).toContain('子节点二');
  });

  it('应该正确渲染选中状态', () => {
    const wrapper = mount(Tree, {
      props: {
        treeData: treeData,
        selectedKeys: ['1'],
      },
    });

    expect(wrapper.html()).toContain('bg-primary-50');
  });

  it('应该正确渲染勾选状态', () => {
    const wrapper = mount(Tree, {
      props: {
        treeData: treeData,
        checkable: true,
        checkedKeys: ['1'],
      },
    });

    expect(wrapper.findAll('button').length).toBeGreaterThan(0);
  });

  it('应该正确渲染禁用状态', () => {
    const wrapper = mount(Tree, {
      props: {
        treeData: treeData,
        disabled: true,
      },
    });

    expect(wrapper.classes()).toContain('w-full');
  });

  it('应该正确渲染可拖拽', () => {
    const wrapper = mount(Tree, {
      props: {
        treeData: treeData,
        draggable: true,
      },
    });

    expect(wrapper.classes()).toContain('w-full');
  });

  it('应该正确渲染显示图标', () => {
    const wrapper = mount(Tree, {
      props: {
        treeData: [
          {
            id: '1',
            title: '节点一',
            icon: () => '📁',
          },
        ],
        showIcon: true,
      },
    });

    expect(wrapper.text()).toContain('📁');
  });

  it('应该正确渲染显示连线', () => {
    const wrapper = mount(Tree, {
      props: {
        treeData: treeData,
        showLine: true,
      },
    });

    expect(wrapper.classes()).toContain('tree-show-line');
  });

  it('应该正确触发select事件', async () => {
    const onSelect = vi.fn();
    const wrapper = mount(Tree, {
      props: {
        treeData: treeData,
        onSelect,
      },
    });

    const node = wrapper.find('.tree-node > div');
    await node.trigger('click');
    expect(onSelect).toHaveBeenCalled();
  });

  it('应该正确触发check事件', async () => {
    const onCheck = vi.fn();
    const wrapper = mount(Tree, {
      props: {
        treeData: treeData,
        checkable: true,
        onCheck,
      },
    });

    const checkButton = wrapper.findAll('button')[1];
    await checkButton.trigger('click');
    expect(onCheck).toHaveBeenCalled();
  });

  it('应该正确触发expand事件', async () => {
    const onExpand = vi.fn();
    const wrapper = mount(Tree, {
      props: {
        treeData: treeData,
        onExpand,
      },
    });

    const expandButton = wrapper.find('button');
    await expandButton.trigger('click');
    expect(onExpand).toHaveBeenCalled();
  });

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(Tree, {
      props: {
        className: 'custom-tree',
        treeData: treeData,
      },
    });

    expect(wrapper.classes()).toContain('custom-tree');
  });
});
