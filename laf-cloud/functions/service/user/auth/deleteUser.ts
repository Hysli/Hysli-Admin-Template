import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, log, mail, sms, pay, dao, db, nw, console } = _ctx

export default async function (ctx: FunctionContext) {
  const _data = ctx.body
  if (ctx.user.roles.indexOf('demo') > -1) {
    return common.returnFail("t('operate.noPermission')")
  }

  if (!_data?._id) {
    return common.returnFail('Error: _id is empty')
  }

  try {
    const result = await dao.userDao.deleteUserById(_data?._id)
    if (result && result > 0) {
      // 记录操作日志
      log(ctx, 'delete')

      return common.returnAndPopup("t('delete.success')")
    }
    return common.returnFail("t('delete.failed')")
  } catch (e) {
    //TODO handle the exception
    console.error('deleteUserById Error:: ', e.message)
    return common.returnFail("t('delete.failed')")
  }
}
