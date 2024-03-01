import { http } from '@/utils/http/axios'

/**
 * 修改密码
 * @param params
 */
export function updatePassword(params?) {
	return http.request({
		url: 'service/user/auth/updatePassword',
		method: 'post',
		params
	})
}
