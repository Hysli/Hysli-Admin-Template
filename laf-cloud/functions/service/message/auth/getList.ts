import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, log, mail, sms, pay, dao, db, nw, console } = _ctx
const _ = cloud.database().command

/**
 * 获取用户列表（带分页）
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _data = ctx.body
  console.log('user', ctx.user)

  let whereJson = {}
  if (_data?.content) {
    const regExp = new RegExp(_data.content)
    whereJson = { content: regExp }
  }

  const list = await dao.messageDao.getList(
    whereJson,
    _data?.page,
    _data?.pageSize
  )
  console.log('list', list)
  return common.returnSuccess('', list)
}
