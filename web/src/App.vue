<template>
  <NavBar />
  <router-view></router-view>
</template>

<script>
import NavBar from './components/NavBar.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap"
// import $ from 'jquery'

export default {
  components: {
    NavBar
  },
  // setup(){
  //   $.ajax({
  //     url:"http://127.0.0.1:3000/user/account/token/",
  //     type: "post",
  //     data:{
  //       username: 'wjp1',
  //       password: "wjp1",
  //     },
  //     success(resp){
  //       console.log(resp);
  //     },
  //     error(resp){
  //       console.log(resp);
  //     }
  //   })
  //   $.ajax({
  //     url:"http://127.0.0.1:3000/user/account/info/",
  //     type: "get",
  //     headers:{
  //       Authorization: "Bearer " + "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkN2NjYWFmYjdlYTY0MGRkYjFmZjNlMzliODc3NTcxYSIsInN1YiI6IjEiLCJpc3MiOiJzZyIsImlhdCI6MTcyOTUyNTU5MywiZXhwIjoxNzMwNzM1MTkzfQ.O9uN_DptuFdQ46dH54XlSc47YndqH0cdfR4cUOETFuA"
  //     },
  //     success(resp){
  //       console.log(resp);
  //     },
  //     error(resp){
  //       console.log(resp);
  //     }
  //   })
  //   $.ajax({
  //     url:"http://127.0.0.1:3000/user/account/register/",
  //     type: "post",
  //     data:{
  //       username: 'wjp1',
  //       password: "wjp1",
  //       confirmedPassword: "wjp1",
  //     },
  //     success(resp){
  //       console.log(resp);
  //     },
  //     error(resp){
  //       console.log(resp);
  //     }
  //   })
  // }
}
</script>

<style>
body {
  background-image: url("./assets/R-C.jpg");
  background-size: cover;
}
</style>
