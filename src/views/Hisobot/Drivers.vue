<template>
  <div>
    <n-data-table
      ref="table"
      :columns="columns"
      :data="data"
      :single-line="false"
      :loading="spin"
    />
  </div>
</template>
<script setup>
import { ref, onMounted, h } from 'vue'
import { NButton } from 'naive-ui'
import Report from '../../services/report'

const spin = ref(true)
const columns = ref([
  {
    title: 'Ismi',
    key: 'fullname',
  },
  {
    title: 'Telefon raqami',
    key: 'number',
    render(row){
      return for_tel_number(row)
    }
  },
  {
    title: 'Baho',
    key: 'rating',
    render(row) {
      return h(
        NButton,
        {
          strong: true,
          type: 'Primary',
          size: "small",
        },
        { default: () => row.rating }
      );
    }
    // sorter: (row1, row2) => row1.rating - row2.rating
  },
  // {
  //   title: 'Address',
  //   key: 'address',
  // }
])
const data = ref([])
const for_tel_number = (row) =>{
  let match1 = row.number.slice(0,4)
  let match2 = row.number.slice(4,6)
  let match3 = row.number.slice(6,9)
  let match4 = row.number.slice(9,11)
  let match5 = row.number.slice(11,13)
  return match1 + " (" + match2 + ") " + " " + match3 + " " + match4 + " " + match5
}
onMounted(()=>{
  Report.report_driver_rating().then(res=>{
    if(res.success){
      let datas = res.data;
      for (let i = 0; i < datas.length; i++) {
        if(datas[i].driver_ratings.length != 0){
          datas[i].rating = res.data[i].driver_ratings[0].driver_rating
        }else {
          datas[i].rating = 0
        }
      }
      data.value = datas
      spin.value = false
    }
  })
})
</script>