var express = require('express')
var config = require('./config/index')
var axios = require('axios')

var app = express()
var apiRoutes = express.Router()

// 设置服务器代理 获取歌曲列表
apiRoutes.get('/getDiscList', function (req, res) {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/portal/playlist.html',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})
// 设置服务器代理 获取歌词
apiRoutes.get('/lyric', function (req, res) {
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/portal/player.html',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    // 处理歌词数据 现在是一个jsonp的格式
    var ret = response.data
    if (typeof ret === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})
// 设置服务器代理 获取歌单详情页
apiRoutes.get('/songlist', function (req, res) {
  var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/w/taoge.html',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    // console.log(response.data)
    res.send(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

app.use('/api', apiRoutes)

app.use(express.static('./dist'))
// 在dev-server中设置的端口号是 9000
var port = process.env.PORT || config.build.port

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('listening at http://localhost:' + port +'\n')
})
