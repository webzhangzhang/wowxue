import request from '@/util/request'

export function getActivationCodeList(params) {
  return request({
    url: '/api/ActivationBatch/List',
    method: 'get',
    params
  })
}

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