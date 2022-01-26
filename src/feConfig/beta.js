module.exports = {
  host: 'http://testfx-beta.haofenshu.com',
  apiConfig: {
    target: 'http://testfx-beta.haofenshu.com',
    targetMod: 'http://testfx-beta.haofenshu.com',
    targetObt: 'http://testfx-beta.haofenshu.com',
    targetExcel: 'http://testfx-beta.haofenshu.com',
    targetTaskServer: 'http://testfx-beta.haofenshu.com',
    targetTool: 'http://testfx-beta.haofenshu.com',
    targetPri: 'http://testfx-pri.haofenshu.com',
    point: 'http://testlog-serv-v3.haofenshu.com'
  },
  trackPoint: {
    projectId: '5da02741000005f701cbeee6', // 项目 ID
    time: 60000, // 日志上报间隔
    sKey: 'FE_TrackPoint', // 本地 storge 缓存时的 key，可根据项目修改
    eventType: ['click', 'hover'] // 通过 addEventListener 注册的事件埋点动作
  }
}
