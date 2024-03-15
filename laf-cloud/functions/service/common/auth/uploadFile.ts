import cloud from '@lafjs/cloud'
import { _ctx } from '@/global'
const { common, t, log, mail, sms, qiniu, dao, db, nw } = _ctx
const fs = require('fs')

/**
 * 上传文件
 * @param ctx
 * @returns
 */
export default async function (ctx: FunctionContext) {
  const _files = ctx.files
  if (ctx.user.roles.indexOf('demo') > -1) {
    return common.returnFail("t('operate.noPermission')")
  }
  // console.log('_file', _files)

  // 参数校验
  if (!_files || _files.length == 0) {
    return common.returnFail('file not uploaded!')
  }
  const fileInfo = _files[0]
  if (!fileInfo.filename) {
    return common.returnFail('file name is empty!')
  }
  if (!fileInfo.mimetype) {
    return common.returnFail('file type is empty!')
  }

  try {
    // 获取上传文件的对象
    let fileData = await fs.readFileSync(fileInfo.path)
    let fileName = fileInfo.filename
    // 检测文件是否有后缀名，且后缀名和类型是否匹配
    let _mimetype = fileInfo.mimetype.split('/')
    if (
      fileInfo.filename.split('.').length < 2 &&
      fileInfo.filename.indexOf(_mimetype[1]) < 0
    ) {
      // 如果上传的图片没有后缀名，则在后面追加类型
      if (_mimetype[0] == 'image') {
        fileName = fileName + '.' + _mimetype[1]
      } else {
        // 如果图片没有后缀名，则统一以 wav 的形式存储
        fileInfo.mimetype = 'audio/wave'
        fileName = fileName + '.wav'
      }
    }
    // console.log(fileName, fileData)
    // 上传到七牛云
    const res = await qiniu.uploadFile({
      fileName: fileName,
      fileData: fileData,
    })
    console.log('七牛云返回结果', res)
    fs.unlinkSync(fileInfo.path) // 删除临时文件
    if (!res || !res.fileUrl) {
      return common.returnFail("t('upload.failed')")
    }

    let data = {
      fileName: fileName,
      fileUrl: res.fileUrl,
      fileType: fileInfo.mimetype,
      fileSize: fileInfo.size,
    }
    return common.returnSuccess('upload.success', data)
  } catch (e) {
    //TODO handle the exception
    console.log('uploadFiles Error:: ', e.message)
    return common.returnFail("t('upload.failed')")
  }
}
