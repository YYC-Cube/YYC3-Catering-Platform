/**
 * @fileoverview Tooltip组件单元测试
 * @description 测试Tooltip组件的功能
 * @module Tooltip.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Tooltip } from '@/components/UI/Tooltip'

describe('Tooltip组件', () => {
  it('应该正确渲染默认提示框', () => {
    const wrapper = mount(Tooltip, {
      props: {
        title: '提示内容',
        trigger: <Button>悬停显示</Button>
      }
    })

    expect(wrapper.text()).toContain('悬停显示')
  })

  it('应该正确渲染顶部提示框', () => {
    const wrapper = mount(Tooltip, {
      props: {
        title: '顶部提示',
        placement: 'top',
        trigger: <Button>顶部</Button>
      }
    })

    expect(wrapper.classes()).toContain('top')
  })

  it('应该正确渲染底部提示框', () => {
    const wrapper = mount(Tooltip, {
      props: {
        title: '底部提示',
        placement: 'bottom',
        trigger: <Button>底部</Button>
      }
    })

    expect(wrapper.classes()).toContain('bottom')
  })

  it('应该正确渲染左侧提示框', () => {
    const wrapper = mount(Tooltip, {
      props: {
        title: '左侧提示',
        placement: 'left',
        trigger: <Button>左侧</Button>
      }
    })

    expect(wrapper.classes()).toContain('left')
  })

  it('应该正确渲染右侧提示框', () => {
    const wrapper = mount(Tooltip, {
      props: {
        title: '右侧提示',
        placement: 'right',
        trigger: <Button>右侧</Button>
      }
    })

    expect(wrapper.classes()).toContain('right')
  })

  it('应该正确渲染悬停触发', () => {
    const wrapper = mount(Tooltip, {
      props: {
        title: '悬停提示',
        trigger: 'hover',
        triggerElement: <Button>悬停</Button>
      }
    })

    expect(wrapper.classes()).toContain('hover')
  })

  it('应该正确渲染点击触发', () => {
    const wrapper = mount(Tooltip, {
      props: {
        title: '点击提示',
        trigger: 'click',
        triggerElement: <Button>点击</Button>
      }
    })

    expect(wrapper.classes()).toContain('click')
  })

  it('应该正确渲染聚焦触发', () => {
    const wrapper = mount(Tooltip, {
      props: {
        title: '聚焦提示',
        trigger: 'focus',
        triggerElement: <Button>聚焦</Button>
      }
    })

    expect(wrapper.classes()).toContain('focus')
  })

  it('应该正确渲染禁用状态', () => {
    const wrapper = mount(Tooltip, {
      props: {
        title: '禁用提示',
        disabled: true,
        trigger: <Button>禁用</Button>
      }
    })

    expect(wrapper.classes()).toContain('opacity-50')
  })

  it('应该正确渲染箭头', () => {
    const wrapper = mount(Tooltip, {
      props: {
        title: '带箭头提示',
        arrow: true,
        trigger: <Button>箭头</Button>
      }
    })

    expect(wrapper.find('.tooltip-arrow').exists()).toBe(true)
  })

  it('应该正确渲染延迟显示', () => {
    const wrapper = mount(Tooltip, {
      props: {
        title: '延迟提示',
        delay: 500,
        trigger: <Button>延迟</Button>
      }
    })

    expect(wrapper.classes()).toContain('delay-500')
  })

  it('应该正确触发visible-change事件', async () => {
    const onVisibleChange = vi.fn()
    const wrapper = mount(Tooltip, {
      props: {
        title: '提示内容',
        trigger: 'hover',
        triggerElement: <Button>悬停显示</Button>,
        onVisibleChange
      }
    })

    const triggerElement = wrapper.find('button')
    await triggerElement.trigger('mouseenter')
    expect(onVisibleChange).toHaveBeenCalledWith(true)
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(Tooltip, {
      props: {
        className: 'custom-tooltip',
        title: '自定义提示',
        trigger: <Button>自定义</Button>
      }
    })

    expect(wrapper.classes()).toContain('custom-tooltip')
  })

  it('应该正确渲染富文本内容', () => {
    const wrapper = mount(Tooltip, {
      props: {
        title: <div>
          <strong>加粗</strong>
          <em>斜体</em>
        </div>,
        trigger: <Button>富文本</Button>
      }
    })

    expect(wrapper.find('.tooltip-content').exists()).toBe(true)
  })

  it('应该正确渲染自定义颜色', () => {
    const wrapper = mount(Tooltip, {
      props: {
        title: '自定义颜色提示',
        color: 'primary',
        trigger: <Button>颜色</Button>
      }
    })

    expect(wrapper.classes()).toContain('primary')
  })
})
