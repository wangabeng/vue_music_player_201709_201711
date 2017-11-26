<template>
  <div class="music-list">
    <div class="back" @click='goback'>
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html='title'></h1>
    <div class="bg-image" :style='bgStyle' ref='bgImage'>
      <div class='play-wrapper'>
        <div class='play' v-show='songs.length>0' ref='playBtn' @click='random'>
          <i class='icon-play'></i>
          <span class='text'>随机播放</span>
        </div>
      </div>
      <div class="filter" ref='filter'></div>
    </div>
    <!-- 增加一个层 -->
    <div class='bg-layer' ref='layer'></div>
    <scroll 
      :data='songs' 
      class='list' 
      ref='list'
      :probe-type='probeType'
      :listen-scroll='listenScroll'
      @scroll='scroll'>
      <div class='song-list-wrapper'>
        <song-list 
          :songs='songs'
          @select='selectItem'
          :rank='rank'>
        </song-list>
      </div>
      <div class='loading-container' v-show='!songs.length'>
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import Loading from 'base/loading/loading'
  import {prefixStyle} from 'common/js/dom'
  import {mapActions} from 'vuex'
  // 浏览器会自动检测浏览器前缀
  const transform = prefixStyle('transform')
  const backdrop = prefixStyle('backdrop-filter')
  import {playlistMixin} from 'common/js/mixin'

  const RESERVED_HEIGHT = 40
  export default {
    mixins: [playlistMixin],
    data () {
      return {
        scrollY: 0
      }
    },
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: function () {
          return []
        }
      },
      title: {
        type: String,
        default: ''
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    components: {
      Scroll,
      SongList,
      Loading
    },
    methods: {
      goback () {
        // this.$router.push('/singer')
        this.$router.back()
      },
      scroll (pos) {
        this.scrollY = pos.y
      },
      selectItem (item, index) {  // 修改vuex的数据
        this.selectPlay({
          list: this.songs,
          index
        })
      },
      random () {
        this.randomPlay({
          list: this.songs
        })
      },
      handlePlaylist (playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    },
    computed: {
      bgStyle () {
        return `background-image:url(${this.bgImage})`
      }
    },
    mounted () {
      // 初始化时 计算一次.list的top值
      this.iamgeHeight = this.$refs.bgImage.clientHeight
      this.minTranslateY = -this.iamgeHeight + RESERVED_HEIGHT
      this.$refs.list.$el.style.top = `${this.iamgeHeight}px`
    },
    created () {
      this.probeType = 3
      this.listenScroll = true // 实时监听scroll位置
    },
    watch: {
      scrollY (newY) {
        // 最大偏移高度 为初始化bg-image的高度
        let zIndex = 0
        let scale = 1
        let blur = 0
        let translateY = Math.max(this.minTranslateY, newY)
        this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
        const percent = Math.abs(newY / this.iamgeHeight)
        // 当向下滚动时 图片放大
        if (newY > 0) {
          scale = 1 + percent
          zIndex = 10
        } else {
          blur = Math.min(20 * percent, 20)
        }
        this.$refs.filter.style[backdrop] = `blur(${blur}px)`
        // this.$refs.filter.style['webkitBackdrop-filter'] = `blur(${blur}px)`
        // 当滚动到顶部 设置图片的高度和zindex
        if (newY < this.minTranslateY) {
          zIndex = 10
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
          this.$refs.playBtn.style.display = 'none'
        } else {
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
          this.$refs.playBtn.style.display = 'block'
        }
        this.$refs.bgImage.style.zIndex = zIndex
        this.$refs.bgImage.style[transform] = `scale(${scale})`
        // this.$refs.bgImage.style['webkitTransform'] = `scale(${scale})`
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list /* 覆盖全屏幕 */
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover /* 把背景图像扩展至足够大，以使背景图像完全覆盖背景区域。 */
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100% /* 高度的100%是相对父级元素 */
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      -z-index: -1 /* 解决文字覆盖图片的问题 */
      -overflow: hidden
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>