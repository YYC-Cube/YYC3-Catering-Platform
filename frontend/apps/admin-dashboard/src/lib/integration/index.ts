/**
 * @file YYC³餐饮行业智能化平台 - 系统集成统一入口
 * @description 导出所有系统集成模块，提供统一的集成接口
 * @module integration
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 */

// UI层与业务逻辑层集成
export {
  ApiClient,
  useApi,
  useApiMutation,
  usePaginatedApi,
  useRealtimeData,
  useOptimisticUpdate,
  OrderService,
  MenuService,
  UserService,
  apiClient,
  orderService,
  menuService,
  userService,
} from './ui-business-integration';

export type {
  ApiResponse,
  RequestConfig,
} from './ui-business-integration';

// 数据层与UI层集成
export {
  CacheManager,
  cacheManager,
  DataSyncManager,
  dataSyncManager,
  useAppStore,
  useOrderStore,
  useMenuStore,
  useCachedData,
  CacheStrategy,
  SyncStatus,
} from './data-layer-integration';

export type {
  CacheConfig,
  CacheItem,
  SyncConfig,
  AppState,
  OrderState,
  MenuState,
} from './data-layer-integration';

// 多端适配
export {
  DeviceType,
  BREAKPOINTS,
  getDeviceInfo,
  getPlatformInfo,
  useDeviceInfo,
  usePlatformInfo,
  useBreakpoint,
  useResponsive,
  useMediaQuery,
  useTouchGesture,
  responsive,
  PlatformAdapter,
  platformAdapter,
  usePlatformAdapter,
  createResponsiveStyles,
} from './multi-platform-adapter';

export type {
  DeviceInfo,
  PlatformInfo,
  ResponsiveConfig,
  Breakpoint,
} from './multi-platform-adapter';

// 跨维度数据交互与状态同步
export {
  EventBus,
  eventBus,
  OfflineQueueManager,
  offlineQueueManager,
  DataConflictResolver,
  dataConflictResolver,
  RealtimeSyncManager,
  realtimeSyncManager,
  CrossDimensionDataManager,
  crossDimensionDataManager,
  useDataEvent,
  useSyncState,
  useOfflineQueue,
  DataOperationType,
  SyncState,
  DataSourceType,
} from './cross-dimension-sync';

export type {
  DataEvent,
  DataSyncConfig,
  OfflineOperation,
  DataConflict,
} from './cross-dimension-sync';

/**
 * YYC³系统集成核心类
 * 提供统一的系统集成接口
 */
export class YYC3Integration {
  private static instance: YYC3Integration;

  private constructor() {
    this.initialize();
  }

  static getInstance(): YYC3Integration {
    if (!YYC3Integration.instance) {
      YYC3Integration.instance = new YYC3Integration();
    }
    return YYC3Integration.instance;
  }

  private initialize(): void {
    console.log('YYC³系统集成初始化中...');

    // 初始化API客户端
    if (typeof window !== 'undefined') {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
      const wsBaseUrl = process.env.NEXT_PUBLIC_WS_BASE_URL || 'ws://localhost:3000';

      console.log('API基础URL:', apiBaseUrl);
      console.log('WebSocket基础URL:', wsBaseUrl);
    }

    console.log('YYC³系统集成初始化完成');
  }

  /**
   * 设置认证令牌
   */
  setAuthToken(token: string): void {
    const { apiClient } = require('./ui-business-integration');
    apiClient.setToken(token);
  }

  /**
   * 设置租户ID
   */
  setTenantId(tenantId: string): void {
    const { apiClient } = require('./ui-business-integration');
    apiClient.setTenantId(tenantId);
  }

  /**
   * 注册数据同步
   */
  registerDataSync(config: any): void {
    const { crossDimensionDataManager } = require('./cross-dimension-sync');
    crossDimensionDataManager.register(config);
  }

  /**
   * 取消注册数据同步
   */
  unregisterDataSync(entity: string): void {
    const { crossDimensionDataManager } = require('./cross-dimension-sync');
    crossDimensionDataManager.unregister(entity);
  }

  /**
   * 同步离线队列
   */
  async syncOfflineQueue(): Promise<void> {
    const { crossDimensionDataManager } = require('./cross-dimension-sync');
    await crossDimensionDataManager.syncOfflineQueue();
  }

  /**
   * 清除所有缓存
   */
  async clearAllCache(): Promise<void> {
    const { cacheManager, CacheStrategy } = require('./data-layer-integration');
    await cacheManager.clear(CacheStrategy.MEMORY);
    await cacheManager.clear(CacheStrategy.INDEXED_DB);
    await cacheManager.clear(CacheStrategy.LOCAL_STORAGE);
    await cacheManager.clear(CacheStrategy.SESSION_STORAGE);
  }

  /**
   * 获取设备信息
   */
  getDeviceInfo() {
    const { getDeviceInfo } = require('./multi-platform-adapter');
    return getDeviceInfo();
  }

  /**
   * 获取平台信息
   */
  getPlatformInfo() {
    const { getPlatformInfo } = require('./multi-platform-adapter');
    return getPlatformInfo();
  }

  /**
   * 获取同步状态
   */
  getSyncState(entity: string): any {
    const { crossDimensionDataManager } = require('./cross-dimension-sync');
    return crossDimensionDataManager.getSyncState(entity);
  }

  /**
   * 获取离线队列大小
   */
  getOfflineQueueSize(): number {
    const { offlineQueueManager } = require('./cross-dimension-sync');
    return offlineQueueManager.size();
  }

  /**
   * 获取所有离线操作
   */
  getOfflineOperations(): any[] {
    const { offlineQueueManager } = require('./cross-dimension-sync');
    return offlineQueueManager.getAll();
  }

  /**
   * 获取所有数据冲突
   */
  getConflicts(): any[] {
    const { dataConflictResolver } = require('./cross-dimension-sync');
    return dataConflictResolver.getConflicts();
  }

  /**
   * 解决数据冲突
   */
  resolveConflict(conflictId: string, resolution: 'local' | 'remote' | 'merge', mergedData?: any): void {
    const { dataConflictResolver } = require('./cross-dimension-sync');
    dataConflictResolver.resolveConflict(conflictId, resolution, mergedData);
  }

  /**
   * 获取应用状态
   */
  getAppState() {
    const { useAppStore } = require('./data-layer-integration');
    return useAppStore.getState();
  }

  /**
   * 获取订单状态
   */
  getOrderState() {
    const { useOrderStore } = require('./data-layer-integration');
    return useOrderStore.getState();
  }

  /**
   * 获取菜单状态
   */
  getMenuState() {
    const { useMenuStore } = require('./data-layer-integration');
    return useMenuStore.getState();
  }

  /**
   * 订阅事件
   */
  on(event: string, listener: any): void {
    const { eventBus } = require('./cross-dimension-sync');
    eventBus.on(event, listener);
  }

  /**
   * 取消订阅事件
   */
  off(event: string, listener: any): void {
    const { eventBus } = require('./cross-dimension-sync');
    eventBus.off(event, listener);
  }

  /**
   * 发送事件
   */
  emit(event: string, data: any): void {
    const { eventBus } = require('./cross-dimension-sync');
    eventBus.emit(event, data);
  }

  /**
   * 连接WebSocket
   */
  connectWebSocket(entity: string, wsUrl: string): WebSocket {
    const { realtimeSyncManager } = require('./cross-dimension-sync');
    return realtimeSyncManager.connectWebSocket(entity, wsUrl);
  }

  /**
   * 检查WebSocket连接状态
   */
  isWebSocketConnected(entity: string): boolean {
    const { realtimeSyncManager } = require('./cross-dimension-sync');
    return realtimeSyncManager.isConnected(entity);
  }

  /**
   * 获取平台适配器
   */
  getPlatformAdapter() {
    const { platformAdapter } = require('./multi-platform-adapter');
    return platformAdapter;
  }

  /**
   * 获取缓存管理器
   */
  getCacheManager() {
    const { cacheManager } = require('./data-layer-integration');
    return cacheManager;
  }

  /**
   * 获取API客户端
   */
  getApiClient() {
    const { apiClient } = require('./ui-business-integration');
    return apiClient;
  }

  /**
   * 获取订单服务
   */
  getOrderService() {
    const { orderService } = require('./ui-business-integration');
    return orderService;
  }

  /**
   * 获取菜单服务
   */
  getMenuService() {
    const { menuService } = require('./ui-business-integration');
    return menuService;
  }

  /**
   * 获取用户服务
   */
  getUserService() {
    const { userService } = require('./ui-business-integration');
    return userService;
  }

  /**
   * 获取数据同步管理器
   */
  getDataSyncManager() {
    const { dataSyncManager } = require('./data-layer-integration');
    return dataSyncManager;
  }

  /**
   * 获取实时同步管理器
   */
  getRealtimeSyncManager() {
    const { realtimeSyncManager } = require('./cross-dimension-sync');
    return realtimeSyncManager;
  }

  /**
   * 获取跨维度数据管理器
   */
  getCrossDimensionDataManager() {
    const { crossDimensionDataManager } = require('./cross-dimension-sync');
    return crossDimensionDataManager;
  }

  /**
   * 获取离线队列管理器
   */
  getOfflineQueueManager() {
    const { offlineQueueManager } = require('./cross-dimension-sync');
    return offlineQueueManager;
  }

  /**
   * 获取数据冲突解决器
   */
  getDataConflictResolver() {
    const { dataConflictResolver } = require('./cross-dimension-sync');
    return dataConflictResolver;
  }

  /**
   * 获取事件总线
   */
  getEventBus() {
    const { eventBus } = require('./cross-dimension-sync');
    return eventBus;
  }

  /**
   * 获取应用状态管理器
   */
  getAppStore() {
    const { useAppStore } = require('./data-layer-integration');
    return useAppStore;
  }

  /**
   * 获取订单状态管理器
   */
  getOrderStore() {
    const { useOrderStore } = require('./data-layer-integration');
    return useOrderStore;
  }

  /**
   * 获取菜单状态管理器
   */
  getMenuStore() {
    const { useMenuStore } = require('./data-layer-integration');
    return useMenuStore;
  }
}

/**
 * 创建全局系统集成实例
 */
export const yyc3Integration = YYC3Integration.getInstance();

/**
 * 默认导出
 */
export default {
  YYC3Integration,
  yyc3Integration,
};
