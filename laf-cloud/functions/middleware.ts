import cloud, { FunctionContext } from '@lafjs/cloud'
import nw from 'nw-lafjs'
const db = cloud.database()
const _ = db.command
const $ = _.aggregate
import moment from 'moment'
import { utils } from '@/utils/index'

// 定义处理函数数组
const middlewareFunctions = [
  otherMethod,
  // 云路由拦截器
  authByFuncName,
]

let headers,
  funcName,
  body,
  params,
  method,
  query,
  user,
  requestId,
  socket,
  request,
  router

// 定义一个递归函数来依次调用处理函数
async function executeMiddleware(ctx, index: number = 0): Promise<any> {
  if (index == 0) {
    ;({
      headers,
      body,
      params,
      method,
      query,
      user,
      requestId,
      socket,
      request,
    } = ctx)
    funcName = request.url
    if (headers.router) {
      router = headers.router
    }
    requestRecord()
  }
  // 判断是否还有处理函数未执行
  if (index < middlewareFunctions.length) {
    // 调用当前处理函数，并传入 next 方法作为参数
    return await middlewareFunctions[index](ctx, () =>
      executeMiddleware(ctx, index + 1)
    )
  } else {
    // 所有处理函数执行完毕，返回默认结果
    ctx.response.status(500)
    ctx.response.send('Error')
    return false
  }
}

// 记录任何用户的访问记录并存在数据库中
function requestRecord() {
  const user_agent = headers['user-agent']
  const referer = headers['referer']
  const ip = headers['remote-host']
    ? headers['remote-host']
    : headers['x-forwarded-for']
  // 如果 user 不存在，看看是否有 key
  if (!user) {
    const key = headers['Authorization'] || headers['authorization']
    if (key) {
      const { uid } = utils.common.aesDecKey(key) as any
      user = {
        uid,
      }
    }
  }

  const request_log = db.collection('request_log')
  // 添加请求 IP 到数据库，并自动添加 add_time
  request_log.add({
    headers,
    request_id: requestId,
    ip,
    router,
    user_agent: user_agent,
    referer: referer,
    funcName,
    body,
    query,
    params,
    user,
    method,
    req_time: Date.now(),
    u8_req_time: moment(new Date()).utcOffset(8).format('YYYY/MM/DD HH:mm:ss'),
  })
}

// 根据云函数名来鉴权，这个放在最后执行
async function authByFuncName(ctx: FunctionContext) {
  if (funcName !== '/api') {
    // const isValidFormat = /^\/service(?:\/[^/]+)*\/(sys|pub|auth)(?:\/[^/]+)*$/.test(funcName);
    if (funcName.startsWith('/service')) {
      ctx.response.status(400)
      ctx.response.json({
        code: 400,
        error: 'Invalid Input',
      })
      return false
    } else {
      return true
    }
  }
  // 如果 funcName 是 api，则需要鉴权
  if (funcName === '/api' && router) {
    // 鉴权逻辑
    // 判断 router 是否符合规范
    try {
      const isValidFormat =
        /^\/service(?:\/[^/]+)*\/(pub|auth)(?:\/[^/]+)*$/.test(router)
      if (isValidFormat) {
        ctx.response.status(400)
        ctx.response.json({
          code: 400,
          error: 'Invalid Input',
        })
        return false
      }
      // 提取倒数第二个部分
      const parts = router.split('/')
      const secondLastPart = parts[parts.length - 2]
      switch (secondLastPart) {
        case 'auth':
          if (user) {
            const isRoles = await authByRoles(user.roles, router, body)
            if (isRoles) {
              return true
            } else {
              ctx.response.status(401)
              ctx.response.json({
                code: 401,
                error: 'Unauthorized',
              })
              return false
            }
          } else {
            ctx.response.status(401)
            ctx.response.json({
              code: 401,
              error: 'Unauthorized',
            })
            return false
          }
        case 'pub':
          return true
        default:
          ctx.response.status(401)
          ctx.response.json({
            code: 401,
            error: 'Unauthorized',
          })
          return false
      }
    } catch (e) {
      console.log('router 结构错误', e)
      ctx.response.status(401)
      ctx.response.json({
        code: 401,
        error: 'Unauthorized',
      })
      return false
    }
  }
  return true
}

async function otherMethod(ctx: FunctionContext, next: () => Promise<any>) {
  // 其他方法的逻辑
  // ...
  // console.log('otherMethod');

  // 执行下一个处理函数
  return next()
}

// 通过用户 roles 查询云函数路由权限
async function authByRoles(roles: string[], router: string, body?: any) {
  try {
    const permission = body?._type ? router + ':' + body._type : router
    // 查询所有的菜单云路由
    const count = await nw.db.count({
      dbName: 'menu_manage',
      whereJson: {
        permission,
      },
    })
    if (count == 0) {
      return true
    }
    // 查询数据库中对应 role 的全部数据
    const roleData = await nw.db.selects({
      dbName: 'role_manage',
      whereJson: {
        code: db.command.in(roles),
      },
      foreignDB: [
        {
          dbName: 'menu_manage',
          localKey: 'menu_auth',
          localKeyType: 'array',
          foreignKey: '_id',
          as: 'roleList',
          limit: 1,
          whereJson: {
            permission,
          },
        },
      ],
    })
    if (roleData && roleData.rows[0].roleList) {
      return true
    }
    return false
  } catch (e) {
    //TODO handle the exception
    console.log('authByRoles 报错', e)
    return false
  }
}

export default executeMiddleware
