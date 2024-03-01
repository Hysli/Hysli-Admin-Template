import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, t, log, mail, sms, pay, dao, db, nw } = _ctx
const _ = cloud.database().command

/**
 * 获取用户列表（带分页）
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body

  let whereJson = {}
  let statusStr = { status: _.neq(9) }
  if (_data?.status) {
    statusStr = { status: _.eq(_data.status) }
  }
  if (_data?.emailOrPhone) {
    const regExp = new RegExp(_data.emailOrPhone)
    whereJson = _.and([statusStr, _.or([{ email: regExp }, { phone: regExp }])])
  } else {
    whereJson = statusStr
  }

  const list = await dao.userDao.getUserList(whereJson, _data?.page, _data?.pageSize)
  return common.returnSuccess('', list)
}
