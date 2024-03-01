import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, t, log, mail, sms, pay, dao, db, nw } = _ctx

export default async function (ctx: FunctionContext) {
  const _data = ctx.body

  if (!_data?._id) {
    return common.returnFail('Error: _id is empty')
  }

  const result = await dao.userDao.deleteUserById(_data?._id)
  if (result && result > 0) {
    return common.returnAndPopup(t('delete.success'))
  }
  return common.returnFail(t('delete.failed'))
}
