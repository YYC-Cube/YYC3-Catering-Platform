/**
 * @fileoverview Dialog组件单元测试
 * @description 测试Dialog组件的功能
 * @module Dialog.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Dialog, DialogHeader, DialogBody, DialogFooter } from '@/components/UI/Dialog'

describe('Dialog组件', () => {
  it('应该正确渲染默认对话框', () => {
    const wrapper = mount(Dialog, {
      props: {
        visible: true,
        title: '对话框标题'
      },
      slots: {
        default: '对话框内容'
      }
    })

    expect(wrapper.text()).toContain('对话框标题')
    expect(wrapper.text()).toContain('对话框内容')
  })

  it('应该正确渲染小型对话框', () => {
    const wrapper = mount(Dialog, {
      props: {
        visible: true,
        size: 'sm'
      },
      slots: {
        default: '小型对话框'
      }
    })

    expect(wrapper.classes()).toContain('sm')
  })

  it('应该正确渲染大型对话框', () => {
    const wrapper = mount(Dialog, {
      props: {
        visible: true,
        size: 'lg'
      },
      slots: {
        default: '大型对话框'
      }
    })

    expect(wrapper.classes()).toContain('lg')
  })

  it('应该正确渲染全屏对话框', () => {
    const wrapper = mount(Dialog, {
      props: {
        visible: true,
        fullscreen: true
      },
      slots: {
        default: '全屏对话框'
      }
    })

    expect(wrapper.classes()).toContain('fullscreen')
  })

  it('应该正确渲染居中对话框', () => {
    const wrapper = mount(Dialog, {
      props: {
        visible: true,
        centered: true
      },
      slots: {
        default: '居中对话框'
      }
    })

    expect(wrapper.classes()).toContain('centered')
  })

  it('应该正确渲染关闭按钮', () => {
    const wrapper = mount(Dialog, {
      props: {
        visible: true,
        closable: true
      },
      slots: {
        default: '可关闭对话框'
      }
    })

    expect(wrapper.find('button[aria-label="关闭"]').exists()).toBe(true)
  })

  it('应该正确渲染遮罩层', () => {
    const wrapper = mount(Dialog, {
      props: {
        visible: true,
        mask: true
      },
      slots: {
        default: '带遮罩对话框'
      }
    })

    expect(wrapper.find('.dialog-mask').exists()).toBe(true)
  })

  it('应该正确渲染无遮罩层', () => {
    const wrapper = mount(Dialog, {
      props: {
        visible: true,
        mask: false
      },
      slots: {
        default: '无遮罩对话框'
      }
    })

    expect(wrapper.find('.dialog-mask').exists()).toBe(false)
  })

  it('应该正确渲染点击遮罩关闭', () => {
    const wrapper = mount(Dialog, {
      props: {
        visible: true,
        maskClosable: true
      },
      slots: {
        default: '点击遮罩关闭'
      }
    })

    expect(wrapper.classes()).toContain('mask-closable')
  })

  it('应该正确渲染确认按钮', () => {
    const wrapper = mount(Dialog, {
      props: {
        visible: true,
        showConfirmButton: true
      },
      slots: {
        default: '确认对话框'
      }
    })

    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('应该正确渲染取消按钮', () => {
    const wrapper = mount(Dialog, {
      props: {
        visible: true,
        showCancelButton: true
      },
      slots: {
        default: '取消对话框'
      }
    })

    expect(wrapper.find('button[type="button"]').exists()).toBe(true)
  })

  it('应该正确触发update:visible事件', async () => {
    const wrapper = mount(Dialog, {
      props: {
        visible: true
      },
      slots: {
        default: '对话框内容'
      }
    })

    const closeButton = wrapper.find('button[aria-label="关闭"]')
    await closeButton.trigger('click')
    expect(wrapper.emitted('update:visible')).toBeTruthy()
    expect(wrapper.emitted('update:visible')![0]).toEqual([false])
  })

  it('应该正确触发close事件', async () => {
    const onClose = vi.fn()
    const wrapper = mount(Dialog, {
      props: {
        visible: true,
        onClose
      },
      slots: {
        default: '对话框内容'
      }
    })

    const closeButton = wrapper.find('button[aria-label="关闭"]')
    await closeButton.trigger('click')
    expect(onClose).toHaveBeenCalled()
  })

  it('应该正确触发confirm事件', async () => {
    const onConfirm = vi.fn()
    const wrapper = mount(Dialog, {
      props: {
        visible: true,
        showConfirmButton: true,
        onConfirm
      },
      slots: {
        default: '对话框内容'
      }
    })

    const confirmButton = wrapper.find('button[type="submit"]')
    await confirmButton.trigger('click')
    expect(onConfirm).toHaveBeenCalled()
  })

  it('应该正确触发cancel事件', async () => {
    const onCancel = vi.fn()
    const wrapper = mount(Dialog, {
      props: {
        visible: true,
        showCancelButton: true,
        onCancel
      },
      slots: {
        default: '对话框内容'
      }
    })

    const cancelButton = wrapper.find('button[type="button"]')
    await cancelButton.trigger('click')
    expect(onCancel).toHaveBeenCalled()
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(Dialog, {
      props: {
        visible: true,
        className: 'custom-dialog'
      },
      slots: {
        default: '自定义对话框'
      }
    })

    expect(wrapper.classes()).toContain('custom-dialog')
  })
})

describe('DialogHeader组件', () => {
  it('应该正确渲染对话框头部', () => {
    const wrapper = mount(DialogHeader, {
      slots: {
        default: '对话框头部'
      }
    })

    expect(wrapper.text()).toContain('对话框头部')
  })
})

describe('DialogBody组件', () => {
  it('应该正确渲染对话框主体', () => {
    const wrapper = mount(DialogBody, {
      slots: {
        default: '对话框主体'
      }
    })

    expect(wrapper.text()).toContain('对话框主体')
  })
})

describe('DialogFooter组件', () => {
  it('应该正确渲染对话框底部', () => {
    const wrapper = mount(DialogFooter, {
      slots: {
        default: '对话框底部'
      }
    })

    expect(wrapper.text()).toContain('对话框底部')
  })
})

describe('Dialog组合使用', () => {
  it('应该正确组合使用Dialog子组件', () => {
    const wrapper = mount(Dialog, {
      props: {
        visible: true,
        title: '组合标题'
      },
      slots: {
        default: (
          <>
            <DialogHeader>头部内容</DialogHeader>
            <DialogBody>主体内容</DialogBody>
            <DialogFooter>底部内容</DialogFooter>
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
