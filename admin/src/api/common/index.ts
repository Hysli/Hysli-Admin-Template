import { http } from '@/utils/http/axios'

/**
 * 文件上传
 * @param params
 */
export function commonUploadFile(params?) {
	return http.request({
		url: 'service/common/auth/uploadFile',
		method: 'post',
		params
	})
}