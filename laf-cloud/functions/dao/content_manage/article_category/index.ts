import nw from 'nw-lafjs'

import cloud from '@lafjs/cloud'
const db = cloud.database()
const _ = db.command

export class ArticleCategoryDao {
  /**
   * 表名（文章分类）
   */
  static _dbName = 'article_category'

  /**
   * 校验名称是否已存在
   * @param name 名称
   * @returns 不存在返回false，已存在或失败返回true
   */
  static async isExistByName(name: string, _id?: string): Promise<boolean> {
    if (!name) return true

    const result = await nw.db.count({
      dbName: this._dbName,
      whereJson: {
        _id: _id ? _.neq(_id) : undefined,
        name,
        status: _.neq(9),
      },
    })
    if (result == null) return true

    return result > 0
  }

  /**
   * 获取文章分类列表（带分页）
   * @param whereJson 查询条件JSON格式
   * @param pageIndex 当前页数
   * @param pageSize 每页数量
   * @param sortArr 排序规则
   * @returns 返回文章分类集合
   */
  static async getArticleCategoryList(
    whereJson: any,
    pageIndex: number,
    pageSize: number,
    sortArr?: Array<any>
  ): Promise<Array<ArticleCategory>> {
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
   * 根据主键id获取文章分类信息
   * @param _id 主键id
   * @returns 返回ArticleCategory实体
   */
  static async getInfoById(_id: string): Promise<ArticleCategory> {
    if (!_id) return null

    const result = await nw.db.findById({
      dbName: this._dbName,
      id: _id,
    })
    return result
  }

  /**
   * 添加文章分类
   * @param entity 文章分类实体
   * @returns 成功时返回id值，失败时返回null
   */
  static async addArticleCategory(entity: ArticleCategory): Promise<any> {
    if (!entity) return null

    const result = await nw.db.add({
      dbName: this._dbName,
      dataJson: entity,
      cancelAddTime: true,
    })
    return result
  }

  /**
   * 修改文章分类
   * @param entity 文章分类
   * @returns 成功时返回修改记录数，失败返回null
   */
  static async updateArticleCategory(entity: ArticleCategory): Promise<number> {
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
   * 通过主键id删除文章分类
   * @param _id 主键id
   * @returns 成功时返回修改记录数，失败返回null
   */
  static async deleteArticleCategoryById(_id: string): Promise<number> {
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
 * article_category
 */
export interface ArticleCategory {
  /**
   * 主键id
   */
  _id?: string
  /**
   * 创建时间
   */
  create_time: number
  /**
   * 描述
   */
  description?: string
  /**
   * 名称
   */
  name: string
  /**
   * 排序
   */
  sort: number
  /**
   * 状态，1已启用，2已禁用，9已删除
   */
  status: number
  /**
   * 更新时间
   */
  update_time: number
}
