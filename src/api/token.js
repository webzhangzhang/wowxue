import request from '@/util/request'

// 即需要传params，又要传data的 post
export function getAuth(params,data) {
  return request({
    name: '验证query里的token是否有权限',
    url: '/obt/auth',
    method: 'post',
    params,
    data,
  })
}