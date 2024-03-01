import { renderIcon, renderFontClassIcon2 } from '@/utils/index'
import { DashboardOutlined } from '@vicons/antd'

//前端路由图标映射表
export const constantRouterIcon = {
	DashboardOutlined: renderIcon(DashboardOutlined)
}

export const constantRouterIcon2 = (icon: string) => {
	return renderFontClassIcon2(icon)
}
