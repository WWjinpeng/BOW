<template>
    <div class = "playground">
        <GameMap></GameMap>
    </div>
</template>
<script>
import  GameMap  from './GameMap.vue';
export default{
    components:{
        GameMap,
    }
}
</script>
<style scoped>
div.playground{
    width: 70vw;
    height: 80vh;
    margin: 40px auto;
    /* background-color: lightblue; */
}
</style>