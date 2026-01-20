/**
 * @fileoverview Alert组件单元测试
 * @description 测试Alert组件的功能
 * @module Alert.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Alert, AlertTitle, AlertDescription } from '@/components/UI/Alert'

describe('Alert组件', () => {
  it('应该正确渲染默认警告', () => {
    const wrapper = mount(Alert, {
      slots: {
        default: '这是一条警告'
      }
    })

    expect(wrapper.text()).toBe('这是一条警告')
    expect(wrapper.classes()).toContain('bg-white')
    expect(wrapper.classes()).toContain('border-neutral-200')
  })

  it('应该正确渲染信息警告', () => {
    const wrapper = mount(Alert, {
      props: {
        variant: 'info'
      },
      slots: {
        default: '这是一条信息'
      }
    })

    expect(wrapper.classes()).toContain('bg-blue-50')
    expect(wrapper.classes()).toContain('border-blue-200')
  })

  it('应该正确渲染成功警告', () => {
    const wrapper = mount(Alert, {
      props: {
        variant: 'success'
      },
      slots: {
        default: '这是一条成功信息'
      }
    })

    expect(wrapper.classes()).toContain('bg-green-50')
    expect(wrapper.classes()).toContain('border-green-200')
  })

  it('应该正确渲染警告警告', () => {
    const wrapper = mount(Alert, {
      props: {
        variant: 'warning'
      },
      slots: {
        default: '这是一条警告信息'
      }
    })

    expect(wrapper.classes()).toContain('bg-yellow-50')
    expect(wrapper.classes()).toContain('border-yellow-200')
  })

  it('应该正确渲染错误警告', () => {
    const wrapper = mount(Alert, {
      props: {
        variant: 'danger'
      },
      slots: {
        default: '这是一条错误信息'
      }
    })

    expect(wrapper.classes()).toContain('bg-red-50')
    expect(wrapper.classes()).toContain('border-red-200')
  })

  it('应该正确显示图标', () => {
    const wrapper = mount(Alert, {
      props: {
        showIcon: true
      },
      slots: {
        default: '带图标的警告'
      }
    })

    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('应该正确隐藏图标', () => {
    const wrapper = mount(Alert, {
      props: {
        showIcon: false
      },
      slots: {
        default: '不带图标的警告'
      }
    })

    expect(wrapper.find('svg').exists()).toBe(false)
  })

  it('应该正确显示关闭按钮', () => {
    const wrapper = mount(Alert, {
      props: {
        closable: true
      },
      slots: {
        default: '可关闭的警告'
      }
    })

    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('应该正确触发关闭事件', async () => {
    const onClose = vi.fn()
    const wrapper = mount(Alert, {
      props: {
        closable: true,
        onClose
      },
      slots: {
        default: '可关闭的警告'
      }
    })

    const closeButton = wrapper.find('button')
    await closeButton.trigger('click')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('应该正确应用横幅样式', () => {
    const wrapper = mount(Alert, {
      props: {
        banner: true
      },
      slots: {
        default: '横幅警告'
      }
    })

    expect(wrapper.classes()).toContain('rounded-none')
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(Alert, {
      props: {
        className: 'custom-alert'
      },
      slots: {
        default: '自定义警告'
      }
    })

    expect(wrapper.classes()).toContain('custom-alert')
  })
})

describe('AlertTitle组件', () => {
  it('应该正确渲染警告标题', () => {
    const wrapper = mount(AlertTitle, {
      slots: {
        default: '警告标题'
      }
    })

    expect(wrapper.text()).toBe('警告标题')
    expect(wrapper.classes()).toContain('font-semibold')
  })
})

describe('AlertDescription组件', () => {
  it('应该正确渲染警告描述', () => {
    const wrapper = mount(AlertDescription, {
      slots: {
        default: '警告描述内容'
      }
    })

    expect(wrapper.text()).toBe('警告描述内容')
    expect(wrapper.classes()).toContain('text-sm')
  })
})

describe('Alert组合使用', () => {
  it('应该正确组合使用Alert子组件', () => {
    const wrapper = mount(Alert, {
      props: {
        variant: 'warning',
        showIcon: true
      },
      slots: {
        default: (
          <>
            <AlertTitle>警告标题</AlertTitle>
            <AlertDescription>警告描述内容</AlertDescription>
          </>
        )
      }
    })

    expect(wrapper.text()).toContain('警告标题')
    expect(wrapper.text()).toContain('警告描述内容')
  })
})
