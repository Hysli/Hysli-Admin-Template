import nw from 'nw-lafjs'

import cloud from '@lafjs/cloud'
const db = cloud.database()
const _ = db.command

export class RechargeOrderDao {
  /**
   * 表名（充值订单）
   */
  static _dbName = 'recharge_order'

  /**
   * 根据主键id获取充值订单信息
   * @param _id 主键id
   * @returns 返回RechargeOrder实体
   */
  static async getInfoById(_id: string): Promise<RechargeOrder> {
    if (!_id) return null

    const result = await nw.db.findById({
      dbName: this._dbName,
      id: _id,
      fieldJson: {
        callback_detail: 0,
        callback_time: 0,
      },
    })
    return result
  }

  /**
   * 添加充值订单
   * @param entity 充值订单实体
   * @returns 成功时返回id值，失败时返回null
   */
  static async addRechargeOrder(entity: RechargeOrder): Promise<any> {
    if (!entity) return null

    const result = await nw.db.add({
      dbName: this._dbName,
      dataJson: entity,
      cancelAddTime: true,
    })
    return result
  }

  /**
   * 修改充值订单
   * @param entity 充值订单实体
   * @returns 成功时返回修改记录数，失败返回null
   */
  static async updateRechargeOrder(entity: RechargeOrder): Promise<number> {
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
}

/**
 * recharge_order
 */
export interface RechargeOrder {
  /**
   * 主键id
   */
  _id?: string
  /**
   * 支付回调详情
   */
  callback_detail:
    | any[]
    | boolean
    | number
    | number
    | { [key: string]: any }
    | null
    | string
  /**
   * 支付回调时间
   */
  callback_time: number
  /**
   * 取消时间
   */
  cancel_time: number
  /**
   * 创建时间
   */
  create_time: number
  /**
   * 赠送点数
   */
  gift_points: number
  /**
   * 订单金额，单位：分
   */
  order_amount: number
  /**
   * 订单描述
   */
  order_desc: string
  /**
   * 支付金额，单位：分
   */
  pay_amount: number
  /**
   * 支付方式，10-微信公众号，11-微信小程序，20-支付宝，30-Paypal，40-Stripe
   */
  pay_method: number
  /**
   * 支付状态，pending请求中，fail失败，success成功
   */
  pay_status: string
  /**
   * 支付时间
   */
  pay_time: number
  /**
   * 充值点数
   */
  recharge_points: number
  /**
   * 充值模板id
   */
  recharge_template_id: string
  /**
   * 交易流水号
   */
  transaction_id: string
  /**
   * 用户id
   */
  uid: string
}
