import cloud from '@lafjs/cloud'
import { initVueI18n } from '@dcloudio/uni-i18n'
import en from '@/i18n/en'
import ja from '@/i18n/ja'
import zhHans from '@/i18n/zh-Hans'

class i18n {
  t: (key: string) => string // 定义 t 的类型

  constructor(lang: string) {
    const messages = {
      en: en,
      zhCN: zhHans,
      ja: ja
    }

    const { t } = initVueI18n(lang, messages)
    this.t = t
  }
}

export default i18n
