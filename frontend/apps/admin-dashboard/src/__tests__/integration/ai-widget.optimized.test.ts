import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AIWidget from '@/components/AIWidget/index.vue'
import { ElMessage } from 'element-plus'

vi.mock('element-plus', () => ({
  ElMessage: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

describe('AIWidget 优化测试套件', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(AIWidget)
  })

  afterEach(() => {
    wrapper?.unmount()
  })

  describe('组件渲染测试', () => {
    it('应该正确渲染AI Widget容器', () => {
      expect(wrapper.find('.ai-widget-container').exists()).toBe(true)
      expect(wrapper.find('.ai-widget-button').exists()).toBe(true)
    })

    it('应该正确渲染聊天图标', () => {
      const button = wrapper.find('.ai-widget-button')
      expect(button.find('.el-icon').exists()).toBe(true)
    })

    it('初始状态下Widget面板应该隐藏', () => {
      expect(wrapper.vm.isOpen).toBe(false)
      expect(wrapper.find('.ai-widget-panel').exists()).toBe(false)
    })
  })

  describe('交互行为测试', () => {
    it('点击按钮应该打开Widget面板', async () => {
      const button = wrapper.find('.ai-widget-button')
      await button.trigger('click')

      expect(wrapper.vm.isOpen).toBe(true)
      expect(wrapper.find('.ai-widget-panel').exists()).toBe(true)
    })

    it('再次点击按钮应该关闭Widget面板', async () => {
      const button = wrapper.find('.ai-widget-button')
      await button.trigger('click')
      await button.trigger('click')

      expect(wrapper.vm.isOpen).toBe(false)
      expect(wrapper.find('.ai-widget-panel').exists()).toBe(false)
    })

    it('点击关闭按钮应该关闭Widget面板', async () => {
      const button = wrapper.find('.ai-widget-button')
      await button.trigger('click')

      const closeButton = wrapper.find('.widget-header .el-button')
      await closeButton.trigger('click')

      expect(wrapper.vm.isOpen).toBe(false)
    })
  })

  describe('消息处理测试', () => {
    it('应该显示初始欢迎消息', () => {
      expect(wrapper.vm.messages).toHaveLength(1)
      expect(wrapper.vm.messages[0].role).toBe('assistant')
      expect(wrapper.vm.messages[0].content).toContain('你好！我是YYC³ AI助手')
    })

    it('应该能够发送用户消息', async () => {
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

    it('应该能够接收AI回复', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            content: '这是AI的回复',
            toolCalls: [],
          }),
        })
      ) as any

      wrapper.vm.inputMessage = '用户消息'
      await wrapper.vm.sendMessage()

      expect(wrapper.vm.messages).toHaveLength(2)
      expect(wrapper.vm.messages[1].role).toBe('assistant')
      expect(wrapper.vm.messages[1].content).toBe('这是AI的回复')
    })

    it('空消息不应该发送', async () => {
      const initialLength = wrapper.vm.messages.length
      wrapper.vm.inputMessage = '   '
      await wrapper.vm.sendMessage()

      expect(wrapper.vm.messages.length).toBe(initialLength)
    })

    it('加载状态下不应该发送消息', async () => {
      wrapper.vm.isLoading = true
      wrapper.vm.inputMessage = '测试消息'
      await wrapper.vm.sendMessage()

      expect(wrapper.vm.messages.length).toBe(1)
    })
  })

  describe('工具调用测试', () => {
    it('应该正确显示工具调用信息', async () => {
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
      expect(lastMessage.toolCalls[1].name).toBe('get_revenue_stats')
    })

    it('应该正确渲染工具调用UI', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            content: '完成',
            toolCalls: [{ name: 'test_tool', result: {} }],
          }),
        })
      ) as any

      wrapper.vm.inputMessage = '测试'
      await wrapper.vm.sendMessage()

      await wrapper.vm.$nextTick()
      const toolCalls = wrapper.findAll('.tool-call')
      expect(toolCalls.length).toBeGreaterThan(0)
    })
  })

  describe('错误处理测试', () => {
    it('应该处理API错误', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
        })
      ) as any

      wrapper.vm.inputMessage = '测试错误'
      await wrapper.vm.sendMessage()

      expect(ElMessage.error).toHaveBeenCalledWith('AI服务暂时不可用，请稍后再试')
    })

    it('应该处理网络错误', async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error('Network error'))) as any

      wrapper.vm.inputMessage = '测试网络错误'
      await wrapper.vm.sendMessage()

      expect(ElMessage.error).toHaveBeenCalledWith('AI服务暂时不可用，请稍后再试')
    })

    it('应该处理JSON解析错误', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.reject(new Error('Invalid JSON')),
        })
      ) as any

      wrapper.vm.inputMessage = '测试JSON错误'
      await wrapper.vm.sendMessage()

      expect(ElMessage.error).toHaveBeenCalledWith('AI服务暂时不可用，请稍后再试')
    })
  })

  describe('性能测试', () => {
    it('应该在2秒内完成消息发送', async () => {
      global.fetch = vi.fn(() =>
        new Promise(resolve =>
          setTimeout(() => {
            resolve({
              ok: true,
              json: () => Promise.resolve({ content: '快速响应', toolCalls: [] }),
            })
          }, 1000)
        )
      ) as any

      const startTime = Date.now()
      wrapper.vm.inputMessage = '性能测试'
      await wrapper.vm.sendMessage()
      const endTime = Date.now()

      expect(endTime - startTime).toBeLessThan(2000)
    })

    it('应该正确处理大量消息', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ content: '回复', toolCalls: [] }),
        })
      ) as any

      for (let i = 0; i < 10; i++) {
        wrapper.vm.inputMessage = `消息${i}`
        await wrapper.vm.sendMessage()
      }

      expect(wrapper.vm.messages.length).toBe(11)
    })
  })

  describe('可访问性测试', () => {
    it('按钮应该有正确的ARIA属性', () => {
      const button = wrapper.find('.ai-widget-button')
      expect(button.attributes('role')).toBeDefined()
    })

    it('输入框应该有正确的标签', async () => {
      const button = wrapper.find('.ai-widget-button')
      await button.trigger('click')

      await wrapper.vm.$nextTick()
      const input = wrapper.find('.chat-input input')
      expect(input.attributes('placeholder')).toBeDefined()
    })
  })

  describe('边界情况测试', () => {
    it('应该处理超长消息', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ content: 'A'.repeat(10000), toolCalls: [] }),
        })
      ) as any

      wrapper.vm.inputMessage = 'A'.repeat(5000)
      await wrapper.vm.sendMessage()

      expect(wrapper.vm.messages[1].content.length).toBe(10000)
    })

    it('应该处理特殊字符', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ content: '<script>alert("xss")</script>', toolCalls: [] }),
        })
      ) as any

      wrapper.vm.inputMessage = '<script>alert("xss")</script>'
      await wrapper.vm.sendMessage()

      expect(wrapper.vm.messages[1].content).toContain('<script>')
    })

    it('应该处理空工具调用', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ content: '无工具调用', toolCalls: [] }),
        })
      ) as any

      wrapper.vm.inputMessage = '无工具'
      await wrapper.vm.sendMessage()

      const lastMessage = wrapper.vm.messages[wrapper.vm.messages.length - 1]
      expect(lastMessage.toolCalls).toBeUndefined()
    })
  })

  describe('UI交互测试', () => {
    it('应该正确滚动到底部', async () => {
      const scrollToBottomSpy = vi.spyOn(wrapper.vm, 'scrollToBottom')
      const button = wrapper.find('.ai-widget-button')
      await button.trigger('click')

      await wrapper.vm.$nextTick()
      expect(scrollToBottomSpy).toHaveBeenCalled()
    })

    it('应该正确显示加载状态', async () => {
      global.fetch = vi.fn(() =>
        new Promise(resolve =>
          setTimeout(() => {
            resolve({
              ok: true,
              json: () => Promise.resolve({ content: '延迟回复', toolCalls: [] }),
            })
          }, 1000)
        )
      ) as any

      const button = wrapper.find('.ai-widget-button')
      await button.trigger('click')

      wrapper.vm.inputMessage = '测试加载'
      const sendPromise = wrapper.vm.sendMessage()

      expect(wrapper.vm.isLoading).toBe(true)

      await sendPromise
      expect(wrapper.vm.isLoading).toBe(false)
    })
  })
})
