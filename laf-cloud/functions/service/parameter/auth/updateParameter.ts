import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, log, mail, sms, pay, dao, db, nw, console } = _ctx

/**
 * 修改系统参数
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body
  if (ctx.user.roles.indexOf('demo') > -1) {
    return common.returnFail("t('operate.noPermission')")
  }

  // 如果 data 中没有 name，返回错误
  if (!_data?.name || !_data?.key || !_data?._id) {
    return common.returnFail('Error: _id or name or key is empty')
  }

  // 校验系统参数是否存在
  const lafEnvData = await dao.lafEnvDao.getInfoById(_data._id)
  if (!lafEnvData) {
    return common.returnFail("t('data.notExist')")
  }

  try {
    _data.update_time = Date.now()
    const result = await dao.lafEnvDao.updateSystemParam(_data)
    if (result && result > 0) {
      // 更新环境变量
      common.setEnv()
      // 记录操作日志
      log(ctx, 'update')

      return common.returnAndPopup("t('update.success')")
    } else {
      return common.returnFail("t('update.failed')")
    }
  } catch (e) {
    //TODO handle the exception
    console.error('updateSystemParam Error:: ', e.message)
    return common.returnFail("t('update.failed')")
  }
}
