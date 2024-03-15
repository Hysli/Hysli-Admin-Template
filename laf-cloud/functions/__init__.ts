import { common } from '@/utils/common'

export default async function (ctx: FunctionContext) {
  console.log('init', new Date())
  await common.setEnv()
}
