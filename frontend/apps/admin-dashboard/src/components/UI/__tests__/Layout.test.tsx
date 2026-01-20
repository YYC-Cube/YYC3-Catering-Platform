/**
 * @fileoverview Layout组件单元测试
 * @description 测试Layout组件的功能
 * @module Layout.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Layout, LayoutHeader, LayoutContent, LayoutSider, LayoutFooter } from '@/components/UI/Layout'

describe('Layout组件', () => {
  it('应该正确渲染默认布局', () => {
    const wrapper = mount(Layout, {
      slots: {
        default: '布局内容'
      }
    })

    expect(wrapper.text()).toContain('布局内容')
  })

  it('应该正确渲染固定布局', () => {
    const wrapper = mount(Layout, {
      props: {
        fixed: true
      },
      slots: {
        default: '固定布局'
      }
    })

    expect(wrapper.classes()).toContain('fixed')
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(Layout, {
      props: {
        className: 'custom-layout'
      },
      slots: {
        default: '自定义布局'
      }
    })

    expect(wrapper.classes()).toContain('custom-layout')
  })
})

describe('LayoutHeader组件', () => {
  it('应该正确渲染布局头部', () => {
    const wrapper = mount(LayoutHeader, {
      slots: {
        default: '头部内容'
      }
    })

    expect(wrapper.text()).toContain('头部内容')
  })

  it('应该正确渲染固定头部', () => {
    const wrapper = mount(LayoutHeader, {
      props: {
        fixed: true
      },
      slots: {
        default: '固定头部'
      }
    })

    expect(wrapper.classes()).toContain('fixed')
  })

  it('应该正确渲染头部高度', () => {
    const wrapper = mount(LayoutHeader, {
      props: {
        height: 80
      },
      slots: {
        default: '自定义高度头部'
      }
    })

    expect(wrapper.attributes('style')).toContain('height: 80px')
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(LayoutHeader, {
      props: {
        className: 'custom-header'
      },
      slots: {
        default: '自定义头部'
      }
    })

    expect(wrapper.classes()).toContain('custom-header')
  })
})

describe('LayoutContent组件', () => {
  it('应该正确渲染布局主体', () => {
    const wrapper = mount(LayoutContent, {
      slots: {
        default: '主体内容'
      }
    })

    expect(wrapper.text()).toContain('主体内容')
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(LayoutContent, {
      props: {
        className: 'custom-content'
      },
      slots: {
        default: '自定义主体'
      }
    })

    expect(wrapper.classes()).toContain('custom-content')
  })
})

describe('LayoutSider组件', () => {
  it('应该正确渲染布局侧边栏', () => {
    const wrapper = mount(LayoutSider, {
      slots: {
        default: '侧边栏内容'
      }
    })

    expect(wrapper.text()).toContain('侧边栏内容')
  })

  it('应该正确渲染左侧侧边栏', () => {
    const wrapper = mount(LayoutSider, {
      props: {
        placement: 'left'
      },
      slots: {
        default: '左侧侧边栏'
      }
    })

    expect(wrapper.classes()).toContain('left')
  })

  it('应该正确渲染右侧侧边栏', () => {
    const wrapper = mount(LayoutSider, {
      props: {
        placement: 'right'
      },
      slots: {
        default: '右侧侧边栏'
      }
    })

    expect(wrapper.classes()).toContain('right')
  })

  it('应该正确渲染侧边栏宽度', () => {
    const wrapper = mount(LayoutSider, {
      props: {
        width: 300
      },
      slots: {
        default: '自定义宽度侧边栏'
      }
    })

    expect(wrapper.attributes('style')).toContain('width: 300px')
  })

  it('应该正确渲染可折叠侧边栏', () => {
    const wrapper = mount(LayoutSider, {
      props: {
        collapsible: true
      },
      slots: {
        default: '可折叠侧边栏'
      }
    })

    expect(wrapper.classes()).toContain('collapsible')
  })

  it('应该正确渲染折叠状态', () => {
    const wrapper = mount(LayoutSider, {
      props: {
        collapsed: true
      },
      slots: {
        default: '折叠侧边栏'
      }
    })

    expect(wrapper.classes()).toContain('collapsed')
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(LayoutSider, {
      props: {
        className: 'custom-sider'
      },
      slots: {
        default: '自定义侧边栏'
      }
    })

    expect(wrapper.classes()).toContain('custom-sider')
  })
})

describe('LayoutFooter组件', () => {
  it('应该正确渲染布局底部', () => {
    const wrapper = mount(LayoutFooter, {
      slots: {
        default: '底部内容'
      }
    })

    expect(wrapper.text()).toContain('底部内容')
  })

  it('应该正确渲染固定底部', () => {
    const wrapper = mount(LayoutFooter, {
      props: {
        fixed: true
      },
      slots: {
        default: '固定底部'
      }
    })

    expect(wrapper.classes()).toContain('fixed')
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(LayoutFooter, {
      props: {
        className: 'custom-footer'
      },
      slots: {
        default: '自定义底部'
      }
    })

    expect(wrapper.classes()).toContain('custom-footer')
  })
})

describe('Layout组合使用', () => {
  it('应该正确组合使用Layout子组件', () => {
    const wrapper = mount(Layout, {
      slots: {
        default: (
          <>
            <LayoutHeader>头部</LayoutHeader>
            <Layout>
              <LayoutSider>侧边栏</LayoutSider>
              <LayoutContent>主体</LayoutContent>
            </Layout>
            <LayoutFooter>底部</LayoutFooter>
          </>
        )
      }
    })

    expect(wrapper.text()).toContain('头部')
    expect(wrapper.text()).toContain('侧边栏')
    expect(wrapper.text()).toContain('主体')
    expect(wrapper.text()).toContain('底部')
  })
})
