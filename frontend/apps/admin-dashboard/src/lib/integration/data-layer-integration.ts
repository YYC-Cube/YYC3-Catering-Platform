/**
 * @file 数据层与UI层集成架构
 * @description 实现数据缓存、状态管理、实时同步的完整数据层架构
 * @module integration
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

/**
 * 数据缓存策略
 */
export enum CacheStrategy {
  NONE = 'none',
  MEMORY = 'memory',
  LOCAL_STORAGE = 'local_storage',
  INDEXED_DB = 'indexed_db',
  SESSION_STORAGE = 'session_storage',
}

/**
 * 数据同步状态
 */
export enum SyncStatus {
  IDLE = 'idle',
  SYNCING = 'syncing',
  SUCCESS = 'success',
  ERROR = 'error',
  CONFLICT = 'conflict',
}

/**
 * 缓存配置接口
 */
export interface CacheConfig<T> {
  key: string;
  strategy: CacheStrategy;
  ttl?: number;
  version?: string;
  onExpire?: () => void;
}

/**
 * 数据同步配置接口
 */
export interface SyncConfig {
  endpoint: string;
  interval?: number;
  autoSync?: boolean;
  conflictResolution?: 'client' | 'server' | 'merge';
}

/**
 * 缓存项接口
 */
export interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
  version: string;
}

/**
 * 内存缓存管理器
 */
class MemoryCache {
  private cache: Map<string, CacheItem<any>> = new Map();

  set<T>(key: string, data: T, ttl: number = 3600000, version: string = '1.0'): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      version,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

/**
 * IndexedDB缓存管理器
 */
class IndexedDBCache {
  private dbName: string = 'YYC3Cache';
  private storeName: string = 'cache';
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'key' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async set<T>(key: string, data: T, ttl: number = 3600000, version: string = '1.0'): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);

      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl,
        version,
      };

      const request = store.put({ key, ...item });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;

        if (!result) {
          resolve(null);
          return;
        }

        if (Date.now() - result.timestamp > result.ttl) {
          this.delete(key);
          resolve(null);
          return;
        }

        resolve(result.data as T);
      };

      request.onerror = () => reject(request.error);
    });
  }

  async has(key: string): Promise<boolean> {
    const data = await this.get(key);
    return data !== null;
  }

  async delete(key: string): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async size(): Promise<number> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.count();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

/**
 * 统一缓存管理器
 */
export class CacheManager {
  private memoryCache: MemoryCache;
  private indexedDBCache: IndexedDBCache;

  constructor() {
    this.memoryCache = new MemoryCache();
    this.indexedDBCache = new IndexedDBCache();
  }

  async set<T>(key: string, data: T, config: CacheConfig<T>): Promise<void> {
    const { strategy, ttl = 3600000, version = '1.0' } = config;

    switch (strategy) {
      case CacheStrategy.MEMORY:
        this.memoryCache.set(key, data, ttl, version);
        break;
      case CacheStrategy.INDEXED_DB:
        await this.indexedDBCache.set(key, data, ttl, version);
        break;
      case CacheStrategy.LOCAL_STORAGE:
        const item: CacheItem<T> = {
          data,
          timestamp: Date.now(),
          ttl,
          version,
        };
        localStorage.setItem(key, JSON.stringify(item));
        break;
      case CacheStrategy.SESSION_STORAGE:
        const sessionItem: CacheItem<T> = {
          data,
          timestamp: Date.now(),
          ttl,
          version,
        };
        sessionStorage.setItem(key, JSON.stringify(sessionItem));
        break;
      case CacheStrategy.NONE:
        break;
    }
  }

  async get<T>(key: string, strategy: CacheStrategy): Promise<T | null> {
    switch (strategy) {
      case CacheStrategy.MEMORY:
        return this.memoryCache.get<T>(key);
      case CacheStrategy.INDEXED_DB:
        return await this.indexedDBCache.get<T>(key);
      case CacheStrategy.LOCAL_STORAGE:
        const item = localStorage.getItem(key);
        if (!item) return null;

        try {
          const parsed: CacheItem<T> = JSON.parse(item);
          
          if (Date.now() - parsed.timestamp > parsed.ttl) {
            localStorage.removeItem(key);
            return null;
          }

          return parsed.data;
        } catch {
          return null;
        }
      case CacheStrategy.SESSION_STORAGE:
        const sessionItem = sessionStorage.getItem(key);
        if (!sessionItem) return null;

        try {
          const parsed: CacheItem<T> = JSON.parse(sessionItem);
          
          if (Date.now() - parsed.timestamp > parsed.ttl) {
            sessionStorage.removeItem(key);
            return null;
          }

          return parsed.data;
        } catch {
          return null;
        }
      case CacheStrategy.NONE:
        return null;
    }
  }

  async has(key: string, strategy: CacheStrategy): Promise<boolean> {
    const data = await this.get(key, strategy);
    return data !== null;
  }

  async delete(key: string, strategy: CacheStrategy): Promise<void> {
    switch (strategy) {
      case CacheStrategy.MEMORY:
        this.memoryCache.delete(key);
        break;
      case CacheStrategy.INDEXED_DB:
        await this.indexedDBCache.delete(key);
        break;
      case CacheStrategy.LOCAL_STORAGE:
        localStorage.removeItem(key);
        break;
      case CacheStrategy.SESSION_STORAGE:
        sessionStorage.removeItem(key);
        break;
      case CacheStrategy.NONE:
        break;
    }
  }

  async clear(strategy: CacheStrategy): Promise<void> {
    switch (strategy) {
      case CacheStrategy.MEMORY:
        this.memoryCache.clear();
        break;
      case CacheStrategy.INDEXED_DB:
        await this.indexedDBCache.clear();
        break;
      case CacheStrategy.LOCAL_STORAGE:
        localStorage.clear();
        break;
      case CacheStrategy.SESSION_STORAGE:
        sessionStorage.clear();
        break;
      case CacheStrategy.NONE:
        break;
    }
  }
}

/**
 * 创建全局缓存管理器实例
 */
export const cacheManager = new CacheManager();

/**
 * Zustand状态管理 - 应用状态
 */
interface AppState {
  user: {
    id: string | null;
    name: string | null;
    email: string | null;
    role: string | null;
  };
  tenant: {
    id: string | null;
    name: string | null;
    config: any;
  };
  theme: 'light' | 'dark' | 'auto';
  language: 'zh-CN' | 'en-US';
  notifications: any[];
  setUser: (user: Partial<AppState['user']>) => void;
  setTenant: (tenant: Partial<AppState['tenant']>) => void;
  setTheme: (theme: AppState['theme']) => void;
  setLanguage: (language: AppState['language']) => void;
  addNotification: (notification: any) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: {
        id: null,
        name: null,
        email: null,
        role: null,
      },
      tenant: {
        id: null,
        name: null,
        config: {},
      },
      theme: 'light',
      language: 'zh-CN',
      notifications: [],
      setUser: (user) => set((state) => ({ user: { ...state.user, ...user } })),
      setTenant: (tenant) => set((state) => ({ tenant: { ...state.tenant, ...tenant } })),
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      addNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, notification],
      })),
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      })),
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'yyc3-app-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/**
 * Zustand状态管理 - 订单状态
 */
interface OrderState {
  orders: any[];
  currentOrder: any | null;
  loading: boolean;
  error: Error | null;
  syncStatus: SyncStatus;
  setOrders: (orders: any[]) => void;
  setCurrentOrder: (order: any | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  setSyncStatus: (status: SyncStatus) => void;
  addOrder: (order: any) => void;
  updateOrder: (orderId: string, updates: Partial<any>) => void;
  removeOrder: (orderId: string) => void;
}

export const useOrderStore = create<OrderState>()(
  immer((set) => ({
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    syncStatus: SyncStatus.IDLE,
    setOrders: (orders) => set({ orders }),
    setCurrentOrder: (order) => set({ currentOrder: order }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setSyncStatus: (status) => set({ syncStatus: status }),
    addOrder: (order) => set((state) => {
      state.orders.push(order);
    }),
    updateOrder: (orderId, updates) => set((state) => {
      const index = state.orders.findIndex((o) => o.id === orderId);
      if (index !== -1) {
        Object.assign(state.orders[index], updates);
      }
    }),
    removeOrder: (orderId) => set((state) => {
      state.orders = state.orders.filter((o) => o.id !== orderId);
    }),
  }))
);

/**
 * Zustand状态管理 - 菜单状态
 */
interface MenuState {
  menus: any[];
  currentMenu: any | null;
  loading: boolean;
  error: Error | null;
  setMenus: (menus: any[]) => void;
  setCurrentMenu: (menu: any | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  addMenu: (menu: any) => void;
  updateMenu: (menuId: string, updates: Partial<any>) => void;
  removeMenu: (menuId: string) => void;
}

export const useMenuStore = create<MenuState>()(
  immer((set) => ({
    menus: [],
    currentMenu: null,
    loading: false,
    error: null,
    setMenus: (menus) => set({ menus }),
    setCurrentMenu: (menu) => set({ currentMenu: menu }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    addMenu: (menu) => set((state) => {
      state.menus.push(menu);
    }),
    updateMenu: (menuId, updates) => set((state) => {
      const index = state.menus.findIndex((m) => m.id === menuId);
      if (index !== -1) {
        Object.assign(state.menus[index], updates);
      }
    }),
    removeMenu: (menuId) => set((state) => {
      state.menus = state.menus.filter((m) => m.id !== menuId);
    }),
  }))
);

/**
 * 数据同步管理器
 */
export class DataSyncManager {
  private syncConfigs: Map<string, SyncConfig> = new Map();
  private syncIntervals: Map<string, NodeJS.Timeout> = new Map();
  private wsConnections: Map<string, WebSocket> = new Map();

  register(key: string, config: SyncConfig): void {
    this.syncConfigs.set(key, config);

    if (config.autoSync && config.interval) {
      this.startAutoSync(key);
    }
  }

  unregister(key: string): void {
    this.syncConfigs.delete(key);

    if (this.syncIntervals.has(key)) {
      clearInterval(this.syncIntervals.get(key)!);
      this.syncIntervals.delete(key);
    }

    if (this.wsConnections.has(key)) {
      this.wsConnections.get(key)!.close();
      this.wsConnections.delete(key);
    }
  }

  private startAutoSync(key: string): void {
    const config = this.syncConfigs.get(key);
    if (!config || !config.interval) return;

    const interval = setInterval(() => {
      this.sync(key);
    }, config.interval);

    this.syncIntervals.set(key, interval);
  }

  async sync(key: string): Promise<void> {
    const config = this.syncConfigs.get(key);
    if (!config) return;

    try {
      const response = await fetch(config.endpoint);
      const data = await response.json();

      if (data.success) {
        useAppStore.setState({ notifications: data.data.notifications || [] });
      }
    } catch (error) {
      console.error(`同步失败 [${key}]:`, error);
    }
  }

  connectWebSocket(key: string, wsUrl: string): WebSocket {
    if (this.wsConnections.has(key)) {
      return this.wsConnections.get(key)!;
    }

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log(`WebSocket连接已建立 [${key}]`);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleWebSocketMessage(key, message);
      } catch (error) {
        console.error('解析WebSocket消息失败:', error);
      }
    };

    ws.onerror = (error) => {
      console.error(`WebSocket错误 [${key}]:`, error);
    };

    ws.onclose = () => {
      console.log(`WebSocket连接已关闭 [${key}]`);
      this.wsConnections.delete(key);
    };

    this.wsConnections.set(key, ws);
    return ws;
  }

  private handleWebSocketMessage(key: string, message: any): void {
    switch (message.type) {
      case 'order_update':
        useOrderStore.getState().updateOrder(message.data.id, message.data);
        break;
      case 'menu_update':
        useMenuStore.getState().updateMenu(message.data.id, message.data);
        break;
      case 'notification':
        useAppStore.getState().addNotification(message.data);
        break;
      default:
        console.warn(`未知的消息类型: ${message.type}`);
    }
  }
}

/**
 * 创建全局数据同步管理器实例
 */
export const dataSyncManager = new DataSyncManager();

/**
 * React Hook - 使用缓存数据
 */
export function useCachedData<T = any>(
  key: string,
  fetcher: () => Promise<T>,
  config: CacheConfig<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const cachedData = await cacheManager.get<T>(key, config.strategy);

        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return;
        }

        const freshData = await fetcher();
        setData(freshData);
        await cacheManager.set(key, freshData, config);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [key, fetcher, config]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const freshData = await fetcher();
      setData(freshData);
      await cacheManager.set(key, freshData, config);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, config]);

  const invalidate = useCallback(async () => {
    await cacheManager.delete(key, config.strategy);
    await refresh();
  }, [key, config.strategy, refresh]);

  return { data, loading, error, refresh, invalidate };
}

/**
 * 导出所有数据层功能
 */
export default {
  cacheManager,
  dataSyncManager,
  useAppStore,
  useOrderStore,
  useMenuStore,
  useCachedData,
  CacheStrategy,
  SyncStatus,
};
