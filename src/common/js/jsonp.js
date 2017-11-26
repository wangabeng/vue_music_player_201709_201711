// 封装jsonp 返回一个promise对象
import originJsonp from 'jsonp'
export default function jsonp (url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  // promise构造函数接受一个函数作为参数, 该函数的两个参数分别是resolve和reject. resolve和reject是两个函数 是由js引擎提供 不用自己部署
  // resolve函数的作用是使promise对象的状态从pending变为resolved.在异步操作成功时调用, 并将异步操作的结果作为参数传递出去.
  // reject函数功能类似 不过是将异步操作的错误信息 作为参数传递出去
  return new Promise((resolve, reject) => {
    // data2不是data
    originJsonp(url, option, (err, data2) => {
      if (!err) {
        resolve(data2)
      } else {
        reject(err)
      }
    })
  })
}

function param (data) {
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }
  return url ? url.substring(1) : ''
}
