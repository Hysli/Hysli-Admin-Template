<template>
    <!-- <div>{{ $t('home.console') }}</div> -->
    <n-card :bordered="false">
        <div class="flex items-center">
            <div>
                <n-avatar circle :size="64" :src="schoolboy" />
            </div>
            <div>
                <p class="px-4 text-xl">尊敬的 {{ state.userInfo.phone ?? '用户' }}，欢迎登录本系统！</p>
                <p class="px-4 text-gray-400 mt10">当前时间 {{ state.currentTime }}</p>
            </div>
        </div>
    </n-card>
    <n-card :segmented="{ content: true }" :bordered="false" size="small">
        <img src="~@/assets/images/Business.svg" style="margin: auto;" />
    </n-card>
</template>
<script lang="ts" setup>
import schoolboy from '@/assets/images/schoolboy.png'
import { reactive, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()
// 定义全局变量
const state = reactive({
    userInfo: userStore.getUserInfo,
    greetings: '',
    currentTime: '',
    timer: null as any,
})

onMounted(() => {
    console.log(state.userInfo)
    getCurrentTime()
    state.timer = setInterval(getCurrentTime, 1000)
})

onUnmounted(() => {
    clearInterval(state.timer)
})

const getCurrentTime = () => {
    // 当前时间
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    state.currentTime = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} ${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second}`
}
</script>
<style lang="less" scoped></style>