<template>
    <div class="matchground">
        <div class="row">
            <div class="col-4">
                <div class="user-photo">
                    <img :src="$store.state.user.photo" alt="">
                </div>
                <div class="user-username">
                    {{ $store.state.user.username }}
                </div>
            </div>
            <div class="col-4">
                <div class="user-select-bot">
                    <select v-model="select_bot" class="form-select" aria-label="Default select example">
                        <option value="-1" selected>亲自出马</option>
                        <option v-for="bot in bots" :key="bot.id" :value="bot.id">
                            {{ bot.title }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="col-4">
                <div class="user-photo">
                    <img :src="$store.state.pk.opponent_photo" alt="">
                </div>
                <div class="user-username">
                    {{ $store.state.pk.opponent_username }}
                </div>
            </div>
            <div class="col-12" style="text-align: center; padding-top: 15vh;">
                <button @click="click_match_btn" type="button" class="trapezoid-button">{{ match_btn_info }}</button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex';
import $ from 'jquery';

export default {
    setup() {
        const store = useStore();
        let match_btn_info = ref("开始匹配");
        let bots = ref([]);
        let select_bot = ref("-1");

        const click_match_btn = () => {
            if (match_btn_info.value === "开始匹配") {
                match_btn_info.value = "取消";
                console.log(select_bot.value);
                store.state.pk.socket.send(JSON.stringify({
                    event: "start-matching",
                    bot_id: select_bot.value,
                }));
            } else {
                match_btn_info.value = "开始匹配";
                store.state.pk.socket.send(JSON.stringify({
                    event: "stop-matching",
                }));
            }
        }

        const refresh_bots = () => {
            $.ajax({
                url: "http://127.0.0.1:3000/user/bot/getlist/",
                type: "get",
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    bots.value = resp;
                }
            })
        }

        refresh_bots();  // 从云端动态获取bots

        return {
            match_btn_info,
            click_match_btn,
            bots,
            select_bot,
        }
    }
}
</script>

<style scoped>
div.matchground { 
    width: 60vw;
    height: 70vh;
    margin: 40px auto;
    background-color: rgba(50, 50, 50, 0.5);
}
div.user-photo {
    text-align: center;
    padding-top: 10vh;
}
div.user-photo > img {
    border-radius: 50%;
    width: 20vh;
}
div.user-username {
    text-align: center;
    font-size: 24px;
    font-weight: 600;
    color: white;
    padding-top: 2vh;
}
div.user-select-bot {
    padding-top: 20vh;
}
div.user-select-bot > select {
    width: 60%;
    margin: 0 auto;
}
.trapezoid-button {
    width: 200px;
    height: 50px;
    background: 
        /* 径向渐变，从中心向外扩散，颜色从浅蓝到透明 */
        radial-gradient(circle, rgba(173, 216, 230, 0.8) 0%, rgba(173, 216, 230, 0) 70%),
        /* 线性渐变，从左到右，颜色从浅蓝到天蓝 */
        linear-gradient(to right, #add8e6, #87CEEB),
        /* 另一个线性渐变，从上到下，颜色从浅蓝到白色，但透明度较低，作为底层 */
        linear-gradient(to bottom, rgba(173, 216, 230, 0.5), rgba(255, 255, 255, 0.5));
    
    /* 背景混合模式，可以尝试不同的值来查看效果 */
    /* background-blend-mode: overlay; */
    
    /* 背景大小，对于径向渐变很有用 */
    background-size: cover;
    
    /* 确保背景不会重复 */
    background-repeat: no-repeat;
    color: black; /* 白色文字 */
    border: none;
    cursor: pointer;
    font-size: 16px;
    text-align: center;
    line-height: 50px; /* 垂直居中 */
    clip-path: polygon(0 0, 100% 0, 90% 100%, 10% 100%); /* 梯形形状 */
    transition: background-color 0.3s ease; /* 添加过渡效果 */
}

.trapezoid-button:hover {
    background-color: #45a049; /* 鼠标悬停时改变背景颜色 */
}
</style>



