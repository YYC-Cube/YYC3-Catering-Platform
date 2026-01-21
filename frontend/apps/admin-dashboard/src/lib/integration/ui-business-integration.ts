/**
 * @file UI层与业务逻辑层无缝对接方案
 * @description 实现UI组件与后端服务的深度集成架构
 * @module integration
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * API响应接口
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
  };
}

/**
 * 请求配置接口
 */
export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  params?: Record<string, any>;
  body?: any;
  timeout?: number;
  retries?: number;
  cache?: {
    enabled: boolean;
    ttl: number;
  };
}

/**
 * API客户端类
 */
export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private token: string | null = null;
  private tenantId: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  setToken(token: string) {
    this.token = token;
  }

  setTenantId(tenantId: string) {
    this.tenantId = tenantId;
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      params,
      body,
      timeout = 30000,
      retries = 3,
    } = config;

    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const requestHeaders: Record<string, string> = {
      ...this.defaultHeaders,
      ...headers,
    };

    if (this.token) {
      requestHeaders['Authorization'] = `Bearer ${this.token}`;
    }

    if (this.tenantId) {
      requestHeaders['X-Tenant-ID'] = this.tenantId;
    }

    const requestInit: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (body && method !== 'GET') {
      requestInit.body = JSON.stringify(body);
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url.toString(), {
          ...requestInit,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message || `HTTP ${response.status}`);
        }

        return data;
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
    }

    return {
      success: false,
      error: {
        code: 'REQUEST_FAILED',
        message: lastError?.message || '请求失败',
      },
    };
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(endpoint: string, body: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  async put<T>(endpoint: string, body: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  async patch<T>(endpoint: string, body: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  }
}

/**
 * 创建全局API客户端实例
 */
export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api');

/**
 * React Hook - 使用API数据
 */
export function useApi<T = any>(
  endpoint: string,
  config?: RequestConfig,
  deps: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<T>(endpoint, config);
      
      if (response.success && response.data) {
        setData(response.data);
      } else {
        throw new Error(response.error?.message || '请求失败');
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [endpoint, config]);

  useEffect(() => {
    fetchData();
  }, deps);

  return { data, loading, error, refetch: fetchData };
}

/**
 * React Hook - 使用API操作（POST/PUT/DELETE）
 */
export function useApiMutation<T = any, P = any>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'POST'
) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const mutate = useCallback(async (payload?: P): Promise<ApiResponse<T>> => {
    setLoading(true);
    setError(null);

    try {
      let response: ApiResponse<T>;

      switch (method) {
        case 'POST':
          response = await apiClient.post<T>(endpoint, payload);
          break;
        case 'PUT':
          response = await apiClient.put<T>(endpoint, payload);
          break;
        case 'DELETE':
          response = await apiClient.delete<T>(endpoint);
          break;
        case 'PATCH':
          response = await apiClient.patch<T>(endpoint, payload);
          break;
        default:
          throw new Error(`不支持的HTTP方法: ${method}`);
      }

      if (response.success) {
        setData(response.data || null);
      } else {
        throw new Error(response.error?.message || '操作失败');
      }

      return response;
    } catch (err) {
      setError(err as Error);
      return {
        success: false,
        error: {
          code: 'MUTATION_FAILED',
          message: (err as Error).message,
        },
      };
    } finally {
      setLoading(false);
    }
  }, [endpoint, method]);

  return { mutate, loading, error, data };
}

/**
 * React Hook - 使用分页数据
 */
export function usePaginatedApi<T = any>(
  endpoint: string,
  initialPage: number = 1,
  pageSize: number = 20
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(initialPage);
  const [total, setTotal] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchPage = useCallback(async (pageNum: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<{ items: T[]; total: number }>(endpoint, {
        params: {
          page: pageNum,
          pageSize,
        },
      });

      if (response.success && response.data) {
        setData(response.data.items);
        setTotal(response.data.total);
        setHasMore(pageNum * pageSize < response.data.total);
      } else {
        throw new Error(response.error?.message || '请求失败');
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [endpoint, pageSize]);

  useEffect(() => {
    fetchPage(page);
  }, [page, fetchPage]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  const refresh = useCallback(() => {
    setPage(1);
    fetchPage(1);
  }, [fetchPage]);

  return {
    data,
    loading,
    error,
    page,
    total,
    hasMore,
    loadMore,
    refresh,
    setPage,
  };
}

/**
 * React Hook - 使用实时数据（WebSocket）
 */
export function useRealtimeData<T = any>(
  endpoint: string,
  initialData?: T
) {
  const [data, setData] = useState<T | null>(initialData || null);
  const [connected, setConnected] = useState<boolean>(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = endpoint.replace('http', 'ws');
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setData(message.data);
      } catch (error) {
        console.error('解析WebSocket消息失败:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket错误:', error);
      setConnected(false);
    };

    ws.onclose = () => {
      setConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [endpoint]);

  return { data, connected };
}

/**
 * React Hook - 使用乐观更新
 */
export function useOptimisticUpdate<T = any>(
  initialData: T,
  updateFn: (data: T) => Promise<ApiResponse<T>>
) {
  const [data, setData] = useState<T>(initialData);
  const [optimisticData, setOptimisticData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(async (newData: Partial<T>) => {
    const optimisticValue = { ...data, ...newData };
    setOptimisticData(optimisticValue);
    setLoading(true);
    setError(null);

    try {
      const response = await updateFn(optimisticValue);

      if (response.success && response.data) {
        setData(response.data);
      } else {
        throw new Error(response.error?.message || '更新失败');
      }
    } catch (err) {
      setError(err as Error);
      setOptimisticData(null);
    } finally {
      setLoading(false);
    }
  }, [data, updateFn]);

  return {
    data: optimisticData || data,
    loading,
    error,
    update,
  };
}

/**
 * 业务服务层 - 订单服务
 */
export class OrderService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async getOrders(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) {
    return this.apiClient.get('/orders', { params });
  }

  async getOrderById(orderId: string) {
    return this.apiClient.get(`/orders/${orderId}`);
  }

  async createOrder(orderData: any) {
    return this.apiClient.post('/orders', orderData);
  }

  async updateOrder(orderId: string, orderData: any) {
    return this.apiClient.put(`/orders/${orderId}`, orderData);
  }

  async cancelOrder(orderId: string, reason: string) {
    return this.apiClient.patch(`/orders/${orderId}/cancel`, { reason });
  }

  async getOrderStats(params?: {
    startDate?: string;
    endDate?: string;
  }) {
    return this.apiClient.get('/orders/stats', { params });
  }
}

/**
 * 业务服务层 - 菜单服务
 */
export class MenuService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async getMenus(params?: {
    page?: number;
    pageSize?: number;
    category?: string;
  }) {
    return this.apiClient.get('/menus', { params });
  }

  async getMenuById(menuId: string) {
    return this.apiClient.get(`/menus/${menuId}`);
  }

  async createMenu(menuData: any) {
    return this.apiClient.post('/menus', menuData);
  }

  async updateMenu(menuId: string, menuData: any) {
    return this.apiClient.put(`/menus/${menuId}`, menuData);
  }

  async deleteMenu(menuId: string) {
    return this.apiClient.delete(`/menus/${menuId}`);
  }
}

/**
 * 业务服务层 - 用户服务
 */
export class UserService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async login(credentials: { email: string; password: string }) {
    return this.apiClient.post('/auth/login', credentials);
  }

  async logout() {
    return this.apiClient.post('/auth/logout', {});
  }

  async getCurrentUser() {
    return this.apiClient.get('/users/me');
  }

  async updateProfile(profileData: any) {
    return this.apiClient.put('/users/me', profileData);
  }
}

/**
 * 创建业务服务实例
 */
export const orderService = new OrderService(apiClient);
export const menuService = new MenuService(apiClient);
export const userService = new UserService(apiClient);

/**
 * 导出所有API和服务
 */
export default {
  apiClient,
  useApi,
  useApiMutation,
  usePaginatedApi,
  useRealtimeData,
  useOptimisticUpdate,
  orderService,
  menuService,
  userService,
};
