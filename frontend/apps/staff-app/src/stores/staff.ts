import { defineStore } from 'pinia';
import { ref } from 'vue';

interface Staff {
  id: string;
  name: string;
  role: string;
}

export const useStaffStore = defineStore('staff', () => {
  const staffList = ref<Staff[]>([]);
  const currentStaff = ref<Staff | null>(null);
  const workStatus = ref<'working' | 'break' | 'offline'>('working');

  return { staffList, currentStaff, workStatus };
});
