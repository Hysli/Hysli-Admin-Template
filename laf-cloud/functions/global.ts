import { newFunctionContext } from '@/utils/type'
let _ctx: newFunctionContext

export function setCtx(newValue) {
  _ctx = newValue
}

export { _ctx }
