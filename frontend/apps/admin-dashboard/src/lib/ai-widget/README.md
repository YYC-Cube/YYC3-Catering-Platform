# YYC³ 自治AI浮窗系统

完整的企业级自治AI系统，支持多模型、自主学习、工具扩展等高级能力。

## 🏗️ 核心架构

### 1. 核心引擎 (AutonomousAIEngine)
- ✅ 多模型支持（OpenAI、内部模型、Azure、自定义）
- ✅ 上下文感知
- ✅ 工具自动选择和执行
- ✅ 流式响应支持
- ✅ 性能监控

### 2. 记忆系统 (MemorySystem)
- ✅ 长期对话记忆
- ✅ 用户偏好存储
- ✅ 知识库管理
- ✅ 多种持久化方式（localStorage/IndexedDB/Server）
- ✅ 自动清理机制

### 3. 学习系统 (LearningSystem)
- ✅ 交互模式识别
- ✅ 性能自动评估
- ✅ 用户反馈学习
- ✅ 洞察生成
- ✅ 持续优化

### 4. 工具系统 (ToolRegistry)
- ✅ 动态工具注册
- ✅ 智能工具推荐
- ✅ 并行工具执行
- ✅ 使用统计分析
- ✅ 餐饮业务专用工具集

### 5. 上下文管理 (ContextManager)
- ✅ 页面上下文提取
- ✅ 用户行为追踪
- ✅ 业务上下文集成
- ✅ 路由感知

### 6. 模型适配器
- ✅ OpenAI适配器
- ✅ 内部模型适配器（带智能降级）
- ✅ 流式响应支持
- ✅ 工具调用支持

## 📊 已实现的餐饮业务工具

1. **订单管理**
   - `search_orders` - 搜索订单
   - `update_order_status` - 更新订单状态

2. **菜单管理**
   - `search_dishes` - 搜索菜品
   - `update_dish_availability` - 更新菜品状态

3. **财务管理**
   - `get_revenue_stats` - 获取营收统计

4. **客户管理**
   - `search_customers` - 搜索客户

5. **数据分析**
   - `analyze_sales_trend` - 销售趋势分析
   - `get_business_summary` - 业务概览

## 🚀 使用方式

### 基础使用

\`\`\`typescript
import { AutonomousAIEngine } from './ai-widget/AutonomousAIEngine';

const engine = new AutonomousAIEngine({
  apiType: 'internal',
  modelName: 'yyc3-model',
  enableLearning: true,
  enableMemory: true,
  enableToolUse: true,
  enableContextAwareness: true,
  position: 'bottom-right',
  theme: 'light',
  language: 'zh-CN',
  businessContext: {
    industry: 'restaurant',
    userRole: 'manager',
    availableFeatures: ['order_management', 'menu_management'],
  },
});

// 处理消息
const response = await engine.processMessage({
  id: '123',
  content: '今天的营收情况如何？',
  timestamp: new Date(),
  user: {
    id: 'user-001',
    name: '张经理',
    role: 'manager',
  },
});
\`\`\`

### 流式响应

\`\`\`typescript
await engine.processMessageStream(
  {
    id: '123',
    content: '分析本月销售趋势',
    timestamp: new Date(),
    user: { id: 'user-001' },
  },
  (chunk) => {
    console.log('收到片段:', chunk);
  }
);
\`\`\`

### 自定义工具

\`\`\`typescript
import { AITool } from './ai-widget/types';

const customTool: AITool = {
  name: 'custom_action',
  description: '执行自定义操作',
  category: 'custom',
  parameters: {
    type: 'object',
    properties: {
      action: { type: 'string', description: '操作类型' },
    },
    required: ['action'],
  },
  execute: async (params) => {
    // 自定义逻辑
    return {
      success: true,
      data: { result: 'completed' },
    };
  },
};

engine.updateConfig({
  customTools: [customTool],
});
\`\`\`

## 📈 性能特性

- ⚡ **智能缓存**: 记忆系统自动缓存常用数据
- 🎯 **工具推荐**: 基于上下文智能推荐相关工具
- 📊 **性能监控**: 实时监控响应时间和质量
- 🔄 **自动优化**: 基于学习系统持续优化
- 💾 **降级支持**: 内部模型不可用时自动降级

## 🔒 安全特性

- 🔐 **权限控制**: 工具执行前的权限检查
- 🛡️ **输入验证**: 参数自动验证
- ⏱️ **超时保护**: 工具执行超时自动中断
- 📝 **审计日志**: 完整的操作记录

## 🎨 UI组件（待集成到YUBot）

下一步将创建：
1. 增强版YUBot组件
2. AI聊天界面
3. 工具执行可视化
4. 学习洞察展示
5. 性能仪表板

## 📦 文件结构

\`\`\`
/src/app/ai-widget/
├── types.ts                    # 核心类型定义
├── AutonomousAIEngine.ts       # AI引擎核心
├── MemorySystem.ts             # 记忆系统
├── LearningSystem.ts           # 学习系统
├── ToolRegistry.ts             # 工具注册表
├── ContextManager.ts           # 上下文管理器
├── adapters/
│   ├── ModelAdapter.ts         # 适配器基类
│   ├── OpenAIModelAdapter.ts   # OpenAI适配器
│   └── InternalModelAdapter.ts # 内部模型适配器
└── tools/
    └── restaurant-tools.ts     # 餐饮业务工具集
\`\`\`

## 🎯 核心优势

1. **完全独立** - 可以作为独立npm包发布
2. **框架无关** - 纯TypeScript实现，可集成到任何框架
3. **高度可配置** - 通过配置适应不同场景
4. **智能学习** - 持续优化响应质量
5. **业务集成** - 深度理解餐饮行业业务

## 📊 下一步计划

- [ ] React组件封装
- [ ] Vue组件封装
- [ ] 完整UI系统
- [ ] 高级分析面板
- [ ] 多语言支持
- [ ] 语音交互
- [ ] 图表生成能力
- [ ] PDF报告生成

---

**版本**: 1.0.0  
**作者**: YYC³ 团队  
**许可**: MIT
