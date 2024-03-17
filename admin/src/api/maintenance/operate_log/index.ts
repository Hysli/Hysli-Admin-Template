import { http } from '@/utils/http/axios'

/**
 * 获取操作日志列表
 * @param params
 */
export function getOperateLogList(params?) {
	return http.request({
		url: 'service/maintenance/log/auth/getOperateLogList',
		method: 'post',
		params
	})
}
