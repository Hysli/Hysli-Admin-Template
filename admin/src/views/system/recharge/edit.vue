<template>
	<n-modal v-model:show="state.showModal" :show-icon="false" preset="dialog">
		<template #header>
			<div>{{ props.title }}</div>
		</template>

		<n-form :model="state.ruleForm" ref="ruleFormRef" label-placement="left" require-mark-placement="left"
			:label-width="80" class="py-4">
			<n-form-item label="标题" path="title" :rule="[{ required: true, message: '标题不能为空', trigger: 'blur' }]">
				<n-input placeholder="请输入标题" v-model:value="state.ruleForm.title" clearable />
			</n-form-item>
			<n-form-item label="充值点数" path="recharge_points" :rule="[{ required: true, message: '不能为空' }]">
				<n-input-number v-model:value="state.ruleForm.recharge_points" :precision="0" :step="1" :min="0" :max="999999" style="width: 310px;" />
			</n-form-item>
			<n-form-item label="赠送点数" path="gift_points" :rule="[{ required: true, message: '不能为空' }]">
				<n-input-number v-model:value="state.ruleForm.gift_points" :precision="0" :step="1" :min="0" :max="999999" style="width: 310px;" />
			</n-form-item>
			<n-form-item label="售价" path="sales_price" :rule="[{ required: true, message: '不能为空' }]">
				<n-input-number v-model:value="state.ruleForm.sales_price" :precision="2" :step="1" :min="0" :max="999999"
					style="width: 280px; margin-right: 10px;" />元
			</n-form-item>
			<n-form-item label="排序" path="sort">
				<n-input-number v-model:value="state.ruleForm.sort" :step="1" :min="0" :max="999999" style="width: 100%;" />
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
import { addRechargeTemplate, updateRechargeTemplate } from '@/api/system/recharge'

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
	if (Object.keys(record).length > 0) {
		state.ruleForm = JSON.parse(JSON.stringify(record))
		if (state.ruleForm.sales_price) {
			state.ruleForm.sales_price = Number(state.ruleForm.sales_price / 100)
		}
	}
	else {
		state.ruleForm = {
			title: '',
			recharge_points: 0,
			gift_points: 0,
			sales_price: 0,
			status: 1,
			sort: 0
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
      
      if (state.ruleForm.recharge_points == null || state.ruleForm.recharge_points == undefined) {
        message.error('充值点数不能为空')
        return
      }
      if (state.ruleForm.gift_points == null || state.ruleForm.gift_points == undefined) {
        message.error('赠送点数不能为空')
        return
      }
      if (!state.ruleForm.sales_price) {
        message.error('售价不能为空')
        return
      }

			try {
				if (state.ruleForm._id) {
					const params = state.ruleForm
					await updateRechargeTemplate(params)
					closModal()
				} else {
					const params = state.ruleForm
					await addRechargeTemplate(params)
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
