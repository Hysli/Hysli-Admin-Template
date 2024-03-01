import { http } from '@/utils/http/axios'

/**
 * 获取角色列表
 * @param params
 */
export function getRoleList(params?) {
	return http.request({
		url: 'service/role/sys/getRoleList',
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
		url: 'service/role/sys/getRoleInfo',
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
		url: 'service/role/sys/addRole',
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
		url: 'service/role/sys/updateRole',
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
		url: 'service/role/sys/deleteRole',
		method: 'post',
		params
	})
}

/**
 * 角色接口权限设置
 * @param params
 */
export function apiPermissionSetting(params?) {
	return http.request({
		url: 'service/role/sys/apiPermissionSetting',
		method: 'post',
		params
	})
}

