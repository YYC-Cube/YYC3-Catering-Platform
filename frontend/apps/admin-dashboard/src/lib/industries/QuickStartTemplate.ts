/**
 * YYC³ 多行业AI快速启动模板
 * @description 快速启动和配置多行业AI系统
 */

import { AutonomousAIEngine } from '../ai-widget/AutonomousAIEngine';
import { AutonomousAIConfig } from '../ai-widget/types';
import { QuickStartConfig, IntegrationResult, IntegrationConfig } from './types';
import { IndustryAdapter } from './IndustryAdapter';
import { BusinessManagementAI } from './business-management/BusinessManagementAI';
import { DevOpsAI } from './operations-analysis/DevOpsAI';
import { ProjectManagementAI } from './project-management/ProjectManagementAI';
import { NotificationAI } from './notification-management/NotificationAI';

export class QuickStartTemplate {
  private static instance: QuickStartTemplate;
  private industryAdapter: IndustryAdapter;
  private businessAI: BusinessManagementAI;
  private devOpsAI: DevOpsAI;
  private projectAI: ProjectManagementAI;
  private notificationAI: NotificationAI;

  private constructor() {
    this.industryAdapter = new IndustryAdapter();
    this.businessAI = BusinessManagementAI.getInstance();
    this.devOpsAI = DevOpsAI.getInstance();
    this.projectAI = ProjectManagementAI.getInstance();
    this.notificationAI = NotificationAI.getInstance();
  }

  static getInstance(): QuickStartTemplate {
    if (!QuickStartTemplate.instance) {
      QuickStartTemplate.instance = new QuickStartTemplate();
    }
    return QuickStartTemplate.instance;
  }

  /**
   * 快速启动AI系统
   */
  async quickStart(config: QuickStartConfig): Promise<AutonomousAIEngine> {
    const { industry, userRole, ...aiConfig } = config;

    switch (industry) {
      case 'business_management':
        return this.businessAI.createManagerAI(userRole);
      case 'operations_analysis':
        return this.devOpsAI.createDevOpsAI(userRole);
      case 'project_management':
        return this.projectAI.createProjectAI(userRole);
      case 'notification_management':
        return this.notificationAI.createNotificationAI(userRole);
      default:
        return this.industryAdapter.createIndustryAI(industry, userRole, aiConfig);
    }
  }

  /**
   * 集成外部系统
   */
  async integrateSystem(
    systemType: string,
    config: IntegrationConfig[string]
  ): Promise<IntegrationResult> {
    const startTime = Date.now();

    try {
      const result: IntegrationResult = {
        success: true,
        systemType,
        connectedAt: new Date(),
        capabilities: [],
        healthCheck: {
          status: 'healthy',
          latency: Date.now() - startTime,
          lastChecked: new Date(),
        },
      };

      switch (systemType) {
        case 'database':
          result.capabilities = ['read', 'write', 'query'];
          break;
        case 'api':
          result.capabilities = ['get', 'post', 'put', 'delete'];
          break;
        case 'storage':
          result.capabilities = ['upload', 'download', 'delete'];
          break;
        case 'analytics':
          result.capabilities = ['track', 'analyze', 'report'];
          break;
        default:
          result.capabilities = ['basic'];
      }

      return result;
    } catch (error) {
      return {
        success: false,
        systemType,
        connectedAt: new Date(),
        capabilities: [],
        healthCheck: {
          status: 'unhealthy',
          latency: Date.now() - startTime,
          lastChecked: new Date(),
          issues: [error instanceof Error ? error.message : 'Unknown error'],
        },
      };
    }
  }

  /**
   * 批量集成多个系统
   */
  async integrateSystems(
    configs: IntegrationConfig
  ): Promise<Map<string, IntegrationResult>> {
    const results = new Map<string, IntegrationResult>();

    for (const [systemType, config] of Object.entries(configs)) {
      const result = await this.integrateSystem(systemType, config);
      results.set(systemType, result);
    }

    return results;
  }

  /**
   * 获取推荐的快速启动配置
   */
  getRecommendedConfigs(): QuickStartConfig[] {
    return [
      {
        industry: 'business_management',
        userRole: 'ceo',
        apiType: 'internal',
        modelName: 'yyc3-ceo-assistant',
        position: 'bottom-right',
        environment: 'production',
      },
      {
        industry: 'operations_analysis',
        userRole: 'devops_engineer',
        apiType: 'internal',
        modelName: 'yyc3-devops-assistant',
        position: 'bottom-right',
        environment: 'production',
      },
      {
        industry: 'project_management',
        userRole: 'project_manager',
        apiType: 'internal',
        modelName: 'yyc3-pm-assistant',
        position: 'bottom-right',
        environment: 'production',
      },
      {
        industry: 'notification_management',
        userRole: 'marketing_specialist',
        apiType: 'internal',
        modelName: 'yyc3-marketing-assistant',
        position: 'bottom-right',
        environment: 'production',
      },
    ];
  }

  /**
   * 获取支持的行业列表
   */
  getSupportedIndustries() {
    return this.industryAdapter.getSupportedIndustries();
  }

  /**
   * 获取支持的角色列表
   */
  getSupportedPersonas(industry?: string) {
    return this.industryAdapter.getSupportedPersonas(industry);
  }

  /**
   * 创建自定义AI配置
   */
  createCustomConfig(
    baseConfig: QuickStartConfig,
    customizations: Partial<AutonomousAIConfig>
  ): AutonomousAIConfig {
    return {
      apiType: baseConfig.apiType || 'internal',
      modelName: baseConfig.modelName || 'yyc3-custom-assistant',
      enableLearning: true,
      enableMemory: true,
      enableToolUse: true,
      enableContextAwareness: true,
      position: baseConfig.position || 'bottom-right',
      theme: 'light',
      language: 'zh-CN',
      businessContext: {
        industry: baseConfig.industry,
        userRole: baseConfig.userRole,
        availableFeatures: [],
      },
      ...customizations,
    };
  }

  /**
   * 验证配置
   */
  validateConfig(config: QuickStartConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.industry) {
      errors.push('行业不能为空');
    }

    if (!config.userRole) {
      errors.push('用户角色不能为空');
    }

    if (!this.getSupportedIndustries().find((i) => i.id === config.industry)) {
      errors.push(`不支持的行业: ${config.industry}`);
    }

    if (!this.getSupportedPersonas(config.industry).find((p) => p.personaId === config.userRole)) {
      errors.push(`不支持的角色: ${config.userRole}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * 导出配置
   */
  exportConfig(config: QuickStartConfig): string {
    return JSON.stringify(config, null, 2);
  }

  /**
   * 导入配置
   */
  importConfig(configJson: string): QuickStartConfig {
    try {
      return JSON.parse(configJson);
    } catch (error) {
      throw new Error('配置格式错误');
    }
  }
}
