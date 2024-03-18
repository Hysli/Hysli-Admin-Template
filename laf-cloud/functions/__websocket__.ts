import cloud from '@lafjs/cloud'
import console from '@/utils/console'
let changeStream: any
let uid: string
const dbName = 'message'

let time = Date.now()

export async function main(ctx: FunctionContext) {
  if (ctx.method === 'WebSocket:connection') {
    if (!ctx.headers['sec-websocket-protocol']) {
      ctx.socket.send('connection fail, no token found in headers')
      ctx.socket.close()
      return
    }
    uid = cloud.parseToken(ctx.headers['sec-websocket-protocol']).uid
    if (!uid) {
      ctx.socket.close()
      return
    }
    ctx.socket.send('hi connection succeed ' + process.env.HOSTNAME)

    const database = cloud.mongo.db
    const collection = database.collection(dbName)
    const _ = cloud.database().command
    const { data } = await cloud
      .database()
      .collection(dbName)
      .where({
        uids: _.or(_.eq(uid), _.eq('all')),
        status: _.not(
          _.elemMatch({
            uid: uid,
            status: _.eq('read'),
          })
        ),
      })
      .get()
    for (const item of data) {
      ctx.socket.send(JSON.stringify(item))
      await cloud
        .database()
        .collection(dbName)
        .where({
          _id: item._id,
          'status.uid': _.not(_.eq(uid)),
        })
        .update({
          status: _.push({
            uid: uid,
            status: 'sending',
          }),
        })
    }

    changeStream = collection.watch([
      {
        $match: {
          $or: [
            {
              $and: [
                // 匹配 uids 数组中包含特定 uid 的情况
                { 'fullDocument.uids': uid },
                { operationType: 'insert' },
              ],
            },
            {
              $and: [
                // 匹配 uids 数组中包含字符串 "all" 的情况
                { 'fullDocument.uids': ['all'] },
                { operationType: 'insert' },
              ],
            },
          ],
        },
      },
    ])

    changeStream.on('change', async (change) => {
      console.log('捕获到变化：', ctx.requestId, change, change.operationType)
      try {
        const message = {
          _id: change.fullDocument._id,
          content: change.fullDocument.content,
          type: change.fullDocument.type,
        }
        ctx.socket.send(JSON.stringify(message))
        await cloud
          .database()
          .collection(dbName)
          .where({
            _id: message._id,
            'status.uid': _.not(_.eq(uid)),
          })
          .update({
            status: _.push({
              uid: uid,
              status: 'sending',
            }),
          })
      } catch (e) {
        console.error('WebSocket 推送失败', uid, e)
      }
    })
  }

  if (ctx.method === 'WebSocket:message') {
    const { data } = ctx.params
    // 如果是心跳包则直接返回
    if (data === 'heartbeat') {
      console.log('heartbeat', time)
      if (time <= Date.now() - 30000) {
        time = Date.now()
      } else {
        console.log('heartbeat timeout ', ctx.requestId)
        if (changeStream) {
          changeStream.close()
        }
        ctx.socket.close()
        return
      }
    }
    // 如果回复了已读消息 ID，则更新数据库
    if (data.toString()?.startsWith('read_id:')) {
      const messageId = data.toString().split(':')[1]
      await cloud
        .database()
        .collection(dbName)
        .where({
          _id: messageId,
          'status.uid': uid,
        })
        .update({
          'status.$.status': 'read',
        })
    }
    console.debug('WebSocket:message', ctx.requestId, uid, data.toString())
    ctx.socket.send('I have received your message')
  }

  if (ctx.method === 'WebSocket:error') {
    const error = ctx.params
    console.error('WebSocket:error', uid, error)
  }

  if (ctx.method === 'WebSocket:close') {
    const { code, reason } = ctx.params
    console.debug('WebSocket:close', uid, code, reason)
    if (changeStream) {
      changeStream.close()
    }
    ctx.socket.send('WebSocket:close')
    return
  }
}
