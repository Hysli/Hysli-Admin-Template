import cloud from '@lafjs/cloud'
import Dysmsapi, * as dysmsapi from '@alicloud/dysmsapi20170525'
import * as aliClient from '@alicloud/openapi-client'
import * as aliUtil from '@alicloud/tea-util'

const db = cloud.database()
const clientConfig = {
  accessKeyId: process.env.Alicloud_AccessKeyId?.trim(),
  accessKeySecret: process.env.Alicloud_AccessKeySecret?.trim(),
  signName: process.env.Alicloud_SignName?.trim(),
  templateCode: process.env.Alicloud_TemplateCode?.trim(),
  endpoint: process.env.Alicloud_Endpoint?.trim()
}

/**
 * 短信发送验证码
 * @param phone 手机号
 * @param smsCode 验证码
 * @returns 成功时返回true，失败时返回false
 */
export async function sendSmsCode(
  phone: string,
  smsCode: string
): Promise<boolean> {
  try {
    // 初始化短信请求
    const sendSmsRequest = new dysmsapi.SendSmsRequest({
      phoneNumbers: phone,
      signName: clientConfig.signName,
      templateCode: clientConfig.templateCode,
      templateParam: `{"code":${smsCode}}`
    })
    // console.log('sendSmsRequest', clientConfig)
    // 初始化短信配置
    const config = new aliClient.Config({
      accessKeyId: clientConfig.accessKeyId,
      accessKeySecret: clientConfig.accessKeySecret,
      endpoint: clientConfig.endpoint
    })
    const client = new Dysmsapi(config)
    const runtime = new aliUtil.RuntimeOptions({})
    // 调用阿里云短信服务发送短信验证码
    const res = await client.sendSmsWithOptions(sendSmsRequest, runtime)
    // console.log(res)
    const { code, message } = res.body
    if (code === 'OK') {
      return true
    } else {
      console.log('sendSmsCode Fail:: ', message)
      return false
    }
  } catch (e) {
    console.log('sendSmsCode Error:: ', e)
    return false
  }
}
