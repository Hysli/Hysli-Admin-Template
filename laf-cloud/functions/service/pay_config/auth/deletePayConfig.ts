import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, log, mail, sms, pay, dao, db, nw, console } = _ctx

/**
 * 删除支付配置
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body
  if (ctx.user.roles.indexOf('demo') > -1) {
    return common.returnFail("t('operate.noPermission')")
  }

  if (!_data?._id) {
    return common.returnFail('Error: _id is empty')
  }

  // 校验支付配置是否存在
  const payConfigData = await dao.payConfigDao.getInfoById(_data?._id)
  if (!payConfigData) {
    return common.returnFail("t('data.notExist')")
  }

  try {
    const result = await dao.payConfigDao.deletePayConfigById(payConfigData._id)
    if (result && result > 0) {
      // 记录操作日志
      log(ctx, 'delete')

      return common.returnAndPopup("t('delete.success')")
    }
    return common.returnFail("t('delete.failed')")
  } catch (e) {
    //TODO handle the exception
    console.error('deletePayConfigById Error:: ', e.message)
    return common.returnFail("t('delete.failed')")
  }
}
