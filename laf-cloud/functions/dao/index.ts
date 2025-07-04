import { UserDao, User } from '@/dao/user/index'
import { UserLoginLogDao, UserLoginLog } from '@/dao/user/login_log'
import { MenuManageDao, MenuManage } from '@/dao/menu_manage/index'
import { RoleManageDao, RoleManage } from '@/dao/role_manage/index'
import { MailLogDao, MailLog } from '@/dao/log_manage/mail_log'
import { SmsLogDao, SmsLog } from '@/dao/log_manage/sms_log'
import { RechargeDao, RechargeTemplate } from '@/dao/recharge/template'
import { RechargeOrderDao, RechargeOrder } from '@/dao/recharge/order'
import { RechargeRecordDao, RechargeRecord } from '@/dao/recharge/record'
import { CdkeyManageDao, CdkeyManage } from '@/dao/cdkey_manage/index'
import {
  ArticleCategoryDao,
  ArticleCategory,
} from '@/dao/content_manage/article_category/index'
import {
  ArticleManageDao,
  ArticleManage,
} from '@/dao/content_manage/article/index'
import { PayConfigDao, PayConfig } from '@/dao/pay_config/index'
import { LafEnvDao, LafEnv } from '@/dao/system_parameter/index'
import { OperateLogDao, OperateLog } from '@/dao/log/operate_log'
import { ConsoleLogsDao, ConsoleLogs } from '@/dao/log/system_log'
import { MessageDao, MessageDocument } from '@/dao/message/index'

export const dao: DaoType = {
  userDao: UserDao,
  mailLogDao: MailLogDao,
  smsLogDao: SmsLogDao,
  userLoginLogDao: UserLoginLogDao,
  menuManageDao: MenuManageDao,
  roleManageDao: RoleManageDao,
  rechargeDao: RechargeDao,
  rechargeOrderDao: RechargeOrderDao,
  rechargeRecordDao: RechargeRecordDao,
  cdkeyManageDao: CdkeyManageDao,
  articleCategoryDao: ArticleCategoryDao,
  articleManageDao: ArticleManageDao,
  payConfigDao: PayConfigDao,
  lafEnvDao: LafEnvDao,
  operateLogDao: OperateLogDao,
  consoleLogsDao: ConsoleLogsDao,
  messageDao: MessageDao
}

/**
 * dao 层接口
 */
export interface DaoType {
  userDao: {
    /**
     * 通过用户名查询用户
     * @param username 用户名
     * @returns 返回 User 实体
     */
    findByUserName: (username: string) => Promise<User>
    /**
     * 通过邮箱查询用户
     * @param email 邮箱
     * @returns 返回 User 实体
     */
    findByEmail: (email: string) => Promise<User>
    /**
     * 通过手机号查询用户
     * @param phone 手机号
     * @returns 返回 User 实体
     */
    findByPhone: (phone: string) => Promise<User>
    /**
     * 添加用户
     * @param entity 用户实体
     * @returns 成功时返回 id 值，失败时返回 null
     */
    addUser: (entity: User) => Promise<any>
    /**
     * 用户名是否已经注册
     * @param username 用户名
     * @param _id 用户 id
     * @returns 未注册返回 false，已注册或失败返回 true
     */
    isRegisterByUserName: (username: string, _id?: string) => Promise<boolean>
    /**
     * 用户邮箱是否已经注册
     * @param email 邮箱
     * @param _id 用户 id
     * @returns 未注册返回 false，已注册或失败返回 true
     */
    isRegisterByEmail: (email: string, _id?: string) => Promise<boolean>
    /**
     * 用户手机号是否已经注册
     * @param phone 手机号
     * @param _id 用户 id
     * @returns 未注册返回 false，已注册或失败返回 true
     */
    isRegisterByPhone: (phone: string, _id?: string) => Promise<boolean>
    /**
     * 通过主键 id 更新用户 access_token
     * @param _id 主键 id
     * @param access_token access_token
     * @returns 成功时返回修改记录数，失败返回 null
     */
    updateAccessTokenById: (_id: string, accessToken: string) => Promise<number>
    /**
     * 根据主键 id 获取用户信息
     * @param _id 主键 id
     * @returns 返回 User 实体
     */
    getInfoById: (_id: string) => Promise<User>
    /**
     * 获取用户列表（带分页）
     * @param whereJson 查询条件 JSON 格式
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
     * @returns 成功时返回修改记录数，失败返回 null
     */
    updateUser: (entity: User) => Promise<number>
    /**
     * 通过主键 id 删除用户
     * @param _id 主键 id
     * @returns 成功时返回修改记录数，失败返回 null
     */
    deleteUserById(_id: string): Promise<number>
    /**
     * 根据角色 code 查询用户是否拥有该权限
     * @param phone 角色 code
     * @returns 拥有返回 true，未拥有或失败返回 false
     */
    isExistByRoleCode(roleCode: string): Promise<boolean>
  }
  menuManageDao: {
    /**
     * 根据菜单 id 集合查询菜单列表
     * @param _ids 菜单 id 集合
     * @returns 成功时返回 MenuManage 数组，失败返回 null
     */
    findListByIds: (_ids: string[]) => Promise<Array<MenuManage>>
    /**
     * 获取菜单列表
     * @param whereJson 查询条件 JSON 格式
     * @returns 返回菜单集合
     */
    getMenuList: (whereJson: any) => Promise<Array<MenuManage>>
    /**
     * 根据主键 id 获取菜单信息
     * @param _id 主键 id
     * @returns 返回 MenuManage 实体
     */
    getInfoById(_id: string): Promise<MenuManage>
    /**
     * 添加菜单
     * @param entity 菜单实体
     * @returns 成功时返回 id 值，失败时返回 null
     */
    addMenu(entity: MenuManage): Promise<any>
    /**
     * 修改菜单
     * @param entity 菜单实体
     * @returns 成功时返回修改记录数，失败返回 null
     */
    updateMenu(entity: MenuManage): Promise<number>
    /**
     * 通过主键 id 删除菜单
     * @param _id 主键 id
     * @returns 成功时返回修改记录数，失败返回 null
     */
    deleteMenuById(_id: string): Promise<number>
    /**
     * 根据主键 id 查询是否存在子菜单
     * @param menuId 菜单 id
     * @returns 拥有返回 true，未拥有或失败返回 false
     */
    isExistSubMenuById(_id: string): Promise<boolean>
  }
  roleManageDao: {
    /**
     * 根据角色 code 集合查询角色列表
     * @param codes 角色 code 集合
     * @returns 成功时返回 RoleManage 数组，失败返回 null
     */
    findListByCodes: (codes: string[]) => Promise<Array<RoleManage>>
    /**
     * 获取角色列表（带分页）
     * @param whereJson 查询条件 JSON 格式
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
     * 根据主键 id 获取角色信息
     * @param _id 主键 id
     * @returns 返回 RoleManage 实体
     */
    getInfoById(_id: string): Promise<RoleManage>
    /**
     * 添加角色
     * @param entity 角色实体
     * @returns 成功时返回 id 值，失败时返回 null
     */
    addRole(entity: RoleManage): Promise<any>
    /**
     * 修改角色
     * @param entity 角色实体
     * @returns 成功时返回修改记录数，失败返回 null
     */
    updateRole(entity: RoleManage): Promise<number>
    /**
     * 通过主键 id 删除角色
     * @param _id 主键 id
     * @returns 成功时返回修改记录数，失败返回 null
     */
    deleteRoleById(_id: string): Promise<number>
    /**
     * 根据菜单 id 查询角色是否拥有该权限
     * @param menuId 菜单 id
     * @returns 拥有返回 true，未拥有或失败返回 false
     */
    isExistByMenuId(menuId: string): Promise<boolean>
    /**
     * 根据角色 code 查询角色列表
     * @param code 角色 code
     * @returns 成功时返回 RoleManage 数组，失败返回 null
     */
    findListByCode(code: string): Promise<Array<RoleManage>>
  }
  userLoginLogDao: {
    /**
     * 添加用户登录日志
     * @param entity 登录日志实体
     * @returns 成功时返回 id 值，失败时返回 null
     */
    addUserLoginLog: (entity: UserLoginLog) => Promise<any>
  }
  mailLogDao: {
    /**
     * 获取最后一条邮件日志记录
     * @param fromEmail 发送者邮箱
     * @param toEmail 接收者邮箱
     * @param code 验证码
     * @param type 类型 {'register':'注册，'login':'登录'}
     * @returns 返回 MailLog 实体
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
     * @returns 成功时返回 id 值，失败时返回 null
     */
    addMailLog: (entity: MailLog) => Promise<any>
    /**
     * 通过主键 id 修改状态
     * @param _id 主键 id
     * @param status 状态
     * @returns 成功时返回修改记录数，失败返回 null
     */
    updateStatusById: (_id: string, status: string) => Promise<number>
  }
  smsLogDao: {
    /**
     * 获取最后一条短信日志记录
     * @param phone 手机号
     * @param code 验证码
     * @param type 类型 {'register':'注册，'login':'登录'}
     * @returns 返回 SmsLog 实体
     */
    findLastByWhere: (
      phone: string,
      code: string,
      type: string
    ) => Promise<SmsLog>
    /**
     * 添加短信日志
     * @param entity 短信日志实体
     * @returns 成功时返回 id 值，失败时返回 null
     */
    addSmsLog: (entity: SmsLog) => Promise<any>
    /**
     * 通过主键 id 修改状态
     * @param _id 主键 id
     * @param status 状态
     * @returns 成功时返回修改记录数，失败返回 null
     */
    updateStatusById: (_id: string, status: string) => Promise<number>
  }
  rechargeDao: {
    /**
     * 校验模板标题是否已存在
     * @param title 标题
     * @returns 不存在返回 false，已存在或失败返回 true
     */
    isExistByTemplateTitle: (title: string, _id?: string) => Promise<boolean>
    /**
     * 获取充值模板列表（带分页）
     * @param whereJson 查询条件 JSON 格式
     * @param sortArr 排序规则
     * @param pageIndex 当前页数
     * @param pageSize 每页数量
     * @returns 返回充值模板集合
     */
    getRechargeTemplateList: (
      whereJson: any,
      pageIndex: number,
      pageSize: number,
      sortArr?: Array<any>
    ) => Promise<Array<RechargeTemplate>>
    /**
     * 根据主键 id 获取充值模板信息
     * @param _id 主键 id
     * @returns 返回 RechargeTemplate 实体
     */
    getInfoById: (_id: string) => Promise<RechargeTemplate>
    /**
     * 添加充值模板
     * @param entity 充值模板实体
     * @returns 成功时返回 id 值，失败时返回 null
     */
    addRechargeTemplate: (entity: RechargeTemplate) => Promise<any>
    /**
     * 修改充值模板
     * @param entity 充值模板实体
     * @returns 成功时返回修改记录数，失败返回 null
     */
    updateRechargeTemplate: (entity: RechargeTemplate) => Promise<number>
    /**
     * 通过主键 id 删除充值模板
     * @param _id 主键 id
     * @returns 成功时返回修改记录数，失败返回 null
     */
    deleteRechargeTemplateById: (_id: string) => Promise<number>
  }
  rechargeOrderDao: {
    /**
     * 根据主键 id 获取充值订单信息
     * @param _id 主键 id
     * @returns 返回 RechargeOrder 实体
     */
    getInfoById: (_id: string) => Promise<RechargeOrder>
    /**
     * 添加充值订单
     * @param entity 充值订单实体
     * @returns 成功时返回 id 值，失败时返回 null
     */
    addRechargeOrder: (entity: RechargeOrder) => Promise<any>
    /**
     * 修改充值订单
     * @param entity 充值订单实体
     * @returns 成功时返回修改记录数，失败返回 null
     */
    updateRechargeOrder: (entity: RechargeOrder) => Promise<number>
  }
  rechargeRecordDao: {
    /**
     * 获取充值记录列表（带分页）
     * @param whereJson 查询条件 JSON 格式
     * @param pageIndex 当前页数
     * @param pageSize 每页数量
     * @param sortArr 排序规则
     * @returns 返回充值记录集合
     */
    getRechargeRecordList: (
      whereJson: any,
      pageIndex: number,
      pageSize: number,
      sortArr?: Array<any>
    ) => Promise<Array<RechargeRecord>>
    /**
     * 添加充值记录
     * @param entity 充值记录实体
     * @returns 成功时返回 id 值，失败时返回 null
     */
    addRechargeRecord: (entity: RechargeRecord) => Promise<any>
  }
  cdkeyManageDao: {
    /**
     * 校验密钥是否已存在
     * @param name 密钥
     * @returns 不存在返回 false，已存在或失败返回 true
     */
    isExistBySecretKey: (secretKey: string, _id?: string) => Promise<boolean>
    /**
     * 获取卡密列表（带分页）
     * @param whereJson 查询条件 JSON 格式
     * @param pageIndex 当前页数
     * @param pageSize 每页数量
     * @param sortArr 排序规则
     * @returns 返回卡密集合
     */
    getCdkeyList: (
      whereJson: any,
      pageIndex: number,
      pageSize: number,
      sortArr?: Array<any>
    ) => Promise<Array<CdkeyManage>>
    /**
     * 根据主键 id 获取卡密信息
     * @param _id 主键 id
     * @returns 返回 CdkeyManage 实体
     */
    getInfoById: (_id: string) => Promise<CdkeyManage>
    /**
     * 添加卡密
     * @param entity 卡密实体
     * @returns 成功时返回 id 值，失败时返回 null
     */
    addCdkey: (entity: CdkeyManage) => Promise<any>
    /**
     * 修改卡密
     * @param entity 卡密实体
     * @returns 成功时返回修改记录数，失败返回 null
     */
    updateCdkey: (entity: CdkeyManage) => Promise<number>
    /**
     * 通过主键 id 删除卡密
     * @param _id 主键 id
     * @returns 成功时返回修改记录数，失败返回 null
     */
    deleteCdkeyById: (_id: string) => Promise<number>
    /**
     * 通过密钥查询卡密
     * @param secretKey 密钥
     * @returns 返回 CdkeyManage 实体
     */
    findBySecretKey: (secretKey: string) => Promise<CdkeyManage>
  }
  articleCategoryDao: {
    /**
     * 校验名称是否已存在
     * @param name 名称
     * @returns 不存在返回 false，已存在或失败返回 true
     */
    isExistByName: (name: string, _id?: string) => Promise<boolean>
    /**
     * 获取文章分类列表（带分页）
     * @param whereJson 查询条件 JSON 格式
     * @param pageIndex 当前页数
     * @param pageSize 每页数量
     * @param sortArr 排序规则
     * @returns 返回文章分类集合
     */
    getArticleCategoryList: (
      whereJson: any,
      pageIndex: number,
      pageSize: number,
      sortArr?: Array<any>
    ) => Promise<Array<ArticleCategory>>
    /**
     * 根据主键 id 获取文章分类信息
     * @param _id 主键 id
     * @returns 返回 ArticleCategory 实体
     */
    getInfoById: (_id: string) => Promise<ArticleCategory>
    /**
     * 添加文章分类
     * @param entity 文章分类实体
     * @returns 成功时返回 id 值，失败时返回 null
     */
    addArticleCategory: (entity: ArticleCategory) => Promise<any>
    /**
     * 修改文章分类
     * @param entity 文章分类
     * @returns 成功时返回修改记录数，失败返回 null
     */
    updateArticleCategory: (entity: ArticleCategory) => Promise<number>
    /**
     * 通过主键 id 删除文章分类
     * @param _id 主键 id
     * @returns 成功时返回修改记录数，失败返回 null
     */
    deleteArticleCategoryById: (_id: string) => Promise<number>
  }
  articleManageDao: {
    /**
     * 校验标题是否已存在
     * @param title 标题
     * @returns 不存在返回 false，已存在或失败返回 true
     */
    isExistByTitle: (title: string, _id?: string) => Promise<boolean>
    /**
     * 获取文章列表（带分页）
     * @param whereJson 查询条件 JSON 格式
     * @param pageIndex 当前页数
     * @param pageSize 每页数量
     * @param sortArr 排序条件集合
     * @returns 返回文章集合
     */
    getArticleList: (
      whereJson: any,
      pageIndex?: number,
      pageSize?: number,
      sortArr?: Array<any>
    ) => Promise<Array<ArticleManage>>
    /**
     * 根据主键 id 获取文章信息
     * @param _id 主键 id
     * @returns 返回 ArticleManage 实体
     */
    getInfoById: (_id: string) => Promise<ArticleManage>
    /**
     * 添加文章
     * @param entity 文章实体
     * @returns 成功时返回 id 值，失败时返回 null
     */
    addArticle: (entity: ArticleManage) => Promise<any>
    /**
     * 修改文章
     * @param entity 文章实体
     * @returns 成功时返回修改记录数，失败返回 null
     */
    updateArticle: (entity: ArticleManage) => Promise<number>
    /**
     * 通过主键 id 删除文章
     * @param _id 主键 id
     * @returns 成功时返回修改记录数，失败返回 null
     */
    deleteArticleById: (_id: string) => Promise<number>
  }
  payConfigDao: {
    /**
     * 校验类型是否已存在
     * @param type 类型
     * @returns 不存在返回 false，已存在或失败返回 true
     */
    isExistByType: (type: number, _id?: string) => Promise<boolean>
    /**
     * 获取支付配置列表（带分页）
     * @param whereJson 查询条件 JSON 格式
     * @param pageIndex 当前页数
     * @param pageSize 每页数量
     * @param sortArr 排序规则
     * @returns 返回支付配置集合
     */
    getPayConfigList: (
      whereJson: any,
      pageIndex: number,
      pageSize: number,
      sortArr?: Array<any>
    ) => Promise<Array<PayConfig>>
    /**
     * 根据主键 id 获取支付配置信息
     * @param _id 主键 id
     * @returns 返回 ArticleCategory 实体
     */
    getInfoById: (_id: string) => Promise<PayConfig>
    /**
     * 通过类型查询支付配置
     * @param type 类型
     * @returns 返回 PayConfig 实体
     */
    findByType: (type: number) => Promise<PayConfig>
    /**
     * 添加支付配置
     * @param entity 支付配置实体
     * @returns 成功时返回 id 值，失败时返回 null
     */
    addPayConfig: (entity: PayConfig) => Promise<any>
    /**
     * 修改支付配置
     * @param entity 支付配置实体
     * @returns 成功时返回修改记录数，失败返回 null
     */
    updatePayConfig: (entity: PayConfig) => Promise<number>
    /**
     * 通过主键 id 删除支付配置
     * @param _id 主键 id
     * @returns 成功时返回修改记录数，失败返回 null
     */
    deletePayConfigById: (_id: string) => Promise<number>
  }
  lafEnvDao: {
    /**
     * 校验key是否已存在
     * @param key key
     * @returns 不存在返回false，已存在或失败返回true
     */
    isExistByKey: (key: string, _id?: string) => Promise<boolean>
    /**
     * 获取系统参数列表（带分页）
     * @param whereJson 查询条件JSON格式
     * @param pageIndex 当前页数
     * @param pageSize 每页数量
     * @param sortArr 排序规则
     * @returns 返回系统参数集合
     */
    getSystemParamterList: (
      whereJson: any,
      pageIndex: number,
      pageSize: number,
      sortArr?: Array<any>
    ) => Promise<Array<LafEnv>>
    /**
     * 根据主键id获取系统参数信息
     * @param _id 主键id
     * @returns 返回LafEnv实体
     */
    getInfoById: (_id: string) => Promise<LafEnv>
    /**
     * 添加系统参数
     * @param entity 系统参数实体
     * @returns 成功时返回id值，失败时返回null
     */
    addSystemParam: (entity: LafEnv) => Promise<any>
    /**
     * 修改系统参数
     * @param entity 系统参数实体
     * @returns 成功时返回修改记录数，失败返回null
     */
    updateSystemParam: (entity: LafEnv) => Promise<number>
    /**
     * 通过主键id删除系统参数
     * @param _id 主键id
     * @returns 成功时返回修改记录数，失败返回null
     */
    deleteSystemParamById: (_id: string) => Promise<number>
  }
  operateLogDao: {
    /**
     * 获取操作日志列表（带分页）
     * @param whereJson 查询条件JSON格式
     * @param pageIndex 当前页数
     * @param pageSize 每页数量
     * @param sortArr 排序规则
     * @returns 返回操作日志集合
     */
    getOperateLogList: (
      whereJson: any,
      pageIndex: number,
      pageSize: number,
      sortArr?: Array<any>
    ) => Promise<Array<OperateLog>>
    /**
     * 添加操作日志
     * @param entity 操作日志实体
     * @returns 成功时返回id值，失败时返回null
     */
    addOperateLog: (entity: OperateLog) => Promise<any>
  }
  consoleLogsDao: {
    /**
     * 获取系统日志列表（带分页）
     * @param whereJson 查询条件JSON格式
     * @param pageIndex 当前页数
     * @param pageSize 每页数量
     * @param sortArr 排序规则
     * @returns 返回系统日志集合
     */
    getConsoleLogsList: (
      whereJson: any,
      pageIndex: number,
      pageSize: number,
      sortArr?: Array<any>
    ) => Promise<Array<ConsoleLogs>>
    /**
     * 添加系统日志
     * @param entity 系统日志实体
     * @returns 成功时返回id值，失败时返回null
     */
    addConsoleLogs: (entity: ConsoleLogs) => Promise<any>
  }
  messageDao: {
    /**
     * 获取推送消息列表（带分页）
     * @param whereJson 查询条件 JSON 格式
     * @param pageIndex 当前页数
     * @param pageSize 每页数量
     * @returns 返回用户集合
     */
    getList: (
      whereJson: any,
      pageIndex: number,
      pageSize: number
    ) => Promise<Array<MessageDocument>>
  }
}
