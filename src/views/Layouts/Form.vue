<template>
  <div>
    <div style="height: 50px;">
      <Header @openclose="openclose"></Header>
    </div>
    <n-divider style="margin: 0;"></n-divider>
    <div style="height: calc(100vh - 51px);">
      <n-space vertical style="height: calc(100vh - 51px) !important;">
        <n-layout has-sider style="height: calc(100vh - 51px) !important;">
          <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="240" :heigth="100"
            :collapsed="menu_bool" @collapse="menu_bool = true" @expand="menu_bool = false">
            <n-menu :collapsed="menu_bool" :collapsed-width="64" :collapsed-icon-size="22" :options="menuOptions"
              v-model:value="selectedMenu" :onUpdate:value="updateMenu" />
          </n-layout-sider>
          <n-layout>
            <div style="padding: .5rem;">
              <router-view></router-view>
            </div>
          </n-layout>
        </n-layout>
      </n-space>
    </div>
</div>
</template>
<script setup>
import Header from './Header.vue'
import { h, ref, onMounted } from "vue";
import { useRoute, useRouter } from 'vue-router'
import { NIcon } from "naive-ui";
import { Car, Location } from "@vicons/ionicons5";
import { DashboardRound, FeaturedPlayListRound, SpaceDashboardFilled, PeopleAltFilled, PaymentsRound } from '@vicons/material'
const collapsed = ref(true)
const route = useRoute()
const router = useRouter()
const renderIcon = (icon) => {
  return () => h(NIcon, null, { default: () => h(icon) });
}
const menu_bool = ref(true)
const openclose = () => {
  if (menu_bool.value) {
    menu_bool.value = false
  } else {
    menu_bool.value = true
  }
}
const updateMenu = () => {
  router.push({ name: selectedMenu.value })
}
const selectedMenu = ref(null)
const emits = defineEmits(['openclose'])
const menuOptions = ref([
  {
    label: "Buyurtmalar",
    key: "Buyurtmalar",
    icon: renderIcon(DashboardRound),
  },
  {
    label: "Haydovchilar",
    key: "Haydovchilar",
    icon: renderIcon(Car),
  },
  {
    label: 'Joylashuv qo\'shish',
    key: 'Joylashuv qo\'shish',
    icon: renderIcon(Location),
  },
  {
    label: 'Hisobot',
    key: 'Hisobot',
    icon: renderIcon(FeaturedPlayListRound),
    children: [
      {
        label: 'Buyurtmalar',
        key: 'Buyurtmalar hisoboti',
        icon: renderIcon(SpaceDashboardFilled),
      },
      {
        label: 'Haydovchilar',
        key: 'Haydovchilar hisoboti',
        icon: renderIcon(Car),
      }
    ]
  },
  {
    label: 'Foydalanuvchilar',
    key: 'Foydalanuvchilar',
    icon: renderIcon(PeopleAltFilled),
  },
  {
    label: 'Ta\'riflar',
    key: 'Ta\'riflar',
    icon: renderIcon(PaymentsRound)
  }
]);
onMounted(() => {
  selectedMenu.value = route.name
})

</script>