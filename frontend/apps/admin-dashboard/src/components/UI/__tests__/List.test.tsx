/**
 * @fileoverview List组件单元测试
 * @description 测试List组件的功能
 * @module List.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { List, ListItem, ListItemMeta } from '@/components/UI/List'

describe('List组件', () => {
  const data = [
    { title: '项目一', description: '项目一的描述' },
    { title: '项目二', description: '项目二的描述' },
    { title: '项目三', description: '项目三的描述' },
  ]

  it('应该正确渲染默认列表', () => {
    const wrapper = mount(List, {
      props: {
        data,
        renderItem: (item: any) => (
          <ListItem>
            <ListItemMeta title={item.title} description={item.description} />
          </ListItem>
        )
      }
    })

    expect(wrapper.text()).toContain('项目一')
    expect(wrapper.text()).toContain('项目二')
    expect(wrapper.text()).toContain('项目三')
  })

  it('应该正确渲染边框', () => {
    const wrapper = mount(List, {
      props: {
        bordered: true,
        data,
        renderItem: (item: any) => (
          <ListItem>
            <ListItemMeta title={item.title} description={item.description} />
          </ListItem>
        )
      }
    })

    expect(wrapper.classes()).toContain('bordered')
  })

  it('应该正确渲染分割线', () => {
    const wrapper = mount(List, {
      props: {
        split: true,
        data,
        renderItem: (item: any) => (
          <ListItem>
            <ListItemMeta title={item.title} description={item.description} />
          </ListItem>
        )
      }
    })

    expect(wrapper.classes()).toContain('split')
  })

  it('应该正确渲染加载状态', () => {
    const wrapper = mount(List, {
      props: {
        loading: true,
        data,
        renderItem: (item: any) => (
          <ListItem>
            <ListItemMeta title={item.title} description={item.description} />
          </ListItem>
        )
      }
    })

    expect(wrapper.find('.animate-spin').exists()).toBe(true)
  })

  it('应该正确渲染空状态', () => {
    const wrapper = mount(List, {
      props: {
        data: [],
        renderItem: (item: any) => (
          <ListItem>
            <ListItemMeta title={item.title} description={item.description} />
          </ListItem>
        )
      }
    })

    expect(wrapper.text()).toContain('暂无数据')
  })

  it('应该正确渲染分页', () => {
    const wrapper = mount(List, {
      props: {
        pagination: { total: 100, pageSize: 10 },
        data,
        renderItem: (item: any) => (
          <ListItem>
            <ListItemMeta title={item.title} description={item.description} />
          </ListItem>
        )
      }
    })

    expect(wrapper.find('.pagination').exists()).toBe(true)
  })

  it('应该正确触发select事件', async () => {
    const onSelect = vi.fn()
    const wrapper = mount(List, {
      props: {
        data,
        onSelect,
        renderItem: (item: any) => (
          <ListItem>
            <ListItemMeta title={item.title} description={item.description} />
          </ListItem>
        )
      }
    })

    const item = wrapper.find('.list-item')
    await item.trigger('click')
    expect(onSelect).toHaveBeenCalled()
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(List, {
      props: {
        className: 'custom-list',
        data,
        renderItem: (item: any) => (
          <ListItem>
            <ListItemMeta title={item.title} description={item.description} />
          </ListItem>
        )
      }
    })

    expect(wrapper.classes()).toContain('custom-list')
  })
})

describe('ListItem组件', () => {
  it('应该正确渲染列表项', () => {
    const wrapper = mount(ListItem, {
      slots: {
        default: '列表项内容'
      }
    })

    expect(wrapper.text()).toContain('列表项内容')
  })

  it('应该正确渲染禁用状态', () => {
    const wrapper = mount(ListItem, {
      props: {
        disabled: true
      },
      slots: {
        default: '禁用项'
      }
    })

    expect(wrapper.classes()).toContain('opacity-50')
  })

  it('应该正确渲染选中状态', () => {
    const wrapper = mount(ListItem, {
      props: {
        selected: true
      },
      slots: {
        default: '选中项'
      }
    })

    expect(wrapper.classes()).toContain('selected')
  })

  it('应该正确渲染操作按钮', () => {
    const wrapper = mount(ListItem, {
      props: {
        actions: ['编辑', '删除']
      },
      slots: {
        default: '列表项'
      }
    })

    expect(wrapper.text()).toContain('编辑')
    expect(wrapper.text()).toContain('删除')
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(ListItem, {
      props: {
        className: 'custom-item'
      },
      slots: {
        default: '自定义项'
      }
    })

    expect(wrapper.classes()).toContain('custom-item')
  })
})

describe('ListItemMeta组件', () => {
  it('应该正确渲染列表项元数据', () => {
    const wrapper = mount(ListItemMeta, {
      props: {
        title: '标题',
        description: '描述'
      }
    })

    expect(wrapper.text()).toContain('标题')
    expect(wrapper.text()).toContain('描述')
  })

  it('应该正确渲染头像', () => {
    const wrapper = mount(ListItemMeta, {
      props: {
        title: '标题',
        avatar: 'https://example.com/avatar.jpg'
      }
    })

    expect(wrapper.find('img').exists()).toBe(true)
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(ListItemMeta, {
      props: {
        className: 'custom-meta',
        title: '标题'
      }
    })

    expect(wrapper.classes()).toContain('custom-meta')
  })
})
