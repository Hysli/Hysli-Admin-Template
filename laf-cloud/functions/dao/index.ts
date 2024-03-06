import { UserDao, User } from '@/dao/user/index'
import { UserLoginLogDao, UserLoginLog } from '@/dao/user/login_log'
import { MenuManageDao, MenuManage } from '@/dao/menu_manage/index'
import { RoleManageDao, RoleManage } from '@/dao/role_manage/index'
import { MailLogDao, MailLog } from '@/dao/log_manage/mail_log'
import { SmsLogDao, SmsLog } from '@/dao/log_manage/sms_log'

export const dao: DaoType = {
  userDao: UserDao,
  mailLogDao: MailLogDao,
  smsLogDao: SmsLogDao,
  userLoginLogDao: UserLoginLogDao,
  menuManageDao: MenuManageDao,
  roleManageDao: RoleManageDao
}

/**
 * dao层接口
 */
export interface DaoType {
  userDao: {
    /**
   * 通过用户名查询用户
   * @param username 用户名
   * @returns 返回User实体
   */
    findByUserName: (username: string) => Promise<User>
    /**
     * 通过手机号或者邮箱查询用户（邮箱和手机号不能同时为空）
     * @param email 邮箱
     * @param phone 手机号
     * @returns 返回User实体
     */
    findByPhoneOrEmail: (email: string, phone: string) => Promise<User>
    /**
     * 添加用户
     * @param entity 用户实体
     * @description  默认用 new ObjectId().toString() 方式生成 _id
     * @returns 成功时返回id值，失败时返回null
     */
    addUser: (entity: User) => Promise<any>
    /**
   * 用户名是否已经注册
   * @param username 用户名
   * @param _id 用户id
   * @returns 未注册返回false，已注册或失败返回true
   */
    isRegisterByUserName: (
      username: string,
      _id?: string
    ) => Promise<boolean>
    /**
     * 用户邮箱是否已经注册
     * @param email 邮箱
     * @param _id 用户id
     * @returns 未注册返回false，已注册或失败返回true
     */
    isRegisterByEmail: (email: string, _id?: string) => Promise<boolean>
    /**
     * 用户手机号是否已经注册
     * @param phone 手机号
     * @param _id 用户id
     * @returns 未注册返回false，已注册或失败返回true
     */
    isRegisterByPhone: (phone: string, _id?: string) => Promise<boolean>
    /**
     * 通过主键id更新用户access_token
     * @param _id 主键id
     * @param access_token access_token
     * @returns 成功时返回修改记录数，失败返回null
     */
    updateAccessTokenById: (_id: string, accessToken: string) => Promise<number>
    /**
     * 根据主键id获取用户信息
     * @param _id 主键id
     * @returns 返回User实体
     */
    getInfoById: (_id: string) => Promise<User>
    /**
     * 获取用户列表（带分页）
     * @param whereJson 查询条件JSON格式
     * @param pageIndex 当前页数
     * @param pageSize 每页数量
     * @returns 返回用户集合
     */
    getUserList: (
      whereJson: any,
      pageIndex: number,
      pageSize: number
    ) => Promise<Array<User>>
    /**
     * 修改用户
     * @param entity 用户实体
     * @returns 成功时返回修改记录数，失败返回null
     */
    updateUser: (entity: User) => Promise<number>
    /**
     * 通过主键id删除用户
     * @param _id 主键id
     * @returns 成功时返回修改记录数，失败返回null
     */
    deleteUserById(_id: string): Promise<number>
    /**
     * 根据角色code查询用户是否拥有该权限
     * @param phone 角色code
     * @returns 拥有返回true，未拥有或失败返回false
     */
    isExistByRoleCode(roleCode: string): Promise<boolean>
  }
  menuManageDao: {
    /**
     * 根据菜单id集合查询菜单列表
     * @param _ids 菜单id集合
     * @returns 成功时返回MenuManage数组，失败返回null
     */
    findListByIds: (_ids: string[]) => Promise<Array<MenuManage>>
    /**
     * 获取菜单列表
     * @param whereJson 查询条件JSON格式
     * @returns 返回菜单集合
     */
    getMenuList: (whereJson: any) => Promise<Array<MenuManage>>
    /**
     * 根据主键id获取菜单信息
     * @param _id 主键id
     * @returns 返回MenuManage实体
     */
    getInfoById(_id: string): Promise<MenuManage>
    /**
     * 添加菜单
     * @param entity 菜单实体
     * @description  默认用 new ObjectId().toString() 方式生成 _id
     * @returns 成功时返回id值，失败时返回null
     */
    addMenu(entity: MenuManage): Promise<any>
    /**
     * 修改菜单
     * @param entity 菜单实体
     * @returns 成功时返回修改记录数，失败返回null
     */
    updateMenu(entity: MenuManage): Promise<number>
    /**
     * 通过主键id删除菜单
     * @param _id 主键id
     * @returns 成功时返回修改记录数，失败返回null
     */
    deleteMenuById(_id: string): Promise<number>
    /**
     * 根据主键id查询是否存在子菜单
     * @param menuId 菜单id
     * @returns 拥有返回true，未拥有或失败返回false
     */
    isExistSubMenuById(_id: string): Promise<boolean>
  }
  roleManageDao: {
    /**
     * 根据角色code集合查询角色列表
     * @param codes 角色code集合
     * @returns 成功时返回RoleManage数组，失败返回null
     */
    findListByCodes: (codes: string[]) => Promise<Array<RoleManage>>
    /**
     * 获取角色列表（带分页）
     * @param whereJson 查询条件JSON格式
     * @param pageIndex 当前页数
     * @param pageSize 每页数量
     * @returns 返回用户集合
     */
    getRoleList: (
      whereJson: any,
      pageIndex: number,
      pageSize: number
    ) => Promise<Array<RoleManage>>
    /**
     * 根据主键id获取角色信息
     * @param _id 主键id
     * @returns 返回RoleManage实体
     */
    getInfoById(_id: string): Promise<RoleManage>
    /**
     * 添加角色
     * @param entity 角色实体
     * @description  默认用 new ObjectId().toString() 方式生成 _id
     * @returns 成功时返回id值，失败时返回null
     */
    addRole(entity: RoleManage): Promise<any>
    /**
     * 修改角色
     * @param entity 角色实体
     * @returns 成功时返回修改记录数，失败返回null
     */
    updateRole(entity: RoleManage): Promise<number>
    /**
     * 通过主键id删除角色
     * @param _id 主键id
     * @returns 成功时返回修改记录数，失败返回null
     */
    deleteRoleById(_id: string): Promise<number>
    /**
     * 根据菜单id查询角色是否拥有该权限
     * @param menuId 菜单id
     * @returns 拥有返回true，未拥有或失败返回false
     */
    isExistByMenuId(menuId: string): Promise<boolean>
    /**
     * 根据角色code查询角色列表
     * @param code 角色code
     * @returns 成功时返回RoleManage数组，失败返回null
     */
    findListByCode(code: string): Promise<Array<RoleManage>>
  }
  userLoginLogDao: {
    /**
     * 添加用户登录日志
     * @param entity 登录日志实体
     * @returns 成功时返回id值，失败时返回null
     */
    addUserLoginLog: (entity: UserLoginLog) => Promise<any>
  }
  mailLogDao: {
    /**
     * 获取最后一条邮件日志记录
     * @param fromEmail 发送者邮箱
     * @param toEmail 接收者邮箱
     * @param code 验证码
     * @param type 类型 {'register':'注册,'login':'登录'}
     * @returns 返回MailLog实体
     */
    findLastByWhere: (
      fromEmail: string,
      toEmail: string,
      code: string,
      type: string
    ) => Promise<MailLog>
    /**
     * 添加邮件日志
     * @param entity 邮件日志实体
     * @returns 成功时返回id值，失败时返回null
     */
    addMailLog: (entity: MailLog) => Promise<any>
    /**
     * 通过主键id修改状态
     * @param _id 主键id
     * @param status 状态
     * @returns 成功时返回修改记录数，失败返回null
     */
    updateStatusById: (_id: string, status: string) => Promise<number>
  }
  smsLogDao: {
    /**
     * 获取最后一条短信日志记录
     * @param phone 手机号
     * @param code 验证码
     * @param type 类型 {'register':'注册,'login':'登录'}
     * @returns 返回SmsLog实体
     */
    findLastByWhere: (
      phone: string,
      code: string,
      type: string
    ) => Promise<SmsLog>
    /**
     * 添加短信日志
     * @param entity 短信日志实体
     * @returns 成功时返回id值，失败时返回null
     */
    addSmsLog: (entity: SmsLog) => Promise<any>
    /**
     * 通过主键id修改状态
     * @param _id 主键id
     * @param status 状态
     * @returns 成功时返回修改记录数，失败返回null
     */
    updateStatusById: (_id: string, status: string) => Promise<number>
  }
}
