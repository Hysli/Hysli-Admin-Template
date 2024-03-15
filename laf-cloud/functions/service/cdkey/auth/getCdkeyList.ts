import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, log, mail, sms, pay, dao, db, nw, console } = _ctx
const _ = cloud.database().command

/**
 * 获取卡密列表（带分页）
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body

  let whereJson = { status: _.neq(9) }
  if (_data?.status) {
    whereJson = { status: _.eq(_data.status) }
  }
  if (_data?.secret_key) {
    whereJson['secret_key'] = { $regex: _data.secret_key }
  }

  const list = await dao.cdkeyManageDao.getCdkeyList(
    whereJson,
    _data?.page,
    _data?.pageSize
  )
  return common.returnSuccess('', list)
}
