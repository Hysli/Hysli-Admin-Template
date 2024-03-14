import cloud from '@lafjs/cloud'
import { newFunctionContext } from '@/utils/type'
import { utils } from '@/utils/index'
import nw from 'nw-lafjs'
import console from '@/utils/console'
const db = cloud.database()

let _ctx: newFunctionContext

export function setCtx(newValue) {
  _ctx = newValue
}

// 一个用于初始化 _ctx 的函数
function initializeCtx() {
  // 在这里编写初始化逻辑
  const t = new utils.i18n('zhCN').t
  utils.t = t
  setCtx(Object.assign(utils, { nw, db, console }))
}

if (!_ctx) {
  initializeCtx()
}

export { _ctx }
