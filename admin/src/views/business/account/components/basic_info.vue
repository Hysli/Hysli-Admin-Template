<template>
  <n-grid cols="2 s:2 m:2 l:3 xl:3 2xl:3" responsive="screen">
    <n-grid-item>
      <n-form :label-width="80" :model="state.ruleForm" label-placement="left" require-mark-placement="left">
        <n-form-item label="邮箱" path="email">
          <n-input placeholder="邮箱" v-model:value="state.ruleForm.email" readonly />
        </n-form-item>
        <n-form-item label="手机号" path="phone">
          <n-input placeholder="手机号" v-model:value="state.ruleForm.phone" readonly />
        </n-form-item>
      </n-form>
    </n-grid-item>
  </n-grid>
</template>
  
<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { getUserInfo } from '@/api/user/index'

// 定义全局变量
const state = reactive({
  showModal: false,
  btnLoading: false,
  ruleForm: {} as any,
  menuData: [] as any,
  editTitle: ''
})

onMounted(() => {
  getInfo()
})

// 获取用户信息
const getInfo = async () => {
  const result = await getUserInfo({
    _type: 'getUserInfo'
  })
  // console.log(result)
  state.ruleForm = result.data
}
</script>
  