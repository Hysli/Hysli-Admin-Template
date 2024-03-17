import nw from 'nw-lafjs'
/**
 * 操作日志
 * @param ctx 函数请求的上下文
 * @param type 日志类型
 * @returns
 * @description 记录操作日志
 */
export async function log(
  ctx: FunctionContext,
  type: 'update' | 'add' | 'delete' | 'get'
): Promise<void> {
  const ip = ctx.headers['remote-host']
    ? ctx.headers['remote-host']
    : ctx.headers['x-forwarded-for']
    ? ctx.headers['x-forwarded-for']
    : ctx.headers['x-real-ip']
    ? ctx.headers['x-real-ip']
    : ctx.headers['x-original-forwarded-for']
  await nw.db.add({
    dbName: 'operate_log',
    dataJson: {
      uid: ctx.user.uid || '',
      create_time: Date.now(),
      content: JSON.stringify(ctx.body) || '',
      type: type,
      path: ctx.headers['router'] || '',
      ip,
    },
  })
}
