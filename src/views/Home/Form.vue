<template>
  <div class="orders" style="user-select: none;">
    <yandex-map
      :settings="settings"
      :coords="coord"
      zoom=14
      :controls="child"
      style="height: calc(100vh - 71px) !important;width: max-width: 100%;" 
      @click="onClick"
    >
      <ymap-marker v-if="where.coords"
        :coords="where.coords"
        :marker-id="where.marker_id"
        :hint-content="where.hint_content" 
        :icon = "where.icon"
        @click="addnewlocation(where)"
        style="opacity: 0;"
      />
      <ymap-marker v-if="whereto.coords"
        :coords="whereto.coords"
        :marker-id="whereto.marker_id"
        :hint-content="whereto.hint_content" 
        :icon = "whereto.icon"
        @click="addnewlocation(whereto)"
        style="opacity: 0;"
      />
      <ymap-marker
        v-for="(item, index) in customlocation" :key="index"
        :coords="ChangeCoord(item)"
        :marker-id="item.id"
        :hint-content="item.name" 
        @click = "changeCustomLocation(item)"
        :icon = "{
          layout: 'islands#blueHomeIcon',
          content: item.name,
        }"
      />
    </yandex-map>
    <AddOrder :style="updateLocation ? 'opacity: 0.5; pointer-events: none;' : 'opacity: 1; pointer-events: all;'"/>
    <OrderList v-if="!updateLocation" />
    <div v-if="updateLocation"  style="position: fixed; top: 55px; right: 20px; z-index: 2009; width: 300px;">
      <n-alert title="Joylashuvni o'zgartirish" type="success" closable :on-close="updateClose">
        {{ txtAlert }}
      </n-alert>
    </div>
  </div>
</template>
<script setup>
import {ref, onMounted, watch} from 'vue'
import { useNotification , useMessage } from 'naive-ui'
import AddOrder from '../../components/Draglab Components/HomeAddOrders.vue'
import { yandexMap, ymapMarker } from 'vue-yandex-maps'
import Location from '../../Map/Location'
import OrderList from '../../components/Draglab Components/ListOrders.vue'
import Socket from '../../socket/socket'
// import startLocation from '../../assets/img/start.png'
// import endLocation from '../../assets/img/end.png'
import services_custom_location from '../../services/customLocation'
import { latLongValue } from '../../stores/counter'
import {searchs} from '../../stores/search'
const BASE_URL = import.meta.env.VITE_BASE_URL + '/api/image/icon'

const startLocation = BASE_URL + '/start.png'
const endLocation = BASE_URL + '/end.png'
const notification = useNotification()
const message = useMessage()
const search_emit = searchs()
const latlongValue = latLongValue()
const coord = ref([])
const location = ref([])
// const child = ["typeSelector","zoomControl","trafficControl","searchControl"]
const child = []
const activeCords = ref(null)
const txtAlert = ref(null)
const updateLocation = ref(false)
const customlocation = ref([])

const settings = ref({
  apiKey: 'ca64aaff-c2ff-4bfb-992b-54ae1cca2f2d',
  lang: 'uz_UZ',
  coordorder: 'latlong',
  enterprise: false,
  version: '2.1',
})
const where = ref({
  id: 1,
  coords: null,
  marker_id : '123123',
  hint_content: 'Hozirgi joylashuv',
  icon: {
    layout: 'default#imageWithContent',
    imageHref: startLocation,
    imageSize: [33, 43],
    imageOffset: [-20, -43],
    // content: '123 v12',
    contentOffset: [20, 20],
    contentLayout:  '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
  }
})
const whereto = ref({
  id: 2,
  coords: null,
  marker_id : '123124',
  hint_content: 'Oxirgi joylashuv',
  icon: {
    layout: 'default#imageWithContent',
    imageHref: endLocation,
    imageSize: [43, 43],
    imageOffset: [-20, -43],
    // content: '123 v12',
    contentOffset: [20, 20],
    contentLayout:  '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
  }
})
const success = (position)=>{
  console.log(position)
  coord.value = [position.coords.latitude, position.coords.longitude]
}
const error = (position)=>{
  coord.value = [40.383333, 71.783333]
  console.log(position)
}
const onClick = (e) => {
  if(activeCords.value == null){
    if(!where.value.coords){
      let son = Location.location(e)
      where.value.coords = son
      coord.value = son
      latlongValue.lat.coords = son.toString()
    }else if(!whereto.value.coords){
      let son = Location.location(e)
      whereto.value.coords = son
      coord.value = son
      latlongValue.long.coords = son.toString();
    }
  }else{
    if(activeCords.value.id == 1){
      let son =  Location.location(e)
      where.value.coords = son
      coord.value = son
      latlongValue.lat.coords = son.toString()
      latlongValue.lat.name = null
    }
    if(activeCords.value.id == 2){
      let son =  Location.location(e)
      whereto.value.coords  = son
      coord.value = son
      latlongValue.long.coords = son.toString()
      latlongValue.long.name = null
    }
  }
}
const addnewlocation = (index) =>{
  activeCords.value = index
  if(index.id == 1){
    txtAlert.value = "Joriy joylashuvni o`zgartish"
  }else if(index.id == 2){
    txtAlert.value = "Oxirgi joylashuvni o`zgartish"
  }
  updateLocation.value = true
}
const updateClose = ()=>{
  updateLocation.value = false
  activeCords.value = null
}
const AllLocation = () =>{
  services_custom_location.all().then(res => {
    if(res.success){
      customlocation.value = res.data
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
const changeCustomLocation = (item) =>{
  if(activeCords.value){
    if(activeCords.value.id == 1){
      // location.value.push({coords: [item.lat, item.long]})
      where.value.coords = [item.lat, item.long]
      coord.value = [item.lat, item.long]
      latlongValue.lat.coords = [item.lat, item.long].toString()
      latlongValue.lat.name = item.name
    }else if(activeCords.value.id == 2){
      // location.value.push({coords: [item.lat, item.long]})
      coord.value = [item.lat, item.long]
      whereto.value.coords = [item.lat, item.long]
      latlongValue.long.coords = [item.lat, item.long].toString()
      latlongValue.long.name = item.name
    }
  }else{
    if(!where.value.coords){
      where.value.coords = [item.lat, item.long]
      coord.value = [item.lat, item.long]
      latlongValue.lat.coords = [item.lat, item.long].toString()
      latlongValue.lat.name = item.name
    }else if(!whereto.value.coords){
      coord.value = [item.lat, item.long]
      whereto.value.coords = [item.lat, item.long]
      latlongValue.long.coords = [item.lat, item.long].toString()
      latlongValue.long.name = item.name
    }
  }
}
Socket.socket.on('new_order_one', () => {
  where.value.coords = null
  whereto.value.coords = null
  latlongValue.lat.coords = null
  latlongValue.long.coords = null
  latlongValue.lat.name = null
  latlongValue.long.name = null
})
onMounted(()=>{
  navigator.geolocation.getCurrentPosition(success , error)
  AllLocation()
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
watch(()=> latlongValue.focus.where, val => {
  if(val){
    if(where.value.coords){
      coord.value = [null,null]
      coord.value[0] = where.value.coords[0]
      coord.value[1] = where.value.coords[1]
    }
    latlongValue.focus.where = false
  }
})
watch(()=> latlongValue.focus.whereto, val => {
  console.log(coord.value, val)
  if(val){
    if(whereto.value.coords){
      coord.value = [null,null]
      coord.value[0] = whereto.value.coords[0]
      coord.value[1] = whereto.value.coords[1]
    }
    latlongValue.focus.whereto = false
  }
})
</script>
<style scoped>
.orders{
  width: 100%;
  position: relative;
}
</style>