/**
 * @fileoverview Checkbox组件单元测试
 * @description 测试Checkbox组件的功能
 * @module Checkbox.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Checkbox, CheckboxGroup } from '@/components/UI/Checkbox'

describe('Checkbox组件', () => {
  it('应该正确渲染默认复选框', () => {
    const wrapper = mount(Checkbox, {
      props: {
        label: '复选框'
      }
    })

    expect(wrapper.text()).toContain('复选框')
  })

  it('应该正确绑定v-model', async () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: true,
        label: '已选中'
      }
    })

    const checkbox = wrapper.find('input[type="checkbox"]')
    expect(checkbox.element.checked).toBe(true)

    await checkbox.setChecked(false)
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('应该正确渲染禁用状态', () => {
    const wrapper = mount(Checkbox, {
      props: {
        disabled: true,
        label: '禁用'
      }
    })

    const checkbox = wrapper.find('input[type="checkbox"]')
    expect(checkbox.attributes('disabled')).toBeDefined()
  })

  it('应该正确渲染只读状态', () => {
    const wrapper = mount(Checkbox, {
      props: {
        readonly: true,
        label: '只读'
      }
    })

    const checkbox = wrapper.find('input[type="checkbox"]')
    expect(checkbox.attributes('readonly')).toBeDefined()
  })

  it('应该正确渲染小型复选框', () => {
    const wrapper = mount(Checkbox, {
      props: {
        size: 'sm',
        label: '小型'
      }
    })

    expect(wrapper.classes()).toContain('h-4')
    expect(wrapper.classes()).toContain('w-4')
  })

  it('应该正确渲染大型复选框', () => {
    const wrapper = mount(Checkbox, {
      props: {
        size: 'lg',
        label: '大型'
      }
    })

    expect(wrapper.classes()).toContain('h-6')
    expect(wrapper.classes()).toContain('w-6')
  })

  it('应该正确渲染错误状态', () => {
    const wrapper = mount(Checkbox, {
      props: {
        error: true,
        label: '错误'
      }
    })

    expect(wrapper.classes()).toContain('border-danger-500')
  })

  it('应该正确渲染半选状态', () => {
    const wrapper = mount(Checkbox, {
      props: {
        indeterminate: true,
        label: '半选'
      }
    })

    expect(wrapper.classes()).toContain('indeterminate')
  })

  it('应该正确触发change事件', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Checkbox, {
      props: {
        onChange,
        label: '复选框'
      }
    })

    const checkbox = wrapper.find('input[type="checkbox"]')
    await checkbox.setChecked(true)
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(Checkbox, {
      props: {
        className: 'custom-checkbox',
        label: '自定义'
      }
    })

    expect(wrapper.classes()).toContain('custom-checkbox')
  })
})

describe('CheckboxGroup组件', () => {
  const options = [
    { label: '选项一', value: 'option1' },
    { label: '选项二', value: 'option2' },
    { label: '选项三', value: 'option3' },
  ]

  it('应该正确渲染复选框组', () => {
    const wrapper = mount(CheckboxGroup, {
      props: {
        options
      }
    })

    expect(wrapper.findAll('input[type="checkbox"]').length).toBe(3)
  })

  it('应该正确绑定v-model', async () => {
    const wrapper = mount(CheckboxGroup, {
      props: {
        modelValue: ['option1', 'option2'],
        options
      }
    })

    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    expect(checkboxes[0].element.checked).toBe(true)
    expect(checkboxes[1].element.checked).toBe(true)
    expect(checkboxes[2].element.checked).toBe(false)
  })

  it('应该正确渲染禁用状态', () => {
    const wrapper = mount(CheckboxGroup, {
      props: {
        disabled: true,
        options
      }
    })

    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    checkboxes.forEach(checkbox => {
      expect(checkbox.attributes('disabled')).toBeDefined()
    })
  })

  it('应该正确渲染垂直方向', () => {
    const wrapper = mount(CheckboxGroup, {
      props: {
        direction: 'vertical',
        options
      }
    })

    expect(wrapper.classes()).toContain('flex-col')
  })

  it('应该正确渲染水平方向', () => {
    const wrapper = mount(CheckboxGroup, {
      props: {
        direction: 'horizontal',
        options
      }
    })

    expect(wrapper.classes()).toContain('flex-row')
  })

  it('应该正确触发change事件', async () => {
    const onChange = vi.fn()
    const wrapper = mount(CheckboxGroup, {
      props: {
        options,
        onChange
      }
    })

    const checkbox = wrapper.find('input[type="checkbox"]')
    await checkbox.setChecked(true)
    expect(onChange).toHaveBeenCalled()
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(CheckboxGroup, {
      props: {
        className: 'custom-group',
        options
      }
    })

    expect(wrapper.classes()).toContain('custom-group')
  })
})
