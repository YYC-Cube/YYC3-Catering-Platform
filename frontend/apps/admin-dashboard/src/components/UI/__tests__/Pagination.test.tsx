/**
 * @fileoverview Pagination组件单元测试
 * @description 测试Pagination组件的功能
 * @module Pagination.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Pagination } from '@/components/UI/Pagination'

describe('Pagination组件', () => {
  it('应该正确渲染默认分页', () => {
    const wrapper = mount(Pagination, {
      props: {
        total: 100,
        pageSize: 10
      }
    })

    expect(wrapper.text()).toContain('1')
    expect(wrapper.text()).toContain('10')
  })

  it('应该正确绑定v-model', async () => {
    const wrapper = mount(Pagination, {
      props: {
        modelValue: 2,
        total: 100,
        pageSize: 10
      }
    })

    expect(wrapper.text()).toContain('2')
  })

  it('应该正确渲染禁用状态', () => {
    const wrapper = mount(Pagination, {
      props: {
        disabled: true,
        total: 100,
        pageSize: 10
      }
    })

    expect(wrapper.classes()).toContain('opacity-50')
  })

  it('应该正确渲染小型分页', () => {
    const wrapper = mount(Pagination, {
      props: {
        size: 'sm',
        total: 100,
        pageSize: 10
      }
    })

    expect(wrapper.classes()).toContain('h-8')
  })

  it('应该正确渲染大型分页', () => {
    const wrapper = mount(Pagination, {
      props: {
        size: 'lg',
        total: 100,
        pageSize: 10
      }
    })

    expect(wrapper.classes()).toContain('h-12')
  })

  it('应该正确渲染总页数', () => {
    const wrapper = mount(Pagination, {
      props: {
        total: 100,
        pageSize: 10,
        showTotal: true
      }
    })

    expect(wrapper.text()).toContain('共 100 条')
  })

  it('应该正确渲染页码选择器', () => {
    const wrapper = mount(Pagination, {
      props: {
        total: 100,
        pageSize: 10,
        showSizeChanger: true
      }
    })

    expect(wrapper.find('select').exists()).toBe(true)
  })

  it('应该正确渲染快速跳转', () => {
    const wrapper = mount(Pagination, {
      props: {
        total: 100,
        pageSize: 10,
        showQuickJumper: true
      }
    })

    expect(wrapper.find('input[type="number"]').exists()).toBe(true)
  })

  it('应该正确渲染简单模式', () => {
    const wrapper = mount(Pagination, {
      props: {
        total: 100,
        pageSize: 10,
        simple: true
      }
    })

    expect(wrapper.classes()).toContain('simple')
  })

  it('应该正确触发update:modelValue事件', async () => {
    const wrapper = mount(Pagination, {
      props: {
        total: 100,
        pageSize: 10
      }
    })

    const nextButton = wrapper.findAll('button').find(btn => btn.text() === '2')
    if (nextButton) {
      await nextButton.trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    }
  })

  it('应该正确触发change事件', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Pagination, {
      props: {
        total: 100,
        pageSize: 10,
        onChange
      }
    })

    const nextButton = wrapper.findAll('button').find(btn => btn.text() === '2')
    if (nextButton) {
      await nextButton.trigger('click')
      expect(onChange).toHaveBeenCalled()
    }
  })

  it('应该正确触发page-size-change事件', async () => {
    const onPageSizeChange = vi.fn()
    const wrapper = mount(Pagination, {
      props: {
        total: 100,
        pageSize: 10,
        showSizeChanger: true,
        onPageSizeChange
      }
    })

    const select = wrapper.find('select')
    await select.setValue('20')
    expect(onPageSizeChange).toHaveBeenCalledWith(20)
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(Pagination, {
      props: {
        className: 'custom-pagination',
        total: 100,
        pageSize: 10
      }
    })

    expect(wrapper.classes()).toContain('custom-pagination')
  })

  it('应该正确处理边界情况 - 上一页禁用', () => {
    const wrapper = mount(Pagination, {
      props: {
        modelValue: 1,
        total: 100,
        pageSize: 10
      }
    })

    const prevButton = wrapper.findAll('button').find(btn => btn.text() === '<')
    expect(prevButton?.attributes('disabled')).toBeDefined()
  })

  it('应该正确处理边界情况 - 下一页禁用', () => {
    const wrapper = mount(Pagination, {
      props: {
        modelValue: 10,
        total: 100,
        pageSize: 10
      }
    })

    const nextButton = wrapper.findAll('button').find(btn => btn.text() === '>')
    expect(nextButton?.attributes('disabled')).toBeDefined()
  })
})
