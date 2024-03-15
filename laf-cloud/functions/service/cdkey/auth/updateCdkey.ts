import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, log, mail, sms, pay, dao, db, nw, console } = _ctx

/**
 * 修改卡密状态
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body
  if (ctx.user.roles.indexOf('demo') > -1) {
    return common.returnFail("t('operate.noPermission')")
  }

  // 如果 data 中没有 _id，返回错误
  if (!_data?._id || !_data.status) {
    return common.returnFail('Error: _id or status is empty')
  }

  // 通过密钥查询卡密
  const cdkeyData = await dao.cdkeyManageDao.getInfoById(_data._id)
  if (!cdkeyData) {
    return common.returnFail("t('data.notExist')")
  }
  if (cdkeyData.use_time || cdkeyData.uid) {
    return common.returnFail("t('cdkey.used')")
  }

  try {
    _data.update_time = Date.now()
    const result = await dao.cdkeyManageDao.updateCdkey(_data)
    if (result && result > 0) {
      return common.returnAndPopup("t('operate.success')")
    } else {
      return common.returnFail("t('operate.failed')")
    }
  } catch (e) {
    //TODO handle the exception
    console.log('updateCdkey Error:: ', e.message)
    return common.returnFail("t('update.failed')")
  }
}
