<template>
  <div>
    <!-- <div class="filter" style="display: flex; gap: 10px;">
      <n-select v-model:value="value" :options="options" clearable placeholder="Haydoychilar"/>
      <n-date-picker v-model:value="range" type="daterange" clearable />
    </div> -->
    <div class="body">
      <n-tabs type="line" animated>
        <n-tab-pane name="Tugallanganlar" tab="Tugallanganlar">
          <n-space vertical :size="12">
            <!-- <br /> -->
            <div style="float: right;">
              <n-pagination :disabled="spin" v-model:page="pagination.page" :page-count="pagination.pageCount" @update:page="handlePageChange">
                <template #prefix>
                  <div style="font-size: 16px;">
                    Jami: <span style="font-weight: bold; color: #18a058;"> {{ pagination.soni }} </span> ta buyurtmadan <span style="font-weight: bold; color: #d03050;"> {{ data.length }} </span> tasi
                  </div>
                </template>
              </n-pagination>
            </div>
            <!-- <br /> -->
            <n-data-table :loading="spin" :single-line="false" :columns="columns" :data="data" striped />
          </n-space>
        </n-tab-pane>
        <n-tab-pane name="Bekor bolgan" tab="Bekor bo'lgan">
          Hey Jude
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted , h, watch} from 'vue'
import { useNotification , NButton} from 'naive-ui'
import Orders from '../../services/Order'
import { searchs } from '../../stores/search'

const search = searchs()
const notification = useNotification()
const data = ref([])
const month = ref(['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr', 'Noyabr', 'Dekabr'])
const spin = ref(true)
const number = ref(null)
const columns = ref([
  {
    title: 'Sana',
    key: 'datetime',
    render(row){
      return vaqt(row)
    }
  },
  {
    title: 'Haydovchi ismi',
    key: 'driver.fullname'
  },
  {
    title: 'Haydovchi telefon raqami',
    key: 'driver.number',
    render(row){
      return for_tel_number(row)
    }
  },
  {
    title: 'Umumiy summa',
    key: 'summa',
    // render(row){
    //   return summa_format(row.summa)
    // },
    render(row) {
      return h(
        NButton,
        {
          strong: true,
          type: 'Primary',
          size: "small",
        },
        { default: () => summa_format(row.summa) }
      );
    }
  },
  {
    title: 'Firma summa',
    key: 'firma_summa',
    // render(row){
    //   return summa_format(row.firma_summa)
    // },
    render(row) {
      return h(
        NButton,
        {
          strong: true,
          type: 'error',
          size: "small",
        },
        { default: () => summa_format(row.firma_summa) }
      );
    }
  },
  {
    title: 'Agent summa',
    key: 'agent_summa',
    // render(row){
    //   return summa_format(row.agent_summa)
    // },
    render(row) {
      return h(
        NButton,
        {
          strong: true,
          type: 'info',
          size: "small",
        },
        { default: () => summa_format(row.agent_summa) }
      );
    }
  }
])
const vaqt = (row) => {
  return new Date(row.datetime * 1000).getDate() + ' - ' + month.value[new Date(row.datetime * 1000).getMonth()] + ' ' + new Date(row.datetime * 1000).getFullYear() + ' yil ' + new Date(row.datetime * 1000).getHours()+" : "+ (new Date(row.datetime * 1000).getMinutes() < 10 ? '0' + new Date(row.datetime * 1000).getMinutes() : new Date(row.datetime * 1000).getMinutes())
}
const summa_format = (row) =>{
  return row.toLocaleString(undefined, { minimumFractionDigits: 2 }) + " so'm";
}
const for_tel_number = (row) =>{
  let match1 = row.driver.number.slice(0,4)
  let match2 = row.driver.number.slice(4,6)
  let match3 = row.driver.number.slice(6,9)
  let match4 = row.driver.number.slice(9,11)
  let match5 = row.driver.number.slice(11,13)
  return match1 + " (" + match2 + ") " + " " + match3 + " " + match4 + " " + match5
}
const pagination = ref({
  page: 1,
  pageSize: 10,
  pageCount: null,
  soni: null,
  offset: 0,
});
const handlePageChange = (row) => {
  if(row == 1){
    pagination.value.offset = 0 
    all_Order()
  }else{
    pagination.value.offset = (row - 1)
    all_Order()
  }
}
const all_Order = () => {
  spin.value = true
  let datas = {
    offset: pagination.value.offset * 100,
    number: number.value
  }
  Orders.completed_all(datas).then((res)=>{
    if(res.success){
      data.value = res.data
      if(Math.round(res.count.soni / 100) < res.count.soni / 100){
        pagination.value.pageCount = Math.round(res.count.soni / 100) + 1
      }else{
        pagination.value.pageCount = Math.round(res.count.soni / 100)
      }
      pagination.value.soni = res.count.soni
    }else{
      notification.error({
        content: 'Xatolik',
        meta: res.message,
        duration: 2500,
        keepAliveOnHover: true
      })
    }
    spin.value = false
    search.spin_bool = false
  })
}
watch(()=> search.search_value, val => {
  number.value = val
  search.spin_bool = true
  all_Order()
})
onMounted(()=>{
  all_Order()
})
</script>