import cloud from '@lafjs/cloud'
// 初始化
const Pay = require('wechatpay-node-v3-laf')
const db = cloud.database()

/**
 * 微信 native 支付
 * @param param 微信支付请求参数
 * @returns 失败时返回 null，成功时返回 { status: 200, code_url: 'weixin://wxpay/bizpayurl?pr=9xFPmlUzz' }
 */
export async function WxNativePay(param: WxPayParam): Promise<object> {
  if (!param.payMethod) {
    return null
  }

  try {
    const _param = {
      description: param.orderDesc,
      out_trade_no: param.orderNo,
      notify_url: param.notifyUrl,
      amount: {
        total: param.orderAmount,
      },
      scene_info: {
        payer_client_ip: param.requestIp ? param.requestIp : '',
      },
    }
    console.log('WxNativePay 请求参数', _param)
    const pay = await WxPayInfo(param.payMethod)
    if (!pay) {
      console.log('WxNativePay 未获取到支付配置')
      return null
    }
    const result = await pay.transactions_native(_param)
    console.log('WxNativePay 返回结果', result)

    return result
  } catch (e) {
    console.log('WxNativePay 支付异常', e.message)
    return null
  }
}

/**
 * 微信 jsapi 支付
 * @param param 微信支付请求参数
 * @returns 失败时返回 null，成功时返回 
 * {
  status: 200,
  appId: 'wx6ff710af*******',
  timeStamp: '1692538106',
  nonceStr: 'os1xyk78e69',
  package: 'prepay_id=wx202128267**6***********',
  signType: 'RSA',
  paySign: 'TYnxxVHipTziMy+JcfhwS**************'
}
 */
export async function WxJsapiPay(param: WxPayParam): Promise<object> {
  if (!param.openId || !param.payMethod) {
    // console.log('WxJsapiPay openId不能为空')
    return null
  }

  try {
    const _param = {
      description: param.orderDesc,
      out_trade_no: param.orderNo,
      notify_url: param.notifyUrl,
      amount: {
        total: param.orderAmount,
      },
      payer: {
        openid: param.openId,
      },
      scene_info: {
        payer_client_ip: param.requestIp ? param.requestIp : '',
      },
    }
    // console.log('WxJsapiPay 请求参数', _param)
    const pay = await WxPayInfo(param.payMethod)
    if (!pay) {
      // console.log('WxJsapiPay 未获取到支付配置')
      return null
    }
    const result = await pay.transactions_jsapi(_param)
    // console.log('WxJsapiPay 返回结果', result)

    return result
  } catch (e) {
    console.log('WxJsapiPay 支付异常', e.message)
    return null
  }
}

/**
 * 微信 applet 支付
 * @param 微信支付请求参数
 * @returns 失败时返回 null，成功时返回 
 * {
  status: 200,
  appId: 'wx6ff710af*******',
  timeStamp: '1692538106',
  nonceStr: 'os1xyk78e69',
  package: 'prepay_id=wx202128267**6***********',
  signType: 'RSA',
  paySign: 'TYnxxVHipTziMy+JcfhwS**************'
}
 */
export async function WxAppletPay(param: WxPayParam): Promise<object> {
  if (!param.openId || !param.payMethod) {
    // console.log('WxAppletPay openId不能为空')
    return null
  }

  try {
    const _param = {
      description: param.orderDesc,
      out_trade_no: param.orderNo,
      notify_url: param.notifyUrl,
      amount: {
        total: param.orderAmount,
      },
      payer: {
        openid: param.openId,
      },
      scene_info: {
        payer_client_ip: param.requestIp ? param.requestIp : '',
      },
    }
    // console.log('WxAppletPay 请求参数', param)
    const pay = await WxPayInfo(param.payMethod)
    if (!pay) {
      // console.log('WxAppletPay 未获取到支付配置')
      return null
    }
    const result = await pay.transactions_jsapi(_param)
    // console.log('WxAppletPay 返回结果', result)

    return result
  } catch (e) {
    console.log('WxAppletPay 支付异常', e.message)
    return null
  }
}

/**
 * 微信支付请求参数
 */
export interface WxPayParam {
  /**
   * 订单号
   */
  orderNo: string
  /**
   * 订单描述
   */
  orderDesc: string
  /**
   * 订单金额
   */
  orderAmount: number
  /**
   * 请求IP地址
   */
  requestIp?: string
  /**
   * 回调地址
   */
  notifyUrl: string
  /**
   * 用户OpenId
   */
  openId?: string
  /**
   * 支付方式
   */
  payMethod: number
}

/**
 * 获取微信支付信息
 * @returns
 */
async function WxPayInfo(type: number) {
  const res = await db
    .collection('pay_config')
    .where({ type, status: 1 })
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
  // console.log('WxPayInfo', res)

  const pay = new Pay({
    appid: res.data.app_id, // 认证服务号 appid
    mchid: res.data.mch_id, //  绑定该认证服务号的微信支付商户号
    publicKey: res.data.public_key, // V3 公钥 apiclient_cert.pem
    privateKey: res.data.private_key, // V3 秘钥 apiclient_key.pem
  })
  console.log('WxPayInfo pay', pay)
  return pay
}
