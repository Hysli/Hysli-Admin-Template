import { http } from '@/utils/http/axios'

/**
 * 获取支付配置列表
 * @param params
 */
export function getPayConfigList(params?) {
	return http.request({
		url: 'service/pay_config/auth/getPayConfigList',
		method: 'post',
		params
	})
}

/**
 * 添加支付配置
 * @param params
 */
export function addPayConfig(params?) {
	return http.request({
		url: 'service/pay_config/auth/addPayConfig',
		method: 'post',
		params
	})
}

/**
 * 修改支付配置
 * @param params
 */
export function updatePayConfig(params?) {
	return http.request({
		url: 'service/pay_config/auth/updatePayConfig',
		method: 'post',
		params
	})
}

/**
 * 删除支付配置
 * @param params
 */
export function deletePayConfig(params?) {
	return http.request({
		url: 'service/pay_config/auth/deletePayConfig"',
		method: 'post',
		params
	})
}

