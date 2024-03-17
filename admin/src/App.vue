<template>
  <NConfigProvider v-if="!isLock" :locale="zhCN" :theme="getDarkTheme" :theme-overrides="getThemeOverrides"
    :date-locale="dateZhCN">
    <AppProvider>
      <!-- <RouterView /> -->
      <RouterView :key="$route.fullPath" />
    </AppProvider>
  </NConfigProvider>

  <transition v-if="isLock && $route.name !== 'login'" name="slide-up">
    <LockScreen />
  </transition>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { zhCN, dateZhCN, darkTheme } from 'naive-ui'
import { LockScreen } from '@/components/Lockscreen'
import { AppProvider } from '@/components/Application'
import { useScreenLockStore } from '@/store/modules/screenLock.js'
import { useRoute } from 'vue-router'
import { useDesignSettingStore } from '@/store/modules/designSetting'
import { lighten } from '@/utils/index'
import { useLanguageStore } from '@/store/modules/changeLanguage'

const route = useRoute()
const useScreenLock = useScreenLockStore()
const designStore = useDesignSettingStore()
const isLock = computed(() => useScreenLock.isLocked)
const lockTime = computed(() => useScreenLock.lockTime)

const notification = window['$notification']
/**
 * @type import('naive-ui').GlobalThemeOverrides
 */
const getThemeOverrides = computed(() => {
  const appTheme = designStore.appTheme
  const lightenStr = lighten(designStore.appTheme, 6)
  return {
    common: {
      primaryColor: appTheme,
      primaryColorHover: lightenStr,
      primaryColorPressed: lightenStr,
      primaryColorSuppl: appTheme
    },
    LoadingBar: {
      colorLoading: appTheme
    }
  }
})

const getDarkTheme = computed(() => (designStore.darkTheme ? darkTheme : undefined))

let timer: NodeJS.Timer
let Wsstimer: NodeJS.Timeout | null

const timekeeping = () => {
  clearInterval(timer as any)
  if (route.name == 'login' || isLock.value) return
  // 设置不锁屏
  useScreenLock.setLock(false)
  // 重置锁屏时间
  useScreenLock.setLockTime()
  timer = setInterval(() => {
    // 锁屏倒计时递减
    useScreenLock.setLockTime(lockTime.value - 1)
    if (lockTime.value <= 0) {
      // 设置锁屏
      useScreenLock.setLock(true)
      return clearInterval(timer as any)
    }
  }, 1000)
}

const useLang = useLanguageStore()
// 获取当前系统语言
const getLanguage = () => {
  const lang = navigator.language
  console.log(lang, 'navigator.language')
  if (lang.includes('zh')) {
    return 'zhCN'
  }
  return lang
}

onMounted(() => {
  document.addEventListener('mousedown', timekeeping)
  // 启动时，判断本地缓存中是否有语言 lang，根据浏览器语言设置首次默认语言

  if (localStorage.getItem('lang')) {
    const lang = localStorage.getItem('lang')
    useLang.SET_LOCALE(lang)
  } else {
    const lang = getLanguage()
    useLang.SET_LOCALE(lang)
  }

  // 如果判断是登陆状态，那么就连接 websocket
  if (localStorage.getItem('ACCESS-TOKEN')) {
    const token = localStorage.getItem('ACCESS-TOKEN') as string
    connectWss(JSON.parse(token).value)
  }
})

// 连接 websocket
const connectWss = (token: string) => {
  const wsUrl = import.meta.env.VITE_GLOB_API_URL.replace('https', 'wss')
  var ws = new WebSocket(wsUrl, [token])

  ws.onopen = function (event) {
    // 成功后，30s 发送一次心跳
    Wsstimer = setInterval(() => {
      console.log('heartbeat')
      ws.send('heartbeat')
    }, 30000);
  };

  ws.onclose = function (event) {
    // 连接关闭时，清除定时器
    if (Wsstimer) {
      clearInterval(Wsstimer as any);
      Wsstimer = null;
    }
  };

  ws.onerror = function (event) {
    // 发生错误时，清除定时器
    if (Wsstimer) {
      clearInterval(Wsstimer as any);
      Wsstimer = null;
    }
    // 在这里可以添加更多的错误处理逻辑
  };

  ws.addEventListener('message', (event) => {
    // 处理接收到的消息
    console.log('Received:', event.data);
    let message: Message | string = ""
    interface Message {
      type: string
      content: string
      _id: string
    }
    console.log(typeof event.data, 'event.data', event.data)
    if ((event.data.startsWith('{') && event.data.endsWith('}')) || 
    (event.data.startsWith('[') && event.data.endsWith(']'))) {
      try {
        // 尝试解析 JSON
        message = JSON.parse(event.data);
      } catch (error) {
        // 如果解析失败，处理错误
        console.error('解析 JSON 时出错：', error);
        message = event.data
      }
    } else {
      // 如果不是 JSON，直接处理数据
      // console.log('收到的非 JSON 消息：', event.data);
      message = event.data
    }
    if (typeof message === 'object') {
      notification[message.type]({
          content: message.content,
          duration: 2500,
          keepAliveOnHover: true
      })
      // 回复已读 ID
      if (message.content && message._id) {
        ws.send('read_id:'+message._id)
      }
    }
  });
}

onUnmounted(() => {
  document.removeEventListener('mousedown', timekeeping)
  clearInterval(Wsstimer as any);
})
</script>

<style lang="less">
@import 'styles/index.less';
</style>
