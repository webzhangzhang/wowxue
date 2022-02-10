import axios from 'axios'
import { getToken } from '@/util/auth'
const service = axios.create({
  timeout: 5 * 60000,
  "Content-Type": "application/json"
})
// 请求前 设置请求头
service.interceptors.request.use(
  config => {
    let baseAPI = ''
    let toPath = ''
    const paths = config.url.split('/')
    // feConfig 为 webpack定义的全局变量，查询对应环境的name
    const rpc = feConfig.apiConfig.target
    // 如果查询出name，获取host ，反之错误提醒
    if (rpc) {
      baseAPI = rpc 
    } else {
      console.log(`${paths[1]} 对应的转发 HOST 未设置，请在 feConfig 目录下设置`)
    }
    toPath = [].concat([], paths).join('/')

    // 修改config.url为拼接好的 host + path
    config.url = baseAPI + toPath
    console.log(getToken, 'token------')
    config.headers['authorization'] = getToken
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

//请求后
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.StatusCode === '200') {
      return res
    } else {
      return Promise.reject(res || 'Error')
    }
  },
  errorResponse => {
    return Promise.reject(errorResponse)
  })

export default service
