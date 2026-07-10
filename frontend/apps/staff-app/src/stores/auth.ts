import { defineStore } from 'pinia';
import { ref } from 'vue';

interface User {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);

  async function login(credentials: { username: string; password: string }) {
    user.value = { id: '1', name: credentials.username, role: 'staff' };
    token.value = 'mock-token';
  }

  async function logout() {
    user.value = null;
    token.value = null;
  }

  return { user, token, login, logout };
});
