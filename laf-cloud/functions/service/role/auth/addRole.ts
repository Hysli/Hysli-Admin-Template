import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, log, mail, sms, pay, dao, db, nw, console } = _ctx

/**
 * 添加角色
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body
  if (ctx.user.roles.indexOf('demo') > -1) {
    return common.returnFail("t('operate.noPermission')")
  }

  // 如果 data 中没有 name 或者 code，返回错误
  if (!_data?.name || !_data?.code) {
    return common.returnFail('Error: name or code is empty')
  }

  // 根据角色code查询所有角色
  const roleList = await dao.roleManageDao.findListByCode(_data.code)
  if (roleList && roleList.length > 0) {
    return common.returnFail("t('role.codeExist')")
  }

  try {
    // 创建角色
    const roleInfo = {
      code: _data.code,
      name: _data.name,
      description: _data.description ?? '',
      menu_auth: _data.menu_auth ?? [],
      status: _data.status ?? 1,
      create_time: Date.now(),
      update_time: Date.now(),
    }
    const rid = await dao.roleManageDao.addRole(roleInfo)
    if (rid) {
      return common.returnAndPopup("t('add.success')")
    } else {
      return common.returnFail("t('add.failed')")
    }
  } catch (e) {
    //TODO handle the exception
    console.log('addRole Error:: ', e.message)
    return common.returnFail("t('add.failed')")
  }
}
