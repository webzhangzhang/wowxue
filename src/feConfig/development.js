module.exports = {
  host: 'http://dev.haofenshu.com:8080',
  apiConfig: {
    target: 'http://magicstory.wowxue.com',
    targetMod: 'http://testfx-mod.haofenshu.com',
    targetObt: 'http://testfx-obt.haofenshu.com',
    // targetObt: 'http://testfenxi.haofenshu.com',
    targetExcel: 'http://testfx-pdf.haofenshu.com',
    targetTaskServer: 'http://testfx-task.haofenshu.com',
    targetTool: 'http://testfx-tool-api.haofenshu.com',
    point: 'http://testlog-serv-v3.haofenshu.com',
    targetPri: 'http://testfx-pri.haofenshu.com'
  },
  trackPoint: {
    projectId: '5da02741000005f701cbeee6', // 项目 ID
    time: 60000, // 日志上报间隔
    sKey: 'FE_TrackPoint', // 本地 storge 缓存时的 key，可根据项目修改
    eventType: ['click', 'hover'] // 通过 addEventListener 注册的事件埋点动作
  }
}
