<template>
  <div class="view-account">
    <div class="view-account-header"></div>
    <div class="view-account-container">
      <div class="view-account-top">
        <div class="view-account-top-logo flex justify-center items-center mb-4">
          <img class="w-64" :src="websiteConfig.loginImage" alt="" />
        </div>
        <div class="view-account-top-desc">{{ websiteConfig.loginDesc }}</div>
      </div>
      <n-tabs class="card-tabs" v-if="userForm.loginType != 'username'" v-model:value="userForm.loginType" size="large"
        animated pane-wrapper-style="margin: 0 -4px"
        pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;" @update:value="changeTabs">
        <n-tab-pane name="phone" tab="手机号登录"></n-tab-pane>
        <n-tab-pane name="email" tab="邮箱登录"></n-tab-pane>
      </n-tabs>
      <div class="view-account-form">
        <n-form ref="formRef" label-placement="left" size="large" :model="userForm">
          <n-form-item path="username" v-if="userForm.loginType == 'username'" :rule="[
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ]">
            <n-input v-model:value="userForm.username" placeholder="请输入用户名">
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <PersonOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path="phone" v-if="userForm.loginType == 'phone'" :rule="[
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { pattern: ruleValid.phone, message: '手机号格式错误', trigger: 'blur' }
          ]">
            <n-input v-model:value="userForm.phone" placeholder="请输入手机号">

              <template #prefix>
                <n-icon size="18" color="#808695">
                  <MobileOutlined />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path="email" v-if="userForm.loginType == 'email'" :rule="[
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { pattern: ruleValid.email, message: '邮箱格式错误', trigger: 'blur' }
          ]">
            <n-input v-model:value="userForm.email" placeholder="请输入邮箱">

              <template #prefix>
                <n-icon size="18" color="#808695">
                  <EmailOutlined />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path="password" :rule="[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 20, message: '密码长度需6-20位', trigger: 'blur' }
          ]">
            <n-input v-model:value="userForm.password" type="password" showPasswordOn="click" placeholder="请输入密码">

              <template #prefix>
                <n-icon size="18" color="#808695">
                  <LockClosedOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <!-- <n-form-item class="default-color">
            <div class="flex justify-between">
              <div class="flex-initial order-last">
                <a href="javascript:">忘记密码</a>
              </div>
            </div>
          </n-form-item> -->
          <n-form-item>
            <n-button type="primary" @click="handleSubmit" size="large" :loading="loading" block>
              登录
            </n-button>
          </n-form-item>
          <n-form-item class="default-color">
            <div class="flex view-account-other">
              <div class="flex-initial" v-show="false">
                <span>其它登录方式</span>
              </div>
              <div class="flex-initial mx-2" v-show="false">
                <a href="javascript:">
                  <n-icon size="24" color="#2d8cf0">
                    <LogoGithub />
                  </n-icon>
                </a>
              </div>
              <div class="flex-initial" style="margin-left: auto">
                <a href="/register">注册账号</a>
              </div>
            </div>
          </n-form-item>
        </n-form>
      </div>
      <div class="view-account-bottom">
        <p> 注册登录即表示同意 <a href="javascript:" alt="" target="_blank">服务协议</a>、 <a href="javascript:" alt=""
            target="_blank">隐私协议</a>和 <a href="javascript:" alt="" target="_blank">免责协议</a></p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { useMessage } from 'naive-ui'
import { PersonOutline, LockClosedOutline, LogoGithub } from '@vicons/ionicons5'
import { MobileOutlined } from '@vicons/antd'
import { EmailOutlined } from '@vicons/material'
import { PageEnum } from '@/enums/pageEnum'
import { websiteConfig } from '@/config/website.config'

import { useGlobSetting } from '@/hooks/setting'
const globSetting = useGlobSetting()

const formRef = ref()
const message = useMessage()
const loading = ref(false)
const LOGIN_NAME = PageEnum.BASE_LOGIN_NAME

const ruleValid = reactive({
  phone: /^(^1[3-9]\d{9}$|^\d{3}-\d{8}$|^\d{4}-\d{7}$)+/,
  email: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
})
const userForm = reactive({
  username: '',
  phone: '',
  email: '',
  password: '',
  loginType: ''
})

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

onMounted(() => {
  userForm.loginType = globSetting.enableUserName == 'true' ? 'username' : 'phone'
  // console.log(globSetting.enableUserName, userForm.loginType)
})

const handleSubmit = (e) => {
  e.preventDefault()
  formRef.value.validate(async (valid) => {
    if (valid) return

    message.loading('登录中...')
    loading.value = true
    try {
      const params = {
        '_type': userForm.loginType,
        '_data': userForm
      }
      await userStore.login(params)
      message.destroyAll()

      // 跳转首页
      const toPath = decodeURIComponent((route.query?.redirect || '/') as string)
      if (route.name === LOGIN_NAME) {
        router.replace('/')
      } else {
        router.replace(toPath)
      }
    }
    catch (e) { }
    finally {
      loading.value = false
    }
  })
}

const changeTabs = (e) => {
  userForm.phone = ''
  userForm.email = ''
  userForm.password = ''
}
</script>

<style lang="less" scoped>
.view-account {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;

  &-container {
    flex: 1;
    padding: 32px 12px;
    max-width: 384px;
    min-width: 320px;
    margin: 0 auto;
  }

  &-top {
    padding: 32px 0;
    text-align: center;

    &-desc {
      font-size: 14px;
      color: #808695;
    }
  }

  &-other {
    width: 100%;
  }

  .default-color {
    color: #515a6e;

    .ant-checkbox-wrapper {
      color: #515a6e;
    }
  }
}

@media (min-width: 768px) {
  .view-account {
    background-image: url('../../assets/images/login.svg');
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: 100%;
  }

  .page-account-container {
    padding: 32px 0 24px 0;
  }
}

a {
  color: #398ade;
  background: transparent;
  text-decoration: none;
  outline: none;
  cursor: pointer;
  transition: color .2s ease;
}

a:hover {
  color: #3c9cff;
}
</style>
