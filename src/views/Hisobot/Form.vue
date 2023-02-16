<template>
  <div>
    <Orders v-if="routename == 'Buyurtmalar hisoboti'"></Orders>
    <Drivers v-if="routename == 'Haydovchilar hisoboti'"></Drivers>
  </div>
</template>
<script setup>
import Orders from './Orders.vue'
import Drivers from './Drivers.vue'
import {ref, onMounted, watch} from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const routename = ref(null)

watch(()=> route.name, (val)=>{
  routename.value = val
})
onMounted(() => {
  routename.value = route.name
})
</script>