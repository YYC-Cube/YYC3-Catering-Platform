/**
 * YYC³ 记忆系统 - 长期记忆存储和管理
 */

import {
  MemoryConfig,
  MemoryItem,
  ConversationMemory,
  ConversationMessage,
  UserMessage,
  AIResponse,
  UserPreferences,
} from './types';

export class MemorySystem {
  private config: MemoryConfig;
  private memoryCache: Map<string, MemoryItem> = new Map();
  private conversationCache: Map<string, ConversationMemory> = new Map();

  constructor(config: MemoryConfig) {
    this.config = config;
    this.initializeStorage();
  }

  private async initializeStorage(): Promise<void> {
    if (this.config.persistence) {
      await this.loadFromStorage();
    }
  }

  /**
   * 存储对话记录
   */
  async storeConversation(
    userMessage: UserMessage,
    aiResponse: AIResponse
  ): Promise<void> {
    const conversationId = this.getCurrentConversationId(userMessage.user.id);

    let conversation = this.conversationCache.get(conversationId);
    if (!conversation) {
      conversation = {
        id: conversationId,
        userId: userMessage.user.id,
        messages: [],
        startTime: new Date(),
        topics: [],
      };
      this.conversationCache.set(conversationId, conversation);
    }

    // 添加消息
    conversation.messages.push(
      {
        role: 'user',
        content: userMessage.content,
        timestamp: userMessage.timestamp,
      },
      {
        role: 'assistant',
        content: aiResponse.content,
        timestamp: aiResponse.timestamp,
        toolCalls: aiResponse.toolCalls,
      }
    );

    // 持久化
    if (this.config.persistence) {
      await this.saveToStorage();
    }

    // 自动清理
    if (this.config.autoCleanup) {
      await this.cleanup();
    }
  }

  /**
   * 获取最近对话
   */
  async getRecentConversations(count: number): Promise<ConversationMessage[]> {
    const allMessages: ConversationMessage[] = [];

    for (const conversation of this.conversationCache.values()) {
      allMessages.push(...conversation.messages);
    }

    return allMessages
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, count);
  }

  /**
   * 存储用户偏好
   */
  async storeUserPreference(
    userId: string,
    preferences: UserPreferences
  ): Promise<void> {
    const memoryItem: MemoryItem = {
      id: `pref-${userId}`,
      type: 'preference',
      content: preferences,
      timestamp: new Date(),
      importance: 1.0,
    };

    this.memoryCache.set(memoryItem.id, memoryItem);

    if (this.config.persistence) {
      await this.saveToStorage();
    }
  }

  /**
   * 获取用户偏好
   */
  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    const memoryItem = this.memoryCache.get(`pref-${userId}`);
    return memoryItem?.content as UserPreferences;
  }

  /**
   * 存储知识项
   */
  async storeKnowledge(
    key: string,
    knowledge: any,
    importance: number = 0.5
  ): Promise<void> {
    const memoryItem: MemoryItem = {
      id: `know-${key}`,
      type: 'knowledge',
      content: knowledge,
      timestamp: new Date(),
      importance,
    };

    this.memoryCache.set(memoryItem.id, memoryItem);

    if (this.config.persistence) {
      await this.saveToStorage();
    }
  }

  /**
   * 检索知识
   */
  async retrieveKnowledge(key: string): Promise<any> {
    const memoryItem = this.memoryCache.get(`know-${key}`);
    return memoryItem?.content;
  }

  /**
   * 搜索记忆
   */
  async searchMemory(query: string, type?: string): Promise<MemoryItem[]> {
    const results: MemoryItem[] = [];

    for (const item of this.memoryCache.values()) {
      if (type && item.type !== type) continue;

      const contentStr = JSON.stringify(item.content).toLowerCase();
      if (contentStr.includes(query.toLowerCase())) {
        results.push(item);
      }
    }

    return results.sort((a, b) => b.importance - a.importance);
  }

  /**
   * 获取记忆数量
   */
  async getMemoryCount(): Promise<number> {
    return this.memoryCache.size + this.conversationCache.size;
  }

  /**
   * 清理过期记忆
   */
  private async cleanup(): Promise<void> {
    const now = new Date();
    const retentionMs = (this.config.retentionDays || 30) * 24 * 60 * 60 * 1000;

    // 清理过期的记忆项
    for (const [id, item] of this.memoryCache.entries()) {
      if (item.expiresAt && item.expiresAt < now) {
        this.memoryCache.delete(id);
      } else if (now.getTime() - item.timestamp.getTime() > retentionMs) {
        if (item.importance < 0.5) {
          this.memoryCache.delete(id);
        }
      }
    }

    // 清理旧对话（保留最近的）
    if (this.conversationCache.size > this.config.maxConversations) {
      const conversations = Array.from(this.conversationCache.values());
      conversations.sort(
        (a, b) => b.startTime.getTime() - a.startTime.getTime()
      );

      const toKeep = conversations.slice(0, this.config.maxConversations);
      this.conversationCache.clear();
      toKeep.forEach((conv) => {
        this.conversationCache.set(conv.id, conv);
      });
    }

    if (this.config.persistence) {
      await this.saveToStorage();
    }
  }

  /**
   * 持久化到存储
   */
  private async saveToStorage(): Promise<void> {
    try {
      const data = {
        memories: Array.from(this.memoryCache.entries()),
        conversations: Array.from(this.conversationCache.entries()),
        timestamp: new Date().toISOString(),
      };

      switch (this.config.storage) {
        case 'localStorage':
          localStorage.setItem('yyc3-ai-memory', JSON.stringify(data));
          break;
        case 'indexedDB':
          // IndexedDB实现
          break;
        case 'server':
          // 服务器存储实现
          break;
      }
    } catch (error) {
      console.error('Failed to save memory:', error);
    }
  }

  /**
   * 从存储加载
   */
  private async loadFromStorage(): Promise<void> {
    try {
      let data: any = null;

      switch (this.config.storage) {
        case 'localStorage':
          const stored = localStorage.getItem('yyc3-ai-memory');
          if (stored) {
            data = JSON.parse(stored);
          }
          break;
        case 'indexedDB':
          // IndexedDB实现
          break;
        case 'server':
          // 服务器加载实现
          break;
      }

      if (data) {
        this.memoryCache = new Map(data.memories);
        this.conversationCache = new Map(data.conversations);
      }
    } catch (error) {
      console.error('Failed to load memory:', error);
    }
  }

  private getCurrentConversationId(userId: string): string {
    // 使用当天日期作为对话ID的一部分
    const today = new Date().toISOString().split('T')[0];
    return `conv-${userId}-${today}`;
  }

  /**
   * 清除所有记忆
   */
  async clear(): Promise<void> {
    this.memoryCache.clear();
    this.conversationCache.clear();

    if (this.config.persistence) {
      switch (this.config.storage) {
        case 'localStorage':
          localStorage.removeItem('yyc3-ai-memory');
          break;
        case 'indexedDB':
          // IndexedDB清除
          break;
        case 'server':
          // 服务器清除
          break;
      }
    }
  }
}
