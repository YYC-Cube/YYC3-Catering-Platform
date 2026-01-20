/**
 * @fileoverview Grid组件单元测试
 * @description 测试Grid组件的功能
 * @module Grid.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Grid, GridRow, GridCol } from '@/components/UI/Grid'

describe('Grid组件', () => {
  it('应该正确渲染默认网格', () => {
    const wrapper = mount(Grid, {
      slots: {
        default: '网格内容'
      }
    })

    expect(wrapper.text()).toContain('网格内容')
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(Grid, {
      props: {
        className: 'custom-grid'
      },
      slots: {
        default: '自定义网格'
      }
    })

    expect(wrapper.classes()).toContain('custom-grid')
  })
})

describe('GridRow组件', () => {
  it('应该正确渲染网格行', () => {
    const wrapper = mount(GridRow, {
      slots: {
        default: '网格行内容'
      }
    })

    expect(wrapper.text()).toContain('网格行内容')
  })

  it('应该正确渲染间距', () => {
    const wrapper = mount(GridRow, {
      props: {
        gutter: 16
      },
      slots: {
        default: '带间距行'
      }
    })

    expect(wrapper.classes()).toContain('gutter-16')
  })

  it('应该正确渲染对齐方式', () => {
    const wrapper = mount(GridRow, {
      props: {
        align: 'center'
      },
      slots: {
        default: '居中对齐行'
      }
    })

    expect(wrapper.classes()).toContain('align-center')
  })

  it('应该正确渲染垂直对齐', () => {
    const wrapper = mount(GridRow, {
      props: {
        justify: 'center'
      },
      slots: {
        default: '垂直居中行'
      }
    })

    expect(wrapper.classes()).toContain('justify-center')
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(GridRow, {
      props: {
        className: 'custom-row'
      },
      slots: {
        default: '自定义行'
      }
    })

    expect(wrapper.classes()).toContain('custom-row')
  })
})

describe('GridCol组件', () => {
  it('应该正确渲染网格列', () => {
    const wrapper = mount(GridCol, {
      slots: {
        default: '网格列内容'
      }
    })

    expect(wrapper.text()).toContain('网格列内容')
  })

  it('应该正确渲染列数', () => {
    const wrapper = mount(GridCol, {
      props: {
        span: 6
      },
      slots: {
        default: '6列'
      }
    })

    expect(wrapper.classes()).toContain('col-span-6')
  })

  it('应该正确渲染偏移', () => {
    const wrapper = mount(GridCol, {
      props: {
        offset: 2
      },
      slots: {
        default: '偏移2列'
      }
    })

    expect(wrapper.classes()).toContain('col-offset-2')
  })

  it('应该正确渲染推列', () => {
    const wrapper = mount(GridCol, {
      props: {
        push: 1
      },
      slots: {
        default: '推1列'
      }
    })

    expect(wrapper.classes()).toContain('col-push-1')
  })

  it('应该正确渲染拉列', () => {
    const wrapper = mount(GridCol, {
      props: {
        pull: 1
      },
      slots: {
        default: '拉1列'
      }
    })

    expect(wrapper.classes()).toContain('col-pull-1')
  })

  it('应该正确渲染响应式列数', () => {
    const wrapper = mount(GridCol, {
      props: {
        xs: 24,
        sm: 12,
        md: 8,
        lg: 6,
        xl: 4
      },
      slots: {
        default: '响应式列'
      }
    })

    expect(wrapper.classes()).toContain('xs-col-span-24')
    expect(wrapper.classes()).toContain('sm-col-span-12')
    expect(wrapper.classes()).toContain('md-col-span-8')
    expect(wrapper.classes()).toContain('lg-col-span-6')
    expect(wrapper.classes()).toContain('xl-col-span-4')
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(GridCol, {
      props: {
        className: 'custom-col'
      },
      slots: {
        default: '自定义列'
      }
    })

    expect(wrapper.classes()).toContain('custom-col')
  })
})

describe('Grid组合使用', () => {
  it('应该正确组合使用Grid子组件', () => {
    const wrapper = mount(Grid, {
      slots: {
        default: (
          <GridRow gutter={16}>
            <GridCol span={8}>列1</GridCol>
            <GridCol span={8}>列2</GridCol>
            <GridCol span={8}>列3</GridCol>
          </GridRow>
        )
      }
    })

    expect(wrapper.text()).toContain('列1')
    expect(wrapper.text()).toContain('列2')
    expect(wrapper.text()).toContain('列3')
  })
})
