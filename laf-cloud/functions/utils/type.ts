import cloud, { FunctionContext } from '@lafjs/cloud';
import { UtilsType } from '@/utils/index';
import { Db } from 'database-proxy'
import { NwType } from 'nw-lafjs'

export type newFunctionContext = FunctionContext & UtilsType & {
    db: Db,
    nw: NwType,
}