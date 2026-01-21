export const aiConfig = {
  apiType: 'internal',
  modelName: 'yyc3-restaurant-assistant',
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
    availableFeatures: [
      'order_management',
      'menu_management',
      'finance_management',
      'customer_management',
      'data_analytics',
    ],
  },
}
