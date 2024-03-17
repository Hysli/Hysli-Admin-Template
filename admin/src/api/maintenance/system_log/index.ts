import { http } from '@/utils/http/axios'

/**
 * 获取系统日志列表
 * @param params
 */
export function getSystemLogList(params?) {
	return http.request({
		url: 'service/maintenance/log/auth/getSystemLogList',
		method: 'post',
		params
	})
}
