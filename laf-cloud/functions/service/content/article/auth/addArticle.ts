import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, t, log, mail, sms, pay, dao, db, nw, console } = _ctx

/**
 * 添加文章
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body
  if (ctx.user.roles.indexOf('demo') > -1) {
    return common.returnFail(t('operate.noPermission'))
  }

  // 如果 data 中没有 title，返回错误
  if (!_data?.title) {
    return common.returnFail('Error: title is empty')
  }

  // 校验标题是否已存在
  const isExist = await dao.articleManageDao.isExistByTitle(_data.title)
  if (isExist) {
    return common.returnFail(t('title.isExist'))
  }

  try {
    // 创建文章
    const articleInfo = {
      category_id: _data.category_id ?? '',
      title: _data.title,
      introduction: _data?.introduction ?? '',
      picture: _data?.picture ?? '',
      release_date: _data?.release_date ?? Date.now(),
      content: _data?.content ?? '',
      status: _data.status ?? 1,
      sort: _data.sort ?? 0,
      create_time: Date.now(),
      update_time: Date.now(),
    }
    const rid = await dao.articleManageDao.addArticle(articleInfo)
    if (rid) {
      return common.returnAndPopup(t('add.success'))
    } else {
      return common.returnFail(t('add.failed'))
    }
  } catch (e) {
    //TODO handle the exception
    console.log('addArticle Error:: ', e.message)
    return common.returnFail(t('add.failed'))
  }
}
