<template>
  <div class="card-box">
    <div v-if="loaders" class="loader" style="padding: 50px; display: flex; justify-content: center; align-items: center;">
      <n-spin size="large" />
    </div>
    <n-scrollbar v-else style="max-height: calc(100vh - 100px)">
      <div style="display: grid; grid-template-columns: 65% 30%; justify-content: space-between;">
        <div>
          <n-input v-model:value="user.fullname" placeholder="F.I.O"></n-input>
          <div style="height: 5px;"></div>
          <n-input v-model:value="user.number" placeholder="Telefon raqam"></n-input>
          <div style="height: 5px;"></div>
          <n-input v-model:value="user.car" placeholder="Mashina modeli"></n-input>
          <div style="height: 5px;"></div>
        </div>
        <div>
          <n-divider title-placement="left" style="margin: 2px; margin-top: 0;">
            Ta'rif
          </n-divider>
          <div v-for="(item, index) in statusList" :key="index">
            <n-checkbox
              v-model:checked="item.checked"
              :onUpdate:checked="handleChange"
            >
              {{ item.name }}
            </n-checkbox>
          </div>
        </div>
      </div>
      <n-divider title-placement="left" style="margin: 10px 0;">
        
      </n-divider>
      <n-image-group show-toolbar-tooltip>
        <n-space style="position: sticky; bottom: 0; background: #fff; padding: 5px; padding-right: 0;">
          <div v-if="user.active_admin == 0" style="width: 263.5px;"></div>
          <n-button v-if="user.active_admin == 0" type="error">Arizani bekor qilish</n-button>
          <n-button v-if="user.active_admin == 0" type="primary" @click="active_driver">Haydovchini faollashtirish</n-button>
          <n-button v-if="user.active_admin == 1" type="error" @click="active_driver">Haydovchini faolsizlantirish</n-button>
          <n-button v-if="user.active_admin == 1" type="error" @click="showModal = !showModal">Hisobni to'ldirish</n-button>
        </n-space>
      </n-image-group>
    </n-scrollbar>
    <n-modal
      v-model:show="showModal"
      class="custom-card"
      preset="card"
      title="Hisobni to'ldirish"
      style="width: 400px"
      transform-origin="center"
    >
      <!-- <template #header-extra>
        Oops!
      </template> -->
      <n-input-number 
        v-model:value="AddSumma" 
        clearable 
        placeholder="Summa" 
        step="1000"
        :parse="parseCurrency"
        :format="formatCurrency"
      />
      <template #footer>
        <div style="position: relative; width: max-content">
          <n-spin :show="showSumma" size="small">
            <n-button :disabled="AddSumma ? false : true" type="primary" @click="addsummaDriver">To'ldirish</n-button>
          </n-spin>
        </div>
      </template>
    </n-modal>
    <!-- <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100vh;">
    </div> -->
  </div>
</template>
<script setup>
import { Image } from '@vicons/ionicons5'
import  { ref , onMounted}  from 'vue'
import images from '../../services/img'
import driver from '../../services/Driver'
import rate from '../../services/rate'
import loader from '../../components/loader/Loader.vue'
import { useMessage } from 'naive-ui'
const message = useMessage()
const checkedValue = ref(null)
const loaders = ref(true)
const emits = defineEmits(['close_modal'])
const props = defineProps(['datas'])
const BASE_URL = import.meta.env.VITE_BASE_URL + '/api/images/'
const bool = ref(false)
const showModal = ref(false)
const showSumma = ref(false)
const AddSumma = ref(null)
const user = ref({
  fullname: null,
  number: null,
  car: null,
})
const statusList = ref([])
const data = ref(null)
const handleChange = (index) =>{
  
}
const active_driver =()=>{
  loaders.value = true
  let datasss = {
    user: user.value,
    status : statusList.value
  } 
  driver.active_admin(props.datas.id,datasss).then(res=>{
    if(res.success){
      message.success(res.message)
      emits('close_modal')
    }else{
      message.error(res.message)
      loaders.value = false
    }
  })
}

const img = () =>{
  loaders.value = false
  // images.one(user.value.id).then(res => {
  //   if(res.success){
  //     data.value = res.data
  //     bool.value = true
  //   }
  // })
}
onMounted( async ()=>{
  await rate.getAll().then(res => {
    statusList.value = res.data
  })
  await driver.one(props.datas.id).then( async res =>{
    if(res.success){
      user.value = res.data
      for (let i = 0; i < res.data.rate_drivers.length; i++) {
        for (let j = 0; j < statusList.value.length; j++) {
          if(res.data.rate_drivers[i].rate_id == statusList.value[j].id){
            statusList.value[j].checked = true
          }
        }
      }
      img()
    }
  })
})
const addsummaDriver =()=>{
  showSumma.value = true
  let data = {
    summa: AddSumma.value,
    id: props.datas.id
  }
  driver.summa(data).then(res=>{
    if(res.success){
      message.success('Hisob muvaffaqqiyatli to\'ldirildi')
      showModal.value = false
    }else{
      message.error(res.message)
    }
    showSumma.value = false
  })
}

const parseCurrency = (input) => {
  const nums = input.replace(/(,|\$|\s)/g, "").trim();
  if (/^\d+(\.(\d+)?)?$/.test(nums))
    return Number(nums);
  return nums === "" ? null : Number.NaN;
}
const formatCurrency = (value) => {
    if (value === null)
      return "";
    return `${value.toLocaleString("uz-UZ")}`;
  }
</script>