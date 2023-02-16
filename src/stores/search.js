import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const searchs = defineStore('search', () => {
  let search_value = ref(null)
  let spin_bool = ref(false)
  return { search_value, spin_bool }
})
