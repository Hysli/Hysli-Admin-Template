import nw from 'nw-lafjs'

import cloud from '@lafjs/cloud'
const db = cloud.database()
const _ = db.command

export class MailLogDao {
  /**
   * 表名
   */
  static _dbName = 'mail_log'

  /**
   * 获取最后一条邮件日志记录
   * @param fromEmail 发送者邮箱
   * @param toEmail 接收者邮箱
   * @param code 验证码
   * @param type 类型 {'register':'注册,'login':'登录'}
   * @returns 返回MailLog实体
   */
  static async findLastByWhere(
    fromEmail: string,
    toEmail: string,
    code: string,
    type: string
  ): Promise<MailLog> {
    if (!fromEmail || (!toEmail && !code) || !type) return null

    const result = await nw.db.select({
      dbName: this._dbName,
      whereJson: {
        from_email: fromEmail,
        to_email: toEmail,
        code,
        type,
        status: 'success',
      },
      sortArr: [{ name: '_id', type: 'desc' }],
      pageSize: 1,
    })

    return result?.rows && result.rows.length > 0 ? result.rows[0] : null
  }

  /**
   * 添加邮件日志
   * @param entity 邮件日志实体
   * @returns 成功时返回id值，失败时返回null
   */
  static async addMailLog(entity: MailLog): Promise<any> {
    if (!entity) return null

    const result = await nw.db.add({
      dbName: this._dbName,
      dataJson: entity,
      cancelAddTime: true,
    })
    return result
  }

  /**
   * 通过主键id修改状态
   * @param _id 主键id
   * @param status 状态
   * @returns 成功时返回修改记录数，失败返回null
   */
  static async updateStatusById(_id: string, status: string): Promise<number> {
    if (!_id) return null

    const result = await nw.db.update({
      dbName: this._dbName,
      whereJson: {
        _id,
      },
      dataJson: {
        status,
      },
    })
    return result
  }
}

/**
 * mail_log
 */
export interface MailLog {
  /**
   * 主键id
   */
  _id?: string
  /**
   * 验证码
   */
  code: string
  /**
   * 发送者邮箱
   */
  from_email: string
  /**
   * 消息id
   */
  message_id: string
  /**
   * 原因说明
   */
  reason: string
  /**
   * 发送时间
   */
  send_time: number
  /**
   * 状态，pending请求中，fail失败，success成功
   */
  status: string
  /**
   * 接收者邮箱
   */
  to_email: string
  /**
   * 类型，login登录，register注册
   */
  type: string
  /**
   * 更新时间
   */
  update_time: number
}
