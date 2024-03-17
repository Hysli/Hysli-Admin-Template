import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, log, mail, sms, pay, dao, db, nw, console } = _ctx
const _ = cloud.database().command

/**
 * 获取操作日志列表（带分页）
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body

  // 校验用户是否存在
  let userData = await dao.userDao.getInfoById(ctx.user.uid)
  if (!userData) {
    return common.returnFail("t('data.notExist')")
  }

  let whereJson = {}
  // 校验当前登录用户是否普通用户
  if (userData.roles.indexOf('admin') < 0) {
    whereJson = {
      uid: ctx.user.uid,
    }
  }
  if (_data?.type) {
    whereJson['type'] = _.eq(_data.type)
  }
  if (_data?.rechargeRange && _data.rechargeRange.length > 0) {
    whereJson['create_time'] = _.gte(_data.rechargeRange[0]).lte(
      _data.rechargeRange[1]
    )
  }

  const list = await dao.operateLogDao.getOperateLogList(
    whereJson,
    _data?.page,
    _data?.pageSize
  )
  // 记录操作日志
  log(ctx, 'get')

  return common.returnSuccess('', list)
}
