import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, t, log, mail, sms, pay, dao, db, nw, console } = _ctx

/**
 * 获取用户信息
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const userData = await dao.userDao.getInfoById(ctx.user.uid)
  if (!userData) {
    return common.returnFail(t('account.getInfoFail'))
  }

  const roleData = await dao.roleManageDao.findListByCodes(userData.roles)
  if (!roleData || roleData.length == 0) {
    return common.returnFail(t('account.getRoleFail'))
  }

  let _ids = []
  roleData.forEach(item => {
    if (!item.menu_auth || item.menu_auth.length == 0) return false
    item.menu_auth.forEach(x => {
      if (!_ids.includes(x)) {
        _ids.push(x)
      }
    })
  })
  const menuData = await dao.menuManageDao.findListByIds(_ids)
  if (!menuData || menuData.length == 0) {
    return common.returnFail(t('account.getMenuFail'))
  }

  let _permissions = []
  menuData.forEach(item => {
    if (item.type == 3) {
      _permissions.push({
        label: item.title,
        value: item.permission
      })
    }
  })
  userData['permissions'] = _permissions
  return common.returnSuccess(t('account.getInfoSuccess'), userData)
}
