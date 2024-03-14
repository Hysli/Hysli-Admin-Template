<template>
  <n-grid cols="2 s:2 m:2 l:2 xl:2 2xl:2" responsive="screen">
    <n-grid-item>
      <n-spin :show="state.uploading">
        <template #description> 头像上传中... </template>
        <n-form :label-width="80" :model="state.ruleForm" ref="ruleFormRef" label-placement="left"
          require-mark-placement="left">
          <n-form-item label="头像">
            <n-upload accept="image/png,image/jpeg" :file-list="state.avatarList" :max="1" :on-remove="removePicture"
              :on-change="uploadPicture" list-type="image-card"></n-upload>
          </n-form-item>
          <n-form-item label="用户名" path="username" :rule="[{ required: true, message: '用户名不能为空', trigger: 'blur' }]">
            <n-input placeholder="请输入用户名" v-model:value="state.ruleForm.username" clearable />
          </n-form-item>
          <n-form-item label="昵称" path="nickname">
            <n-input placeholder="请输入昵称" v-model:value="state.ruleForm.nickname" clearable />
          </n-form-item>
          <n-form-item label="手机号" path="phone"
            :rule="[{ required: !state.enableUserName, message: '手机号不能为空', trigger: 'blur' }]">
            <n-input placeholder="请输入手机号" v-model:value="state.ruleForm.phone" clearable />
          </n-form-item>
          <n-form-item label="邮箱" path="email"
            :rule="[{ required: !state.enableUserName, message: '邮箱不能为空', trigger: 'blur' }]">
            <n-input placeholder="请输入邮箱" v-model:value="state.ruleForm.email" clearable />
          </n-form-item>
          <n-form-item label="账号余额">
            <n-gradient-text type="info" :size="16">{{ state.ruleForm.balance ?? 0 }} 元</n-gradient-text>
          </n-form-item>
          <n-form-item label="可用点数">
            <n-space>
              <n-gradient-text type="info" :size="16">{{ state.ruleForm.points ?? 0 }} 点</n-gradient-text>
              <n-button size="small" type="primary" @click="handleRecharge">
                充值
              </n-button>
            </n-space>
          </n-form-item>
          <n-form-item label="赠送点数">
            <n-space>
              <n-gradient-text type="info" :size="16">{{ state.ruleForm.gift_points ?? 0 }} 点</n-gradient-text>
              <n-button size="small" type="primary" @click="handleExchange">
                卡密兑换
              </n-button>
            </n-space>
          </n-form-item>
          <n-form-item label=" ">
            <n-button type="primary" :loading="state.btnLoading" @click="formSubmit">更新基本信息</n-button>
          </n-form-item>
        </n-form>
      </n-spin>
    </n-grid-item>
  </n-grid>

  <!-- 充值 -->
  <Recharge ref="rechargeRef" :title="state.editTitle" @handleQuery="getInfo"></Recharge>

  <!-- 卡密兑换 -->
  <CdkeyExchange ref="cdkeyExchangeRef" :title="state.editTitle" @handleQuery="getInfo"></CdkeyExchange>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { getUserInfo } from '@/api/user/index'
import { commonUploadFile } from '@/api/common/index'
import { updateUser } from '@/api/system/user'
import Recharge from './recharge.vue'
import CdkeyExchange from './cdkey_exchange.vue'

import { useGlobSetting } from '@/hooks/setting'
const globSetting = useGlobSetting()

const ruleFormRef = ref()
const rechargeRef = ref()
const cdkeyExchangeRef = ref()
// 定义全局变量
const state = reactive({
  showModal: false,
  btnLoading: false,
  ruleForm: {} as any,
  enableUserName: null,
  avatarList: [] as any,
  uploading: false,
  editTitle: ''
})

onMounted(() => {
  state.enableUserName = globSetting.enableUserName == 'true'
  getInfo()
})

// 获取用户信息
const getInfo = async () => {
  const result = await getUserInfo({
    _type: 'getUserInfo'
  })
  // console.log(result)
  state.ruleForm = result.data
  if (state.ruleForm.avatar) {
    state.avatarList = [
      {
        id: state.ruleForm._id,
        name: '',
        status: 'finished',
        url: state.ruleForm.avatar
      }
    ]
  }
}

// 图片上传
const uploadPicture = async (file: any) => {
  // console.log('上传文件', file)
  if (file.fileList && file.fileList.length > 0) {
    state.uploading = true

    const params = {
      file: file.fileList[0].file
    }
    const result = await commonUploadFile(params)
    // console.log(result)
    state.ruleForm.avatar = result.data?.fileUrl
    state.avatarList = [{
      id: state.ruleForm._id,
      name: '',
      status: 'finished',
      url: state.ruleForm.avatar
    }]

    state.uploading = false
  } else {
    state.ruleForm.avatar = ''
    state.avatarList = []
  }
}

// 图片删除
const removePicture = (options: any) => {
  // console.log('删除文件', options)
  state.avatarList = []
}

const formSubmit = () => {
  state.btnLoading = true
  ruleFormRef.value.validate(async (errors) => {
    if (!errors) {
      try {
        if (state.ruleForm._id) {
          const params = state.ruleForm
          await updateUser(params)
          getInfo()
        }
      } catch (e) { }
    }
    state.btnLoading = false
  })
}

const handleRecharge = () => {
  state.editTitle = '充值'
  rechargeRef.value?.openModal({})
}

const handleExchange = () => {
  state.editTitle = '卡密兑换'
  cdkeyExchangeRef.value?.openModal({})
}
</script>

<style lang="less" scoped>
.tips {
  font-size: 12px;
  color: red;
  margin-top: 5px;
}

:deep(.n-upload-trigger) {
  width: 100px !important;
  height: 100px !important;
}

:deep(.n-upload-file) {
  width: 100px !important;
  height: 100px !important;
}

:deep(.n-upload-file-info__thumbnail img) {
  object-fit: cover !important;
}
</style>
