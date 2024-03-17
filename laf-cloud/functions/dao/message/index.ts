import cloud from '@lafjs/cloud'
const db = cloud.database()
const _ = db.command

export class MessageDao {
  /**
   * 表名
   */
  static _dbName = 'message'
  static _dbUserName = 'user'

  /**
   * 获取推送列表（带分页）
   * @param whereJson 查询条件 JSON 格式
   * @param pageIndex 当前页数
   * @param pageSize 每页数量
   * @returns 返回用户集合
   */
  static async getList(
    whereJson: any,
    pageIndex: number,
    pageSize: number
  ): Promise<any> {
    const { total } = await cloud
      .database()
      .collection(this._dbName)
      .where(whereJson)
      .count()
    if (total === 0) {
      return {
        rows: [],
        total: 0,
      }
    }
    const db = cloud.mongo.db
    let aggregationPipeline: any[] = []
    // 如果提供了 content 参数，则添加 $match 阶段
    if (whereJson?.content) {
      console.log(1)
      aggregationPipeline.push({
        $match: {
          content: whereJson.content,
        },
      })
    }

    // 添加排序和分页
    aggregationPipeline.push(
      { $sort: { _id: -1 } }, // 按 _id 倒序排序
      {
        $skip: (pageIndex - 1) * pageSize, // 跳过计算得出的文档数
      },
      { $limit: pageSize }
    )

    // 首先添加一个阶段来判断 uids 是否为 ["all"]
    aggregationPipeline.push({
      $addFields: {
        userList: {
          $cond: {
            if: { $eq: ['$uids', ['all']] },
            then: ['all'],
            else: '$$REMOVE', // 如果不是 ["all"]，则在 $lookup 阶段处理
          },
        },
      },
    })

    // 接着是 $lookup 阶段
    aggregationPipeline.push({
      $lookup: {
        from: this._dbUserName,
        let: { uids: '$uids' },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ['$_id', '$$uids'],
              },
            },
          },
          {
            $project: {
              _id: 0,
              username: 1,
              avatar: 1,
            },
          },
        ],
        as: 'userListTemp', // 使用临时字段来存储查找结果
      },
    })

    // 使用 $addFields 或 $project 来调整 userList 字段
    aggregationPipeline.push({
      $addFields: {
        userList: {
          $cond: {
            if: { $eq: ['$uids', ['all']] },
            then: '$userList', // 如果 uids 为 ["all"]，保留之前的值
            else: '$userListTemp', // 否则使用查找结果
          },
        },
      },
    })

    // 移除临时字段
    aggregationPipeline.push({
      $project: {
        userListTemp: 0,
      },
    })

    aggregationPipeline.push(
      {
        $lookup: {
          from: this._dbUserName,
          let: { status: '$status' }, // 定义一个变量 uids，它的值等于 message 文档中的 uids 字段
          pipeline: [
            { $match: { $expr: { $in: ['$_id', '$$status.uid'] } } }, // 在 user 集合中匹配_id 字段与 uids 数组中的值
            {
              $project: {
                _id: 0,
                username: 1,
                avatar: 1,
              },
            }, // 选择性地包含或排除字段
          ],
          as: 'userStatusListTemp', // 结果将放入 userList 字段
        },
      },
      {
        $addFields: {
          userStatusList: {
            $map: {
              input: '$status',
              as: 'stat',
              in: {
                $mergeObjects: [
                  '$$stat',
                  {
                    $arrayElemAt: [
                      '$userStatusListTemp',
                      {
                        $indexOfArray: [
                          '$userStatusListTemp._id',
                          '$$stat.uid',
                        ],
                      },
                    ],
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          'statusWithuserList.uid': 0,
          userStatusListTemp: 0,
          uids: 0,
          status: 0,
        },
      }
    )
    const result: MessageDocument[] = (await db
      .collection(this._dbName)
      .aggregate(aggregationPipeline)
      .toArray()) as MessageDocument[]

    return {
      rows: result,
      total: total,
    }
  }
}

export interface MessageDocument {
  _id: string
  content: string
  type: string
  create_time: number
  userList?: Array<{
    username: string
    avatar: string
  }>
  userStatusList?: Array<{
    status: string
    username: string
    avatar: string
  }>
}
