/**
 * YYC³ 项目管理AI配置系统
 * @description 项目经理、Scrum Master、产品负责人等项目管理人员专用AI助手
 */

import { AutonomousAIEngine } from '../ai-widget/AutonomousAIEngine';
import { AutonomousAIConfig, AITool, ToolResult } from '../ai-widget/types';

export class ProjectManagementAI {
  private static instance: ProjectManagementAI;

  private constructor() {}

  static getInstance(): ProjectManagementAI {
    if (!ProjectManagementAI.instance) {
      ProjectManagementAI.instance = new ProjectManagementAI();
    }
    return ProjectManagementAI.instance;
  }

  async createProjectAI(role: string): Promise<AutonomousAIEngine> {
    const config: AutonomousAIConfig = {
      apiType: 'internal',
      modelName: `yyc3-project-${role}-specialist`,
      enableLearning: true,
      enableMemory: true,
      enableToolUse: true,
      enableContextAwareness: true,
      position: 'bottom-right',
      theme: 'light',
      language: 'zh-CN',
      businessContext: {
        industry: 'project_management',
        userRole: role,
        availableFeatures: this.getProjectFeatures(role),
      },
      customTools: await this.getProjectTools(role),
    };

    return new AutonomousAIEngine(config);
  }

  private async getProjectTools(role: string): Promise<AITool[]> {
    const baseTools: AITool[] = [
      this.createProjectPlanningTool(),
      this.createResourceAllocationTool(),
      this.createProgressTrackingTool(),
      this.createRiskManagementTool(),
    ];

    const specializedTools = await this.getSpecializedTools(role);

    return [...baseTools, ...specializedTools];
  }

  private createProjectPlanningTool(): AITool {
    return {
      name: 'project_planning',
      description: '项目规划与排期',
      category: 'planning',
      parameters: {
        type: 'object',
        properties: {
          projectId: { type: 'string', description: '项目ID' },
          methodology: { type: 'string', description: '方法论' },
        },
        required: ['projectId'],
      },
      execute: async (params: any): Promise<ToolResult> => {
        return {
          success: true,
          data: {
            projectId: params.projectId,
            methodology: params.methodology || 'agile',
            phases: ['需求分析', '设计', '开发', '测试', '部署'],
            timeline: '12 weeks',
            milestones: ['里程碑1', '里程碑2', '里程碑3'],
          },
        };
      },
    };
  }

  private createResourceAllocationTool(): AITool {
    return {
      name: 'resource_allocation',
      description: '资源分配与优化',
      category: 'resource',
      parameters: {
        type: 'object',
        properties: {
          projectId: { type: 'string', description: '项目ID' },
          teamSize: { type: 'number', description: '团队规模' },
        },
        required: ['projectId'],
      },
      execute: async (params: any): Promise<ToolResult> => {
        return {
          success: true,
          data: {
            projectId: params.projectId,
            teamSize: params.teamSize || 10,
            allocation: {
              developers: 5,
              designers: 2,
              testers: 2,
              managers: 1,
            },
            utilization: 85,
            recommendations: ['增加测试人员', '优化开发资源'],
          },
        };
      },
    };
  }

  private createProgressTrackingTool(): AITool {
    return {
      name: 'progress_tracking',
      description: '进度跟踪与报告',
      category: 'tracking',
      parameters: {
        type: 'object',
        properties: {
          projectId: { type: 'string', description: '项目ID' },
          sprint: { type: 'string', description: '冲刺周期' },
        },
        required: ['projectId'],
      },
      execute: async (params: any): Promise<ToolResult> => {
        return {
          success: true,
          data: {
            projectId: params.projectId,
            sprint: params.sprint || 'Sprint 1',
            progress: 65,
            completedTasks: 13,
            totalTasks: 20,
            blockers: ['依赖未解决'],
            velocity: 10,
          },
        };
      },
    };
  }

  private createRiskManagementTool(): AITool {
    return {
      name: 'risk_management',
      description: '风险管理',
      category: 'risk',
      parameters: {
        type: 'object',
        properties: {
          projectId: { type: 'string', description: '项目ID' },
        },
        required: ['projectId'],
      },
      execute: async (params: any): Promise<ToolResult> => {
        return {
          success: true,
          data: {
            projectId: params.projectId,
            risks: [
              { id: 'R001', name: '技术风险', severity: 'high', probability: 0.6 },
              { id: 'R002', name: '资源风险', severity: 'medium', probability: 0.4 },
              { id: 'R003', name: '进度风险', severity: 'medium', probability: 0.5 },
            ],
            mitigationPlans: ['技术预研', '资源储备', '缓冲时间'],
          },
        };
      },
    };
  }

  private async getSpecializedTools(role: string): Promise<AITool[]> {
    const toolsMap: Record<string, AITool[]> = {
      project_manager: [
        this.createStakeholderCommunicationTool(),
        this.createBudgetManagementTool(),
      ],
      scrum_master: [
        this.createSprintPlanningTool(),
        this.createTeamFacilitationTool(),
      ],
      product_owner: [
        this.createBacklogManagementTool(),
        this.createPrioritizationTool(),
      ],
      team_lead: [
        this.createTaskAssignmentTool(),
        this.createTeamCoordinationTool(),
      ],
    };

    return toolsMap[role] || [];
  }

  private createStakeholderCommunicationTool(): AITool {
    return {
      name: 'stakeholder_communication',
      description: '利益相关者沟通',
      category: 'communication',
      parameters: {
        type: 'object',
        properties: {
          stakeholder: { type: 'string', description: '利益相关者' },
          topic: { type: 'string', description: '沟通主题' },
        },
      },
      execute: async (params: any): Promise<ToolResult> => {
        return {
          success: true,
          data: {
            stakeholder: params.stakeholder,
            topic: params.topic,
            communicationPlan: ['周报', '月度会议', '季度回顾'],
            keyMessages: ['项目进展', '风险预警', '需求变更'],
          },
        };
      },
    };
  }

  private createBudgetManagementTool(): AITool {
    return {
      name: 'budget_management',
      description: '预算管理',
      category: 'budget',
      parameters: {
        type: 'object',
        properties: {
          projectId: { type: 'string', description: '项目ID' },
        },
      },
      execute: async (params: any): Promise<ToolResult> => {
        return {
          success: true,
          data: {
            projectId: params.projectId,
            totalBudget: 500000,
            spent: 300000,
            remaining: 200000,
            burnRate: 50000,
            forecast: 'on track',
          },
        };
      },
    };
  }

  private createSprintPlanningTool(): AITool {
    return {
      name: 'sprint_planning',
      description: '冲刺规划',
      category: 'planning',
      parameters: {
        type: 'object',
        properties: {
          sprintNumber: { type: 'number', description: '冲刺编号' },
          teamCapacity: { type: 'number', description: '团队产能' },
        },
      },
      execute: async (params: any): Promise<ToolResult> => {
        return {
          success: true,
          data: {
            sprintNumber: params.sprintNumber || 1,
            teamCapacity: params.teamCapacity || 40,
            plannedStories: 8,
            estimatedPoints: 40,
            duration: '2 weeks',
          },
        };
      },
    };
  }

  private createTeamFacilitationTool(): AITool {
    return {
      name: 'team_facilitation',
      description: '团队协调',
      category: 'facilitation',
      parameters: {
        type: 'object',
        properties: {
          activity: { type: 'string', description: '活动类型' },
        },
      },
      execute: async (params: any): Promise<ToolResult> => {
        return {
          success: true,
          data: {
            activity: params.activity || 'daily standup',
            participants: 10,
            duration: '15 minutes',
            agenda: ['昨日进展', '今日计划', '障碍讨论'],
          },
        };
      },
    };
  }

  private createBacklogManagementTool(): AITool {
    return {
      name: 'backlog_management',
      description: '待办事项管理',
      category: 'backlog',
      parameters: {
        type: 'object',
        properties: {
          backlogType: { type: 'string', description: '待办类型' },
        },
      },
      execute: async (params: any): Promise<ToolResult> => {
        return {
          success: true,
          data: {
            backlogType: params.backlogType || 'product',
            totalItems: 50,
            prioritizedItems: 20,
            inProgressItems: 5,
            completedItems: 25,
          },
        };
      },
    };
  }

  private createPrioritizationTool(): AITool {
    return {
      name: 'prioritization',
      description: '优先级排序',
      category: 'prioritization',
      parameters: {
        type: 'object',
        properties: {
          criteria: { type: 'array', items: { type: 'string' }, description: '排序标准' },
        },
      },
      execute: async (params: any): Promise<ToolResult> => {
        return {
          success: true,
          data: {
            criteria: params.criteria || ['价值', '紧急度', '依赖关系'],
            prioritizedItems: [
              { id: 'I001', priority: 'high', reason: '高价值' },
              { id: 'I002', priority: 'medium', reason: '中价值' },
              { id: 'I003', priority: 'low', reason: '低价值' },
            ],
          },
        };
      },
    };
  }

  private createTaskAssignmentTool(): AITool {
    return {
      name: 'task_assignment',
      description: '任务分配',
      category: 'assignment',
      parameters: {
        type: 'object',
        properties: {
          taskId: { type: 'string', description: '任务ID' },
          assignee: { type: 'string', description: '分配对象' },
        },
      },
      execute: async (params: any): Promise<ToolResult> => {
        return {
          success: true,
          data: {
            taskId: params.taskId,
            assignee: params.assignee,
            workload: 80,
            skills: ['JavaScript', 'React'],
            estimatedHours: 8,
          },
        };
      },
    };
  }

  private createTeamCoordinationTool(): AITool {
    return {
      name: 'team_coordination',
      description: '团队协调',
      category: 'coordination',
      parameters: {
        type: 'object',
        properties: {
          coordinationType: { type: 'string', description: '协调类型' },
        },
      },
      execute: async (params: any): Promise<ToolResult> => {
        return {
          success: true,
          data: {
            coordinationType: params.coordinationType || 'technical',
            teamMembers: 10,
            dependencies: ['前端', '后端', '测试'],
            coordinationPlan: ['每日同步', '代码评审', '集成测试'],
          },
        };
      },
    };
  }

  private getProjectFeatures(role: string): string[] {
    const featuresMap: Record<string, string[]> = {
      project_manager: ['project_planning', 'resource_management', 'stakeholder_communication', 'budget_tracking'],
      scrum_master: ['sprint_planning', 'team_facilitation', 'agile_practices', 'continuous_improvement'],
      product_owner: ['backlog_management', 'prioritization', 'stakeholder_management', 'value_delivery'],
      team_lead: ['task_assignment', 'team_coordination', 'technical_guidance', 'quality_assurance'],
    };

    return featuresMap[role] || [];
  }
}
