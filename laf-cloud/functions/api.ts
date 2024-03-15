import { newFunctionContext } from '@/utils/type'
import console from '@/utils/console'

export default async function (ctx: newFunctionContext) {
  if (!ctx.headers['router']) {
    ctx.response.status(500)
    ctx.response.send('Error')
    return false
  }
  const router = '@/' + ctx.headers['router']
  try {
    const invoke = require(router).default
    return await invoke(ctx)
  } catch (e) {
    if (e.message.indexOf('not found') > -1) {
      ctx.response.status(404)
      ctx.response.send('Not Found')
      return false
    } else {
      console.log('云路由发生错误：', e)
      ctx.response.status(500)
      ctx.response.send('Error')
      return false
    }
  }
}
