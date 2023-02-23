<template>
  <div>
    <div>
      <n-button type="primary" @click="showModal = !showModal">Keshbek qo'shish</n-button>
    </div>
    <n-divider style="margin: 5px 0;"></n-divider>
    <n-data-table :single-line="false" :columns="columns" :data="data" :loading="loading" />
    <n-modal v-model:show="showModal" class="custom-card" preset="card" :style="{ width: '500px' }"
      title="Keshbek qo'shish" :bordered="false" size="huge" transform-origin="center">

      <div>
        <n-spin :show="show">
          <n-input-number v-model:value="value" placeholder="Foiz" min="0" :onUpdate:value="updatevalue">
            <template #prefix>
              %
            </template>
          </n-input-number>
          <n-divider></n-divider>
          <n-button :disabled="!showbtn" type="primary" style="width: 100%;" size="large"
            @click="sendKesh">Saqlash</n-button>
        </n-spin>
      </div>
    </n-modal>
  </div>
</template>
<script setup>
import { ref, onMounted, h } from 'vue'
import Kesh from '../../services/Kesh'
import { NButton } from 'naive-ui';
import { formatDate } from '@vueuse/shared';
const data = ref([])
const showbtn = ref(false)
const value = ref(0)
const showModal = ref(false)
const loading = ref(true)
const show = ref(false)
const month = ref([
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
])
const columns = ref([
  {
    title: "ID",
    key: "id"
  },
  {
    title: "Sana",
    key: "datetime",
    render(row) {
      let time = row.datetime * 1000
      let hourse = new Date(time).getHours()
      let minutese = new Date(time).getMinutes()
      let date = new Date(time).getDay()
      let months = month.value[new Date(time).getMonth()]
      let year = new Date(time).getFullYear() + " - yil"
      return date + " - " + months + " " + year
    }
  },
  {
    title: "Keshbek foiz (%)",
    key: "profit",
    render(row) {
      return h(
        NButton,
        {
          strong: true,
          type: 'Primary',
          size: 'medium',
        },
        {
          default: () => row.profit + ' %'
        }
      )
    }
  }
]);
const all_kesh = () => {
  Kesh.all().then(res => {
    if (res.success) {
      data.value = res.data
      loading.value = false
    }
  })
}
const updatevalue = () => {
  if (value.value >= 0) {
    showbtn.value = true
  } else {
    showbtn.value = false
  }
}
const sendKesh = () => {
  show.value = true
  Kesh.create({ profit: value.value }).then(res => {
    if (res.success) {
      all_kesh()
      show.value = false
      showModal.value = false
    }
  })
}
onMounted(() => {
  all_kesh()
})
</script>