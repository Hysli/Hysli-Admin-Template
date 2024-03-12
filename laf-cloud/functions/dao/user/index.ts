import nw from 'nw-lafjs'

import cloud from '@lafjs/cloud'
const db = cloud.database()
const _ = db.command

export class UserDao {
  /**
   * 表名
   */
  static _dbName = 'user'

  /**
   * 通过用户名查询用户
   * @param username 用户名
   * @returns 返回User实体
   */
  static async findByUserName(username: string): Promise<User> {
    if (!username && !username) return null

    const result = await nw.db.select({
      dbName: this._dbName,
      whereJson: {
        username,
        status: _.neq(9),
      },
      sortArr: [{ name: '_id', type: 'desc' }],
      pageSize: 1,
    })

    return result?.rows && result.rows.length > 0 ? result.rows[0] : null
  }

  /**
   * 通过邮箱查询用户
   * @param email 邮箱
   * @returns 返回User实体
   */
  static async findByEmail(email: string): Promise<User> {
    if (!email) return null

    const result = await nw.db.select({
      dbName: this._dbName,
      whereJson: {
        email,
        status: _.neq(9),
      },
      sortArr: [{ name: '_id', type: 'desc' }],
      pageSize: 1,
    })

    return result?.rows && result.rows.length > 0 ? result.rows[0] : null
  }

  /**
   * 通过手机号查询用户（
   * @param phone 手机号
   * @returns 返回User实体
   */
  static async findByPhone(phone: string): Promise<User> {
    if (!phone) return null

    const result = await nw.db.select({
      dbName: this._dbName,
      whereJson: {
        phone,
        status: _.neq(9),
      },
      sortArr: [{ name: '_id', type: 'desc' }],
      pageSize: 1,
    })

    return result?.rows && result.rows.length > 0 ? result.rows[0] : null
  }

  /**
   * 添加用户
   * @param entity 用户实体
   * @returns 成功时返回id值，失败时返回null
   */
  static async addUser(entity: User): Promise<any> {
    if (!entity) return null

    const result = await nw.db.add({
      dbName: this._dbName,
      dataJson: entity,
      cancelAddTime: true,
    })
    return result
  }

  /**
   * 用户名是否已经注册
   * @param username 用户名
   * @param _id 用户id
   * @returns 未注册返回false，已注册或失败返回true
   */
  static async isRegisterByUserName(
    username: string,
    _id?: string
  ): Promise<boolean> {
    if (!username) return true

    const result = await nw.db.count({
      dbName: this._dbName,
      whereJson: {
        _id: _id ? _.neq(_id) : undefined,
        username,
        status: _.neq(9),
      },
    })
    if (result == null) return true

    return result > 0
  }

  /**
   * 用户邮箱是否已经注册
   * @param email 邮箱
   * @param _id 用户id
   * @returns 未注册返回false，已注册或失败返回true
   */
  static async isRegisterByEmail(
    email: string,
    _id?: string
  ): Promise<boolean> {
    if (!email) return true

    const result = await nw.db.count({
      dbName: this._dbName,
      whereJson: {
        _id: _id ? _.neq(_id) : undefined,
        email,
        status: _.neq(9),
      },
    })
    if (result == null) return true

    return result > 0
  }

  /**
   * 用户手机号是否已经注册
   * @param phone 手机号
   * @param _id 用户id
   * @returns 未注册返回false，已注册或失败返回true
   */
  static async isRegisterByPhone(
    phone: string,
    _id?: string
  ): Promise<boolean> {
    if (!phone) return true

    const result = await nw.db.count({
      dbName: this._dbName,
      whereJson: {
        _id: _id ? _.neq(_id) : undefined,
        phone,
        status: _.neq(9),
      },
    })
    if (result == null) return true

    return result > 0
  }

  /**
   * 通过主键id更新用户access_token
   * @param _id 主键id
   * @param access_token access_token
   * @returns 成功时返回修改记录数，失败返回null
   */
  static async updateAccessTokenById(
    _id: string,
    accessToken: string
  ): Promise<number> {
    if (!_id) return null

    const result = await nw.db.update({
      dbName: this._dbName,
      whereJson: {
        _id,
      },
      dataJson: {
        access_token: accessToken,
      },
    })
    return result
  }

  /**
   * 根据主键id获取用户信息
   * @param _id 主键id
   * @returns 返回User实体
   */
  static async getInfoById(_id: string): Promise<User> {
    if (!_id) return null

    const result = await nw.db.findById({
      dbName: this._dbName,
      id: _id,
      fieldJson: {
        password: 0,
        access_token: 0,
        create_ip: 0,
        create_time: 0,
        update_time: 0,
      },
    })
    return result
  }

  /**
   * 获取用户列表（带分页）
   * @param whereJson 查询条件JSON格式
   * @param pageIndex 当前页数
   * @param pageSize 每页数量
   * @returns 返回用户集合
   */
  static async getUserList(
    whereJson: any,
    pageIndex: number,
    pageSize: number
  ): Promise<Array<User>> {
    const result = await nw.db.selects({
      dbName: this._dbName,
      whereJson,
      pageIndex,
      pageSize,
      sortArr: [{ name: '_id', type: 'desc' }],
      fieldJson: {
        password: 0,
        access_token: 0,
      },
      getCount: true,
      foreignDB: [
        {
          dbName: 'role_manage',
          localKey: 'roles',
          localKeyType: 'array',
          foreignKey: 'code',
          as: 'roleList',
          fieldJson: {
            menu_auth: 0,
            status: 0,
            create_time: 0,
            update_time: 0,
          },
          limit: 10,
        },
      ],
    })
    return result
  }

  /**
   * 修改用户
   * @param entity 用户实体
   * @returns 成功时返回修改记录数，失败返回null
   */
  static async updateUser(entity: User): Promise<number> {
    if (!entity || !entity._id) return null

    const _id = entity._id
    delete entity._id
    const result = await nw.db.update({
      dbName: this._dbName,
      whereJson: {
        _id,
      },
      dataJson: entity,
    })
    // console.log('updateRole', result)
    return result
  }

  /**
   * 通过主键id删除用户
   * @param _id 主键id
   * @returns 成功时返回修改记录数，失败返回null
   */
  static async deleteUserById(_id: string): Promise<number> {
    if (!_id) return null

    const result = await nw.db.update({
      dbName: this._dbName,
      whereJson: {
        _id,
      },
      dataJson: {
        status: 9,
        update_time: Date.now(),
      },
    })
    return result
  }

  /**
   * 根据角色code查询用户是否拥有该权限
   * @param phone 角色code
   * @returns 拥有返回true，未拥有或失败返回false
   */
  static async isExistByRoleCode(roleCode: string): Promise<boolean> {
    if (!roleCode) return true

    const result = await nw.db.count({
      dbName: this._dbName,
      whereJson: {
        roles: _.in([roleCode]),
        status: _.neq(9),
      },
    })
    if (result == null) return true

    return result > 0
  }
}

/**
 * user
 */
export interface User {
  /**
   * 主键id
   */
  _id?: string
  /**
   * 用户token
   */
  access_token: string
  /**
   * 头像
   */
  avatar?: string
  /**
   * 可提现余额（分）
   */
  balance: number | null
  /**
   * 创建IP
   */
  create_ip: string
  /**
   * 创建时间
   */
  create_time: number
  /**
   * 邮箱
   */
  email: string
  /**
   * 赠送点数
   */
  gift_points: number | null
  /**
   * 是否超级管理员
   */
  is_super_admin?: boolean
  /**
   * 昵称
   */
  nickname?: string
  /**
   * 密码，初始密码123456
   */
  password: string
  /**
   * 手机号
   */
  phone: string
  /**
   * 可用点数
   */
  points: number | null
  /**
   * 角色，['admin']或['common']
   */
  roles: string[]
  /**
   * 状态，1已启用，2已禁用，9已删除
   */
  status: number
  /**
   * 更新时间
   */
  update_time: number
  /**
   * 用户名
   */
  username: string
}
