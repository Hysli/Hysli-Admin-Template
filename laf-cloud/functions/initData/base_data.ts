import cloud from '@lafjs/cloud'
const db = cloud.mongo.db

export default async function (ctx: FunctionContext) {
  // 强制初始化数据，如果为 true 会清空原来的数据库重新添加
  const force = true

  initData.forEach(async (item) => {
    const dbName = item.dbName

    if (force) {
      try {
        const res = await db.dropCollection(dbName)
        console.log(dbName, res)
      } catch (e) {
        console.log('Collection does not exist')
      }
    }
    const data = item.data
    await addDataToCollectionIfNotExists(dbName, data)
  })
  return
}

async function addDataToCollectionIfNotExists(dbName, data) {
  try {
    const collectionNames = await db.listCollections().toArray()
    const collectionExists = collectionNames.some(
      (collection) => collection.name === dbName
    )

    if (!collectionExists) {
      await db.createCollection(dbName)
      const collection = db.collection(dbName)
      await collection.insertMany(data)
      console.log(`数据成功添加到集合 ${dbName}`)
    } else {
      console.log(`集合 ${dbName} 已存在，数据未添加`)
    }
  } catch (error) {
    console.error(error)
  }
}

const initData = [
  {
    // 系统设置
    dbName: 'system_settings',
    data: [
      {
        _id: '001',
        info: {
          name: 'Hysli-Admin-Template',
          logo: 'Hysli-Admin-Template.png'
        },
        pay: {
          wechat: {
            wx_app_id: 'xxx',
            wx_app_secret: 'xxxxxx',
            app_id: 'xxx',
            app_secret: 'xxxxxx',
            mch_id: 'xxx',
            mch_key: 'xxxxxx',
            private_key: 'xxxxxx',
            public_key: 'xxxxxx',
            status: true
          }
        }
      }
    ]
  },
  {
    // 用户
    dbName: 'user',
    data: [
      {
        _id: '1001',
        password:
          '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
        phone: '18888888888',
        email: '',
        roles: ['admin'],
        status: 1,
        access_token: '',
        create_ip: '127.0.0.1',
        create_time: 1697353854918,
        update_time: 1703878423254
      }
    ]
  }
]
