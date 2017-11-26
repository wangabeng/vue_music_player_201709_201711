<template>
  <transition name='slide'>
    <singer-list
      :songs='songs'
      :title='title'
      :bg-image='baImage'>
    </singer-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import SingerList from 'components/music-list/music-list'

  export default {
    data () {
      return {
        songs: []
      }
    },
    computed: {
      title () {
        return this.singer.name
      },
      baImage () {
        return this.singer.avatar
      },
      ...mapGetters([
        'singer'
      ])
    },
    created () {
      // console.log(this.singer) // 获取成功 测试
      // 钩子函数自动获取歌手详情页
      this._getSingerDetail()
    },
    methods: {
      _getSingerDetail () {
        // 如果进入了歌手详情页 刷新了 这个时候 就得不到数据 此时路由自动跳转到singer页面
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            // console.log(res.data.list)
            this.songs = this._normalizeSongs(res.data.list)
            // console.log(this.songs)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          let {musicData} = item
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    components: {
      SingerList
    }

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slide-enter, .slide-leave-to
    transform: translate3d(100%,0,0)
  .slide-enter-active, .slide-leave-active
    transition: 0.3s

  .-singer-detail
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: $color-background
</style>