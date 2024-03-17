import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, log, mail, sms, pay, dao, db, nw, console } = _ctx

/**
 * 修改用户
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body
  if (ctx.user.roles.indexOf('demo') > -1) {
    return common.returnFail("t('operate.noPermission')")
  }

  // 如果 data 中没有 name 或者 code，返回错误
  if (!_data?.username || !_data?._id) {
    return common.returnFail('Error: _id or username is empty')
  }
  // if (!_data?.email || !_data?.phone || !_data?._id) {
  //   return common.returnFail('Error: _id or email or phone is empty')
  // }

  // 校验用户是否存在
  let userData = await dao.userDao.getInfoById(_data._id)
  if (!userData) {
    return common.returnFail("t('data.notExist')")
  }
  // 校验用户名是否已被使用
  const isUserName = await dao.userDao.isRegisterByUserName(
    _data.username,
    userData._id
  )
  if (isUserName) {
    return common.returnFail("t('username.registered')")
  }
  // 邮箱格式校验
  if (_data.email && !common.isEmail(_data.email)) {
    return common.returnFail("t('email.error')")
  }
  // 校验邮箱是否已被使用
  const isEmail = await dao.userDao.isRegisterByEmail(_data.email, userData._id)
  if (_data.email && isEmail) {
    return common.returnFail("t('email.registered')")
  }
  // 手机号格式校验
  if (_data.phone && !common.isPhone(_data.phone)) {
    return common.returnFail("t('phone.error')")
  }
  // 手机号是否已被使用
  const isPhone = await dao.userDao.isRegisterByPhone(_data.phone, userData._id)
  if (_data.isPhone && isPhone) {
    return common.returnFail("t('phone.registered')")
  }
  // 密码格式校验
  if (_data.password && !common.validatePassword(_data.password)) {
    return common.returnFail("t('password.formatError')")
  }

  try {
    // 用户信息
    userData.username = _data.username ?? userData.username
    userData.phone = _data.phone ?? userData.phone
    userData.email = _data.email ?? userData.email
    if (_data.password) {
      userData.password = common.hashPassword(_data.password)
    }
    userData.nickname = _data.nickname ?? userData.nickname
    userData.avatar = _data.avatar ?? userData.avatar
    userData.roles = _data.roles ?? userData.roles
    userData.status = _data.status ?? userData.status
    userData.update_time = Date.now()

    const result = await dao.userDao.updateUser(userData)
    if (result && result > 0) {
      // 记录操作日志
      log(ctx, 'update')

      return common.returnAndPopup("t('update.success')")
    } else {
      return common.returnFail("t('update.failed')")
    }
  } catch (e) {
    //TODO handle the exception
    console.error('updateUser Error:: ', e.message)
    return common.returnFail("t('update.failed')")
  }
}
