import request from '@/util/request'
// 登录
export function login(data) {
  return request({
    url: '/api/User/SignIn',
    method: 'post',
    data: data
  })
}
// 注销
export function logout() {
  return request({
    url: '/api/User/SignOut',
    method: 'put'
  })
}
