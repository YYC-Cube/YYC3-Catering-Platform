/**
 * @fileoverview Breadcrumb组件单元测试
 * @description 测试Breadcrumb组件的功能
 * @module Breadcrumb.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from '@/components/UI/Breadcrumb'

describe('Breadcrumb组件', () => {
  it('应该正确渲染默认面包屑', () => {
    const wrapper = mount(Breadcrumb, {
      slots: {
        default: '面包屑内容'
      }
    })

    expect(wrapper.text()).toContain('面包屑内容')
  })

  it('应该正确渲染自定义分隔符', () => {
    const wrapper = mount(Breadcrumb, {
      props: {
        separator: '>'
      },
      slots: {
        default: '面包屑'
      }
    })

    expect(wrapper.text()).toContain('>')
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(Breadcrumb, {
      props: {
        className: 'custom-breadcrumb'
      },
      slots: {
        default: '自定义面包屑'
      }
    })

    expect(wrapper.classes()).toContain('custom-breadcrumb')
  })
})

describe('BreadcrumbItem组件', () => {
  it('应该正确渲染面包屑项', () => {
    const wrapper = mount(BreadcrumbItem, {
      slots: {
        default: '首页'
      }
    })

    expect(wrapper.text()).toContain('首页')
  })

  it('应该正确渲染链接', () => {
    const wrapper = mount(BreadcrumbItem, {
      props: {
        href: '/home'
      },
      slots: {
        default: '首页'
      }
    })

    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('/home')
  })

  it('应该正确渲染禁用状态', () => {
    const wrapper = mount(BreadcrumbItem, {
      props: {
        disabled: true
      },
      slots: {
        default: '禁用项'
      }
    })

    expect(wrapper.classes()).toContain('opacity-50')
  })

  it('应该正确触发click事件', async () => {
    const onClick = vi.fn()
    const wrapper = mount(BreadcrumbItem, {
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

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(BreadcrumbItem, {
      props: {
        className: 'custom-item'
      },
      slots: {
        default: '自定义项'
      }
    })

    expect(wrapper.classes()).toContain('custom-item')
  })
})

describe('BreadcrumbSeparator组件', () => {
  it('应该正确渲染默认分隔符', () => {
    const wrapper = mount(BreadcrumbSeparator)

    expect(wrapper.text()).toContain('/')
  })

  it('应该正确渲染自定义分隔符', () => {
    const wrapper = mount(BreadcrumbSeparator, {
      slots: {
        default: '>'
      }
    })

    expect(wrapper.text()).toContain('>')
  })
})

describe('Breadcrumb组合使用', () => {
  it('应该正确组合使用Breadcrumb子组件', () => {
    const wrapper = mount(Breadcrumb, {
      slots: {
        default: (
          <>
            <BreadcrumbItem href="/">首页</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem href="/products">产品</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>详情</BreadcrumbItem>
          </>
        )
      }
    })

    expect(wrapper.text()).toContain('首页')
    expect(wrapper.text()).toContain('产品')
    expect(wrapper.text()).toContain('详情')
  })
})
