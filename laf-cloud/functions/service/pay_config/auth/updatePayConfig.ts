import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, t, log, mail, sms, pay, dao, db, nw, console } = _ctx

/**
 * 修改支付配置
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body
  if (ctx.user.roles.indexOf('demo') > -1) {
    return common.returnFail(t('operate.noPermission'))
  }

  // 如果 data 中没有 app_id 或 type，返回错误
  if (!_data?.app_id || !_data?.type || !_data?._id) {
    return common.returnFail('Error: _id or app_id or type is empty')
  }

  // 校验支付配置是否存在
  const payConfigData = await dao.payConfigDao.getInfoById(_data._id)
  if (!payConfigData) {
    return common.returnFail(t('data.notExist'))
  }

  try {
    _data.update_time = Date.now()
    const result = await dao.payConfigDao.updatePayConfig(_data)
    if (result && result > 0) {
      return common.returnAndPopup(t('update.success'))
    } else {
      return common.returnFail(t('update.failed'))
    }
  } catch (e) {
    //TODO handle the exception
    console.log('updatePayConfig Error:: ', e.message)
    return common.returnFail(t('update.failed'))
  }
}
