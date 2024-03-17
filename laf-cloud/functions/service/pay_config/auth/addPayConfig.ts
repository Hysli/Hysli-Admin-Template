import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, log, mail, sms, pay, dao, db, nw, console } = _ctx

/**
 * 添加支付配置
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body
  if (ctx.user.roles.indexOf('demo') > -1) {
    return common.returnFail("t('operate.noPermission')")
  }

  // 如果 data 中没有 app_id 或 type，返回错误
  if (!_data?.app_id || !_data?.type) {
    return common.returnFail('Error: app_id or type is empty')
  }

  // 校验类型是否已存在
  const isExist = await dao.payConfigDao.isExistByType(_data.type)
  if (isExist) {
    return common.returnFail("t('type.isExist')")
  }

  try {
    // 创建支付配置
    const payConfigInfo = {
      type: _data.type,
      app_id: _data.app_id ?? '',
      app_secret: _data.app_secret ?? '',
      mch_id: _data.mch_id ?? '',
      mch_key: _data.mch_key ?? '',
      private_key: _data.private_key ?? '',
      public_key: _data.public_key ?? '',
      status: _data.status ?? 1,
      create_time: Date.now(),
      update_time: Date.now(),
    }
    const rid = await dao.payConfigDao.addPayConfig(payConfigInfo)
    if (rid) {
      // 记录操作日志
      log(ctx, 'add')

      return common.returnAndPopup("t('add.success')")
    } else {
      return common.returnFail("t('add.failed')")
    }
  } catch (e) {
    //TODO handle the exception
    console.error('addPayConfig Error:: ', e.message)
    return common.returnFail("t('add.failed')")
  }
}
