<template>
  <div class="card" ref="el2" :style="style" style="max-height: calc(100vh - 75px);">
    <div
      style="overflow: hidden; position: sticky; left: 0; top: 0; z-index: 9; background: #fff; box-shadow:  0 0 2px rgb(224, 224, 230);">
      <div class="drag" ref="el" style="width: 100%; display: flex; justify-content: center; align-items: center;">
        <n-icon size="25">
          <DragHandleOutlined />
        </n-icon>
      </div>
      <div style="position: absolute; top: 3px; right: 5px;">
        <n-tooltip trigger="hover">
          <template #trigger>
            <div @click="bool = !bool"
              style="height: 100%; aspect-ratio: 1; display: flex; justify-content: center; align-items: center; cursor: pointer;">
              <n-icon size="20">
                <FullscreenExitFilled v-if="bool" />
                <FullscreenFilled v-if="!bool" />
              </n-icon>
            </div>
          </template>
          <span v-if="bool">Bekitish</span>
          <span v-if="!bool">Ochish</span>
        </n-tooltip>
      </div>
    </div>
    <div v-if="bool" style="display: flex; justify-content: space-between; padding: 5px 10px; padding-bottom: 0;">
      <n-input clearable v-model:value="searchValue" placeholder="Qidiruv" style="width: 300px;"
        :onUpdate:value="SearchFunc">
        <template #prefix>
          <n-spin v-if="lodingSearch" size="small" style="transform: scale(.6);"></n-spin>
          <n-icon v-else>
            <Search />
          </n-icon>
        </template>
      </n-input>
      <n-button @click="SearchFunc('refresh')" v-wave :disabled="loader" type="primary" size="medium">
        <n-icon size="22">
          <RefreshCircleSharp />
        </n-icon>
      </n-button>
    </div>
    <div v-if="bool" class="draglab_content">
      <div class="content">
        <div v-if="loader" style="padding: 50px;">
          <n-spin :show="true">
          </n-spin>
        </div>
        <div v-else style="width: 100%;">
          <div class="list"
            style="margin-bottom: 10px; width: 100%; padding: 5px 0; background: #18a058; color: #fff; font-weight: 600;">
            <span class="id">№</span>
            <span class="number">Telefon raqam</span>
            <span class="number">Sana</span>
            <span class="name">Ta'rif</span>
            <!-- <span class="name">Keshbek</span> -->
            <span>Keshbek holati</span>
            <span class="name">
              Buyurtma holati
            </span>
            <span class="icon">

            </span>
          </div>
          <div v-wave v-for="(item, index) in list" :key="index" class="list" :id="'id' + item.status_id">
            <span class="id">{{ index + 1 }}</span>
            <span class="number">{{ formatNumber(item.phone_number) }}</span>
            <span class="number">{{ vaqt(item.created_date) }}</span>
            <span class="name">{{ item.tarif }}</span>
            <!-- <span class="name">{{ item.kashbek_summa + ' so\'m' }}</span> -->
            <n-switch v-model:value="item.switch_value" :loading="item.loading"
              :disabled="item.status_id == 5 || item.status_id == 4 ? true : false"
              @click="keshUpdate(item.id, index, item.status_id)" />
            <span class="name">
              <n-button style="width: 100%;" size="small" strong secondary type="primary"
                v-if="item.status_id == 1 || item.status_id == 6">
                {{ item.status }}
              </n-button>
              <n-button style="width: 100%;" size="small" strong secondary type="warning" v-if="item.status_id == 2">
                {{ item.status }}
              </n-button>
              <n-button style="width: 100%;" size="small" strong secondary type="info" v-if="item.status_id == 3">
                {{ item.status }}
              </n-button>
              <n-button style="width: 100%;" size="small" strong secondary type="success" v-if="item.status_id == 4">
                {{ item.status }}
              </n-button>
              <n-button style="width: 100%;" size="small" strong secondary type="error" v-if="item.status_id == 5">
                {{ item.status }}
              </n-button>
              <n-button style="width: 100%;" size="small" strong secondary type="warning" v-if="item.status_id == 7">
                {{ item.status }}
              </n-button>
            </span>
            <span class="icon">
              <!-- <n-button size="small" strong secondary type="primary">
                <template #icon>
                  <n-icon>
                    <Pencil></Pencil>
                  </n-icon>
                </template>
              </n-button> -->
              <n-tooltip trigger="hover" placement="left">
                <template #trigger>
                  <n-button size="small" strong secondary type="error">
                    <template #icon>
                      <n-icon>
                        <TrashBin></TrashBin>
                      </n-icon>
                    </template>
                  </n-button>
                </template>
                Bekor qilish
              </n-tooltip>
            </span>
          </div>
          <n-divider style="margin: 0; margin-top: 5px;" />
        </div>
        <div v-if="loader_adds" class="loader_add">
          <n-spin :show="true">
          </n-spin>
        </div>
        <n-descriptions v-if="all_orders_list" label-placement="top" title="Ma'lumotlar tugadi">
        </n-descriptions>
        <div v-if="empty" style="padding: 50px;">
          <n-empty description="Malumotlar mavjud emas" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useDraggable, useScroll } from '@vueuse/core'
import { FullscreenExitFilled, FullscreenFilled, DragHandleOutlined, CircleTwotone } from '@vicons/material'
import { Pencil, TrashBin, Search, RefreshCircleSharp } from '@vicons/ionicons5'
import Order from '../../services/Order'
import Loader from '../../components/loader/Loader.vue'
import Socket from '../../socket/socket'
import { useMessage } from 'naive-ui'

const message = useMessage()
const el2 = ref(null)
const el = ref(null)
const bool = ref(false)
const loader = ref(true)
const empty = ref(false)
const list = ref([])
const lodingSearch = ref(false)
const searchValue = ref(null)
const loader_adds = ref(false)
const { isScrolling, arrivedState, directions } = useScroll(el2)
const draging = ref(false)
const all_orders_list = ref(false)
const SearchFunc = (text) => {
  if (text == 'refresh') {
    loader.value = true
    all_order('refresh')
  } else {
    let name = searchValue.value
    setTimeout(() => {
      if (name == searchValue.value) {
        loader.value = true
        lodingSearch.value = true
        all_order('refresh')
      }
    }, 1000);
  }
}
const { x, y, style, isDragging } = useDraggable(el, {
  initialValue: { x: 500, y: 51 }
})
watch(() => bool.value, (val) => {
  if (val) {
    loader.value = true
    all_order('refresh')
  }
})
watch(() => arrivedState.bottom, (val) => {
  if (val && !all_orders_list.value && !loader_adds.value) {
    loader_adds.value = true
    all_order()
  }
})
watch(() => isDragging.value, (val) => {
  draging.value = val
})
const all_order = (e) => {
  empty.value = false
  if (e == 'refresh') {
    list.value = []
  }
  let data = {
    count: list.value.length,
    value: searchValue.value
  }
  Order.all(data).then((res) => {
    if (res.success) {
      console.log(res.data)
      list.value = list.value.concat(res.data)
      loader.value = false
      lodingSearch.value = false
      loader_adds.value = false
      for (let i = 0; i < list.value.length; i++) {
        if (list.value[i].kashbek_add == 0) {
          list.value[i].switch_value = false
        } else {
          list.value[i].switch_value = true
        }
        list.value[i].loading = false
      }
      if (list.value.length == 0) {
        empty.value = true
      }
      if (res.data.length == 0) {
        all_orders_list.value = true
      } else {
        all_orders_list.value = false
      }
    }
  })
}
const vaqt = (list) => {
  if (list) {
    let son = new Date().getTime() / 1000 - list
    if (son / 60 < 60) {
      return Math.floor(son / 60) + ' minut'
    }
    else if (son / 3600 < 24) {
      return Math.floor(son / 3600) + ' soat'
    }
    else if (son / 3600 / 24 < 7) {
      return Math.floor(son / 3600 / 24) + ' kun'
    }
    else if (son / 3600 / 24 / 7 <= 4) {
      return Math.floor(son / 3600 / 24 / 7) + ' hafta'
    }
    else {
      return new Date(list * 1000).getDate() + " " + month.value[new Date(list * 1000).getMonth() - 1] + ' ' + new Date(list).getHours() + ' : ' + new Date(list).getMinutes()
    }
  }
}
const keshUpdate = (id, index, status) => {
  if (status != 5) {
    list.value[index].loading = true
    Order.keshbak_update(id).then((res) => {
      console.log(res)
      if (res.success) {
        list.value[index].loading = false
        list.value[index].switch_value = res.data.kashbek_add == 1 ? true : false
        list.value[index].kashbek_summa = res.data.kashbek_summa
        message.success(res.message)
      } else {
        message.error(res.message)
      }
    })
  }
}
const formatNumber = (value) => {
  if (!value) { return value }
  const phoneNumber = value.replace(/[^\d]/g, "")
  const phoneNumberLength = phoneNumber.length
  if (phoneNumberLength < 4) { return `+${phoneNumber}` }
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
Socket.socket.on('newOrder', (data) => {
  if (!searchValue.value || searchValue.value == '') {
    if (data.kashbek_add == 0) {
      data.switch_value = false
    } else {
      data.switch_value = true
    }
    data.loading = false
    list.value.unshift(data)
  }
})
// Socket.socket.on('driver', (data) => {
//   console.log(data)
// })

</script>
<style scoped lang="scss">
.card {
  width: 750px;
  position: fixed;
  background: #fff;
  z-index: 1000;
  border-radius: 3px;
  box-shadow: 0 0 5px #00000072;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  .drag {
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  }

  .draglab_content {
    padding: 10px;

    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;

      .list {
        position: relative;
        width: 100%;
        display: grid;
        grid-template-columns: 5% 25% 15% 15% 13% 20% 7%;
        align-items: center;
        padding: 2px;
        cursor: pointer;
        border-radius: 3px;

        span {
          text-align: center;
        }

        .icon {
          display: flex;
          justify-content: space-evenly;
        }

        &::after {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 3px;
          content: '';
        }
      }

      #id1:hover {
        background: rgba(24, 160, 87, 0.068);

        &::after {
          background: rgb(24, 160, 87);
        }
      }

      #id2:hover,
      #id7:hover {
        background: rgba(240, 160, 32, 0.06);

        &::after {
          background: rgb(240, 160, 32);
        }
      }

      #id3:hover {
        background: rgba(32, 129, 240, 0.076);

        &::after {
          background: rgb(32, 129, 240);
        }
      }

      #id4:hover {
        background: rgba(54, 173, 105, 0.09);

        &::after {
          background: rgb(54, 173, 105);
        }
      }

      #id5:hover {
        background: rgba(208, 48, 80, 0.074);

        &::after {
          background: rgb(208, 48, 80);
        }
      }
    }
  }
}

.loader_add {
  overflow: hidden;
  animation: animate .25s linear;
}

@keyframes animate {
  0% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
}
</style>