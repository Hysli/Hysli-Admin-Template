import { http } from '@/utils/http/axios'

/**
 * 获取系统参数列表
 * @param params
 */
export function getParameterList(params?) {
	return http.request({
		url: 'service/parameter/auth/getParameterList',
		method: 'post',
		params
	})
}

/**
 * 添加系统参数
 * @param params
 */
export function addParameter(params?) {
	return http.request({
		url: 'service/parameter/auth/addParameter',
		method: 'post',
		params
	})
}

/**
 * 修改系统参数
 * @param params
 */
export function updateParameter(params?) {
	return http.request({
		url: 'service/parameter/auth/updateParameter',
		method: 'post',
		params
	})
}

/**
 * 删除系统参数
 * @param params
 */
export function deleteParameter(params?) {
	return http.request({
		url: 'service/parameter/auth/deleteParameter',
		method: 'post',
		params
	})
}
