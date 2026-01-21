import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ClosedLoopManagement from '@/views/ClosedLoopManagement.vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
}))

vi.mock('element-plus', () => ({
  ElMessage: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('ClosedLoopManagement Integration', () => {
  let wrapper: any
  let mockRouter: any

  beforeEach(() => {
    mockRouter = {
      back: vi.fn(),
    }
    ;(useRouter as any).mockReturnValue(mockRouter)

    wrapper = mount(ClosedLoopManagement)
  })

  it('应该正确渲染Closed Loop管理页面', () => {
    expect(wrapper.find('.closed-loop-management').exists()).toBe(true)
    expect(wrapper.find('.page-header-content').exists()).toBe(true)
  })

  it('应该显示所有关键指标', () => {
    expect(wrapper.find('.metric-value').exists()).toBe(true)
    expect(wrapper.vm.metrics.goalCompletion).toBe(78)
    expect(wrapper.vm.metrics.roiScore).toBe(72)
    expect(wrapper.vm.metrics.userSatisfaction).toBe(4.6)
    expect(wrapper.vm.metrics.learningSpeed).toBe(85)
  })

  it('应该显示周期执行历史', () => {
    expect(wrapper.vm.cycles).toHaveLength(2)
    expect(wrapper.vm.cycles[0].title).toBe('周期 #1')
    expect(wrapper.vm.cycles[1].title).toBe('周期 #2')
  })

  it('应该显示关键洞察', () => {
    expect(wrapper.vm.insights).toHaveLength(3)
    expect(wrapper.vm.insights[0].type).toBe('success')
    expect(wrapper.vm.insights[1].type).toBe('warning')
    expect(wrapper.vm.insights[2].type).toBe('info')
  })

  it('应该显示价值验证数据', () => {
    expect(wrapper.vm.valueValidation.developmentCost).toBe(1030000)
    expect(wrapper.vm.valueValidation.annualRevenue).toBe(1250000)
    expect(wrapper.vm.valueValidation.paybackPeriod).toBe(10)
    expect(wrapper.vm.valueValidation.npv).toBe(2100000)
    expect(wrapper.vm.valueValidation.roi).toBe(121)
    expect(wrapper.vm.valueValidation.adoptionRate).toBe(87.5)
  })

  it('应该显示下一周期规划', () => {
    expect(wrapper.vm.nextCycle.focus).toContain('移动端优化')
    expect(wrapper.vm.nextCycle.focus).toContain('批量操作')
    expect(wrapper.vm.nextCycle.focus).toContain('报表定制')
    expect(wrapper.vm.nextCycle.resourceAllocation).toBe(85)
  })

  it('应该能够执行新周期', async () => {
    const executeButton = wrapper.find('.el-button--primary')
    await executeButton.trigger('click')

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isExecuting).toBe(false)
    expect(wrapper.vm.cycles).toHaveLength(3)
    expect(wrapper.vm.cycles[0].title).toBe('周期 #3')
    expect(ElMessage.success).toHaveBeenCalledWith('新周期执行成功！')
  })

  it('应该能够返回上一页', () => {
    const backButton = wrapper.find('.el-page-header')
    backButton.vm.$emit('back')

    expect(mockRouter.back).toHaveBeenCalled()
  })

  it('应该正确显示指标趋势', () => {
    expect(wrapper.vm.metrics.goalTrend).toBe('up')
    expect(wrapper.vm.metrics.roiTrend).toBe('up')
    expect(wrapper.vm.metrics.satisfactionTrend).toBe('up')
    expect(wrapper.vm.metrics.learningTrend).toBe('up')
  })

  it('应该正确格式化金额显示', () => {
    const formattedCost = wrapper.vm.valueValidation.developmentCost.toLocaleString()
    expect(formattedCost).toBe('1,030,000')
  })

  it('应该显示周期时间线', () => {
    const timelineItems = wrapper.findAll('.el-timeline-item')
    expect(timelineItems).toHaveLength(2)
  })
})
