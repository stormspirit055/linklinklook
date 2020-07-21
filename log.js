class Log{
  constructor() {
    this.logWrap = document.querySelector('#log')
  }
  triggerLog(type, message, time) {
    const singleLog = document.createElement('div')
    let innerHTML = ''
    switch(type) {
      case 'MATCH_CORRECT': 
        innerHTML = `<span style='color: blue'>消除匹配:${message}</span>`
        break;
      case 'GAME_START': 
        innerHTML = `<span style='color: red'>游戏开始</span>`
        break;
      case 'GAME_STOP': 
        innerHTML = `<span style='color: red'>游戏暂停! </span>`
        break;
      case 'GAME_OVER': 
        innerHTML = `<span style='color: green'>游戏结束!${message}</span>`
        break;
      case 'MATCH_WRONG': 
        innerHTML = `<span style='color: red'>匹配错误!${message}</span>`
        break;
      case 'MAP_RESET': 
        innerHTML = `<span style='color: red'>无解, 重置地图!</span>`
        break;
    }
    singleLog.innerHTML = innerHTML + `(${time})`
    this.logWrap.appendChild(singleLog)
  }
}