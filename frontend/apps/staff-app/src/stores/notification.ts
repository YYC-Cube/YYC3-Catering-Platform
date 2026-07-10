import { defineStore } from 'pinia';
import { ref } from 'vue';

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([]);
  const unreadCount = ref(0);

  return { notifications, unreadCount };
});
