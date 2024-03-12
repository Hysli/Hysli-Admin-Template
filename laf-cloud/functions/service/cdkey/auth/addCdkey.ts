import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, t, log, mail, sms, pay, dao, db, nw } = _ctx

/**
 * 添加卡密
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body
  if (ctx.user.roles.indexOf('demo') > -1) {
    return common.returnFail(t('operate.noPermission'))
  }

  // 如果 data 中没有 quantity or points，返回错误
  if (
    _data?.quantity == null ||
    _data?.quantity == undefined ||
    _data?.points == null ||
    _data?.points == undefined ||
    _data?.expires_time == null ||
    _data?.expires_time == undefined
  ) {
    return common.returnFail(
      'Error: quantity or points or expires_time is empty'
    )
  }
  if (_data.quantity < 1 || _data.points < 1) {
    return common.returnFail(t('cdkey.quantityOrPoints'))
  }

  try {
    let count = 0
    for (let i = 1; i <= _data.quantity; i++) {
      const secretKey = common.generateSecretKey(8)
      const _secretKey = _data?.prefix ? _data.prefix + secretKey : secretKey

      // 校验密钥是否已存在
      const isExist = await dao.cdkeyManageDao.isExistBySecretKey(_secretKey)
      if (isExist) {
        i--
      } else {
        // 创建密钥
        const cdkeyInfo = {
          prefix: _data?.prefix ?? '',
          secret_key: _secretKey,
          points: _data?.points ? Number(_data.points) : 0,
          expires_time: _data?.expires_time ?? 0,
          is_gift: _data.is_gift ?? false,
          status: _data.status ?? 1,
          create_time: Date.now(),
          update_time: Date.now(),
          use_time: null,
          uid: null,
        }
        const rid = await dao.cdkeyManageDao.addCdkey(cdkeyInfo)
        if (rid) {
          count++
        }
      }
    }

    if (count >= 0) {
      return common.returnAndPopup(t('add.success'))
    }
    return common.returnFail(t('add.failed'))
  } catch (e) {
    //TODO handle the exception
    console.log('addCdkey Error:: ', e.message)
    return common.returnFail(t('add.failed'))
  }
}
