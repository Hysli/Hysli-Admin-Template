import { http } from '@/utils/http/axios'

/**
 * 获取文章分类列表
 * @param params
 */
export function getArticleCategoryList(params?) {
	return http.request({
		url: 'service/content/article_category/auth/getArticleCategoryList',
		method: 'post',
		params
	})
}

/**
 * 增加文章分类
 * @param params
 */
export function addArticleCategory(params?) {
  return http.request({
    url: 'service/content/article_category/auth/addArticleCategory',
    method: 'post',
    params
  })
}

/**
 * 修改文章分类
 * @param params
 */
export function updateArticleCategory(params?) {
	return http.request({
		url: 'service/content/article_category/auth/updateArticleCategory',
		method: 'post',
		params
	})
}

/**
 * 删除文章分类
 * @param params
 */
export function deleteArticleCategory(params?) {
	return http.request({
		url: 'service/content/article_category/auth/deleteArticleCategory',
		method: 'post',
		params
	})
}
