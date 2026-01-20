/**
 * @fileoverview Timeline组件单元测试
 * @description 测试Timeline组件的功能
 * @module Timeline.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Timeline, TimelineItem } from '@/components/UI/Timeline'

describe('Timeline组件', () => {
  it('应该正确渲染默认时间轴', () => {
    const wrapper = mount(Timeline, {
      slots: {
        default: '时间轴内容'
      }
    })

    expect(wrapper.text()).toContain('时间轴内容')
  })

  it('应该正确渲染左侧时间轴', () => {
    const wrapper = mount(Timeline, {
      props: {
        position: 'left'
      },
      slots: {
        default: '左侧时间轴'
      }
    })

    expect(wrapper.classes()).toContain('left')
  })

  it('应该正确渲染右侧时间轴', () => {
    const wrapper = mount(Timeline, {
      props: {
        position: 'right'
      },
      slots: {
        default: '右侧时间轴'
      }
    })

    expect(wrapper.classes()).toContain('right')
  })

  it('应该正确渲染交替时间轴', () => {
    const wrapper = mount(Timeline, {
      props: {
        position: 'alternate'
      },
      slots: {
        default: '交替时间轴'
      }
    })

    expect(wrapper.classes()).toContain('alternate')
  })

  it('应该正确渲染反向时间轴', () => {
    const wrapper = mount(Timeline, {
      props: {
        reverse: true
      },
      slots: {
        default: '反向时间轴'
      }
    })

    expect(wrapper.classes()).toContain('reverse')
  })

  it('应该正确渲染带边框的时间轴', () => {
    const wrapper = mount(Timeline, {
      props: {
        bordered: true
      },
      slots: {
        default: '带边框时间轴'
      }
    })

    expect(wrapper.classes()).toContain('bordered')
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(Timeline, {
      props: {
        className: 'custom-timeline'
      },
      slots: {
        default: '自定义时间轴'
      }
    })

    expect(wrapper.classes()).toContain('custom-timeline')
  })
})

describe('TimelineItem组件', () => {
  it('应该正确渲染时间轴项', () => {
    const wrapper = mount(TimelineItem, {
      slots: {
        default: '时间轴项内容'
      }
    })

    expect(wrapper.text()).toContain('时间轴项内容')
  })

  it('应该正确渲染时间', () => {
    const wrapper = mount(TimelineItem, {
      props: {
        time: '2024-01-01'
      },
      slots: {
        default: '内容'
      }
    })

    expect(wrapper.text()).toContain('2024-01-01')
  })

  it('应该正确渲染颜色', () => {
    const wrapper = mount(TimelineItem, {
      props: {
        color: 'primary'
      },
      slots: {
        default: '主要颜色'
      }
    })

    expect(wrapper.classes()).toContain('primary')
  })

  it('应该正确渲染成功颜色', () => {
    const wrapper = mount(TimelineItem, {
      props: {
        color: 'success'
      },
      slots: {
        default: '成功颜色'
      }
    })

    expect(wrapper.classes()).toContain('success')
  })

  it('应该正确渲染警告颜色', () => {
    const wrapper = mount(TimelineItem, {
      props: {
        color: 'warning'
      },
      slots: {
        default: '警告颜色'
      }
    })

    expect(wrapper.classes()).toContain('warning')
  })

  it('应该正确渲染危险颜色', () => {
    const wrapper = mount(TimelineItem, {
      props: {
        color: 'danger'
      },
      slots: {
        default: '危险颜色'
      }
    })

    expect(wrapper.classes()).toContain('danger')
  })

  it('应该正确渲染自定义颜色', () => {
    const wrapper = mount(TimelineItem, {
      props: {
        color: '#ff0000'
      },
      slots: {
        default: '自定义颜色'
      }
    })

    expect(wrapper.classes()).toContain('custom-color')
  })

  it('应该正确渲染图标', () => {
    const wrapper = mount(TimelineItem, {
      slots: {
        dot: <span>🔔</span>,
        default: '带图标'
      }
    })

    expect(wrapper.text()).toContain('🔔')
  })

  it('应该正确渲染禁用状态', () => {
    const wrapper = mount(TimelineItem, {
      props: {
        disabled: true
      },
      slots: {
        default: '禁用项'
      }
    })

    expect(wrapper.classes()).toContain('opacity-50')
  })

  it('应该正确应用自定义类名', () => {
    const wrapper = mount(TimelineItem, {
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

describe('Timeline组合使用', () => {
  it('应该正确组合使用Timeline子组件', () => {
    const wrapper = mount(Timeline, {
      slots: {
        default: (
          <>
            <TimelineItem time="2024-01-01" color="primary">
              项目启动
            </TimelineItem>
            <TimelineItem time="2024-02-01" color="success">
              开发完成
            </TimelineItem>
            <TimelineItem time="2024-03-01" color="warning">
              测试中
            </TimelineItem>
            <TimelineItem time="2024-04-01" color="danger">
              上线
            </TimelineItem>
          </>
        )
      }
    })

    expect(wrapper.text()).toContain('项目启动')
    expect(wrapper.text()).toContain('开发完成')
    expect(wrapper.text()).toContain('测试中')
    expect(wrapper.text()).toContain('上线')
  })
})
