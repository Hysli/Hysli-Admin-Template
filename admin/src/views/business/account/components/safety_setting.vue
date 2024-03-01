<template>
  <n-grid cols="1" responsive="screen" class="-mt-4">
    <n-grid-item>
      <n-list>
        <n-list-item>
          <template #suffix>
            <n-button type="primary" text @click="passwordUpdate">修改</n-button>
          </template>
          <n-thing title="账户密码">
            <template #description><span class="text-gray-400">设置强密码，账号更安全</span></template>
          </n-thing>
        </n-list-item>
        <!-- 邮箱 -->
        <n-list-item v-if="state.ruleForm.email">
          <template #suffix>
            <n-button type="primary" text>修改</n-button>
          </template>
          <n-thing title="邮箱">
            <template #description><span class="text-gray-400">{{ state.ruleForm.email }}</span></template>
          </n-thing>
        </n-list-item>
        <n-list-item v-else>
          <template #suffix>
            <n-button type="primary" text>点击绑定</n-button>
          </template>
          <n-thing title="绑定邮箱">
            <template #description><span class="text-gray-400">绑定邮箱，账号更安全</span></template>
          </n-thing>
        </n-list-item>
        <!-- 手机号 -->
        <n-list-item v-if="state.ruleForm.phone">
          <template #suffix>
            <n-button type="primary" text>修改</n-button>
          </template>
          <n-thing title="手机号">
            <template #description><span class="text-gray-400">{{ state.ruleForm.phone }}</span></template>
          </n-thing>
        </n-list-item>
        <n-list-item v-else>
          <template #suffix>
            <n-button type="primary" text>点击绑定</n-button>
          </template>
          <n-thing title="绑定手机号">
            <template #description><span class="text-gray-400">绑定手机号，账号更安全</span></template>
          </n-thing>
        </n-list-item>
      </n-list>
    </n-grid-item>
  </n-grid>

  <UpdatePassword ref="updatePasswordRef" :title="state.editTitle" @handleQuery="getInfo">
  </UpdatePassword>
</template>
  
<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import { getUserInfo } from '@/api/user/index'
import UpdatePassword from './update_password.vue'

const message = useMessage()
const updatePasswordRef = ref<InstanceType<typeof UpdatePassword>>()
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

// 修改密码
const passwordUpdate = () => {
	state.editTitle = '修改密码'
	updatePasswordRef.value?.openModal({})
}

</script>
  