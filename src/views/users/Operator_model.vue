<template>
  <div>
    <n-spin :show="show">
      <n-form-item label="Ismi">
        <n-input v-model:value="user.firstname" type="text" placeholder="Ismi" :onUpdate:value="validates" />
      </n-form-item>
      <n-form-item label="Familyasi">
        <n-input v-model:value="user.lastname" type="text" placeholder="Familyasi" :onUpdate:value="validates" />
      </n-form-item>
      <n-form-item label="Telefon raqami">
        <n-input v-model:value="user.phone_number" type="text" placeholder="Telefon raqami"
          :onUpdate:value="validates" />
      </n-form-item>
      <n-form-item label="Parol">
        <n-input v-model:value="password" type="password" show-password-on="mousedown" placeholder="Parol"
          :onUpdate:value="validates" />
      </n-form-item>
      <div style="float: right;">
        <n-button :disabled="btn" type="primary" @click="send">Saqlash</n-button>
      </div>
    </n-spin>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useMessage, useNotification } from 'naive-ui'
import Users from '../../services/User'

const props = defineProps(['users'])
const emits = defineEmits(['close'])
const message = useMessage()
const notification = useNotification()
const user = ref({
  firstname: null,
  lastname: null,
  phone_number: null,
})
const password = ref(null)
const btn = ref(false)
const show = ref(false)
const send = () => {
  user.value.password = password.value
  show.value = true
  if (props.users) {
    Users.update(user.value, props.users).then(res => {
      if (res.success) {
        message.success('O\'zgarishlar saqlandi')
        emits('close')
      } else {
        notification.error({
          content: 'Xatolik',
          meta: res.message,
          duration: 2500,
          keepAliveOnHover: true,
        })
      }
      show.value = false
    })
  } else {
    user.value.role = 'operator'
    Users.create(user.value).then(res => {
      if (res.success) {
        message.success('O\'zgarishlar saqlandi')
        emits('close')
      } else {
        notification.error({
          content: 'Xatolik',
          meta: res.message,
          duration: 2500,
          keepAliveOnHover: true,
        })
      }
      show.value = false
    })
  }
}
const validates = () => {
  if (props.users) {
    if (user.value.firstname && user.value.lastname && user.value.phone_number) {
      btn.value = false
    } else {
      btn.value = true
    }
  } else {
    if (user.value.firstname && user.value.lastname && user.value.phone_number && password.value) {
      btn.value = false
    } else {
      btn.value = true
    }
  }
}
const info_user = () => {
  if (props.users) {
    Users.one(props.users).then(res => {
      if (res.success) {
        user.value = res.data
      } else {
        notification.error({
          content: 'Xatolik',
          meta: res.message,
          duration: 2500,
          keepAliveOnHover: true,
        })
      }
      show.value = false
    })
  }
}
onMounted(() => {
  info_user()
  validates()
})
</script>