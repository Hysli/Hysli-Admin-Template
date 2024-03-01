import { http } from '@/utils/http/axios'

/**
 * 获取用户列表
 * @param params
 */
export function getUserList(params?) {
	return http.request({
		url: 'service/user/sys/getUserList',
		method: 'post',
		params
	})
}

/**
 * 增加用户
 * @param params
 */
export function addUser(params?) {
  return http.request({
    url: 'service/user/sys/addUser',
    method: 'post',
    params
  })
}

/**
 * 修改用户
 * @param params
 */
export function updateUser(params?) {
	return http.request({
		url: 'service/user/sys/updateUser',
		method: 'post',
		params
	})
}

/**
 * 删除用户
 * @param params
 */
export function deleteUser(params?) {
	return http.request({
		url: 'service/user/sys/deleteUser',
		method: 'post',
		params
	})
}
