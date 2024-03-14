<template>
  <n-modal v-model:show="state.showModal" :show-icon="false" preset="dialog">
    <template #header>
      <div>{{ props.title }}</div>
    </template>

    <n-form :model="state.ruleForm" ref="ruleFormRef" label-placement="left" require-mark-placement="left"
      :label-width="80" class="py-4">
      <n-form-item label="密钥" path="secret_key" :rule="[{ required: true, message: '密钥不能为空', trigger: 'blur' }]">
        <n-input placeholder="请输入密钥" v-model:value="state.ruleForm.secret_key" clearable />
      </n-form-item>
    </n-form>

    <template #action>
      <n-space>
        <n-button @click="() => (state.showModal = false)">取消</n-button>
        <n-button type="info" :loading="state.btnLoading" @click="confirmForm">确定</n-button>
      </n-space>
    </template>
  </n-modal>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useCdkey } from '@/api/system/cdkey'

const ruleFormRef = ref()
const props = defineProps({
  title: String
})
const emits = defineEmits(['handleQuery'])
// 定义全局变量
const state = reactive({
  showModal: false,
  btnLoading: false,
  ruleForm: {} as any
})

// 打开弹窗
const openModal = () => {
  state.showModal = true
}

// 关闭弹窗
const closModal = () => {
  emits('handleQuery')
  state.showModal = false
}

// 确认
const confirmForm = () => {
  state.btnLoading = true
  ruleFormRef.value.validate(async (errors) => {
    if (!errors) {
      try {
        const params = state.ruleForm
        await useCdkey(params)
        closModal()
      } catch (e) { }
    }
    state.btnLoading = false
  })
}

// 导出对象
defineExpose({ openModal })
</script>
<style lang="less" scoped></style>
