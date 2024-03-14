import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, t, log, mail, sms, pay, dao, db, nw, console } = _ctx
const _ = cloud.database().command

/**
 * 添加充值订单
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body
  if (ctx.user.roles.indexOf('demo') > -1) {
    return common.returnFail(t('operate.noPermission'))
  }

  // 如果 data 中没有 uid or templateId，返回错误
  if (
    !ctx.user.uid ||
    _data?.template_id ||
    _data?.pay_method == null ||
    _data?.pay_method == undefined
  ) {
    return common.returnFail('Error: uid or templateId or pay_method is empty')
  }

  const templateData = await dao.rechargeDao.getInfoById(_data.template_id)
  if (!templateData) {
    return common.returnFail(t('template.notExist'))
  }

  const title = `充${templateData.recharge_points}点，赠送${templateData.gift_points}点`
  try {
    // 创建充值订单
    const orderInfo = {
      uid: ctx.user.uid,
      order_desc: title,
      order_amount: templateData.sales_price * 100, // 单位：分
      recharge_points: templateData.recharge_points,
      gift_points: templateData.gift_points,
      recharge_template_id: templateData._id,
      pay_status: 'pending', // 支付状态（pending请求中，fail失败，success成功）
      pay_method: _data.pay_method, // 支付方式（10-微信公众号，11-微信小程序，20-支付宝，30-Paypal，40-Stripe）
      pay_amount: null,
      pay_time: null,
      create_time: Date.now(),
      cancel_time: null,
      transaction_id: '',
      callback_detail: '',
      callback_time: null,
    }
    const rid = await dao.rechargeOrderDao.addRechargeOrder(orderInfo)
    if (rid && (_data.pay_method == 10 || _data.pay_method == 11)) {
      // 创建预支付订单（微信）
      const prepayInfo = {
        orderDesc: title,
        orderNo: rid,
        orderAmount: templateData.sales_price * 100,
        requestIp: ctx.headers['remote-host']
          ? ctx.headers['remote-host']
          : ctx.headers['x-forwarded-for'],
        notifyUrl: `https://${ctx.headers['host']}/notify/wxpay_native_notify`,
        payMethod: _data.pay_method,
      }
      const result = await pay.WxNativePay(prepayInfo)
      if (result.status == 200) {
        let _url = await common.generateQRCode(result.code_url)
        const data = {
          orderNo: rid,
          qrCode: _url,
          status: 'pending',
        }
        return common.returnSuccess(t('add.success'), data)
      }
    }

    return common.returnFail(t('add.failed'))
  } catch (e) {
    //TODO handle the exception
    console.log('addRechargeOrder Error:: ', e.message)
    return common.returnFail(t('add.failed'))
  }
}
