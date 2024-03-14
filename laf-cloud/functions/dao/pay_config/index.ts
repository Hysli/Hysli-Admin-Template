import nw from 'nw-lafjs'

import cloud from '@lafjs/cloud'
const db = cloud.database()
const _ = db.command

export class PayConfigDao {
  /**
   * 表名（支付配置）
   */
  static _dbName = 'pay_config'

  /**
   * 校验类型是否已存在
   * @param type 类型
   * @returns 不存在返回false，已存在或失败返回true
   */
  static async isExistByType(type: number, _id?: string): Promise<boolean> {
    if (!type) return true

    const result = await nw.db.count({
      dbName: this._dbName,
      whereJson: {
        _id: _id ? _.neq(_id) : undefined,
        type,
        status: _.neq(9),
      },
    })
    if (result == null) return true

    return result > 0
  }

  /**
   * 获取支付配置列表（带分页）
   * @param whereJson 查询条件JSON格式
   * @param pageIndex 当前页数
   * @param pageSize 每页数量
   * @param sortArr 排序规则
   * @returns 返回支付配置集合
   */
  static async getPayConfigList(
    whereJson: any,
    pageIndex: number,
    pageSize: number,
    sortArr?: Array<any>
  ): Promise<Array<PayConfig>> {
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
   * 根据主键id获取支付配置信息
   * @param _id 主键id
   * @returns 返回ArticleCategory实体
   */
  static async getInfoById(_id: string): Promise<PayConfig> {
    if (!_id) return null

    const result = await nw.db.findById({
      dbName: this._dbName,
      id: _id,
    })
    return result
  }

  /**
   * 通过类型查询支付配置
   * @param type 类型
   * @returns 返回PayConfig实体
   */
  static async findByType(type: number): Promise<PayConfig> {
    if (!type) return null

    const result = await nw.db.select({
      dbName: this._dbName,
      whereJson: {
        type,
        status: _.neq(9),
      },
      sortArr: [{ name: 'update_time', type: 'desc' }],
      pageSize: 1,
    })

    return result?.rows && result.rows.length > 0 ? result.rows[0] : null
  }

  /**
   * 添加支付配置
   * @param entity 支付配置实体
   * @returns 成功时返回id值，失败时返回null
   */
  static async addPayConfig(entity: PayConfig): Promise<any> {
    if (!entity) return null

    const result = await nw.db.add({
      dbName: this._dbName,
      dataJson: entity,
      cancelAddTime: true,
    })
    return result
  }

  /**
   * 修改支付配置
   * @param entity 支付配置实体
   * @returns 成功时返回修改记录数，失败返回null
   */
  static async updatePayConfig(entity: PayConfig): Promise<number> {
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
   * 通过主键id删除支付配置
   * @param _id 主键id
   * @returns 成功时返回修改记录数，失败返回null
   */
  static async deletePayConfigById(_id: string): Promise<number> {
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
 * pay_config
 */
export interface PayConfig {
  /**
   * 主键id
   */
  _id?: string
  /**
   * 应用id
   */
  app_id: string
  /**
   * 应用密钥
   */
  app_secret: string
  /**
   * 创建时间
   */
  create_time: number
  /**
   * 商户号
   */
  mch_id: string
  /**
   * 商户key
   */
  mch_key: string
  /**
   * 私钥
   */
  private_key: string
  /**
   * 公钥
   */
  public_key: string
  /**
   * 状态，1已启用，2已禁用，9已删除
   */
  status: number
  /**
   * 类型，10微信公众号，11微信小程序，20支付宝，30-Paypal，40-Stripe
   */
  type: number
  /**
   * 更新时间
   */
  update_time: number
}
