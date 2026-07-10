import type { Order, KitchenOrder, OrderFilters, KitchenOrderFilters } from '@/types/order';

export const orderApi = {
  async getOrders(filters?: OrderFilters): Promise<Order[]> {
    return [];
  },
  async getKitchenOrders(filters?: KitchenOrderFilters): Promise<KitchenOrder[]> {
    return [];
  },
};
