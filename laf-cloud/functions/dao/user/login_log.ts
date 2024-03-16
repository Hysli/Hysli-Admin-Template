import nw from 'nw-lafjs'

export class UserLoginLogDao {
  /**
   * 表名
   */
  static _dbName = 'user_login_log'

  /**
   * 添加用户登录日志
   * @param entity 登录日志实体
   * @returns 成功时返回 id 值，失败时返回 null
   */
  static async addUserLoginLog(entity: UserLoginLog): Promise<any> {
    if (!entity) return null

    const result = await nw.db.add({
      dbName: this._dbName,
      dataJson: entity,
      cancelAddTime: true,
    })
    return result
  }
}

/**
 * user_login_log
 */
export interface UserLoginLog {
  /**
   * id
   */
  _id?: string
  /**
   * 登录 IP
   */
  login_ip: string
  /**
   * 登录 IP 详细信息
   */
  login_ip_info: object
  /**
   * 登录时间
   */
  login_time: number
  /**
   * 用户 id
   */
  uid: string
}
