/**
 * @fileoverview Dropdown组件单元测试
 * @description 测试Dropdown组件的功能
 * @module Dropdown.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Dropdown, DropdownMenu, DropdownItem, DropdownDivider } from '@/components/UI/Dropdown'

describe('Dropdown组件', () => {
  const items = [
    { label: '选项一', value: 'option1' },
    { label: '选项二', value: 'option2' },
    { label: '选项三', value: 'option3' },
  ]

  it('应该正确渲染默认下拉菜单', () => {
    const wrapper = mount(Dropdown, {
      props: {
        items,
        trigger: <Button>点击打开</Button>
      }
    })

    expect(wrapper.text()).toContain('点击打开')
  })

  it('应该正确渲染禁用状态', () => {
    const wrapper = mount(Dropdown, {
      props: {
        disabled: true,
        items,
        trigger: <Button>禁用</Button>
      }
    })

    expect(wrapper.classes()).toContain('opacity-50')
  })

  it('应该正确渲染触发按钮', () => {
    const wrapper = mount(Dropdown, {
      props: {
        items,
        trigger: <Button>触发按钮</Button>
      }
    })

    expect(wrapper.text()).toContain('触发按钮')
  })

  it('应该正确触发visible-change事件', async () => {
    const onVisibleChange = vi.fn()
    const wrapper = mount(Dropdown, {
      props: {
        items,
        trigger: <Button>点击打开</Button>,
        onVisibleChange
      }
    })

    const trigger = wrapper.find('button')
    await trigger.trigger('click')
    expect(onVisibleChange).toHaveBeenCalled()
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(Dropdown, {
      props: {
        className: 'custom-dropdown',
        items,
        trigger: <Button>自定义</Button>
      }
    })

    expect(wrapper.classes()).toContain('custom-dropdown')
  })
})

describe('DropdownMenu组件', () => {
  it('应该正确渲染下拉菜单', () => {
    const wrapper = mount(DropdownMenu, {
      slots: {
        default: '菜单内容'
      }
    })

    expect(wrapper.text()).toContain('菜单内容')
  })
})

describe('DropdownItem组件', () => {
  it('应该正确渲染菜单项', () => {
    const wrapper = mount(DropdownItem, {
      slots: {
        default: '菜单项'
      }
    })

    expect(wrapper.text()).toContain('菜单项')
  })

  it('应该正确渲染禁用状态', () => {
    const wrapper = mount(DropdownItem, {
      props: {
        disabled: true
      },
      slots: {
        default: '禁用项'
      }
    })

    expect(wrapper.classes()).toContain('opacity-50')
  })

  it('应该正确渲染危险状态', () => {
    const wrapper = mount(DropdownItem, {
      props: {
        danger: true
      },
      slots: {
        default: '危险项'
      }
    })

    expect(wrapper.classes()).toContain('text-danger-600')
  })

  it('应该正确渲染图标', () => {
    const wrapper = mount(DropdownItem, {
      slots: {
        icon: <span>🔥</span>,
        default: '带图标'
      }
    })

    expect(wrapper.text()).toContain('🔥')
  })

  it('应该正确触发click事件', async () => {
    const onClick = vi.fn()
    const wrapper = mount(DropdownItem, {
      props: {
        onClick
      },
      slots: {
        default: '点击项'
      }
    })

    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalled()
  })
})

describe('DropdownDivider组件', () => {
  it('应该正确渲染分割线', () => {
    const wrapper = mount(DropdownDivider)

    expect(wrapper.classes()).toContain('border-t')
  })
})

describe('Dropdown组合使用', () => {
  it('应该正确组合使用Dropdown子组件', () => {
    const wrapper = mount(Dropdown, {
      props: {
        trigger: <Button>点击打开</Button>
      },
      slots: {
        default: (
          <DropdownMenu>
            <DropdownItem>选项一</DropdownItem>
            <DropdownItem>选项二</DropdownItem>
            <DropdownDivider />
            <DropdownItem danger>删除</DropdownItem>
          </DropdownMenu>
        )
      }
    })

    expect(wrapper.text()).toContain('点击打开')
  })
})
