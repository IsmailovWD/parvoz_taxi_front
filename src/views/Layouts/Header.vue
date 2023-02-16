<template>
  <n-page-header :bordered="true" @back="handleBack" style="padding: 5px 20px;">
    <template #back>
      <n-icon>
        <Menu></Menu>
      </n-icon>
    </template>
    <template #title>
      <a
        href="/"
        style="text-decoration: none; color: inherit"
      >
        Taxi
      </a>
    </template>
    <template #avatar>
      <n-avatar
        src="https://media.graphcms.com/IleXpZkORg75EUElii1g"
      />
    </template>
    <template #extra>
      <div style="display: flex; gap: 10px; align-items: center;">
        <n-input style="width: 300px;" type="text" placeholder="Qiduruv" v-model:value="search" clearable :onUpdate:value="SearchFunc">
          <template #prefix>
            <div style="display: flex; align-items: center;">
              <n-icon size="18" color="#ccc" v-if="!searchResult">
                <Search></Search>
              </n-icon>
              <n-spin v-else size="small" style="transform: scale(.7); width: 18px;"></n-spin>
            </div>
          </template>
        </n-input>
        <n-dropdown :options="listPage" placement="bottom-start" @select="handleSelect">
          <div class="avatar" style="margin-top: 5px; cursor: pointer; display: grid; gap: 5px; grid-template-columns: 40px 150px; align-items: center;">
            <n-avatar
              :size="35"
              :src="DefaultUserImg"
            />
            <div class="title">
              <div style="line-height: 15px; font-size: 14px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ fname +" "+ lname}}</div>
              <div style="line-height: 15px; font-size: 12px;">{{role}}</div>
            </div>
          </div>  
        </n-dropdown>
        <n-button type="primary" @click="reloadPage">
          <n-icon size="22">
            <RefreshCircle />
          </n-icon>
        </n-button>
      </div>
    </template>
  </n-page-header>
</template>
<script setup>
import { ref, h , onMounted, watch} from "vue";
import {NIcon} from "naive-ui";
import { Menu, Search, PersonCircleOutline, Pencil, LogOutOutline, RefreshCircle} from "@vicons/ionicons5";
// import DefaultUserImg from '../../assets/img/user.png'
import { useRoute, useRouter} from 'vue-router'
import { searchs } from '../../stores/search'
const BASE_URL = import.meta.env.VITE_BASE_URL + '/api/image/icon'
const DefaultUserImg = BASE_URL + '/user.png'
const search_spin = searchs()
const route = useRoute()
const router = useRouter()
const fname = ref(null)
const lname = ref(null)
const role = ref(null)
const search = ref(null)
const searchResult = ref(false)

watch(()=> search_spin.spin_bool, (val)=>{
  searchResult.value = val
})
const SearchFunc = () => {
  let name = search.value
  setTimeout(() => {
    if(name == search.value){
      search_spin.search_value = search.value
    }
  }, 1000);
}
const emits = defineEmits(['openclose']) 
const handleBack = ()=>{
  emits('openclose')
}
const renderIcon = (icon) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    })
  }
}
const listPage = ref([
  {
    label: 'Profile',
    key: 'profile',
    icon: renderIcon(PersonCircleOutline)
  },
  {
    label: 'Edit Profile',
    key: 'editProfile',
    icon: renderIcon(Pencil)
  },
  {
    label: 'Logout',
    key: 'Kirish',
    icon: renderIcon(LogOutOutline)
  }
])
onMounted(()=>{
  fname.value = localStorage.getItem('firstname');
  lname.value = localStorage.getItem('lastname');
  role.value = localStorage.getItem('role');
}) 
const handleSelect = (key) => {
  if(key == 'Kirish'){
    localStorage.clear()
  }
  router.push({name: key})
}
const reloadPage = () =>{
  let names = route.name
  // localStorage.clear()
  window.location.reload()
}
</script>