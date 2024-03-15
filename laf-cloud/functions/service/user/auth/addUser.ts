import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, t, log, mail, sms, dao, db, nw } = _ctx

/**
 * 添加用户
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body
  if (ctx.user.roles.indexOf('demo') > -1) {
    return common.returnFail("t('operate.noPermission')")
  }

  // 如果 data 中没有 email 或者 phone，返回错误
  if (!_data?.username) {
    return common.returnFail('Error: username is empty')
  }
  // if (!_data?.email && !_data?.phone) {
  //   return common.returnFail('Error: email or phone is empty')
  // }
  if (!_data?.password) {
    return common.returnFail('Error: password is empty')
  }

  // 校验用户名是否已被使用
  const isUserName = await dao.userDao.isRegisterByUserName(_data.username)
  if (isUserName) {
    return common.returnFail("t('username.registered')")
  }
  // 邮箱格式校验
  if (_data.email && !common.isEmail(_data.email)) {
    return common.returnFail("t('email.error')")
  }
  // 校验邮箱是否已被使用
  const isEmail = await dao.userDao.isRegisterByEmail(_data.email)
  if (_data.isEmail && isEmail) {
    return common.returnFail("t('email.registered')")
  }
  // 手机号格式校验
  if (_data.phone && !common.isPhone(_data.phone)) {
    return common.returnFail("t('phone.error')")
  }
  // 手机号是否已被使用
  const isPhone = await dao.userDao.isRegisterByPhone(_data.phone)
  if (_data.isPhone && isPhone) {
    return common.returnFail("t('phone.registered')")
  }
  // 密码格式校验
  if (!common.validatePassword(_data.password)) {
    return common.returnFail("t('password.formatError')")
  }
  const { headers } = ctx
  const ip = headers['remote-host']
    ? headers['remote-host']
    : headers['x-original-forwarded-for']

  try {
    // 创建用户
    const userInfo = {
      username: _data.username ?? '',
      password: common.hashPassword(_data.password),
      phone: _data.phone ?? '',
      email: _data.email ?? '',
      nickname: _data?.nickname ?? '',
      avatar: _data?.avatar ?? '',
      roles: _data?.roles ?? [],
      balance: 0,
      points: 0,
      gift_points: 0,
      status: _data?.status ?? 1,
      is_super_admin: false,
      access_token: '',
      create_ip: ip.toString(),
      create_time: Date.now(),
      update_time: Date.now(),
    }
    const rid = await dao.userDao.addUser(userInfo)
    if (rid) {
      return common.returnAndPopup("t('add.success')")
    } else {
      return common.returnFail("t('add.failed')")
    }
  } catch (e) {
    //TODO handle the exception
    console.log('addUser Error:: ', e.message)
    return common.returnFail("t('add.failed')")
  }
}
