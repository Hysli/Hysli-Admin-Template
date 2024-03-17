import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, log, mail, sms, pay, dao, db, nw, console } = _ctx

/**
 * 添加系统参数
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body
  if (ctx.user.roles.indexOf('demo') > -1) {
    return common.returnFail("t('operate.noPermission')")
  }

  // 如果 data 中没有 name，返回错误
  if (!_data?.name || !_data?.key) {
    return common.returnFail('Error: name or key is empty')
  }

  // 校验key是否已存在
  const isExist = await dao.lafEnvDao.isExistByKey(_data.key)
  if (isExist) {
    return common.returnFail("t('key.isExist')")
  }

  try {
    // 创建系统参数
    const lafEnvInfo = {
      name: _data.name,
      key: _data.key,
      value: _data.value ?? '',
      group: _data.group ?? '',
      status: _data.status ?? 1,
      create_time: Date.now(),
      update_time: Date.now(),
    }
    const rid = await dao.lafEnvDao.addSystemParam(lafEnvInfo)
    if (rid) {
      // 更新环境变量
      common.setEnv()
      // 记录操作日志
      log(ctx, 'add')

      return common.returnAndPopup("t('add.success')")
    } else {
      return common.returnFail("t('add.failed')")
    }
  } catch (e) {
    //TODO handle the exception
    console.error('addSystemParam Error:: ', e.message)
    return common.returnFail("t('add.failed')")
  }
}
