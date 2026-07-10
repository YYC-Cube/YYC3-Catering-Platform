export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
}

export interface KitchenOrder {
  id: string;
  status: string;
  estimatedReadyTime?: string;
  items: OrderItem[];
}
