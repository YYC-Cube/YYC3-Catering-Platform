/**
 * YYC³ 工具注册表 - 动态工具管理系统
 */

import { AITool, ToolConfig, AIContext, ToolResult } from './types';
import { RESTAURANT_TOOLS } from './tools/restaurant-tools';

export class ToolRegistry {
  private tools: Map<string, AITool> = new Map();
  private toolGroups: Map<string, string[]> = new Map();
  private toolUsageStats: Map<string, number> = new Map();
  private config?: ToolConfig;

  constructor(config?: ToolConfig) {
    this.config = config;
    this.registerCoreTools();
  }

  /**
   * 注册核心工具
   */
  private registerCoreTools(): void {
    // 注册餐饮业务工具
    RESTAURANT_TOOLS.forEach((tool) => {
      this.registerTool(tool);
    });
  }

  /**
   * 注册工具
   */
  registerTool(tool: AITool): void {
    this.tools.set(tool.name, tool);

    // 自动分组
    if (tool.category) {
      if (!this.toolGroups.has(tool.category)) {
        this.toolGroups.set(tool.category, []);
      }
      this.toolGroups.get(tool.category)!.push(tool.name);
    }

    // 初始化使用统计
    this.toolUsageStats.set(tool.name, 0);
  }

  /**
   * 取消注册工具
   */
  unregisterTool(toolName: string): void {
    const tool = this.tools.get(toolName);
    if (tool) {
      this.tools.delete(toolName);
      if (tool.category) {
        const group = this.toolGroups.get(tool.category);
        if (group) {
          const index = group.indexOf(toolName);
          if (index > -1) {
            group.splice(index, 1);
          }
        }
      }
      this.toolUsageStats.delete(toolName);
    }
  }

  /**
   * 执行工具
   */
  async executeTool(toolName: string, parameters: any): Promise<ToolResult> {
    const tool = this.tools.get(toolName);
    if (!tool) {
      throw new Error(`Tool not found: ${toolName}`);
    }

    // 权限检查
    if (tool.requiresAuth) {
      // TODO: 实现权限检查逻辑
    }

    try {
      // 执行工具（带超时）
      const timeout = this.config?.toolTimeout || 30000;
      const result = await Promise.race([
        tool.execute(parameters),
        new Promise<ToolResult>((_, reject) =>
          setTimeout(() => reject(new Error('Tool execution timeout')), timeout)
        ),
      ]);

      // 记录使用统计
      this.recordToolUsage(toolName);

      return result;
    } catch (error: any) {
      console.error(`Tool execution failed: ${toolName}`, error);
      return {
        success: false,
        error: error.message || 'Tool execution failed',
      };
    }
  }

  /**
   * 批量执行工具（并行）
   */
  async executeToolsParallel(
    toolCalls: Array<{ toolName: string; parameters: any }>
  ): Promise<ToolResult[]> {
    const maxParallel = this.config?.maxParallelTools || 3;
    const chunks: typeof toolCalls[] = [];

    // 分批执行
    for (let i = 0; i < toolCalls.length; i += maxParallel) {
      chunks.push(toolCalls.slice(i, i + maxParallel));
    }

    const results: ToolResult[] = [];
    for (const chunk of chunks) {
      const chunkResults = await Promise.all(
        chunk.map(({ toolName, parameters }) =>
          this.executeTool(toolName, parameters)
        )
      );
      results.push(...chunkResults);
    }

    return results;
  }

  /**
   * 获取可用工具列表
   */
  getAvailableTools(): AITool[] {
    return Array.from(this.tools.values());
  }

  /**
   * 根据分类获取工具
   */
  getToolsByCategory(category: string): AITool[] {
    const toolNames = this.toolGroups.get(category) || [];
    return toolNames.map((name) => this.tools.get(name)!).filter(Boolean);
  }

  /**
   * 智能推荐工具
   */
  async suggestTools(context: AIContext): Promise<AITool[]> {
    const relevantTools: Array<{ tool: AITool; relevance: number }> = [];

    for (const tool of this.tools.values()) {
      const relevance = await this.calculateToolRelevance(tool, context);
      if (relevance > 0.5) {
        relevantTools.push({ tool, relevance });
      }
    }

    // 如果启用自动选择，返回所有相关工具
    if (this.config?.autoToolSelection) {
      return relevantTools
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, 10)
        .map((item) => item.tool);
    }

    // 否则只返回高度相关的工具
    return relevantTools
      .filter((item) => item.relevance > 0.7)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 5)
      .map((item) => item.tool);
  }

  /**
   * 计算工具相关性
   */
  private async calculateToolRelevance(
    tool: AITool,
    context: AIContext
  ): Promise<number> {
    let relevance = 0;

    // 基于对话历史的关键词匹配
    const recentMessages = context.conversationHistory.slice(-3);
    const conversationText = recentMessages
      .map((msg) => msg.content)
      .join(' ')
      .toLowerCase();

    // 工具名称和描述匹配
    const toolText = `${tool.name} ${tool.description}`.toLowerCase();
    const keywords = toolText.split(/\s+/);

    const matchCount = keywords.filter((keyword) =>
      conversationText.includes(keyword)
    ).length;

    relevance += (matchCount / keywords.length) * 0.5;

    // 基于业务上下文
    if (context.businessContext && tool.category) {
      const features = context.businessContext.availableFeatures || [];
      if (features.includes(tool.category)) {
        relevance += 0.3;
      }
    }

    // 基于页面上下文
    if (context.pageContext && tool.metadata?.relevantModules) {
      const currentModule = context.pageContext.module;
      if (tool.metadata.relevantModules.includes(currentModule)) {
        relevance += 0.2;
      }
    }

    // 基于使用频率（热门工具加分）
    const usageCount = this.toolUsageStats.get(tool.name) || 0;
    const avgUsage =
      Array.from(this.toolUsageStats.values()).reduce((a, b) => a + b, 0) /
      this.toolUsageStats.size;
    if (usageCount > avgUsage) {
      relevance += 0.1;
    }

    return Math.min(relevance, 1);
  }

  /**
   * 记录工具使用
   */
  private recordToolUsage(toolName: string): void {
    const count = this.toolUsageStats.get(toolName) || 0;
    this.toolUsageStats.set(toolName, count + 1);
  }

  /**
   * 获取工具使用统计
   */
  getToolUsageStats(): Array<{ toolName: string; count: number }> {
    return Array.from(this.toolUsageStats.entries())
      .map(([toolName, count]) => ({ toolName, count }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * 获取工具详情
   */
  getToolDetails(toolName: string): AITool | undefined {
    return this.tools.get(toolName);
  }
}
