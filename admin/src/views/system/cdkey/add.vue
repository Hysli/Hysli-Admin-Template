<template>
    <n-modal v-model:show="state.showModal" :show-icon="false" preset="dialog">
        <template #header>
            <div>{{ props.title }}</div>
        </template>

        <n-form :model="state.ruleForm" ref="ruleFormRef" label-placement="left" require-mark-placement="left"
            :label-width="100" class="py-4">
            <n-form-item label="前缀" path="prefix"
                :rule="[{ message: '只能输入4-8位大小写字母', pattern: /^[a-zA-Z]{4,8}$/, trigger: ['blur', 'change'] }]">
                <n-input placeholder="请输入前缀" v-model:value="state.ruleForm.prefix" clearable />
            </n-form-item>
            <n-form-item label="生成数量" path="quantity" :rule="[{ required: true, message: '不能为空' }]">
                <n-input-number v-model:value="state.ruleForm.quantity" :step="1" :min="0" :max="999999"
                    style="width: 100%;" />
            </n-form-item>
            <n-form-item label="点数" path="points" :rule="[{ required: true, message: '不能为空' }]">
                <n-input-number v-model:value="state.ruleForm.points" :precision="0" :step="1" :min="0" :max="999999"
                    style="width: 290px;" />
            </n-form-item>
            <n-form-item label="过期时间" path="expires_time" :rule="[{ required: true, message: '不能为空' }]">
                <n-date-picker v-model:value="state.ruleForm.expires_time" input-readonly clearable type="datetime"
                    style="width: 100%;" />
            </n-form-item>
            <n-form-item label="是否计入赠送" path="is_gift">
                <n-radio-group v-model:value="state.ruleForm.is_gift" name="status">
                    <n-space>
                        <n-radio :value="true">是</n-radio>
                        <n-radio :value="false">否</n-radio>
                    </n-space>
                </n-radio-group>
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
import { reactive, ref } from 'vue'
import { useMessage } from 'naive-ui'
import { addCdkey } from '@/api/system/cdkey'

const message = useMessage()
const ruleFormRef = ref()
const props = defineProps({
    title: String
})
const emits = defineEmits(['handleQuery'])
// 定义全局变量
const state = reactive({
    showModal: false,
    btnLoading: false,
    ruleForm: {} as any,
    menuData: [] as any
})

// 打开弹窗
const openModal = (record: any) => {
    // console.log('打开弹窗', record)
    state.ruleForm = {
        prefix: '',
        points: 0,
        quantity: 0,
        expires_time: undefined,
        is_gift: true,
        status: 1
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
          if (state.ruleForm.quantity == null || state.ruleForm.quantity == undefined) {
            message.error('生成数量不能为空')
            return
          }
          if (state.ruleForm.points == null || state.ruleForm.points == undefined) {
            message.error('点数不能为空')
           return
          }
          if (!state.ruleForm.expires_time) {
            message.error('过期时间不能为空')
            return
          }
          
          try {
            const params = state.ruleForm
            await addCdkey(params)
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
