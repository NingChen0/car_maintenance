<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
 import axios from 'axios'
//拦截器
/** 添加请求拦截器 **/
 axios.interceptors.request.use(function(config) {
   
  // console.log('请求拦截器');
   const token=localStorage.getItem('token');
   config.headers.Authorization=`Bearer ${token}` 
  //  console.log(token);
  return config;
 },function(error){
        return Promise.reject(error)
    }
)
//响应拦截器
axios.interceptors.response.use(
   function (response){
      // console.log(response);
      // console.log(response.headers.authorization);
      const {authorization}=response.headers
      authorization && localStorage.setItem('token',authorization)
       return response;
    },
    function(error){
      if (error.response.status===401) {
        localStorage.removeItem("token");
        location.href="/login"
        
      }
        return Promise.resolve(error)
    }
)

export default {
  
}
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;

}
html,body{
  /* width: 1920px;
  height: 1080px; */
  margin: 0;
  padding: 0;
}
nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
/* 工作台样式 */
.card_top .el-card__body{
  display: flex;
  height: 100%;
  justify-content: space-around;
  align-items: center;
}
/* 滚动条 */
/* 整个滚动条 */
::-webkit-scrollbar {
    width: 5px;
    height: 5px;
}

/* 滚动条上的滚动滑块 */
::-webkit-scrollbar-thumb {
    background-color: #0dcfd6;
    /* 关键代码 */
    background-image: -webkit-linear-gradient(45deg,
            rgba(244, 209, 209, 0.4) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0.4) 75%,
            transparent 75%,
            transparent);
    border-radius: 32px;
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
    background-color: #e9f2f9;
    border-radius: 32px;
}

</style>
