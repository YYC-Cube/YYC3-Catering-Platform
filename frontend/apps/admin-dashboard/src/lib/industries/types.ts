/**
 * YYC³ 多行业适配系统 - 核心类型定义
 * @description 支持多行业场景的AI系统类型定义
 */

import { AITool, DataSource, AutonomousAIConfig } from '../ai-widget/types';

export interface IndustryConfiguration {
  id: string;
  name: string;
  description: string;
  personas: string[];
  capabilities: string[];
  tools: AITool[];
  dataSources: DataSource[];
  successMetrics: SuccessMetrics;
}

export interface SuccessMetrics {
  strategic: StrategicMetric[];
  operational: OperationalMetric[];
  financial: FinancialMetric[];
}

export interface StrategicMetric {
  id: string;
  name: string;
  description: string;
  target: number;
  unit: string;
}

export interface OperationalMetric {
  id: string;
  name: string;
  description: string;
  target: number;
  unit: string;
}

export interface FinancialMetric {
  id: string;
  name: string;
  description: string;
  target: number;
  unit: string;
}

export interface PersonaConfiguration {
  personaId: string;
  personaName: string;
  industry: string;
  responsibilities: string[];
  decisionAuthority: DecisionAuthority;
  informationNeeds: InformationNeeds;
  preferredCommunicationStyle: CommunicationStyle;
}

export interface DecisionAuthority {
  level: 'executive' | 'tactical' | 'operational';
  domains: string[];
  approvalRequired: boolean;
}

export interface InformationNeeds {
  realTimeData: string[];
  periodicReports: string[];
  alerts: string[];
  analytics: string[];
}

export interface CommunicationStyle {
  formality: 'formal' | 'professional' | 'casual';
  detailLevel: 'executive_summary' | 'detailed' | 'comprehensive';
  preferredFormat: 'text' | 'visual' | 'mixed';
}

export interface QuickStartConfig {
  industry: string;
  userRole: string;
  apiType?: 'internal' | 'openai' | 'azure' | 'custom';
  modelName?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  environment: 'development' | 'staging' | 'production';
  integrations?: IntegrationConfig;
}

export interface IntegrationConfig {
  [systemType: string]: SystemConnectionConfig;
}

export interface SystemConnectionConfig {
  url: string;
  apiKey?: string;
  credentials?: any;
  options?: any;
}

export interface IntegrationResult {
  success: boolean;
  systemType: string;
  connectedAt: Date;
  capabilities: string[];
  healthCheck: HealthCheckResult;
}

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  latency: number;
  lastChecked: Date;
  issues?: string[];
}
