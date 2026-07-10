import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const totalItems = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))

  return { items, totalItems }
})