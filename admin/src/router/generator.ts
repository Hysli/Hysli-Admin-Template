import { getUserMenu } from '@/api/user'
import { constantRouterIcon, constantRouterIcon2 } from './icons'
import { RouteRecordRaw } from 'vue-router'
import { Layout, ParentLayout } from '@/router/constant'
import type { AppRouteRecordRaw } from '@/router/types'

// const Iframe = () => import('@/views/iframe/index.vue')
const LayoutMap = new Map<string, () => Promise<typeof import('*.vue')>>()

LayoutMap.set('Layout', Layout)
// LayoutMap.set('IFrame', Iframe)

/**
 * 格式化 后端 结构信息并递归生成层级路由表
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generateRoutes = (routerMap, parent?): any[] => {
  // debugger
  return routerMap.map(item => {
    const currentRoute: any = {
      // 路由地址 动态拼接生成如 /dashboard/workplace
      // path: `${(parent && parent.path) ?? ''}/${item.path}`,
      path: `${item.path}`,
      // 路由名称，建议唯一
      name: item.name ?? '',
      // 该路由对应页面的 组件
      component: item.component,
      // meta: 页面标题，菜单图标，页面权限 (供指令权限用，可去掉)
      meta: {
        ...item.meta,
        label: item.meta.title,
        // icon: constantRouterIcon[item.meta.icon] || null,
        icon: constantRouterIcon2(item.meta.icon) || null,
        permissions: item.meta.permissions || null,
        alwaysShow: item.name.indexOf('dashboard') < 0
      }
    }

    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    currentRoute.path = currentRoute.path.replace('//', '/')
    // 重定向
    item.redirect && (currentRoute.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      //如果未定义 redirect 默认第一个子路由为 redirect
      // !item.redirect && (currentRoute.redirect = `${item.path}/${item.children[0].path}`)
      !item.redirect && (currentRoute.redirect = `${item.children[0].path}`)
      // Recursion
      currentRoute.children = generateRoutes(item.children, currentRoute)
    }
    return currentRoute
  })
}

/**
 * 动态生成菜单
 * @returns {Promise<Router>}
 */
export const generateDynamicRoutes = async (): Promise<RouteRecordRaw[]> => {
  const params = {}
  const { data } = await getUserMenu(params)
  // console.log('data', data)
  const router = generateRoutes(data)
  // console.log('router', router)
  asyncImportRoute(router)
  return router
}

/**
 * 查找views中对应的组件文件
 * */
let viewsModules: Record<string, () => Promise<Recordable>>
export const asyncImportRoute = (routes: AppRouteRecordRaw[] | undefined): void => {
  // debugger
  viewsModules = viewsModules || import.meta.glob('../views/**/*.{vue,tsx}')
  if (!routes) return

  routes.forEach(item => {
    if (!item.component && item.meta?.frameSrc) {
      item.component = 'IFrame'
    }
    const { component, name } = item
    const { children } = item
    if (component) {
      const layoutFound = LayoutMap.get(component as string)
      if (layoutFound) {
        item.component = layoutFound
      } else {
        item.component = dynamicImport(viewsModules, component as string)
      }
    } else if (name) {
      item.component = ParentLayout
    }
    children && asyncImportRoute(children)
  })
}

/**
 * 动态导入
 * */
export const dynamicImport = (
  viewsModules: Record<string, () => Promise<Recordable>>,
  component: string
) => {
  const keys = Object.keys(viewsModules)
  const matchKeys = keys.filter(key => {
    let k = key.replace('../views', '')
    const lastIndex = k.lastIndexOf('.')
    k = k.substring(0, lastIndex)
    return k === component
  })
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0]
    return viewsModules[matchKey]
  }
  if (matchKeys?.length > 1) {
    console.warn(
      'Please do not create `.vue` and `.TSX` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure'
    )
    return
  }
}
