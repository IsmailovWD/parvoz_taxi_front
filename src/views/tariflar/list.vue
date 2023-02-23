<template>
  <div>
    <div>
      <n-button @click="open_modal('add')" type="primary" size="">Qo'shish</n-button>
    </div>
    <n-divider style="margin: 5px 0;"></n-divider>
    <n-space style="display: flex; justify-content: space-around;">
      <n-card v-for="(item, index) in datas" :key="index"
        style="width: 100%; background: linear-gradient(45deg, #9CFCF865, #6E7BFB65); box-shadow: 0 0 5px #00000055;">
        <template #header>
          <n-skeleton v-if="loading" text width="60%" :sharp="false" />
          <span v-else>
            {{ item.name }}
          </span>
        </template>
        <template #header-extra>
          <n-icon size="20" style="cursor: pointer;" @click="open_modal('edit', item.id)">
            <EditOutlined></EditOutlined>
          </n-icon>
        </template>
        <div style="display: flex; flex-direction: column; gap: 5px;">
          <div style="display: flex; justify-content: space-between; align-items: center;" v-if="loading">
            <n-skeleton text width="60%" :sharp="false" />
            <n-skeleton text width="30%" :sharp="false" />
          </div>
          <div v-else style="display: flex; justify-content: space-between; align-items: center;"><span
              style="font-weight: 600; font-size: 16px;">Minimalka : </span> <n-button size="small" style="width: 50%;"
              type="primary">
              {{ format_summ(item.min_summa) }}
            </n-button></div>
          <n-divider style="margin: 0;" />
          <div style="display: flex; justify-content: space-between; align-items: center;" v-if="loading">
            <n-skeleton text width="60%" :sharp="false" />
            <n-skeleton text width="30%" :sharp="false" />
          </div>
          <div v-else style="display: flex; justify-content: space-between; align-items: center;"><span
              style="font-weight: 600; font-size: 16px;">Bepul kutish vaqti : </span> <n-button size="small"
              style="width: 50%;" type="primary">{{ item.free_wait_time }} daqiqa</n-button></div>
          <n-divider style="margin: 0;" />
          <div style="display: flex; justify-content: space-between; align-items: center;" v-if="loading">
            <n-skeleton text width="60%" :sharp="false" />
            <n-skeleton text width="30%" :sharp="false" />
          </div>
          <div v-else style="display: flex; justify-content: space-between; align-items: center;"><span
              style="font-weight: 600; font-size: 16px;">Kutish summa (daqiqasi) : </span> <n-button size="small"
              style="width: 50%;" type="primary">{{ format_summ(item.wait_price) }}</n-button></div>
          <n-divider style="margin: 0;" />
          <div style="display: flex; justify-content: space-between; align-items: center;" v-if="loading">
            <n-skeleton text width="60%" :sharp="false" />
            <n-skeleton text width="30%" :sharp="false" />
          </div>
          <div v-else style="display: flex; justify-content: space-between; align-items: center;"><span
              style="font-weight: 600; font-size: 16px;">Shahar ichida (km) : </span><n-button size="small"
              style="width: 50%;" type="primary">{{ format_summ(item.city_price) }}</n-button></div>
          <n-divider style="margin: 0;" />
          <div style="display: flex; justify-content: space-between; align-items: center;" v-if="loading">
            <n-skeleton text width="60%" :sharp="false" />
            <n-skeleton text width="30%" :sharp="false" />
          </div>
          <div v-else style="display: flex; justify-content: space-between; align-items: center;"><span
              style="font-weight: 600; font-size: 16px;">Shahar tashqarisida (km) :</span> <n-button size="small"
              style="width: 50%;" type="primary">{{ format_summ(item.out_price) }}</n-button></div>
          <n-divider style="margin: 0;" />
          <!-- <div style="display: flex; justify-content: space-between; align-items: center;" v-if="loading">
            <n-skeleton text width="60%" :sharp="false" />
            <n-skeleton text width="30%" :sharp="false" />
          </div>
          <div v-else style="display: flex; justify-content: space-between; align-items: center;"><span style="font-weight: 600; font-size: 16px;">Firma ulushi (%) :</span> <n-button size="small" style="width: 50%;" type="primary">{{ item.profit }} %</n-button></div> -->
        </div>
      </n-card>
    </n-space>
    <n-modal v-model:show="showModal" class="custom-card" preset="card" :style="{ width: '500px' }" :title="title"
      :bordered="false" transform-origin="center" :closable="false">
      <template #header-extra>
        <n-icon size="20" style="cursor: pointer;" @click="showModal = !showModal">
          <CloseFilled></CloseFilled>
        </n-icon>
      </template>
      <n-space vertical>
        <n-spin :show="show">
          <div>
            <n-divider title-placement="left" style="margin: 7px 0;">Ta'rif nomi</n-divider>
            <div>
              <n-input v-model:value="new_data.name" :onUpdate:value="update_value" type="text"
                placeholder="Tarif nomi"></n-input>
            </div>
            <n-divider title-placement="left" style="margin: 7px 0;">Minimal summa </n-divider>
            <div style="display: flex; justify-content: space-between;">
              <n-input-number min="0" v-model:value="new_data.min_summa" :onUpdate:value="update_value"
                style="width: 100%;" step="1" placeholder="Minimal summa"></n-input-number>
              <!-- <n-input-number min="0" v-model:value="new_data.profit" :onUpdate:value="update_value" style="width: 49%;"
                step="1000" placeholder="Firma ulushi (%)"></n-input-number> -->
            </div>
            <n-divider title-placement="left" style="margin: 7px 0;">Bepul kutish vaqti va kutish summasi</n-divider>
            <div style="display: flex; justify-content: space-between;">
              <n-input-number min="0" v-model:value="new_data.free_wait_time" :onUpdate:value="update_value"
                style="width: 49%;" step="1" placeholder="Bepul kutish (daqiqa)"></n-input-number>
              <n-input-number min="0" v-model:value="new_data.wait_price" :onUpdate:value="update_value"
                style="width: 49%;" step="1000" placeholder="Kutish summasi"></n-input-number>
            </div>
            <n-divider title-placement="left" style="margin: 7px 0;">Shahar ichida va tashqarisidagi summasi</n-divider>
            <div style="display: flex; justify-content: space-between;">
              <n-input-number min="0" v-model:value="new_data.out_price" :onUpdate:value="update_value"
                style="width: 49%;" step="1000" placeholder="Shahar ichida (km)"></n-input-number>
              <n-input-number min="0" v-model:value="new_data.city_price" :onUpdate:value="update_value"
                style="width: 49%;" step="1000" placeholder="Shahar tasqarisida (km)"></n-input-number>
            </div>
            <n-divider title-placement="left" style="margin: 15px 0;"></n-divider>
            <div>
              <n-button @click="send" :disabled="btn" type="primary" style="width: 100%;">
                Qo'shish
              </n-button>
            </div>
          </div>
        </n-spin>
      </n-space>
    </n-modal>
  </div>
</template>
<script setup>
import Tarif from '../../services/rate'
import { ref, onMounted } from 'vue'
import { useMessage, useNotification } from 'naive-ui'
import { EditOutlined, CloseFilled } from '@vicons/material'
import { onKeyStroke } from '@vueuse/core'

const meesage = useMessage()
const notification = useNotification()
const loading = ref(true)
const datas = ref(null)
const showModal = ref(false)
const btn = ref(true)
const show = ref(false)
const title = ref(null)
const ids = ref(null)
const new_data = ref({
  name: null,
  min_summa: null,
  wait_price: null,
  free_wait_time: null,
  out_price: null,
  profit: 5,
  city_price: null,
})
const update_value = () => {
  if (new_data.value.name && new_data.value.city_price && new_data.value.free_wait_time && new_data.value.min_summa && new_data.value.out_price && new_data.value.wait_price) {
    btn.value = false;
  } else {
    btn.value = true;
  }
}
const all_tarif = () => {
  loading.value = true
  Tarif.getAll().then(res => {
    if (res.success) {
      datas.value = res.data
      loading.value = false
    }
  })
}
const format_summ = (sum) => {
  return sum.toLocaleString('en-US', { style: 'currency', currency: 'UZS' })
}
const send = () => {
  show.value = true
  if (ids.value) {
    Tarif.update(new_data.value, ids.value).then(res => {
      if (res.success) {
        meesage.success('Tarif o\'zgartirildi')
        showModal.value = false
        all_tarif()
      } else {
        notification.error({
          content: 'Xatolik',
          meta: res.message,
          duration: 2500,
          keepAliveOnHover: true
        })
        show.value = false
      }
    })
  } else {
    Tarif.create(new_data.value).then(res => {
      if (res.success) {
        meesage.success('Tarif qo\'shildi')
        showModal.value = false
        all_tarif()
      } else {
        notification.error({
          content: 'Xatolik',
          meta: res.message,
          duration: 2500,
          keepAliveOnHover: true
        })
        show.value = false
      }
    })
  }
}
const open_modal = (text, id) => {
  new_data.value = {
    name: null,
    min_summa: null,
    wait_price: null,
    free_wait_time: null,
    out_price: null,
    profit: null,
    city_price: null,
  }
  if (text == 'add') {
    title.value = "Tarif qo'shish"
    ids.value = null
  } else if (text == 'edit') {
    title.value = "Tahrirlash"
    ids.value = id
    one_rate(id)
  }
  showModal.value = !showModal.value
}
const one_rate = (id) => {
  show.value = true
  Tarif.one(id).then(res => {
    if (res.success) {
      new_data.value = res.data
    } else {
      notification.error({
        content: 'Xatolik',
        meta: res.message,
        keepAliveOnHover: true,
        duration: 2500
      })
    }
    show.value = false
  })
}
onKeyStroke(['Enter'], e => {
  if (!btn.value) {
    if (e.key == 'Enter') {
      send()
    }
  } else {
    meesage.warning('Ma\'lumotlar to\'liq emas')
  }
})
onMounted(() => {
  all_tarif()
})
</script>