import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, log, mail, sms, pay, dao, db, nw, console } = _ctx

/**
 * 删除菜单
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body
  if (ctx.user.roles.indexOf('demo') > -1) {
    return common.returnFail("t('operate.noPermission')")
  }

  if (!_data?._id) {
    return common.returnFail('Error: _id or title is empty')
  }

  // 校验菜单是否存在
  const menuData = await dao.menuManageDao.getInfoById(_data?._id)
  if (!menuData) {
    return common.returnFail("t('data.notExist')")
  }
  // 校验菜单是否已分配给角色
  const isExist = await dao.roleManageDao.isExistByMenuId(menuData._id)
  if (isExist) {
    return common.returnFail("t('role.canNotDel')")
  }
  // 校验是否存在子菜单
  const isExistSubMenu = await dao.menuManageDao.isExistSubMenuById(
    menuData._id
  )
  if (isExistSubMenu) {
    return common.returnFail("t('menu.isExistSubMenu')")
  }

  const result = await dao.menuManageDao.deleteMenuById(menuData._id)
  if (result && result > 0) {
    return common.returnAndPopup("t('delete.success')")
  }
  return common.returnFail("t('delete.failed')")
}
