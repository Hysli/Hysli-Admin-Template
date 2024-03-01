import { http } from '@/utils/http/axios'

// 发送验证码
export function sendCode(params) {
  return http.request({
    url: 'service/user/pub/register',
    method: 'post',
    params
  })
}

// 用户注册
export function register(params) {
  return http.request({
    url: 'service/user/pub/register',
    method: 'post',
    params
  })
}
