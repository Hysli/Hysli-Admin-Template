import { http } from '@/utils/http/axios'

/**
 * 获取充值记录列表
 * @param params
 */
export function getRechargeRecordList(params?) {
	return http.request({
		url: 'service/recharge/auth/getRechargeRecordList',
		method: 'post',
		params
	})
}
