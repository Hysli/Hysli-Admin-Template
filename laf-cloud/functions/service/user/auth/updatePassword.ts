import cloud from '@lafjs/cloud'
// @ts-ignore
import { _ctx } from '@/global'
// @ts-ignore
const { common, t, log, mail, sms, dao, db, nw } = _ctx

/**
 * 用户修改密码
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body
  if (ctx.user.roles.indexOf('demo') > -1) {
    return common.returnFail("t('operate.noPermission')")
  }

  // 如果 data 中没有 password，返回错误
  if (!_data?.password) {
    return common.returnFail('Error: password is empty')
  }
  // 校验用户是否存在
  let userData = await dao.userDao.getInfoById(ctx.user.uid)
  if (!userData) {
    return common.returnFail("t('data.notExist')")
  }
  // 密码格式校验
  if (_data.password && !common.validatePassword(_data.password)) {
    return common.returnFail("t('password.formatError')")
  }

  try {
    // 更新用户密码
    userData.password = common.hashPassword(_data.password)
    userData.update_time = Date.now()

    const result = await dao.userDao.updateUser(userData)
    if (result && result > 0) {
      return common.returnAndPopup("t('update.success')")
    } else {
      return common.returnFail("t('update.failed')")
    }
  } catch (e) {
    //TODO handle the exception
    console.log('updatePassword Error:: ', e.message)
    return common.returnFail("t('update.failed')")
  }
}
