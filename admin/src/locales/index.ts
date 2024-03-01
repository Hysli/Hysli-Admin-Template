import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN'
import en from './en'

// 创建 i18n
const i18n = createI18n({
	legacy: false,
	globalInjection: true, // 全局模式，可以直接使用 $t
	locale: localStorage.getItem('lang') || 'zhCN',
	messages: {
		zhCN,
		en
	}
})

export default i18n