<template>
  <div class="closed-loop-management">
    <el-page-header @back="goBack" title="闭环管理">
      <template #content>
        <div class="page-header-content">
          <el-icon><DataAnalysis /></el-icon>
          <span>闭环价值创造与优化系统</span>
        </div>
      </template>
    </el-page-header>

    <div class="management-content">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="metric-card">
            <div class="metric-content">
              <div class="metric-icon success">
                <el-icon><TrendCharts /></el-icon>
              </div>
              <div class="metric-info">
                <div class="metric-value">{{ metrics.goalCompletion }}%</div>
                <div class="metric-label">目标完成度</div>
                <div class="metric-trend" :class="metrics.goalTrend">
                  <el-icon><ArrowUp /></el-icon>
                  +{{ metrics.goalChange }}%
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card class="metric-card">
            <div class="metric-content">
              <div class="metric-icon primary">
                <el-icon><Money /></el-icon>
              </div>
              <div class="metric-info">
                <div class="metric-value">{{ metrics.roiScore }}</div>
                <div class="metric-label">ROI 分数</div>
                <div class="metric-trend" :class="metrics.roiTrend">
                  <el-icon><ArrowUp /></el-icon>
                  +{{ metrics.roiChange }}
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card class="metric-card">
            <div class="metric-content">
              <div class="metric-icon warning">
                <el-icon><User /></el-icon>
              </div>
              <div class="metric-info">
                <div class="metric-value">{{ metrics.userSatisfaction }}/5</div>
                <div class="metric-label">用户满意度</div>
                <div class="metric-trend" :class="metrics.satisfactionTrend">
                  <el-icon><ArrowUp /></el-icon>
                  +{{ metrics.satisfactionChange }}
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card class="metric-card">
            <div class="metric-content">
              <div class="metric-icon info">
                <el-icon><Lightning /></el-icon>
              </div>
              <div class="metric-info">
                <div class="metric-value">{{ metrics.learningSpeed }}%</div>
                <div class="metric-label">学习速度</div>
                <div class="metric-trend" :class="metrics.learningTrend">
                  <el-icon><ArrowUp /></el-icon>
                  +{{ metrics.learningChange }}%
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="16">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>周期执行监控</span>
                <el-button type="primary" @click="executeCycle" :loading="isExecuting">
                  <el-icon><VideoPlay /></el-icon>
                  执行新周期
                </el-button>
              </div>
            </template>

            <el-timeline>
              <el-timeline-item
                v-for="cycle in cycles"
                :key="cycle.id"
                :timestamp="cycle.timestamp"
                :type="cycle.status"
              >
                <div class="cycle-item">
                  <div class="cycle-title">{{ cycle.title }}</div>
                  <div class="cycle-description">{{ cycle.description }}</div>
                  <div class="cycle-metrics">
                    <el-tag size="small">目标: {{ cycle.goalCompletion }}%</el-tag>
                    <el-tag size="small" type="success">ROI: {{ cycle.roiScore }}</el-tag>
                    <el-tag size="small" type="warning">满意度: {{ cycle.satisfaction }}/5</el-tag>
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card>
            <template #header>
              <span>关键洞察</span>
            </template>

            <div class="insights-list">
              <div
                v-for="insight in insights"
                :key="insight.id"
                class="insight-item"
                :class="insight.type"
              >
                <div class="insight-icon">
                  <el-icon>
                    <component :is="insight.icon" />
                  </el-icon>
                </div>
                <div class="insight-content">
                  <div class="insight-title">{{ insight.title }}</div>
                  <div class="insight-description">{{ insight.description }}</div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="12">
          <el-card>
            <template #header>
              <span>价值验证</span>
            </template>

            <div class="value-validation">
              <el-descriptions :column="2" border>
                <el-descriptions-item label="开发成本">
                  ¥{{ valueValidation.developmentCost.toLocaleString() }}
                </el-descriptions-item>
                <el-descriptions-item label="年度收益">
                  ¥{{ valueValidation.annualRevenue.toLocaleString() }}
                </el-descriptions-item>
                <el-descriptions-item label="回报周期">
                  {{ valueValidation.paybackPeriod }} 个月
                </el-descriptions-item>
                <el-descriptions-item label="NPV (3年)">
                  ¥{{ valueValidation.npv.toLocaleString() }}
                </el-descriptions-item>
                <el-descriptions-item label="投资回报率">
                  {{ valueValidation.roi }}%
                </el-descriptions-item>
                <el-descriptions-item label="采用率">
                  {{ valueValidation.adoptionRate }}%
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card>
            <template #header>
              <span>下一周期规划</span>
            </template>

            <div class="next-cycle">
              <el-form label-width="100px">
                <el-form-item label="聚焦领域">
                  <el-tag
                    v-for="focus in nextCycle.focus"
                    :key="focus"
                    style="margin-right: 8px"
                  >
                    {{ focus }}
                  </el-tag>
                </el-form-item>

                <el-form-item label="成功标准">
                  <ul>
                    <li v-for="criterion in nextCycle.successCriteria" :key="criterion">
                      {{ criterion }}
                    </li>
                  </ul>
                </el-form-item>

                <el-form-item label="资源分配">
                  <el-progress
                    :percentage="nextCycle.resourceAllocation"
                    :color="['#409eff', '#67c23a', '#e6a23c']"
                  />
                </el-form-item>

                <el-form-item label="预计完成">
                  <el-date-picker
                    v-model="nextCycle.estimatedCompletion"
                    type="date"
                    placeholder="选择日期"
                    disabled
                  />
                </el-form-item>
              </el-form>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  DataAnalysis,
  TrendCharts,
  Money,
  User,
  Lightning,
  ArrowUp,
  VideoPlay,
  CircleCheck,
  Warning,
  InfoFilled,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

const metrics = ref({
  goalCompletion: 78,
  goalChange: 13,
  goalTrend: 'up',
  roiScore: 72,
  roiChange: 12,
  roiTrend: 'up',
  userSatisfaction: 4.6,
  satisfactionChange: 0.4,
  satisfactionTrend: 'up',
  learningSpeed: 85,
  learningChange: 8,
  learningTrend: 'up',
})

const isExecuting = ref(false)

const cycles = ref([
  {
    id: '1',
    title: '周期 #1',
    description: '初始优化周期，完成基础功能验证',
    timestamp: '2024-12-15',
    status: 'success',
    goalCompletion: 78,
    roiScore: 72,
    satisfaction: 4.6,
  },
  {
    id: '2',
    title: '周期 #2',
    description: '性能优化周期，提升系统响应速度',
    timestamp: '2024-12-29',
    status: 'primary',
    goalCompletion: 85,
    roiScore: 78,
    satisfaction: 4.7,
  },
])

const insights = ref([
  {
    id: '1',
    type: 'success',
    icon: CircleCheck,
    title: 'AI智能化能力领先',
    description: 'AI助手准确率达到92%，用户满意度提升15%',
  },
  {
    id: '2',
    type: 'warning',
    icon: Warning,
    title: '移动端体验待优化',
    description: '移动端加载时间较长，建议进行性能优化',
  },
  {
    id: '3',
    type: 'info',
    icon: InfoFilled,
    title: '批量操作需求增加',
    description: '用户反馈需要更多批量操作功能',
  },
])

const valueValidation = ref({
  developmentCost: 1030000,
  annualRevenue: 1250000,
  paybackPeriod: 10,
  npv: 2100000,
  roi: 121,
  adoptionRate: 87.5,
})

const nextCycle = ref({
  focus: ['移动端优化', '批量操作', '报表定制'],
  successCriteria: [
    '移动端加载时间 < 2秒',
    '批量操作覆盖80%场景',
    '报表定制功能上线',
  ],
  resourceAllocation: 85,
  estimatedCompletion: new Date('2025-01-15'),
})

const goBack = () => {
  router.back()
}

const executeCycle = async () => {
  isExecuting.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 2000))

    ElMessage.success('新周期执行成功！')

    cycles.value.unshift({
      id: String(cycles.value.length + 1),
      title: `周期 #${cycles.value.length + 1}`,
      description: '自动执行的新优化周期',
      timestamp: new Date().toISOString().split('T')[0],
      status: 'primary',
      goalCompletion: 82,
      roiScore: 75,
      satisfaction: 4.7,
    })
  } catch (error) {
    console.error('Execute cycle error:', error)
    ElMessage.error('周期执行失败，请稍后再试')
  } finally {
    isExecuting.value = false
  }
}
</script>

<style scoped>
.closed-loop-management {
  padding: 24px;
}

.page-header-content {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
}

.management-content {
  margin-top: 24px;
}

.metric-card {
  height: 120px;
}

.metric-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.metric-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.metric-icon.success {
  background: #d1fae5;
  color: #059669;
}

.metric-icon.primary {
  background: #dbeafe;
  color: #2563eb;
}

.metric-icon.warning {
  background: #fef3c7;
  color: #d97706;
}

.metric-icon.info {
  background: #e0e7ff;
  color: #4f46e5;
}

.metric-info {
  flex: 1;
}

.metric-value {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
}

.metric-label {
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
}

.metric-trend {
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 2px;
}

.metric-trend.up {
  color: #059669;
}

.metric-trend.down {
  color: #dc2626;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cycle-item {
  padding: 8px 0;
}

.cycle-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.cycle-description {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 8px;
}

.cycle-metrics {
  display: flex;
  gap: 8px;
}

.insights-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.insight-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: #f9fafb;
}

.insight-item.success {
  background: #ecfdf5;
  border-left: 4px solid #10b981;
}

.insight-item.warning {
  background: #fffbeb;
  border-left: 4px solid #f59e0b;
}

.insight-item.info {
  background: #eff6ff;
  border-left: 4px solid #3b82f6;
}

.insight-icon {
  font-size: 20px;
  margin-top: 2px;
}

.insight-content {
  flex: 1;
}

.insight-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.insight-description {
  font-size: 14px;
  color: #6b7280;
}

.value-validation {
  padding: 16px;
}

.next-cycle {
  padding: 16px;
}

.next-cycle ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.next-cycle li {
  padding: 4px 0;
  color: #6b7280;
}
</style>
