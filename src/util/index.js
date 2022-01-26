// 处理时间
export function formatDate(now, need) { 
  let year=now.getFullYear() 
  let month=now.getMonth()+1 
  let date=now.getDate() 
  let hour=now.getHours()
  let minute=now.getMinutes()
  var second=now.getSeconds()
  if(need) {
    return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second 
  }else {
    return year+"-"+month+"-"+date
  }
}

/**
 * 暴露值给全局对象window
 * @param {需要保存的值} value
 * @param {传给window的key} key
 * @returns {any}
 */
export function setToWindow(value,key){
  window[`__${key.toUpperCase()}___`] = JSON.parse(JSON.stringify(value))
} 

/**
 * 获取浏览器信息
 */
export function getBrowserInfo() {
  let agent = navigator.userAgent.toLowerCase()
  let regStr_ie = /msie [\d.]+;/gi
  let regStr_ff = /firefox\/[\d.]+/gi
  let regStr_chrome = /chrome\/[\d.]+/gi
  let regStr_saf = /safari\/[\d.]+/gi
  //IE
  if(agent.indexOf("msie") > 0) {
    return agent.match(regStr_ie)
  }

  //firefox
  if(agent.indexOf("firefox") > 0) {
    return agent.match(regStr_ff)
  }

  //Chrome
  if(agent.indexOf("chrome") > 0) {
    return agent.match(regStr_chrome)
  }

  //Safari
  if(agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
    return agent.match(regStr_saf)
  }

}

/**
 * 获取设备操作系统
 */
export function getOS() {
  const userAgent = window.navigator.userAgent
  const platform = window.navigator.platform
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K']
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE']
  const iosPlatforms = ['iPhone', 'iPad', 'iPod']
  let os = ''
  if (~macosPlatforms.indexOf(platform)) {
    os = 'Mac OS'
  } else if (~iosPlatforms.indexOf(platform)) {
    os = 'iOS'
  } else if (~windowsPlatforms.indexOf(platform)) {
    os = 'Windows'
  } else if (/Android/.test(userAgent)) {
    os = 'Android'
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux'
  }
  return os
}

/**
 * 获取设备操作系统版本
 */
export function getOSVersion() {
  let os = getOS()
  let osVersion = 'unknown'
  const nVer = navigator.appVersion
  const nAgt = navigator.userAgent
  if (/Windows/.test(os)) {
    osVersion = /Windows (.*)/.exec(nAgt)[1]
    os = 'Windows'
  }
  switch (os) {
  case 'Mac OS':
  case 'Mac OS X':
    osVersion = /Mac OS X (10[._\d]+)/.exec(nAgt)[1]
    break
  case 'Android':
    osVersion = /Android ([._\d]+)/.exec(nAgt)[1]
    break
  case 'iOS':
    osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer)
    osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0)
    break
  }
  return osVersion
}


export const util = {
  formatDate,
  getBrowserInfo,
  getOSVersion,
  getOS,
  setToWindow
}

export default {
  install(Vue) {
    Vue.prototype.$util = util
  }
}