/**
 * @fileoverview YYC³餐饮行业智能化平台 - 管理后台入口文件
 * @description 初始化Vue应用，配置路由、状态管理、UI组件和全局功能
 * @author YYC³
 * @version 1.0.0
 * @created 2024-01-01
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';

// 性能监控插件
import { createPerformancePlugin } from './plugins/performance';

// 样式导入
import './styles/index.scss';
import './styles/tailwind.css';
import 'element-plus/theme-chalk/index.css';

// Element Plus 组件导入
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';

// ECharts 全局配置
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
} from 'echarts/components';
import {
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  RadarChart,
  MapChart,
  TreeChart,
  TreemapChart,
  GraphChart,
  GaugeChart,
  FunnelChart,
  ParallelChart,
  SankeyChart,
  BoxplotChart,
  CandlestickChart,
  HeatmapChart,
  SunburstChart,
  ThemeRiverChart,
  CustomChart,
} from 'echarts/charts';

// 注册 ECharts 组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  RadarChart,
  MapChart,
  TreeChart,
  TreemapChart,
  GraphChart,
  GaugeChart,
  FunnelChart,
  ParallelChart,
  SankeyChart,
  BoxplotChart,
  CandlestickChart,
  HeatmapChart,
  SunburstChart,
  ThemeRiverChart,
  CustomChart,
]);

// 创建应用实例
const app = createApp(App);

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 全局配置 ECharts
app.config.globalProperties.$echarts = echarts;

// 安装插件
app.use(createPinia());
app.use(router);
app.use(ElementPlus, {
  locale: zhCn,
  size: 'default',
  zIndex: 3000,
});

// 安装性能监控插件
app.use(
  createPerformancePlugin({
    enableAutoMonitoring: true,
    enableRouteTracking: true,
    enableNetworkTracking: true,
    enableRenderTracking: true,
    enableMemoryTracking: true,
    reportInterval: 30000, // 30秒
    onPerformanceReport: report => {
      if ((import.meta as any).env.DEV) {
        console.log('Performance Report:', report);
      }
    },
    onPerformanceWarning: warning => {
      console.warn('Performance Warning:', warning);
    },
    customMetrics: {
      appLoadTime: () => {
        return performance.now() - (window as any).__APP_START_TIME__;
      },
      domNodes: () => document.querySelectorAll('*').length,
    },
  }),
);

// 全局属性
app.config.globalProperties.$env = (import.meta as any).env.MODE;

// 错误处理
app.config.errorHandler = (error, _instance, info) => {
  console.error('Vue Error:', error, info);

  // 在生产环境中，可以发送错误到监控服务
  if ((import.meta as any).env.PROD) {
    // 例如：Sentry.captureException(error)
  }
};

// 警告处理
app.config.warnHandler = (msg, _instance, trace) => {
  console.warn('Vue Warning:', msg, trace);
};

// 性能监控（仅在开发环境）
if ((import.meta as any).env.DEV) {
  app.config.performance = true;
}

// 全局错误处理
window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled Promise Rejection:', event.reason);

  // 在生产环境中发送到监控服务
  if ((import.meta as any).env.PROD) {
    // 例如：Sentry.captureException(event.reason)
  }
});

// 全局错误处理
window.addEventListener('error', event => {
  console.error('Global Error:', event.error);

  // 在生产环境中发送到监控服务
  if ((import.meta as any).env.PROD) {
    // 例如：Sentry.captureException(event.error)
  }
});

// 引入智能服务
import { intelligentMenuService } from './services/intelligentMenuService';
import { intelligentFormService } from './services/intelligentFormService';
import { intelligentAnalyticsService } from './services/intelligentAnalyticsService';

// 记录应用启动时间
(window as any).__APP_START_TIME__ = performance.now();

// 全局注册智能服务
app.config.globalProperties.$intelligentMenuService = intelligentMenuService;
app.config.globalProperties.$intelligentFormService = intelligentFormService;
app.config.globalProperties.$intelligentAnalyticsService = intelligentAnalyticsService;

// 初始化智能服务
async function initializeIntelligentServices() {
  try {
    console.log('正在初始化智能服务...');

    // 初始化智能菜单系统
    await intelligentMenuService.initialize();
    console.log('智能菜单系统初始化完成');

    // 初始化智能表单系统
    await intelligentFormService.initialize();
    console.log('智能表单系统初始化完成');

    // 初始化智能数据分析系统
    await intelligentAnalyticsService.initialize();
    console.log('智能数据分析系统初始化完成');
  } catch (error) {
    console.error('智能服务初始化失败:', error);
  }
}

// 挂载应用并初始化智能服务
initializeIntelligentServices().then(() => {
  app.mount('#app');
});

// PWA 注册(仅当 /sw.js 实际存在时;fetch 探测避免 404 噪声)
if ('serviceWorker' in navigator && (import.meta as any).env.PROD) {
  window.addEventListener('load', () => {
    fetch('/sw.js', { method: 'HEAD' })
      .then(res => {
        if (res.ok) {
          return navigator.serviceWorker.register('/sw.js');
        }
        return null;
      })
      .then(registration => {
        if (registration) {
          console.log('SW registered: ', registration);
        }
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// 开发环境下的热更新和调试工具
if ((import.meta as any).env.DEV) {
  // 开发环境下的调试工具
  if (typeof window !== 'undefined') {
    // 暴露 Vue 实例到全局，方便调试
    (window as any).__VUE_APP__ = app;

    // 暴露 ECharts 到全局
    (window as any).echarts = echarts;

    // 添加调试工具
    (window as any).__DEV_TOOLS__ = {
      $app: app,
      $pinia: app.config.globalProperties.$pinia,
      $router: app.config.globalProperties.$router,
      $echarts: echarts,
    };

    console.log('🚀 YYC³ Admin Dashboard Development Mode');
    console.log('📊 ECharts version:', echarts.version);
    console.log('🔧 Dev tools available at window.__DEV_TOOLS__');
  }
}

// 生产环境优化
if ((import.meta as any).env.PROD) {
  // 移除开发环境下的警告
  app.config.warnHandler = () => {};

  // 禁用 Vue DevTools
  if (typeof window !== 'undefined' && (window as any).__VUE_DEVTOOLS_GLOBAL_HOOK__) {
    (window as any).__VUE_DEVTOOLS_GLOBAL_HOOK__.force = false;
  }
}
