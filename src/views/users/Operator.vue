<template>
  <div>
    <n-data-table :columns="columns" :data="data" :single-line="false" :bordered="false" :loading="spin" />
    <n-modal v-model:show="showModal" class="custom-card" preset="card" :style="{ width: '500px' }" title="Tahrirlash"
      :bordered="false" transform-origin="center">
      <Operatormodal :users="user_id" @close="closeModal"></Operatormodal>
    </n-modal>
    <div style="position: absolute; top: 18px; right: 5px;">
      <n-button type="primary" @click="add">Qo'shish</n-button>
    </div>
  </div>
</template>
<script setup>
import { ref, h, onMounted } from 'vue'
import { NSwitch, useMessage, useNotification, NButton, NIcon } from 'naive-ui'
import User from '../../services/User.js'
import Operatormodal from './Operator_model.vue'
import { Pencil } from '@vicons/ionicons5'

const message = useMessage()
const notification = useNotification()
const spin = ref(true)
const showModal = ref(false)
const user_id = ref(null)

const columns = ref([
  {
    title: "Ismi",
    key: "firstname"
  },
  {
    title: "Familyasi",
    key: "lastname"
  },
  {
    title: "Telefon raqami",
    key: "phone_number"
  },
  {
    title: "Huqiqi",
    key: "role",
  },
  {
    title: "Holati",
    key: "deleted_at",
    render(row) {
      return [h(
        NSwitch,
        {
          value: row.deleted_at == 0 ? true : false,
          loading: row.loading,
          disabled: row.disabled,
          onUpdateValue: () => play(row),
        }
      )]
    },
  },
  {
    title: "",
    key: "deleted_at",
    render(row) {
      return [h(
        NButton,
        {
          type: 'primary',
          size: 'small',
          // value: row.deleted_at == 0 ? true : false,
          // loading: row.loading,
          // disabled: row.disabled,
          onClick: () => rowProps(row),
        },
        { default: () => h(NIcon, { size: 20 }, { default: () => h(Pencil) }) }
      )]
    },
  }
])
const data = ref([])
const play = (row) => {
  data.value.forEach(item => {
    if (item.id == row.id) {
      item.disabled = true
      item.loading = true
      User.delete(item.id).then(res => {
        if (res.success) {
          item.deleted_at = res.data.deleted_at
          message.success(res.message)
        } else {
          notification.error({
            content: 'Xatolik',
            meta: res.message,
            duration: 2500,
            keepAliveOnHover: true
          })
        }
        item.disabled = false
        item.loading = false
      })
    }
  })
}
const all_User = () => {
  spin.value = true
  data.value = []
  let datas = {
    role: 'Operator'
  }
  User.all(datas).then(res => {
    if (res.success) {
      let datas = res.data
      for (let i = 0; i < datas.length; i++) {
        datas[i].loading = false
        datas[i].disabled = false
        data.value.push(datas[i])
      }
      spin.value = false
    }
  })
}
const rowProps = (row) => {
  user_id.value = row.id
  showModal.value = !showModal.value
}
const closeModal = () => {
  showModal.value = false
  all_User()
}
const add = () => {
  user_id.value = null
  showModal.value = !showModal.value
}
onMounted(() => {
  all_User()
})
</script>