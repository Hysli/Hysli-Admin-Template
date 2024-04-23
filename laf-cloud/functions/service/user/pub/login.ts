import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, log, mail, sms, pay, dao, db, nw, console } = _ctx

// 发送者邮箱
const fromEmail = cloud.env.TencentCloud_FromEmail

// 用户登录
export default async function (ctx: FunctionContext) {
  const { _type, _data } = ctx.body

  switch (_type) {
    case 'username':
      // 如果 data 中没有 username 或者 password，返回错误
      if (!_data?.username || !_data?.password) {
        return common.returnFail('Error: username or password is empty')
      }
      return await loginByUserName(_data.username, _data.password)
    case 'email':
      // 如果 data 中没有 email 或者 password，返回错误
      if (!_data?.email || !_data?.password) {
        return common.returnFail('Error: email or password is empty')
      }
      return await loginByEmail(_data.email, _data.password)
    case 'sendEmailCode':
      // 如果 data 中没有 email，返回错误
      if (!_data?.email) {
        return common.returnFail('Error: email is empty')
      }
      return await sendEmailCode(_data.email)
    case 'emailCode':
      // 如果 data 中没有 email 或者 code，返回错误
      if (!_data?.email || !_data?.code) {
        return common.returnFail('Error: email or code is empty')
      }
      return await loginByEmailCode(_data.email, _data.code)
    case 'phone':
      // 如果 data 中没有 phone 或者 password，返回错误
      if (!_data?.phone || !_data?.password) {
        return common.returnFail('Error: phone or password is empty')
      }
      return await loginByPhone(_data.phone, _data.password)
    case 'sendSmsCode':
      // 如果 data 中没有 email，返回错误
      if (!_data?.phone) {
        return common.returnFail('Error: phone is empty')
      }
      return await sendSmsCode(_data.phone)
    case 'phoneCode':
      // 如果 data 中没有 email 或者 code，返回错误
      if (!_data?.phone || !_data?.code) {
        return common.returnFail('Error: phone or code is empty')
      }
      return await loginByPhoneCode(_data.phone, _data.code)
    default:
      return common.returnFail('Error: type is error')
  }

  // 通过用户名、密码登录
  async function loginByUserName(username: string, password: string) {
    // 密码格式校验
    if (!common.validatePassword(password)) {
      return common.returnFail("t('password.formatError')")
    }

    try {
      // 通过用户名查询用户
      const userData = await dao.userDao.findByUserName(username)
      if (!userData) {
        return common.returnFail("t('username.notRegistered')")
      }
      // 校验密码是否正确
      if (userData.password !== common.hashPassword(password)) {
        return common.returnFail("t('password.error')")
      }
      // 校验状态是否已被禁用
      if (userData.status == 2) {
        return common.returnFail("t('account.disabled')")
      }

      const access_token = common.getToken7day(userData._id, userData.roles)
      const ip = common.getIP(ctx)
      const ip_info = await getIPInfo(ip)
      // 更新 access_token
      await dao.userDao.updateAccessTokenById(userData._id, access_token)
      // 插入登录日志
      await dao.userLoginLogDao.addUserLoginLog({
        uid: userData._id,
        login_ip: ip.toString(),
        login_ip_info: ip_info,
        login_time: Date.now(),
      })

      return common.returnAndPopup("t('account.loginSuccess')", {
        access_token,
      })
    } catch (e) {
      //TODO handle the exception
      console.error('loginByUserName Error:: ', e.message)
      return common.returnFail("t('account.loginError')")
    }
  }

  // 通过邮件、密码登录
  async function loginByEmail(email: string, password: string) {
    // 邮箱格式校验
    if (!common.isEmail(email)) {
      return common.returnFail("t('email.error')")
    }
    // 密码格式校验
    if (!common.validatePassword(password)) {
      return common.returnFail("t('password.formatError')")
    }

    try {
      // 通过邮箱查询用户
      const userData = await dao.userDao.findByEmail(email)
      if (!userData) {
        return common.returnFail("t('email.notRegistered')")
      }
      // 校验密码是否正确
      if (userData.password !== common.hashPassword(password)) {
        return common.returnFail("t('password.error')")
      }
      // 校验状态是否已被禁用
      if (userData.status == 2) {
        return common.returnFail("t('account.disabled')")
      }

      const access_token = common.getToken7day(userData._id, userData.roles)
      const ip = common.getIP(ctx)
      const ip_info = await getIPInfo(ip)

      // 更新 access_token
      await dao.userDao.updateAccessTokenById(userData._id, access_token)
      // 插入登录日志
      await dao.userLoginLogDao.addUserLoginLog({
        uid: userData._id,
        login_ip: ip.toString(),
        login_ip_info: ip_info,
        login_time: Date.now(),
      })

      return common.returnAndPopup("t('account.loginSuccess')", {
        access_token,
      })
    } catch (e) {
      //TODO handle the exception
      console.error('loginByEmail Error:: ', e.message)
      return common.returnFail("t('account.loginError')")
    }
  }

  // 发送邮件验证码
  async function sendEmailCode(email: string): Promise<object> {
    // 邮箱格式校验
    if (!common.isEmail(email)) {
      return common.returnFail("t('email.error')")
    }

    try {
      // 通过邮箱查询用户
      const userData = await dao.userDao.findByEmail(email)
      if (!userData) {
        return common.returnFail("t('email.notRegistered')")
      }
      // 校验状态是否已被禁用
      if (userData.status == 2) {
        return common.returnFail("t('account.disabled')")
      }

      // 类型 {'register':'注册，'login':'登录'}
      const logType = 'login'
      // 获取最后一条邮件日志记录
      const mailLogData = await dao.mailLogDao.findLastByWhere(
        fromEmail,
        email,
        undefined,
        logType
      )
      if (mailLogData) {
        // 判断发送邮件间隔
        const codeTime = mailLogData.send_time
        const now = Date.now()
        if (now - codeTime <= 1000 * 60 * 2) {
          return common.returnFail("t('email.sendTooOften')")
        }
      }

      // 发送邮件
      // const code = common.generateRandomCode()
      const code = common.generateVerificationCode()
      const messageId = await await mail.sendEmailCode(email, code)
      if (messageId) {
        // 插入邮件日志表
        const mailLogInfo = {
          from_email: fromEmail,
          to_email: email,
          code: code,
          type: logType,
          message_id: messageId,
          status: 'pending',
          reason: '',
          send_time: Date.now(),
          update_time: Date.now(),
        }
        await dao.mailLogDao.addMailLog(mailLogInfo)

        return common.returnAndPopup("t('email.sendPending')")
      }

      return common.returnFail("t('email.sendError')")
    } catch (e) {
      //TODO handle the exception
      console.error('sendEmailCode Exception:: ', e.message)
      return common.returnFail("t('email.sendError')")
    }
  }

  // 通过邮箱验证码登录
  async function loginByEmailCode(email: string, code: string) {
    // 邮箱格式校验
    if (!common.isEmail(email)) {
      return common.returnFail("t('email.error')")
    }
    // 验证码格式校验
    if (!common.codeFormat(code)) {
      return common.returnFail("t('email.codeFormatError')")
    }

    try {
      // 通过邮箱查询用户
      const userData = await dao.userDao.findByEmail(email)
      if (!userData) {
        return common.returnFail("t('email.notRegistered')")
      }
      // 校验状态是否已被禁用
      if (userData.status == 2) {
        return common.returnFail("t('account.disabled')")
      }
      // 通过邮箱验证码获取最后一条邮件记录
      const mailLogData = await dao.mailLogDao.findLastByWhere(
        fromEmail,
        email,
        code,
        'login'
      )
      if (!mailLogData) {
        return common.returnFail("t('email.codeError')")
      }
      // 验证码是否过期
      const codeTime = mailLogData.send_time
      const now = Date.now()
      if (now - codeTime > 1000 * 60 * 5) {
        return common.returnFail("t('email.codeExpired')")
      }
      const access_token = common.getToken7day(userData._id, userData.roles)
      const ip = common.getIP(ctx)
      const ip_info = await getIPInfo(ip)

      // 更新 access_token
      await dao.userDao.updateAccessTokenById(userData._id, access_token)
      // 插入登录日志
      await dao.userLoginLogDao.addUserLoginLog({
        uid: userData._id,
        login_ip: ip.toString(),
        login_ip_info: ip_info,
        login_time: Date.now(),
      })
      // 修改邮件验证码的状态
      await dao.mailLogDao.updateStatusById(mailLogData._id, 'used')

      return common.returnAndPopup("t('account.loginSuccess')", {
        access_token,
      })
    } catch (e) {
      //TODO handle the exception
      console.error('loginByEmailCode Error:: ', e.message)
      return common.returnFail("t('account.loginError')")
    }
  }

  // 通过手机号、密码登录
  async function loginByPhone(phone: string, password: string) {
    // 手机号格式校验
    if (!common.isPhone(phone)) {
      return common.returnFail("t('phone.error')")
    }
    // 密码格式校验
    if (!common.validatePassword(password)) {
      return common.returnFail("t('password.formatError')")
    }

    try {
      // 通过手机号查询用户
      const userData = await dao.userDao.findByPhone(phone)
      if (!userData) {
        return common.returnFail("t('phone.notRegistered')")
      }
      // 校验密码是否正确
      if (userData.password !== common.hashPassword(password)) {
        return common.returnFail("t('password.error')")
      }
      // 校验状态是否已被禁用
      if (userData.status == 2) {
        return common.returnFail("t('account.disabled')")
      }

      const access_token = common.getToken7day(userData._id, userData.roles)
      const ip = common.getIP(ctx)
      const ip_info = await getIPInfo(ip)

      // 更新 access_token
      await dao.userDao.updateAccessTokenById(userData._id, access_token)
      // 插入登录日志
      await dao.userLoginLogDao.addUserLoginLog({
        uid: userData._id,
        login_ip: ip.toString(),
        login_ip_info: ip_info,
        login_time: Date.now(),
      })

      return common.returnAndPopup("t('account.loginSuccess')", {
        access_token,
      })
    } catch (e) {
      //TODO handle the exception
      console.error('loginByPhone Error:: ', e.message)
      return common.returnFail("t('account.loginError')")
    }
  }

  // 发送短信验证码
  async function sendSmsCode(phone: string): Promise<object> {
    // 手机号格式校验
    if (!common.isPhone(phone)) {
      return common.returnFail("t('phone.error')")
    }

    try {
      // 通过手机号查询用户
      const userData = await dao.userDao.findByPhone(phone)
      if (!userData) {
        return common.returnFail("t('phone.notRegistered')")
      }
      // 校验状态是否已被禁用
      if (userData.status == 2) {
        return common.returnFail("t('account.disabled')")
      }

      // 类型 {'register':'注册，'login':'登录'}
      const logType = 'login'
      // 获取最后一条邮件日志记录
      const smsLogData = await dao.smsLogDao.findLastByWhere(
        phone,
        undefined,
        logType
      )
      if (smsLogData) {
        // 判断发送短信间隔
        const codeTime = smsLogData.send_time
        const now = Date.now()
        if (now - codeTime <= 1000 * 60 * 2) {
          return common.returnFail("t('phone.sendTooOften')")
        }
      }

      // 发送短信
      // const code = common.generateRandomCode()
      const code = common.generateVerificationCode()
      const result = await sms.sendSmsCode(phone, code)
      if (result) {
        // 插入短信日志表
        const smsLogInfo = {
          phone,
          code,
          type: logType,
          status: 'success',
          send_time: Date.now(),
          update_time: Date.now(),
        }
        await dao.smsLogDao.addSmsLog(smsLogInfo)

        return common.returnAndPopup("t('phone.sendPending')")
      }

      return common.returnFail("t('phone.sendError')")
    } catch (e) {
      //TODO handle the exception
      console.error('sendPhoneCode Error:: ', e.message)
      return common.returnFail("t('phone.sendError')")
    }
  }

  // 通过短信验证码登录
  async function loginByPhoneCode(phone: string, code: string) {
    // 手机号格式校验
    if (!common.isPhone(phone)) {
      return common.returnFail("t('phone.error')")
    }
    // 验证码格式校验
    if (!common.codeFormat(code)) {
      return common.returnFail("t('phone.codeFormatError')")
    }

    try {
      // 通过手机号查询用户
      const userData = await dao.userDao.findByPhone(phone)
      if (!userData) {
        return common.returnFail("t('phone.notRegistered')")
      }
      // 校验状态是否已被禁用
      if (userData.status == 2) {
        return common.returnFail("t('account.disabled')")
      }
      // 通过短信验证码获取最后一条短信记录
      const smsLogData = await dao.smsLogDao.findLastByWhere(
        phone,
        code,
        'login'
      )
      if (!smsLogData) {
        return common.returnFail("t('phone.codeError')")
      }
      // 验证码是否过期
      const codeTime = smsLogData.send_time
      const now = Date.now()
      if (now - codeTime > 1000 * 60 * 5) {
        return common.returnFail("t('phone.codeExpired')")
      }
      const access_token = common.getToken7day(userData._id, userData.roles)
      const ip = common.getIP(ctx)
      const ip_info = await getIPInfo(ip)

      // 更新 access_token
      await dao.userDao.updateAccessTokenById(userData._id, access_token)
      // 插入登录日志
      await dao.userLoginLogDao.addUserLoginLog({
        uid: userData._id,
        login_ip: ip.toString(),
        login_ip_info: ip_info,
        login_time: Date.now(),
      })
      // 修改短信验证码的状态
      dao.smsLogDao.updateStatusById(smsLogData._id, 'used')

      return common.returnAndPopup("t('account.loginSuccess')", {
        access_token,
      })
    } catch (e) {
      //TODO handle the exception
      console.error('loginByPhoneCode Error:: ', e.message)
      return common.returnFail("t('phone.loginError')")
    }
  }
}

async function getIPInfo(ip: string) {
  if (process.env.GetIPInfoOff) {
    return {}
  }
  try {
    const ipInfo = await cloud.fetch.get(`https://ipapi.co/${ip}/json/`)
    return ipInfo.data
  } catch (e) {
    //TODO handle the exception
    console.error('getIPInfo Error:: ', e.message)
    return ip
  }
}
