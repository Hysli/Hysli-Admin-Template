import nw from 'nw-lafjs'

import cloud from '@lafjs/cloud'
const db = cloud.database()
const _ = db.command

export class OperateLogDao {
  /**
   * 表名（操作日志）
   */
  static _dbName = 'operate_log'

  /**
   * 获取操作日志列表（带分页）
   * @param whereJson 查询条件JSON格式
   * @param pageIndex 当前页数
   * @param pageSize 每页数量
   * @param sortArr 排序规则
   * @returns 返回操作日志集合
   */
  static async getOperateLogList(
    whereJson: any,
    pageIndex: number,
    pageSize: number,
    sortArr?: Array<any>
  ): Promise<Array<OperateLog>> {
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
   * 添加操作日志
   * @param entity 操作日志实体
   * @returns 成功时返回id值，失败时返回null
   */
  static async addOperateLog(entity: OperateLog): Promise<any> {
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
 * operate_log
 */
export interface OperateLog {
  /**
   * 主键id
   */
  _id?: string
  /**
   * 修改的数据内容
   */
  content: string
  /**
   * 创建时间
   */
  create_time?: number
  /**
   * 访问IP
   */
  ip?: string
  /**
   * 调用的云函数地址
   */
  path?: string
  /**
   * 操作类型，update-更新，add-添加，delete-删除，get-查询
   */
  type: string
  /**
   * 操作人id
   */
  uid: string
}
