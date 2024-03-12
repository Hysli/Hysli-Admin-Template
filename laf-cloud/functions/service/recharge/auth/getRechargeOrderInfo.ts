import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, t, log, mail, sms, pay, dao, db, nw } = _ctx

/**
 * 根据主键id获取充值订单信息
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body
  if (ctx.user.roles.indexOf('demo') > -1) {
    return common.returnFail(t('operate.noPermission'))
  }

  if (!_data?._id) {
    return common.returnFail('Error: _id is empty')
  }

  // 校验订单是否存在
  const rechargeOrderData = await dao.rechargeOrderDao.getInfoById(_data._id)
  if (!rechargeOrderData) {
    return common.returnFail(t('data.notExist'))
  }

  if (rechargeOrderData.pay_status == 'success') {
    return common.returnAndPopup(t('pay.success'))
  }
  return common.returnSuccess('')
}
