import request from '@/util/request'
// import qs from 'qs'
// 登录
export function login(data) {
  return request({
    url: '/api/User/SignIn',
    method: 'post',
    data
  })
}
// 注销
export function logout() {
  return request({
    url: '/api/User/SignOut',
    method: 'put'
  })
}
