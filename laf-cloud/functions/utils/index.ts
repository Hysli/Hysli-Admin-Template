import { FunctionContext } from '@lafjs/cloud'
import log from '@/utils/log'
import * as mail from '@/utils/mail'
import * as sms from '@/utils/sms'
import * as qiniu from '@/utils/qiniu'
import * as pay from '@/utils/pay'
import i18n from '@/utils/i18n'
import { common, returnFailType, returnDataType } from '@/utils/common'
import { dao, DaoType } from '@/dao/index'

export const utils: UtilsType = {
  log,
  i18n,
  mail,
  sms,
  qiniu,
  pay,
  common,
  dao,
  t: (key: string) => key
}

export interface UtilsType {
  log: (ctx: FunctionContext) => string
  i18n: any
  mail: MailType
  sms: SmsType
  qiniu: QiniuType
  pay: PayType
  common: CommonType
  dao: DaoType
  t: (key: string) => string
}

interface CommonType {
  generateSecretKey: (length: number) => string
  generateRandomCode: () => string
  generateVerificationCode: () => string
  isEmail: (email: string) => boolean

  /**
   * 手机号格式校验
   * @param {string} phone 需要校验的手机号
   * @returns {boolean} 返回是否符合规则
   */

  isPhone: (phone: string) => boolean

  /**
   * 验证码校验
   * @param {string} code 需要校验的验证码
   * @returns {boolean} 返回是否符合规则
   * @description 验证码规则：6 位数字
   */

  codeFormat: (code: string) => boolean

  /**
   * 封装失败返回
   * @param {string} msg 返回信息
   * @returns {returnDataType} 返回值为 { code, msg } 的对象
   * @description 返回 code -1
   */

  returnFail: (msg: string) => returnFailType

  /**
   * 封装成功返回
   * @param {string} msg 返回信息
   * @param {any} data 返回数据
   * @returns {returnDataType} 返回值为 { code, msg, data } 的对象
   * @description 返回 code 200
   */

  returnSuccess: (msg: string, data?: any) => returnDataType

  /**
   * hash 加密
   * @param {string} content 加密的内容，一般是密码
   * @returns {string} 返回加密后的字符串
   */

  hashPassword: (content: string) => string

  /**
   * 生成 7 天有效期的 JWT Token
   * @description 生成 API Token
   * @param {string} uid 用户 ID
   * @param {Array<string>} roles 用户角色名
   * @returns {string} JWT Token
   */

  getToken7day: (uid: string, roles?: Array<string>) => string

  /**
   * 验证密码是否符合规则
   * @param {string} password 需要校验的密码
   * @returns {boolean} 返回是否符合规则
   * @description 密码规则：6-20 位，数字、常见符号和大小写英文字母检查
   */

  validatePassword: (password: string) => boolean

  /**
   * 封装成功返回
   * @param {string} msg 返回信息
   * @param {any} data 返回数据
   * @returns {returnDataType} 返回值为 { code, msg, data } 的对象
   * @description 返回 code 100
   */

  returnAndPopup: (msg: string, data?: any) => returnDataType

  /**
   * 对象 AES 加密
   * @param {object} data 需要加密的对象
   * @param {string} key 加密密钥
   * @returns {string} 返回加密后的字符串
   */
  aesEncObj: (data: object, key?: string) => string

  /**
   * 对象 AES 解密
   * @param {object} encryptedData 加密后的 key
   * @param {object} key 加密密钥
   * @returns {object} 返回解密后的对象
   */
  aesDecKey: (encryptedData: string, key?: string) => object
  /**
   * 文本或链接生成二维码
   * @param text 需要生成的文本或链接
   * @returns 返回二维码链接
   */
  generateQRCode: (text: string) => Promise<any>
}

interface MailType {
  /**
   * 邮件发送验证码
   * @param toEmail 接收者邮箱
   * @param emailCode 验证码
   * @returns 成功时返回 MessageId，失败时返回 null
   */
  sendEmailCode: (toEmail: string, emailCode: string) => Promise<any>
}

interface SmsType {
  /**
   * 短信发送验证码
   * @param phone 手机号
   * @param smsCode 验证码
   * @returns 成功时返回 true，失败时返回 false
   */
  sendSmsCode: (phone: string, smsCode: string) => Promise<boolean>
}

interface QiniuType {
  /**
   * 上传文件
   * @param {fileData:string,fileName:string} obj
   * @return {object}
   */
  uploadFile: (obj: any) => Promise<any>
  /**
   * 获取文件信息
   * @param {key} key
   * @return {object}
   */
  getFileInfo: (key: string) => Promise<any>
}

interface PayType {
  /**
   * 微信 native 支付
   * @param param 微信支付请求参数
   * @returns 失败时返回 null，成功时返回 { status: 200, code_url: 'weixin://wxpay/bizpayurl?pr=9xFPmlUzz' }
   */
  WxNativePay: (param: pay.WxPayParam) => Promise<object>
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
  WxJsapiPay: (param: pay.WxPayParam) => Promise<object>
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
  WxAppletPay: (param: pay.WxPayParam) => Promise<object>
}
