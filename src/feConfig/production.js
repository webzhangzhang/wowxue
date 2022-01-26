module.exports = {
  host: 'http://fenxi.haofenshu.com',
  apiConfig: {
    target: 'http://fenxi.haofenshu.com',
    targetMod: 'http://fx-mod.haofenshu.com',
    targetObt: 'http://fx-obt.haofenshu.com',
    targetExcel: 'http://fx-pdf.haofenshu.com',
    targetTaskServer: 'http://fx-task.haofenshu.com',
    targetTool: 'http://fx-tool-api.haofenshu.com',
    point: 'http://log-serv-v3.haofenshu.com',
    targetPri: 'http://fx-pri.haofenshu.com'
  },
  trackPoint: {
    projectId: '5d5ce273000005607e6faa24', // 项目 ID
    time: 60000, // 日志上报间隔
    sKey: 'FE_TrackPoint', // 本地 storge 缓存时的 key，可根据项目修改
    eventType: ['click', 'hover'] // 通过 addEventListener 注册的事件埋点动作
  }
}
