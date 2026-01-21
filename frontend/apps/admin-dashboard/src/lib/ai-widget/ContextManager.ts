/**
 * YYC³ 上下文管理器 - 智能上下文感知
 */

import { BusinessContext, PageContext, UserAction } from './types';

export class ContextManager {
  private businessContext?: BusinessContext;
  private userActions: UserAction[] = [];
  private pageObserver?: MutationObserver;

  constructor(businessContext?: BusinessContext) {
    this.businessContext = businessContext;
    this.initializePageObserver();
  }

  /**
   * 初始化页面观察器
   */
  private initializePageObserver(): void {
    if (typeof window === 'undefined') return;

    // 监听用户行为
    window.addEventListener('click', this.recordUserAction.bind(this), true);
    window.addEventListener('submit', this.recordUserAction.bind(this), true);

    // 监听路由变化
    window.addEventListener('popstate', this.onRouteChange.bind(this));
  }

  /**
   * 记录用户行为
   */
  private recordUserAction(event: Event): void {
    const action: UserAction = {
      type: event.type,
      timestamp: new Date(),
      target: (event.target as HTMLElement)?.tagName,
      data: this.extractEventData(event),
    };

    this.userActions.push(action);

    // 只保留最近50个动作
    if (this.userActions.length > 50) {
      this.userActions = this.userActions.slice(-50);
    }
  }

  private extractEventData(event: Event): any {
    const target = event.target as HTMLElement;
    if (!target) return {};

    return {
      id: target.id,
      className: target.className,
      textContent: target.textContent?.slice(0, 50),
    };
  }

  /**
   * 路由变化处理
   */
  private onRouteChange(): void {
    // 清除旧的用户动作
    this.userActions = [];
  }

  /**
   * 获取当前页面上下文
   */
  async getPageContext(): Promise<PageContext> {
    if (typeof window === 'undefined') {
      return {
        url: '',
        title: '',
        userActions: [],
      };
    }

    return {
      url: window.location.href,
      title: document.title,
      module: this.detectCurrentModule(),
      route: window.location.pathname,
      visibleData: await this.extractVisibleData(),
      userActions: this.userActions.slice(-10),
    };
  }

  /**
   * 检测当前模块
   */
  private detectCurrentModule(): string | undefined {
    const pathname = window.location.pathname;

    // 基于路径检测模块
    const moduleMap: Record<string, string> = {
      '/orders': 'order_management',
      '/menu': 'menu_management',
      '/customers': 'customer_management',
      '/staff': 'staff_management',
      '/finance': 'finance_management',
      '/analytics': 'data_analytics',
      '/marketing': 'marketing_management',
      '/security': 'security_audit',
      '/settings': 'system_settings',
      '/kitchen': 'kitchen_display',
    };

    for (const [path, module] of Object.entries(moduleMap)) {
      if (pathname.includes(path)) {
        return module;
      }
    }

    return undefined;
  }

  /**
   * 提取可见数据
   */
  private async extractVisibleData(): Promise<any> {
    try {
      // 提取页面中的关键数据元素
      const data: any = {};

      // 提取表格数据
      const tables = document.querySelectorAll('table');
      if (tables.length > 0) {
        data.tables = Array.from(tables)
          .slice(0, 2)
          .map((table) => ({
            rows: table.querySelectorAll('tr').length,
            headers: Array.from(table.querySelectorAll('th')).map(
              (th) => th.textContent?.trim()
            ),
          }));
      }

      // 提取统计卡片
      const statCards = document.querySelectorAll('[class*="stat"], [class*="card"]');
      if (statCards.length > 0) {
        data.statistics = Array.from(statCards)
          .slice(0, 4)
          .map((card) => ({
            text: card.textContent?.trim().slice(0, 100),
          }));
      }

      // 提取表单
      const forms = document.querySelectorAll('form');
      if (forms.length > 0) {
        data.forms = Array.from(forms).map((form) => ({
          action: form.getAttribute('action'),
          fields: form.querySelectorAll('input, select, textarea').length,
        }));
      }

      return data;
    } catch (error) {
      console.error('Failed to extract visible data:', error);
      return {};
    }
  }

  /**
   * 更新业务上下文
   */
  updateBusinessContext(context: Partial<BusinessContext>): void {
    this.businessContext = {
      ...this.businessContext,
      ...context,
    } as BusinessContext;
  }

  /**
   * 获取业务上下文
   */
  getBusinessContext(): BusinessContext | undefined {
    return this.businessContext;
  }

  /**
   * 清理资源
   */
  destroy(): void {
    if (typeof window === 'undefined') return;

    window.removeEventListener('click', this.recordUserAction.bind(this), true);
    window.removeEventListener('submit', this.recordUserAction.bind(this), true);
    window.removeEventListener('popstate', this.onRouteChange.bind(this));

    if (this.pageObserver) {
      this.pageObserver.disconnect();
    }
  }
}
