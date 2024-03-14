import cloud, { FunctionContext } from '@lafjs/cloud';
import { UtilsType } from '@/utils/index';
import { Db } from 'database-proxy'
import { NwType } from 'nw-lafjs'
import console from '@/utils/console'

export type newFunctionContext = FunctionContext &
  UtilsType & {
    db: Db
    nw: NwType
    console: typeof console
  }