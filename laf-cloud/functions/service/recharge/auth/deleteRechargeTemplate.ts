import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, log, mail, sms, pay, dao, db, nw, console } = _ctx

/**
 * 删除充值模板
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

  // 校验充值模板是否存在
  const rechargeTemplateData = await dao.rechargeDao.getInfoById(_data._id)
  if (!rechargeTemplateData) {
    return common.returnFail("t('data.notExist')")
  }

  const result = await dao.rechargeDao.deleteRechargeTemplateById(
    rechargeTemplateData._id
  )
  if (result && result > 0) {
    return common.returnAndPopup("t('delete.success')")
  }
  return common.returnFail("t('delete.failed')")
}
