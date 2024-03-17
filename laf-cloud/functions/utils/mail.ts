import cloud from '@lafjs/cloud'
const tencentcloud = require('tencentcloud-sdk-nodejs-ses')
const SesClient = tencentcloud.ses.v20201002.Client

/**
 * 邮件发送验证码
 * @param toEmail 接收者邮箱
 * @param emailCode 验证码
 * @returns 成功时返回MessageId，失败时返回null
 */
export async function sendEmailCode(
  toEmail: string,
  emailCode: string
): Promise<any> {
  const clientConfig = {
    credential: {
      secretId: process.env.TencentCloud_SecretId?.trim(),
      secretKey: process.env.TencentCloud_SecretKey?.trim(),
    },
    region: 'ap-hongkong',
    profile: {
      httpProfile: {
        endpoint: 'ses.tencentcloudapi.com',
      },
    },
  }
  const fromEmail = process.env.TencentCloud_FromEmail?.trim()
  const templateId = 98443

  try {
    // 初始化邮件配置
    const client = new SesClient(clientConfig)
    // 发送邮件
    const res = await client.SendEmail({
      FromEmailAddress: fromEmail,
      Destination: [toEmail],
      Template: {
        TemplateID: templateId,
        TemplateData: `{"code":"${emailCode}"}`,
      },
      Subject: '欢迎注册 Hysli AI',
    })
    // console.log(res)
    const { MessageId, Error } = res
    if (MessageId) {
      return MessageId
    } else {
      console.log('sendEmailCode Fail:: ', Error?.Message)
      return null
    }
  } catch (e) {
    console.log('sendEmailCode Error:: ', e.message)
    return null
  }
}
