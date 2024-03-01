import { defineStore } from 'pinia'
import i18n from '@/locales'

export const useLanguageStore = defineStore('app', {
	state: () => {
		return {
			locale: localStorage.getItem('lang') || 'zh-Hans'
		}
	},
	actions: {
		SET_LOCALE(locale: any){
			this.locale = locale
			localStorage.setItem('lang', locale)
			i18n.global.locale.value = locale
		}
	}
})

export default useLanguageStore
