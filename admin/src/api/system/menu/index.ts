import { http } from '@/utils/http/axios'

/**
 * 获取菜单列表
 * @param params
 */
export function getMenuList(params?) {
	return http.request({
		url: 'service/menu/sys/getMenuList',
		method: 'post',
		params
	})
}

/**
 * 添加菜单
 * @param params
 */
export function addMenu(params?) {
	return http.request({
		url: 'service/menu/sys/addMenu',
		method: 'post',
		params
	})
}

/**
 * 修改菜单
 * @param params
 */
export function updateMenu(params?) {
	return http.request({
		url: 'service/menu/sys/updateMenu',
		method: 'post',
		params
	})
}

/**
 * 删除菜单
 * @param params
 */
export function deleteMenu(params?) {
	return http.request({
		url: 'service/menu/sys/deleteMenu',
		method: 'post',
		params
	})
}
