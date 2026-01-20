/**
 * @fileoverview Switch组件单元测试
 * @description 测试Switch组件的功能
 * @module Switch.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Switch } from '@/components/UI/Switch'

describe('Switch组件', () => {
  it('应该正确渲染默认开关', () => {
    const wrapper = mount(Switch, {
      props: {
        modelValue: false
      }
    })

    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('应该正确绑定v-model', async () => {
    const wrapper = mount(Switch, {
      props: {
        modelValue: false
      }
    })

    const button = wrapper.find('button')
    await button.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])
  })

  it('应该正确渲染选中状态', () => {
    const wrapper = mount(Switch, {
      props: {
        modelValue: true
      }
    })

    expect(wrapper.classes()).toContain('bg-primary-600')
  })

  it('应该正确渲染未选中状态', () => {
    const wrapper = mount(Switch, {
      props: {
        modelValue: false
      }
    })

    expect(wrapper.classes()).toContain('bg-neutral-200')
  })

  it('应该正确渲染禁用状态', () => {
    const wrapper = mount(Switch, {
      props: {
        disabled: true,
        modelValue: false
      }
    })

    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('opacity-50')
  })

  it('应该正确渲染加载状态', () => {
    const wrapper = mount(Switch, {
      props: {
        loading: true,
        modelValue: false
      }
    })

    expect(wrapper.find('.animate-spin').exists()).toBe(true)
  })

  it('应该正确渲染小型开关', () => {
    const wrapper = mount(Switch, {
      props: {
        size: 'sm',
        modelValue: false
      }
    })

    expect(wrapper.classes()).toContain('h-6')
    expect(wrapper.classes()).toContain('w-10')
  })

  it('应该正确渲染大型开关', () => {
    const wrapper = mount(Switch, {
      props: {
        size: 'lg',
        modelValue: false
      }
    })

    expect(wrapper.classes()).toContain('h-8')
    expect(wrapper.classes()).toContain('w-14')
  })

  it('应该正确渲染主要颜色', () => {
    const wrapper = mount(Switch, {
      props: {
        color: 'primary',
        modelValue: true
      }
    })

    expect(wrapper.classes()).toContain('bg-primary-600')
  })

  it('应该正确渲染成功颜色', () => {
    const wrapper = mount(Switch, {
      props: {
        color: 'success',
        modelValue: true
      }
    })

    expect(wrapper.classes()).toContain('bg-success-600')
  })

  it('应该正确渲染警告颜色', () => {
    const wrapper = mount(Switch, {
      props: {
        color: 'warning',
        modelValue: true
      }
    })

    expect(wrapper.classes()).toContain('bg-warning-600')
  })

  it('应该正确渲染危险颜色', () => {
    const wrapper = mount(Switch, {
      props: {
        color: 'danger',
        modelValue: true
      }
    })

    expect(wrapper.classes()).toContain('bg-danger-600')
  })

  it('应该正确渲染选中文字', () => {
    const wrapper = mount(Switch, {
      props: {
        checkedText: '开启',
        uncheckedText: '关闭',
        modelValue: true
      }
    })

    expect(wrapper.text()).toContain('开启')
  })

  it('应该正确渲染未选中文字', () => {
    const wrapper = mount(Switch, {
      props: {
        checkedText: '开启',
        uncheckedText: '关闭',
        modelValue: false
      }
    })

    expect(wrapper.text()).toContain('关闭')
  })

  it('应该正确触发change事件', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Switch, {
      props: {
        modelValue: false,
        onChange
      }
    })

    const button = wrapper.find('button')
    await button.trigger('click')
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('禁用状态下不应该触发change事件', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Switch, {
      props: {
        disabled: true,
        modelValue: false,
        onChange
      }
    })

    const button = wrapper.find('button')
    await button.trigger('click')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(Switch, {
      props: {
        className: 'custom-switch',
        modelValue: false
      }
    })

    expect(wrapper.classes()).toContain('custom-switch')
  })
})
