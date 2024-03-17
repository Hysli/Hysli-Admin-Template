import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, log, mail, sms, pay, dao, db, nw, console } = _ctx
const _ = cloud.database().command

/**
 * 获取用户列表（带分页）
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body
  console.log('user', ctx.user)

  let whereJson = {}
  let statusStr = {
    status: _.neq(9),
    is_super_admin: _.neq(true),
    _id: _.neq(ctx.user.uid),
  }
  if (_data?.status) {
    statusStr['status'] = _.eq(_data.status)
  }
  if (_data?.emailOrPhone) {
    const regExp = new RegExp(_data.emailOrPhone)
    whereJson = _.and([statusStr, _.or([{ email: regExp }, { phone: regExp }])])
  } else {
    whereJson = statusStr
  }

  const list = await dao.userDao.getUserList(
    whereJson,
    _data?.page,
    _data?.pageSize
  )
  // 记录操作日志
  log(ctx, 'get')

  return common.returnSuccess('', list)
}
