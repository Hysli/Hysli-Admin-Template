import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, log, mail, sms, pay, dao, db, nw, console } = _ctx

/**
 * 根据主键id获取角色信息
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body

  if (!_data?._id) {
    return common.returnFail('Error: _id is empty')
  }
  const result = await dao.roleManageDao.getInfoById(_data._id)
  return common.returnSuccess('', result)
}
