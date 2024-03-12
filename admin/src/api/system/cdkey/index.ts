import { http } from '@/utils/http/axios'

/**
 * 获取卡密列表
 * @param params
 */
export function getCdkeyList(params?) {
	return http.request({
		url: 'service/cdkey/auth/getCdkeyList',
		method: 'post',
		params
	})
}

/**
 * 添加卡密
 * @param params
 */
export function addCdkey(params?) {
	return http.request({
		url: 'service/cdkey/auth/addCdkey',
		method: 'post',
		params
	})
}

/**
 * 修改卡密
 * @param params
 */
export function updateCdkey(params?) {
	return http.request({
		url: 'service/cdkey/auth/updateCdkey',
		method: 'post',
		params
	})
}

/**
 * 删除卡密
 * @param params
 */
export function deleteCdkey(params?) {
	return http.request({
		url: 'service/cdkey/auth/deleteCdkey',
		method: 'post',
		params
	})
}

/**
 * 兑换卡密
 * @param params
 */
export function useCdkey(params?) {
	return http.request({
		url: 'service/cdkey/auth/useCdkey',
		method: 'post',
		params
	})
}
