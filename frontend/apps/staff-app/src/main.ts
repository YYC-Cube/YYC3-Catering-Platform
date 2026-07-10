/**
 * YYC³餐饮行业智能化平台 - 员工端应用入口文件
 */

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from './router';
import App from './App.vue';

// 样式导入
import './styles/index.scss';
import 'element-plus/theme-chalk/index.css';

// Element Plus 组件导入
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';

// 创建应用实例
const app = createApp(App);

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 安装插件
app.use(createPinia());
app.use(router);
app.use(ElementPlus, {
  locale: zhCn,
  size: 'default',
  zIndex: 3000,
});

// 全局属性
app.config.globalProperties.$env = import.meta.env.MODE;

// 错误处理
app.config.errorHandler = (error, instance, info) => {
  console.error('Vue Error:', error, info);

  // 在生产环境中发送错误到监控服务
  if (import.meta.env.PROD) {
    // 例如：Sentry.captureException(error)
  }
};

// 警告处理
app.config.warnHandler = (msg, instance, trace) => {
  console.warn('Vue Warning:', msg, trace);
};

// 性能监控（仅在开发环境）
if (import.meta.env.DEV) {
  app.config.performance = true;
}

// 全局错误处理
window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled Promise Rejection:', event.reason);

  if (import.meta.env.PROD) {
    // 发送错误到监控服务
  }
});

window.addEventListener('error', event => {
  console.error('Global Error:', event.error);

  if (import.meta.env.PROD) {
    // 发送错误到监控服务
  }
});

// 挂载应用
app.mount('#app');

// PWA 注册（如果启用）
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// 开发环境调试工具
if (import.meta.env.DEV) {
  if (typeof window !== 'undefined') {
    window.__VUE_APP__ = app;

    window.__DEV_TOOLS__ = {
      $app: app,
      $pinia: app.config.globalProperties.$pinia,
      $router: app.config.globalProperties.$router,
    };

    console.log('🚀 YYC³ Staff App Development Mode');
    console.log('🔧 Dev tools available at window.__DEV_TOOLS__');
  }
}

// 生产环境优化
if (import.meta.env.PROD) {
  app.config.warnHandler = () => {};

  if (typeof window !== 'undefined' && window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
    window.__VUE_DEVTOOLS_GLOBAL_HOOK__.force = false;
  }
}
