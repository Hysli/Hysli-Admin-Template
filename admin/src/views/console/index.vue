<template>
  <!-- <div>{{ $t('home.console') }}</div> -->
  <n-card :bordered="false">
    <div class="flex items-center">
      <div>
        <n-avatar circle :size="64" :src="state.userInfo.avatar ? state.userInfo.avatar : schoolboy" />
      </div>
      <div>
        <p class="px-4 text-xl">尊敬的 {{ (state.userInfo.nickname ?? state.userInfo.username) ?? state.userInfo.phone
          }}，欢迎登录本系统！</p>
        <p class="px-4 text-gray-400 mt10">当前时间 {{ state.currentTime }}</p>
      </div>
    </div>
  </n-card>
  <!-- <n-card :segmented="{ content: true }" :bordered="false" size="small">
    <img src="@/assets/images/Business.svg" style="margin: auto;" />
  </n-card> -->
  <div class="mt-4">
    <n-grid cols="1 s:1 m:2 l:2 xl:2 2xl:2" responsive="screen" :x-gap="12" :y-gap="8">
      <n-grid-item>
        <NCard title="CPU" size="small" :bordered="false">
          <div ref="chartContainer1" style="height: 260px;"></div>
        </NCard>
      </n-grid-item>
      <n-grid-item>
        <NCard title="数据库" size="small" :bordered="false">
          <div ref="chartContainer2" style="height: 260px;"></div>
        </NCard>
      </n-grid-item>
    </n-grid>
  </div>
  <div class="mt-4">
    <n-grid cols="1 s:1 m:2 l:2 xl:2 2xl:2" responsive="screen" :x-gap="12" :y-gap="8">
      <n-grid-item>
        <NCard title="内存" size="small" :bordered="false">
          <div ref="chartContainer3" style="height: 260px;"></div>
        </NCard>
      </n-grid-item>
      <n-grid-item>
        <NCard title="云存储" size="small" :bordered="false">
          <div ref="chartContainer4" style="height: 260px;"></div>
        </NCard>
      </n-grid-item>
    </n-grid>
  </div>

</template>
<script lang="ts" setup>
import schoolboy from '@/assets/images/schoolboy.png'
import { reactive, onMounted, onUnmounted, ref, watch } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { getCpuMemoryList } from '@/api/common/index'
import Highcharts from 'highcharts'
import highchartsMore from 'highcharts/highcharts-more'
import gridLightTheme from 'highcharts/themes/grid-light'

// highchartsMore(Highcharts)
// gridLightTheme(Highcharts)

const chartContainer1 = ref(null)
const chartContainer2 = ref(null)
const chartContainer3 = ref(null)
const chartContainer4 = ref(null)
const userStore = useUserStore()
// 定义全局变量
const state = reactive({
  userInfo: userStore.getUserInfo,
  greetings: '',
  currentTime: '',
  timer: null as any,
  resourceData: null as any,
  chartCpu: null as any,
  chartMemory: null as any,
  chartDatabase: null as any,
  chartStorage: null as any,
  chartTimer: null as any
})

onMounted(async () => {
  // console.log(state.userInfo)
  getCurrentTime()
  state.timer = setInterval(getCurrentTime, 1000)
  initCharts()

  await getResource()
  state.chartTimer = setInterval(() => {
    getResource()
  }, 5000)

})

// 监听 resourceData 的变化，实时更新图表
watch(
  () => state.resourceData,
  newValue => {
    console.log('resourceData', state.resourceData)
    // CPU数据
    if (state.resourceData?.cpuUsage?.length > 0) {
      let cpuCategories = [] as any
      let cpuData = [] as any
      const cpuList = state.resourceData.cpuUsage[state.resourceData.cpuUsage.length - 1]
      const num = 0 //cpuList.values.length - 12 > 0 ? (cpuList.values.length - 12) : 0
      for (let i = num; i < cpuList.values.length; i++) {
        if (i % 5 == 0) {
          cpuCategories.push(formattedTime(cpuList.values[i][0]))
          const value = Number(cpuList.values[i][1]).toFixed(3)
          cpuData.push(Number(value))
        }
      }
      if (cpuCategories.length > 0 && cpuData.length > 0) {
        // 渲染CPU
        renderCpu(cpuCategories, cpuData)
      }
    }
    // Memory数据
    if (state.resourceData?.memoryUsage?.length > 0) {
      let memoryCategories = [] as any
      let memoryData = [] as any
      const memoryList = state.resourceData.memoryUsage[state.resourceData.memoryUsage.length - 1]
      const num = 0 //memoryList.values.length - 12 > 0 ? (memoryList.values.length - 12) : 0
      for (let i = num; i < memoryList.values.length; i++) {
        memoryCategories.push(formattedTime(memoryList.values[i][0]))
        const value = Number(memoryList.values[i][1] / (1024 * 1024)).toFixed(3)
        memoryData.push(Number(value))
      }
      if (memoryCategories.length > 0 && memoryData.length > 0) {
        // 渲染Memory
        renderMemory(memoryCategories, memoryData)
      }
    }
    // Database数据
    if (state.resourceData?.databaseUsage.length > 0) {
      const value1 = (1024 - Number(state.resourceData?.databaseUsage[1] / (1024 * 1024))).toFixed(2)
      const value2 = (Number(state.resourceData?.databaseUsage[1]) / (1024 * 1024)).toFixed(2)
      const databaseData = [
        { name: '已使用', y: Number(value2) },
        { name: '剩余', y: Number(value1) }
      ]
      // 渲染Database
      renderDatabase(databaseData)
    }
    // 渲染Storage
    if (state.resourceData?.storageUsage.length > 0) {
      const value1 = (1024 - Number(state.resourceData?.storageUsage[1] / (1024 * 1024))).toFixed(2)
      const value2 = (Number(state.resourceData?.storageUsage[1]) / (1024 * 1024)).toFixed(2)
      const storageData = [
        { name: '已使用', y: Number(value2) },
        { name: '剩余', y: Number(value1) }
      ]
      // 渲染Storage
      renderStorage(storageData)
    }
  },
  {
    deep: true
  }
)

const getResource = async () => {
  const result = await getCpuMemoryList({})
  state.resourceData = result.data ?? null
  // console.log('getResource', state.resourceData)
}

// 渲染CPU
const renderCpu = (categories, data) => {
  if (state.chartCpu) {
    // state.chartCpu.xAxis[0].setCategories(categories, false);
    // state.chartCpu.series[0].setData(data);
    // state.chartCpu.redraw();
    const num = categories.length > 12 ? categories.length - 12 : 0
    const cpuCategories = categories.slice(num) // 截取最后12个数据
    const cpuData = data.slice(num) // 截取最后12个数据

    state.chartCpu.xAxis[0].setCategories(cpuCategories, false)
    state.chartCpu.series[0].setData(cpuData)
    state.chartCpu.redraw()
  }
}

// 渲染Memory
const renderMemory = (categories, data) => {
  if (state.chartMemory) {
    // state.chartMemory.xAxis[0].setCategories(categories, false);
    // state.chartMemory.series[0].setData(data);
    // state.chartMemory.redraw();
    const num = categories.length > 12 ? categories.length - 12 : 0
    const cpuCategories = categories.slice(num) // 截取最后12个数据
    const cpuData = data.slice(num) // 截取最后12个数据

    state.chartMemory.xAxis[0].setCategories(cpuCategories, false)
    state.chartMemory.series[0].setData(cpuData)
    state.chartMemory.redraw()
  }
}

// 渲染Database
const renderDatabase = (data) => {
  if (state.chartDatabase) {
    state.chartDatabase.series[0].setData(data);
    state.chartDatabase.redraw();
  }
}

// 渲染Storage
const renderStorage = (data) => {
  if (state.chartStorage) {
    state.chartStorage.series[0].setData(data);
    state.chartStorage.redraw();
  }
}

// 初始化图表
const initCharts = () => {
  // 初始化CPU
  state.chartCpu = Highcharts.chart(chartContainer1.value, {
    chart: {
      type: 'spline',
    },
    title: {
      text: '',
      enabled: false // 禁用标题
    },
    legend: {
      enabled: false // 移除图例
    },
    xAxis: {
      categories: []
    },
    yAxis: {
      title: {
        text: 'core'
      },
      max: 0.5
    },
    series: [{
      data: []
    }],
    credits: {
      enabled: false // 移除水印
    }
  })

  // 初始化Memory
  state.chartMemory = Highcharts.chart(chartContainer3.value, {
    chart: {
      type: 'area'
    },
    title: {
      text: '',
      enabled: false // 禁用标题
    },
    legend: {
      enabled: false // 移除图例
    },
    xAxis: {
      categories: []
    },
    yAxis: {
      title: {
        text: 'MB'
      },
      max: 512
    },
    plotOptions: {
      area: {
        fillOpacity: 0.5 // 设置填充透明度
      }
    },
    series: [{
      data: []
    }],
    credits: {
      enabled: false // 移除水印
    }
  })

  // 初始化Database
  state.chartDatabase = Highcharts.chart(chartContainer2.value, {
    chart: {
      type: 'pie'
    },
    title: {
      text: '',
      align: 'center',
      enabled: false // 禁用标题
    },
    legend: {
      enabled: false // 移除图例
    },
    plotOptions: {
      pie: {
        innerSize: '50%',
        depth: 45,
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.y:.2f}MB'
        },
        // colors: ['#2440B3', '#e5e5e5'] // 设置颜色
      }
    },
    series: [
      {
        name: '数据',
        data: []
      }
    ],
    credits: {
      enabled: false // 移除水印
    }
  })

  // 初始化Storage
  state.chartStorage = Highcharts.chart(chartContainer4.value, {
    chart: {
      type: 'pie'
    },
    title: {
      text: '',
      align: 'center',
      enabled: false // 禁用标题
    },
    legend: {
      enabled: false // 移除图例
    },
    plotOptions: {
      pie: {
        innerSize: '50%',
        depth: 45,
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.y:.2f}MB'
        },
        // colors: ['#2440B3', '#e5e5e5'] // 设置颜色
      }
    },
    series: [
      {
        name: '数据',
        data: []
      }
    ],
    credits: {
      enabled: false // 移除水印
    }
  })
}

const formattedTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours().toString().padStart(2, '0'); // 获取小时，并补齐两位数
  const minutes = date.getMinutes().toString().padStart(2, '0'); // 获取分钟，并补齐两位数
  const seconds = date.getSeconds().toString().padStart(2, '0'); // 获取秒数，并补齐两位数
  return `${hours}:${minutes}:${seconds}`;
}

onUnmounted(() => {
  if (state.timer) {
    clearInterval(state.timer)
  }
  if (state.chartTimer) {
    clearInterval(state.chartTimer)
  }
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
