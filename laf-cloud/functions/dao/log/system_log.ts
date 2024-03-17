import nw from 'nw-lafjs'

import cloud from '@lafjs/cloud'
const db = cloud.database()
const _ = db.command

export class ConsoleLogsDao {
  /**
   * 表名（系统日志）
   */
  static _dbName = 'console_logs'

  /**
   * 获取系统日志列表（带分页）
   * @param whereJson 查询条件JSON格式
   * @param pageIndex 当前页数
   * @param pageSize 每页数量
   * @param sortArr 排序规则
   * @returns 返回系统日志集合
   */
  static async getConsoleLogsList(
    whereJson: any,
    pageIndex: number,
    pageSize: number,
    sortArr?: Array<any>
  ): Promise<Array<ConsoleLogs>> {
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
   * 添加系统日志
   * @param entity 系统日志实体
   * @returns 成功时返回id值，失败时返回null
   */
  static async addConsoleLogs(entity: ConsoleLogs): Promise<any> {
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
 * console_logs
 */
export interface ConsoleLogs {
  /**
   * 主键id
   */
  _id?: string
  /**
   * 参数
   */
  args: string
  /**
   * 内容
   */
  caller: string
  /**
   * 创建时间
   */
  create_time: number
  /**
   * 日志类型，debug，error，add
   */
  method: string
}
