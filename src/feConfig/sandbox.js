module.exports = {
  host: 'http://sandboxfenxi.haofenshu.com',
  apiConfig: {
    target: 'http://sandboxfenxi.haofenshu.com',
    targetMod: 'http://sandboxfx-mod.haofenshu.com',
    targetObt: 'http://sandboxfx-obt.haofenshu.com',
    targetExcel: 'http://sandboxfx-pdf.haofenshu.com',
    targetTaskServer: 'http://sandboxfx-task.haofenshu.com',
    targetTool: 'http://tool-api.haofenshu.com',
    point: 'http://log-serv-v3.haofenshu.com',
    targetPri: 'http://sandboxfx-pri.haofenshu.com'
  },
  trackPoint: {
    projectId: '5da02741000005f701cbeee6', // 项目 ID
    time: 60000, // 日志上报间隔
    sKey: 'FE_TrackPoint', // 本地 storge 缓存时的 key，可根据项目修改
    eventType: ['click', 'hover'] // 通过 addEventListener 注册的事件埋点动作
  }
}
