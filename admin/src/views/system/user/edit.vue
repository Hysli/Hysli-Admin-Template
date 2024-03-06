<template>
  <n-modal v-model:show="state.showModal" :show-icon="false" preset="dialog">
    <template #header>
      <div>{{ props.title }}</div>
    </template>

    <n-form :model="state.ruleForm" ref="ruleFormRef" label-placement="left" require-mark-placement="left"
      :label-width="80" class="py-4">
      <n-form-item label="用户名" path="username" :rule="[{ required: true, message: '用户名不能为空', trigger: 'blur' }]">
        <n-input placeholder="请输入用户名" v-model:value="state.ruleForm.username" clearable />
      </n-form-item>
      <n-form-item label="邮箱" path="email"
        :rule="[{ required: !state.enableUserName, message: '邮箱不能为空', trigger: 'blur' }]">
        <n-input placeholder="请输入邮箱" v-model:value="state.ruleForm.email" clearable />
      </n-form-item>
      <n-form-item label="手机号" path="phone"
        :rule="[{ required: !state.enableUserName, message: '手机号不能为空', trigger: 'blur' }]">
        <n-input placeholder="请输入手机号" v-model:value="state.ruleForm.phone" clearable />
      </n-form-item>
      <n-form-item v-if="!state.ruleForm._id" label="密码" path="password"
        :rule="[{ required: true, message: '密码不能为空', trigger: 'blur' }]">
        <div style="width: 100%;">
          <n-input type="password" show-password-on="click" placeholder="请输入密码"
            v-model:value="state.ruleForm.password" />
          <div class="tips">密码规则：6-20 位，数字、常见符号和大小写英文字母</div>
        </div>
      </n-form-item>
      <n-form-item v-else label="密码" path="password">
        <n-input type="password" show-password-on="click" placeholder="密码为空表示不修改"
          v-model:value="state.ruleForm.password" />
      </n-form-item>
      <n-form-item label="角色" path="roles">
        <n-select placeholder="请选择角色" multiple :options="state.roleData" :default-value="state.ruleForm.roles"
          :on-update:value="changeRole" value-field="code" label-field="name" max-tag-count="responsive" clearable />
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
import { getRoleList } from '@/api/system/role'
import { addUser, updateUser } from '@/api/system/user'

import { useGlobSetting } from '@/hooks/setting'
const globSetting = useGlobSetting()

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
  roleData: [] as any,
  enableUserName: null
})

onMounted(() => {
  state.enableUserName = globSetting.enableUserName == 'true'
  getRoleData()
})

// 获取菜单列表
const getRoleData = async () => {
  const params = {
    page: 1,
    pageSize: 100
  }
  const result = await getRoleList(params)
  // console.log(result)
  state.roleData = result?.data?.rows ?? []
}

// 打开弹窗
const openModal = (record: any) => {
  // console.log('打开弹窗', record)
  if (Object.keys(record).length > 0) {
    state.ruleForm = JSON.parse(JSON.stringify(record))
  }
  else {
    state.ruleForm = {
      username: '',
      email: '',
      phone: '',
      password: '',
      roles: [],
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

const changeRole = (value) => {
  state.ruleForm.roles = value
}

// 确认
const confirmForm = () => {
  state.btnLoading = true
  ruleFormRef.value.validate(async (errors) => {
    if (!errors) {
      try {
        if (state.ruleForm._id) {
          const params = state.ruleForm
          await updateUser(params)
          closModal()
        } else {
          const params = state.ruleForm
          await addUser(params)
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

<style lang="less" scoped>
.tips {
  font-size: 12px;
  color: red;
  margin-top: 5px;
}
</style>
