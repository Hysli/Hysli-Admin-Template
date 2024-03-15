import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, log, mail, sms, pay, dao, db, nw, console } = _ctx

/**
 * 添加充值模板
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body
  if (ctx.user.roles.indexOf('demo') > -1) {
    return common.returnFail("t('operate.noPermission')")
  }

  // 如果 data 中没有 title，返回错误
  if (
    !_data?.title ||
    _data?.recharge_points == null ||
    _data?.recharge_points == undefined ||
    _data?.gift_points == null ||
    _data?.gift_points == undefined ||
    _data?.sales_price == null ||
    _data?.sales_price == undefined
  ) {
    return common.returnFail(
      'Error: title or recharge_points or gift_points or sales_price is empty'
    )
  }

  // 校验模板标题是否存在
  const isExist = await dao.rechargeDao.isExistByTemplateTitle(_data.title)
  if (isExist) {
    return common.returnFail("t('rechargeTemplate.titleExist')")
  }

  try {
    // 创建充值模板
    const templateInfo = {
      title: _data.title,
      recharge_points: _data?.recharge_points ?? 0,
      gift_points: _data?.gift_points ?? 0,
      sales_price: _data?.sales_price ? Number(_data.sales_price * 100) : 0,
      status: _data.status ?? 1,
      sort: _data.sort ?? 0,
      create_time: Date.now(),
      update_time: Date.now(),
    }
    const rid = await dao.rechargeDao.addRechargeTemplate(templateInfo)
    if (rid) {
      return common.returnAndPopup("t('add.success')")
    } else {
      return common.returnFail("t('add.failed')")
    }
  } catch (e) {
    //TODO handle the exception
    console.log('addRechargeTemplate Error:: ', e.message)
    return common.returnFail("t('add.failed')")
  }
}
