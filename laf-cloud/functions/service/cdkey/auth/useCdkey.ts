import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, t, log, mail, sms, pay, dao, db, nw } = _ctx
const _ = cloud.database().command

/**
 * 使用卡密
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body
  if (ctx.user.roles.indexOf('demo') > -1) {
    return common.returnFail(t('operate.noPermission'))
  }

  // 如果 data 中没有 secret_key or uid，返回错误
  if (!_data?.secret_key || !ctx.user.uid) {
    return common.returnFail('Error: secret_key or uid is empty')
  }

  // 通过密钥查询卡密
  const cdkeyData = await dao.cdkeyManageDao.findBySecretKey(_data.secret_key)
  if (!cdkeyData) {
    return common.returnFail(t('data.notExist'))
  }
  if (cdkeyData.status == 2) {
    return common.returnFail(t('cdkey.disabled'))
  }
  if (cdkeyData.expires_time < Date.now()) {
    return common.returnFail(t('cdkey.expire'))
  }
  if (cdkeyData.use_time || cdkeyData.uid) {
    return common.returnFail(t('cdkey.used'))
  }

  try {
    const cdkey_id = cdkeyData._id
    cdkeyData.use_time = Date.now()
    cdkeyData.uid = ctx.user.uid
    const result = await dao.cdkeyManageDao.updateCdkey(cdkeyData)
    if (result && result > 0) {
      // 更新用户余额或赠送金额
      let userInfo = await dao.userDao.getInfoById(ctx.user.uid)
      if (cdkeyData.is_gift) {
        userInfo.gift_points = _.inc(cdkeyData.points)
      } else {
        userInfo.points = _.inc(cdkeyData.points)
      }
      userInfo.update_time = Date.now()
      await dao.userDao.updateUser(userInfo)

      // 添加充值记录
      let rechargeRecord = {
        uid: ctx.user.uid,
        recharge_points: cdkeyData.is_gift ? 0 : cdkeyData.points,
        gift_points: cdkeyData.is_gift ? cdkeyData.points : 0,
        pay_amount: 0,
        order_id: '',
        cdkey_id: cdkey_id,
        create_time: Date.now(),
      }
      await dao.rechargeRecordDao.addRechargeRecord(rechargeRecord)

      return common.returnAndPopup(t('operate.success'))
    } else {
      return common.returnFail(t('operate.failed'))
    }
  } catch (e) {
    //TODO handle the exception
    console.log('updateCdkey Error:: ', e.message)
    return common.returnFail(t('update.failed'))
  }
}
