<template>
  <router-view></router-view>
</template>
<script setup>
import { watch , onMounted} from 'vue'
import { useNotification, useLoadingBar} from 'naive-ui'
import { useRouter,  useRoute } from 'vue-router';
import { useErrorStore } from './stores/errors'
import Socket from './socket/socket';
onMounted(()=>{
  Socket.connect()
})
const error_store = useErrorStore();
const notification = useNotification();
const DEFAULT_TITLE = 'Taxi - Online';
const router = useRouter();
const route = useRoute();
const loading = useLoadingBar();
router.beforeEach(() => {
  loading.start()
})
router.afterEach(() => {
  loading.finish()
  document.title = route.name + ' - Taxi'|| DEFAULT_TITLE
})
router.onError(() => {
  loading.error()
})

watch(() => error_store.error_text, (val) => {
  if(val) {
    notification.error({
      content: 'Xatolik',
      meta: val,
      duration: 2500,
      keepAliveOnHover: true
    })
  }
  setTimeout(() => {
    error_store.error_text = null;
  }, 2500);
})
</script>
