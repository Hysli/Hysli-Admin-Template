import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, log, mail, sms, pay, dao, db, nw, console } = _ctx
const _ = cloud.database().command

/**
 * 修改菜单
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body
  if (ctx.user.roles.indexOf('demo') > -1) {
    return common.returnFail("t('operate.noPermission')")
  }

  // 如果 data 中没有 name 或者 code，返回错误
  if (!_data?.title || !_data?._id) {
    return common.returnFail('Error: _id or title is empty')
  }

  // 校验菜单是否存在
  const menuData = await dao.menuManageDao.getInfoById(_data._id)
  if (!menuData) {
    return common.returnFail("t('data.notExist')")
  }
  // 根据菜单名称获取所有菜单
  let whereJson = {
    title: _.eq(_data.title),
    parent_id: _.eq(_data.parent_id ?? ''),
    status: _.neq(9),
  }
  const menuList = await dao.menuManageDao.getMenuList(whereJson)
  if (
    menuList &&
    menuList.length > 0 &&
    menuList.find((x) => x._id != _data._id)
  ) {
    return common.returnFail("t('menu.titleExist')")
  }

  try {
    _data.update_time = Date.now()
    const result = await dao.menuManageDao.updateMenu(_data)
    if (result && result > 0) {
      return common.returnAndPopup("t('update.success')")
    } else {
      return common.returnFail("t('update.failed')")
    }
  } catch (e) {
    //TODO handle the exception
    console.log('updateMenu Error:: ', e.message)
    return common.returnFail("t('update.failed')")
  }
}
