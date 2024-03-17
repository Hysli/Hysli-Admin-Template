import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, log, mail, sms, pay, dao, db, nw, console } = _ctx
const _ = cloud.database().command

/**
 * 获取充值模板列表（带分页）
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body

  let whereJson = { status: _.neq(9) }
  if (_data?.status) {
    whereJson = { status: _.eq(_data.status) }
  }
  if (_data?.title) {
    whereJson['title'] = { $regex: _data.title }
  }

  const list = await dao.rechargeDao.getRechargeTemplateList(
    whereJson,
    _data?.page,
    _data?.pageSize
  )
  // 记录操作日志
  log(ctx, 'get')

  return common.returnSuccess('', list)
}
