<template>
  <n-modal v-model:show="state.showModal" :show-icon="false" preset="dialog">
    <template #header>
      <div>{{ props.title }}</div>
    </template>

    <n-form :model="state.ruleForm" ref="ruleFormRef" label-placement="left" require-mark-placement="left"
      :label-width="80" class="py-4">
      <n-form-item label="名称" path="name" :rule="[{ required: true, message: '名称不能为空', trigger: 'blur' }]">
        <n-input placeholder="请输入名称" v-model:value="state.ruleForm.name" clearable />
      </n-form-item>
      <n-form-item label="Key值" path="key" :rule="[{ required: true, message: 'Key值不能为空', trigger: 'blur' }]">
        <n-input placeholder="请输入Key值" v-model:value="state.ruleForm.key" :clearable="!state.ruleForm._id"
          :readonly="state.ruleForm._id" />
      </n-form-item>
      <n-form-item label="Value值" path="value">
        <n-input placeholder="请输入Value值" v-model:value="state.ruleForm.value" clearable />
      </n-form-item>
      <n-form-item label="分组" path="group">
        <n-select v-model:value="state.ruleForm.group" :options="props.groupOptions" clearable></n-select>
      </n-form-item>
      <n-form-item label="状态" path="status">
        <n-radio-group v-model:value="state.ruleForm.status" name="status">
          <n-space>
            <n-radio :value="1">启用</n-radio>
            <n-radio :value="2">禁用</n-radio>
          </n-space>
        </n-radio-group>
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
import { onMounted, reactive, ref } from 'vue'
import { addParameter, updateParameter } from '@/api/system/parameter'

const ruleFormRef = ref()
const props = defineProps({
  title: String,
  groupOptions: Array<any>
})
const emits = defineEmits(['handleQuery'])
// 定义全局变量
const state = reactive({
  showModal: false,
  btnLoading: false,
  ruleForm: {} as any
})

onMounted(() => {

})

// 打开弹窗
const openModal = (record: any) => {
  // console.log('打开弹窗', record)
  if (Object.keys(record).length > 0) {
    state.ruleForm = JSON.parse(JSON.stringify(record))
  }
  else {
    state.ruleForm = {
      name: '',
      key: '',
      value: '',
      group: undefined,
      status: 1
    }
  }
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
        if (state.ruleForm._id) {
          const params = state.ruleForm
          await updateParameter(params)
          closModal()
        } else {
          const params = state.ruleForm
          await addParameter(params)
          closModal()
        }
      } catch (e) { }
    }
    state.btnLoading = false
  })
}

// 导出对象
defineExpose({ openModal })
</script>
<style lang="less" scoped></style>
