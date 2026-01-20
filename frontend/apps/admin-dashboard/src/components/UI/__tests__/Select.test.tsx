/**
 * @fileoverview Select组件单元测试
 * @description 测试Select组件的功能
 * @module Select.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Select } from '@/components/UI/Select'

describe('Select组件', () => {
  const options = [
    { label: '选项一', value: 'option1' },
    { label: '选项二', value: 'option2' },
    { label: '选项三', value: 'option3' },
  ]

  it('应该正确渲染默认选择器', () => {
    const wrapper = mount(Select, {
      props: {
        options,
        placeholder: '请选择'
      }
    })

    expect(wrapper.text()).toContain('请选择')
  })

  it('应该正确绑定v-model', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: 'option1',
        options
      }
    })

    expect(wrapper.text()).toContain('选项一')
  })

  it('应该正确渲染禁用状态', () => {
    const wrapper = mount(Select, {
      props: {
        disabled: true,
        options
      }
    })

    const select = wrapper.find('button')
    expect(select.attributes('disabled')).toBeDefined()
  })

  it('应该正确渲染只读状态', () => {
    const wrapper = mount(Select, {
      props: {
        readonly: true,
        options
      }
    })

    const select = wrapper.find('button')
    expect(select.attributes('readonly')).toBeDefined()
  })

  it('应该正确渲染可清空', () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: 'option1',
        options,
        clearable: true
      }
    })

    expect(wrapper.find('.cursor-pointer').exists()).toBe(true)
  })

  it('应该正确渲染多选模式', () => {
    const wrapper = mount(Select, {
      props: {
        multiple: true,
        options
      }
    })

    expect(wrapper.classes()).toContain('multiple')
  })

  it('应该正确渲染可搜索', () => {
    const wrapper = mount(Select, {
      props: {
        searchable: true,
        options
      }
    })

    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
  })

  it('应该正确渲染加载状态', () => {
    const wrapper = mount(Select, {
      props: {
        loading: true,
        options
      }
    })

    expect(wrapper.find('.animate-spin').exists()).toBe(true)
  })

  it('应该正确渲染小型选择器', () => {
    const wrapper = mount(Select, {
      props: {
        size: 'sm',
        options
      }
    })

    expect(wrapper.classes()).toContain('h-8')
  })

  it('应该正确渲染大型选择器', () => {
    const wrapper = mount(Select, {
      props: {
        size: 'lg',
        options
      }
    })

    expect(wrapper.classes()).toContain('h-12')
  })

  it('应该正确触发update:modelValue事件', async () => {
    const wrapper = mount(Select, {
      props: {
        options
      }
    })

    const select = wrapper.find('button')
    await select.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('应该正确触发change事件', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Select, {
      props: {
        options,
        onChange
      }
    })

    const select = wrapper.find('button')
    await select.trigger('click')
    expect(onChange).toHaveBeenCalled()
  })

  it('应该正确触发clear事件', async () => {
    const onClear = vi.fn()
    const wrapper = mount(Select, {
      props: {
        modelValue: 'option1',
        options,
        clearable: true,
        onClear
      }
    })

    const clearButton = wrapper.find('.cursor-pointer')
    await clearButton.trigger('click')
    expect(onClear).toHaveBeenCalled()
  })

  it('应该正确触发visible-change事件', async () => {
    const onVisibleChange = vi.fn()
    const wrapper = mount(Select, {
      props: {
        options,
        onVisibleChange
      }
    })

    const select = wrapper.find('button')
    await select.trigger('click')
    expect(onVisibleChange).toHaveBeenCalledWith(true)
  })

  it('应该正确渲染分组选项', () => {
    const groupedOptions = [
      {
        label: '分组一',
        value: 'group1',
        children: [
          { label: '选项一', value: 'option1' },
          { label: '选项二', value: 'option2' },
        ]
      },
      {
        label: '分组二',
        value: 'group2',
        children: [
          { label: '选项三', value: 'option3' },
          { label: '选项四', value: 'option4' },
        ]
      },
    ]

    const wrapper = mount(Select, {
      props: {
        options: groupedOptions
      }
    })

    expect(wrapper.text()).toContain('分组一')
    expect(wrapper.text()).toContain('分组二')
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(Select, {
      props: {
        className: 'custom-select',
        options
      }
    })

    expect(wrapper.classes()).toContain('custom-select')
  })
})
