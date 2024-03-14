import cloud from '@lafjs/cloud'
import { newFunctionContext } from '@/utils/type'
import { setCtx } from '@/global'
import { utils } from '@/utils/index'
import nw from 'nw-lafjs'
import console from '@/utils/console'
const db = cloud.database()

export default async function (ctx: newFunctionContext) {
  let lang = (ctx.headers['accept-language'] as string) || 'zh-Hans'
  if (!lang.startsWith('zh')) {
    lang = lang.substring(0, 2)
  } else {
    lang = 'zhCN'
  }
  const t = new utils.i18n(lang).t
  utils.t = t
  setCtx(Object.assign(ctx, utils, { nw, db, console }))
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
