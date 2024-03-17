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
      return await registerByUserName(_data.username, _data.password)
    case 'email':
      // 如果 data 中没有 email 或者 code、password，返回错误
      if (!_data?.email || !_data?.code || !_data?.password) {
        return common.returnFail('Error: email or code or password is empty')
      }
      return await registerByEmail(_data.email, _data.code, _data.password)
    case 'sendEmailCode':
      // 如果 data 中没有 email，返回错误
      if (!_data?.email) {
        return common.returnFail('Error: email is empty')
      }
      return await sendEmailCode(_data.email)
    case 'phone':
      // 如果 data 中没有 phone 或者 code、password，返回错误
      if (!_data?.phone || !_data?.code || !_data?.password) {
        return common.returnFail('Error: phone or code or password is empty')
      }
      return await registerByPhone(_data.phone, _data.code, _data.password)
    case 'sendSmsCode':
      // 如果 data 中没有 phone，返回错误
      if (!_data?.phone) {
        return common.returnFail('Error: phone is empty')
      }
      return await sendSmsCode(_data.phone)
    default:
      return common.returnFail('Error: type is error')
  }

  // 通过用户名注册账号
  async function registerByUserName(username: string, password: string) {
    // 密码格式校验
    if (!common.validatePassword(password)) {
      return common.returnFail("t('password.formatError')")
    }
    // 校验用户名是否已经注册
    const isRegister = await dao.userDao.isRegisterByUserName(username)
    if (isRegister) {
      return common.returnFail("t('username.registered')")
    }

    const ip = common.getIP(ctx)

    try {
      // 创建用户
      const userInfo = {
        username: username,
        password: common.hashPassword(password),
        phone: '',
        email: '',
        nickname: '用户_' + common.generateSecretKey(8),
        avatar: '',
        roles: ['common'], // default role is common
        balance: 0,
        points: 0,
        gift_points: 0,
        status: 1, // default status is 1
        access_token: '',
        create_ip: ip.toString(),
        create_time: Date.now(),
        update_time: Date.now(),
      }
      const uid = await dao.userDao.addUser(userInfo)
      if (uid) {
        return common.returnAndPopup("t('account.registerSuccess')")
      } else {
        return common.returnFail("t('account.registerFail')")
      }
    } catch (e) {
      //TODO handle the exception
      console.error('registerByEmail Error:: ', e.message)
      return common.returnFail("t('account.registerFail')")
    }
  }

  // 通过邮件注册账号
  async function registerByEmail(
    email: string,
    code: string,
    password: string
  ) {
    // 邮箱格式校验
    if (!common.isEmail(email)) {
      return common.returnFail("t('email.error')")
    }
    // 验证码格式校验
    if (!common.codeFormat(code)) {
      return common.returnFail("t('email.codeFormatError')")
    }
    // 密码格式校验
    if (!common.validatePassword(password)) {
      return common.returnFail("t('password.formatError')")
    }
    // 校验邮箱是否已经注册
    const isRegister = await dao.userDao.isRegisterByEmail(email)
    if (isRegister) {
      return common.returnFail("t('email.registered')")
    }
    // 通过邮箱验证码获取最后一条邮件记录
    const mailLogData = await dao.mailLogDao.findLastByWhere(
      fromEmail,
      email,
      code,
      'register'
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
    const ip = common.getIP(ctx)

    try {
      // 创建用户
      const userInfo = {
        username: '',
        password: common.hashPassword(password),
        phone: '',
        email: email,
        nickname: '用户_' + common.generateSecretKey(8),
        avatar: '',
        roles: ['common'], // default role is common
        balance: 0,
        points: 0,
        gift_points: 0,
        status: 1, // default status is 1
        access_token: '',
        create_ip: ip.toString(),
        create_time: Date.now(),
        update_time: Date.now(),
      }
      const uid = await dao.userDao.addUser(userInfo)
      if (uid) {
        // 修改邮件验证码的状态
        await dao.mailLogDao.updateStatusById(mailLogData._id, 'used')

        return common.returnAndPopup("t('account.registerSuccess')")
      } else {
        return common.returnFail("t('account.registerFail')")
      }
    } catch (e) {
      //TODO handle the exception
      console.error('registerByEmail Error:: ', e.message)
      return common.returnFail("t('account.registerFail')")
    }
  }

  // 点击发送邮件验证码
  async function sendEmailCode(email: string): Promise<object> {
    // 邮箱格式校验
    if (!common.isEmail(email)) {
      return common.returnFail("t('email.error')")
    }

    try {
      // 校验邮箱是否已经注册
      const isRegister = await dao.userDao.isRegisterByEmail(email)
      if (isRegister) {
        return common.returnFail("t('email.registered')")
      }

      // 类型 {'register':'注册，'login':'登录'}
      const logType = 'register'
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
      const messageId = await mail.sendEmailCode(email, code)
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

  // 通过手机号注册账号
  async function registerByPhone(
    phone: string,
    code: string,
    password: string
  ) {
    // 手机号格式校验
    if (!common.isPhone(phone)) {
      return common.returnFail("t('phone.error')")
    }
    // 验证码格式校验
    if (!common.codeFormat(code)) {
      return common.returnFail("t('phone.codeFormatError')")
    }
    // 密码格式校验
    if (!common.validatePassword(password)) {
      return common.returnFail("t('password.formatError')")
    }
    // 手机号是否已经注册
    const isRegister = await dao.userDao.isRegisterByPhone(phone)
    if (isRegister) {
      return common.returnFail("t('phone.registered')")
    }
    // 通过短信验证码获取最后一条短信记录
    const smsLogData = await dao.smsLogDao.findLastByWhere(
      phone,
      code,
      'register'
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
    const ip = common.getIP(ctx)

    try {
      // 创建用户
      const userInfo = {
        username: '',
        password: common.hashPassword(password),
        phone: phone,
        email: '',
        nickname: '用户_' + common.generateSecretKey(8),
        avatar: '',
        roles: ['common'], // default role is common
        balance: 0,
        points: 0,
        gift_points: 0,
        status: 1, // default status is 1
        access_token: '',
        create_ip: ip.toString(),
        create_time: Date.now(),
        update_time: Date.now(),
      }
      const uid = await dao.userDao.addUser(userInfo)
      if (uid) {
        // 修改短信验证码的状态
        await dao.smsLogDao.updateStatusById(smsLogData._id, 'used')

        return common.returnAndPopup("t('account.registerSuccess')")
      } else {
        return common.returnFail("t('account.registerFail')")
      }
    } catch (e) {
      //TODO handle the exception
      console.error('registerByPhone Error:: ', e.message)
      return common.returnFail("t('account.registerFail')")
    }
  }

  // 点击发送短信验证码
  async function sendSmsCode(phone: string): Promise<object> {
    // 手机号格式校验
    if (!common.isPhone(phone)) {
      return common.returnFail("t('phone.error')")
    }

    try {
      // 手机号是否已经注册
      const isRegister = await dao.userDao.isRegisterByPhone(phone)
      if (isRegister) {
        return common.returnFail("t('phone.registered')")
      }

      // 类型 {'register':'注册，'login':'登录'}
      const logType = 'register'
      // 获取最后一条短信日志记录
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
      console.error('sendSmsCode Exception:: ', e.message)
      return common.returnFail("t('phone.sendError')")
    }
  }
}
