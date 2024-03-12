import nw from 'nw-lafjs'

import cloud from '@lafjs/cloud'
const db = cloud.database()
const _ = db.command

export class RechargeDao {
  /**
   * 表名（充值模板）
   */
  static _dbName = 'recharge_template'

  /**
   * 校验模板标题是否已存在
   * @param title 标题
   * @returns 不存在返回false，已存在或失败返回true
   */
  static async isExistByTemplateTitle(
    title: string,
    _id?: string
  ): Promise<boolean> {
    if (!title) return true

    const result = await nw.db.count({
      dbName: this._dbName,
      whereJson: {
        _id: _id ? _.neq(_id) : undefined,
        title,
        status: _.neq(9),
      },
    })
    if (result == null) return true

    return result > 0
  }

  /**
   * 获取充值模板列表（带分页）
   * @param whereJson 查询条件JSON格式
   * @param pageIndex 当前页数
   * @param pageSize 每页数量
   * @param sortArr 排序规则
   * @returns 返回充值模板集合
   */
  static async getRechargeTemplateList(
    whereJson: any,
    pageIndex: number,
    pageSize: number,
    sortArr?: Array<any>
  ): Promise<Array<RechargeTemplate>> {
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
   * 根据主键id获取充值模板信息
   * @param _id 主键id
   * @returns 返回RechargeTemplate实体
   */
  static async getInfoById(_id: string): Promise<RechargeTemplate> {
    if (!_id) return null

    const result = await nw.db.findById({
      dbName: this._dbName,
      id: _id,
    })
    return result
  }

  /**
   * 添加充值模板
   * @param entity 充值模板实体
   * @returns 成功时返回id值，失败时返回null
   */
  static async addRechargeTemplate(entity: RechargeTemplate): Promise<any> {
    if (!entity) return null

    const result = await nw.db.add({
      dbName: this._dbName,
      dataJson: entity,
      cancelAddTime: true,
    })
    return result
  }

  /**
   * 修改充值模板
   * @param entity 充值模板实体
   * @returns 成功时返回修改记录数，失败返回null
   */
  static async updateRechargeTemplate(
    entity: RechargeTemplate
  ): Promise<number> {
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
   * 通过主键id删除充值模板
   * @param _id 主键id
   * @returns 成功时返回修改记录数，失败返回null
   */
  static async deleteRechargeTemplateById(_id: string): Promise<number> {
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
 * recharge_template
 */
export interface RechargeTemplate {
  /**
   * 主键id
   */
  _id?: string
  /**
   * 创建时间
   */
  create_time: number
  /**
   * 赠送点数
   */
  gift_points: number
  /**
   * 充值点数
   */
  recharge_points: number
  /**
   * 售价，单位：分
   */
  sales_price: number
  /**
   * 排序
   */
  sort: number
  /**
   * 状态，1已启用，2已禁用，9已删除
   */
  status: number
  /**
   * 标题
   */
  title: string
  /**
   * 更新时间
   */
  update_time: number
}
