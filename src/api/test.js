
// 这里放的都是测试接口
import request from '@/util/request'

// 只传params的get
export function testGet(params) {
  return request({
    url: '/obt/v1/exam/user-cfg',
    method: 'get',
    params
  })
}

// 即需要传params，又要传data的 post
export function testPost(params,data) {
  return request({
    name: 'testPost',
    url: '/obt/v2/exam/factors',
    method: 'post',
    params,
    data,
  })
}

// 只需传data的post
export function testPost1(data) {
  return request({
    name: 'testPost',
    url: '/pri/v1/school/exam-total',
    method: 'post',
    data,
  })
}
