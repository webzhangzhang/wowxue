import request from '@/util/request'

// 获取目录

export function CatelogList(params) {
  return request({
    url: '/api/CatalogClassification/List',
    method: 'get',
    params
  })
}
// 获取激活码批次列表
export function getActivationBatchList(params) {
  return request({
    url: '/api/ActivationBatch/List',
    method: 'get',
    params
  })
}
// 删除激活码批次
export function deleteActivationBatch(id) {
  return request({
    url: '/api/ActivationBatch/Delete?id=' + id,
    method: 'DELETE'
  })
}
// 激活码批次启用
export function activationBatchEnable(data) {
  return request({
    url: '/api/ActivationCode/Enable',
    method: 'post',
    data: JSON.stringify(data)
  })
}
// 激活码批次禁用
export function activationBatchDisable(data) {
  return request({
    url: '/api/ActivationCode/Enable',
    method: 'post',
    data: JSON.stringify(data)
  })
}
// 生成激活码
export function activationBatchAdd(data) {
  return request({
    url: '/api/ActivationBatch/Add',
    method: 'post',
    data
  })
}
// 获取激活码列表
export function getActivationCodeList(params) {
  return request({
    url: '/api/ActivationCode/List',
    method: 'get',
    params
  })
}
// 激活码启用
export function activationCodeEnable(data) {
  return request({
    url: '/api/ActivationCode/Enable',
    method: 'post',
    data: JSON.stringify(data)
  })
}
// 激活码禁用
export function activationCodeDisable(data) {
  return request({
    url: '/api/ActivationCode/Disable',
    method: 'post',
    data,
  })
}
// 激活码导出
export function activationCodeExport(params) {
  // window.open('http://magicstory.wowxue.com/api/ActivationCode/Export?activityId=' + activityId, '_self')
  return request({
    url: '/api/ActivationCode/Export',
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