<template>
  <n-modal v-model:show="state.showModal" :show-icon="false" preset="dialog" style="width: 760px">
    <template #header>
      <div>{{ props.title }}</div>
    </template>

    <n-form :model="state.ruleForm" ref="ruleFormRef" label-placement="left" require-mark-placement="left"
      :label-width="80" class="py-4">
      <n-grid :cols="24" :x-gap="24">
        <n-grid-item :span="12">
          <n-form-item label="应用ID" path="app_id" :rule="[{ required: true, message: '应用ID不能为空', trigger: 'blur' }]">
            <n-input placeholder="请输入应用ID" v-model:value="state.ruleForm.app_id" clearable />
          </n-form-item>
        </n-grid-item>
        <n-grid-item :span="12">
          <n-form-item label="应用密钥" path="app_secret">
            <n-input placeholder="请输入应用密钥" v-model:value="state.ruleForm.app_secret" clearable />
          </n-form-item>
        </n-grid-item>
        <n-grid-item :span="12">
          <n-form-item label="商户号" path="mch_id">
            <n-input placeholder="请输入商户号" v-model:value="state.ruleForm.mch_id" clearable />
          </n-form-item>
        </n-grid-item>
        <n-grid-item :span="12">
          <n-form-item label="商户key" path="mch_key">
            <n-input placeholder="请输入商户key" v-model:value="state.ruleForm.mch_key" clearable />
          </n-form-item>
        </n-grid-item>
        <n-grid-item :span="12">
          <n-form-item label="类型">
            <n-select v-model:value="state.ruleForm.type" :options="state.typeOptions" class="w180"></n-select>
          </n-form-item>
        </n-grid-item>
        <n-grid-item :span="12">
          <n-form-item label="状态" path="status">
            <n-radio-group v-model:value="state.ruleForm.status" name="status">
              <n-space>
                <n-radio :value="1">启用</n-radio>
                <n-radio :value="2">禁用</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
        </n-grid-item>
      </n-grid>
      <n-form-item label="私钥" path="private_key">
        <n-input type="textarea" placeholder="请输入私钥" v-model:value="state.ruleForm.private_key" />
      </n-form-item>
      <n-form-item label="公钥" path="public_key">
        <n-input type="textarea" placeholder="请输入公钥" v-model:value="state.ruleForm.public_key" />
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
import { addPayConfig, updatePayConfig } from '@/api/system/pay_config'

const ruleFormRef = ref()
const props = defineProps({
  title: String
})
const emits = defineEmits(['handleQuery'])
// 定义全局变量
const state = reactive({
  showModal: false,
  btnLoading: false,
  typeOptions: [
    {
      label: '微信公众号',
      value: 10
    },
    {
      label: '微信小程序',
      value: 11
    },
    {
      label: '支付宝',
      value: 20
    },
    {
      label: 'Paypal',
      value: 30
    },
    {
      label: 'Stripe',
      value: 40
    }
  ],
  ruleForm: {} as any,
  menuData: [] as any
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
      type: 10,
      app_id: '',
      app_secret: '',
      mch_id: '',
      mch_key: '',
      private_key: '',
      public_key: '',
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
          await updatePayConfig(params)
          closModal()
        } else {
          const params = state.ruleForm
          await addPayConfig(params)
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
