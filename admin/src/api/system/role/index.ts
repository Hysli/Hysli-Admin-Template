import { http } from '@/utils/http/axios'

/**
 * 获取角色列表
 * @param params
 */
export function getRoleList(params?) {
	return http.request({
		url: 'service/role/auth/getRoleList',
		method: 'post',
		params
	})
}

/**
 * 根据主键id获取角色信息
 * @param params
 */
export function getRoleInfo(params?) {
	return http.request({
		url: 'service/role/auth/getRoleInfo',
		method: 'post',
		params
	})
}

/**
 * 添加角色
 * @param params
 */
export function addRole(params?) {
	return http.request({
		url: 'service/role/auth/addRole',
		method: 'post',
		params
	})
}

/**
 * 修改角色
 * @param params
 */
export function updateRole(params?) {
	return http.request({
		url: 'service/role/auth/updateRole',
		method: 'post',
		params
	})
}

/**
 * 删除角色
 * @param params
 */
export function deleteRole(params?) {
	return http.request({
		url: 'service/role/auth/deleteRole',
		method: 'post',
		params
	})
}

