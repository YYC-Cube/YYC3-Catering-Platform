/**
 * @fileoverview Flex组件单元测试
 * @description 测试Flex组件的功能
 * @module Flex.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Flex, FlexItem } from '@/components/UI/Flex'

describe('Flex组件', () => {
  it('应该正确渲染默认弹性布局', () => {
    const wrapper = mount(Flex, {
      slots: {
        default: '弹性布局内容'
      }
    })

    expect(wrapper.text()).toContain('弹性布局内容')
  })

  it('应该正确渲染水平方向', () => {
    const wrapper = mount(Flex, {
      props: {
        direction: 'row'
      },
      slots: {
        default: '水平弹性布局'
      }
    })

    expect(wrapper.classes()).toContain('flex-row')
  })

  it('应该正确渲染垂直方向', () => {
    const wrapper = mount(Flex, {
      props: {
        direction: 'column'
      },
      slots: {
        default: '垂直弹性布局'
      }
    })

    expect(wrapper.classes()).toContain('flex-col')
  })

  it('应该正确渲染反向水平方向', () => {
    const wrapper = mount(Flex, {
      props: {
        direction: 'row-reverse'
      },
      slots: {
        default: '反向水平弹性布局'
      }
    })

    expect(wrapper.classes()).toContain('flex-row-reverse')
  })

  it('应该正确渲染反向垂直方向', () => {
    const wrapper = mount(Flex, {
      props: {
        direction: 'column-reverse'
      },
      slots: {
        default: '反向垂直弹性布局'
      }
    })

    expect(wrapper.classes()).toContain('flex-col-reverse')
  })

  it('应该正确渲染换行', () => {
    const wrapper = mount(Flex, {
      props: {
        wrap: 'wrap'
      },
      slots: {
        default: '换行弹性布局'
      }
    })

    expect(wrapper.classes()).toContain('flex-wrap')
  })

  it('应该正确渲染不换行', () => {
    const wrapper = mount(Flex, {
      props: {
        wrap: 'nowrap'
      },
      slots: {
        default: '不换行弹性布局'
      }
    })

    expect(wrapper.classes()).toContain('flex-nowrap')
  })

  it('应该正确渲染反向换行', () => {
    const wrapper = mount(Flex, {
      props: {
        wrap: 'wrap-reverse'
      },
      slots: {
        default: '反向换行弹性布局'
      }
    })

    expect(wrapper.classes()).toContain('flex-wrap-reverse')
  })

  it('应该正确渲染主轴对齐', () => {
    const wrapper = mount(Flex, {
      props: {
        justify: 'center'
      },
      slots: {
        default: '主轴居中'
      }
    })

    expect(wrapper.classes()).toContain('justify-center')
  })

  it('应该正确渲染交叉轴对齐', () => {
    const wrapper = mount(Flex, {
      props: {
        align: 'center'
      },
      slots: {
        default: '交叉轴居中'
      }
    })

    expect(wrapper.classes()).toContain('items-center')
  })

  it('应该正确渲染间距', () => {
    const wrapper = mount(Flex, {
      props: {
        gap: 16
      },
      slots: {
        default: '带间距弹性布局'
      }
    })

    expect(wrapper.classes()).toContain('gap-4')
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(Flex, {
      props: {
        className: 'custom-flex'
      },
      slots: {
        default: '自定义弹性布局'
      }
    })

    expect(wrapper.classes()).toContain('custom-flex')
  })
})

describe('FlexItem组件', () => {
  it('应该正确渲染弹性项', () => {
    const wrapper = mount(FlexItem, {
      slots: {
        default: '弹性项内容'
      }
    })

    expect(wrapper.text()).toContain('弹性项内容')
  })

  it('应该正确渲染flex值', () => {
    const wrapper = mount(FlexItem, {
      props: {
        flex: 1
      },
      slots: {
        default: 'flex:1'
      }
    })

    expect(wrapper.classes()).toContain('flex-1')
  })

  it('应该正确渲染flex-grow', () => {
    const wrapper = mount(FlexItem, {
      props: {
        grow: 1
      },
      slots: {
        default: 'grow:1'
      }
    })

    expect(wrapper.classes()).toContain('grow')
  })

  it('应该正确渲染flex-shrink', () => {
    const wrapper = mount(FlexItem, {
      props: {
        shrink: 0
      },
      slots: {
        default: 'shrink:0'
      }
    })

    expect(wrapper.classes()).toContain('shrink-0')
  })

  it('应该正确渲染flex-basis', () => {
    const wrapper = mount(FlexItem, {
      props: {
        basis: '200px'
      },
      slots: {
        default: 'basis:200px'
      }
    })

    expect(wrapper.attributes('style')).toContain('flex-basis: 200px')
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(FlexItem, {
      props: {
        className: 'custom-flex-item'
      },
      slots: {
        default: '自定义弹性项'
      }
    })

    expect(wrapper.classes()).toContain('custom-flex-item')
  })
})

describe('Flex组合使用', () => {
  it('应该正确组合使用Flex子组件', () => {
    const wrapper = mount(Flex, {
      props: {
        gap: 16
      },
      slots: {
        default: (
          <>
            <FlexItem flex={1}>弹性项1</FlexItem>
            <FlexItem flex={2}>弹性项2</FlexItem>
            <FlexItem flex={1}>弹性项3</FlexItem>
          </>
        )
      }
    })

    expect(wrapper.text()).toContain('弹性项1')
    expect(wrapper.text()).toContain('弹性项2')
    expect(wrapper.text()).toContain('弹性项3')
  })
})
