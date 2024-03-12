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
 * 添加充值订单
 * @param params
 */
export function addRechargeOrder(params?) {
	return http.request({
		url: 'service/recharge/auth/addRechargeOrder',
		method: 'post',
		params
	})
}

/**
 * 获取充值订单信息
 * @param params
 */
export function getRechargeOrderInfo(params?) {
	return http.request({
		url: 'service/recharge/auth/getRechargeOrderInfo',
		method: 'post',
		params
	})
}
