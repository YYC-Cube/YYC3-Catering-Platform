/**
 * @fileoverview Space组件单元测试
 * @description 测试Space组件的功能
 * @module Space.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Space } from '@/components/UI/Space'

describe('Space组件', () => {
  it('应该正确渲染默认间距', () => {
    const wrapper = mount(Space, {
      slots: {
        default: (
          <>
            <Button>按钮1</Button>
            <Button>按钮2</Button>
            <Button>按钮3</Button>
          </>
        )
      }
    })

    expect(wrapper.text()).toContain('按钮1')
    expect(wrapper.text()).toContain('按钮2')
    expect(wrapper.text()).toContain('按钮3')
  })

  it('应该正确渲染水平方向', () => {
    const wrapper = mount(Space, {
      props: {
        direction: 'horizontal'
      },
      slots: {
        default: (
          <>
            <Button>水平1</Button>
            <Button>水平2</Button>
          </>
        )
      }
    })

    expect(wrapper.classes()).toContain('horizontal')
  })

  it('应该正确渲染垂直方向', () => {
    const wrapper = mount(Space, {
      props: {
        direction: 'vertical'
      },
      slots: {
        default: (
          <>
            <Button>垂直1</Button>
            <Button>垂直2</Button>
          </>
        )
      }
    })

    expect(wrapper.classes()).toContain('vertical')
  })

  it('应该正确渲染小间距', () => {
    const wrapper = mount(Space, {
      props: {
        size: 'sm'
      },
      slots: {
        default: (
          <>
            <Button>小间距</Button>
            <Button>小间距</Button>
          </>
        )
      }
    })

    expect(wrapper.classes()).toContain('sm')
  })

  it('应该正确渲染中等间距', () => {
    const wrapper = mount(Space, {
      props: {
        size: 'md'
      },
      slots: {
        default: (
          <>
            <Button>中等间距</Button>
            <Button>中等间距</Button>
          </>
        )
      }
    })

    expect(wrapper.classes()).toContain('md')
  })

  it('应该正确渲染大间距', () => {
    const wrapper = mount(Space, {
      props: {
        size: 'lg'
      },
      slots: {
        default: (
          <>
            <Button>大间距</Button>
            <Button>大间距</Button>
          </>
        )
      }
    })

    expect(wrapper.classes()).toContain('lg')
  })

  it('应该正确渲染自定义间距', () => {
    const wrapper = mount(Space, {
      props: {
        size: 24
      },
      slots: {
        default: (
          <>
            <Button>自定义间距</Button>
            <Button>自定义间距</Button>
          </>
        )
      }
    })

    expect(wrapper.classes()).toContain('size-24')
  })

  it('应该正确渲染对齐方式', () => {
    const wrapper = mount(Space, {
      props: {
        align: 'center'
      },
      slots: {
        default: (
          <>
            <Button>居中对齐</Button>
            <Button>居中对齐</Button>
          </>
        )
      }
    })

    expect(wrapper.classes()).toContain('align-center')
  })

  it('应该正确渲染换行', () => {
    const wrapper = mount(Space, {
      props: {
        wrap: true
      },
      slots: {
        default: (
          <>
            <Button>换行1</Button>
            <Button>换行2</Button>
            <Button>换行3</Button>
          </>
        )
      }
    })

    expect(wrapper.classes()).toContain('wrap')
  })

  it('应该正确渲染填充', () => {
    const wrapper = mount(Space, {
      props: {
        fill: true
      },
      slots: {
        default: (
          <>
            <Button>填充1</Button>
            <Button>填充2</Button>
          </>
        )
      }
    })

    expect(wrapper.classes()).toContain('fill')
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(Space, {
      props: {
        className: 'custom-space'
      },
      slots: {
        default: (
          <>
            <Button>自定义</Button>
            <Button>自定义</Button>
          </>
        )
      }
    })

    expect(wrapper.classes()).toContain('custom-space')
  })
})
