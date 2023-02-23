<template>
  <div style="display: grid; grid-template-columns: calc(50% - 7.5px) 15px calc(50% - 7.5px);">
    <List></List>
    <n-divider vertical style="height: 100%;"></n-divider>
    <Kesh></Kesh>
  </div>
</template>
<script setup>
import List from './list.vue'
import Kesh from './Kesh.vue'
</script>