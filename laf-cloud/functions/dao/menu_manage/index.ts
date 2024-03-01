import nw from 'nw-lafjs'
import { ObjectId } from 'mongodb'

import cloud from '@lafjs/cloud'
const db = cloud.database()
const _ = db.command

export class MenuManageDao {
  /**
   * 表名
   */
  static _dbName = 'menu_manage'

  /**
   * 根据菜单id集合查询菜单列表
   * @param _ids 菜单id集合
   * @returns 成功时返回MenuManage数组，失败返回null
   */
  static async findListByIds(_ids: string[]): Promise<Array<MenuManage>> {
    if (!_ids || _ids.length == 0) return null

    const result = await nw.db.findListByWhereJson({
      dbName: this._dbName,
      whereJson: {
        _id: _.in(_ids),
        status: _.eq(1)
      },
      fieldJson: {
        status: 0,
        create_time: 0,
        update_time: 0
      },
      sortArr: [
        // { name: '_id', type: 'asc' },
        { name: 'sort', type: 'asc' }
      ]
    })
    return result
  }

  /**
   * 获取菜单列表
   * @param whereJson 查询条件JSON格式
   * @returns 返回菜单集合
   */
  static async getMenuList(whereJson: any): Promise<Array<MenuManage>> {
    const result = await nw.db.findListByWhereJson({
      dbName: this._dbName,
      whereJson,
      sortArr: [
        // { name: '_id', type: 'asc' },
        { name: 'sort', type: 'asc' }
      ]
    })
    return result
  }

  /**
   * 根据主键id获取菜单信息
   * @param _id 主键id
   * @returns 返回MenuManage实体
   */
  static async getInfoById(_id: string): Promise<MenuManage> {
    if (!_id) return null

    const result = await nw.db.findById({
      dbName: this._dbName,
      id: _id
    })
    return result
  }

  /**
   * 添加菜单
   * @param entity 菜单实体
   * @description  默认用 new ObjectId().toString() 方式生成 _id
   * @returns 成功时返回id值，失败时返回null
   */
  static async addMenu(entity: MenuManage): Promise<any> {
    if (!entity) return null

    if (!entity._id) {
      entity._id = new ObjectId().toString()
    }
    const result = await nw.db.add({
      dbName: this._dbName,
      dataJson: entity,
      cancelAddTime: true
    })
    return result
  }

  /**
   * 修改菜单
   * @param entity 菜单实体
   * @returns 成功时返回修改记录数，失败返回null
   */
  static async updateMenu(entity: MenuManage): Promise<number> {
    if (!entity || !entity._id) return null

    const _id = entity._id
    delete entity._id
    if (entity['children']) {
      delete entity['children']
    }
    const result = await nw.db.update({
      dbName: this._dbName,
      whereJson: {
        _id
      },
      dataJson: entity
    })
    // console.log('updateMenu', result)
    return result
  }

  /**
   * 通过主键id删除菜单
   * @param _id 主键id
   * @returns 成功时返回修改记录数，失败返回null
   */
  static async deleteMenuById(_id: string): Promise<number> {
    if (!_id) return null

    const result = await nw.db.update({
      dbName: this._dbName,
      whereJson: {
        _id
      },
      dataJson: {
        status: 9,
        update_time: Date.now()
      }
    })
    return result
  }

  /**
   * 根据主键id查询是否存在子菜单
   * @param menuId 菜单id
   * @returns 拥有返回true，未拥有或失败返回false
   */
  static async isExistSubMenuById(_id: string): Promise<boolean> {
    if (!_id) return true

    const result = await nw.db.count({
      dbName: this._dbName,
      whereJson: {
        parent_id: _.eq(_id),
        status: _.neq(9)
      }
    })
    if (result == null) return true

    return result > 0
  }
}

/**
 * menu_manage
 */
export interface MenuManage {
  /**
   * id
   */
  _id?: string
  /**
   * 组件路径
   */
  component: string
  /**
   * 创建时间
   */
  create_time: number
  /**
   * 图标
   */
  icon: string
  /**
   * 是否固定
   */
  is_affix: boolean
  /**
   * 是否内嵌
   */
  is_frame: boolean
  /**
   * 是否隐藏
   */
  is_hide: boolean
  /**
   * 是否缓存
   */
  is_keep_alive: boolean
  /**
   * 路由名称
   */
  name: string
  /**
   * 外链链接
   */
  out_link: string
  /**
   * 父级id
   */
  parent_id: string
  /**
   * 路由路径
   */
  path: string
  /**
   * 权限标识
   */
  permission: string
  /**
   * 重定向地址
   */
  redirect: string
  /**
   * 备注
   */
  remark: string
  /**
   * 排序
   */
  sort: number
  /**
   * 状态（1已启用，2已禁用，9已删除）
   */
  status: number
  /**
   * 菜单名称
   */
  title: string
  /**
   * 类型（1目录，2菜单，3按钮）
   */
  type: number
  /**
   * 更新时间
   */
  update_time: number
}
