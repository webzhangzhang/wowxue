import Util from '../util'
import NProgress from 'nprogress'

NProgress.configure({ showSpinner: false })

export default {
  install(Vue) {
    Vue.use(Util)
    Vue.prototype.$progress = NProgress
  }
}
