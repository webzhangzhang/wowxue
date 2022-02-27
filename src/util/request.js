import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/util/auth'
import Cookies from 'js-cookie'

// create an axios instance
const service = axios.create({
  baseURL:'http://magicstory.wowxue.com',
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 1000 * 10, // request timeout
  // headers: {
  //   'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  //   // 'Content-Type': 'x-www-form-urlencoded' // fixli 这块修改是因为在修改删除时不知道怎么回事登录接口有问题了，然后修改了传值方式就可以了，莫名其妙，前端登录接口一点变化没有，就是不行了，希望以后的人看一下原因
  // }
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      console.log(config, 'config')
      config.headers['Authorization'] = getToken()
      if (config.method === 'post') {
        config.headers['Content-Type'] = 'application/json'
      }
      if (config.method === 'put') {
        config.headers['Content-Type'] = 'application/form-data'
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
service.interceptors.response.use(
  function(response) {
    const res = response.data
    if (res.StatusCode !== '200') {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      if (res.StatusCode === '403') {
        location.href = '#/login'
      }
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.StatusCode === 50008 || res.StatusCode === 50012 || res.StatusCode === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      console.error('res.StatusCode = ' + res.StatusCode)
      if (res.StatusCode == 401) {
        Message({
          message: res.message || 'Error',
          type: 'error'
        })
                
        // store.dispatch('user/logout').then(() => {
        location.reload()
        Cookies.remove("Admin-Token")
        return false
        //  })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  function(error) {
    // error => {
    console.error('err' + error) // for debug
    // Message({
    //     message: error.message,
    //     type: 'error',
    //     duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

export default service
