import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, log, mail, sms, pay, dao, db, nw, console } = _ctx

/**
 * 删除角色
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body
  if (ctx.user.roles.indexOf('demo') > -1) {
    return common.returnFail("t('operate.noPermission')")
  }

  if (!_data?._id) {
    return common.returnFail('Error: _id is empty')
  }

  // 校验角色是否存在
  const roleData = await dao.roleManageDao.getInfoById(_data?._id)
  if (!roleData) {
    return common.returnFail("t('data.notExist')")
  }
  // 校验角色是否已分配给用户
  const isExist = await dao.userDao.isExistByRoleCode(roleData.code)
  if (isExist) {
    return common.returnFail("t('role.canNotDel')")
  }

  try {
    const result = await dao.roleManageDao.deleteRoleById(roleData._id)
    if (result && result > 0) {
      // 记录操作日志
      log(ctx, 'delete')

      return common.returnAndPopup("t('delete.success')")
    }
    return common.returnFail("t('delete.failed')")
  } catch (e) {
    //TODO handle the exception
    console.error('deleteRoleById Error:: ', e.message)
    return common.returnFail("t('delete.failed')")
  }
}
