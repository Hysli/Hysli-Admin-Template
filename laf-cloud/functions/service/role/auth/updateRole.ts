import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, t, log, mail, sms, pay, dao, db, nw, console } = _ctx

/**
 * 修改角色
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body
  if (ctx.user.roles.indexOf('demo') > -1) {
    return common.returnFail(t('operate.noPermission'))
  }

  // 如果 data 中没有 name 或者 code，返回错误
  if (!_data?.name || !_data?.code || !_data?._id) {
    return common.returnFail('Error: _id or name or code is empty')
  }

  // 校验角色是否存在
  const roleData = await dao.roleManageDao.getInfoById(_data._id)
  if (!roleData) {
    return common.returnFail(t('data.notExist'))
  }
  // 根据角色code查询所有角色
  const roleList = await dao.roleManageDao.findListByCode(_data.code)
  if (
    roleList &&
    roleList.length > 0 &&
    roleList.find((x) => x._id != roleData._id)
  ) {
    return common.returnFail(t('role.codeExist'))
  }

  try {
    _data.update_time = Date.now()
    const result = await dao.roleManageDao.updateRole(_data)
    if (result && result > 0) {
      return common.returnAndPopup(t('update.success'))
    } else {
      return common.returnFail(t('update.failed'))
    }
  } catch (e) {
    //TODO handle the exception
    console.log('updateRole Error:: ', e.message)
    return common.returnFail(t('update.failed'))
  }
}
