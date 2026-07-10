import { defineStore } from 'pinia';
import { ref } from 'vue';

interface User {
  name: string;
  avatar?: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);

  async function logout() {
    user.value = null;
  }

  return { user, logout };
});
