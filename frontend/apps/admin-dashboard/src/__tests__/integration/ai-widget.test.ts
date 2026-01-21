import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AIWidget from '@/components/AIWidget/index.vue'
import { ElMessage } from 'element-plus'

vi.mock('element-plus', () => ({
  ElMessage: {
    error: vi.fn(),
  },
}))

describe('AIWidget Integration', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(AIWidget)
  })

  it('应该正确渲染AI Widget组件', () => {
    expect(wrapper.find('.ai-widget-container').exists()).toBe(true)
    expect(wrapper.find('.ai-widget-button').exists()).toBe(true)
  })

  it('点击按钮应该打开/关闭Widget面板', async () => {
    const button = wrapper.find('.ai-widget-button')
    await button.trigger('click')
    expect(wrapper.find('.ai-widget-panel').exists()).toBe(true)

    await button.trigger('click')
    expect(wrapper.find('.ai-widget-panel').exists()).toBe(false)
  })

  it('应该显示初始欢迎消息', () => {
    expect(wrapper.vm.messages).toHaveLength(1)
    expect(wrapper.vm.messages[0].role).toBe('assistant')
    expect(wrapper.vm.messages[0].content).toContain('你好！我是YYC³ AI助手')
  })

  it('应该能够发送消息', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          content: '测试回复',
          toolCalls: [],
        }),
      })
    ) as any

    wrapper.vm.inputMessage = '测试消息'
    await wrapper.vm.sendMessage()

    expect(wrapper.vm.messages).toHaveLength(2)
    expect(wrapper.vm.messages[1].role).toBe('user')
    expect(wrapper.vm.messages[1].content).toBe('测试消息')
  })

  it('应该处理API错误', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
      })
    ) as any

    wrapper.vm.inputMessage = '测试消息'
    await wrapper.vm.sendMessage()

    expect(ElMessage.error).toHaveBeenCalledWith('AI服务暂时不可用，请稍后再试')
  })

  it('应该显示工具调用信息', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          content: '执行完成',
          toolCalls: [
            { name: 'search_orders', result: { orders: [] } },
            { name: 'get_revenue_stats', result: { revenue: 10000 } },
          ],
        }),
      })
    ) as any

    wrapper.vm.inputMessage = '查询订单'
    await wrapper.vm.sendMessage()

    const lastMessage = wrapper.vm.messages[wrapper.vm.messages.length - 1]
    expect(lastMessage.toolCalls).toHaveLength(2)
    expect(lastMessage.toolCalls[0].name).toBe('search_orders')
  })

  it('应该自动滚动到底部', async () => {
    const scrollToBottomSpy = vi.spyOn(wrapper.vm, 'scrollToBottom')
    const button = wrapper.find('.ai-widget-button')
    await button.trigger('click')

    await wrapper.vm.$nextTick()
    expect(scrollToBottomSpy).toHaveBeenCalled()
  })
})
