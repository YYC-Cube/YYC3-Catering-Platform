/**
 * YYC³ 自治AI引擎 - 核心智能系统
 * @description 完整的AI引擎，支持多模型、自主学习、工具执行
 */

import {
  AutonomousAIConfig,
  UserMessage,
  AIResponse,
  AIContext,
  AITool,
  ToolCall,
  ConversationMessage,
} from './types';
import { MemorySystem } from './MemorySystem';
import { LearningSystem } from './LearningSystem';
import { ToolRegistry } from './ToolRegistry';
import { ContextManager } from './ContextManager';
import { ModelAdapter } from './adapters/ModelAdapter';
import { OpenAIModelAdapter } from './adapters/OpenAIModelAdapter';
import { InternalModelAdapter } from './adapters/InternalModelAdapter';

export class AutonomousAIEngine {
  private config: AutonomousAIConfig;
  private memory: MemorySystem;
  private learning: LearningSystem;
  private toolRegistry: ToolRegistry;
  private contextManager: ContextManager;
  private modelAdapter: ModelAdapter;
  private conversationHistory: ConversationMessage[] = [];

  constructor(config: AutonomousAIConfig) {
    this.config = config;
    this.initializeSubsystems();
  }

  private initializeSubsystems(): void {
    // 记忆系统 - 长期记忆存储
    if (this.config.enableMemory) {
      this.memory = new MemorySystem(
        this.config.memoryConfig || {
          persistence: true,
          storage: 'localStorage',
          maxConversations: 1000,
          autoCleanup: true,
        }
      );
    }

    // 学习系统 - 自主学习和优化
    if (this.config.enableLearning) {
      this.learning = new LearningSystem(
        this.config.learningConfig || {
          reinforcementLearning: {
            enabled: true,
            learningRate: 0.1,
            explorationRate: 0.2,
          },
          patternRecognition: {
            enabled: true,
            minConfidence: 0.8,
            maxPatterns: 50,
          },
        }
      );
    }

    // 工具注册表 - 动态工具管理
    if (this.config.enableToolUse) {
      this.toolRegistry = new ToolRegistry(this.config.toolConfig);
      this.registerCoreTools();
      
      // 注册自定义工具
      if (this.config.customTools) {
        this.config.customTools.forEach((tool) => {
          this.toolRegistry.registerTool(tool);
        });
      }
    }

    // 上下文管理器
    this.contextManager = new ContextManager(this.config.businessContext);

    // 模型适配器 - 多模型支持
    this.modelAdapter = this.createModelAdapter();
  }

  private createModelAdapter(): ModelAdapter {
    switch (this.config.apiType) {
      case 'internal':
        return new InternalModelAdapter(this.config);
      case 'openai':
        return new OpenAIModelAdapter(this.config);
      case 'anthropic':
        throw new Error('Anthropic adapter not implemented yet');
      case 'azure':
        throw new Error('Azure adapter not implemented yet');
      case 'custom':
        throw new Error('Custom adapter requires implementation');
      default:
        throw new Error(`Unsupported API type: ${this.config.apiType}`);
    }
  }

  private registerCoreTools(): void {
    // 核心工具会在ToolRegistry中注册
    // 这里可以添加特定于引擎的工具
  }

  /**
   * 处理用户消息 - 核心方法
   */
  async processMessage(message: UserMessage): Promise<AIResponse> {
    const startTime = Date.now();

    try {
      // 1. 构建上下文
      const context = await this.buildContext(message);

      // 2. 选择相关工具
      const tools = this.config.enableToolUse
        ? await this.toolRegistry.suggestTools(context)
        : [];

      // 3. 构建提示词
      const prompt = await this.buildPrompt(message, context, tools);

      // 4. 调用模型生成响应
      const modelResponse = await this.modelAdapter.generate(prompt, tools);

      // 5. 处理工具调用
      let finalContent = modelResponse.content;
      const toolCalls: ToolCall[] = [];

      if (modelResponse.toolCalls && modelResponse.toolCalls.length > 0) {
        const toolResults = await this.executeToolCalls(modelResponse.toolCalls);
        toolCalls.push(...toolResults);

        // 使用工具结果生成最终响应
        const toolResultsPrompt = this.buildToolResultsPrompt(toolResults);
        const finalResponse = await this.modelAdapter.generate(
          prompt + '\n\n' + toolResultsPrompt,
          []
        );
        finalContent = finalResponse.content;
      }

      // 6. 构建响应
      const response: AIResponse = {
        id: this.generateId(),
        content: finalContent,
        timestamp: new Date(),
        model: modelResponse.model,
        toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
        usage: modelResponse.usage,
        responseTime: Date.now() - startTime,
      };

      // 7. 更新对话历史
      this.conversationHistory.push({
        role: 'user',
        content: message.content,
        timestamp: message.timestamp,
      });
      this.conversationHistory.push({
        role: 'assistant',
        content: response.content,
        timestamp: response.timestamp,
        toolCalls,
      });

      // 8. 存储记忆
      if (this.config.enableMemory) {
        await this.memory.storeConversation(message, response);
      }

      // 9. 学习更新
      if (this.config.enableLearning) {
        await this.learning.recordInteraction(message, response);
      }

      return response;
    } catch (error) {
      console.error('AI Engine error:', error);
      return {
        id: this.generateId(),
        content: `抱歉，处理您的请求时遇到了问题：${error.message}`,
        timestamp: new Date(),
        model: this.config.modelName,
        responseTime: Date.now() - startTime,
      };
    }
  }

  /**
   * 流式处理消息
   */
  async processMessageStream(
    message: UserMessage,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    const context = await this.buildContext(message);
    const tools = this.config.enableToolUse
      ? await this.toolRegistry.suggestTools(context)
      : [];
    const prompt = await this.buildPrompt(message, context, tools);

    await this.modelAdapter.streamGenerate(prompt, onChunk);

    // 更新历史（流式完成后）
    this.conversationHistory.push({
      role: 'user',
      content: message.content,
      timestamp: message.timestamp,
    });
  }

  /**
   * 构建AI上下文
   */
  private async buildContext(message: UserMessage): Promise<AIContext> {
    const recentConversations = this.config.enableMemory
      ? await this.memory.getRecentConversations(10)
      : this.conversationHistory.slice(-10);

    const userPreferences = this.config.enableMemory
      ? await this.memory.getUserPreferences(message.user.id)
      : message.user.preferences;

    const pageContext = await this.contextManager.getPageContext();

    const recentInsights = this.config.enableLearning
      ? await this.learning.getRecentInsights(5)
      : [];

    return {
      timestamp: new Date(),
      user: message.user,
      conversationHistory: recentConversations,
      userPreferences,
      businessContext: this.config.businessContext,
      pageContext,
      availableTools: this.config.enableToolUse
        ? this.toolRegistry.getAvailableTools()
        : [],
      recentInsights,
    };
  }

  /**
   * 构建提示词
   */
  private async buildPrompt(
    message: UserMessage,
    context: AIContext,
    tools: AITool[]
  ): Promise<string> {
    const systemPrompt = this.buildSystemPrompt(context);
    const conversationContext = this.buildConversationContext(context);
    const userPrompt = message.content;

    return `${systemPrompt}\n\n${conversationContext}\n\n用户: ${userPrompt}`;
  }

  private buildSystemPrompt(context: AIContext): string {
    const businessInfo = context.businessContext
      ? `
你是YYC³餐饮行业智能化平台的AI助手。

业务上下文：
- 行业: ${context.businessContext.industry}
- 用户角色: ${context.businessContext.userRole}
- 可用功能: ${context.businessContext.availableFeatures.join(', ')}
`
      : '';

    const toolsInfo =
      context.availableTools.length > 0
        ? `
可用工具：
${context.availableTools.map((tool) => `- ${tool.name}: ${tool.description}`).join('\n')}
`
        : '';

    const insightsInfo =
      context.recentInsights && context.recentInsights.length > 0
        ? `
最近的洞察：
${context.recentInsights.map((insight) => `- ${insight.title}: ${insight.description}`).join('\n')}
`
        : '';

    return `系统提示：
你是一个智能、专业、友好的AI助手。你能够：
1. 理解用户意图并提供精准的帮助
2. 使用可用的工具来完成任务
3. 基于历史对话提供个性化服务
4. 主动学习和优化响应质量

${businessInfo}
${toolsInfo}
${insightsInfo}

请始终以专业、准确、友好的方式回应用户。`;
  }

  private buildConversationContext(context: AIContext): string {
    if (context.conversationHistory.length === 0) {
      return '（新对话）';
    }

    const recentMessages = context.conversationHistory.slice(-5);
    return `对话历史：\n${recentMessages
      .map((msg) => `${msg.role === 'user' ? '用户' : 'AI'}: ${msg.content}`)
      .join('\n')}`;
  }

  /**
   * 执行工具调用
   */
  private async executeToolCalls(toolCalls: any[]): Promise<ToolCall[]> {
    const results: ToolCall[] = [];

    for (const call of toolCalls) {
      const startTime = Date.now();
      try {
        const result = await this.toolRegistry.executeTool(
          call.function.name,
          JSON.parse(call.function.arguments)
        );

        results.push({
          id: call.id,
          toolName: call.function.name,
          parameters: JSON.parse(call.function.arguments),
          result,
          executionTime: Date.now() - startTime,
        });
      } catch (error) {
        results.push({
          id: call.id,
          toolName: call.function.name,
          parameters: JSON.parse(call.function.arguments),
          error: error.message,
          executionTime: Date.now() - startTime,
        });
      }
    }

    return results;
  }

  private buildToolResultsPrompt(toolResults: ToolCall[]): string {
    return `工具执行结果：\n${toolResults
      .map(
        (result) =>
          `${result.toolName}: ${result.error || JSON.stringify(result.result?.data)}`
      )
      .join('\n')}\n\n请基于以上工具执行结果，为用户提供完整的回答。`;
  }

  /**
   * 重置对话
   */
  reset(): void {
    this.conversationHistory = [];
  }

  /**
   * 获取统计信息
   */
  async getStats() {
    return {
      conversationCount: this.conversationHistory.length / 2,
      memoryItems: this.config.enableMemory
        ? await this.memory.getMemoryCount()
        : 0,
      learningInsights: this.config.enableLearning
        ? await this.learning.getInsightCount()
        : 0,
      availableTools: this.config.enableToolUse
        ? this.toolRegistry.getAvailableTools().length
        : 0,
    };
  }

  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<AutonomousAIConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // 重新初始化受影响的子系统
    if (newConfig.apiType || newConfig.modelName) {
      this.modelAdapter = this.createModelAdapter();
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
