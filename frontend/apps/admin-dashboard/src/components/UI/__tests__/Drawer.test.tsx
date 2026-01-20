/**
 * @fileoverview Drawer组件单元测试
 * @description 测试Drawer组件的功能
 * @module Drawer.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Drawer, DrawerHeader, DrawerBody, DrawerFooter } from '@/components/UI/Drawer'

describe('Drawer组件', () => {
  it('应该正确渲染默认抽屉', () => {
    const wrapper = mount(Drawer, {
      props: {
        visible: true,
        title: '抽屉标题'
      },
      slots: {
        default: '抽屉内容'
      }
    })

    expect(wrapper.text()).toContain('抽屉标题')
    expect(wrapper.text()).toContain('抽屉内容')
  })

  it('应该正确渲染左侧抽屉', () => {
    const wrapper = mount(Drawer, {
      props: {
        visible: true,
        placement: 'left'
      },
      slots: {
        default: '左侧抽屉'
      }
    })

    expect(wrapper.classes()).toContain('left')
  })

  it('应该正确渲染右侧抽屉', () => {
    const wrapper = mount(Drawer, {
      props: {
        visible: true,
        placement: 'right'
      },
      slots: {
        default: '右侧抽屉'
      }
    })

    expect(wrapper.classes()).toContain('right')
  })

  it('应该正确渲染顶部抽屉', () => {
    const wrapper = mount(Drawer, {
      props: {
        visible: true,
        placement: 'top'
      },
      slots: {
        default: '顶部抽屉'
      }
    })

    expect(wrapper.classes()).toContain('top')
  })

  it('应该正确渲染底部抽屉', () => {
    const wrapper = mount(Drawer, {
      props: {
        visible: true,
        placement: 'bottom'
      },
      slots: {
        default: '底部抽屉'
      }
    })

    expect(wrapper.classes()).toContain('bottom')
  })

  it('应该正确渲染小型抽屉', () => {
    const wrapper = mount(Drawer, {
      props: {
        visible: true,
        size: 'sm'
      },
      slots: {
        default: '小型抽屉'
      }
    })

    expect(wrapper.classes()).toContain('sm')
  })

  it('应该正确渲染大型抽屉', () => {
    const wrapper = mount(Drawer, {
      props: {
        visible: true,
        size: 'lg'
      },
      slots: {
        default: '大型抽屉'
      }
    })

    expect(wrapper.classes()).toContain('lg')
  })

  it('应该正确渲染关闭按钮', () => {
    const wrapper = mount(Drawer, {
      props: {
        visible: true,
        closable: true
      },
      slots: {
        default: '可关闭抽屉'
      }
    })

    expect(wrapper.find('button[aria-label="关闭"]').exists()).toBe(true)
  })

  it('应该正确渲染遮罩层', () => {
    const wrapper = mount(Drawer, {
      props: {
        visible: true,
        mask: true
      },
      slots: {
        default: '带遮罩抽屉'
      }
    })

    expect(wrapper.find('.drawer-mask').exists()).toBe(true)
  })

  it('应该正确渲染无遮罩层', () => {
    const wrapper = mount(Drawer, {
      props: {
        visible: true,
        mask: false
      },
      slots: {
        default: '无遮罩抽屉'
      }
    })

    expect(wrapper.find('.drawer-mask').exists()).toBe(false)
  })

  it('应该正确触发update:visible事件', async () => {
    const wrapper = mount(Drawer, {
      props: {
        visible: true
      },
      slots: {
        default: '抽屉内容'
      }
    })

    const closeButton = wrapper.find('button[aria-label="关闭"]')
    await closeButton.trigger('click')
    expect(wrapper.emitted('update:visible')).toBeTruthy()
    expect(wrapper.emitted('update:visible')![0]).toEqual([false])
  })

  it('应该正确触发close事件', async () => {
    const onClose = vi.fn()
    const wrapper = mount(Drawer, {
      props: {
        visible: true,
        onClose
      },
      slots: {
        default: '抽屉内容'
      }
    })

    const closeButton = wrapper.find('button[aria-label="关闭"]')
    await closeButton.trigger('click')
    expect(onClose).toHaveBeenCalled()
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(Drawer, {
      props: {
        visible: true,
        className: 'custom-drawer'
      },
      slots: {
        default: '自定义抽屉'
      }
    })

    expect(wrapper.classes()).toContain('custom-drawer')
  })
})

describe('DrawerHeader组件', () => {
  it('应该正确渲染抽屉头部', () => {
    const wrapper = mount(DrawerHeader, {
      slots: {
        default: '抽屉头部'
      }
    })

    expect(wrapper.text()).toContain('抽屉头部')
  })
})

describe('DrawerBody组件', () => {
  it('应该正确渲染抽屉主体', () => {
    const wrapper = mount(DrawerBody, {
      slots: {
        default: '抽屉主体'
      }
    })

    expect(wrapper.text()).toContain('抽屉主体')
  })
})

describe('DrawerFooter组件', () => {
  it('应该正确渲染抽屉底部', () => {
    const wrapper = mount(DrawerFooter, {
      slots: {
        default: '抽屉底部'
      }
    })

    expect(wrapper.text()).toContain('抽屉底部')
  })
})

describe('Drawer组合使用', () => {
  it('应该正确组合使用Drawer子组件', () => {
    const wrapper = mount(Drawer, {
      props: {
        visible: true,
        title: '组合标题'
      },
      slots: {
        default: (
          <>
            <DrawerHeader>头部内容</DrawerHeader>
            <DrawerBody>主体内容</DrawerBody>
            <DrawerFooter>底部内容</DrawerFooter>
          </>
        )
      }
    })

    expect(wrapper.text()).toContain('组合标题')
    expect(wrapper.text()).toContain('头部内容')
    expect(wrapper.text()).toContain('主体内容')
    expect(wrapper.text()).toContain('底部内容')
  })
})
