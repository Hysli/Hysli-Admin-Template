<template>
  <n-grid cols="2 s:2 m:2 l:2 xl:2 2xl:2" responsive="screen">
    <n-grid-item>
      <n-form :model="state.ruleForm" ref="ruleFormRef" label-placement="left" require-mark-placement="left"
        :label-width="80" class="py-4">
        <n-form-item label="新密码" path="password" :rule="[
        { required: true, message: '新密码不能为空', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度需6-20位', trigger: 'blur' }
      ]">
          <n-input type="password" show-password-on="click" placeholder="请输入新密码"
            v-model:value="state.ruleForm.password" />
        </n-form-item>
        <n-form-item label="确认密码" path="passwordConfirm" :rule="[
        { required: true, message: '确认密码不能为空', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度需6-20位', trigger: 'blur' }
      ]">
          <n-input type="password" show-password-on="click" placeholder="请输入确认密码"
            v-model:value="state.ruleForm.passwordConfirm" />
        </n-form-item>
        <div class="tips">密码规则：6-20 位，数字、常见符号或大小写英文字母</div>
        <n-form-item label=" ">
          <n-button type="primary" :loading="state.btnLoading" @click="formSubmit">更新密码</n-button>
        </n-form-item>
      </n-form>
    </n-grid-item>
  </n-grid>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useMessage } from 'naive-ui'
import { updatePassword } from '@/api/business/user'
import { TABS_ROUTES } from '@/store/mutation-types'
import { useUserStore } from '@/store/modules/user'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const message = useMessage()
const ruleFormRef = ref()
// 定义全局变量
const state = reactive({
  btnLoading: false,
  ruleForm: {} as any
})

// 确认
const formSubmit = () => {
  if (state.ruleForm.password !== state.ruleForm.passwordConfirm) {
    message.error('两次密码不一致')
    return
  }
  state.btnLoading = true
  ruleFormRef.value.validate(async (errors) => {
    if (!errors) {
      try {
        const params = state.ruleForm
        await updatePassword(params)

        // state.ruleForm = {
        //   password: '',
        //   passwordConfirm: ''
        // }
        userStore.logout().then(() => {
          // 移除标签页
          localStorage.removeItem(TABS_ROUTES)
          router.replace('/login')
        })
      } catch (e) { }
    }
    state.btnLoading = false
  })
}
</script>
<style lang="less" scoped>
.tips {
  font-size: 13px;
  color: red;
  margin-left: 10px;
  margin-bottom: 24px;
}
</style>
