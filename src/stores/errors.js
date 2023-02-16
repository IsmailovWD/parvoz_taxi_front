import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useErrorStore = defineStore('errors', () => {
  const error_text = ref(null)
  return { error_text }
})
