<template>
  <div class="card" :style="style">
    <div style="position: sticky; top: 0; z-index: 9; background: #fff; box-shadow:  0 0 2px rgb(224, 224, 230);">
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
    <n-card size="small" class="card_box">
      <div class="content" v-if="bool" style="display: flex; flex-direction: column; gap: 10px;">
        <n-input autofocus v-model:value="valueNumber" type="text" placeholder="Telefon raqam" clearable
          :onUpdate:value="formatter">
          <template #prefix>
            <n-icon color="#18a058">
              <PhonePortraitOutline />
            </n-icon>
          </template>
        </n-input>
        <span v-if="where_name" @click="focusFunction(1)">
          <n-input v-model:value="where_name" type="text" placeholder="Qayerdan" :onUpdate:value="updateVAlue">
            <template #prefix>
              <n-icon color="red">
                <CircleTwotone />
              </n-icon>
            </template>
          </n-input>
        </span>
        <span v-else @click="focusFunction(1)">
          <n-input v-model:value="where" type="text" placeholder="Qayerdan" :onUpdate:value="updateVAlue">
            <template #prefix>
              <n-icon color="red">
                <CircleTwotone />
              </n-icon>
            </template>
          </n-input>
        </span>
        <span v-if="whereto_name" @click="focusFunction(2)">
          <n-input v-model:value="whereto_name" type="text" placeholder="Qayerga" :onUpdate:value="updateVAlue">
            <template #prefix>
              <n-icon color="black">
                <CircleTwotone />
              </n-icon>
            </template>
          </n-input>
        </span>
        <span v-else @click="focusFunction(2)">
          <n-input v-model:value="whereto" type="text" placeholder="Qayerga" :onUpdate:value="updateVAlue">
            <template #prefix>
              <n-icon color="black">
                <CircleTwotone />
              </n-icon>
            </template>
          </n-input>
        </span>
        <span>
          <n-checkbox v-model:checked="kesh_value" size="large">
            Keshbek
          </n-checkbox>
        </span>
        <n-space vertical style="min-height: 100px; display: flex; justify-content: center;margin-top: 0;">
          <n-spin :show="show">
            <div class="taxi_status" v-if="!show">
              <div v-wave v-for="(item, index) in tarif" :key="index" :class="item.value ? 'status active' : 'status'"
                @click="activeStatus(item.id)">
                <div class="name">{{ item.name }}</div>
                <div class="summa">{{ statusFormat(item.summa) }}</div>
                <div class="icon">
                  <n-icon size="20">
                    <InformationCircleOutline />
                  </n-icon>
                </div>
              </div>
            </div>
          </n-spin>
        </n-space>
        <!-- <n-select v-model:value="tolovturi" :options="options" placeholder="Tolov turi"></n-select> -->
        <!-- <n-input  type="text" placeholder="Promokod">
          <template #prefix>
            <n-icon color="red" size="25">
              <Barcode />
            </n-icon>
          </template>
        </n-input> -->
        <n-space vertical>
          <n-spin :show="spin" size="small">
            <n-button v-wave type="primary" @click="send" style="width: 100%;">
              <div>
                <div>Buyurtma berish</div>
              </div>
            </n-button>
          </n-spin>
        </n-space>
      </div>
    </n-card>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { useDraggable } from '@vueuse/core'
import { FullscreenExitFilled, FullscreenFilled, DragHandleOutlined, CircleTwotone } from '@vicons/material'
import { PhonePortraitOutline, InformationCircleOutline, Barcode } from '@vicons/ionicons5'
import { useMessage, useNotification } from 'naive-ui'
import RateServices from '../../services/rate'
import OrderServices from '../../services/Order'
import { latLongValue } from '../../stores/counter'
import Socket from '../../socket/socket'

const lat_long = latLongValue()
const message = useMessage()
const notification = useNotification()
const props = defineProps(['sendCoords'])
const el = ref(null)
const tolovturi = ref(1)
const valueNumber = ref(null)
const where = ref(null)
const whereto = ref(null)
const where_name = ref(null)
const whereto_name = ref(null)
const show = ref(true)
const rate = ref(true)
const spin = ref(false)
const kesh_value = ref(false)
watch(() => lat_long.lat.coords, (val) => {
  where.value = val
  where_name.value = lat_long.lat.name
})
watch(() => lat_long.long.coords, (val) => {
  whereto.value = val
  whereto_name.value = lat_long.long.name
})
const formatter = () => {
  let numbers = formatNumber(valueNumber.value)
  valueNumber.value = numbers
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
const bool = ref(true)
const send = () => {
  if (!where.value) {
    message.info('Manzil belgilanmagan')
  } else if (!valueNumber.value) {
    message.info('Telefon raqam kiritilmagan')
  } else {
    let data = {}
    data.phone_number = "+" + valueNumber.value.replace(/[^\d]/g, "")
    data.whence = where.value
    data.whereto = whereto.value
    data.whence_name = where_name.value
    data.whereto_name = whereto_name.value
    data.rate_id = rate.value
    data.kesh_value = kesh_value.value
    spin.value = true
    OrderServices.create(data).then(res => {
      if (res.success) {
        message.success('Buyurtmangiz qabul qilindi')
        spin.value = false
      }
    })
  }
}
const tarif = ref(null)
const { x, y, style } = useDraggable(el, {
  initialValue: { x: 65, y: 55 }
})
const activeStatus = (id) => {
  for (let i = 0; i < tarif.value.length; i++) {
    if (tarif.value[i].id == id) {
      tarif.value[i].value = true
      rate.value = id
    } else {
      tarif.value[i].value = false
    }
  }
}
const statusFormat = (val) => {
  return val + " so'mdan"
}
const rateAll = () => {
  RateServices.getAll().then((res) => {
    show.value = true
    if (res.success) {
      tarif.value = res.data
      show.value = false
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
const focusFunction = (id) => {
  lat_long.focus.where = false
  lat_long.focus.whereto = false
  console.log(id)
  if (id == 1) {
    lat_long.focus.where = true;
  } else if (id == 2) {
    lat_long.focus.whereto = true;
  }
}
const updateVAlue = () => {
  where.value = lat_long.lat.coords
  whereto.value = lat_long.long.coords
  where_name.value = lat_long.lat.name
  whereto_name.value = lat_long.long.name
}
Socket.socket.on('new_order_one', () => {
  valueNumber.value = null
  kesh_value.value = false
  rateAll()
})
onMounted(() => {
  RateServices.getAll().then((res) => {
    if (res.success) {
      tarif.value = res.data
      show.value = false
    } else {
      notification.error({
        content: 'Xatolik',
        meta: res.message,
        duration: 2500,
        keepAliveOnHover: true
      })
    }
  })
})

// socket



</script>
<style scoped lang="scss">
.card {
  width: 350px;
  position: fixed;
  background: #fff;
  z-index: 1000;
  border-radius: 3px;
  box-shadow: 0 0 5px #00000072;
  max-height: calc(100vh - 75px);
  overflow: hidden;

  .drag {
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  }

  .taxi_status {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;

    .status {
      position: relative;
      padding: 10px;
      border-radius: 10px;
      border: 1px solid rgb(224, 224, 230);
      cursor: pointer;
      transition: all .15s;

      &:hover {
        background: #E7F5EE;
        border: 1px solid #E7F5EE;
      }

      &:active {
        transform: scale(0.98);
      }

      &.active {
        background: #36AD6AFF;
        color: #fff;

        .icon {
          opacity: 1;
          pointer-events: all;
        }
      }

      .summa {
        font-weight: 500;
        font-size: 18px;
      }

      .icon {
        position: absolute;
        top: 5px;
        right: 5px;
        opacity: 0;
        pointer-events: none;
      }
    }
  }
}
</style>