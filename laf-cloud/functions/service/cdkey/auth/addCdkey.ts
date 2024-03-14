import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, t, log, mail, sms, pay, dao, db, nw, console } = _ctx

/**
 * 添加角色
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body
  if (ctx.user.roles.indexOf('demo') > -1) {
    return common.returnFail(t('operate.noPermission'))
  }

  // 如果 data 中没有 name 或者 code，返回错误
  if (!_data?.name || !_data?.code) {
    return common.returnFail('Error: name or code is empty')
  }

  // 根据角色 code 查询所有角色
  const roleList = await dao.roleManageDao.findListByCode(_data.code)
  if (roleList && roleList.length > 0) {
    return common.returnFail(t('role.codeExist'))
  }

  try {
    // 创建角色
    const roleInfo = {
      code: _data.code,
      name: _data.name,
      description: _data.description ?? '',
      menu_auth: _data.menu_auth ?? [],
      status: _data.status ?? 1,
      create_time: Date.now(),
      update_time: Date.now(),
    }
    const rid = await dao.roleManageDao.addRole(roleInfo)
    if (rid) {
      return common.returnAndPopup(t('add.success'))
    } else {
      return common.returnFail(t('add.failed'))
    }
  } catch (e) {
    //TODO handle the exception
    console.log('addRole Error:: ', e.message)
    return common.returnFail(t('add.failed'))
  }
}
      callback_time: null,
    }
    const rid = await dao.rechargeOrderDao.addRechargeOrder(orderInfo)
    if (rid && (_data.pay_method == 10 || _data.pay_method == 11)) {
      // 创建预支付订单（微信）
      const prepayInfo = {
        orderDesc: title,
        orderNo: rid,
        orderAmount: templateData.sales_price * 100,
        requestIp: ctx.headers['remote-host']
          ? ctx.headers['remote-host']
          : ctx.headers['x-forwarded-for'],
        notifyUrl: `https://${ctx.headers['host']}/notify/wxpay_native_notify`,
        payMethod: _data.pay_method,
      }
      const result = await pay.WxNativePay(prepayInfo)
      if (result.status == 200) {
        let _url = await common.generateQRCode(result.code_url)
        const data = {
          orderNo: rid,
          qrCode: _url,
          status: 'pending',
        }
        return common.returnSuccess(t('add.success'), data)
      }
    }

    return common.returnFail(t('add.failed'))
  } catch (e) {
    //TODO handle the exception
    console.log('addRechargeOrder Error:: ', e.message)
    return common.returnFail(t('add.failed'))
  }
}
