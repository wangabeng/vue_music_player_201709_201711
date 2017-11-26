<template>
  <div>
    <music-list
      :title='title'
      :bg-image='bgImage'
      :songs='songs'
      :rank='rank'
    ></music-list>
  </div>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getMusicList} from 'api/rank'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'

  export default {
    data () {
      return {
        songs: [],
        rank: true
      }
    },
    created () {
      this._getMusicList()
    },
    methods: {
      _getMusicList () {
        if (!this.topList.id) {
          this.$router.push('/rank')
          return
        }
        getMusicList(this.topList.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.songlist)
            // console.log('songs', this.songs)
          }
        })
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach((item) => {
          const musicData = item.data
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData))
          }
        })
        // 忘记返回数据了 卡了半个小时
        return ret
      }
    },
    computed: {
      ...mapGetters([
        'topList'
      ]),
      title () {
        return this.topList.topTitle
      },
      bgImage () {
        // return this.topList.picUrl
        if (this.songs.length) {
          return this.songs[0].image
        }
        return ''
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>