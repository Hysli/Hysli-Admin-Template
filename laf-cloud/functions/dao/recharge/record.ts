import nw from 'nw-lafjs'

import cloud from '@lafjs/cloud'
const db = cloud.database()
const _ = db.command

export class RechargeRecordDao {
  /**
   * 表名
   */
  static _dbName = 'recharge_record'

  /**
   * 获取充值记录列表（带分页）
   * @param whereJson 查询条件JSON格式
   * @param pageIndex 当前页数
   * @param pageSize 每页数量
   * @param sortArr 排序规则
   * @returns 返回充值记录集合
   */
  static async getRechargeRecordList(
    whereJson: any,
    pageIndex: number,
    pageSize: number,
    sortArr?: Array<any>
  ): Promise<Array<RechargeRecord>> {
    const result = await nw.db.selects({
      dbName: this._dbName,
      whereJson,
      pageIndex,
      pageSize,
      sortArr:
        !sortArr || sortArr.length == 0
          ? [{ name: 'update_time', type: 'desc' }]
          : sortArr,
      getCount: true,
      foreignDB: [
        {
          dbName: 'user',
          foreignKey: '_id',
          localKey: 'uid',
          as: 'user',
          limit: 1,
          fieldJson: {
            phone: 1,
            email: 1,
          },
        },
        {
          dbName: 'recharge_order',
          foreignKey: '_id',
          localKey: 'order_id',
          as: 'rechargeOrder',
          limit: 1,
          fieldJson: {
            pay_method: 0,
            pay_amount: 0,
            pay_time: 0,
            create_time: 0,
            cancel_time: 0,
            transaction_id: 0,
            callback_detail: 0,
            callback_time: 0,
          },
        },
        {
          dbName: 'cdkey_manage',
          foreignKey: '_id',
          localKey: 'cdkey_id',
          as: 'cdkeyManage',
          limit: 1,
          fieldJson: {
            amount: 0,
            expires_time: 0,
            is_gift: 0,
            status: 0,
            create_time: 0,
            update_time: 0,
          },
        },
      ],
    })
    return result
  }

  /**
   * 添加充值记录
   * @param entity 充值记录实体
   * @returns 成功时返回id值，失败时返回null
   */
  static async addRechargeRecord(entity: RechargeRecord): Promise<any> {
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
 * recharge_record
 */
export interface RechargeRecord {
  /**
   * 主键id
   */
  _id?: string
  /**
   * 卡密id
   */
  cdkey_id: string
  /**
   * 创建时间
   */
  create_time: number
  /**
   * 赠送点数
   */
  gift_points: number
  /**
   * 订单id
   */
  order_id: string
  /**
   * 支付金额，单位：分
   */
  pay_amount: number
  /**
   * 充值点数
   */
  recharge_points: number
  /**
   * 用户id
   */
  uid: string
}
