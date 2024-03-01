import nw from 'nw-lafjs'
import { ObjectId } from 'mongodb'

import cloud from '@lafjs/cloud'
const db = cloud.database()
const _ = db.command

export class RoleManageDao {
  /**
   * 表名
   */
  static _dbName = 'role_manage'

  /**
   * 根据角色code集合查询角色列表
   * @param codes 角色code集合
   * @returns 成功时返回RoleManage数组，失败返回null
   */
  static async findListByCodes(codes: string[]): Promise<Array<RoleManage>> {
    if (!codes || codes.length == 0) return null

    const result = await nw.db.findListByWhereJson({
      dbName: this._dbName,
      whereJson: {
        code: _.in(codes),
        status: _.eq(1)
      },
      fieldJson: {
        status: 0,
        create_time: 0,
        update_time: 0
      }
    })
    return result
  }

  /**
   * 获取角色列表（带分页）
   * @param whereJson 查询条件JSON格式
   * @param pageIndex 当前页数
   * @param pageSize 每页数量
   * @returns 返回角色集合
   */
  static async getRoleList(
    whereJson: any,
    pageIndex: number,
    pageSize: number
  ): Promise<Array<RoleManage>> {
    const result = await nw.db.select({
      dbName: this._dbName,
      whereJson,
      pageIndex,
      pageSize,
      sortArr: [{ name: '_id', type: 'desc' }],
      getCount: true
    })
    return result
  }

  /**
   * 根据主键id获取角色信息
   * @param _id 主键id
   * @returns 返回RoleManage实体
   */
  static async getInfoById(_id: string): Promise<RoleManage> {
    if (!_id) return null

    const result = await nw.db.findById({
      dbName: this._dbName,
      id: _id
    })
    return result
  }

  /**
   * 添加角色
   * @param entity 角色实体
   * @description  默认用 new ObjectId().toString() 方式生成 _id
   * @returns 成功时返回id值，失败时返回null
   */
  static async addRole(entity: RoleManage): Promise<any> {
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
   * 修改角色
   * @param entity 角色实体
   * @returns 成功时返回修改记录数，失败返回null
   */
  static async updateRole(entity: RoleManage): Promise<number> {
    if (!entity || !entity._id) return null

    const _id = entity._id
    delete entity._id
    const result = await nw.db.update({
      dbName: this._dbName,
      whereJson: {
        _id
      },
      dataJson: entity
    })
    return result
  }

  /**
   * 通过主键id删除角色
   * @param _id 主键id
   * @returns 成功时返回修改记录数，失败返回null
   */
  static async deleteRoleById(_id: string): Promise<number> {
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
   * 根据菜单id查询角色是否拥有该权限
   * @param menuId 菜单id
   * @returns 拥有返回true，未拥有或失败返回false
   */
  static async isExistByMenuId(menuId: string): Promise<boolean> {
    if (!menuId) return true

    const result = await nw.db.count({
      dbName: this._dbName,
      whereJson: {
        menu_auth: _.in([menuId]),
        status: _.neq(9)
      }
    })
    if (result == null) return true

    return result > 0
  }

  /**
   * 根据角色code查询角色列表
   * @param code 角色code
   * @returns 成功时返回RoleManage数组，失败返回null
   */
  static async findListByCode(code: string): Promise<Array<RoleManage>> {
    if (!code) return null

    const result = await nw.db.findListByWhereJson({
      dbName: this._dbName,
      whereJson: {
        code: _.eq(code),
        status: _.neq(9)
      }
    })
    return result
  }
}

/**
 * role_manage
 */
export interface RoleManage {
  /**
   * id
   */
  _id?: string
  /**
   * 接口权限集合
   */
  api_permissions: string[]
  /**
   * 编码
   */
  code: string
  /**
   * 创建时间
   */
  create_time: number
  /**
   * 描述
   */
  description: string
  /**
   * 菜单权限id集合
   */
  menu_auth: string[]
  /**
   * 名称
   */
  name: string
  /**
   * 状态（1已启用，2已禁用，9已删除）
   */
  status: number
  /**
   * 更新时间
   */
  update_time: number
}
