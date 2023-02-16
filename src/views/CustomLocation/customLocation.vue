<template>
  <div class="card" :style="style">
    <div style="overflow: hidden; position: sticky; left: 0; top: 0; z-index: 9; background: #fff; box-shadow:  0 0 2px rgb(224, 224, 230);">
      <div class="drag" ref="el" style="width: 100%; display: flex; justify-content: center; align-items: center;">
        <n-icon size="25">
          <DragHandleOutlined />
        </n-icon>
      </div>
      <div style="position: absolute; top: 3px; right: 5px;">
        <n-tooltip trigger="hover">
          <template #trigger>
            <div @click="bool = !bool" style="height: 100%; aspect-ratio: 1; display: flex; justify-content: center; align-items: center; cursor: pointer;">
              <n-icon size="20">
                <FullscreenExitFilled  v-if="bool"/>
                <FullscreenFilled  v-if="!bool"/>
              </n-icon>
            </div>
          </template>
          <span v-if="bool">Bekitish</span>
          <span v-if="!bool">Ochish</span>
        </n-tooltip>
      </div>
    </div>
    <div v-if="bool" class="draglab_content">
      <div class="content">
        <div v-if="loader" style="padding: 5px 0;">
          <n-spin size="large" />
        </div>
        <div v-else style="width: 100%;" v-for="(item, index) in list" :key="index" @click="changeLocation(item)">
          <div class="list" :id="'id' + item.status_id">
            <span class="id">{{ index + 1 }}</span>
            <span class="number">{{ item.name }}</span>
            <span class="number">{{ item.lat }}</span>
            <span class="name">{{ item.long }}</span>
            <span class="icon">
              <n-button size="small" strong secondary type="primary">
                <template #icon>
                  <n-icon><Pencil></Pencil></n-icon>
                </template>
              </n-button>
              <n-button size="small" strong secondary type="error">
                <template #icon>
                  <n-icon><TrashBin></TrashBin></n-icon>
                </template>
              </n-button>
            </span>
          </div>
          <n-divider style="margin: 0; margin-top: 5px;"/>
        </div>
        <n-empty description="Malumotlar mavjud emas" v-if="empty"/>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref, watch} from 'vue'
import { useDraggable } from '@vueuse/core'
import {FullscreenExitFilled, FullscreenFilled, DragHandleOutlined, CircleTwotone} from '@vicons/material'
import {Pencil, TrashBin} from '@vicons/ionicons5'
import customLocation from '../../services/customLocation'
import Loader from '../../components/loader/Loader.vue'
import { searchs } from '../../stores/search'

const search = searchs()
const el = ref(null)
const bool = ref(false)
const loader = ref(true)
const empty = ref(false)
const list = ref([])
const datas = ref({
  search: null
})
const emits = defineEmits(['data'])
const { x, y, style} = useDraggable(el, {
  initialValue: { x: 65, y:51 }
})
watch(() => bool.value, (val)=>{
  if(val){
    datas.value.search = search.search_value
    all_location()
  }
})
watch(()=> search.search_value, (val)=>{
  datas.value.search = val
  all_location()
})
const all_location = () => {
  loader.value = true
  empty.value = false
  customLocation.filter(datas.value).then((res)=>{
    if(res.success){
      list.value = res.data
      loader.value = false
      if(res.data.length == 0){
        empty.value = true
      }
    }
  })
}

const changeLocation = (data) => {
  emits('data', data)
}
</script>
<style scoped lang="scss">
.card{
  width: 650px;
  position: fixed;
  background: #fff; 
  z-index: 1000; 
  border-radius: 3px; 
  box-shadow: 0 0 5px #00000072;
  max-height: calc(100vh - 75px);
  overflow: auto;
  &::-webkit-scrollbar{
    display: none;
  }
  .drag{
    cursor: grab;
    &:active{
      cursor: grabbing;
    }
  }
  .draglab_content{
    padding: 10px;
    .content{
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      .list{
        position: relative;
        width: 100%;
        display: grid;
        grid-template-columns: 5% 30% 25% 25% 15%;
        align-items: center;
        padding: 2px;
        cursor: pointer;
        border-radius: 3px;
        span{
          text-align: center;
        }
        .icon{
          display: flex;
          justify-content: space-evenly;
        }
        &::after{
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 3px;
          content: '';
        }
      }
      #id1:hover{
        background: rgba(24, 160, 87, 0.068);
        &::after{
          background: rgb(24, 160, 87);
        }
      }
      #id2:hover{
        background: rgba(240, 160, 32, 0.06);
        &::after{
          background: rgb(240, 160, 32);
        }
      }
      #id3:hover{
        background: rgba(32, 129, 240, 0.076);
        &::after{
          background: rgb(32, 129, 240);
        }
      }
      #id4:hover{
        background: rgba(54, 173, 105, 0.09);
        &::after{
          background: rgb(54, 173, 105);
        }
      }
      #id5:hover{
        background: rgba(208, 48, 80, 0.074);
        &::after{
          background: rgb(208, 48, 80);
        }
      }
    }
  }
}
</style>