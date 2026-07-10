/**
 * @file AIAssistantService.ts
 * @description YYC³餐饮行业智能化平台 - AI助手服务类
 * @module services/AIAssistantService
 * @author YYC³团队
 * @version 1.0.0
 * @created 2025-01-30
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { EventEmitter } from 'events';
import { AIRequest, AIResponse, ConversationContext, AIMessage, AISession } from '../models/AIAssistant';
import { NLPService } from './NLPService';
import { businessIntegrationService } from './BusinessIntegrationService';

export interface AIAssistantConfig {
  defaultProvider: 'openai' | 'claude' | 'local';
  enableVoiceInteraction: boolean;
  enableImageAnalysis: boolean;
  enableRealTimeTranslation: boolean;
  knowledgeBaseEnabled: boolean;
  maxConversationHistory: number;
  responseTimeout: number;
  languageSupport: string[];
}

export interface RestaurantContext {
  restaurantId: string;
  restaurantName: string;
  cuisineType: string;
  menuItems: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    allergens: string[];
    dietaryInfo: string[];
  }>;
  currentOperatingHours: {
    isOpen: boolean;
    openingTime: string;
    closingTime: string;
  };
  currentPromotions: Array<{
    id: string;
    title: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    validUntil: string;
  }>;
}

export interface CustomerProfile {
  customerId: string;
  name: string;
  preferences: {
    spiceLevel: number;
    dietaryRestrictions: string[];
    favoriteCuisines: string[];
    allergies: string[];
    previousOrders: string[];
  };
  loyaltyStatus: {
    level: string;
    points: number;
    benefits: string[];
  };
}

export class AIAssistantService extends EventEmitter {
  private config: AIAssistantConfig;
  private activeSessions: Map<string, AISession> = new Map();
  private conversationHistory: Map<string, AIMessage[]> = new Map();
  private nlpService: NLPService;
  private businessIntegrationService: any;

  constructor(config: AIAssistantConfig) {
    super();
    this.config = config;
    this.nlpService = new NLPService();
    this.businessIntegrationService = businessIntegrationService;
  }

  /**
   * 处理文本消息请求
   */
  async processTextMessage(request: AIRequest): Promise<AIResponse> {
    try {
      const startTime = Date.now();

      // 获取或创建会话
      const session = await this.getOrCreateSession(request.sessionId);

      // 构建对话上下文
      const context = await this.buildConversationContext(session, request);

      // NLP分析用户消息
      const nlpResult = await this.nlpService.processText(request.message);
      context.nlpAnalysis = nlpResult;

      // 业务系统集成 - 根据NLP结果调用相应的业务服务
      if (nlpResult.intent && nlpResult.confidence > 0.5) {
        try {
          // 注意：BusinessIntegrationService中的方法名为processNLPResult，不是processNLPAnalysis
          const businessResult = await this.businessIntegrationService.processNLPResult(
            nlpResult,
            request.metadata?.customerId ? parseInt(request.metadata?.customerId) : undefined,
          );

          // 将业务结果添加到对话上下文
          if (businessResult) {
            context.businessContext = businessResult;
          }
        } catch (businessError) {
          console.error('Business integration error:', businessError);
          // 记录错误但不中断流程，AI将尝试给出通用响应
        }
      }

      // 选择AI提供商
      const provider = this.selectAIProvider(request);

      // 生成AI响应
      const aiResponse = await this.generateAIResponse(context, provider);

      // 后处理响应
      const processedResponse = await this.postProcessResponse(aiResponse, context);

      // 保存对话历史
      await this.saveConversationMessage(request.sessionId, {
        id: this.generateId(),
        sessionId: request.sessionId,
        type: 'user',
        content: request.message,
        timestamp: new Date(),
        metadata: request.metadata,
      });

      await this.saveConversationMessage(request.sessionId, {
        id: this.generateId(),
        sessionId: request.sessionId,
        type: 'assistant',
        content: processedResponse.message,
        timestamp: new Date(),
        metadata: {
          provider,
          processingTime: Date.now() - startTime,
          confidence: processedResponse.confidence,
        },
      });

      // 发送响应事件
      this.emit('messageProcessed', {
        sessionId: request.sessionId,
        response: processedResponse,
        processingTime: Date.now() - startTime,
      });

      return processedResponse;
    } catch (error) {
      console.error('Process text message error:', error);

      return {
        sessionId: request.sessionId,
        message: '抱歉，我现在无法处理您的请求。请稍后再试。',
        confidence: 0,
        suggestions: ['您可以尝试重新表述您的问题', '或者联系人工客服获得帮助'],
        metadata: {
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date(),
        },
      };
    }
  }

  /**
   * 处理语音输入
   */
  async processVoiceInput(audioData: Buffer, sessionId: string, language: string = 'zh-CN'): Promise<AIResponse> {
    try {
      if (!this.config.enableVoiceInteraction) {
        throw new Error('Voice interaction is disabled');
      }

      // 语音识别
      const transcription = await this.voiceService.speechToText(audioData, language);

      // 处理识别的文本
      const textRequest: AIRequest = {
        sessionId,
        message: transcription.text,
        metadata: {
          originalFormat: 'voice',
          language,
          confidence: transcription.confidence,
        },
      };

      return await this.processTextMessage(textRequest);
    } catch (error) {
      console.error('Process voice input error:', error);
      throw error;
    }
  }

  /**
   * 生成语音回复
   */
  async generateVoiceResponse(
    text: string,
    sessionId: string,
    language: string = 'zh-CN',
    voice: string = 'female',
  ): Promise<Buffer> {
    try {
      if (!this.config.enableVoiceInteraction) {
        throw new Error('Voice interaction is disabled');
      }

      return await this.voiceService.textToSpeech(text, language, voice);
    } catch (error) {
      console.error('Generate voice response error:', error);
      throw error;
    }
  }

  /**
   * 处理图像分析请求
   */
  async processImageAnalysis(
    imageData: Buffer,
    sessionId: string,
    analysisType: 'food' | 'menu' | 'general' = 'food',
  ): Promise<AIResponse> {
    try {
      if (!this.config.enableImageAnalysis) {
        throw new Error('Image analysis is disabled');
      }

      // 图像识别和分析
      const analysisResult = await this.analyzeImage(imageData, analysisType);

      // 基于分析结果生成智能响应
      const response = await this.generateImageBasedResponse(analysisResult, sessionId);

      return response;
    } catch (error) {
      console.error('Process image analysis error:', error);
      throw error;
    }
  }

  /**
   * 获取智能推荐
   */
  async getRecommendations(
    sessionId: string,
    context: {
      customerProfile?: CustomerProfile;
      restaurantContext?: RestaurantContext;
      currentOrder?: any[];
      mealTime?: 'breakfast' | 'lunch' | 'dinner';
      partySize?: number;
      budget?: number;
    },
  ): Promise<AIResponse> {
    try {
      const recommendations = await this.generateSmartRecommendations(context);

      return {
        sessionId,
        message: this.formatRecommendationsMessage(recommendations),
        confidence: recommendations.reduce((sum, rec) => sum + rec.confidence, 0) / recommendations.length,
        suggestions: recommendations.map(rec => rec.title),
        data: {
          recommendations,
          type: 'recommendations',
        },
        metadata: {
          timestamp: new Date(),
          recommendationCount: recommendations.length,
        },
      };
    } catch (error) {
      console.error('Get recommendations error:', error);
      throw error;
    }
  }

  /**
   * 获取会话历史
   */
  async getSessionHistory(sessionId: string): Promise<AIMessage[]> {
    const history = this.conversationHistory.get(sessionId) || [];
    return history.slice(-this.config.maxConversationHistory);
  }

  /**
   * 清除会话历史
   */
  async clearSessionHistory(sessionId: string): Promise<void> {
    this.conversationHistory.delete(sessionId);
    const session = this.activeSessions.get(sessionId);
    if (session) {
      session.context = {};
      session.lastActivity = new Date();
    }
  }

  /**
   * 获取会话统计信息
   */
  getSessionStats(sessionId: string): {
    messageCount: number;
    sessionDuration: number;
    lastActivity: Date;
    averageResponseTime: number;
  } | null {
    const session = this.activeSessions.get(sessionId);
    if (!session) return null;

    const history = this.conversationHistory.get(sessionId) || [];
    const responseMessages = history.filter(msg => msg.type === 'assistant');

    return {
      messageCount: history.length,
      sessionDuration: Date.now() - session.createdAt.getTime(),
      lastActivity: session.lastActivity,
      averageResponseTime: this.calculateAverageResponseTime(responseMessages),
    };
  }

  /**
   * 经营决策支持 - 销售预测
   */
  async getSalesForecast(
    sessionId: string,
    context: {
      restaurantId: string;
      timeRange: {
        startDate: string;
        endDate: string;
      };
      historicalData?: Array<{
        date: string;
        sales: number;
        orders: number;
        customers: number;
      }>;
      factors?: {
        promotions?: boolean;
        holidays?: boolean;
        weather?: boolean;
        events?: boolean;
      };
    },
  ): Promise<AIResponse> {
    try {
      // 生成销售预测
      const forecast = await this.generateSalesForecast(context);

      return {
        sessionId,
        message: this.formatSalesForecastMessage(forecast),
        confidence: forecast.confidence,
        suggestions: forecast.recommendations,
        data: {
          forecast: forecast.forecast,
          trends: forecast.trends,
          type: 'sales_forecast',
        },
        metadata: {
          timestamp: new Date(),
          restaurantId: context.restaurantId,
        },
      };
    } catch (error) {
      console.error('Get sales forecast error:', error);
      throw error;
    }
  }

  /**
   * 经营决策支持 - 库存优化
   */
  async getInventoryOptimization(
    sessionId: string,
    context: {
      restaurantId: string;
      currentInventory?: Array<{
        itemId: string;
        itemName: string;
        category: string;
        currentStock: number;
        minimumStock: number;
        maximumStock: number;
        unitCost: number;
        leadTime: number;
        usageRate: number;
        expiryDate?: string;
      }>;
      salesData?: Array<{
        itemId: string;
        salesQuantity: number;
        date: string;
      }>;
      supplierInfo?: Array<{
        supplierId: string;
        supplierName: string;
        deliveryTime: number;
        reliability: number;
      }>;
    },
  ): Promise<AIResponse> {
    try {
      // 生成库存优化建议
      const optimization = await this.generateInventoryOptimization(context);

      return {
        sessionId,
        message: this.formatInventoryOptimizationMessage(optimization),
        confidence: optimization.confidence,
        suggestions: optimization.recommendations.map(rec => rec.action),
        data: {
          optimization,
          type: 'inventory_optimization',
        },
        metadata: {
          timestamp: new Date(),
          restaurantId: context.restaurantId,
        },
      };
    } catch (error) {
      console.error('Get inventory optimization error:', error);
      throw error;
    }
  }

  /**
   * 客户行为分析
   */
  async getCustomerBehaviorAnalysis(
    sessionId: string,
    context: {
      restaurantId: string;
      customerData?: Array<{
        customerId: string;
        visitCount: number;
        totalSpent: number;
        favoriteItems: string[];
        visitTimes: Array<{
          date: string;
          time: string;
          amountSpent: number;
        }>;
      }>;
      timeRange?: {
        startDate: string;
        endDate: string;
      };
    },
  ): Promise<AIResponse> {
    try {
      // 分析客户行为
      const analysis = await this.analyzeCustomerBehavior(context);

      return {
        sessionId,
        message: this.formatCustomerBehaviorAnalysisMessage(analysis),
        confidence: analysis.confidence,
        suggestions: analysis.recommendations,
        data: {
          analysis,
          type: 'customer_behavior_analysis',
        },
        metadata: {
          timestamp: new Date(),
          restaurantId: context.restaurantId,
        },
      };
    } catch (error) {
      console.error('Get customer behavior analysis error:', error);
      throw error;
    }
  }

  /**
   * 菜单优化建议
   */
  async getMenuOptimization(
    sessionId: string,
    context: {
      restaurantId: string;
      menuItems?: Array<{
        itemId: string;
        name: string;
        category: string;
        price: number;
        cost: number;
        popularity: number;
        profitMargin: number;
        ingredients: Array<{
          ingredientId: string;
          name: string;
          quantity: number;
          unitCost: number;
        }>;
      }>;
      salesData?: Array<{
        itemId: string;
        salesCount: number;
        revenue: number;
        date: string;
      }>;
      season?: string;
      dietaryTrends?: string[];
    },
  ): Promise<AIResponse> {
    try {
      // 生成菜单优化建议
      const optimization = await this.generateMenuOptimization(context);

      return {
        sessionId,
        message: this.formatMenuOptimizationMessage(optimization),
        confidence: optimization.confidence,
        suggestions: optimization.recommendations.map(rec => rec.action),
        data: {
          optimization,
          type: 'menu_optimization',
        },
        metadata: {
          timestamp: new Date(),
          restaurantId: context.restaurantId,
        },
      };
    } catch (error) {
      console.error('Get menu optimization error:', error);
      throw error;
    }
  }

  /**
   * 运营效率优化
   */
  async getOperationalEfficiency(
    sessionId: string,
    context: {
      restaurantId: string;
      operationalData?: {
        dailySales: Array<{
          date: string;
          sales: number;
          customers: number;
          orders: number;
        }>;
        staffSchedule: Array<{
          date: string;
          shift: string;
          staffCount: number;
          laborCost: number;
        }>;
        peakHours: Array<{
          day: string;
          startTime: string;
          endTime: string;
        }>;
      };
      goals?: {
        reduceLaborCost?: boolean;
        improveCustomerService?: boolean;
        optimizeTableTurnover?: boolean;
      };
    },
  ): Promise<AIResponse> {
    try {
      // 生成运营效率优化建议
      const efficiency = await this.generateOperationalEfficiency(context);

      return {
        sessionId,
        message: this.formatOperationalEfficiencyMessage(efficiency),
        confidence: efficiency.confidence,
        suggestions: efficiency.recommendations,
        data: {
          efficiency,
          type: 'operational_efficiency',
        },
        metadata: {
          timestamp: new Date(),
          restaurantId: context.restaurantId,
        },
      };
    } catch (error) {
      console.error('Get operational efficiency error:', error);
      throw error;
    }
  }

  /**
   * 更新AI助手配置
   */
  updateConfig(newConfig: Partial<AIAssistantConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.emit('configUpdated', this.config);
  }

  /**
   * 获取AI助手状态
   */
  getStatus(): {
    isActive: boolean;
    activeSessions: number;
    supportedLanguages: string[];
    enabledFeatures: string[];
    providerStatus: Record<string, boolean>;
  } {
    return {
      isActive: true,
      activeSessions: this.activeSessions.size,
      supportedLanguages: this.config.languageSupport,
      enabledFeatures: this.getEnabledFeatures(),
      providerStatus: {
        openai: false, // 模拟OpenAI服务不可用
        claude: false, // 模拟Claude服务不可用
        local: true, // 模拟本地服务可用
      },
    };
  }

  /**
   * 私有方法
   */
  private async getOrCreateSession(sessionId: string): Promise<AISession> {
    let session = this.activeSessions.get(sessionId);

    if (!session) {
      session = {
        id: sessionId,
        context: {},
        createdAt: new Date(),
        lastActivity: new Date(),
      };
      this.activeSessions.set(sessionId, session);
    }

    session.lastActivity = new Date();
    return session;
  }

  private async buildConversationContext(session: AISession, request: AIRequest): Promise<ConversationContext> {
    const history = await this.getSessionHistory(request.sessionId);

    // 进行NLP分析
    const nlpAnalysis = await this.nlpService.processText(request.message);

    return {
      sessionId: request.sessionId,
      conversationHistory: history,
      currentMessage: request.message,
      sessionContext: session.context,
      metadata: request.metadata,
      timestamp: new Date(),
      nlpAnalysis,
    };
  }

  private selectAIProvider(request: AIRequest): 'openai' | 'claude' | 'local' {
    // 根据请求类型和配置选择最适合的AI提供商
    if (request.metadata?.preferredProvider) {
      return request.metadata.preferredProvider;
    }

    // 默认策略：优先使用配置的提供商
    return this.config.defaultProvider;
  }

  private async generateAIResponse(
    context: ConversationContext,
    provider: 'openai' | 'claude' | 'local',
  ): Promise<string> {
    // 模拟AI响应，不依赖外部服务
    const nlpAnalysis = await this.nlpService.processText(context.currentMessage);

    // 根据意图生成响应
    if (nlpAnalysis.intent === 'order_food') {
      return '您想点什么菜呢？我们有各种美味的菜品供您选择。';
    } else if (nlpAnalysis.intent === 'menu_inquiry') {
      return '我们的菜单包含各种主食、小吃和饮品。您对哪种感兴趣呢？';
    } else if (nlpAnalysis.intent === 'reservation') {
      return '好的，我可以帮您预订座位。请问您需要预订什么时间，几位客人？';
    } else {
      // 默认响应
      return `我已经理解您的问题："${context.currentMessage}"。这是一个测试响应，由本地AI服务生成。`;
    }
  }

  private async postProcessResponse(response: string, context: ConversationContext): Promise<AIResponse> {
    // 提取建议和相关信息
    const suggestions = await this.extractSuggestions(response, context);

    // 计算响应置信度
    const confidence = await this.calculateConfidence(response, context);

    // 检测是否包含专业知识
    const knowledgeCheck = await this.checkKnowledgeBase(response);

    // 构建返回数据，包含NLP分析结果、业务上下文和知识库信息
    const data: any = {};
    if (context.nlpAnalysis) {
      data.nlpAnalysis = context.nlpAnalysis;
    }
    if (context.businessContext) {
      data.businessContext = context.businessContext;
    }
    if (knowledgeCheck.found) {
      data.knowledgeBase = knowledgeCheck.data;
    }

    return {
      sessionId: context.sessionId,
      message: response,
      confidence,
      suggestions,
      data: Object.keys(data).length > 0 ? data : undefined,
      metadata: {
        timestamp: new Date(),
        hasKnowledgeBaseData: knowledgeCheck.found,
      },
    };
  }

  private async analyzeImage(imageData: Buffer, analysisType: 'food' | 'menu' | 'general'): Promise<any> {
    // 模拟图像分析服务
    return {
      type: analysisType,
      confidence: 0.85,
      description: '这是一个模拟的图像分析结果',
      detectedItems: ['item1', 'item2'],
    };
  }

  private async generateImageBasedResponse(analysisResult: any, sessionId: string): Promise<AIResponse> {
    const prompt = this.buildImageAnalysisPrompt(analysisResult);

    const request: AIRequest = {
      sessionId,
      message: prompt,
      metadata: {
        originalFormat: 'image',
        analysisResult,
      },
    };

    return await this.processTextMessage(request);
  }

  private async generateSmartRecommendations(context: any): Promise<
    Array<{
      id: string;
      title: string;
      description: string;
      confidence: number;
      reason: string;
    }>
  > {
    // 基于客户画像、餐厅上下文和历史数据生成推荐
    const recommendations = [];

    // 客户偏好推荐
    if (context.customerProfile?.preferences?.favoriteCuisines) {
      // 添加基于偏好的推荐
    }

    // 热门菜品推荐
    if (context.restaurantContext?.menuItems) {
      // 添加热门菜品推荐
    }

    // 季节性推荐
    // 添加季节性推荐

    return recommendations;
  }

  private formatRecommendationsMessage(recommendations: any[]): string {
    if (recommendations.length === 0) {
      return '抱歉，目前没有适合您的推荐。';
    }

    let message = '根据您的偏好，我为您推荐以下菜品：\n\n';

    recommendations.forEach((rec, index) => {
      message += `${index + 1}. ${rec.title}\n`;
      message += `   ${rec.description}\n`;
      message += `   推荐理由：${rec.reason}\n\n`;
    });

    return message;
  }

  private async saveConversationMessage(sessionId: string, message: AIMessage): Promise<void> {
    const history = this.conversationHistory.get(sessionId) || [];
    history.push(message);

    // 保持历史记录在配置的限度内
    if (history.length > this.config.maxConversationHistory) {
      history.splice(0, history.length - this.config.maxConversationHistory);
    }

    this.conversationHistory.set(sessionId, history);
  }

  private async extractSuggestions(response: string, context: ConversationContext): Promise<string[]> {
    // 使用NLP技术从响应中提取建议
    const suggestions = [];

    // 简单的关键词匹配
    const suggestionKeywords = ['建议', '推荐', '可以', '试试', '您可能喜欢'];

    suggestionKeywords.forEach(keyword => {
      if (response.includes(keyword)) {
        // 提取包含关键词的句子作为建议
        const sentences = response.split(/[。！？.!?]/);
        const relevantSentences = sentences.filter(sentence => sentence.includes(keyword));
        suggestions.push(...relevantSentences);
      }
    });

    return suggestions.slice(0, 5); // 最多返回5个建议
  }

  private async calculateConfidence(response: string, context: ConversationContext): Promise<number> {
    // 基于多个因素计算置信度
    let confidence = 0.5; // 基础置信度

    // 响应长度适当性
    if (response.length > 20 && response.length < 500) {
      confidence += 0.2;
    }

    // 包含专业知识
    const hasKnowledge = await this.checkKnowledgeBase(response);
    if (hasKnowledge.found) {
      confidence += 0.2;
    }

    // 对话连贯性
    if (context.conversationHistory.length > 0) {
      const lastMessage = context.conversationHistory[context.conversationHistory.length - 1];
      // 简单的相关性检查
      if (this.isContextuallyRelevant(response, lastMessage.content)) {
        confidence += 0.1;
      }
    }

    return Math.min(confidence, 1.0);
  }

  private async checkKnowledgeBase(query: string): Promise<{ found: boolean; data?: any }> {
    if (!this.config.knowledgeBaseEnabled) {
      return { found: false };
    }

    try {
      const result = await this.knowledgeBaseService.search(query);
      return { found: result.length > 0, data: result };
    } catch (error) {
      console.error('Knowledge base search error:', error);
      return { found: false };
    }
  }

  private buildImageAnalysisPrompt(analysisResult: any): string {
    // 基于图像分析结果构建提示词
    if (analysisResult.type === 'food') {
      return `我看到了${analysisResult.description}。请问这道菜有什么特色吗？或者您想了解关于这道菜的什么信息？`;
    }

    return '请告诉我您想了解关于这张图片的什么信息？';
  }

  private isContextuallyRelevant(response: string, previousMessage: string): boolean {
    // 简单的相关性检查
    const responseWords = response.toLowerCase().split(/\s+/);
    const previousWords = previousMessage.toLowerCase().split(/\s+/);

    const commonWords = responseWords.filter(word => previousWords.includes(word));

    return commonWords.length / Math.max(responseWords.length, previousWords.length) > 0.1;
  }

  private calculateAverageResponseTime(messages: AIMessage[]): number {
    if (messages.length < 2) return 0;

    let totalTime = 0;
    for (let i = 1; i < messages.length; i++) {
      const currentTime = messages[i].timestamp.getTime();
      const previousTime = messages[i - 1].timestamp.getTime();
      totalTime += currentTime - previousTime;
    }

    return totalTime / (messages.length - 1);
  }

  private getEnabledFeatures(): string[] {
    const features = ['text_chat'];

    if (this.config.enableVoiceInteraction) {
      features.push('voice_interaction');
    }

    if (this.config.enableImageAnalysis) {
      features.push('image_analysis');
    }

    if (this.config.knowledgeBaseEnabled) {
      features.push('knowledge_base');
    }

    if (this.config.enableRealTimeTranslation) {
      features.push('real_time_translation');
    }

    return features;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 生成销售预测
   */
  private async generateSalesForecast(context: any): Promise<{
    confidence: number;
    forecast: Array<{
      date: string;
      sales: number;
      orders: number;
      customerCount: number;
      confidence: number;
    }>;
    trends: Array<{
      type: string;
      description: string;
      impact: number;
    }>;
    recommendations: string[];
  }> {
    const { historicalData, factors, timeRange } = context;

    // 计算预测的日期范围
    let startDate: Date;
    let endDate: Date;
    let days: number;

    // 处理两种timeRange格式：数字（天数）或对象（startDate/endDate）
    if (typeof timeRange === 'number') {
      days = timeRange;
      startDate = new Date();
      endDate = new Date();
      endDate.setDate(startDate.getDate() + days - 1);
    } else if (timeRange && timeRange.startDate && timeRange.endDate) {
      startDate = new Date(timeRange.startDate);
      endDate = new Date(timeRange.endDate);
      days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    } else {
      // 默认预测7天
      days = 7;
      startDate = new Date();
      endDate = new Date();
      endDate.setDate(startDate.getDate() + days - 1);
    }

    // 基于历史数据计算基准销售额（如果有）
    let baseSales = 5000;
    let baseOrders = 100;
    let baseCustomers = 200;
    let hasHistoricalData = false;

    if (historicalData && historicalData.length > 0) {
      hasHistoricalData = true;
      const avgSales = historicalData.reduce((sum: number, day: any) => sum + day.sales, 0) / historicalData.length;
      const avgOrders = historicalData.reduce((sum: number, day: any) => sum + day.orders, 0) / historicalData.length;
      // 支持两种字段名：customerCount（测试中使用）和customers（可能的旧数据）
      const avgCustomers =
        historicalData.reduce((sum: number, day: any) => sum + (day.customerCount || day.customers || 0), 0) /
        historicalData.length;

      baseSales = avgSales;
      baseOrders = avgOrders;
      baseCustomers = avgCustomers;
    }

    // 初始化趋势和因素影响
    const trends: any[] = [];
    let totalImpact = 0;

    // 考虑周末因素
    const weekendImpact = 0.3;
    trends.push({
      type: 'daily',
      description: '周末销售额预计比工作日高30%',
      impact: weekendImpact,
    });

    // 考虑促销活动因素
    if (factors?.promotions) {
      const promotionImpact = 0.15;
      totalImpact += promotionImpact;
      trends.push({
        type: 'promotion',
        description: '当前促销活动预计提高销售额15%',
        impact: promotionImpact,
      });
    }

    // 考虑节假日因素
    if (factors?.holidays) {
      const holidayImpact = 0.25;
      totalImpact += holidayImpact;
      trends.push({
        type: 'holiday',
        description: '节假日预计提高销售额25%',
        impact: holidayImpact,
      });
    }

    // 考虑天气因素
    if (factors?.weather) {
      // 这里可以根据实际天气数据进行更精确的预测
      // 暂时使用一个平均影响值
      const weatherImpact = 0.1;
      totalImpact += weatherImpact;
      trends.push({
        type: 'weather',
        description: '天气因素预计影响销售额10%',
        impact: weatherImpact,
      });
    }

    // 考虑事件因素
    if (factors?.events) {
      const eventImpact = 0.2;
      totalImpact += eventImpact;
      trends.push({
        type: 'event',
        description: '周边活动预计提高销售额20%',
        impact: eventImpact,
      });
    }

    // 生成每日预测
    const forecast = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dayOfWeek = date.getDay();

      // 计算日期特定的影响因素
      let dayImpact = totalImpact;

      // 周末额外影响
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        dayImpact += weekendImpact;
      }

      // 应用影响因素
      const dailySales = baseSales * (1 + dayImpact) * (0.9 + Math.random() * 0.2);
      const salesToOrdersRatio = baseSales / baseOrders;
      const ordersToCustomersRatio = baseOrders / baseCustomers;

      forecast.push({
        date: date.toISOString().split('T')[0],
        sales: Math.round(dailySales),
        orders: Math.round((dailySales / salesToOrdersRatio) * (0.95 + Math.random() * 0.1)),
        customerCount: Math.round(
          (dailySales / salesToOrdersRatio / ordersToCustomersRatio) * (0.95 + Math.random() * 0.1),
        ),
        confidence: hasHistoricalData ? 0.85 + Math.random() * 0.1 : 0.7 + Math.random() * 0.1,
      });
    }

    // 生成建议
    const recommendations: string[] = [];

    // 根据预测销售额的高低生成建议
    const avgForecastSales = forecast.reduce((sum: number, day: any) => sum + day.sales, 0) / forecast.length;
    const isHighDemand = avgForecastSales > baseSales * 1.2;

    if (isHighDemand) {
      recommendations.push('建议增加库存以应对高需求');
      recommendations.push('考虑增加员工数量以保证服务质量');
    } else {
      recommendations.push('考虑推出促销活动以提高销售额');
      recommendations.push('优化库存管理以减少浪费');
    }

    // 根据周末影响生成建议
    recommendations.push('建议在周末增加2名服务员');
    recommendations.push('提前准备周末所需的食材和库存');

    // 根据工作日表现生成建议
    const weekdaySales = forecast
      .filter((day: any) => {
        const dayOfWeek = new Date(day.date).getDay();
        return dayOfWeek >= 1 && dayOfWeek <= 5;
      })
      .reduce((sum: number, day: any) => sum + day.sales, 0);

    const weekendSales = forecast
      .filter((day: any) => {
        const dayOfWeek = new Date(day.date).getDay();
        return dayOfWeek === 0 || dayOfWeek === 6;
      })
      .reduce((sum: number, day: any) => sum + day.sales, 0);

    if (weekdaySales < weekendSales * 0.5) {
      recommendations.push('考虑在周三推出特价活动以提高mid-week销售额');
    }

    // 如果有促销活动
    if (factors?.promotions) {
      recommendations.push('继续监控促销活动的效果并考虑延长或调整');
    }

    // 计算整体置信度
    let overallConfidence = 0.75;
    if (hasHistoricalData) {
      overallConfidence = 0.85;
    }

    return {
      confidence: overallConfidence,
      forecast,
      trends,
      recommendations,
    };
  }

  /**
   * 生成库存优化建议
   */
  private async generateInventoryOptimization(context: any): Promise<{
    confidence: number;
    recommendations: Array<{
      itemId: string;
      itemName: string;
      action: string;
      reason: string;
      priority: 'high' | 'medium' | 'low';
    }>;
    optimizationMetrics: {
      estimatedWasteReduction: number;
      estimatedCostSavings: number;
      improvedStockTurnover: number;
    };
  }> {
    // 这里实现库存优化逻辑
    // 暂时返回模拟数据
    return {
      confidence: 0.82,
      recommendations: [
        {
          itemId: 'inv_001',
          itemName: '新鲜蔬菜',
          action: '减少20%库存',
          reason: '最近两周的使用率下降了25%',
          priority: 'high',
        },
        {
          itemId: 'inv_002',
          itemName: '大米',
          action: '维持当前库存水平',
          reason: '使用量稳定，库存周转率合理',
          priority: 'medium',
        },
        {
          itemId: 'inv_003',
          itemName: '肉类',
          action: '增加15%库存',
          reason: '周末销售预计增长30%',
          priority: 'high',
        },
      ],
      optimizationMetrics: {
        estimatedWasteReduction: 18.5,
        estimatedCostSavings: 2450,
        improvedStockTurnover: 1.2,
      },
    };
  }

  /**
   * 分析客户行为
   */
  private async analyzeCustomerBehavior(context: any): Promise<{
    confidence: number;
    insights: Array<{
      category: string;
      description: string;
      supportingData: any;
    }>;
    customerSegments: Array<{
      name: string;
      characteristics: string[];
      size: number;
      value: number;
    }>;
    recommendations: string[];
  }> {
    // 这里实现客户行为分析逻辑
    // 暂时返回模拟数据
    return {
      confidence: 0.88,
      insights: [
        {
          category: 'visit_patterns',
          description: '70%的客户在周末访问',
          supportingData: { weekendRatio: 0.7 },
        },
        {
          category: 'spending_behavior',
          description: '回头客的平均消费比新客户高40%',
          supportingData: { repeatCustomerSpendingPremium: 0.4 },
        },
        {
          category: 'favorite_items',
          description: '招牌菜占总销售额的35%',
          supportingData: { signatureDishSalesRatio: 0.35 },
        },
      ],
      customerSegments: [
        {
          name: '忠实客户',
          characteristics: ['每月访问4次以上', '平均消费100元以上', '有明确的菜单项偏好'],
          size: 120,
          value: 50000,
        },
        {
          name: '偶尔访客',
          characteristics: ['每月访问1-3次', '平均消费60元', '尝试不同菜品'],
          size: 350,
          value: 75000,
        },
        {
          name: '新客户',
          characteristics: ['首次访问', '平均消费50元', '需要引导'],
          size: 200,
          value: 30000,
        },
      ],
      recommendations: [
        '为忠实客户提供专属折扣和生日福利',
        '针对偶尔访客发送个性化推荐邮件',
        '为新客户提供首单优惠以提高回头率',
      ],
    };
  }

  /**
   * 生成菜单优化建议
   */
  private async generateMenuOptimization(context: any): Promise<{
    confidence: number;
    recommendations: Array<{
      action: string;
      reason: string;
      impact: {
        revenue: number;
        profit: number;
        customerSatisfaction: number;
      };
    }>;
    menuAnalysis: {
      topPerforming: Array<{
        itemId: string;
        name: string;
        metric: string;
        value: number;
      }>;
      underPerforming: Array<{
        itemId: string;
        name: string;
        metric: string;
        value: number;
      }>;
    };
    trendAnalysis: Array<{
      trend: string;
      relevance: number;
      recommendation: string;
    }>;
  }> {
    // 这里实现菜单优化逻辑
    // 暂时返回模拟数据
    return {
      confidence: 0.86,
      recommendations: [
        {
          action: '将招牌菜价格提高5%',
          reason: '高需求和低价格弹性',
          impact: {
            revenue: 0.05,
            profit: 0.08,
            customerSatisfaction: -0.01,
          },
        },
        {
          action: '添加2道季节性蔬菜菜品',
          reason: '响应健康饮食趋势',
          impact: {
            revenue: 0.03,
            profit: 0.04,
            customerSatisfaction: 0.06,
          },
        },
        {
          action: '移除3道低销量菜品',
          reason: '占用库存和厨房资源但贡献低',
          impact: {
            revenue: -0.01,
            profit: 0.02,
            customerSatisfaction: -0.01,
          },
        },
      ],
      menuAnalysis: {
        topPerforming: [
          {
            itemId: 'menu_001',
            name: '招牌红烧肉',
            metric: 'revenue',
            value: 15000,
          },
          {
            itemId: 'menu_002',
            name: '清蒸鱼',
            metric: 'profitMargin',
            value: 0.65,
          },
        ],
        underPerforming: [
          {
            itemId: 'menu_015',
            name: '奶油蘑菇汤',
            metric: 'salesCount',
            value: 12,
          },
          {
            itemId: 'menu_018',
            name: '蔬菜沙拉',
            metric: 'profitMargin',
            value: 0.2,
          },
        ],
      },
      trendAnalysis: [
        {
          trend: '健康饮食',
          relevance: 0.85,
          recommendation: '增加更多低脂、低糖选项',
        },
        {
          trend: '本地化食材',
          relevance: 0.75,
          recommendation: '突出使用本地农场食材的菜品',
        },
      ],
    };
  }

  /**
   * 生成运营效率优化建议
   */
  private async generateOperationalEfficiency(context: any): Promise<{
    confidence: number;
    recommendations: string[];
    efficiencyMetrics: {
      current: {
        tableTurnover: number;
        laborCostRatio: number;
        orderFulfillmentTime: number;
      };
      potentialImprovement: {
        tableTurnover: number;
        laborCostRatio: number;
        orderFulfillmentTime: number;
      };
    };
    peakHourAnalysis: Array<{
      day: string;
      startTime: string;
      endTime: string;
      suggestedStaffing: number;
      currentStaffing: number;
    }>;
  }> {
    // 这里实现运营效率优化逻辑
    // 暂时返回模拟数据
    return {
      confidence: 0.83,
      recommendations: [
        '优化厨房布局以减少菜品准备时间',
        '在周五和周六晚上增加1名厨师',
        '实施餐桌预订系统以提高座位利用率',
        '培训服务员提高点餐效率',
      ],
      efficiencyMetrics: {
        current: {
          tableTurnover: 2.5,
          laborCostRatio: 0.3,
          orderFulfillmentTime: 25,
        },
        potentialImprovement: {
          tableTurnover: 3.0,
          laborCostRatio: 0.27,
          orderFulfillmentTime: 20,
        },
      },
      peakHourAnalysis: [
        {
          day: 'Friday',
          startTime: '18:00',
          endTime: '21:00',
          suggestedStaffing: 8,
          currentStaffing: 6,
        },
        {
          day: 'Saturday',
          startTime: '12:00',
          endTime: '14:30',
          suggestedStaffing: 7,
          currentStaffing: 5,
        },
        {
          day: 'Saturday',
          startTime: '18:00',
          endTime: '21:30',
          suggestedStaffing: 9,
          currentStaffing: 7,
        },
      ],
    };
  }

  /**
   * 格式化销售预测消息
   */
  private formatSalesForecastMessage(forecast: any): string {
    let message = '📊 **未来7天销售预测**\n\n';

    // 添加预测摘要
    const totalSales = forecast.forecast.reduce((sum: number, day: any) => sum + day.sales, 0);
    message += `总计预测销售额: ¥${Math.round(totalSales).toLocaleString()}\n`;
    message += `平均每日销售额: ¥${Math.round(totalSales / forecast.forecast.length).toLocaleString()}\n\n`;

    // 添加趋势分析
    message += '🔍 **关键趋势**\n';
    forecast.trends.forEach((trend: any) => {
      message += `- ${trend.description} (影响: ${Math.round(trend.impact * 100)}%)\n`;
    });

    // 添加建议
    message += '\n💡 **建议**\n';
    forecast.recommendations.forEach((rec: string, index: number) => {
      message += `${index + 1}. ${rec}\n`;
    });

    return message;
  }

  /**
   * 格式化库存优化消息
   */
  private formatInventoryOptimizationMessage(optimization: any): string {
    let message = '📦 **库存优化建议**\n\n';

    // 添加优化指标
    message += `预计减少浪费: ${optimization.optimizationMetrics.estimatedWasteReduction}%\n`;
    message += `预计成本节约: ¥${optimization.optimizationMetrics.estimatedCostSavings.toLocaleString()}\n`;
    message += `库存周转率提升: ${optimization.optimizationMetrics.improvedStockTurnover}x\n\n`;

    // 添加具体建议
    message += '🔧 **具体行动建议**\n';
    optimization.recommendations.forEach((rec: any) => {
      message += `- [${rec.priority.toUpperCase()}] ${rec.itemName}: ${rec.action}\n`;
      message += `  原因: ${rec.reason}\n`;
    });

    return message;
  }

  /**
   * 格式化客户行为分析消息
   */
  private formatCustomerBehaviorAnalysisMessage(analysis: any): string {
    let message = '👥 **客户行为分析**\n\n';

    // 添加关键洞察
    message += '💡 **关键洞察**\n';
    analysis.insights.forEach((insight: any) => {
      message += `- ${insight.description}\n`;
    });

    // 添加客户细分
    message += '\n🎯 **客户细分**\n';
    analysis.customerSegments.forEach((segment: any) => {
      message += `- ${segment.name} (${segment.size}人):\n`;
      segment.characteristics.forEach((char: string) => {
        message += `  • ${char}\n`;
      });
    });

    // 添加建议
    message += '\n📋 **营销建议**\n';
    analysis.recommendations.forEach((rec: string, index: number) => {
      message += `${index + 1}. ${rec}\n`;
    });

    return message;
  }

  /**
   * 格式化菜单优化消息
   */
  private formatMenuOptimizationMessage(optimization: any): string {
    let message = '🍽️ **菜单优化建议**\n\n';

    // 添加推荐
    message += '💡 **优化建议**\n';
    optimization.recommendations.forEach((rec: any, index: number) => {
      message += `${index + 1}. ${rec.action}\n`;
      message += `   原因: ${rec.reason}\n`;
      message += `   预期影响: 收入+${Math.round(rec.impact.revenue * 100)}%, 利润+${Math.round(rec.impact.profit * 100)}%\n`;
    });

    // 添加菜品分析
    message += '\n🏆 **表现最佳菜品**\n';
    optimization.menuAnalysis.topPerforming.forEach((item: any, index: number) => {
      message += `${index + 1}. ${item.name} (${item.metric}: ${item.metric === 'revenue' ? '¥' : ''}${item.value})\n`;
    });

    // 添加趋势分析
    message += '\n📈 **行业趋势分析**\n';
    optimization.trendAnalysis.forEach((trend: any) => {
      message += `- ${trend.trend} (相关性: ${Math.round(trend.relevance * 100)}%): ${trend.recommendation}\n`;
    });

    return message;
  }

  /**
   * 格式化运营效率优化消息
   */
  private formatOperationalEfficiencyMessage(efficiency: any): string {
    let message = '⚙️ **运营效率优化建议**\n\n';

    // 添加效率指标对比
    message += '📊 **效率指标**\n';
    message += `当前餐桌周转率: ${efficiency.efficiencyMetrics.current.tableTurnover}次/天\n`;
    message += `潜在餐桌周转率: ${efficiency.efficiencyMetrics.potentialImprovement.tableTurnover}次/天\n\n`;

    message += `当前人工成本比例: ${Math.round(efficiency.efficiencyMetrics.current.laborCostRatio * 100)}%\n`;
    message += `潜在人工成本比例: ${Math.round(efficiency.efficiencyMetrics.potentialImprovement.laborCostRatio * 100)}%\n\n`;

    // 添加建议
    message += '💡 **改进建议**\n';
    efficiency.recommendations.forEach((rec: string, index: number) => {
      message += `${index + 1}. ${rec}\n`;
    });

    // 添加高峰期分析
    message += '\n⏰ **高峰期人员配置建议**\n';
    efficiency.peakHourAnalysis.forEach((peak: any) => {
      message += `${peak.day} ${peak.startTime}-${peak.endTime}: `;
      message += `当前${peak.currentStaffing}人 → 建议${peak.suggestedStaffing}人\n`;
    });

    return message;
  }
}
