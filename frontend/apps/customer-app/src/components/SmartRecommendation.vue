<template>
  <div v-if="recommendations?.length" class="smart-recommendation">
    <div v-for="item in recommendations" :key="item.id" class="recommendation-item">
      <span>{{ item.name }}</span>
      <span class="reason">{{ item.reason }}</span>
    </div>
    <button @click="$emit('dismiss')" class="dismiss-btn">关闭</button>
  </div>
</template>

<script setup lang="ts">
interface Recommendation {
  id: string;
  name: string;
  reason: string;
}

defineProps<{
  recommendations: Recommendation[];
}>();

defineEmits<{
  dismiss: [];
}>();
</script>
