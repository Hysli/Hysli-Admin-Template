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
            wx_app_id: 'wx3f19bac6d9089727',
            wx_app_secret: 'f6c961202989dcdf27eaff85804c2c6c',
            app_id: 'wx6ff710afda480cd6',
            app_secret: '579118da046a93c83580077c4b56e812',
            mch_id: '1621656887',
            mch_key: 'a4139958a4139958a4139958a4139958',
            private_key:
              '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC2msJBre5qr9Z7\nb7hHliibpUdzPGPnsxIsdWgmGc/uV+bA6o44zyBM1DnwU4OTMVlbA7756DwkDcDK\nbWKYs1sNOiAnetfH0+zwiXea6MpkeFUHthRw2srSwRq7B9x7vVQrNCaDnIl5+eUh\ngqHTlkvJzw/sPfeQnm7UMSH6aksU0FvkCPGuT3xnjGi/5rPoskJE7Bhqb6EOZ1Sy\n4UyU4CS9uVL42rfkVr1Fl6b24p5vBg5rtDZSfU4hQv5bLdokBO1U1SFXxGKYCY/M\nh6H+x77p6zNyP6j5y8vtpx3XCOvTuJOcoJEMkdLj5PwofCrn+nBz0qQIuH3szWwm\n8hQfdYuJAgMBAAECggEBAII48YnHUTySM4IJ1UBwDHubLc43ZgPph29fNyvcwpV1\n6GDxpQVMaPuBaeRCmpWQ3ulyTXKJNMJ9cFysD2FYnvla121wRIwETXfogPxfQV7P\nFcyPBBrLXVNZVQfGfm1cQrcg1MqNCtmK5eW09FUhXOEJopBWTMO8yMrYUyPzQ6IO\nFOge6WySEEhdrRIu/Z/WqofJ/JSNIbILwZMRXnnWFLWJJQ0p38gLdOdrId8w7mTv\n5fhccZ4VrKpFxA44wXGy+/z824EC9L4VvC98WweGELgp6FLyqWyPaZE0u+V0UYc3\nfLQ9sulgO9fP6638pAvrub1qJBWsigYREpfsGD+LOtUCgYEA2Q54EHy2VciL9zch\nvUnfUluAl6qdqTJ5esKLWMj7sViJauREnIbQKa22wEHHNp2d6dTeQrXvJxFY+ITF\nfhWRPzbNwKm+Z24tlzZXlczPHWAW4piu15NbQp04gBY2mn+N2fOn7CCvHAsJf9WE\nF1Wo6jB2PjQMIeklQhThYuIOewcCgYEA113j0mQZBd/fGvPssUKhmupi+PXL8Q+D\nalj2BGL1KNUssYz1m1BRd6Xg8uugEmXSiwb30DlpY6YMh2xe3Q8fjbZ6cgcRYYxG\nj5fxZ5OJApCZ/qDmxhDqWrgzboUh6/Ra58gf9eklZUgxiKjraZHvsB2ZmD2mnX/c\n/D8FOiJt0O8CgYAiESFLBSfhAt7k6CRFf0irtmzSYRbprWBfohUY1EKcrRa0Titu\nncIiKH+cYTaRHd/hCWXw9nkYmqJqLvyIM35ee42DhaC6vxIsv3yzqDeBlslAu1IF\nx7z1EZQClnnvecGbyaA7cU3KivjstWhL+UfPqdeFH8ofsGYGnxxY1r4LFQKBgBm3\nuobbMSnEbA355t/cBxRKvPrhzzLAGX9PlEE91+zCWA3zuTiMxM223z/i50CLLDMx\n59HTqUQfBgv94u4e6jOwALsxIOA3Mg3fpRIrSgcmYV1ItYYdav7eVDX0a/KTQW/A\nNCDXcIHBtziMg2Ad7zNmtXq6kfTo2ei9VdB1YAu9AoGAYvDjtRbe7zc0T9piv8sI\niKigoQJDnpcakRl6f+It1ETOJqTep4DzRE9SmdRg7MySDV57zgNkUOi26rWKbVP9\niXTIs7zGtva7qSMNX6r5844/UnMeZv4ohK8pwMMPXOtVPc3grVx7DX5D2jY3ITid\ncTg/LKJksgROdEz3E7EIQ7k=\n-----END PRIVATE KEY-----',
            public_key:
              '-----BEGIN CERTIFICATE-----\nMIIEKzCCAxOgAwIBAgIUTb+JfWjcUWhea7fP1TyqzJIUNVIwDQYJKoZIhvcNAQEL\nBQAwXjELMAkGA1UEBhMCQ04xEzARBgNVBAoTClRlbnBheS5jb20xHTAbBgNVBAsT\nFFRlbnBheS5jb20gQ0EgQ2VudGVyMRswGQYDVQQDExJUZW5wYXkuY29tIFJvb3Qg\nQ0EwHhcNMjMwNTIxMTkzMjM0WhcNMjgwNTE5MTkzMjM0WjCBhDETMBEGA1UEAwwK\nMTYyMTY1Njg4NzEbMBkGA1UECgwS5b6u5L+h5ZWG5oi357O757ufMTAwLgYDVQQL\nDCfmrabmsYnluILmsZ/lpI/ljLrogZrlrrnnvZHnu5zlt6XkvZzlrqQxCzAJBgNV\nBAYMAkNOMREwDwYDVQQHDAhTaGVuWmhlbjCCASIwDQYJKoZIhvcNAQEBBQADggEP\nADCCAQoCggEBALaawkGt7mqv1ntvuEeWKJulR3M8Y+ezEix1aCYZz+5X5sDqjjjP\nIEzUOfBTg5MxWVsDvvnoPCQNwMptYpizWw06ICd618fT7PCJd5roymR4VQe2FHDa\nytLBGrsH3Hu9VCs0JoOciXn55SGCodOWS8nPD+w995CebtQxIfpqSxTQW+QI8a5P\nfGeMaL/ms+iyQkTsGGpvoQ5nVLLhTJTgJL25Uvjat+RWvUWXpvbinm8GDmu0NlJ9\nTiFC/lst2iQE7VTVIVfEYpgJj8yHof7HvunrM3I/qPnLy+2nHdcI69O4k5ygkQyR\n0uPk/Ch8Kuf6cHPSpAi4fezNbCbyFB91i4kCAwEAAaOBuTCBtjAJBgNVHRMEAjAA\nMAsGA1UdDwQEAwID+DCBmwYDVR0fBIGTMIGQMIGNoIGKoIGHhoGEaHR0cDovL2V2\nY2EuaXRydXMuY29tLmNuL3B1YmxpYy9pdHJ1c2NybD9DQT0xQkQ0MjIwRTUwREJD\nMDRCMDZBRDM5NzU0OTg0NkMwMUMzRThFQkQyJnNnPUhBQ0M0NzFCNjU0MjJFMTJC\nMjdBOUQzM0E4N0FEMUNERjU5MjZFMTQwMzcxMA0GCSqGSIb3DQEBCwUAA4IBAQAs\nVwBGYJVIH4kY6K57yL4CGbl5ufhatb/EPM0JABA8LYz3v5agKHMQz5DA86QeRAQ0\n2ceDPBcRIv8NYNxg9gudoeU/vOr4ulVDOYpgQzwdwkoD6qq9akM7JUETdiwHTdU4\nPe9LYVUF9hFJE7iU4UG2FD+aFcLjce5dpYl3zT0m8wZ9FTNQrvsj98dsy4fbndv2\nyRzdY9vpUnKnpH0chHnFzT6BRzmujwtoD5YSqW4BDNHIYzI+7dupwgbtp9dmw7+A\n0hhIiCOXNdeeo92JZUJLp8BsomSNFbHPckunxt99gaQYPYTF+LlBQRUYOP5MnS65\ncOKTpMEZD57/fDqBzbvU\n-----END CERTIFICATE-----',
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
