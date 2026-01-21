/**
 * YYC³ 行业通用适配层
 * @description 支持多行业场景的智能适配系统
 */

import { AutonomousAIEngine } from '../ai-widget/AutonomousAIEngine';
import { AutonomousAIConfig, AITool } from '../ai-widget/types';
import {
  IndustryConfiguration,
  PersonaConfiguration,
  QuickStartConfig,
} from './types';

export class IndustryAdapter {
  private industryConfigs: Map<string, IndustryConfiguration> = new Map();
  private personaConfigs: Map<string, PersonaConfiguration> = new Map();

  constructor() {
    this.initializeIndustryConfigs();
    this.initializePersonaConfigs();
  }

  private initializeIndustryConfigs(): void {
    this.industryConfigs.set('business_management', {
      id: 'business_management',
      name: '经营管理',
      description: '企业战略、运营、财务、人力资源等管理场景',
      personas: ['ceo', 'cfo', 'coo', 'hr_director', 'project_manager'],
      capabilities: [
        'strategic_planning',
        'financial_analysis',
        'kpi_tracking',
        'resource_optimization',
        'risk_assessment',
      ],
      tools: [],
      dataSources: [],
      successMetrics: this.getBusinessManagementMetrics(),
    });

    this.industryConfigs.set('operations_analysis', {
      id: 'operations_analysis',
      name: '运维分析',
      description: '系统监控、性能分析、故障预测、容量规划',
      personas: ['devops_engineer', 'system_analyst', 'it_manager', 'security_analyst'],
      capabilities: [
        'system_monitoring',
        'performance_analysis',
        'anomaly_detection',
        'capacity_planning',
        'incident_management',
      ],
      tools: [],
      dataSources: [],
      successMetrics: this.getOperationsAnalysisMetrics(),
    });

    this.industryConfigs.set('project_management', {
      id: 'project_management',
      name: '项目管理',
      description: '项目规划、执行、监控、资源管理',
      personas: ['project_manager', 'scrum_master', 'product_owner', 'team_lead'],
      capabilities: [
        'project_planning',
        'resource_allocation',
        'progress_tracking',
        'risk_management',
        'stakeholder_communication',
      ],
      tools: [],
      dataSources: [],
      successMetrics: this.getProjectManagementMetrics(),
    });

    this.industryConfigs.set('notification_management', {
      id: 'notification_management',
      name: '通知系统管理',
      description: '消息推送、用户触达、模板管理、效果分析',
      personas: ['system_admin', 'marketing_specialist', 'product_manager'],
      capabilities: [
        'notification_analytics',
        'template_optimization',
        'user_segmentation',
        'engagement_analysis',
      ],
      tools: [],
      dataSources: [],
      successMetrics: this.getNotificationMetrics(),
    });
  }

  private initializePersonaConfigs(): void {
    this.personaConfigs.set('ceo', {
      personaId: 'ceo',
      personaName: '首席执行官',
      industry: 'business_management',
      responsibilities: ['战略规划', '重大决策', '业绩监控', '投资者关系'],
      decisionAuthority: {
        level: 'executive',
        domains: ['strategy', 'finance', 'operations', 'hr'],
        approvalRequired: false,
      },
      informationNeeds: {
        realTimeData: ['公司业绩', '市场动态', '竞争对手'],
        periodicReports: ['季度财报', '战略进展', 'KPI达成'],
        alerts: ['重大风险', '战略偏差', '紧急事件'],
        analytics: ['趋势分析', '市场洞察', '投资回报'],
      },
      preferredCommunicationStyle: {
        formality: 'formal',
        detailLevel: 'executive_summary',
        preferredFormat: 'mixed',
      },
    });

    this.personaConfigs.set('devops_engineer', {
      personaId: 'devops_engineer',
      personaName: 'DevOps工程师',
      industry: 'operations_analysis',
      responsibilities: ['系统运维', '性能优化', '故障处理', '自动化部署'],
      decisionAuthority: {
        level: 'operational',
        domains: ['infrastructure', 'deployment', 'monitoring'],
        approvalRequired: true,
      },
      informationNeeds: {
        realTimeData: ['系统状态', '性能指标', '告警信息'],
        periodicReports: ['运维报告', '性能趋势', '容量规划'],
        alerts: ['系统故障', '性能异常', 'SLA违反'],
        analytics: ['趋势预测', '根因分析', '容量预测'],
      },
      preferredCommunicationStyle: {
        formality: 'professional',
        detailLevel: 'detailed',
        preferredFormat: 'mixed',
      },
    });

    this.personaConfigs.set('project_manager', {
      personaId: 'project_manager',
      personaName: '项目经理',
      industry: 'project_management',
      responsibilities: ['项目规划', '进度管理', '风险控制', '资源协调'],
      decisionAuthority: {
        level: 'tactical',
        domains: ['project_scope', 'team_allocation', 'timeline'],
        approvalRequired: true,
      },
      informationNeeds: {
        realTimeData: ['项目进度', '资源状态', '风险预警'],
        periodicReports: ['周报', '里程碑报告', '预算报告'],
        alerts: ['进度偏差', '资源冲突', '风险升级'],
        analytics: ['进度预测', '资源优化', '成本分析'],
      },
      preferredCommunicationStyle: {
        formality: 'professional',
        detailLevel: 'detailed',
        preferredFormat: 'mixed',
      },
    });
  }

  async createIndustryAI(
    industry: string,
    userPersona: string,
    config?: Partial<AutonomousAIConfig>
  ): Promise<AutonomousAIEngine> {
    const industryConfig = this.industryConfigs.get(industry);
    if (!industryConfig) {
      throw new Error(`不支持的行业: ${industry}`);
    }

    const personaConfig = this.personaConfigs.get(userPersona);
    if (!personaConfig) {
      throw new Error(`不支持的角色: ${userPersona}`);
    }

    const aiConfig: AutonomousAIConfig = {
      apiType: config?.apiType || 'internal',
      modelName: config?.modelName || `yyc3-${industry}-specialized`,
      enableLearning: true,
      enableMemory: true,
      enableToolUse: true,
      enableContextAwareness: true,
      position: config?.position || 'bottom-right',
      theme: config?.theme || 'light',
      language: config?.language || 'zh-CN',
      businessContext: {
        industry: industryConfig.id,
        userRole: userPersona,
        availableFeatures: industryConfig.capabilities,
        permissions: personaConfig.decisionAuthority.domains,
      },
      ...config,
    };

    return new AutonomousAIEngine(aiConfig);
  }

  getIndustryConfig(industry: string): IndustryConfiguration | undefined {
    return this.industryConfigs.get(industry);
  }

  getPersonaConfig(persona: string): PersonaConfiguration | undefined {
    return this.personaConfigs.get(persona);
  }

  getSupportedIndustries(): IndustryConfiguration[] {
    return Array.from(this.industryConfigs.values());
  }

  getSupportedPersonas(industry?: string): PersonaConfiguration[] {
    const personas = Array.from(this.personaConfigs.values());
    if (industry) {
      return personas.filter((p) => p.industry === industry);
    }
    return personas;
  }

  private getBusinessManagementMetrics(): any {
    return {
      strategic: [
        { id: 'goal_achievement_rate', name: '目标达成率', description: '战略目标的完成百分比', target: 85, unit: '%' },
        { id: 'strategic_initiative_progress', name: '战略计划进展', description: '关键战略计划的推进速度', target: 90, unit: '%' },
      ],
      operational: [
        { id: 'process_optimization_rate', name: '流程优化率', description: '业务流程优化的提升幅度', target: 20, unit: '%' },
        { id: 'resource_utilization', name: '资源利用率', description: '企业资源的有效利用程度', target: 85, unit: '%' },
      ],
      financial: [
        { id: 'roi_improvement', name: '投资回报率提升', description: 'ROI的年度增长', target: 15, unit: '%' },
        { id: 'cost_reduction', name: '成本降低', description: '运营成本的优化幅度', target: 10, unit: '%' },
      ],
    };
  }

  private getOperationsAnalysisMetrics(): any {
    return {
      strategic: [
        { id: 'system_uptime', name: '系统可用率', description: '系统正常运行时间百分比', target: 99.9, unit: '%' },
        { id: 'incident_reduction', name: '事故减少率', description: '运维事故的年度降低幅度', target: 30, unit: '%' },
      ],
      operational: [
        { id: 'mttr', name: '平均恢复时间', description: '系统故障的平均修复时长', target: 30, unit: 'minutes' },
        { id: 'automation_rate', name: '自动化率', description: '运维任务的自动化覆盖度', target: 80, unit: '%' },
      ],
      financial: [
        { id: 'infrastructure_cost_savings', name: '基础设施成本节约', description: '通过优化节省的基础设施开支', target: 15, unit: '%' },
      ],
    };
  }

  private getProjectManagementMetrics(): any {
    return {
      strategic: [
        { id: 'on_time_delivery', name: '按时交付率', description: '项目按时完成的百分比', target: 90, unit: '%' },
      ],
      operational: [
        { id: 'resource_efficiency', name: '资源效率', description: '项目资源的有效利用率', target: 85, unit: '%' },
      ],
      financial: [
        { id: 'budget_adherence', name: '预算遵守率', description: '项目预算控制的准确度', target: 95, unit: '%' },
      ],
    };
  }

  private getNotificationMetrics(): any {
    return {
      strategic: [
        { id: 'user_engagement', name: '用户参与度', description: '通知的用户互动率', target: 25, unit: '%' },
      ],
      operational: [
        { id: 'delivery_rate', name: '送达率', description: '通知成功送达的百分比', target: 98, unit: '%' },
      ],
      financial: [
        { id: 'conversion_rate', name: '转化率', description: '通知带来的实际转化', target: 5, unit: '%' },
      ],
    };
  }
}
