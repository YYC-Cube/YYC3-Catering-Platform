/**
 * @fileoverview Table组件单元测试
 * @description 测试Table组件的功能
 * @module Table.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/UI/Table'

describe('Table组件', () => {
  const columns = [
    { key: 'name', title: '姓名' },
    { key: 'age', title: '年龄' },
    { key: 'email', title: '邮箱' },
  ]

  const data = [
    { name: '张三', age: 25, email: 'zhangsan@example.com' },
    { name: '李四', age: 30, email: 'lisi@example.com' },
    { name: '王五', age: 28, email: 'wangwu@example.com' },
  ]

  it('应该正确渲染默认表格', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        data
      }
    })

    expect(wrapper.text()).toContain('姓名')
    expect(wrapper.text()).toContain('年龄')
    expect(wrapper.text()).toContain('邮箱')
  })

  it('应该正确渲染表格数据', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        data
      }
    })

    expect(wrapper.text()).toContain('张三')
    expect(wrapper.text()).toContain('李四')
    expect(wrapper.text()).toContain('王五')
  })

  it('应该正确渲染边框', () => {
    const wrapper = mount(Table, {
      props: {
        bordered: true,
        columns,
        data
      }
    })

    expect(wrapper.classes()).toContain('bordered')
  })

  it('应该正确渲染斑马纹', () => {
    const wrapper = mount(Table, {
      props: {
        striped: true,
        columns,
        data
      }
    })

    expect(wrapper.classes()).toContain('striped')
  })

  it('应该正确渲染悬停效果', () => {
    const wrapper = mount(Table, {
      props: {
        hoverable: true,
        columns,
        data
      }
    })

    expect(wrapper.classes()).toContain('hoverable')
  })

  it('应该正确渲染紧凑模式', () => {
    const wrapper = mount(Table, {
      props: {
        compact: true,
        columns,
        data
      }
    })

    expect(wrapper.classes()).toContain('compact')
  })

  it('应该正确渲染加载状态', () => {
    const wrapper = mount(Table, {
      props: {
        loading: true,
        columns,
        data
      }
    })

    expect(wrapper.find('.animate-spin').exists()).toBe(true)
  })

  it('应该正确渲染空状态', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        data: []
      }
    })

    expect(wrapper.text()).toContain('暂无数据')
  })

  it('应该正确触发select事件', async () => {
    const onSelect = vi.fn()
    const wrapper = mount(Table, {
      props: {
        columns,
        data,
        onSelect
      }
    })

    const row = wrapper.find('tbody tr')
    await row.trigger('click')
    expect(onSelect).toHaveBeenCalled()
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(Table, {
      props: {
        className: 'custom-table',
        columns,
        data
      }
    })

    expect(wrapper.classes()).toContain('custom-table')
  })
})

describe('TableHeader组件', () => {
  it('应该正确渲染表格头部', () => {
    const wrapper = mount(TableHeader, {
      slots: {
        default: '表格头部'
      }
    })

    expect(wrapper.text()).toContain('表格头部')
  })
})

describe('TableBody组件', () => {
  it('应该正确渲染表格主体', () => {
    const wrapper = mount(TableBody, {
      slots: {
        default: '表格主体'
      }
    })

    expect(wrapper.text()).toContain('表格主体')
  })
})

describe('TableRow组件', () => {
  it('应该正确渲染表格行', () => {
    const wrapper = mount(TableRow, {
      slots: {
        default: '表格行'
      }
    })

    expect(wrapper.text()).toContain('表格行')
  })

  it('应该正确渲染选中状态', () => {
    const wrapper = mount(TableRow, {
      props: {
        selected: true
      },
      slots: {
        default: '选中行'
      }
    })

    expect(wrapper.classes()).toContain('selected')
  })
})

describe('TableCell组件', () => {
  it('应该正确渲染表格单元格', () => {
    const wrapper = mount(TableCell, {
      slots: {
        default: '单元格'
      }
    })

    expect(wrapper.text()).toContain('单元格')
  })
})

describe('TableHead组件', () => {
  it('应该正确渲染表头单元格', () => {
    const wrapper = mount(TableHead, {
      slots: {
        default: '表头'
      }
    })

    expect(wrapper.text()).toContain('表头')
  })
})
