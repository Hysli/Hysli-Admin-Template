import nw from 'nw-lafjs'

import cloud from '@lafjs/cloud'
const db = cloud.database()
const _ = db.command

export class SmsLogDao {
  /**
   * 表名
   */
  static _dbName = 'sms_log'

  /**
   * 获取最后一条短信日志记录
   * @param phone 手机号
   * @param code 验证码
   * @param type 类型 {'register':'注册,'login':'登录'}
   * @returns 返回SmsLog实体
   */
  static async findLastByWhere(phone: string, code: string, type: string): Promise<SmsLog> {
    if ((!phone && !code) || !type) return null

    const result = await nw.db.select({
      dbName: this._dbName,
      whereJson: {
        phone,
        code,
        type,
        status: 'success'
      },
      sortArr: [{ name: '_id', type: 'desc' }],
      pageSize: 1
    })

    return result?.rows && result.rows.length > 0 ? result.rows[0] : null
  }

  /**
   * 添加短信日志
   * @param entity 短信日志实体
   * @returns 成功时返回id值，失败时返回null
   */
  static async addSmsLog(entity: SmsLog): Promise<any> {
    if (!entity) return null

    const result = await nw.db.add({
      dbName: this._dbName,
      dataJson: entity,
      cancelAddTime: true
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
        _id
      },
      dataJson: {
        status
      }
    })
    return result
  }
}

/**
 * sms_log
 */
export interface SmsLog {
  /**
   * id
   */
  _id?: string
  /**
   * 验证码
   */
  code: string
  /**
   * 手机号
   */
  phone: string
  /**
   * 发送时间
   */
  send_time: number
  /**
   * 状态
   */
  status: string
  /**
   * 类型
   */
  type: string
  /**
   * 更新时间
   */
  update_time: number
}
