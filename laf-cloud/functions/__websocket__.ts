import cloud from '@lafjs/cloud'
import console from '@/utils/console'
let changeStream: any
let uid: string
const dbName = 'message'

export async function main(ctx: FunctionContext) {
  if (ctx.method === 'WebSocket:connection') {
    if (!ctx.headers.authorization) {
      ctx.socket.send('connection fail, no token found in headers')
      ctx.socket.close()
      return
    }
    uid = cloud.parseToken(ctx.headers.authorization).user_id
    if (!uid) {
      ctx.socket.close()
      return
    }
    ctx.socket.send('hi connection succeed ' + process.env.HOSTNAME)

    const database = cloud.mongo.db
    const collection = database.collection(dbName)
    const { data } = await cloud
      .database()
      .collection(dbName)
      .where({
        uid,
        status: 'pending',
      })
      .get()
    for (const item of data) {
      ctx.socket.send(item.message)
      await cloud
        .database()
        .collection(dbName)
        .where({
          _id: item._id,
        })
        .update({
          status: 'done',
        })
    }

    changeStream = collection.watch([
      {
        $match: {
          $or: [
            {
              $and: [
                { 'fullDocument.uid': uid },
                { 'fullDocument.status': 'pending' },
                { operationType: 'insert' },
              ],
            },
            {
              $and: [
                { 'updateDescription.updatedFields.status': 'pending' },
                { operationType: 'update' },
              ],
            },
          ],
        },
      },
    ])

    changeStream.on('change', async (change) => {
      console.log('捕获到变化：', change, change.operationType)
      try {
        const { data } = await cloud
          .database()
          .collection('message')
          .where({
            _id: change.documentKey._id,
            status: 'pending',
          })
          .get()
        ctx.socket.send(data[0].message)
        await cloud
          .database()
          .collection('message')
          .where({
            _id: change.documentKey._id,
          })
          .update({
            status: 'done',
          })
      } catch (e) {
        console.error('WebSocket 推送失败', uid, e)
      }
    })
  }

  if (ctx.method === 'WebSocket:message') {
    const { data } = ctx.params
    console.debug('WebSocket:message', uid, data.toString())
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
      await changeStream.close()
    }
    ctx.socket.send('WebSocket:close')
  }
}
