
<template>
    <n-modal v-model:show="state.showModal" :show-icon="false" preset="dialog">
        <template #header>
            <div>{{ props.title }}</div>
        </template>

        <n-form :model="state.ruleForm" ref="ruleFormRef" label-placement="left" require-mark-placement="left"
            :label-width="80" class="py-4">
            <n-form-item label="新密码" path="password" :rule="[{ required: true, message: '新密码不能为空', trigger: 'blur' }]">
                <n-input type="password" show-password-on="click" placeholder="请输入新密码"
                    v-model:value="state.ruleForm.password" />
            </n-form-item>
            <n-form-item label="确认密码" path="passwordConfirm"
                :rule="[{ required: true, message: '确认密码不能为空', trigger: 'blur' }]">
                <n-input type="password" show-password-on="click" placeholder="请输入确认密码"
                    v-model:value="state.ruleForm.passwordConfirm" />
            </n-form-item>
            <div class="tips">密码规则：6-20 位，数字、常见符号和大小写英文字母</div>
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
import { updatePassword } from '@/api/business/user'

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
	ruleForm: {} as any
})

// 打开弹窗
const openModal = (record: any) => {
	// console.log('打开弹窗', record)
	state.ruleForm = {
		password: '',
		passwordConfirm: ''
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
				closModal()
			} catch (e) { }
		}
		state.btnLoading = false
	})
}

// 导出对象
defineExpose({ openModal })
</script>
<style lang="less" scoped>
.tips {
    font-size: 13px;
    color: red;
    margin-left: 10px;
}
</style>