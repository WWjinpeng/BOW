<template>
  
  <!-- <div>Bot昵称: {{ bot_name }}</div> -->
  <!-- <div>Bot战力: {{ bot_rating }}</div> -->
  <body>
    <h1>BOW-yuan神启动</h1>
  </body>
  <router-view/>
  </template>
<script>
import $ from 'jquery';
import { ref, onMounted } from 'vue'; // 确保引入 onMounted
export default{
  name:"APP",
  setup:() =>{
    let bot_name = ref("");
    let bot_rating = ref("");
    $.ajax({
      url:"http://127.0.0.1:3000/pk/getbotinfo/",
      type: "get",
      success: resp =>{
        bot_name.value = resp.name;
        bot_rating.value = resp.rating;
      }
    })
    onMounted(() => {
      document.title = "Battle On Web"; // 设置页面标题
    });
    return {
      bot_name,
      bot_rating
    };
  }
}
</script>
<style>
h1{
  text-align: center;
  z-index: 3;
  font-size: 50px;
}
body::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('/src/assets/霞.jpg');
      background-size: cover;
      background-position: center;
      opacity: 0.5; /* 设置透明度 */
      z-index: -1; /* 保证背景在内容下方 */
    }
</style>
