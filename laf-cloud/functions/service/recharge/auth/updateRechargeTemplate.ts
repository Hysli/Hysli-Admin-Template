import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, t, log, mail, sms, pay, dao, db, nw, console } = _ctx

/**
 * 修改充值模板
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body
  if (ctx.user.roles.indexOf('demo') > -1) {
    return common.returnFail(t('operate.noPermission'))
  }

  // 如果 data 中没有 title 或者 _id，返回错误
  if (
    !_data?._id ||
    !_data?.title ||
    _data?.recharge_points == null ||
    _data?.recharge_points == undefined ||
    _data?.gift_points == null ||
    _data?.gift_points == undefined ||
    _data?.sales_price == null ||
    _data?.sales_price == undefined
  ) {
    return common.returnFail(
      'Error: _id or title or recharge_points or gift_points or sales_price is empty'
    )
  }

  // 校验充值模板是否存在
  const rechargeTemplateData = await dao.rechargeDao.getInfoById(_data._id)
  if (!rechargeTemplateData) {
    return common.returnFail(t('data.notExist'))
  }
  // 校验模板标题是否存在
  const isExist = await dao.rechargeDao.isExistByTemplateTitle(
    _data.title,
    _data._id
  )
  if (isExist) {
    return common.returnFail(t('rechargeTemplate.titleExist'))
  }

  try {
    _data.recharge_points = _data?.recharge_points ?? 0
    _data.gift_points = _data?.gift_points ?? 0
    _data.sales_price = _data?.sales_price ? Number(_data.sales_price * 100) : 0
    _data.update_time = Date.now()
    const result = await dao.rechargeDao.updateRechargeTemplate(_data)
    if (result && result > 0) {
      return common.returnAndPopup(t('update.success'))
    } else {
      return common.returnFail(t('update.failed'))
    }
  } catch (e) {
    //TODO handle the exception
    console.log('updateRechargeTemplate Error:: ', e.message)
    return common.returnFail(t('update.failed'))
  }
}
