import Vue from 'vue'
import Router from 'vue-router'
import testRouter from './config'

Vue.use(Router)
const router = new Router({
  mode: 'history',
  base: process.env.NODE_ENV === 'production' ? '/report' : '',
  routes: testRouter,
})
export default router