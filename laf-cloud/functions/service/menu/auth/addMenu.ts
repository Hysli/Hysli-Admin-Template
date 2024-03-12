import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, t, log, mail, sms, pay, dao, db, nw } = _ctx
const _ = cloud.database().command

/**
 * 添加菜单
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body
  if (ctx.user.roles.indexOf('demo') > -1) {
    return common.returnFail(t('operate.noPermission'))
  }

  // 如果 data 中没有 name 或者 code，返回错误
  if (!_data?.title) {
    return common.returnFail('Error: title is empty')
  }

  // 根据菜单名称获取所有菜单
  let whereJson = {
    title: _.eq(_data.title),
    parent_id: _.eq(_data.parent_id ?? ''),
    status: _.neq(9),
  }
  const menuList = await dao.menuManageDao.getMenuList(whereJson)
  if (menuList && menuList.length > 0) {
    return common.returnFail(t('menu.titleExist'))
  }

  try {
    // 创建菜单
    const menuInfo = {
      parent_id: _data.parent_id ?? '',
      type: _data.type ?? 1,
      name: _data.name ?? '',
      path: _data.path ?? '',
      component: _data.component ?? '',
      redirect: _data.redirect ?? '',
      icon: _data.icon ?? '',
      permission: _data.permission ?? '',
      title: _data.title ?? '',
      is_frame: _data.is_frame ?? false,
      out_link: _data.out_link ?? '',
      is_hide: _data.is_hide ?? false,
      is_keep_alive: _data.is_keep_alive ?? false,
      is_affix: _data.is_affix ?? false,
      remark: _data.remark ?? '',
      status: _data.status ?? 1,
      sort: _data.sort ?? 0,
      create_time: Date.now(),
      update_time: Date.now(),
    }
    const mid = await dao.menuManageDao.addMenu(menuInfo)
    if (mid) {
      return common.returnAndPopup(t('add.success'))
    } else {
      return common.returnFail(t('add.failed'))
    }
  } catch (e) {
    //TODO handle the exception
    console.log('addMenu Error:: ', e.message)
    return common.returnFail(t('add.failed'))
  }
}
