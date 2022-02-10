import Vue from 'vue'
import Element from 'element-ui'
import App from './App.vue'
import router from './router/index.js'
import Components from './components'
import store from './store/index'
import Lib from './lib'
import moment from 'moment'//导入文件



Vue.config.productionTip = false
// 埋点指令注册
Vue.use(Lib)
Vue.use(Components)
Vue.use(Element, { size: 'mini' })
Vue.prototype.$moment = moment//赋值使用
moment.locale('zh-cn')//需要汉化
Vue.prototype.bus = new Vue()

if (typeof window !== 'undefined') {
  window.isIframe = !(window.self === window.top)
  const _hmt = _hmt || []
  window._hmt = _hmt
  process.env.NODE_ENV === 'production' ? (function() {
    const hm = document.createElement("script")
    hm.src = "https://hm.baidu.com/hm.js?5803d70de4c00d671876937cb6b715d8"
    const s = document.getElementsByTagName("script")[0]
    s.parentNode.insertBefore(hm, s)
  })() : ''
}
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
