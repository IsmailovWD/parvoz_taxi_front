<template>
  <div style="padding: 10px;">
    <div class="loader"></div>
  </div>
</template>
<style lang="scss" scoped>


.loader  {
  animation: rotate 3s infinite;  
  height: 50px;
  width: 50px;
}

.loader:before,
.loader:after {   
  border-radius: 50%;
  content: '';
  display: block;
  height: 20px;  
  width: 20px;
}
.loader:before {
  animation: ball1 3s infinite;  
  background-color: #18A058FF;
  box-shadow: 30px 0 0 #18A058FF;
  margin-bottom: 10px;
}
.loader:after {
  animation: ball2 3s infinite; 
  background-color: #18A058FF;
  box-shadow: 30px 0 0 #18A058FF;
}

@keyframes rotate {
  0% { 
    -webkit-transform: rotate(0deg) scale(0.8); 
    -moz-transform: rotate(0deg) scale(0.8);
  }
  50% { 
    -webkit-transform: rotate(360deg) scale(1.2); 
    -moz-transform: rotate(360deg) scale(1.2);
  }
  100% { 
    -webkit-transform: rotate(720deg) scale(0.8); 
    -moz-transform: rotate(720deg) scale(0.8);
  }
}

@keyframes ball1 {
  0% {
    box-shadow: 30px 0 0 #18A058FF;
  }
  10% {
    box-shadow: 0 0 0 #18A058FF;
    margin-bottom: 0;
    -webkit-transform: translate(15px,15px);
    -moz-transform: translate(15px, 15px);
  }
  100% {
    box-shadow: 30px 0 0 #18A058FF;
    margin-bottom: 10px;
  }
}

@keyframes ball2 {
  0% {
    box-shadow: 30px 0 0 #18A058FF;
  }
  10% {
    box-shadow: 0 0 0 #18A058FF;
    margin-top: -20px;
    -webkit-transform: translate(15px,15px);
    -moz-transform: translate(15px, 15px);
  }
  100% {
    box-shadow: 30px 0 0 #18A058FF;
    margin-top: 0;
  }
}
</style>