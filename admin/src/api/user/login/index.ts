import { http } from '@/utils/http/axios'

// 用户登录
export function login(params) {
  return http.request({
    url: 'service/user/pub/login',
    method: 'post',
    params
  })
}
