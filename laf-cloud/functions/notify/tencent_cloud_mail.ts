import cloud from '@lafjs/cloud'
const db = cloud.database()

export default async function (ctx: FunctionContext) {
  try {
    const { body } = ctx
    const { event, email, bulkId, reason, from } = body
    const status = event === 'delivered' ? 'success' : event

    // 更新邮件日志表
    await db
      .collection('mail_log')
      .where({
        message_id: bulkId,
        to_email: email,
        from_email: from
      })
      .update({
        status: status,
        reason,
        update_time: Date.now()
      })
  } catch (e) {
    console.log('tencent_cloud_mail_notify Error::', e.message)
  }
}
