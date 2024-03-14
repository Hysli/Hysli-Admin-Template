import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, t, log, mail, sms, pay, dao, db, nw, console } = _ctx

/**
 * 获取用户动态菜单
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  if (!ctx.user.uid) {
    return common.returnFail('Error: uid is empty')
  }

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

  let _menuData = menuData.filter(x => x.type == 1 || x.type == 2)
  let menuList = generateOptions(_menuData)
  // 开始递归方法
  function generateOptions(params) {
    let result = []
    for (const param of params) {
      // 判断是否为顶层节点
      if (param.parent_id === '') {
        let parent = param
        parent.meta = {
          icon: param.icon,
          title: param.title,
          hidden: param.is_hide
        }
        parent.children = getchilds(param._id, params) // 获取子节点
        if (parent.children.length == 0) {
          parent.children.push({
            path: param.path + '/index',
            name: param.name + '_index',
            icon: param.icon,
            meta: {
              icon: param.icon,
              title: param.title,
              affix: param.is_affix,
              hidden: param.is_hide
            },
            component: param.component
          })
          parent.component = 'Layout'
        }
        result.push(parent)
      }
    }
    return result
  }

  function getchilds(id, array) {
    const childs = []
    for (const arr of array) {
      // 循环获取子节点
      if (arr.parent_id === id) {
        let info = arr
        info.meta = {
          icon: arr.icon,
          title: arr.title,
          affix: arr.is_affix,
          hidden: arr.is_hide
        }
        childs.push(info)
      }
    }
    for (const child of childs) {
      // 获取子节点的子节点
      const childscopy = getchilds(child._id, array) // 递归获取子节点
      if (childscopy.length > 0) {
        child.children = childscopy
      }
    }
    return childs
  }

  return common.returnSuccess(t('account.getMenuSuccess'), menuList)
}
