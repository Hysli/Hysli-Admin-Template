import cloud from '@lafjs/cloud'
import console from '@/utils/console'

import moment from 'moment'
import { S3 } from '@aws-sdk/client-s3'

/**
 * 上传文件
 * @param {fileName:string,fileBody:any,contentType:string} obj
 * @returns {object}
 */
export async function uploadFile(obj: any): Promise<any> {
  if (!obj?.fileBody || !obj?.contentType) {
    return null
  }

  const date = moment()
  let key = 'hysliApi-admin-template/' + date.format('YYYYMMDD') + '/'
  if (!obj.fileName) {
    key += Math.ceil(Math.random() * 1000000000000) + '.jpg'
  } else {
    key += obj.fileName
  }

  const endpoint = process.env.CLOUD_OSS_EXTERNAL_ENDPOINT
    ? process.env.CLOUD_OSS_EXTERNAL_ENDPOINT
    : process.env.OSS_EXTERNAL_ENDPOINT
  const region = process.env.CLOUD_OSS_REGION
    ? process.env.CLOUD_OSS_REGION
    : process.env.OSS_REGION
  const accessKeyId = process.env.CLOUD_OSS_ACCESS_KEY
    ? process.env.CLOUD_OSS_ACCESS_KEY
    : process.env.OSS_ACCESS_KEY
  const secretAccessKey = process.env.CLOUD_OSS_ACCESS_SECRET
    ? process.env.CLOUD_OSS_ACCESS_SECRET
    : process.env.OSS_ACCESS_SECRET
  const appid = process.env.CLOUD_OSS_APPID
    ? process.env.CLOUD_OSS_APPID
    : process.env.APPID

  // console.log('上传文件', {
  //   endpoint,
  //   region,
  //   accessKeyId,
  //   secretAccessKey,
  //   appid,
  // })
  //初始化
  const s3Client = new S3({
    endpoint: endpoint,
    region: region,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
    forcePathStyle: true,
  })
  //存储空间名称，带 Laf 应用 appid
  const bucketName = appid + '-oss'

  try {
    const res = await s3Client.putObject({
      Bucket: bucketName,
      Key: key,
      ContentType: obj.contentType,
      Body: obj.fileBody,
    })
    if (res && res.$metadata && res.$metadata.httpStatusCode == 200) {
      const fileUrl = endpoint.replace('oss', bucketName + '.oss') + '/' + key
      return {
        fileUrl: fileUrl,
        fileName: key,
      }
    }
    return null
  } catch (e) {
    console.error('cloud-storage uploadFile error::', e.message)
    return null
  }
}
