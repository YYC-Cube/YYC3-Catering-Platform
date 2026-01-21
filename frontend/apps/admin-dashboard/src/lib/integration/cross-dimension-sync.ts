/**
 * @file 跨维度数据交互与状态同步机制
 * @description 实现多端数据同步、实时更新、离线处理的完整同步机制
 * @module integration
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 */

import { EventEmitter } from 'events';

/**
 * 数据操作类型
 */
export enum DataOperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  SYNC = 'sync',
}

/**
 * 数据同步状态
 */
export enum SyncState {
  IDLE = 'idle',
  SYNCING = 'syncing',
  SUCCESS = 'success',
  ERROR = 'error',
  CONFLICT = 'conflict',
  OFFLINE = 'offline',
}

/**
 * 数据源类型
 */
export enum DataSourceType {
  LOCAL = 'local',
  REMOTE = 'remote',
  CACHE = 'cache',
  OFFLINE_QUEUE = 'offline_queue',
}

/**
 * 数据事件接口
 */
export interface DataEvent<T = any> {
  id: string;
  type: DataOperationType;
  source: DataSourceType;
  entity: string;
  entityId: string;
  data: T;
  timestamp: number;
  version: number;
  userId?: string;
  deviceId?: string;
}

/**
 * 数据同步配置接口
 */
export interface DataSyncConfig {
  entity: string;
  endpoint: string;
  syncInterval?: number;
  autoSync?: boolean;
  conflictResolution?: 'local' | 'remote' | 'merge' | 'manual';
  offlineSupport?: boolean;
  realTime?: boolean;
}

/**
 * 离线操作接口
 */
export interface OfflineOperation {
  id: string;
  operation: DataOperationType;
  entity: string;
  entityId: string;
  data: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

/**
 * 数据冲突接口
 */
export interface DataConflict {
  id: string;
  entity: string;
  entityId: string;
  localData: any;
  remoteData: any;
  timestamp: number;
  resolved: boolean;
}

/**
 * 事件总线
 */
export class EventBus extends EventEmitter {
  private static instance: EventBus;

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  emit<T>(event: string, data: T): boolean {
    return super.emit(event, data);
  }

  on<T>(event: string, listener: (data: T) => void): this {
    return super.on(event, listener);
  }

  off<T>(event: string, listener: (data: T) => void): this {
    return super.off(event, listener);
  }

  once<T>(event: string, listener: (data: T) => void): this {
    return super.once(event, listener);
  }
}

/**
 * 创建全局事件总线实例
 */
export const eventBus = EventBus.getInstance();

/**
 * 离线队列管理器
 */
export class OfflineQueueManager {
  private queue: Map<string, OfflineOperation> = new Map();
  private storageKey: string = 'yyc3_offline_queue';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const operations: OfflineOperation[] = JSON.parse(stored);
        operations.forEach(op => {
          this.queue.set(op.id, op);
        });
      }
    } catch (error) {
      console.error('加载离线队列失败:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const operations = Array.from(this.queue.values());
      localStorage.setItem(this.storageKey, JSON.stringify(operations));
    } catch (error) {
      console.error('保存离线队列失败:', error);
    }
  }

  add(operation: Omit<OfflineOperation, 'id' | 'timestamp' | 'retryCount'>): string {
    const id = `${operation.entity}_${operation.entityId}_${Date.now()}`;
    const offlineOperation: OfflineOperation = {
      id,
      ...operation,
      timestamp: Date.now(),
      retryCount: 0,
    };

    this.queue.set(id, offlineOperation);
    this.saveToStorage();

    eventBus.emit('offline:operation:added', offlineOperation);

    return id;
  }

  remove(id: string): void {
    this.queue.delete(id);
    this.saveToStorage();

    eventBus.emit('offline:operation:removed', id);
  }

  get(id: string): OfflineOperation | undefined {
    return this.queue.get(id);
  }

  getAll(): OfflineOperation[] {
    return Array.from(this.queue.values());
  }

  getByEntity(entity: string): OfflineOperation[] {
    return Array.from(this.queue.values()).filter(op => op.entity === entity);
  }

  clear(): void {
    this.queue.clear();
    this.saveToStorage();

    eventBus.emit('offline:queue:cleared');
  }

  size(): number {
    return this.queue.size;
  }
}

/**
 * 创建全局离线队列管理器实例
 */
export const offlineQueueManager = new OfflineQueueManager();

/**
 * 数据冲突解决器
 */
export class DataConflictResolver {
  private conflicts: Map<string, DataConflict> = new Map();

  detectConflict(localData: any, remoteData: any): boolean {
    const localVersion = localData.version || 0;
    const remoteVersion = remoteData.version || 0;

    return localVersion !== remoteVersion;
  }

  createConflict(entity: string, entityId: string, localData: any, remoteData: any): DataConflict {
    const conflict: DataConflict = {
      id: `${entity}_${entityId}_${Date.now()}`,
      entity,
      entityId,
      localData,
      remoteData,
      timestamp: Date.now(),
      resolved: false,
    };

    this.conflicts.set(conflict.id, conflict);

    eventBus.emit('conflict:detected', conflict);

    return conflict;
  }

  resolveConflict(conflictId: string, resolution: 'local' | 'remote' | 'merge', mergedData?: any): void {
    const conflict = this.conflicts.get(conflictId);
    if (!conflict) return;

    conflict.resolved = true;

    eventBus.emit('conflict:resolved', {
      conflict,
      resolution,
      mergedData,
    });

    this.conflicts.delete(conflictId);
  }

  getConflicts(): DataConflict[] {
    return Array.from(this.conflicts.values());
  }

  getConflictsByEntity(entity: string): DataConflict[] {
    return Array.from(this.conflicts.values()).filter(c => c.entity === entity);
  }
}

/**
 * 创建全局数据冲突解决器实例
 */
export const dataConflictResolver = new DataConflictResolver();

/**
 * 实时数据同步管理器
 */
export class RealtimeSyncManager {
  private wsConnections: Map<string, WebSocket> = new Map();
  private reconnectIntervals: Map<string, NodeJS.Timeout> = new Map();
  private syncConfigs: Map<string, DataSyncConfig> = new Map();

  register(config: DataSyncConfig): void {
    this.syncConfigs.set(config.entity, config);

    if (config.realTime) {
      this.connectWebSocket(config);
    }

    if (config.autoSync && config.syncInterval) {
      this.startAutoSync(config);
    }
  }

  unregister(entity: string): void {
    const config = this.syncConfigs.get(entity);
    if (!config) return;

    if (this.wsConnections.has(entity)) {
      this.wsConnections.get(entity)!.close();
      this.wsConnections.delete(entity);
    }

    if (this.reconnectIntervals.has(entity)) {
      clearInterval(this.reconnectIntervals.get(entity)!);
      this.reconnectIntervals.delete(entity);
    }

    this.syncConfigs.delete(entity);
  }

  private connectWebSocket(config: DataSyncConfig): void {
    const wsUrl = config.endpoint.replace('http', 'ws');

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log(`WebSocket连接已建立 [${config.entity}]`);
      eventBus.emit('sync:connected', { entity: config.entity });
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleWebSocketMessage(config.entity, message);
      } catch (error) {
        console.error('解析WebSocket消息失败:', error);
      }
    };

    ws.onerror = (error) => {
      console.error(`WebSocket错误 [${config.entity}]:`, error);
      eventBus.emit('sync:error', { entity: config.entity, error });
    };

    ws.onclose = () => {
      console.log(`WebSocket连接已关闭 [${config.entity}]`);
      eventBus.emit('sync:disconnected', { entity: config.entity });

      if (this.syncConfigs.has(config.entity)) {
        this.scheduleReconnect(config);
      }
    };

    this.wsConnections.set(config.entity, ws);
  }

  private scheduleReconnect(config: DataSyncConfig): void {
    const interval = setInterval(() => {
      this.connectWebSocket(config);
    }, 5000);

    this.reconnectIntervals.set(config.entity, interval);
  }

  private handleWebSocketMessage(entity: string, message: any): void {
    switch (message.type) {
      case 'create':
        eventBus.emit(`data:${entity}:created`, message.data);
        break;
      case 'update':
        eventBus.emit(`data:${entity}:updated`, message.data);
        break;
      case 'delete':
        eventBus.emit(`data:${entity}:deleted`, message.data);
        break;
      case 'sync':
        eventBus.emit(`data:${entity}:synced`, message.data);
        break;
      default:
        console.warn(`未知的WebSocket消息类型: ${message.type}`);
    }
  }

  private startAutoSync(config: DataSyncConfig): void {
    const interval = setInterval(() => {
      this.sync(config.entity);
    }, config.syncInterval!);

    this.reconnectIntervals.set(`${config.entity}_auto`, interval);
  }

  async sync(entity: string): Promise<void> {
    const config = this.syncConfigs.get(entity);
    if (!config) return;

    eventBus.emit('sync:started', { entity });

    try {
      const response = await fetch(config.endpoint);
      const data = await response.json();

      if (data.success) {
        eventBus.emit(`data:${entity}:synced`, data.data);
        eventBus.emit('sync:completed', { entity, data: data.data });
      }
    } catch (error) {
      console.error(`同步失败 [${entity}]:`, error);
      eventBus.emit('sync:error', { entity, error });
    }
  }

  isConnected(entity: string): boolean {
    const ws = this.wsConnections.get(entity);
    return ws ? ws.readyState === WebSocket.OPEN : false;
  }
}

/**
 * 创建全局实时数据同步管理器实例
 */
export const realtimeSyncManager = new RealtimeSyncManager();

/**
 * 跨维度数据交互管理器
 */
export class CrossDimensionDataManager {
  private syncConfigs: Map<string, DataSyncConfig> = new Map();
  private syncStates: Map<string, SyncState> = new Map();

  register(config: DataSyncConfig): void {
    this.syncConfigs.set(config.entity, config);
    this.syncStates.set(config.entity, SyncState.IDLE);

    realtimeSyncManager.register(config);

    eventBus.on(`data:${config.entity}:updated`, (data) => {
      this.handleDataUpdate(config.entity, data);
    });

    eventBus.on(`data:${config.entity}:deleted`, (data) => {
      this.handleDataDelete(config.entity, data);
    });
  }

  unregister(entity: string): void {
    this.syncConfigs.delete(entity);
    this.syncStates.delete(entity);
    realtimeSyncManager.unregister(entity);
  }

  private handleDataUpdate(entity: string, data: any): void {
    const config = this.syncConfigs.get(entity);
    if (!config) return;

    const event: DataEvent = {
      id: `${entity}_${data.id}_${Date.now()}`,
      type: DataOperationType.UPDATE,
      source: DataSourceType.REMOTE,
      entity,
      entityId: data.id,
      data,
      timestamp: Date.now(),
      version: data.version || 1,
    };

    eventBus.emit('data:event', event);
  }

  private handleDataDelete(entity: string, data: any): void {
    const event: DataEvent = {
      id: `${entity}_${data.id}_${Date.now()}`,
      type: DataOperationType.DELETE,
      source: DataSourceType.REMOTE,
      entity,
      entityId: data.id,
      data,
      timestamp: Date.now(),
      version: data.version || 1,
    };

    eventBus.emit('data:event', event);
  }

  async create<T>(entity: string, data: T): Promise<T> {
    const config = this.syncConfigs.get(entity);
    if (!config) throw new Error(`未找到实体 ${entity} 的同步配置`);

    this.syncStates.set(entity, SyncState.SYNCING);

    try {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        this.syncStates.set(entity, SyncState.SUCCESS);

        const event: DataEvent = {
          id: `${entity}_${result.data.id}_${Date.now()}`,
          type: DataOperationType.CREATE,
          source: DataSourceType.REMOTE,
          entity,
          entityId: result.data.id,
          data: result.data,
          timestamp: Date.now(),
          version: result.data.version || 1,
        };

        eventBus.emit('data:event', event);
        eventBus.emit(`data:${entity}:created`, result.data);

        return result.data;
      } else {
        throw new Error(result.error?.message || '创建失败');
      }
    } catch (error) {
      this.syncStates.set(entity, SyncState.ERROR);

      if (config.offlineSupport) {
        offlineQueueManager.add({
          operation: DataOperationType.CREATE,
          entity,
          entityId: (data as any).id || 'pending',
          data,
          maxRetries: 3,
        });

        this.syncStates.set(entity, SyncState.OFFLINE);
      }

      throw error;
    }
  }

  async update<T>(entity: string, entityId: string, data: Partial<T>): Promise<T> {
    const config = this.syncConfigs.get(entity);
    if (!config) throw new Error(`未找到实体 ${entity} 的同步配置`);

    this.syncStates.set(entity, SyncState.SYNCING);

    try {
      const response = await fetch(`${config.endpoint}/${entityId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        this.syncStates.set(entity, SyncState.SUCCESS);

        const event: DataEvent = {
          id: `${entity}_${entityId}_${Date.now()}`,
          type: DataOperationType.UPDATE,
          source: DataSourceType.REMOTE,
          entity,
          entityId,
          data: result.data,
          timestamp: Date.now(),
          version: result.data.version || 1,
        };

        eventBus.emit('data:event', event);
        eventBus.emit(`data:${entity}:updated`, result.data);

        return result.data;
      } else {
        throw new Error(result.error?.message || '更新失败');
      }
    } catch (error) {
      this.syncStates.set(entity, SyncState.ERROR);

      if (config.offlineSupport) {
        offlineQueueManager.add({
          operation: DataOperationType.UPDATE,
          entity,
          entityId,
          data,
          maxRetries: 3,
        });

        this.syncStates.set(entity, SyncState.OFFLINE);
      }

      throw error;
    }
  }

  async delete(entity: string, entityId: string): Promise<void> {
    const config = this.syncConfigs.get(entity);
    if (!config) throw new Error(`未找到实体 ${entity} 的同步配置`);

    this.syncStates.set(entity, SyncState.SYNCING);

    try {
      const response = await fetch(`${config.endpoint}/${entityId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        this.syncStates.set(entity, SyncState.SUCCESS);

        const event: DataEvent = {
          id: `${entity}_${entityId}_${Date.now()}`,
          type: DataOperationType.DELETE,
          source: DataSourceType.REMOTE,
          entity,
          entityId,
          data: { id: entityId },
          timestamp: Date.now(),
          version: 1,
        };

        eventBus.emit('data:event', event);
        eventBus.emit(`data:${entity}:deleted`, { id: entityId });
      } else {
        throw new Error(result.error?.message || '删除失败');
      }
    } catch (error) {
      this.syncStates.set(entity, SyncState.ERROR);

      if (config.offlineSupport) {
        offlineQueueManager.add({
          operation: DataOperationType.DELETE,
          entity,
          entityId,
          data: { id: entityId },
          maxRetries: 3,
        });

        this.syncStates.set(entity, SyncState.OFFLINE);
      }

      throw error;
    }
  }

  getSyncState(entity: string): SyncState {
    return this.syncStates.get(entity) || SyncState.IDLE;
  }

  async syncOfflineQueue(): Promise<void> {
    const operations = offlineQueueManager.getAll();

    for (const operation of operations) {
      try {
        switch (operation.operation) {
          case DataOperationType.CREATE:
            await this.create(operation.entity, operation.data);
            break;
          case DataOperationType.UPDATE:
            await this.update(operation.entity, operation.entityId, operation.data);
            break;
          case DataOperationType.DELETE:
            await this.delete(operation.entity, operation.entityId);
            break;
        }

        offlineQueueManager.remove(operation.id);
      } catch (error) {
        console.error(`同步离线操作失败 [${operation.id}]:`, error);
        operation.retryCount++;

        if (operation.retryCount >= operation.maxRetries) {
          offlineQueueManager.remove(operation.id);
        }
      }
    }
  }
}

/**
 * 创建全局跨维度数据交互管理器实例
 */
export const crossDimensionDataManager = new CrossDimensionDataManager();

/**
 * React Hook - 使用数据事件
 */
export function useDataEvent<T = any>(
  entity: string,
  eventType: DataOperationType
) {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    const handler = (eventData: T) => {
      setData(eventData);
    };

    const eventName = `data:${entity}:${eventType}`;
    eventBus.on(eventName, handler);

    return () => {
      eventBus.off(eventName, handler);
    };
  }, [entity, eventType]);

  return data;
}

/**
 * React Hook - 使用同步状态
 */
export function useSyncState(entity: string) {
  const [syncState, setSyncState] = useState<SyncState>(SyncState.IDLE);

  useEffect(() => {
    const updateState = () => {
      setSyncState(crossDimensionDataManager.getSyncState(entity));
    };

    eventBus.on('sync:started', updateState);
    eventBus.on('sync:completed', updateState);
    eventBus.on('sync:error', updateState);

    return () => {
      eventBus.off('sync:started', updateState);
      eventBus.off('sync:completed', updateState);
      eventBus.off('sync:error', updateState);
    };
  }, [entity]);

  return syncState;
}

/**
 * React Hook - 使用离线队列
 */
export function useOfflineQueue() {
  const [operations, setOperations] = useState<OfflineOperation[]>([]);

  useEffect(() => {
    const updateOperations = () => {
      setOperations(offlineQueueManager.getAll());
    };

    eventBus.on('offline:operation:added', updateOperations);
    eventBus.on('offline:operation:removed', updateOperations);
    eventBus.on('offline:queue:cleared', updateOperations);

    updateOperations();

    return () => {
      eventBus.off('offline:operation:added', updateOperations);
      eventBus.off('offline:operation:removed', updateOperations);
      eventBus.off('offline:queue:cleared', updateOperations);
    };
  }, []);

  const syncQueue = useCallback(async () => {
    await crossDimensionDataManager.syncOfflineQueue();
  }, []);

  return {
    operations,
    size: operations.length,
    syncQueue,
  };
}

/**
 * 导出所有跨维度数据交互功能
 */
export default {
  eventBus,
  offlineQueueManager,
  dataConflictResolver,
  realtimeSyncManager,
  crossDimensionDataManager,
  useDataEvent,
  useSyncState,
  useOfflineQueue,
  DataOperationType,
  SyncState,
  DataSourceType,
};
