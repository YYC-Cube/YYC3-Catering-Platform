/**
 * YYC³ 模型适配器基类
 */

import { AutonomousAIConfig, ModelResponse, ModelInfo, AITool } from '../types';

export abstract class ModelAdapter {
  protected config: AutonomousAIConfig;

  constructor(config: AutonomousAIConfig) {
    this.config = config;
  }

  /**
   * 生成响应
   */
  abstract generate(prompt: string, tools?: AITool[]): Promise<ModelResponse>;

  /**
   * 流式生成
   */
  abstract streamGenerate(
    prompt: string,
    onChunk: (chunk: string) => void
  ): Promise<void>;

  /**
   * 获取模型信息
   */
  abstract getModelInfo(): ModelInfo;

  /**
   * 格式化工具为模型格式
   */
  protected formatTools(tools: AITool[]): any[] {
    return tools.map((tool) => ({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters,
      },
    }));
  }

  /**
   * 验证配置
   */
  protected validateConfig(): void {
    if (!this.config.modelName) {
      throw new Error('Model name is required');
    }
  }
}
