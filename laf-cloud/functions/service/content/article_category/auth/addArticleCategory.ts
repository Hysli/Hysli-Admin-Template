import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, log, mail, sms, pay, dao, db, nw, console } = _ctx

/**
 * 添加文章分类
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body
  if (ctx.user.roles.indexOf('demo') > -1) {
    return common.returnFail("t('operate.noPermission')")
  }

  // 如果 data 中没有 name，返回错误
  if (!_data?.name) {
    return common.returnFail('Error: name is empty')
  }

  // 校验名称是否已存在
  const isExist = await dao.articleCategoryDao.isExistByName(_data.name)
  if (isExist) {
    return common.returnFail("t('name.isExist')")
  }

  try {
    // 创建文章分类
    const articleCategoryInfo = {
      name: _data.name,
      description: _data.description ?? '',
      status: _data.status ?? 1,
      sort: _data.sort ?? 0,
      create_time: Date.now(),
      update_time: Date.now(),
    }
    const rid = await dao.articleCategoryDao.addArticleCategory(
      articleCategoryInfo
    )
    if (rid) {
      return common.returnAndPopup("t('add.success')")
    } else {
      return common.returnFail("t('add.failed')")
    }
  } catch (e) {
    //TODO handle the exception
    console.log('addArticleCategory Error:: ', e.message)
    return common.returnFail("t('add.failed')")
  }
}
