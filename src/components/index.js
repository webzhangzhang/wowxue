import TableView from './TableView'
import WrapperPagination from './WrapperPagination'

export default {
  install(Vue) {
    Vue.component('TableView', TableView)  // 表格
    Vue.component('WrapperPagination', WrapperPagination) // 分页
  }
}