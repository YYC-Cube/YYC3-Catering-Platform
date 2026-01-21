/**
 * YYC³ 内部模型适配器 - 对接项目内部大模型服务
 */

import { ModelAdapter } from './ModelAdapter';
import { ModelResponse, ModelInfo, AITool } from '../types';

export class InternalModelAdapter extends ModelAdapter {
  async generate(prompt: string, tools?: AITool[]): Promise<ModelResponse> {
    this.validateConfig();

    try {
      // 调用项目内部的AI服务API
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          tools: tools ? this.formatTools(tools) : undefined,
          config: {
            model: this.config.modelName,
            max_tokens: this.config.maxTokens || 2000,
            temperature: this.config.temperature || 0.7,
          },
        }),
      });

      if (!response.ok) {
        // 如果内部API不可用，返回模拟响应
        console.warn('Internal AI API not available, using fallback');
        return this.getFallbackResponse(prompt);
      }

      const data = await response.json();

      return {
        content: data.content || data.response || '',
        toolCalls: data.tool_calls || data.toolCalls,
        usage: data.usage,
        model: data.model || this.config.modelName,
        finishReason: data.finish_reason || 'stop',
      };
    } catch (error: any) {
      console.error('Internal AI API error:', error);
      
      // 降级到模拟响应
      return this.getFallbackResponse(prompt);
    }
  }

  async streamGenerate(
    prompt: string,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    this.validateConfig();

    try {
      const response = await fetch('/api/ai/stream-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          config: {
            model: this.config.modelName,
            max_tokens: this.config.maxTokens || 2000,
            temperature: this.config.temperature || 0.7,
          },
        }),
      });

      if (!response.ok) {
        // 降级处理：一次性返回
        const fallback = await this.getFallbackResponse(prompt);
        onChunk(fallback.content);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                onChunk(parsed.content);
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Internal AI streaming error:', error);
      // 降级处理
      const fallback = await this.getFallbackResponse(prompt);
      onChunk(fallback.content);
    }
  }

  getModelInfo(): ModelInfo {
    return {
      name: this.config.modelName,
      provider: 'YYC³ Internal',
      maxTokens: this.config.maxTokens || 4096,
      supportsFunctions: true,
      supportsVision: false,
      supportsStreaming: true,
    };
  }

  /**
   * 降级响应 - 当内部API不可用时使用
   */
  private getFallbackResponse(prompt: string): ModelResponse {
    // 智能分析prompt并生成基础响应
    const response = this.generateIntelligentFallback(prompt);

    return {
      content: response,
      model: this.config.modelName + '-fallback',
      usage: {
        promptTokens: prompt.length / 4,
        completionTokens: response.length / 4,
        totalTokens: (prompt.length + response.length) / 4,
      },
    };
  }

  private generateIntelligentFallback(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();

    // 关键词匹配生成响应
    if (lowerPrompt.includes('订单') || lowerPrompt.includes('order')) {
      return '我可以帮您查询订单信息、处理订单状态、分析订单趋势等。请告诉我您需要什么帮助？';
    }

    if (lowerPrompt.includes('菜单') || lowerPrompt.includes('menu') || lowerPrompt.includes('菜品')) {
      return '我可以帮您管理菜单、查询菜品信息、调整菜品价格和库存等。请问需要什么帮助？';
    }

    if (lowerPrompt.includes('财务') || lowerPrompt.includes('finance') || lowerPrompt.includes('收入')) {
      return '我可以帮您查看财务报表、分析收入趋势、统计经营数据等。请告诉我您想了解什么？';
    }

    if (lowerPrompt.includes('员工') || lowerPrompt.includes('staff')) {
      return '我可以帮您管理员工信息、查看考勤记录、分析员工绩效等。需要什么帮助？';
    }

    if (lowerPrompt.includes('客户') || lowerPrompt.includes('customer') || lowerPrompt.includes('会员')) {
      return '我可以帮您管理客户信息、查询会员数据、分析客户行为等。请问需要什么？';
    }

    if (lowerPrompt.includes('数据') || lowerPrompt.includes('分析') || lowerPrompt.includes('统计')) {
      return '我可以帮您进行数据分析、生成统计报表、展示业务趋势等。请具体说明您的需求。';
    }

    if (lowerPrompt.includes('帮助') || lowerPrompt.includes('help') || lowerPrompt.includes('功能')) {
      return `我是YYC³餐饮平台的AI助手，可以帮助您：
      
1. 📊 订单管理 - 查询、处理、分析订单
2. 🍽️ 菜单管理 - 管理菜品、调整价格
3. 💰 财务管理 - 查看报表、分析收入
4. 👥 员工管理 - 管理员工、查看考勤
5. 🎯 客户管理 - 管理会员、分析行为
6. 📈 数据分析 - 生成报表、展示趋势

请告诉我您需要什么帮助？`;
    }

    // 默认响应
    return '您好！我是YYC³智能助手，很高兴为您服务。我可以帮助您管理订单、菜单、财务、员工、客户等业务。请问有什么可以帮您的吗？';
  }
}
