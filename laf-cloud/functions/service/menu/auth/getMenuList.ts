import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, t, log, mail, sms, pay, dao, db, nw, console } = _ctx
const _ = cloud.database().command

/**
 * 获取菜单列表
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body

  let whereJson = { status: _.neq(9) }
  if (_data?.status) {
    whereJson = { status: _.eq(_data.status) }
  }
  if (_data?.name) {
    whereJson['title'] = { $regex: _data.name }
  }

  const list = await dao.menuManageDao.getMenuList(whereJson)
  // console.log('list', list)
  if (list && list.length > 0) {
    // 构造树
    let menuList = generateOptions(list)
    // 开始递归方法
    function generateOptions(params) {
      let result = []
      for (const param of params) {
        // 判断是否为顶层节点
        if (param.parent_id === '') {
          let parent = param
          parent.children = getchilds(param._id, params) // 获取子节点
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
    return common.returnSuccess('', menuList)
  }
  return common.returnSuccess('', list)
}
