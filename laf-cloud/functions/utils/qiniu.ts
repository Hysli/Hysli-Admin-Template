import cloud from '@lafjs/cloud'
import console from '@/utils/console'

import moment from 'moment'
// 引入七牛云模块
import qiniu from 'qiniu'

/**
 * 上传文件
 * @param {fileData:string,fileName:string} obj
 * @return {object}
 */
export async function uploadFile(obj: any): Promise<any> {
  if (!obj.fileData) {
    return null
  }
  const date = moment()
  let key = 'hysliApi-admin-template/' + date.format('YYYYMMDD') + '/'
  if (!obj.fileName) {
    key += Math.ceil(Math.random() * 1000000000000) + '.jpg'
  } else {
    key += obj.fileName
  }
  // 配置七牛云 Access Key 和 Secret Key
  const accessKey = process.env.Qiniu_AccessKey.trim()
  const secretKey = process.env.Qiniu_SecretKey.trim()
  // 配置七牛云存储空间名称和域名
  const bucket = process.env.Qiniu_Bucket.trim()
  const domain = process.env.Qiniu_Domain.trim()

  try {
    // console.log('key', key)
    // 初始化七牛云 SDK
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    const config = new qiniu.conf.Config()
    config.zone = qiniu.zone[process.env.Qiniu_Zone.trim()]
    const formUploader = new qiniu.form_up.FormUploader(config)
    const putExtra = new qiniu.form_up.PutExtra()

    // 生成上传凭证
    const options = {
      scope: bucket + ':' + key,
    }
    const putPolicy = new qiniu.rs.PutPolicy(options)
    const uploadToken = putPolicy.uploadToken(mac)
    // console.log('uploadToken', uploadToken)
    const res = await new Promise((resolve, reject) => {
      formUploader.put(
        uploadToken,
        key,
        obj.fileData,
        putExtra,
        function (respErr, respBody, respInfo) {
          if (respErr) {
            // console.log('uploadFile->respErr', respErr)
            reject(null)
          }
          if (respInfo.statusCode == 200) {
            // console.log('uploadFile->respBody', respBody)
            resolve(domain + '/' + key)
          } else {
            // console.log('uploadFile->respInfo', respInfo)
            // console.log('uploadFile->respBody', respBody)
            reject(null)
          }
        }
      )
    })
    return await this.getFileInfo(key)
  } catch (e) {
    console.error('qiniu uploadFile', e.message)
    return null
  }
}

/**
 * 获取文件信息
 * @param {key} key
 * @return {object}
 */
export async function getFileInfo(key: string): Promise<any> {
  if (!key) {
    return null
  }
  // console.log('getFileInfo->key', key)
  // 配置七牛云 Access Key 和 Secret Key
  const accessKey = process.env.Qiniu_AccessKey.trim()
  const secretKey = process.env.Qiniu_SecretKey.trim()
  // 配置七牛云存储空间名称和域名
  const bucket = process.env.Qiniu_Bucket.trim()
  const domain = process.env.Qiniu_Domain.trim()

  try {
    // 初始化七牛云 SDK
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    const config = new qiniu.conf.Config()
    config.zone = qiniu.zone[process.env.Qiniu_Zone]
    const bucketManager = new qiniu.rs.BucketManager(mac, config)

    const res = await new Promise((resolve, reject) => {
      bucketManager.stat(bucket, key, function (err, respBody, respInfo) {
        if (err) {
          // console.log('err', err)
          reject(null)
        } else {
          if (respInfo.statusCode == 200) {
            // console.log('getFileInfo->respBody', respBody)
            let lastIndex = key.lastIndexOf('/')
            resolve({
              fileName: key.substr(lastIndex + 1),
              fileUrl: domain + '/' + key,
              fileType: respBody.mimeType,
              fileSize: respBody.fsize,
            })
          } else {
            // console.log('getFileInfo->respInfo', respInfo)
            // console.log('getFileInfo->respBody', respBody)
            reject(null)
          }
        }
      })
    })
    return res
  } catch (e) {
    console.error('qiniu getFileInfo', e.message)
    return null
  }
}
