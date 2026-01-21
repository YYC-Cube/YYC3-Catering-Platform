/**
 * YYC³ 自治AI浮窗系统 - 核心类型定义
 * @description 完整的类型系统，支持多模型、自主学习、工具扩展
 */

// ============================================
// 核心配置类型
// ============================================

export type APIType = 'internal' | 'openai' | 'azure' | 'anthropic' | 'custom';
export type Position = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
export type Theme = 'light' | 'dark' | 'auto';
export type AIStatus = 'idle' | 'processing' | 'thinking' | 'error' | 'offline';

export interface AutonomousAIConfig {
  // 模型配置
  apiType: APIType;
  modelName: string;
  apiKey?: string;
  baseURL?: string;
  maxTokens?: number;
  temperature?: number;
  
  // 自治能力配置
  enableLearning: boolean;
  enableMemory: boolean;
  enableToolUse: boolean;
  enableContextAwareness: boolean;
  
  // UI配置
  position: Position;
  theme: Theme;
  language: string;
  defaultOpen?: boolean;
  draggable?: boolean;
  
  // 业务集成
  businessContext?: BusinessContext;
  customTools?: AITool[];
  dataSources?: DataSource[];
  
  // 学习配置
  learningConfig?: LearningConfig;
  memoryConfig?: MemoryConfig;
  toolConfig?: ToolConfig;
}

export interface BusinessContext {
  industry: string;
  userRole: string;
  userId?: string;
  companyId?: string;
  availableFeatures: string[];
  permissions?: string[];
  metadata?: Record<string, any>;
}

export interface LearningConfig {
  reinforcementLearning?: {
    enabled: boolean;
    learningRate: number;
    explorationRate: number;
  };
  patternRecognition?: {
    enabled: boolean;
    minConfidence: number;
    maxPatterns: number;
  };
  knowledgeExtraction?: {
    enabled: boolean;
    autoSummarize: boolean;
    keyPointExtraction: boolean;
  };
}

export interface MemoryConfig {
  persistence: boolean;
  storage: 'localStorage' | 'indexedDB' | 'server';
  maxConversations: number;
  autoCleanup: boolean;
  retentionDays?: number;
}

export interface ToolConfig {
  autoToolSelection: boolean;
  maxParallelTools: number;
  toolTimeout: number;
}

// ============================================
// AI实例类型
// ============================================

export interface AIWidgetInstance {
  id: string;
  config: AutonomousAIConfig;
  state: AIWidgetState;
  capabilities: AICapabilities;
  destroy: () => void;
  updateConfig: (config: Partial<AutonomousAIConfig>) => void;
  sendMessage: (message: string) => Promise<AIResponse>;
  reset: () => void;
}

export interface AIWidgetState {
  status: AIStatus;
  isOpen: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  conversationCount: number;
  lastInteraction?: Date;
}

export interface AICapabilities {
  supportedModels: string[];
  availableTools: string[];
  learningEnabled: boolean;
  memoryEnabled: boolean;
  contextAware: boolean;
}

// ============================================
// 消息类型
// ============================================

export interface UserMessage {
  id: string;
  content: string;
  timestamp: Date;
  user: UserInfo;
  attachments?: MessageAttachment[];
  metadata?: Record<string, any>;
}

export interface AIResponse {
  id: string;
  content: string;
  timestamp: Date;
  model: string;
  toolCalls?: ToolCall[];
  usage?: TokenUsage;
  confidence?: number;
  sources?: Source[];
  responseTime: number;
  metadata?: Record<string, any>;
}

export interface UserInfo {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  language: string;
  theme: Theme;
  responseStyle: 'concise' | 'detailed' | 'casual' | 'professional';
  enableNotifications: boolean;
  customSettings?: Record<string, any>;
}

export interface MessageAttachment {
  type: 'image' | 'file' | 'link' | 'data';
  url?: string;
  data?: any;
  mimeType?: string;
  size?: number;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost?: number;
}

export interface Source {
  title: string;
  url?: string;
  snippet?: string;
  relevance?: number;
}

// ============================================
// 工具系统类型
// ============================================

export interface AITool {
  name: string;
  description: string;
  category: string;
  parameters: ToolParameters;
  execute: (params: any) => Promise<ToolResult>;
  requiresAuth?: boolean;
  permissions?: string[];
  metadata?: Record<string, any>;
}

export interface ToolParameters {
  type: 'object';
  properties: Record<string, ParameterDefinition>;
  required?: string[];
}

export interface ParameterDefinition {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  enum?: any[];
  default?: any;
  items?: ParameterDefinition;
  properties?: Record<string, ParameterDefinition>;
}

export interface ToolCall {
  id: string;
  toolName: string;
  parameters: any;
  result?: ToolResult;
  error?: string;
  executionTime?: number;
}

export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: Record<string, any>;
}

// ============================================
// 上下文类型
// ============================================

export interface AIContext {
  timestamp: Date;
  user: UserInfo;
  conversationHistory: ConversationMessage[];
  userPreferences?: UserPreferences;
  businessContext?: BusinessContext;
  pageContext?: PageContext;
  availableTools: AITool[];
  recentInsights?: LearningInsight[];
}

export interface PageContext {
  url: string;
  title: string;
  module?: string;
  route?: string;
  visibleData?: any;
  userActions?: UserAction[];
}

export interface UserAction {
  type: string;
  timestamp: Date;
  target?: string;
  data?: any;
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  toolCalls?: ToolCall[];
}

// ============================================
// 记忆系统类型
// ============================================

export interface MemoryItem {
  id: string;
  type: 'conversation' | 'preference' | 'knowledge' | 'insight';
  content: any;
  timestamp: Date;
  importance: number;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

export interface ConversationMemory {
  id: string;
  userId: string;
  messages: ConversationMessage[];
  startTime: Date;
  endTime?: Date;
  summary?: string;
  topics?: string[];
  sentiment?: number;
}

// ============================================
// 学习系统类型
// ============================================

export interface LearningInsight {
  id: string;
  type: 'pattern' | 'preference' | 'improvement' | 'anomaly';
  title: string;
  description: string;
  confidence: number;
  evidence: any[];
  actionable: boolean;
  suggestedActions?: string[];
  timestamp: Date;
}

export interface PerformanceMetric {
  responseTime: number;
  relevance: number;
  usefulness: number;
  userSatisfaction?: number;
  toolUsageEfficiency?: number;
  timestamp: Date;
}

export interface UserFeedback {
  messageId: string;
  rating: number;
  feedback?: string;
  categories?: string[];
  timestamp: Date;
}

// ============================================
// 模型适配器类型
// ============================================

export interface ModelResponse {
  content: string;
  toolCalls?: any[];
  usage?: TokenUsage;
  model: string;
  finishReason?: string;
}

export interface ModelInfo {
  name: string;
  provider: string;
  maxTokens: number;
  supportsFunctions: boolean;
  supportsVision: boolean;
  supportsStreaming: boolean;
}

export interface StreamChunk {
  content: string;
  isComplete: boolean;
  toolCalls?: any[];
}

// ============================================
// 数据源类型
// ============================================

export interface DataSource {
  id: string;
  name: string;
  type: 'database' | 'api' | 'file' | 'realtime';
  endpoint?: string;
  credentials?: any;
  schema?: any;
  queryMethod: (query: any) => Promise<any>;
}

// ============================================
// 餐饮业务特定类型
// ============================================

export interface RestaurantContext extends BusinessContext {
  restaurantId: string;
  restaurantName: string;
  cuisineType: string[];
  operatingHours: OperatingHours;
  currentStats?: RestaurantStats;
}

export interface OperatingHours {
  [day: string]: {
    open: string;
    close: string;
    isOpen: boolean;
  };
}

export interface RestaurantStats {
  todayOrders: number;
  todayRevenue: number;
  activeOrders: number;
  tableOccupancy: number;
  popularDishes: string[];
  averageWaitTime: number;
}

export interface OrderData {
  orderId: string;
  tableNumber?: number;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'completed' | 'cancelled';
  timestamp: Date;
  customerInfo?: any;
}

export interface OrderItem {
  dishId: string;
  dishName: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

export interface DishData {
  dishId: string;
  name: string;
  category: string;
  price: number;
  ingredients: string[];
  allergens?: string[];
  availability: boolean;
  popularity: number;
  preparationTime: number;
}
