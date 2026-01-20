/**
 * @fileoverview Radio组件单元测试
 * @description 测试Radio组件的功能
 * @module Radio.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Radio, RadioGroup } from '@/components/UI/Radio'

describe('Radio组件', () => {
  it('应该正确渲染默认单选框', () => {
    const wrapper = mount(Radio, {
      props: {
        value: 'option1',
        label: '选项一'
      }
    })

    expect(wrapper.text()).toContain('选项一')
  })

  it('应该正确绑定v-model', async () => {
    const wrapper = mount(Radio, {
      props: {
        modelValue: 'option1',
        value: 'option1',
        label: '已选中'
      }
    })

    const radio = wrapper.find('input[type="radio"]')
    expect(radio.element.checked).toBe(true)
  })

  it('应该正确渲染禁用状态', () => {
    const wrapper = mount(Radio, {
      props: {
        disabled: true,
        value: 'option1',
        label: '禁用'
      }
    })

    const radio = wrapper.find('input[type="radio"]')
    expect(radio.attributes('disabled')).toBeDefined()
  })

  it('应该正确渲染只读状态', () => {
    const wrapper = mount(Radio, {
      props: {
        readonly: true,
        value: 'option1',
        label: '只读'
      }
    })

    const radio = wrapper.find('input[type="radio"]')
    expect(radio.attributes('readonly')).toBeDefined()
  })

  it('应该正确渲染小型单选框', () => {
    const wrapper = mount(Radio, {
      props: {
        size: 'sm',
        value: 'option1',
        label: '小型'
      }
    })

    expect(wrapper.classes()).toContain('h-4')
    expect(wrapper.classes()).toContain('w-4')
  })

  it('应该正确渲染大型单选框', () => {
    const wrapper = mount(Radio, {
      props: {
        size: 'lg',
        value: 'option1',
        label: '大型'
      }
    })

    expect(wrapper.classes()).toContain('h-6')
    expect(wrapper.classes()).toContain('w-6')
  })

  it('应该正确触发change事件', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Radio, {
      props: {
        value: 'option1',
        label: '单选框',
        onChange
      }
    })

    const radio = wrapper.find('input[type="radio"]')
    await radio.setChecked(true)
    expect(onChange).toHaveBeenCalledWith('option1')
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(Radio, {
      props: {
        className: 'custom-radio',
        value: 'option1',
        label: '自定义'
      }
    })

    expect(wrapper.classes()).toContain('custom-radio')
  })
})

describe('RadioGroup组件', () => {
  const options = [
    { label: '选项一', value: 'option1' },
    { label: '选项二', value: 'option2' },
    { label: '选项三', value: 'option3' },
  ]

  it('应该正确渲染单选框组', () => {
    const wrapper = mount(RadioGroup, {
      props: {
        options
      }
    })

    expect(wrapper.findAll('input[type="radio"]').length).toBe(3)
  })

  it('应该正确绑定v-model', async () => {
    const wrapper = mount(RadioGroup, {
      props: {
        modelValue: 'option1',
        options
      }
    })

    const radios = wrapper.findAll('input[type="radio"]')
    expect(radios[0].element.checked).toBe(true)
    expect(radios[1].element.checked).toBe(false)
    expect(radios[2].element.checked).toBe(false)
  })

  it('应该正确渲染禁用状态', () => {
    const wrapper = mount(RadioGroup, {
      props: {
        disabled: true,
        options
      }
    })

    const radios = wrapper.findAll('input[type="radio"]')
    radios.forEach(radio => {
      expect(radio.attributes('disabled')).toBeDefined()
    })
  })

  it('应该正确渲染垂直方向', () => {
    const wrapper = mount(RadioGroup, {
      props: {
        direction: 'vertical',
        options
      }
    })

    expect(wrapper.classes()).toContain('flex-col')
  })

  it('应该正确渲染水平方向', () => {
    const wrapper = mount(RadioGroup, {
      props: {
        direction: 'horizontal',
        options
      }
    })

    expect(wrapper.classes()).toContain('flex-row')
  })

  it('应该正确触发change事件', async () => {
    const onChange = vi.fn()
    const wrapper = mount(RadioGroup, {
      props: {
        options,
        onChange
      }
    })

    const radio = wrapper.find('input[type="radio"]')
    await radio.setChecked(true)
    expect(onChange).toHaveBeenCalled()
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(RadioGroup, {
      props: {
        className: 'custom-group',
        options
      }
    })

    expect(wrapper.classes()).toContain('custom-group')
  })
})
