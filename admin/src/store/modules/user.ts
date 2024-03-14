import { defineStore } from 'pinia'
import { store } from '@/store'
import { ACCESS_TOKEN, CURRENT_USER, IS_SCREENLOCKED, TABS_ROUTES } from '@/store/mutation-types'

import { login } from '@/api/user/login/index'
import { getUserInfo } from '@/api/user/index'
import { storage } from '@/utils/Storage'

export type UserInfoType = {
  // TODO: add your own data
  username: string
  email: string
  phone: string,
  nickname: string,
  avatar: string
}

export interface IUserState {
  token: string
  username: string
  welcome: string
  avatar: string
  permissions: any[]
  info: UserInfoType
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): IUserState => ({
    token: storage.get(ACCESS_TOKEN, ''),
    username: '',
    welcome: '',
    avatar: '',
    permissions: [],
    info: storage.get(CURRENT_USER, {})
  }),
  getters: {
    getToken(): string {
      return this.token
    },
    getAvatar(): string {
      return this.avatar
    },
    getNickname(): string {
      return this.username
    },
    getPermissions(): [any][] {
      return this.permissions
    },
    getUserInfo(): UserInfoType {
      return this.info
    }
  },
  actions: {
    setToken(token: string) {
      this.token = token
    },
    setAvatar(avatar: string) {
      this.avatar = avatar
    },
    setPermissions(permissions) {
      this.permissions = permissions
    },
    setUserInfo(info: UserInfoType) {
      this.info = info
    },
    // 登录
    async login(params: any) {
      const response = await login(params)
      const { data } = response

      const ex = 7 * 24 * 60 * 60
      storage.set(ACCESS_TOKEN, data.access_token, ex)
      storage.set(CURRENT_USER, data, ex)
      storage.set(IS_SCREENLOCKED, false)
      this.setToken(data.access_token)
      this.setUserInfo(data)
      return response
    },

    // 获取用户信息
    async getInfo() {
      const { data } = await getUserInfo({
        _type: 'getUserInfo'
      })

      if (data.permissions && data.permissions.length > 0) {
        const permissionsList = data.permissions
        this.setPermissions(permissionsList)
      }
      // else {
      //   throw new Error('getInfo: permissionsList must be a non-null array !')
      // }
      this.setUserInfo(data)
      this.setAvatar(data.avatar)
      return data
    },

    // 登出
    async logout() {
      this.setPermissions([])
      this.setUserInfo({ username: '', email: '', phone: '', nickname: '', avatar: '' })
      storage.remove(ACCESS_TOKEN)
      storage.remove(CURRENT_USER)
      storage.remove(TABS_ROUTES)
    }
  }
})

// Need to be used outside the setup
export function useUser() {
  return useUserStore(store)
}
