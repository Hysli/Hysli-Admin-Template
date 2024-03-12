import nw from 'nw-lafjs'

import cloud from '@lafjs/cloud'
const db = cloud.database()
const _ = db.command

export class CdkeyManageDao {
  /**
   * 表名（卡密管理）
   */
  static _dbName = 'cdkey_manage'

  /**
   * 校验密钥是否已存在
   * @param name 密钥
   * @returns 不存在返回false，已存在或失败返回true
   */
  static async isExistBySecretKey(
    secretKey: string,
    _id?: string
  ): Promise<boolean> {
    if (!secretKey) return true

    const result = await nw.db.count({
      dbName: this._dbName,
      whereJson: {
        _id: _id ? _.neq(_id) : undefined,
        secret_key: secretKey,
        status: _.neq(9),
      },
    })
    if (result == null) return true

    return result > 0
  }

  /**
   * 获取卡密列表（带分页）
   * @param whereJson 查询条件JSON格式
   * @param pageIndex 当前页数
   * @param pageSize 每页数量
   * @param sortArr 排序规则
   * @returns 返回卡密集合
   */
  static async getCdkeyList(
    whereJson: any,
    pageIndex: number,
    pageSize: number,
    sortArr?: Array<any>
  ): Promise<Array<CdkeyManage>> {
    const result = await nw.db.select({
      dbName: this._dbName,
      whereJson,
      pageIndex,
      pageSize,
      sortArr:
        !sortArr || sortArr.length == 0
          ? [{ name: 'update_time', type: 'desc' }]
          : sortArr,
      getCount: true,
    })
    return result
  }

  /**
   * 根据主键id获取卡密信息
   * @param _id 主键id
   * @returns 返回CdkeyManage实体
   */
  static async getInfoById(_id: string): Promise<CdkeyManage> {
    if (!_id) return null

    const result = await nw.db.findById({
      dbName: this._dbName,
      id: _id,
    })
    return result
  }

  /**
   * 添加卡密
   * @param entity 卡密实体
   * @returns 成功时返回id值，失败时返回null
   */
  static async addCdkey(entity: CdkeyManage): Promise<any> {
    if (!entity) return null

    const result = await nw.db.add({
      dbName: this._dbName,
      dataJson: entity,
      cancelAddTime: true,
    })
    return result
  }

  /**
   * 修改卡密
   * @param entity 卡密实体
   * @returns 成功时返回修改记录数，失败返回null
   */
  static async updateCdkey(entity: CdkeyManage): Promise<number> {
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
    return result
  }

  /**
   * 通过主键id删除卡密
   * @param _id 主键id
   * @returns 成功时返回修改记录数，失败返回null
   */
  static async deleteCdkeyById(_id: string): Promise<number> {
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
   * 通过密钥查询卡密
   * @param secretKey 密钥
   * @returns 返回CdkeyManage实体
   */
  static async findBySecretKey(secretKey: string): Promise<CdkeyManage> {
    if (!secretKey) return null

    const result = await nw.db.select({
      dbName: this._dbName,
      whereJson: {
        secret_key: secretKey,
        status: _.neq(9),
      },
      sortArr: [{ name: '_id', type: 'desc' }],
      pageSize: 1,
    })

    return result?.rows && result.rows.length > 0 ? result.rows[0] : null
  }
}

/**
 * cdkey_manage
 */
export interface CdkeyManage {
  /**
   * 主键id
   */
  _id?: string
  /**
   * 创建时间
   */
  create_time: number
  /**
   * 过期时间
   */
  expires_time: number
  /**
   * 是否计入赠送
   */
  is_gift: boolean
  /**
   * 点数
   */
  points: number
  /**
   * 前缀
   */
  prefix?: string
  /**
   * 密钥
   */
  secret_key: string
  /**
   * 状态，1已启用，2已禁用，9已删除
   */
  status: number
  /**
   * 使用人id
   */
  uid?: string
  /**
   * 更新时间
   */
  update_time: number
  /**
   * 使用时间
   */
  use_time?: number
}
