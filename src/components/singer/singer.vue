<template>
  <div class="singer" ref="singer">
  	<listview 
      ref='list'
  	  :data='singers'
  	  @select='selectSinger'>
  	</listview>
  	<router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  // 导入Singer类
  import Singer from 'common/js/singer'
  import Listview from 'base/listview/listview'
  // 导入vuex
  import {mapMutations} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'

  // 定义常量
  const HOT_SINGER_LEN = 10
  const HOT_NAME = '热门'

  export default {
    mixins: [playlistMixin],
    data () {
      return {
        singers: []
      }
    },
    created () {
      this._getSingerList()
    },
    methods: {
      _getSingerList () {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            // 成功得到 res
            // console.log(res.data.list)
            // console.log(this.normalizeSinger(res.data.list))
            // 得到处理好的singers
            this.singers = this.normalizeSinger(res.data.list)
          }
        })
      },
      normalizeSinger (list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            }))
          }
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        })

        // 为了得到有序列表  需要处理 map
        let ret = []
        let hot = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      },

      // 监听点击事件的动作
      selectSinger (singer) {
        // console.log(singer)
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        // 使用映射的方法
        this.setSinger(singer)
        // console.log(this.$root.$store.state.singer)
      },
      handlePlaylist (playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
      },
      // 映射mutations里的方法
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    components: {
      Listview
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
