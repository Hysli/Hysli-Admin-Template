import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, log, mail, sms, pay, dao, db, nw, console } = _ctx

/**
 * 获取 laf 运行时资源
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const pat = process.env.PAT
  if (!pat) {
    return common.returnFail('PAT is empty')
  }

  const appid = process.env.APPID
  const baseUrl =
    process.env.API_URL || 'http://laf-server.laf-system.svc.cluster.local:3000'
  const user = { pat }

  try {
    const _response = await fetch(`${baseUrl}/v1/auth/pat2token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(user),
    })
    const token: any = await _response.json()
    if (!token || !token.data) {
      return common.returnFail(token.error)
    }

    const response = await fetch(
      `${baseUrl}/v1/monitor/${appid}/metrics?q[]=cpuUsage&q[]=memoryUsage&q[]=databaseUsage&q[]=storageUsage&step=60&type=range`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: 'Bearer ' + token.data,
        },
      }
    )
    const result: any = await response.json()
    if (!result || !result.data) {
      return common.returnFail(result.error)
    }

    const cpuUsage = result.data?.cpuUsage ?? []
    const memoryUsage = result.data?.memoryUsage ?? []
    const databaseUsage = result.data?.databaseUsage[0]?.value ?? []
    const storageUsage = result.data?.storageUsage[0]?.value ?? []

    return common.returnSuccess('', {
      cpuUsage,
      memoryUsage,
      databaseUsage,
      storageUsage,
    })
  } catch (e) {
    //TODO handle the exception
    console.log('getCpuMemoryList Error:: ', e.message)
    return common.returnFail(e.message)
  }
}
