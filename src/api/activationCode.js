import request from '@/util/request'
// ---------------------激活码模块----------------------
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
    method: 'put',
    data: data
  })
}
// 激活码批次禁用
export function activationBatchDisable(data) {
  return request({
    url: '/api/ActivationCode/Enable',
    method: 'put',
    data
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
    method: 'put',
    data
  })
}
// 激活码禁用
export function activationCodeDisable(data) {
  return request({
    url: '/api/ActivationCode/Disable',
    method: 'put',
    data
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
// ---------------------用户管理----------------------
// 获取用户列表
export function getMemberList(params) {
  return request({
    url: '/api/Member/List',
    method: 'get',
    params
  })
}

// 修改用户信息
export function postMemberUpdate(data) {
  return request({
    url: '/api/Member/Update',
    method: 'post',
    data
  })
}
// 个人用户启用
export function MemberEnable(data) {
  return request({
    url: '/api/Member/Enable',
    method: 'put',
    data
  })
}
// 个人用户禁用
export function MemberDisable(data) {
  return request({
    url: '/api/Member/Disable',
    method: 'put',
    data
  })
}
// 查看权限
export function MemberViewPermissions(data) {
  return request({
    url: '/api/Member/ViewPermissions',
    method: 'put',
    data
  })
}
// 重置密码
export function MemberViewResetPassword(data) {
  return request({
    url: '/api/Member/ResetPassword',
    method: 'put',
    data
  })
}
// 获取目录列表
export function getCatalogClassificationListTree(params) {
  return request({
    url: '/api/CatalogClassification/ListTree',
    method: 'get',
    params
  })
}
// 更新目录
export function getCatalogClassificationUpdate(data) {
  return request({
    url: '/api/CatalogClassification/Update',
    method: 'post',
    data
  })
}
// 新增目录
export function getCatalogClassificationAdd(data) {
  return request({
    url: '/api/CatalogClassification/Add',
    method: 'post',
    data
  })
}
// 删除目录
export function getCatalogClassificationDelete(id) {
  return request({
    url: '/api/CatalogClassification/Delete?id=' + id,
    method: 'delete',
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