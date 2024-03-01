import cloud, { FunctionContext } from '@lafjs/cloud'

export default function (ctx: FunctionContext):string {
  const funcName = ctx.__function_name
  const requestId = ctx.requestId
  return `[${requestId}]: ${funcName}`
}