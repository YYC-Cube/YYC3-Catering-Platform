/**
 * YYC³ 餐饮业务专用AI工具集
 */

import { AITool } from '../types';

export const RESTAURANT_TOOLS: AITool[] = [
  // ==================== 订单管理工具 ====================
  {
    name: 'search_orders',
    description: '搜索和查询订单信息',
    category: 'order_management',
    parameters: {
      type: 'object',
      properties: {
        orderId: { type: 'string', description: '订单ID' },
        status: {
          type: 'string',
          enum: ['pending', 'preparing', 'ready', 'delivered', 'completed', 'cancelled'],
          description: '订单状态',
        },
        dateRange: {
          type: 'object',
          description: '日期范围',
          properties: {
            from: { type: 'string', description: '开始日期 (YYYY-MM-DD)' },
            to: { type: 'string', description: '结束日期 (YYYY-MM-DD)' },
          },
        },
        limit: { type: 'number', description: '返回数量限制', default: 10 },
      },
    },
    execute: async (params) => {
      // 模拟订单数据
      const mockOrders = [
        {
          orderId: 'ORD-2024-001',
          tableNumber: 5,
          status: 'preparing',
          totalAmount: 268.5,
          items: [
            { dishName: '宫保鸡丁', quantity: 2, price: 48 },
            { dishName: '红烧肉', quantity: 1, price: 68 },
          ],
          timestamp: new Date().toISOString(),
        },
        {
          orderId: 'ORD-2024-002',
          tableNumber: 3,
          status: 'completed',
          totalAmount: 156.0,
          items: [{ dishName: '糖醋排骨', quantity: 2, price: 58 }],
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
      ];

      return {
        success: true,
        data: {
          orders: mockOrders.slice(0, params.limit || 10),
          total: mockOrders.length,
        },
      };
    },
    metadata: {
      relevantModules: ['order_management', 'kitchen_display'],
    },
  },

  {
    name: 'update_order_status',
    description: '更新订单状态',
    category: 'order_management',
    parameters: {
      type: 'object',
      properties: {
        orderId: { type: 'string', description: '订单ID' },
        status: {
          type: 'string',
          enum: ['pending', 'preparing', 'ready', 'delivered', 'completed', 'cancelled'],
          description: '新状态',
        },
        reason: { type: 'string', description: '状态变更原因（取消时必填）' },
      },
      required: ['orderId', 'status'],
    },
    execute: async (params) => {
      return {
        success: true,
        data: {
          orderId: params.orderId,
          previousStatus: 'preparing',
          newStatus: params.status,
          updatedAt: new Date().toISOString(),
        },
      };
    },
    metadata: {
      relevantModules: ['order_management', 'kitchen_display'],
    },
  },

  // ==================== 菜单管理工具 ====================
  {
    name: 'search_dishes',
    description: '搜索和查询菜品信息',
    category: 'menu_management',
    parameters: {
      type: 'object',
      properties: {
        keyword: { type: 'string', description: '搜索关键词' },
        category: { type: 'string', description: '菜品分类' },
        availableOnly: { type: 'boolean', description: '仅显示可售菜品', default: false },
        limit: { type: 'number', description: '返回数量限制', default: 10 },
      },
    },
    execute: async (params) => {
      const mockDishes = [
        {
          dishId: 'DISH-001',
          name: '宫保鸡丁',
          category: '川菜',
          price: 48,
          ingredients: ['鸡肉', '花生', '辣椒', '葱'],
          allergens: ['花生'],
          availability: true,
          popularity: 95,
          preparationTime: 15,
        },
        {
          dishId: 'DISH-002',
          name: '红烧肉',
          category: '本帮菜',
          price: 68,
          ingredients: ['五花肉', '酱油', '冰糖', '料酒'],
          allergens: [],
          availability: true,
          popularity: 88,
          preparationTime: 45,
        },
        {
          dishId: 'DISH-003',
          name: '麻婆豆腐',
          category: '川菜',
          price: 35,
          ingredients: ['豆腐', '牛肉末', '豆瓣酱', '花椒'],
          allergens: [],
          availability: false,
          popularity: 82,
          preparationTime: 12,
        },
      ];

      let filtered = mockDishes;

      if (params.keyword) {
        filtered = filtered.filter((dish) =>
          dish.name.includes(params.keyword!)
        );
      }

      if (params.category) {
        filtered = filtered.filter((dish) => dish.category === params.category);
      }

      if (params.availableOnly) {
        filtered = filtered.filter((dish) => dish.availability);
      }

      return {
        success: true,
        data: {
          dishes: filtered.slice(0, params.limit || 10),
          total: filtered.length,
        },
      };
    },
    metadata: {
      relevantModules: ['menu_management', 'customer'],
    },
  },

  {
    name: 'update_dish_availability',
    description: '更新菜品可售状态',
    category: 'menu_management',
    parameters: {
      type: 'object',
      properties: {
        dishId: { type: 'string', description: '菜品ID' },
        availability: { type: 'boolean', description: '是否可售' },
        reason: { type: 'string', description: '状态变更原因' },
      },
      required: ['dishId', 'availability'],
    },
    execute: async (params) => {
      return {
        success: true,
        data: {
          dishId: params.dishId,
          availability: params.availability,
          updatedAt: new Date().toISOString(),
          message: params.availability ? '菜品已上架' : '菜品已下架',
        },
      };
    },
    metadata: {
      relevantModules: ['menu_management'],
    },
  },

  // ==================== 财务管理工具 ====================
  {
    name: 'get_revenue_stats',
    description: '获取营收统计数据',
    category: 'finance_management',
    parameters: {
      type: 'object',
      properties: {
        period: {
          type: 'string',
          enum: ['today', 'week', 'month', 'year', 'custom'],
          description: '统计周期',
        },
        dateRange: {
          type: 'object',
          description: '自定义日期范围（period为custom时使用）',
          properties: {
            from: { type: 'string', description: '开始日期' },
            to: { type: 'string', description: '结束日期' },
          },
        },
        breakdown: {
          type: 'boolean',
          description: '是否需要详细分解',
          default: false,
        },
      },
      required: ['period'],
    },
    execute: async (params) => {
      return {
        success: true,
        data: {
          period: params.period,
          totalRevenue: 125680.5,
          orderCount: 456,
          averageOrderValue: 275.6,
          breakdown: params.breakdown
            ? {
                dineIn: 89340.2,
                takeout: 28450.8,
                delivery: 7889.5,
              }
            : undefined,
          trend: '+12.5%',
          comparedToPrevious: 'up',
        },
      };
    },
    metadata: {
      relevantModules: ['finance_management', 'data_analytics'],
    },
  },

  // ==================== 客户管理工具 ====================
  {
    name: 'search_customers',
    description: '搜索和查询客户信息',
    category: 'customer_management',
    parameters: {
      type: 'object',
      properties: {
        keyword: { type: 'string', description: '搜索关键词（姓名/手机号）' },
        memberLevel: { type: 'string', description: '会员等级' },
        limit: { type: 'number', description: '返回数量', default: 10 },
      },
    },
    execute: async (params) => {
      const mockCustomers = [
        {
          customerId: 'CUST-001',
          name: '张三',
          phone: '138****1234',
          memberLevel: 'VIP',
          totalSpent: 12580.0,
          visitCount: 48,
          lastVisit: new Date().toISOString(),
        },
        {
          customerId: 'CUST-002',
          name: '李四',
          phone: '139****5678',
          memberLevel: '普通会员',
          totalSpent: 3250.0,
          visitCount: 15,
          lastVisit: new Date(Date.now() - 86400000).toISOString(),
        },
      ];

      return {
        success: true,
        data: {
          customers: mockCustomers.slice(0, params.limit || 10),
          total: mockCustomers.length,
        },
      };
    },
    metadata: {
      relevantModules: ['customer_management'],
    },
  },

  // ==================== 数据分析工具 ====================
  {
    name: 'analyze_sales_trend',
    description: '分析销售趋势和模式',
    category: 'data_analytics',
    parameters: {
      type: 'object',
      properties: {
        metric: {
          type: 'string',
          enum: ['revenue', 'orders', 'customers', 'dishes'],
          description: '分析指标',
        },
        period: { type: 'string', description: '分析周期', default: 'month' },
      },
      required: ['metric'],
    },
    execute: async (params) => {
      return {
        success: true,
        data: {
          metric: params.metric,
          period: params.period,
          trend: 'increasing',
          growthRate: 15.8,
          insights: [
            '周末销售额显著高于工作日（+35%）',
            '午餐时段（11:00-14:00）占日营收42%',
            '川菜类菜品最受欢迎，占总销量38%',
          ],
          predictions: {
            nextMonth: '+12%',
            confidence: 0.85,
          },
        },
      };
    },
    metadata: {
      relevantModules: ['data_analytics'],
    },
  },

  // ==================== 通用工具 ====================
  {
    name: 'get_business_summary',
    description: '获取当前业务概览',
    category: 'general',
    parameters: {
      type: 'object',
      properties: {
        includeDetails: { type: 'boolean', description: '包含详细信息', default: false },
      },
    },
    execute: async (params) => {
      return {
        success: true,
        data: {
          timestamp: new Date().toISOString(),
          todayStats: {
            revenue: 12580.5,
            orders: 48,
            activeOrders: 5,
            tableOccupancy: '12/20 (60%)',
          },
          popularDishes: ['宫保鸡丁', '红烧肉', '糖醋排骨'],
          alerts: [
            { type: 'warning', message: '3号桌订单已超过45分钟' },
            { type: 'info', message: '今日营收已达成目标的85%' },
          ],
          details: params.includeDetails
            ? {
                peakHours: '12:00-13:00, 18:00-20:00',
                averageWaitTime: '18分钟',
                customerSatisfaction: '4.7/5.0',
              }
            : undefined,
        },
      };
    },
    metadata: {
      relevantModules: ['dashboard'],
    },
  },
];
