<template>
  <div class="login-page">
    <h1>员工登录</h1>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>
