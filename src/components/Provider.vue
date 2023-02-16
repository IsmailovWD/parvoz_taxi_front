<script setup lang="ts">
import { computed } from 'vue';
import App from '../App.vue'
import { darkTheme, lightTheme  } from 'naive-ui'
const themeOverrides = {
  // "common": {
  //   "primaryColor": "#FCE000FF",
  //   "primaryColorHover": "#FFCD09FF",
  //   "primaryColorPressed": "#FFCD09FF",
  //   "primaryColorSuppl": "#FFCD09FF",
  //   // "hoverColor": "#FCE000FF"
  // }
  // "common": {
  //   "primaryColor": "#E26363FF",
  //   "primaryColorHover": "#E77F7FFF",
  //   "primaryColorPressed": "#CE5A5AFF",
  //   "primaryColorSuppl": "rgba(148, 42, 42, 1)",
  //   "infoColor": "#E87070FF",
  //   "infoColorHover": "#EC8A8AFF"
  // }
}
</script>
<template>
<n-config-provider :theme="lightTheme" :theme-overrides="themeOverrides">
  <n-loading-bar-provider>
    <n-dialog-provider>
      <n-message-provider>
        <n-notification-provider>
          <App />
        </n-notification-provider>
      </n-message-provider>
    </n-dialog-provider>
  </n-loading-bar-provider>
</n-config-provider>
</template>