import nw from 'nw-lafjs'

import cloud from '@lafjs/cloud'
const db = cloud.database()
const _ = db.command

export class LafEnvDao {
  /**
   * 表名（系统参数）
   */
  static _dbName = 'laf_env'

  /**
   * 校验key是否已存在
   * @param key key
   * @returns 不存在返回false，已存在或失败返回true
   */
  static async isExistByKey(key: string, _id?: string): Promise<boolean> {
    if (!key) return true

    const result = await nw.db.count({
      dbName: this._dbName,
      whereJson: {
        _id: _id ? _.neq(_id) : undefined,
        key,
        status: _.neq(9),
      },
    })
    if (result == null) return true

    return result > 0
  }

  /**
   * 获取系统参数列表（带分页）
   * @param whereJson 查询条件JSON格式
   * @param pageIndex 当前页数
   * @param pageSize 每页数量
   * @param sortArr 排序规则
   * @returns 返回系统参数集合
   */
  static async getSystemParamterList(
    whereJson: any,
    pageIndex: number,
    pageSize: number,
    sortArr?: Array<any>
  ): Promise<Array<LafEnv>> {
    const result = await nw.db.select({
      dbName: this._dbName,
      whereJson,
      pageIndex,
      pageSize,
      sortArr:
        !sortArr || sortArr.length == 0
          ? [{ name: 'create_time', type: 'desc' }]
          : sortArr,
      getCount: true,
    })
    return result
  }

  /**
   * 根据主键id获取系统参数信息
   * @param _id 主键id
   * @returns 返回LafEnv实体
   */
  static async getInfoById(_id: string): Promise<LafEnv> {
    if (!_id) return null

    const result = await nw.db.findById({
      dbName: this._dbName,
      id: _id,
    })
    return result
  }

  /**
   * 添加系统参数
   * @param entity 系统参数实体
   * @returns 成功时返回id值，失败时返回null
   */
  static async addSystemParam(entity: LafEnv): Promise<any> {
    if (!entity) return null

    const result = await nw.db.add({
      dbName: this._dbName,
      dataJson: entity,
      cancelAddTime: true,
    })
    return result
  }

  /**
   * 修改系统参数
   * @param entity 系统参数实体
   * @returns 成功时返回修改记录数，失败返回null
   */
  static async updateSystemParam(entity: LafEnv): Promise<number> {
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
   * 通过主键id删除系统参数
   * @param _id 主键id
   * @returns 成功时返回修改记录数，失败返回null
   */
  static async deleteSystemParamById(_id: string): Promise<number> {
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
}

/**
 * laf_env
 */
export interface LafEnv {
  /**
   * 主键id
   */
  _id?: string
  /**
   * 创建时间
   */
  create_time: number
  /**
   * 分组，sms-短信，emai-邮件，storage-存储
   */
  group?: string
  /**
   * key值
   */
  key: string
  /**
   * 名称
   */
  name: string
  /**
   * 状态，1已启用，2已禁用，9已删除
   */
  status: number
  /**
   * 更新时间
   */
  update_time: number
  /**
   * value值
   */
  value: string
}
