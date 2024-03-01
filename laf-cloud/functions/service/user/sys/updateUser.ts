import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, t, log, mail, sms, pay, dao, db, nw } = _ctx

/**
 * 修改用户
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body

  // 如果 data 中没有 name 或者 code，返回错误
  if (!_data?.email || !_data?.phone || !_data?._id) {
    return common.returnFail('Error: _id or email or phone is empty')
  }

  // 校验用户是否存在
  let userData = await dao.userDao.getInfoById(_data._id)
  if (!userData) {
    return common.returnFail(t('data.notExist'))
  }
  // 邮箱格式校验
  if (!common.isEmail(_data.email)) {
    return common.returnFail(t('email.error'))
  }
  // 校验邮箱是否已被使用
  const isEmail = await dao.userDao.isRegisterByEmail(_data.email, userData._id)
  if (isEmail) {
    return common.returnFail(t('email.registered'))
  }
  // 手机号格式校验
  if (!common.isPhone(_data.phone)) {
    return common.returnFail(t('phone.error'))
  }
  // 手机号是否已被使用
  const isPhone = await dao.userDao.isRegisterByPhone(_data.phone, userData._id)
  if (isPhone) {
    return common.returnFail(t('phone.registered'))
  }
  // 密码格式校验
  if (_data.password && !common.validatePassword(_data.password)) {
    return common.returnFail(t('password.formatError'))
  }

  try {
    // 用户信息
    userData.email = _data.email ?? userData.email
    userData.phone = _data.phone ?? userData.phone
    if (_data.password) {
      userData.password = common.hashPassword(_data.password)
    }
    userData.roles = _data.roles ?? userData.roles
    userData.status = _data.status ?? userData.status
    userData.update_time = Date.now()

    const result = await dao.userDao.updateUser(userData)
    if (result && result > 0) {
      return common.returnAndPopup(t('update.success'))
    } else {
      return common.returnFail(t('update.failed'))
    }
  } catch (e) {
    //TODO handle the exception
    console.log('updateUser Error:: ', e.message)
    return common.returnFail(t('update.failed'))
  }
}
