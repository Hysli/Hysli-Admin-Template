import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, log, mail, sms, pay, dao, db, nw, console } = _ctx

/**
 * 修改文章
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body
  if (ctx.user.roles.indexOf('demo') > -1) {
    return common.returnFail("t('operate.noPermission')")
  }

  // 如果 data 中没有 title，返回错误
  if (!_data?.title || !_data?._id) {
    return common.returnFail('Error: _id or title is empty')
  }

  // 校验文章是否存在
  const articleManageData = await dao.articleManageDao.getInfoById(_data._id)
  if (!articleManageData) {
    return common.returnFail("t('data.notExist')")
  }

  try {
    _data.update_time = Date.now()
    const result = await dao.articleManageDao.updateArticle(_data)
    if (result && result > 0) {
      // 记录操作日志
      log(ctx, 'update')

      return common.returnAndPopup("t('update.success')")
    } else {
      return common.returnFail("t('update.failed')")
    }
  } catch (e) {
    //TODO handle the exception
    console.error('updateArticle Error:: ', e.message)
    return common.returnFail("t('update.failed')")
  }
}
