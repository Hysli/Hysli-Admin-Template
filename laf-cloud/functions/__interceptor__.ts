import cloud, { FunctionContext } from '@lafjs/cloud'
import middleware from '@/middleware'

export default async function (ctx: FunctionContext, next: Function) {
  try {
    const result = await middleware(ctx)
    if (result) {
      return await next(ctx)
    } else {
      return
    }
  } catch (e) {
    console.error('云函数执行错误', e)
    ctx.response.status(500)
    ctx.response.json({
      code: 500,
      error: 'Internal Server Error'
    })
  }
}
