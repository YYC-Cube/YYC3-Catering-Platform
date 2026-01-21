/**
 * YYC³ OpenAI模型适配器
 */

import { ModelAdapter } from './ModelAdapter';
import { ModelResponse, ModelInfo, AITool } from '../types';

export class OpenAIModelAdapter extends ModelAdapter {
  async generate(prompt: string, tools?: AITool[]): Promise<ModelResponse> {
    this.validateConfig();

    try {
      const response = await fetch(
        this.config.baseURL || 'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.config.apiKey}`,
          },
          body: JSON.stringify({
            model: this.config.modelName,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: this.config.maxTokens || 2000,
            temperature: this.config.temperature || 0.7,
            tools: tools ? this.formatTools(tools) : undefined,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const message = data.choices[0]?.message;

      return {
        content: message?.content || '',
        toolCalls: message?.tool_calls,
        usage: data.usage
          ? {
              promptTokens: data.usage.prompt_tokens,
              completionTokens: data.usage.completion_tokens,
              totalTokens: data.usage.total_tokens,
            }
          : undefined,
        model: data.model,
        finishReason: data.choices[0]?.finish_reason,
      };
    } catch (error: any) {
      console.error('OpenAI API error:', error);
      throw new Error(`Failed to generate response: ${error.message}`);
    }
  }

  async streamGenerate(
    prompt: string,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    this.validateConfig();

    try {
      const response = await fetch(
        this.config.baseURL || 'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.config.apiKey}`,
          },
          body: JSON.stringify({
            model: this.config.modelName,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: this.config.maxTokens || 2000,
            temperature: this.config.temperature || 0.7,
            stream: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
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
              const content = parsed.choices[0]?.delta?.content;
              if (content) {
                onChunk(content);
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
    } catch (error: any) {
      console.error('OpenAI streaming error:', error);
      throw new Error(`Failed to stream response: ${error.message}`);
    }
  }

  getModelInfo(): ModelInfo {
    return {
      name: this.config.modelName,
      provider: 'OpenAI',
      maxTokens: this.config.maxTokens || 4096,
      supportsFunctions: true,
      supportsVision: this.config.modelName.includes('vision'),
      supportsStreaming: true,
    };
  }
}
