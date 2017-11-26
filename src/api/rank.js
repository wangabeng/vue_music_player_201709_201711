import {commonParams, options} from './config'
import jsonp from 'common/js/jsonp'
// import axios from 'axios'

export function getTopList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 0,
    // format: 'json',
    uin: 0
  })

  return jsonp(url, data, options)
  /* return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  }) */
}

export function getMusicList(topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

  const data = Object.assign({}, commonParams, {
    topid,
    page: 'detail',
    type: 'top',
    tpl: 3,
    platform: 'h5',
    needNewCode: 0,
    format: 'json',
    notice: 0
  })

  return jsonp(url, data, options)
  /* return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  }) */
}
