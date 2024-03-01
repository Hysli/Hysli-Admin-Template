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
  try {
    const _param = {
      description: param.orderDesc,
      out_trade_no: param.orderNo,
      notify_url: param.notifyUrl,
      amount: {
        total: param.orderAmount
      },
      scene_info: {
        payer_client_ip: param.requestIp ? param.requestIp : ''
      }
    }
    console.log('WxNativePay 请求参数', _param)
    const pay = await WxNativePayInfo()
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
  if (!param.openId) {
    // console.log('WxJsapiPay openId不能为空')
    return null
  }

  try {
    const _param = {
      description: param.orderDesc,
      out_trade_no: param.orderNo,
      notify_url: param.notifyUrl,
      amount: {
        total: param.orderAmount
      },
      payer: {
        openid: param.openId
      },
      scene_info: {
        payer_client_ip: param.requestIp ? param.requestIp : ''
      }
    }
    // console.log('WxJsapiPay 请求参数', _param)
    const pay = await WxJsapiPayInfo()
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
  if (!param.openId) {
    // console.log('WxAppletPay openId不能为空')
    return null
  }

  try {
    const _param = {
      description: param.orderDesc,
      out_trade_no: param.orderNo,
      notify_url: param.notifyUrl,
      amount: {
        total: param.orderAmount
      },
      payer: {
        openid: param.openId
      },
      scene_info: {
        payer_client_ip: param.requestIp ? param.requestIp : ''
      }
    }
    // console.log('WxAppletPay 请求参数', param)
    const pay = await WxAppletPayInfo()
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
}

/**
 * 获取微信 Native 支付信息
 * @returns
 */
async function WxNativePayInfo() {
  const res = await db.collection('system_settings').where({ _id: '001' }).getOne()
  if (
    !res.data ||
    !res.data.pay ||
    !res.data.pay.wechat ||
    !res.data.pay.wechat.wx_app_id ||
    !res.data.pay.wechat.mch_id ||
    !res.data.pay.wechat.public_key ||
    !res.data.pay.wechat.private_key
  ) {
    return null
  }
  console.log('WxNativePayInfo', res)

  const pay = new Pay({
    appid: res.data.pay.wechat.wx_app_id, // 认证服务号 appid
    mchid: res.data.pay.wechat.mch_id, //  绑定该认证服务号的微信支付商户号
    publicKey: res.data.pay.wechat.public_key, // V3 公钥 apiclient_cert.pem
    privateKey: res.data.pay.wechat.private_key // V3 秘钥 apiclient_key.pem
  })
  console.log('WxNativePayInfo pay', pay)
  return pay
}

/**
 * 获取微信 JSPAPI 支付信息
 * @returns
 */
async function WxJsapiPayInfo() {
  const res = await db.collection('system_settings').where({ _id: '001' }).getOne()
  if (
    !res.data ||
    !res.data.pay ||
    !res.data.pay.wechat ||
    !res.data.pay.wechat.wx_app_id ||
    !res.data.pay.wechat.mch_id ||
    !res.data.pay.wechat.public_key ||
    !res.data.pay.wechat.private_key
  ) {
    return null
  }

  const pay = new Pay({
    appid: res.data.pay.wechat.wx_app_id, // 认证服务号 appid
    mchid: res.data.pay.wechat.mch_id, //  绑定该认证服务号的微信支付商户号
    publicKey: res.data.pay.wechat.public_key, // V3 公钥 apiclient_cert.pem
    privateKey: res.data.pay.wechat.private_key // V3 秘钥 apiclient_key.pem
  })
  return pay
}

/**
 * 获取微信 小程序 支付信息
 * @returns
 */
async function WxAppletPayInfo() {
  const res = await db.collection('system_settings').where({ _id: '001' }).getOne()
  if (
    !res.data ||
    !res.data.pay ||
    !res.data.pay.wechat ||
    !res.data.pay.wechat.app_id ||
    !res.data.pay.wechat.mch_id ||
    !res.data.pay.wechat.public_key ||
    !res.data.pay.wechat.private_key
  ) {
    return null
  }

  const pay = new Pay({
    appid: res.data.pay.wechat.app_id, // 认证服务号 appid
    mchid: res.data.pay.wechat.mch_id, //  绑定该认证服务号的微信支付商户号
    publicKey: res.data.pay.wechat.public_key, // V3 公钥 apiclient_cert.pem
    privateKey: res.data.pay.wechat.private_key // V3 秘钥 apiclient_key.pem
  })
  return pay
}

// V3 公钥
function savePublicKey() {
  const key = `-----BEGIN CERTIFICATE-----
MIIEKzCCAxOgAwIBAgIUTb+JfWjcUWhea7fP1TyqzJIUNVIwDQYJKoZIhvcNAQEL
BQAwXjELMAkGA1UEBhMCQ04xEzARBgNVBAoTClRlbnBheS5jb20xHTAbBgNVBAsT
FFRlbnBheS5jb20gQ0EgQ2VudGVyMRswGQYDVQQDExJUZW5wYXkuY29tIFJvb3Qg
Q0EwHhcNMjMwNTIxMTkzMjM0WhcNMjgwNTE5MTkzMjM0WjCBhDETMBEGA1UEAwwK
MTYyMTY1Njg4NzEbMBkGA1UECgwS5b6u5L+h5ZWG5oi357O757ufMTAwLgYDVQQL
DCfmrabmsYnluILmsZ/lpI/ljLrogZrlrrnnvZHnu5zlt6XkvZzlrqQxCzAJBgNV
BAYMAkNOMREwDwYDVQQHDAhTaGVuWmhlbjCCASIwDQYJKoZIhvcNAQEBBQADggEP
ADCCAQoCggEBALaawkGt7mqv1ntvuEeWKJulR3M8Y+ezEix1aCYZz+5X5sDqjjjP
IEzUOfBTg5MxWVsDvvnoPCQNwMptYpizWw06ICd618fT7PCJd5roymR4VQe2FHDa
ytLBGrsH3Hu9VCs0JoOciXn55SGCodOWS8nPD+w995CebtQxIfpqSxTQW+QI8a5P
fGeMaL/ms+iyQkTsGGpvoQ5nVLLhTJTgJL25Uvjat+RWvUWXpvbinm8GDmu0NlJ9
TiFC/lst2iQE7VTVIVfEYpgJj8yHof7HvunrM3I/qPnLy+2nHdcI69O4k5ygkQyR
0uPk/Ch8Kuf6cHPSpAi4fezNbCbyFB91i4kCAwEAAaOBuTCBtjAJBgNVHRMEAjAA
MAsGA1UdDwQEAwID+DCBmwYDVR0fBIGTMIGQMIGNoIGKoIGHhoGEaHR0cDovL2V2
Y2EuaXRydXMuY29tLmNuL3B1YmxpYy9pdHJ1c2NybD9DQT0xQkQ0MjIwRTUwREJD
MDRCMDZBRDM5NzU0OTg0NkMwMUMzRThFQkQyJnNnPUhBQ0M0NzFCNjU0MjJFMTJC
MjdBOUQzM0E4N0FEMUNERjU5MjZFMTQwMzcxMA0GCSqGSIb3DQEBCwUAA4IBAQAs
VwBGYJVIH4kY6K57yL4CGbl5ufhatb/EPM0JABA8LYz3v5agKHMQz5DA86QeRAQ0
2ceDPBcRIv8NYNxg9gudoeU/vOr4ulVDOYpgQzwdwkoD6qq9akM7JUETdiwHTdU4
Pe9LYVUF9hFJE7iU4UG2FD+aFcLjce5dpYl3zT0m8wZ9FTNQrvsj98dsy4fbndv2
yRzdY9vpUnKnpH0chHnFzT6BRzmujwtoD5YSqW4BDNHIYzI+7dupwgbtp9dmw7+A
0hhIiCOXNdeeo92JZUJLp8BsomSNFbHPckunxt99gaQYPYTF+LlBQRUYOP5MnS65
cOKTpMEZD57/fDqBzbvU
-----END CERTIFICATE-----
`
  return Buffer.from(key)
}

// V3 秘钥
function savePrivateKey() {
  const key = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC2msJBre5qr9Z7
b7hHliibpUdzPGPnsxIsdWgmGc/uV+bA6o44zyBM1DnwU4OTMVlbA7756DwkDcDK
bWKYs1sNOiAnetfH0+zwiXea6MpkeFUHthRw2srSwRq7B9x7vVQrNCaDnIl5+eUh
gqHTlkvJzw/sPfeQnm7UMSH6aksU0FvkCPGuT3xnjGi/5rPoskJE7Bhqb6EOZ1Sy
4UyU4CS9uVL42rfkVr1Fl6b24p5vBg5rtDZSfU4hQv5bLdokBO1U1SFXxGKYCY/M
h6H+x77p6zNyP6j5y8vtpx3XCOvTuJOcoJEMkdLj5PwofCrn+nBz0qQIuH3szWwm
8hQfdYuJAgMBAAECggEBAII48YnHUTySM4IJ1UBwDHubLc43ZgPph29fNyvcwpV1
6GDxpQVMaPuBaeRCmpWQ3ulyTXKJNMJ9cFysD2FYnvla121wRIwETXfogPxfQV7P
FcyPBBrLXVNZVQfGfm1cQrcg1MqNCtmK5eW09FUhXOEJopBWTMO8yMrYUyPzQ6IO
FOge6WySEEhdrRIu/Z/WqofJ/JSNIbILwZMRXnnWFLWJJQ0p38gLdOdrId8w7mTv
5fhccZ4VrKpFxA44wXGy+/z824EC9L4VvC98WweGELgp6FLyqWyPaZE0u+V0UYc3
fLQ9sulgO9fP6638pAvrub1qJBWsigYREpfsGD+LOtUCgYEA2Q54EHy2VciL9zch
vUnfUluAl6qdqTJ5esKLWMj7sViJauREnIbQKa22wEHHNp2d6dTeQrXvJxFY+ITF
fhWRPzbNwKm+Z24tlzZXlczPHWAW4piu15NbQp04gBY2mn+N2fOn7CCvHAsJf9WE
F1Wo6jB2PjQMIeklQhThYuIOewcCgYEA113j0mQZBd/fGvPssUKhmupi+PXL8Q+D
alj2BGL1KNUssYz1m1BRd6Xg8uugEmXSiwb30DlpY6YMh2xe3Q8fjbZ6cgcRYYxG
j5fxZ5OJApCZ/qDmxhDqWrgzboUh6/Ra58gf9eklZUgxiKjraZHvsB2ZmD2mnX/c
/D8FOiJt0O8CgYAiESFLBSfhAt7k6CRFf0irtmzSYRbprWBfohUY1EKcrRa0Titu
ncIiKH+cYTaRHd/hCWXw9nkYmqJqLvyIM35ee42DhaC6vxIsv3yzqDeBlslAu1IF
x7z1EZQClnnvecGbyaA7cU3KivjstWhL+UfPqdeFH8ofsGYGnxxY1r4LFQKBgBm3
uobbMSnEbA355t/cBxRKvPrhzzLAGX9PlEE91+zCWA3zuTiMxM223z/i50CLLDMx
59HTqUQfBgv94u4e6jOwALsxIOA3Mg3fpRIrSgcmYV1ItYYdav7eVDX0a/KTQW/A
NCDXcIHBtziMg2Ad7zNmtXq6kfTo2ei9VdB1YAu9AoGAYvDjtRbe7zc0T9piv8sI
iKigoQJDnpcakRl6f+It1ETOJqTep4DzRE9SmdRg7MySDV57zgNkUOi26rWKbVP9
iXTIs7zGtva7qSMNX6r5844/UnMeZv4ohK8pwMMPXOtVPc3grVx7DX5D2jY3ITid
cTg/LKJksgROdEz3E7EIQ7k=
-----END PRIVATE KEY-----
`
  return Buffer.from(key)
}
