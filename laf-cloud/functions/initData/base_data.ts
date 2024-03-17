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
  {
    // laf 环境变量（系统参数）
    dbName: 'laf_env',
    data: [
      {
        _id: '1001',
        name: '腾讯云-密钥Id',
        key: 'TencentCloud_SecretId',
        value: 'AKIDsa6QL2VlmbBZkhOq68vTovoSr31kEWaQ',
        group: 'email',
        status: 1,
        create_time: 1710599452001,
        update_time: 1710599452001,
      },
      {
        _id: '1002',
        name: '腾讯云-密钥Key',
        key: 'TencentCloud_SecretKey',
        value: 'e4ZswmNlvqWzGtSox3zta3MSM3XqxrX7',
        group: 'email',
        status: 1,
        create_time: 1710599452002,
        update_time: 1710599452002,
      },
      {
        _id: '1003',
        name: '腾讯云-发送人邮箱',
        key: 'TencentCloud_FromEmail',
        value: 'test@hysli.io',
        group: 'email',
        status: 1,
        create_time: 1710599452003,
        update_time: 1710599452003,
      },
      {
        _id: '1004',
        name: '阿里云-密钥Key',
        key: 'Alicloud_AccessKeyId',
        value: 'LTAI5tPa8uw7EYwYQspSGwtd',
        group: 'sms',
        status: 1,
        create_time: 1710599452004,
        update_time: 1710599452004,
      },
      {
        _id: '1005',
        name: '阿里云-密钥Secret',
        key: 'Alicloud_AccessKeySecret',
        value: 'OFebGpQCiFhkHMRhNbSk7eKYIlWglW',
        group: 'sms',
        status: 1,
        create_time: 1710599452005,
        update_time: 1710599452005,
      },
      {
        _id: '1006',
        name: '阿里云-短信签名',
        key: 'Alicloud_SignName',
        value: '有氢',
        group: 'sms',
        status: 1,
        create_time: 1710599452006,
        update_time: 1710599452006,
      },
      {
        _id: '1007',
        name: '阿里云-短信模板',
        key: 'Alicloud_TemplateCode',
        value: 'SMS_186616270',
        group: 'email',
        status: 1,
        create_time: 1710599452007,
        update_time: 1710599452007,
      },
      {
        _id: '1008',
        name: '阿里云-短信API网关地址',
        key: 'Alicloud_Endpoint',
        value: 'dysmsapi.aliyuncs.com',
        group: 'email',
        status: 1,
        create_time: 1710599452008,
        update_time: 1710599452008,
      },
      {
        _id: '1009',
        name: '七牛云存储-密钥AK',
        key: 'Qiniu_AccessKey',
        value: 'kfo42xGReTkBV3NabUJfTukWHuHGGhEMVskzmHSF',
        group: 'storage',
        status: 1,
        create_time: 1710599452009,
        update_time: 1710599452009,
      },
      {
        _id: '1010',
        name: '七牛云存储-密钥SK',
        key: 'Qiniu_SecretKey',
        value: '0XxXhbzjJtMweQbpEiKbmflJPW6yIWqRn0wS_v_J',
        group: 'storage',
        status: 1,
        create_time: 1710599452010,
        update_time: 1710599452010,
      },
      {
        _id: '1011',
        name: '七牛云存储-空间名称',
        key: 'Qiniu_Bucket',
        value: 'yiqi',
        group: 'storage',
        status: 1,
        create_time: 1710599452011,
        update_time: 1710599452011,
      },
      {
        _id: '1012',
        name: '七牛云存储-访问域名',
        key: 'Qiniu_Domain',
        value: 'https://qn.iruddock.com',
        group: 'storage',
        status: 1,
        create_time: 1710599452012,
        update_time: 1710599452012,
      },
      {
        _id: '1013',
        name: '七牛云存储-保存区域',
        key: 'Qiniu_Zone',
        value: 'Zone_z2',
        group: 'storage',
        status: 1,
        create_time: 1710599452013,
        update_time: 1710599452013,
      },
      {
        _id: '1014',
        name: 'laf云存储-访问域名',
        key: 'CLOUD_OSS_EXTERNAL_ENDPOINT',
        value: 'https://oss.console.hysli.cn',
        group: 'storage',
        status: 1,
        create_time: 1710599452014,
        update_time: 1710599452014,
      },
      {
        _id: '1015',
        name: 'laf云存储-保存区域',
        key: 'CLOUD_OSS_REGION',
        value: 'default',
        group: 'storage',
        status: 1,
        create_time: 1710599452015,
        update_time: 1710599452015,
      },
      {
        _id: '1016',
        name: 'laf云存储-密钥Key',
        key: 'CLOUD_OSS_ACCESS_KEY',
        value: 'xwp2br',
        group: 'storage',
        status: 1,
        create_time: 1710599452016,
        update_time: 1710599452016,
      },
      {
        _id: '1017',
        name: 'laf云存储-密钥Secret',
        key: 'CLOUD_OSS_ACCESS_SECRET',
        value:
          'KvdAad4oCUsQIhtkaAtcr50ZSwQpjgvYxjnGqVqeBpVz9YJMh7itSmckNLhxuqSh',
        group: 'storage',
        status: 1,
        create_time: 1710599452016,
        update_time: 1710599452016,
      },
      {
        _id: '1018',
        name: 'laf云存储-应用ID',
        key: 'CLOUD_OSS_APPID',
        value: 'xwp2br',
        group: 'storage',
        status: 1,
        create_time: 1710599452018,
        update_time: 1710599452018,
      },
      {
        _id: '1019',
        name: '云存储-是否启用七牛云',
        key: 'ENABLE_QINIU',
        value: 'false',
        group: 'storage',
        status: 1,
        create_time: 1710599452019,
        update_time: 1710599452019,
      },
      {
        _id: '1020',
        name: 'laf日志-打印深度',
        key: 'LOG_DEPTH',
        value: '5',
        group: '',
        status: 1,
        create_time: 1710599452020,
        update_time: 1710599452020,
      },
    ],
  },
]
