import cloud from '@lafjs/cloud'
import * as crypto from 'crypto'
const db = cloud.database()
const _ = db.command

// 生成密钥
function generateSecretKey(length: number): string {
  const CHARSET = 'abcdefghkmnpqrstuvwxyz0123456789'
  // 默认六位
  const LENGTH = length ? length : 6
  let code = ''
  for (let i = 0; i < LENGTH; i++) {
    let index = Math.floor(Math.random() * CHARSET.length)
    code += CHARSET[index]
  }
  return code
}

// 生成随机 6 位数字验证码
function generateRandomCode(): string {
  let code = ''
  const digits = '0123456789'
  for (let i = 0; i < 6; i++) {
    const index = Math.floor(Math.random() * digits.length)
    code += digits[index]
  }
  return code
}

// 生成首位非零的随机 6 位数字验证码
function generateVerificationCode(): string {
  let code = ''
  // 生成首位非零的随机数字
  const firstDigit = Math.floor(Math.random() * 9) + 1
  code += firstDigit.toString()
  // 生成剩余的 5 位数字
  for (let i = 0; i < 5; i++) {
    const digit = Math.floor(Math.random() * 10)
    code += digit.toString()
  }
  return code
}

// 邮箱格式校验
function isEmail(email: string): boolean {
  const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
  return reg.test(email)
}

// 手机号格式校验
function isPhone(phone: string): boolean {
  const reg = /^(^1[3-9]\d{9}$|^\d{3}-\d{8}$|^\d{4}-\d{7}$)+/
  return reg.test(phone)
}

// 验证码校验
function codeFormat(code: string) {
  const regex = /^\d{6}$/ // 正则表达式，匹配 6 位数字
  return regex.test(code)
}

// 返回值为 { code, msg } 的对象
export interface returnFailType {
  code: number
  msg: string
}

// 封装失败返回
function returnFail(msg: string): returnFailType {
  return {
    code: -1,
    msg,
  }
}

// 返回值为 { code, msg } 的对象
export interface returnDataType {
  code: number
  msg: string
  data?: any
}

// 封装成功返回
function returnSuccess(msg: string, data: any): returnDataType {
  // 当 data 为 undefined 时，不返回 data
  if (data) {
    return {
      code: 200,
      msg,
      data,
    }
  } else {
    return {
      code: 200,
      msg,
    }
  }
}

// 封装成功返回
function returnAndPopup(msg: string, data?: any): returnDataType {
  // 当 data 为 undefined 时，不返回 data
  if (data) {
    return {
      code: 100,
      msg,
      data,
    }
  } else {
    return {
      code: 100,
      msg,
    }
  }
}

// 密码加密
function hashPassword(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex')
}

// 生成 JWT token
function getToken7day(uid: string, roles = ['common']): string {
  const expire = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
  const access_token = cloud.getToken({
    uid: uid,
    roles: roles,
    exp: expire,
  })
  // 将 uid 和 access_token 存入一个专门的 token 数据库
  db.collection('login_token').add({
    uid,
    access_token,
  })
  return access_token
}

// 用户密码校验
function validatePassword(password: string): boolean {
  // 长度检查
  if (password.length < 6 || password.length > 20) {
    return false
  }

  // 数字、常见符号和大小写英文字母检查
  if (!/^[0-9a-zA-Z.,!@#$%^&*]+$/.test(password)) {
    return false
  }

  return true
}

// AES 加密 API Token
function aesEncObj(data: object, key?: string): string {
  if (!key) {
    key = process.env.SERVER_SECRET
  }
  const hashedKey = crypto.createHash('sha256').update(key).digest()
  const dataString = JSON.stringify(data)
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-cbc', hashedKey, iv)
  let encrypted = cipher.update(dataString, 'utf8', 'base64')
  encrypted += cipher.final('base64')
  return iv.toString('base64') + encrypted
}

// AES 解密 API Token
function aesDecKey(encryptedData: string, key?: string): object {
  if (!key) {
    key = process.env.SERVER_SECRET
  }
  const hashedKey = crypto.createHash('sha256').update(key).digest()
  const iv = Buffer.from(encryptedData.slice(0, 24), 'base64')
  const decipher = crypto.createDecipheriv('aes-256-cbc', hashedKey, iv)
  let decrypted = decipher.update(encryptedData.slice(24), 'base64', 'utf8')
  decrypted += decipher.final('utf8')
  return JSON.parse(decrypted)
}

// 文本或链接生成二维码
async function generateQRCode(text: string): Promise<any> {
  if (!text) return null

  try {
    const qrcode = require('qrcode')
    const res = await new Promise((resolve, reject) => {
      const options = {
        width: 500, // 宽度
        height: 500, // 高度
        margin: 5,
        errorCorrectionLevel: 'H', // 容错级别，可选值：L, M, Q, H
      }

      qrcode.toDataURL(text, options, (err: any, url: unknown) => {
        if (err) {
          // console.log('生成二维码失败', err)
          reject(err)
        } else {
          // console.log('生成二维码成功', url)
          resolve(url)
        }
      })
    })
    return res
  } catch (e) {
    console.log('generateQRCode Error:: 异常', e.message)
    return null
  }
}

/**
 * 设置环境变量
 */
async function setEnv() {
  const { data: env_Data } = await db
    .collection('laf_env')
    .where({
      status: _.eq(1),
    })
    .get()
  if (env_Data) {
    env_Data.forEach((item: any) => {
      process.env[item.key] = item.value
    })
  }
}

export const common = {
  generateSecretKey,
  generateRandomCode,
  generateVerificationCode,
  isEmail,
  isPhone,
  codeFormat,
  returnFail,
  returnSuccess,
  hashPassword,
  getToken7day,
  validatePassword,
  returnAndPopup,
  aesEncObj,
  aesDecKey,
  generateQRCode,
  setEnv,
}


