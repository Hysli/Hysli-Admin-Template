import { http } from '@/utils/http/axios'

/**
 * 获取文章列表
 * @param params
 */
export function getArticleList(params?) {
	return http.request({
		url: 'service/content/article/auth/getArticleList',
		method: 'post',
		params
	})
}

/**
 * 增加文章
 * @param params
 */
export function addArticle(params?) {
  return http.request({
    url: 'service/content/article/auth/addArticle',
    method: 'post',
    params
  })
}

/**
 * 修改文章
 * @param params
 */
export function updateArticle(params?) {
	return http.request({
		url: 'service/content/article/auth/updateArticle',
		method: 'post',
		params
	})
}

/**
 * 删除文章
 * @param params
 */
export function deleteArticle(params?) {
	return http.request({
		url: 'service/content/article/auth/deleteArticle',
		method: 'post',
		params
	})
}
