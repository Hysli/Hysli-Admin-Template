import cloud, { FunctionContext } from '@lafjs/cloud'
import middleware from '@/middleware'
import { setCtx, _ctx } from '@/global'
import { utils } from '@/utils/index'
import nw from 'nw-lafjs'
import console from '@/utils/console'
const db = cloud.database()
import i18n from '@/utils/i18n'

let t

export default async function (ctx: FunctionContext, next: Function) {
  let lang = (ctx.headers['accept-language'] as string) || 'zh-Hans'
  if (!lang.startsWith('zh')) {
    lang = lang.substring(0, 2)
  } else {
    lang = 'zhCN'
  }
  setCtx(Object.assign(utils, { nw, db, console }))
  t = new i18n(lang).t
  try {
    const result = await middleware(ctx)
    if (result) {
      const res = await next(ctx)
      // 判断 res 类型并相应地转换为字符串
      console.log('接口返回值', res, '接口为：', ctx.__function_name)
      return res_i18n(res)
    } else {
      return
    }
  } catch (e) {
    console.error('云函数执行错误', e)
    ctx.response.status(500)
    ctx.response.json({
      code: 500,
      error: 'Internal Server Error',
    })
  }

  /**
   * 将返回值中的多语言转换为当前语言
   * @param res 需要转换多语言的返回值
   * @return 转换后的内容
   */
  function res_i18n(res: object | string) {
    let responseString
    let isJSON = false
    if (typeof res === 'object') {
      responseString = JSON.stringify(res)
      isJSON = true
    } else if (typeof res === 'string') {
      responseString = res
    } else {
      // 如果 res 既不是对象也不是字符串，则直接返回
      return res
    }
    // 替换操作
    responseString = responseString.replace(/t\('([^']+)'\)/g, (match, key) => {
      console.log(t(key))
      return t(key)
    })
    // 如果原始响应是 JSON 对象，则解析回 JSON
    if (isJSON) {
      return JSON.parse(responseString)
    } else {
      return responseString
    }
  }
}