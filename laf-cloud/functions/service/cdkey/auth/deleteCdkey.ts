import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, t, log, mail, sms, pay, dao, db, nw, console } = _ctx

/**
 * 删除卡密
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body
  if (ctx.user.roles.indexOf('demo') > -1) {
    return common.returnFail("t('operate.noPermission')")
  }

  if (!_data?._id) {
    return common.returnFail('Error: _id is empty')
  }

  // 校验接口分类是否存在
  const cdkeyData = await dao.cdkeyManageDao.getInfoById(_data._id)
  if (!cdkeyData) {
    return common.returnFail("t('data.notExist')")
  }
  if (cdkeyData.use_time || cdkeyData.uid) {
    return common.returnFail("t('cdkey.used')")
  }

  try {
    const result = await dao.cdkeyManageDao.deleteCdkeyById(cdkeyData._id)
    if (result && result > 0) {
      // 记录操作日志
      log(ctx, 'delete')

      return common.returnAndPopup("t('delete.success')")
    }
    return common.returnFail("t('delete.failed')")
  } catch (e) {
    //TODO handle the exception
    console.error('deleteCdkeyById Error:: ', e.message)
    return common.returnFail("t('delete.failed')")
  }
}
