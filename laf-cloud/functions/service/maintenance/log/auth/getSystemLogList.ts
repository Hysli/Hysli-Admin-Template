import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, log, mail, sms, pay, dao, db, nw, console } = _ctx
const _ = cloud.database().command

/**
 * 获取系统日志列表（带分页）
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body

  let whereJson = {}
  if (_data?.method) {
    whereJson['method'] = _.eq(_data.method)
  }
  if (_data?.rechargeRange && _data.rechargeRange.length > 0) {
    whereJson['create_time'] = _.gte(_data.rechargeRange[0]).lte(
      _data.rechargeRange[1]
    )
  }

  const list = await dao.consoleLogsDao.getConsoleLogsList(
    whereJson,
    _data?.page,
    _data?.pageSize
  )
  // 记录操作日志
  log(ctx, 'get')

  return common.returnSuccess('', list)
}
