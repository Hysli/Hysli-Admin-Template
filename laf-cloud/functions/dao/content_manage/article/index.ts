import nw from 'nw-lafjs'

import cloud from '@lafjs/cloud'
const db = cloud.database()
const _ = db.command

export class ArticleManageDao {
  /**
   * 表名（文章管理）
   */
  static _dbName = 'article_manage'

  /**
   * 校验标题是否已存在
   * @param title 标题
   * @returns 不存在返回false，已存在或失败返回true
   */
  static async isExistByTitle(title: string, _id?: string): Promise<boolean> {
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
   * 获取文章列表（带分页）
   * @param whereJson 查询条件JSON格式
   * @param pageIndex 当前页数
   * @param pageSize 每页数量
   * @param sortArr 排序条件集合
   * @returns 返回文章集合
   */
  static async getArticleList(
    whereJson: any,
    pageIndex?: number,
    pageSize?: number,
    sortArr?: Array<any>
  ): Promise<Array<ArticleManage>> {
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
          dbName: 'article_category',
          localKey: 'category_id',
          foreignKey: '_id',
          as: 'articleCategory',
          limit: 1,
        },
      ],
    })
    return result
  }

  /**
   * 根据主键id获取文章信息
   * @param _id 主键id
   * @returns 返回ArticleManage实体
   */
  static async getInfoById(_id: string): Promise<ArticleManage> {
    if (!_id) return null

    const result = await nw.db.findById({
      dbName: this._dbName,
      id: _id,
    })
    return result
  }

  /**
   * 添加文章
   * @param entity 文章实体
   * @returns 成功时返回id值，失败时返回null
   */
  static async addArticle(entity: ArticleManage): Promise<any> {
    if (!entity) return null

    const result = await nw.db.add({
      dbName: this._dbName,
      dataJson: entity,
      cancelAddTime: true,
    })
    return result
  }

  /**
   * 修改文章
   * @param entity 文章实体
   * @returns 成功时返回修改记录数，失败返回null
   */
  static async updateArticle(entity: ArticleManage): Promise<number> {
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
   * 通过主键id删除文章
   * @param _id 主键id
   * @returns 成功时返回修改记录数，失败返回null
   */
  static async deleteArticleById(_id: string): Promise<number> {
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
 * article_manage
 */
export interface ArticleManage {
  /**
   * 主键id
   */
  _id?: string
  /**
   * 分类id
   */
  category_id: string
  /**
   * 内容
   */
  content?: string
  /**
   * 创建时间
   */
  create_time: number
  /**
   * 简介
   */
  introduction?: string
  /**
   * 图片
   */
  picture?: string
  /**
   * 发布日期，年-月-日（时间戳）
   */
  release_date: number
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
