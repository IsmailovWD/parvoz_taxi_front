<template>
  <div class="orders" style="user-select: none;">
    <yandex-map
      :settings="settings"
      :coords="coord"
      zoom=14
      :controls="child"
      style="height: calc(100vh - 71px) !important;" 
      @click="onClick"
    >
      <ymap-marker
        v-if="!changelocationBool"
        :coords="coord"
        :marker-id="'123123'"
        :hint-content="'Joylashuv qo\'shish'" 
        :icon = "icon"
        style="opacity: 0;"
      />
      <ymap-marker
        v-for="(item, index) in location" :key="index"
        :coords="ChangeCoord(item)"
        :marker-id="item.id"
        :hint-content="item.name" 
        @click="changeOneLocation(item, index)"
        :icon = "{
          layout: 'islands#blueHomeIcon',
          content: item.name,
        }"
      />
    </yandex-map>
    <n-modal v-model:show="showModal" :closable="true">
      <n-card
        title="Yangi joylashuv qo'shish"
        :bordered="false"
        role="dialog"
        aria-modal="true"
        style="width: 500px; position: fixed; left: calc(50% - 250px); top: 50px"
      >
      <n-input type="text" placeholder="Joylashuv nomi" v-model:value="data.nomi" :autofocus="false">
        <template #prefix>
          <n-icon>
            <LocationSharp />
          </n-icon>
        </template>
      </n-input>
      <div style="height: 10px;"></div>
      <div style="display: flex; justify-content: space-between;">
        <n-input type="text" placeholder="Lat" disabled v-model:value="data.lat">
          <template #prefix>
            <n-icon>
              <AddLocationAltRound />
            </n-icon>
          </template>
        </n-input>
        <div style="width: 40px;"></div>
        <n-input type="text" placeholder="Long" disabled v-model:value="data.long">
          <template #prefix>
            <n-icon>
              <AddLocationAltRound />
            </n-icon>
          </template>
        </n-input>
      </div>
      <div style="height: 10px;"></div>
      <div class="btn">
        <n-spin size="large" :show="show" @click="newlocation">
          <n-button type="primary" size="large" style="width: 100%;" :disabled="data.nomi ? false : true">Saqlash</n-button>
        </n-spin>
      </div>
      </n-card>
    </n-modal>
    <div v-if="changelocationBool" style="position: fixed; top: 60px; left: 65px; z-index: 999999999999;">
      <n-alert title="Joylashuvni o'zgartirish" type="success" style="width: 300px;">
        <n-input type="text" v-model:value="newLocationName" placeholder="Joylashuv nomini o'zgartish">
          <template #prefix>
            <n-icon>
              <LocationSharp />
            </n-icon>
          </template>
        </n-input>
        <div style="height: 10px;"></div>
        <n-button type="primary" style="width: 100%;" @click="saveChangeLocation">Saqlash</n-button>
      </n-alert>
    </div>
    <div v-if="loaderbool" class="loader" style="position: fixed; top: 0; left: 0; width: 100%; height: 100vh; z-index:  99999999999999999999999999999999; background: #00000015; display: flex;justify-content: center; align-items: center;">
      <loader></loader>
    </div>
    <div :style="changelocationBool ? 'opacity: 0.3; pointer-events: none': ''">
      <allLocation 
        @data="selectLocation" 
        >
      </allLocation>
    </div>
  </div>
</template>
<script setup>
import allLocation from './customLocation.vue'
import { LocationSharp } from '@vicons/ionicons5'
import { AddLocationAltRound } from '@vicons/material'
import {ref, onMounted, watch} from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { yandexMap, ymapMarker } from 'vue-yandex-maps'
import Location from '../../Map/Location'
import loader from '../../components/loader/Loader.vue'
// import startLocation from '../../assets/img/locationImgpng.png'
import services_custom_location from '../../services/customLocation'
import { searchs } from '../../stores/search'
import { useNotification, useMessage } from 'naive-ui'
const BASE_URL = import.meta.env.VITE_BASE_URL + '/api/image/icon'
const startLocation = BASE_URL + '/locationImgpng.png'
const message = useMessage()
const notification = useNotification()
const search_emit = searchs()
const coord = ref([])
const showModal = ref(false)
const show = ref(false)
const child =  ref([])
const location = ref([])
const changelocationBool = ref(false)
const changeIndex = ref(null)
const loaderbool = ref(false)
const newLocationName = ref(null)
const data = ref({
  nomi: null,
  lat: null,
  long: null,
})
const settings = ref({
  apiKey: 'ca64aaff-c2ff-4bfb-992b-54ae1cca2f2d',
  lang: 'uz_UZ',
  coordorder: 'latlong',
  enterprise: false,
  version: '2.1',
})
const success = (position)=>{
  coord.value = [position.coords.latitude, position.coords.longitude]
}
const icon = ref({
  layout: 'default#imageWithContent',
  imageHref: startLocation,
  imageSize: [43, 43],
  imageOffset: [-20, -43],
  // content: '123 v12',
  contentOffset: [20, 20],
  contentLayout:  '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
})
const error = (position)=>{
  coord.value = [40.383333, 71.783333]
  console.log(position)
}
const onClick = (e) => {
  if(changelocationBool.value){
    coord.value = Location.location(e)
    location.value[changeIndex.value].lat = coord.value[0]
    location.value[changeIndex.value].long = coord.value[1]
  }else{
    coord.value =  Location.location(e)
    data.value.lat = coord.value[0]
    data.value.long = coord.value[1]
    showModal.value = true
  }
}
const newlocation = ()=>{
  show.value = true
  services_custom_location.create(data.value).then((res)=>{
    if(res.success){
      show.value = false
      showModal.value = false
      AllLocation()
      data.value = {
        nomi: null,
        lat: null,
        long: null,
      }
    }
  })
}
const ChangeCoord = (item) =>{
  if(item){
    let latitude = parseFloat(item.lat)
    let longitude = parseFloat(item.long)
    return [latitude, longitude]
  }
}
const AllLocation = () =>{
  services_custom_location.all().then(res => {
    if(res.success){
      location.value = res.data
      loaderbool.value= false
    }
  })
}
const selectLocation = (data) => {
  coord.value = [parseFloat(data.lat), parseFloat(data.long)]
}
const changeOneLocation = (item, index) =>{
  changelocationBool.value = true
  changeIndex.value = index
}
const saveChangeLocation = () =>{
  changelocationBool.value = false
  loaderbool.value = true 
  location.value[changeIndex.value].name = newLocationName.value
  services_custom_location.update(location.value[changeIndex.value]).then(res=>{
    if(res.success){
      AllLocation()
    }
  })
}
onMounted(()=>{
  navigator.geolocation.watchPosition(success , error)
  AllLocation()
})
onKeyStroke(['Enter'], e => {
  if(e.key == 'Enter'){
    newlocation()
  }
})

watch(()=> search_emit.search_value, (val)=>{
  if(val, val != ''){
    search_emit.spin_bool = true
    services_custom_location.filter({search: val}).then(res => {
      if(res.success) {
        if(res.data.length == 0){
          message.success('Ma\'lumotlar mavjud emas')
        }else{
          coord.value = [parseFloat(res.data[0].lat),parseFloat(res.data[0].long)]
        }
      }else{
        notification.error({
          content: 'Xatolik',
          meta: res.message,
          duration: 2500,
          keepAliveOnHover: true
        })
      }
      search_emit.spin_bool = false
    })
  }
})
</script>
<style scoped>

</style>