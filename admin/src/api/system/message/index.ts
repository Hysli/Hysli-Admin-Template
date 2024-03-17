import { http } from '@/utils/http/axios'

/**
 * 获取推送列表
 * @param params
 */
export function getList(params?) {
	return http.request({
		url: 'service/message/auth/getList',
		method: 'post',
		params
	})
}
