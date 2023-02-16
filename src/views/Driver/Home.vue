<template>
  <div style="position: relative;">
    <div class="head_driver" style="padding: 5px 0; display: flex; justify-content: space-between;">
      <n-space>
        <n-select style="width: 300px;" v-model:value="datas.actives" :options="options" placeholder="Haydovchilar"
          clearable :onUpdate:value="changeValue" />
        <n-button v-wave type="primary" @click="showModals = !showModals">
          Haydovchi qo'shish
        </n-button>
      </n-space>
      <div>
        <n-button v-wave type="primary" :disabled="spin" @click="AllDriver()">
          <n-icon size="25" v-if="!spin">
            <RefreshCircleSharp />
          </n-icon>
          <n-icon size="25" v-else>
            <CloseCircle />
          </n-icon>
        </n-button>
      </div>
    </div>
    <n-data-table :loading="spin" :single-line="false" :columns="columns" :data="data" :row-props="rowProps" />
    <br />
    <div style="float: right;">
      <n-pagination :disabled="spin" v-model:page="page" :page-count="pagination.pageCount"
        @update:page="handlePageChange">
        <template #prefix>
          <div style="font-size: 16px;">
            Jami: <span style="font-weight: bold; color: #18a058;"> {{ countAll }} </span> ta haydovchi
          </div>
        </template>
      </n-pagination>
    </div>
    <n-modal v-model:show="showModal" :mask-closable="true" preset="dialog"
      :title="user.active_admin == 0 ? 'Faol emas' : 'Faol'" style="width: 680px" transform-origin="center">
      <Drivers :datas="user" @close_modal="closeModal" />
    </n-modal>
    <div v-if="show"
      style="position: fixed; top: 0; left: 0; width: 100%; height: 100vh; z-index: 99999999999999999999999; display: flex; align-items: center; justify-content: center; background: #00000055;">
      <n-spin size="large" :show="show">
      </n-spin>
    </div>
    <n-modal v-model:show="showModals" :mask-closable="true" preset="dialog" title="Haydovchi qo'shish"
      style="width: 400px">
      <div style="height: 10px;"></div>
      <n-input type="text" placeholder="Haydovchi ismi" v-model:value="newDriver.fullname"></n-input>
      <div style="height: 10px;"></div>
      <n-input type="text" placeholder="Telefon raqami" v-model:value="newDriver.number" @keydown="formatter"></n-input>
      <div style="height: 10px;"></div>
      <n-input type="text" placeholder="Mashina ma'lumoti" v-model:value="newDriver.car"></n-input>
      <div style="height: 10px;"></div>
      <n-input-number step="1000" placeholder="Kunlik to'lov" v-model:value="newDriver.day_price"></n-input-number>
      <div style="height: 10px;"></div>
      <n-input type="password" show-password-on="click" placeholder="Parol" v-model:value="newDriver.password"></n-input>
      <div style="height: 10px;"></div>
      <n-space>
        <n-button v-wave type="primary" @click="send">Qo'shish</n-button>
      </n-space>
    </n-modal>
</div>
</template>

<script setup>
import Drivers from './Driver_info.vue'
import { reactive, ref, onMounted, watch, h } from "vue";
import { useNotification, useMessage } from "naive-ui";
import { searchs } from '../../stores/search'
import Driver from '../../services/Driver'
import { RefreshCircleSharp, CloseCircle } from '@vicons/ionicons5'

const search_emit = searchs()
const message = useMessage()
const notification = useNotification()
const spin = ref(false)
const countAll = ref(0)
const columns = [
  {
    title: "№",
    key: "id"
  },
  {
    title: "F.I.O",
    key: "fullname"
  },
  {
    title: "Telefon raqam",
    key: "number"
  },
  {
    title: "Mashina",
    key: "car"
  },
  {
    title: 'Summa',
    key: 'summa'
  },
  {
    title: 'Kunlik to\'lov',
    key: 'day_price'
  }
];
const user = ref({
  active_admin: 0
})
const page = ref(1)
const data = ref([])
const showModal = ref(false)
const showModals = ref(false)
const show = ref(false)
const newDriver = ref({
  fullname: null,
  number: null,
  car: null,
  password: null,
  day_price: null
})
const datas = ref({
  actives: null,
  pagination_size: 0
})

const pagination = ref({
  page: 1,
  pageSize: 50,
  pageCount: null,
});
const rowProps = (row) => {
  return {
    style: "cursor:pointer",
    onClick: () => {
      user.value = row
      showModal.value = true
    }
  }
}
const closeModal = () => {
  showModal.value = false
  AllDriver()
}
onMounted(() => {
  AllDriver()
})
const AllDriver = () => {
  spin.value = true
  let nms = {
    actives: datas.value.actives,
    pagination_size: datas.value.pagination_size * 10
  }
  Driver.all(nms).then(res => {
    console.log(res)
    if (res.success) {
      data.value = res.data.model
      if (Math.floor(res.data.count.soni / 10) < res.data.count.soni / 10) {
        pagination.value.pageCount = Math.floor(res.data.count.soni / 10) + 1
      } else {
        pagination.value.pageCount = Math.floor(res.data.count.soni / 10)
      }
      countAll.value = res.data.count.soni
    }
    search_emit.spin_bool = false
    spin.value = false
  })
}
const send = () => {
  if (!newDriver.value.fullname && !newDriver.value.number && !newDriver.value.car) {
    message.error('Hamma qatorlar to\'ldirilishi kerak')
  } else {
    show.value = true
    newDriver.value.number = '+' + newDriver.value.number.replace(/[^\d]/g, "")
    Driver.create(newDriver.value).then(res => {
      if (res.success) {
        show.value = false;
        AllDriver();
        showModals.value = false;
        notification.success({
          content: 'Muvaffaqqiyatli',
          meta: 'Haydovchi qo\'shildi',
          duration: 2500,
          keepAliveOnHover: true
        })
      } else {
        notification.error({
          content: 'Xatolik',
          meta: res.message,
          duration: 2500,
          keepAliveOnHover: true
        })
      }
    })
  }
}
const formatter = () => {
  let numbers = formatNumber(newDriver.value.number)
  newDriver.value.number = numbers
}
const formatNumber = (value) => {
  if (!value) return value
  const phoneNumber = value.replace(/[^\d]/g, "")
  const phoneNumberLength = phoneNumber.length
  if (phoneNumberLength < 4) return `+${phoneNumber}`
  if (phoneNumberLength < 6) {
    return `+${phoneNumber.slice(0, 3)} (${phoneNumber.slice(3, 5)}`
  }
  if (phoneNumberLength < 8) {
    return `+${phoneNumber.slice(0, 3)} (${phoneNumber.slice(3, 5)}) ${phoneNumber.slice(5)}`
  }
  if (phoneNumberLength < 10) {
    return `+${phoneNumber.slice(0, 3)} (${phoneNumber.slice(3, 5)}) ${phoneNumber.slice(5, 8)} ${phoneNumber.slice(8)}`
  }
  return `+${phoneNumber.slice(0, 3)} (${phoneNumber.slice(3, 5)}) ${phoneNumber.slice(5, 8)} ${phoneNumber.slice(8, 10)} ${phoneNumber.slice(10)}`
}
const options = ref([
  {
    value: 1,
    label: 'Faol bo\'lganlar'
  },
  {
    value: 0,
    label: 'Faol bo\'lmaganlar'
  }
])
const changeValue = () => {
  AllDriver()
}

watch(() => search_emit.search_value, (val) => {
  search_emit.spin_bool = true
  datas.value.filter = val
  AllDriver()
})

const handlePageChange = (row) => {
  if (row == 1) {
    datas.value.pagination_size = 0
    AllDriver()
  } else {
    datas.value.pagination_size = (row - 1)
    AllDriver()
  }
}
</script>