import { defineStore } from 'pinia';
import { ref } from 'vue';

interface Recommendation {
  id: string;
  name: string;
  reason: string;
}

export const useRecommendationStore = defineStore('recommendation', () => {
  const showRecommendations = ref(false);
  const currentRecommendations = ref<Recommendation[]>([]);

  function hideRecommendations() {
    showRecommendations.value = false;
  }

  return { showRecommendations, currentRecommendations, hideRecommendations };
});
