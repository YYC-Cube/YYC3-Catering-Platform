/**
 * @fileoverview Form组件单元测试
 * @description 测试Form组件的功能
 * @module Form.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Form, FormField, FormLabel, FormError } from '@/components/UI/Form'

describe('Form组件', () => {
  it('应该正确渲染默认表单', () => {
    const wrapper = mount(Form, {
      slots: {
        default: '表单内容'
      }
    })

    expect(wrapper.text()).toBe('表单内容')
  })

  it('应该正确渲染垂直布局', () => {
    const wrapper = mount(Form, {
      props: {
        layout: 'vertical'
      },
      slots: {
        default: '垂直表单'
      }
    })

    expect(wrapper.classes()).toContain('flex-col')
  })

  it('应该正确渲染水平布局', () => {
    const wrapper = mount(Form, {
      props: {
        layout: 'horizontal'
      },
      slots: {
        default: '水平表单'
      }
    })

    expect(wrapper.classes()).toContain('flex-row')
  })

  it('应该正确渲染内联布局', () => {
    const wrapper = mount(Form, {
      props: {
        layout: 'inline'
      },
      slots: {
        default: '内联表单'
      }
    })

    expect(wrapper.classes()).toContain('inline-flex')
  })

  it('应该正确触发submit事件', async () => {
    const onSubmit = vi.fn()
    const wrapper = mount(Form, {
      props: {
        onSubmit
      },
      slots: {
        default: '表单内容'
      }
    })

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(Form, {
      props: {
        className: 'custom-form'
      },
      slots: {
        default: '自定义表单'
      }
    })

    expect(wrapper.classes()).toContain('custom-form')
  })
})

describe('FormField组件', () => {
  it('应该正确渲染表单字段', () => {
    const wrapper = mount(FormField, {
      props: {
        name: 'username',
        label: '用户名'
      },
      slots: {
        default: <input type="text" />
      }
    })

    expect(wrapper.text()).toContain('用户名')
  })

  it('应该正确渲染必填字段', () => {
    const wrapper = mount(FormField, {
      props: {
        name: 'email',
        label: '邮箱',
        required: true
      },
      slots: {
        default: <input type="email" />
      }
    })

    expect(wrapper.text()).toContain('*')
  })

  it('应该正确渲染错误状态', () => {
    const wrapper = mount(FormField, {
      props: {
        name: 'password',
        label: '密码',
        error: '密码长度不能少于6位'
      },
      slots: {
        default: <input type="password" />
      }
    })

    expect(wrapper.text()).toContain('密码长度不能少于6位')
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(FormField, {
      props: {
        name: 'field',
        className: 'custom-field'
      },
      slots: {
        default: <input type="text" />
      }
    })

    expect(wrapper.classes()).toContain('custom-field')
  })
})

describe('FormLabel组件', () => {
  it('应该正确渲染表单标签', () => {
    const wrapper = mount(FormLabel, {
      slots: {
        default: '标签文本'
      }
    })

    expect(wrapper.text()).toBe('标签文本')
    expect(wrapper.classes()).toContain('block')
    expect(wrapper.classes()).toContain('text-sm')
  })
})

describe('FormError组件', () => {
  it('应该正确渲染错误信息', () => {
    const wrapper = mount(FormError, {
      slots: {
        default: '错误信息'
      }
    })

    expect(wrapper.text()).toBe('错误信息')
    expect(wrapper.classes()).toContain('text-danger-600')
  })
})

describe('Form组合使用', () => {
  it('应该正确组合使用Form子组件', () => {
    const wrapper = mount(Form, {
      slots: {
        default: (
          <>
            <FormField name="username" label="用户名" required>
              <input type="text" />
            </FormField>
            <FormField name="password" label="密码" required>
              <input type="password" />
            </FormField>
          </>
        )
      }
    })

    expect(wrapper.text()).toContain('用户名')
    expect(wrapper.text()).toContain('密码')
  })
})
