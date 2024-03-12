import cloud from '@lafjs/cloud'
const db = cloud.mongo.db

export default async function (ctx: FunctionContext) {
  // 强制初始化数据，如果为 true 会清空原来的数据库重新添加
  const force = false

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
    // 用户
    dbName: 'user',
    data: [
      {
        _id: '1001',
        username: 'superadmin',
        password:
          '022e531d5e174bbbba9fe41a37270587c73454c76cd674afd2235ecc8356cf45',
        phone: '18888888888',
        email: 'superadmin@vip.com',
        nickname: '超级管理员',
        avatar: '',
        roles: ['admin'],
        balance: 0,
        points: 0,
        gift_points: 0,
        status: 1,
        is_super_admin: true,
        access_token: '',
        create_ip: '127.0.0.1',
        create_time: 1697353854918,
        update_time: 1703878423254,
      },
    ],
  },
  {
    // 充值模板
    dbName: 'recharge_template',
    data: [
      {
        _id: '1001',
        title: '充 100 点赠 10 点',
        recharge_points: 100,
        gift_points: 10,
        sales_price: 1900,
        status: 1,
        sort: 0,
        create_time: 1698414580321,
        update_time: 1698414580321,
      },
      {
        _id: '1002',
        title: '充 200 点赠 20 点',
        recharge_points: 200,
        gift_points: 20,
        sales_price: 9900,
        status: 1,
        sort: 1,
        create_time: 1698414580321,
        update_time: 1698414580321,
      },
      {
        _id: '1003',
        title: '充 500 点赠 200 点',
        recharge_points: 500,
        gift_points: 200,
        sales_price: 19900,
        status: 1,
        sort: 2,
        create_time: 1698414580321,
        update_time: 1698414580321,
      },
      {
        _id: '1004',
        title: '充 1000 点赠 500 点',
        recharge_points: 1000,
        gift_points: 500,
        sales_price: 39900,
        status: 1,
        sort: 3,
        create_time: 1698414580321,
        update_time: 1698414580321,
      },
      {
        _id: '1005',
        title: '充 3000 点赠 1000 点',
        recharge_points: 3000,
        gift_points: 1000,
        sales_price: 59900,
        status: 1,
        sort: 4,
        create_time: 1698414580321,
        update_time: 1698414580321,
      },
      {
        _id: '1006',
        title: '充 5000 点赠 2000 点',
        recharge_points: 5000,
        gift_points: 2000,
        sales_price: 69900,
        status: 1,
        sort: 5,
        create_time: 1698414580321,
        update_time: 1698414580321,
      },
    ],
  },
]
