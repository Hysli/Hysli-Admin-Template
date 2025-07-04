import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, log, mail, sms, pay, dao, db, nw, console } = _ctx
const _ = cloud.database().command

/**
 * 获取文章分类列表（带分页）
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
    whereJson['name'] = { $regex: _data.name }
  }

  const list = await dao.articleCategoryDao.getArticleCategoryList(
    whereJson,
    _data?.page,
    _data?.pageSize
  )
  // 记录操作日志
  log(ctx, 'get')

  return common.returnSuccess('', list)
}
