<template>
  <div class="form_body">
    <div class="contact-wrapper">
      <header class="login-cta">
        <div class="image">
          <img src="https://media.istockphoto.com/id/519870714/photo/taxi.jpg?s=612x612&w=0&k=20&c=mzlqm5eisvu-B7hCyOK3LAsR4ugFTsHtC2kMWUmbA0Y=" alt="">
        </div>
        <h2>Kirish</h2>
      </header>
      <form>
        <div class="form-row">
          <input type="text" required v-model="number" @keydown="formatter" maxlength="19" title="Tefelon raqam">
          <span>Phone number</span>
        </div>
        <div class="form-row">
          <input type="password" required v-model="pasword" title="Parol">
          <span>Password</span>
        </div>
        <div class="form-row"></div>
        <div class="form-row">
          <button v-wave type="button" @click="send">Kirish</button>
          <div  style="border-radius: 8px; background: #00000067; position: absolute; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;" v-if="show">
            <n-spin :show="show">
            </n-spin>
          </div>
        </div>
      </form>
    </div>
    <div class="circle one"></div>
    <div class="circle two"></div>
    <div class="circle three"></div>
    <div class="circle four"></div>
  </div>
</template>
<script setup>
import {ref, watch} from 'vue'
import { useRouter } from 'vue-router'
import services from '../../services/User'
import {useNotification, useMessage} from 'naive-ui'
import { useErrorStore } from '../../stores/errors'
import Socket from '../../socket/socket'
import { onKeyStroke } from '@vueuse/core'
const error_store = useErrorStore()
const notification = useNotification()
const router = useRouter() 
const message = useMessage() 
const number = ref(null)
const pasword = ref(null)
const show = ref(false)
const send = () =>{
  if(number.value || pasword.value){
    show.value = true
    let numb = `+${number.value.replace(/[^\d]/g,"")}`
    services.login({phone: numb, pasword: pasword.value}).then((res) =>{
      if(res.success){
        notification.success({
          content: 'Muvaffaqqiyatli',
          meta: 'Tizimga muvaffaqiyatli kirdingiz',
          duration: 2500,
          keepAliveOnHover: true
        })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('firstname', res.data.firstname)
        localStorage.setItem('lastname', res.data.lastname)
        localStorage.setItem('role', res.data.role)
        localStorage.setItem('number', res.data.phone_number)
        Socket.connect()
        router.push({path: '/orders'})
      }
    })
  }else{
    message.error('Telefon va parol to\'ldirilishi shart')
  }
}
onKeyStroke(['Enter'], e => {
  if(e.key == 'Enter'){
    send()
  }
})
const formatter =()=>{
  let numbers = formatNumber(number.value)
  number.value = numbers
}
const formatNumber =(value)=>{
  if(!value) return value
  const phoneNumber = value.replace(/[^\d]/g,"")
  const phoneNumberLength = phoneNumber.length
  if(phoneNumberLength < 4) return `+${phoneNumber}`
  if(phoneNumberLength < 6){
    return  `+${phoneNumber.slice(0,3)} (${phoneNumber.slice(3,5)}`
  }
  if(phoneNumberLength < 8){
    return `+${phoneNumber.slice(0,3)} (${phoneNumber.slice(3,5)}) ${phoneNumber.slice(5)}`
  }
  if(phoneNumberLength < 10){
    return `+${phoneNumber.slice(0,3)} (${phoneNumber.slice(3,5)}) ${phoneNumber.slice(5,8)} ${phoneNumber.slice(8)}`
  }
  return `+${phoneNumber.slice(0,3)} (${phoneNumber.slice(3,5)}) ${phoneNumber.slice(5,8)} ${phoneNumber.slice(8,10)} ${phoneNumber.slice(10)}`
}
watch(() => error_store.error_text, (val) => {
  if(val){
    setTimeout(() => {
      show.value = false
    }, 2500);
  }
})
</script>
<style scoped lang="scss">

$colorPurple: #615dfa;
$colorDark: #3e3f5e;

.circle{
    position: fixed;
    top: 0;
    left: 0;
    padding: 350px;
    background: #ffffff28;
    z-index: 1;
    pointer-events: none;
    border-radius: 50%;
    opacity: .15;
  }
  .circle.one{
    top: 50%;
    left: 50%;
    padding: 400px 600px;
    border: 2px solid #fff;
    box-shadow: 0 0 15px #fff;
  }
  .circle.two{
    top: 80%;
    left: 0%;
    padding: 200px 200px;
    border: 2px solid #fff;
    box-shadow: 0 0 15px #fff;
  }
  .circle.four{
    right: -300px;
    border: 2px solid #fff;
    box-shadow: 0 0 15px #fff;
    height: 210vh;
    top: -100vh;
  }
  .circle.three{
    top: -70%;
    left: 50vw;
    border: 2px solid #fff;
    box-shadow: 0 0 15px #fff;
  }
.form_body {
  align-items: center;
  // background: linear-gradient(135deg, #0c3eb4, #4470d8, #4470d8, #b4707d, #b06774);
  // background: url('https://media.istockphoto.com/id/519870714/photo/taxi.jpg?s=612x612&w=0&k=20&c=mzlqm5eisvu-B7hCyOK3LAsR4ugFTsHtC2kMWUmbA0Y=');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  height: 100vh;
  justify-content: center;
}

.contact-wrapper {
  background: #fff;
  box-shadow: 0px 0px 8px rgba(0,0,0,.15);
  border-radius: .75em;
  padding: 2em;
  width:25em;
}

.login-cta {
  & > h2 {
    color: $colorDark;
    font-size: 1.75rem;
    text-align: left;
  }
  .image {
    position: relative;
    width: 294px;
    height: 202px;
    border-radius: 10px;
    overflow: hidden;

    img{
      width: 100%;
      height: 100%;
      object-fit: cover;
      animation: animate 50s linear infinite;
    }
  }
}

form {
  margin: 2em 0;
  & > .form-row {
    display: flex;
    margin: .75em 0;
    position: relative;
    justify-content: center;
    align-items: center;
    
    & > span { 
      background: #fff;
      color: #adafca;
      display: inline-block;
      font-weight: 400;
      left: 1em;
      padding: 0 .5em;
      position: absolute;
      pointer-events: none;
      transform: translatey(-50%);
      top: 50%;
      transition: all 300ms ease;
      user-select: none;
    }
    
    & > input,
    & > button {
      border-radius: .5em;
      font-family: inherit;
      padding: 1em .5em;
      width: 100%;
    }
    
    & > input {
      font-weight: bold;
      transition: 100ms ease all;
      width: 100%;
      
      &[type=text],
      &[type=password] {
        border: .075em solid #ddd;
      }
      
      &:valid {
        & + span {
          top: 0;
          font-size: .90rem;
        }
      }
      
      &:invalid {
        & + span {
          top: 50%;
        }
      }
      
      &:focus {
        & + span {
          top: 0;
        }
      }
      
      &:required {
        box-shadow: none;
      }
      
      &:focus {
        border-color: #7b5dfa;
        outline: none;
        &:invalid {
          box-shadow: none;
          top: 50%;
        }
        &:valid {
          top :0;
        }
      }
    }
    
    
    
    & > button {
      background: linear-gradient(135deg, #0c3eb4, #4470d8, #4470d8, #b4707d, #b06774);
      // border: .10em solid #0c3eb4;
      border: none;
      color: #fff;
      cursor: pointer;
      font-weight: bold;
      transition: all 300ms ease;
      
      &:focus {
        border: .10em solid darken(#7b5dfa, 10);
        outline: none;
      }
      
      &:hover {
        background-color: darken(#7b5dfa, 5);
      }
    }
  }
}

@keyframes animate {
  0%{
    transform: scale(1) translateX(0px) translateY(0px);
  }
  25%{
    transform: scale(1.5) translateX(20px) translateY(0px);
  }
  50%{
    transform: scale(1.5) translateX(-20px) translateY(0px);
  }
  75%{
    transform: scale(1.5) translateX(0px) translateY(-20px);
  }
  100%{
    transform: scale(1) translateX(0px) translateY(0px);
  }
}
</style>