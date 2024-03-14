import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const _ = cloud.database().command
const { common, t, log, mail, sms, pay, dao, db, nw } = _ctx

// 初始化
const Pay = require('wechatpay-node-v3-laf')
let key

/**
 * Native 支付回调
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const { resource } = ctx.body
  const { ciphertext, associated_data, nonce } = resource
  console.log('Native 支付回调通知内容', ctx.body)

  try {
    const pay = await WxPayInfo()
    if (!pay) {
      console.log('Native 支付回调异常', '未获取到支付配置')
      return
    }
    const result = await pay.decipher_gcm(
      ciphertext,
      associated_data,
      nonce,
      key
    )
    console.log('Native 支付回调-->解密', result)
    if (result.trade_state == 'SUCCESS') {
      // 支付成功的逻辑
      await updateOrderStatus(result)
    }
  } catch (e) {
    console.log('Native 支付回调异常', e.message)
  }
}

/**
 * 获取微信支付信息
 * @returns
 */
async function WxPayInfo() {
  const res = await db
    .collection('pay_config')
    .where({ type: 10, status: 1 })
    .getOne()
  if (
    !res.data ||
    !res.data.app_id ||
    !res.data.mch_id ||
    !res.data.public_key ||
    !res.data.private_key
  ) {
    return null
  }

  const pay = new Pay({
    appid: res.data.app_id, // 认证服务号 appid
    mchid: res.data.mch_id, //  绑定该认证服务号的微信支付商户号
    publicKey: res.data.public_key, // V3 公钥 apiclient_cert.pem
    privateKey: res.data.private_key, // V3 秘钥 apiclient_key.pem
  })
  key = res.data.mch_key
  return pay
}

/**
 * 更新业务数据
 * @param param
 * @returns
 */
async function updateOrderStatus(param) {
  if (!param) {
    return
  }
  if (!param.out_trade_no) {
    console.log('updateOrderStatus 结果', 'out_trade_no is not exist')
    return
  }
  if (!param.trade_state || param.trade_state != 'SUCCESS') {
    console.log('交易状态为：' + param.trade_state)
    return
  }

  // 检查充值订单是否存在
  const orderData = await dao.rechargeOrderDao.getInfoById(param.out_trade_no)
  if (!orderData || orderData.pay_status != 'pending') {
    console.log('订单不存在')
    return
  }

  // 修改订单支付状态
  orderData.pay_status = 'success'
  orderData.pay_amount = param.amount ? Number(param.amount.total) : null
  orderData.pay_time = Date.now()
  orderData.transaction_id = param.transaction_id
  orderData.callback_detail = JSON.stringify(param)
  orderData.callback_time = Date.now()
  const result = await dao.rechargeOrderDao.updateRechargeOrder(orderData)
  if (result && result > 0) {
    // 添加充值记录
    let rechargeRecord = {
      uid: orderData.uid,
      recharge_points: orderData.recharge_points,
      gift_points: orderData.gift_points,
      pay_amount: orderData.pay_amount,
      order_id: param.out_trade_no,
      cdkey_id: '',
      create_time: Date.now(),
    }
    await dao.rechargeRecordDao.addRechargeRecord(rechargeRecord)

    // 更新用户余额或赠送金额
    let userInfo = await dao.userDao.getInfoById(orderData.uid)
    if (userInfo) {
      userInfo.points = _.inc(orderData.recharge_points)
      userInfo.gift_points = _.inc(orderData.gift_points)
      userInfo.update_time = Date.now()
      await dao.userDao.updateUser(userInfo)
    }
  }
}
