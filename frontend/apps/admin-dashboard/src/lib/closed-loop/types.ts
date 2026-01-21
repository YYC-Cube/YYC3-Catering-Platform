/**
 * YYC³ 闭环价值创造系统 - 核心类型定义
 * @description 完整的闭环优化、价值度量、治理框架类型系统
 */

// ============================================
// 目标管理类型
// ============================================

export interface ProjectContext {
  projectId: string;
  projectName: string;
  industry: string;
  businessModel: string;
  targetUsers: string[];
  currentPhase: 'planning' | 'development' | 'testing' | 'deployment' | 'optimization';
  constraints: {
    budget: number;
    timeline: string;
    resources: number;
    technology: string[];
  };
  stakeholders: Stakeholder[];
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  influence: 'low' | 'medium' | 'high';
  interest: 'low' | 'medium' | 'high';
  expectations: string[];
}

export interface ValueGoals {
  strategicGoals: StrategicGoals;
  tacticalGoals: TacticalGoals;
  operationalGoals: OperationalGoals;
}

export interface StrategicGoals {
  businessValue: number;
  userSatisfaction: number;
  competitiveAdvantage: string;
}

export interface TacticalGoals {
  featureCompleteness: number;
  performanceTargets: PerformanceTargets;
  qualityMetrics: QualityMetrics;
}

export interface OperationalGoals {
  deploymentFrequency: string;
  incidentResponse: string;
  userFeedbackLoop: string;
}

export interface PerformanceTargets {
  responseTime: number;
  throughput: number;
  availability: number;
  scalability: number;
}

export interface QualityMetrics {
  codeQuality: number;
  testCoverage: number;
  bugDensity: number;
  technicalDebt: number;
}

export interface GoalProgress {
  overallProgress: number;
  goalBreakdown: Record<string, number>;
  criticalGaps: Gap[];
  improvementOpportunities: Opportunity[];
  predictedAchievement: Date;
}

export interface Gap {
  area: string;
  current: number;
  target: number;
  gap: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

export interface Opportunity {
  area: string;
  potential: number;
  effort: number;
  impact: number;
  priority: number;
  description: string;
}

// ============================================
// 价值验证类型
// ============================================

export interface ValueValidation {
  roi: ROIMetrics;
  userValue: UserValueMetrics;
  strategicValue: StrategicValueMetrics;
}

export interface ROIMetrics {
  developmentCost: number;
  operationalValue: number;
  paybackPeriod: number;
  netPresentValue: number;
}

export interface UserValueMetrics {
  satisfactionScore: number;
  adoptionRate: number;
  retentionRate: number;
  taskSuccessRate: number;
}

export interface StrategicValueMetrics {
  competitivePosition: number;
  marketDifferentiation: number;
  strategicAlignment: number;
}

// ============================================
// 技术成熟度类型
// ============================================

export interface MaturityAssessment {
  currentLevel: number;
  capabilityBreakdown: CapabilityAssessment[];
  maturityGaps: MaturityGap[];
  evolutionPath: EvolutionStep[];
  improvementPriorities: ImprovementPriority[];
}

export interface CapabilityAssessment {
  area: string;
  currentScore: number;
  benchmarkScore: number;
  indicators: Indicator[];
  strengths: string[];
  weaknesses: string[];
  recommendations: Recommendation[];
}

export interface Indicator {
  name: string;
  value: number;
  benchmark: number;
  status: 'below' | 'meeting' | 'exceeding';
}

export interface MaturityGap {
  capability: string;
  currentLevel: number;
  targetLevel: number;
  gap: number;
  priority: number;
}

export interface EvolutionStep {
  step: number;
  title: string;
  description: string;
  duration: string;
  prerequisites: string[];
  deliverables: string[];
}

export interface ImprovementPriority {
  area: string;
  priority: number;
  impact: number;
  effort: number;
  quickWins: string[];
}

export interface Recommendation {
  type: 'quick_win' | 'strategic' | 'foundational';
  title: string;
  description: string;
  impact: number;
  effort: number;
  timeline: string;
}

// ============================================
// 技术路线图类型
// ============================================

export interface EvolutionRoadmap {
  immediateActions: RoadmapItem[];
  shortTermGoals: RoadmapItem[];
  mediumTermInitiatives: RoadmapItem[];
  longTermVision: RoadmapItem[];
  dependencyMap: DependencyMap;
  riskAssessment: RiskAssessment;
  successMetrics: SuccessMetrics;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  resources: ResourceRequirement;
  successCriteria: string[];
  dependencies?: string[];
  risks?: string[];
}

export interface ResourceRequirement {
  development?: number;
  testing?: number;
  design?: number;
  budget?: number;
}

export interface DependencyMap {
  nodes: DependencyNode[];
  edges: DependencyEdge[];
}

export interface DependencyNode {
  id: string;
  type: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
}

export interface DependencyEdge {
  from: string;
  to: string;
  type: 'required' | 'optional' | 'preferred';
}

export interface RiskAssessment {
  risks: Risk[];
  overallRiskLevel: 'low' | 'medium' | 'high';
  mitigationStrategies: MitigationStrategy[];
}

export interface Risk {
  id: string;
  category: string;
  description: string;
  probability: number;
  impact: number;
  severity: number;
  mitigationPlan?: string;
}

export interface MitigationStrategy {
  riskId: string;
  strategy: string;
  owner: string;
  deadline: Date;
  status: string;
}

export interface SuccessMetrics {
  leading: Metric[];
  lagging: Metric[];
}

export interface Metric {
  name: string;
  description: string;
  target: number;
  current?: number;
  unit: string;
}

// ============================================
// 数据优化循环类型
// ============================================

export interface OptimizationCycle {
  cycleId: string;
  dataQuality: DataQuality;
  featureImportance: FeatureImportance[];
  modelPerformance: ModelPerformance;
  deploymentImpact: DeploymentImpact;
  feedbackAnalysis: FeedbackAnalysis;
  nextCycle: NextCyclePlan;
}

export interface DataQuality {
  completeness: number;
  accuracy: number;
  consistency: number;
  timeliness: number;
  relevance: number;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
  correlation: number;
  contribution: number;
}

export interface ModelPerformance {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
}

export interface DeploymentImpact {
  performanceImprovement: number;
  userSatisfactionChange: number;
  businessImpact: number;
  technicalMetrics: Record<string, number>;
}

export interface FeedbackAnalysis {
  positiveFeedback: number;
  negativeFeedback: number;
  neutralFeedback: number;
  commonThemes: string[];
  actionItems: string[];
}

export interface NextCyclePlan {
  focus: string[];
  dataNeedsRefinement: string[];
  featureEngineering: string[];
  modelImprovements: string[];
  timeline: string;
}

// ============================================
// AI能力评估类型
// ============================================

export interface AICapabilityAssessment {
  overallIQ: number;
  cognitiveDimensions: CognitiveDimensions;
  technicalDimensions: TechnicalDimensions;
  impactDimensions: ImpactDimensions;
  improvementRecommendations: AIImprovement[];
}

export interface CognitiveDimensions {
  understanding: number;
  reasoning: number;
  creativity: number;
  adaptation: number;
}

export interface TechnicalDimensions {
  accuracy: number;
  efficiency: number;
  reliability: number;
  scalability: number;
}

export interface ImpactDimensions {
  productivity: number;
  innovation: number;
  decisionQuality: number;
  userSatisfaction: number;
}

export interface AIImprovement {
  dimension: string;
  currentScore: number;
  targetScore: number;
  recommendations: string[];
  priority: number;
}

// ============================================
// UX优化循环类型
// ============================================

export interface UXOptimizationCycle {
  cycleId: string;
  userInsights: UserInsights;
  identifiedPainPoints: PainPoint[];
  designIterations: DesignIteration[];
  testResults: UsabilityTestResults;
  implementationResults: ImplementationResults;
  measuredImpact: UXImpact;
  keyLearnings: string[];
  nextCycleFocus: string[];
}

export interface UserInsights {
  needs: string[];
  goals: string[];
  behaviors: string[];
  preferences: string[];
  painPoints: string[];
}

export interface PainPoint {
  id: string;
  description: string;
  frequency: number;
  severity: number;
  impact: number;
  affectedUsers: number;
}

export interface DesignIteration {
  version: string;
  changes: string[];
  rationale: string;
  expectedImpact: string[];
}

export interface UsabilityTestResults {
  taskSuccessRate: number;
  timeOnTask: number;
  errorRate: number;
  satisfactionScore: number;
  findings: string[];
}

export interface ImplementationResults {
  implementedFeatures: string[];
  implementationTime: number;
  technicalChallenges: string[];
  qualityScore: number;
}

export interface UXImpact {
  satisfactionImprovement: number;
  efficiencyGain: number;
  errorReduction: number;
  adoptionIncrease: number;
}

// ============================================
// 业务价值度量类型
// ============================================

export interface BusinessValueMeasurement {
  operationalValue: OperationalValue;
  financialValue: FinancialValue;
  strategicValue: StrategicValue;
  customerValue: CustomerValue;
}

export interface OperationalValue {
  efficiencyGains: number;
  qualityImprovements: number;
  capacityIncrease: number;
  riskReduction: number;
}

export interface FinancialValue {
  costSavings: number;
  revenueImpact: number;
  roi: number;
  paybackPeriod: number;
}

export interface StrategicValue {
  competitiveAdvantage: number;
  marketPosition: number;
  innovationCapacity: number;
  futureReadiness: number;
}

export interface CustomerValue {
  satisfaction: number;
  loyalty: number;
  lifetimeValue: number;
}

// ============================================
// 治理框架类型
// ============================================

export interface GovernanceStructure {
  decisionRights: DecisionRights;
  qualityGates: QualityGates;
  reviewProcesses: ReviewProcesses;
  complianceStandards: ComplianceStandards;
}

export interface DecisionRights {
  technicalDecisions: DecisionAuthority[];
  architecturalDecisions: DecisionAuthority[];
  resourceDecisions: DecisionAuthority[];
  strategicDecisions: DecisionAuthority[];
}

export interface DecisionAuthority {
  decision: string;
  authority: string;
  approvalProcess: string;
  escalationPath: string[];
}

export interface QualityGates {
  requirements: QualityGate;
  design: QualityGate;
  implementation: QualityGate;
  deployment: QualityGate;
}

export interface QualityGate {
  criteria: GateCriterion[];
  approvers: string[];
  process: string;
}

export interface GateCriterion {
  name: string;
  threshold: number;
  mandatory: boolean;
}

export interface ReviewProcesses {
  technicalReviews: ReviewProcess;
  architecturalReviews: ReviewProcess;
  securityReviews: ReviewProcess;
  businessReviews: ReviewProcess;
}

export interface ReviewProcess {
  frequency: string;
  participants: string[];
  deliverables: string[];
  criteria: string[];
}

export interface ComplianceStandards {
  technical: Standard[];
  security: Standard[];
  operational: Standard[];
  ethical: Standard[];
}

export interface Standard {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  auditFrequency: string;
}

// ============================================
// 闭环度量类型
// ============================================

export interface ClosedLoopEffectiveness {
  cycleEfficiency: CycleEfficiency;
  improvementImpact: ImprovementImpact;
  learningVelocity: LearningVelocity;
  overallEffectiveness: number;
}

export interface CycleEfficiency {
  cycleDuration: number;
  cycleFrequency: number;
  resourceUtilization: number;
  throughput: number;
}

export interface ImprovementImpact {
  qualityGains: number;
  performanceGains: number;
  costSavings: number;
  valueAdded: number;
}

export interface LearningVelocity {
  knowledgeGrowth: number;
  solutionVelocity: number;
  adaptationSpeed: number;
  innovationFrequency: number;
}

export interface ImprovementCulture {
  mindset: Mindset;
  processes: ImprovementProcesses;
  capabilities: ImprovementCapabilities;
  metrics: CultureMetrics;
}

export interface Mindset {
  growthMindset: number;
  learningOrientation: number;
  innovationMindset: number;
  customerFocus: number;
}

export interface ImprovementProcesses {
  feedbackLoops: string[];
  improvementCycles: string[];
  knowledgeSharing: string[];
  recognitionSystems: string[];
}

export interface ImprovementCapabilities {
  problemSolving: number;
  dataAnalysis: number;
  changeManagement: number;
  collaboration: number;
}

export interface CultureMetrics {
  improvementVelocity: number;
  innovationOutput: number;
  employeeEngagement: number;
  customerSatisfaction: number;
}
