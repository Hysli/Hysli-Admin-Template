import './styles/tailwind.css'
import { createApp } from 'vue'
import { setupNaiveDiscreteApi, setupNaive, setupDirectives } from '@/plugins'
import App from './App.vue'
import router, { setupRouter } from './router'
import { setupStore } from '@/store'

// 引入第三方图标库 单独安装  npm install e-icon-picker@next -S
import eIconPicker from 'e-icon-picker'
import 'e-icon-picker/icon/default-icon/symbol.js' //基本彩色图标库
import 'e-icon-picker/index.css' // 基本样式，包含基本图标
//font-awesome 图标库 单独安装 npm install font-awesome@4.7.0 -Sc
import 'font-awesome/css/font-awesome.min.css'
//element-plus 图标库 单独安装 npm install @element-plus/icons-vue
//如果已经全局使用了 element-plus 组件，则 element-plus 会默认全部注册图标，不需要再去安装图标库注册
import * as ElementPlusIconsVue from '@element-plus/icons-vue' //element-plus 图标库
import eIconList from 'e-icon-picker/icon/default-icon/eIconList.js'
import i18n from './locales'

async function bootstrap() {
  const app = createApp(App)

  // 挂载状态管理
  setupStore(app)

  // 注册全局常用的 naive-ui 组件
  setupNaive(app)

  // 挂载 naive-ui 脱离上下文的 Api
  setupNaiveDiscreteApi()

  // 注册全局自定义组件
  //setupCustomComponents();

  // 注册全局自定义指令，如：v-permission 权限指令
  setupDirectives(app)

  // 注册全局方法，如：app.config.globalProperties.$message = message
  //setupGlobalMethods(app);

  // 挂载路由
  setupRouter(app)

  // 路由准备就绪后挂载 APP 实例
  // https://router.vuejs.org/api/interfaces/router.html#isready
  await router.isReady()

  // https://www.naiveui.com/en-US/os-theme/docs/style-conflict#About-Tailwind's-Preflight-Style-Override
  const meta = document.createElement('meta')
  meta.name = 'naive-ui-style'
  document.head.appendChild(meta)

  // 全局注册所有 element-plus 图标
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
  app.use(eIconPicker, {
    addIconList: eIconList, //全局添加图标
    removeIconList: [], //全局删除图标
    FontAwesome: true,
    ElementUI: true,
    eIcon: true, //自带的图标，来自阿里妈妈
    eIconSymbol: true, //是否开启彩色图标
    zIndex: 3000 //选择器弹层的最低层，全局配置
  })
  app.use(i18n)
  app.mount('#app', true)
}

void bootstrap()
