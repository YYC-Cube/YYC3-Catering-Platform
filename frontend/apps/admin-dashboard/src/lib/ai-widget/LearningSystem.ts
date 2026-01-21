/**
 * YYC³ 学习系统 - 自主学习和优化
 */

import {
  LearningConfig,
  LearningInsight,
  PerformanceMetric,
  UserFeedback,
  UserMessage,
  AIResponse,
} from './types';

export class LearningSystem {
  private config: LearningConfig;
  private interactions: Array<{
    userMessage: UserMessage;
    aiResponse: AIResponse;
    performance?: PerformanceMetric;
  }> = [];
  private insights: LearningInsight[] = [];
  private patterns: Map<string, number> = new Map();

  constructor(config: LearningConfig) {
    this.config = config;
  }

  /**
   * 记录交互
   */
  async recordInteraction(
    userMessage: UserMessage,
    aiResponse: AIResponse
  ): Promise<void> {
    // 计算性能指标
    const performance = await this.evaluatePerformance(userMessage, aiResponse);

    this.interactions.push({
      userMessage,
      aiResponse,
      performance,
    });

    // 模式识别
    if (this.config.patternRecognition?.enabled) {
      await this.analyzePatterns(userMessage, aiResponse);
    }

    // 知识提取
    if (this.config.knowledgeExtraction?.enabled) {
      await this.extractKnowledge(userMessage, aiResponse);
    }

    // 限制历史记录大小
    if (this.interactions.length > 1000) {
      this.interactions = this.interactions.slice(-500);
    }
  }

  /**
   * 评估性能
   */
  private async evaluatePerformance(
    userMessage: UserMessage,
    aiResponse: AIResponse
  ): Promise<PerformanceMetric> {
    // 响应时间已经在response中
    const responseTime = aiResponse.responseTime;

    // 计算相关性（简化版 - 基于关键词匹配）
    const relevance = this.calculateRelevance(userMessage.content, aiResponse.content);

    // 计算有用性（基于响应长度和结构）
    const usefulness = this.calculateUsefulness(aiResponse);

    return {
      responseTime,
      relevance,
      usefulness,
      timestamp: new Date(),
    };
  }

  private calculateRelevance(userContent: string, aiContent: string): number {
    // 简化的相关性计算
    const userWords = userContent.toLowerCase().split(/\s+/);
    const aiWords = aiContent.toLowerCase().split(/\s+/);

    const matchCount = userWords.filter((word) =>
      aiWords.some((aiWord) => aiWord.includes(word) || word.includes(aiWord))
    ).length;

    return Math.min(matchCount / userWords.length, 1);
  }

  private calculateUsefulness(aiResponse: AIResponse): number {
    let score = 0.5; // 基础分

    // 响应长度合理性
    const contentLength = aiResponse.content.length;
    if (contentLength > 50 && contentLength < 1000) {
      score += 0.2;
    }

    // 使用了工具
    if (aiResponse.toolCalls && aiResponse.toolCalls.length > 0) {
      score += 0.2;
    }

    // 提供了来源
    if (aiResponse.sources && aiResponse.sources.length > 0) {
      score += 0.1;
    }

    return Math.min(score, 1);
  }

  /**
   * 分析模式
   */
  private async analyzePatterns(
    userMessage: UserMessage,
    aiResponse: AIResponse
  ): Promise<void> {
    // 提取关键词模式
    const keywords = this.extractKeywords(userMessage.content);

    for (const keyword of keywords) {
      const count = this.patterns.get(keyword) || 0;
      this.patterns.set(keyword, count + 1);
    }

    // 生成洞察
    const minConfidence = this.config.patternRecognition?.minConfidence || 0.8;
    const frequentPatterns = Array.from(this.patterns.entries())
      .filter(([_, count]) => count >= 5)
      .sort((a, b) => b[1] - a[1]);

    if (frequentPatterns.length > 0) {
      const [pattern, count] = frequentPatterns[0];
      const confidence = Math.min(count / this.interactions.length, 1);

      if (confidence >= minConfidence) {
        this.insights.push({
          id: `insight-${Date.now()}`,
          type: 'pattern',
          title: `频繁询问模式`,
          description: `用户经常询问关于"${pattern}"的问题（${count}次）`,
          confidence,
          evidence: [{ pattern, count }],
          actionable: true,
          suggestedActions: [
            `创建关于"${pattern}"的快捷回答`,
            `优化"${pattern}"相关的工具`,
          ],
          timestamp: new Date(),
        });
      }
    }

    // 限制洞察数量
    const maxPatterns = this.config.patternRecognition?.maxPatterns || 50;
    if (this.insights.length > maxPatterns) {
      this.insights = this.insights.slice(-maxPatterns);
    }
  }

  private extractKeywords(content: string): string[] {
    // 简化的关键词提取
    const words = content.toLowerCase().split(/\s+/);
    const stopWords = new Set(['的', '是', '在', '有', '和', '了', '吗', '呢', '啊']);

    return words
      .filter((word) => word.length > 1 && !stopWords.has(word))
      .slice(0, 5);
  }

  /**
   * 知识提取
   */
  private async extractKnowledge(
    userMessage: UserMessage,
    aiResponse: AIResponse
  ): Promise<void> {
    // 自动总结
    if (this.config.knowledgeExtraction?.autoSummarize) {
      // 这里可以调用模型进行总结
      // 简化版：记录高质量的问答对
      if (aiResponse.content.length > 100 && aiResponse.content.length < 500) {
        this.insights.push({
          id: `knowledge-${Date.now()}`,
          type: 'preference',
          title: '知识提取',
          description: `Q: ${userMessage.content.slice(0, 50)}...\nA: ${aiResponse.content.slice(0, 50)}...`,
          confidence: 0.7,
          evidence: [{ userMessage, aiResponse }],
          actionable: false,
          timestamp: new Date(),
        });
      }
    }
  }

  /**
   * 处理用户反馈
   */
  async learnFromFeedback(feedback: UserFeedback): Promise<void> {
    // 找到对应的交互
    const interaction = this.interactions.find(
      (i) => i.aiResponse.id === feedback.messageId
    );

    if (interaction && interaction.performance) {
      // 更新用户满意度
      interaction.performance.userSatisfaction = feedback.rating;

      // 基于反馈生成洞察
      if (feedback.rating < 0.5) {
        this.insights.push({
          id: `feedback-${Date.now()}`,
          type: 'improvement',
          title: '需要改进的响应',
          description: `用户对响应不满意（评分: ${feedback.rating}）`,
          confidence: 1.0,
          evidence: [{ feedback, interaction }],
          actionable: true,
          suggestedActions: [
            '分析用户期望与实际响应的差距',
            '优化相关提示词',
          ],
          timestamp: new Date(),
        });
      }
    }
  }

  /**
   * 生成洞察报告
   */
  async generateInsights(): Promise<LearningInsight[]> {
    const recentPerformance = this.interactions
      .filter((i) => i.performance)
      .slice(-50)
      .map((i) => i.performance!);

    // 计算平均指标
    if (recentPerformance.length > 0) {
      const avgResponseTime =
        recentPerformance.reduce((sum, p) => sum + p.responseTime, 0) /
        recentPerformance.length;

      const avgRelevance =
        recentPerformance.reduce((sum, p) => sum + p.relevance, 0) /
        recentPerformance.length;

      const avgUsefulness =
        recentPerformance.reduce((sum, p) => sum + p.usefulness, 0) /
        recentPerformance.length;

      // 生成性能洞察
      if (avgResponseTime > 5000) {
        this.insights.push({
          id: `perf-${Date.now()}`,
          type: 'improvement',
          title: '响应时间较慢',
          description: `平均响应时间为 ${(avgResponseTime / 1000).toFixed(2)}秒`,
          confidence: 0.9,
          evidence: [{ avgResponseTime, sampleSize: recentPerformance.length }],
          actionable: true,
          suggestedActions: [
            '优化提示词长度',
            '减少不必要的工具调用',
            '考虑使用更快的模型',
          ],
          timestamp: new Date(),
        });
      }

      if (avgRelevance < 0.6) {
        this.insights.push({
          id: `rel-${Date.now()}`,
          type: 'improvement',
          title: '响应相关性偏低',
          description: `平均相关性分数为 ${avgRelevance.toFixed(2)}`,
          confidence: 0.85,
          evidence: [{ avgRelevance, sampleSize: recentPerformance.length }],
          actionable: true,
          suggestedActions: [
            '改进上下文理解',
            '优化工具选择逻辑',
            '增强提示词指导',
          ],
          timestamp: new Date(),
        });
      }
    }

    return this.insights.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * 获取最近洞察
   */
  async getRecentInsights(count: number): Promise<LearningInsight[]> {
    return this.insights
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, count);
  }

  /**
   * 获取洞察数量
   */
  async getInsightCount(): Promise<number> {
    return this.insights.length;
  }

  /**
   * 获取性能统计
   */
  async getPerformanceStats() {
    const recentPerformance = this.interactions
      .filter((i) => i.performance)
      .slice(-100)
      .map((i) => i.performance!);

    if (recentPerformance.length === 0) {
      return null;
    }

    return {
      avgResponseTime:
        recentPerformance.reduce((sum, p) => sum + p.responseTime, 0) /
        recentPerformance.length,
      avgRelevance:
        recentPerformance.reduce((sum, p) => sum + p.relevance, 0) /
        recentPerformance.length,
      avgUsefulness:
        recentPerformance.reduce((sum, p) => sum + p.usefulness, 0) /
        recentPerformance.length,
      avgSatisfaction:
        recentPerformance.filter((p) => p.userSatisfaction).length > 0
          ? recentPerformance
              .filter((p) => p.userSatisfaction)
              .reduce((sum, p) => sum + (p.userSatisfaction || 0), 0) /
            recentPerformance.filter((p) => p.userSatisfaction).length
          : undefined,
      sampleSize: recentPerformance.length,
    };
  }
}
