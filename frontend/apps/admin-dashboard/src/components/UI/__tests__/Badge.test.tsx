/**
 * @fileoverview Badge组件单元测试
 * @description 测试Badge组件的功能
 * @module Badge.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Badge } from '@/components/UI/Badge'

describe('Badge组件', () => {
  it('应该正确渲染默认徽章', () => {
    const wrapper = mount(Badge, {
      slots: {
        default: '徽章'
      }
    })

    expect(wrapper.text()).toBe('徽章')
    expect(wrapper.classes()).toContain('bg-primary-600')
  })

  it('应该正确渲染主要徽章', () => {
    const wrapper = mount(Badge, {
      props: {
        variant: 'primary'
      },
      slots: {
        default: '主要'
      }
    })

    expect(wrapper.classes()).toContain('bg-primary-600')
  })

  it('应该正确渲染成功徽章', () => {
    const wrapper = mount(Badge, {
      props: {
        variant: 'success'
      },
      slots: {
        default: '成功'
      }
    })

    expect(wrapper.classes()).toContain('bg-success-600')
  })

  it('应该正确渲染警告徽章', () => {
    const wrapper = mount(Badge, {
      props: {
        variant: 'warning'
      },
      slots: {
        default: '警告'
      }
    })

    expect(wrapper.classes()).toContain('bg-warning-600')
  })

  it('应该正确渲染危险徽章', () => {
    const wrapper = mount(Badge, {
      props: {
        variant: 'danger'
      },
      slots: {
        default: '危险'
      }
    })

    expect(wrapper.classes()).toContain('bg-danger-600')
  })

  it('应该正确渲染小型徽章', () => {
    const wrapper = mount(Badge, {
      props: {
        size: 'sm'
      },
      slots: {
        default: '小型'
      }
    })

    expect(wrapper.classes()).toContain('px-2')
    expect(wrapper.classes()).toContain('py-0.5')
    expect(wrapper.classes()).toContain('text-xs')
  })

  it('应该正确渲染大型徽章', () => {
    const wrapper = mount(Badge, {
      props: {
        size: 'lg'
      },
      slots: {
        default: '大型'
      }
    })

    expect(wrapper.classes()).toContain('px-3')
    expect(wrapper.classes()).toContain('py-1.5')
    expect(wrapper.classes()).toContain('text-base')
  })

  it('应该正确渲染圆形徽章', () => {
    const wrapper = mount(Badge, {
      props: {
        rounded: 'full'
      },
      slots: {
        default: '圆形'
      }
    })

    expect(wrapper.classes()).toContain('rounded-full')
  })

  it('应该正确渲染计数徽章', () => {
    const wrapper = mount(Badge, {
      props: {
        count: 5
      },
      slots: {
        default: '消息'
      }
    })

    expect(wrapper.text()).toContain('5')
    expect(wrapper.text()).toContain('消息')
  })

  it('应该正确渲染超过最大值的计数', () => {
    const wrapper = mount(Badge, {
      props: {
        count: 100,
        maxCount: 99
      },
      slots: {
        default: '通知'
      }
    })

    expect(wrapper.text()).toContain('99+')
  })

  it('应该正确渲染点状徽章', () => {
    const wrapper = mount(Badge, {
      props: {
        dot: true
      },
      slots: {
        default: '内容'
      }
    })

    expect(wrapper.find('.rounded-full').exists()).toBe(true)
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(Badge, {
      props: {
        className: 'custom-badge'
      },
      slots: {
        default: '自定义'
      }
    })

    expect(wrapper.classes()).toContain('custom-badge')
  })
})
