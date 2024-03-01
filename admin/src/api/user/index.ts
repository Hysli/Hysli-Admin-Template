import { http } from '@/utils/http/axios'

// 获取用户信息
export function getUserInfo(params) {
	return http.request({
		url: 'service/user/auth/getUserInfo',
		method: 'post',
		params
	})
}

/**
 * @description: 根据用户id获取用户菜单
 */
export function getUserMenu(params) {
	return http.request({
		url: 'service/user/auth/getUserMenu',
		method: 'post',
		params
	})
}
