import { PageEnum } from '@/enums/pageEnum'
import { storage } from '@/utils/Storage'
import router from '@/router'

export function checkStatus(status: number, msg: string): void {
	const $dialog = window['$dialog'];
  const $message = window['$message'];
	switch (status) {
    case 400:
      $message.error(msg)
      break
    case 401:
      $dialog.error({
        title: '提示',
        content: '用户没有权限',
        positiveText: '确定',
        //negativeText: '取消',
        closable: false,
        maskClosable: false,
        onPositiveClick: () => {
          backToIndex()
        },
        onNegativeClick: () => {},
      });
      break
    case 403:
      $message.error('用户得到授权，但是访问是被禁止的。!')
      router.replace(PageEnum.BASE_403)
      break
      // 404 请求不存在
    case 404:
      $message.error('网络请求错误，未找到该资源！')
      router.replace(PageEnum.BASE_404)
      break
    case 405:
      $message.error('网络请求错误，请求方法未允许！')
      break
    case 408:
      $message.error('网络请求超时')
      break
    case 500:
      $message.error('服务器错误，请联系管理员！')
      break
    case 501:
      $message.error('网络未实现')
      break
    case 502:
      $message.error('网络错误')
      break
    case 503:
      $dialog.error({
        title: '提示',
        content: '服务不可用，服务器暂时过载或维护！',
        positiveText: '确定',
        //negativeText: '取消',
        closable: false,
        maskClosable: false,
        onPositiveClick: () => {
          backToIndex()
        },
        onNegativeClick: () => {},
      });
      break
    case 504:
      $message.error('网络超时')
      break
    case 505:
      $message.error('http 版本不支持该请求！')
      break
    default:
      $message.error(msg)
	}
}

function backToIndex() { 
  const LoginName = PageEnum.BASE_LOGIN_NAME
  const LoginPath = PageEnum.BASE_LOGIN
  if (router.currentRoute.value?.name === LoginName) return
  storage.clear()
  window.location.href = LoginPath
}
