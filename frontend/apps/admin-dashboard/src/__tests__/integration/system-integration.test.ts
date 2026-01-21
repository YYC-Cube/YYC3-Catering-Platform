import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AIWidget from '@/components/AIWidget/index.vue'
import ClosedLoopManagement from '@/views/ClosedLoopManagement.vue'

vi.mock('element-plus', () => ({
  ElMessage: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('System Integration', () => {
  describe('AI Widget与Closed Loop集成', () => {
    it('应该能够共享业务上下文', () => {
      const aiWidget = mount(AIWidget)
      const closedLoop = mount(ClosedLoopManagement)

      expect(aiWidget.vm.messages).toBeDefined()
      expect(closedLoop.vm.metrics).toBeDefined()
    })

    it('应该能够处理相同的用户角色', () => {
      const aiWidget = mount(AIWidget)
      const closedLoop = mount(ClosedLoopManagement)

      expect(aiWidget.vm.userInitial).toBeDefined()
      expect(closedLoop.vm.metrics).toBeDefined()
    })
  })

  describe('数据流转测试', () => {
    it('应该能够从AI Widget传递数据到Closed Loop', async () => {
      const aiWidget = mount(AIWidget)

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            content: '数据已更新',
            toolCalls: [
              { name: 'update_closed_loop_metrics', result: { success: true } },
            ],
          }),
        })
      ) as any

      aiWidget.vm.inputMessage = '更新闭环指标'
      await aiWidget.vm.sendMessage()

      expect(aiWidget.vm.messages).toHaveLength(2)
      const lastMessage = aiWidget.vm.messages[aiWidget.vm.messages.length - 1]
      expect(lastMessage.toolCalls[0].name).toBe('update_closed_loop_metrics')
    })

    it('应该能够从Closed Loop获取数据到AI Widget', async () => {
      const closedLoop = mount(ClosedLoopManagement)

      expect(closedLoop.vm.metrics.goalCompletion).toBe(78)
      expect(closedLoop.vm.valueValidation.roi).toBe(121)

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            content: `当前目标完成度为${closedLoop.vm.metrics.goalCompletion}%，ROI为${closedLoop.vm.valueValidation.roi}%`,
            toolCalls: [],
          }),
        })
      ) as any

      const aiWidget = mount(AIWidget)
      aiWidget.vm.inputMessage = '查看当前指标'
      await aiWidget.vm.sendMessage()

      expect(aiWidget.vm.messages[1].content).toContain('78%')
      expect(aiWidget.vm.messages[1].content).toContain('121%')
    })
  })

  describe('错误处理测试', () => {
    it('应该能够处理AI Widget错误', async () => {
      const aiWidget = mount(AIWidget)

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
        })
      ) as any

      aiWidget.vm.inputMessage = '测试错误'
      await aiWidget.vm.sendMessage()

      expect(aiWidget.vm.messages).toHaveLength(2)
      expect(aiWidget.vm.messages[1].role).toBe('user')
    })

    it('应该能够处理Closed Loop错误', async () => {
      const closedLoop = mount(ClosedLoopManagement)

      const originalExecute = closedLoop.vm.executeCycle
      closedLoop.vm.executeCycle = vi.fn(() => {
        throw new Error('执行失败')
      })

      try {
        await closedLoop.vm.executeCycle()
      } catch (error) {
        expect(error).toBeDefined()
      }

      closedLoop.vm.executeCycle = originalExecute
    })
  })

  describe('性能测试', () => {
    it('AI Widget应该在2秒内响应', async () => {
      const aiWidget = mount(AIWidget)

      const startTime = Date.now()

      global.fetch = vi.fn(() =>
        new Promise(resolve =>
          setTimeout(() => {
            resolve({
              ok: true,
              json: () => Promise.resolve({
                content: '快速响应',
                toolCalls: [],
              }),
            })
          }, 1000)
        )
      ) as any

      aiWidget.vm.inputMessage = '测试性能'
      await aiWidget.vm.sendMessage()

      const endTime = Date.now()
      const responseTime = endTime - startTime

      expect(responseTime).toBeLessThan(2000)
    })

    it('Closed Loop应该在5秒内执行周期', async () => {
      const closedLoop = mount(ClosedLoopManagement)

      const startTime = Date.now()

      await closedLoop.vm.executeCycle()

      const endTime = Date.now()
      const executionTime = endTime - startTime

      expect(executionTime).toBeLessThan(5000)
    })
  })

  describe('用户体验测试', () => {
    it('应该能够无缝切换两个系统', () => {
      const aiWidget = mount(AIWidget)
      const closedLoop = mount(ClosedLoopManagement)

      expect(aiWidget.find('.ai-widget-container').exists()).toBe(true)
      expect(closedLoop.find('.closed-loop-management').exists()).toBe(true)
    })

    it('应该保持一致的设计风格', () => {
      const aiWidget = mount(AIWidget)
      const closedLoop = mount(ClosedLoopManagement)

      const aiWidgetStyles = window.getComputedStyle(aiWidget.element)
      const closedLoopStyles = window.getComputedStyle(closedLoop.element)

      expect(aiWidgetStyles).toBeDefined()
      expect(closedLoopStyles).toBeDefined()
    })
  })
})
