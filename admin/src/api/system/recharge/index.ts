import { http } from '@/utils/http/axios'

/**
 * 获取充值模板列表
 * @param params
 */
export function getRechargeTemplateList(params?) {
	return http.request({
		url: 'service/recharge/auth/getRechargeTemplateList',
		method: 'post',
		params
	})
}

/**
 * 添加充值模板
 * @param params
 */
export function addRechargeTemplate(params?) {
	return http.request({
		url: 'service/recharge/auth/addRechargeTemplate',
		method: 'post',
		params
	})
}

/**
 * 修改充值模板
 * @param params
 */
export function updateRechargeTemplate(params?) {
	return http.request({
		url: 'service/recharge/auth/updateRechargeTemplate',
		method: 'post',
		params
	})
}

/**
 * 删除充值模板
 * @param params
 */
export function deleteRechargeTemplate(params?) {
	return http.request({
		url: 'service/recharge/auth/deleteRechargeTemplate',
		method: 'post',
		params
	})
}
