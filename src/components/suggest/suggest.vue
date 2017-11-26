<template>
  <scroll 
    class='suggest' 
    :data='result'
    :pullup='pullup'
    @scrollToEnd='searchMore'
    :beforeScroll='beforeScroll'
    @beforeScroll='listScroll'
    ref='suggest'
  >
    <ul class='suggest-list'>
      <li 
        class='suggest-item' 
        v-for='item in result'
        @click='selectItem(item)'
      >
      	<div class='icon'><i :class='getIconCls(item)'></i></div>
      	<div class='name'><p class='text' v-html='getDisplayName(item)'></p></div>
      </li>
      <loading v-show='hasMore' title=''></loading>
    </ul>
    <div class='no-result-wrapper' v-show='!hasMore && !result.length'>
      <no-result title='抱歉 暂无搜索结果'></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  const TYPE_SINGER = 'singer'
  import {createSong} from 'common/js/song'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {mapMutations, mapActions} from 'vuex'
  import Singer from 'common/js/singer'
  import NoResult from 'base/no-result/no-result'
  const perpage = 20

  export default {
    data () {
      return {
        page: 1,
        result: [],
        hasMore: true,
        pullup: true,
        beforeScroll: true
      }
    },
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      search () {
        this.hasMore = true
        this.page = 1
        this.$refs.suggest.scrollTo(0, 0)
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          // console.log('原始数据', res.data)
          if (res.code === ERR_OK) {
            this.result = this._genResult(res.data)
            // console.log('处理后的数据', this.result)
            this._checkMore(res.data)
          }
        })
      },
      _genResult(data) {
        let ret = []
        // 加入 this.page === 1条件 防止每次翻页的时候加载歌手信息
        if (data.zhida && data.zhida.singerid && this.page === 1) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      getIconCls (item) {
        // console.log(`type is: ${item.type}`)
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName (item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      searchMore() {
        if (!this.hasMore) {
          return
        }
        this.page++
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this.result.concat(this._genResult(res.data))
            this._checkMore(res.data)
          }
        })
      },
      _checkMore (data) {
        const song = data.song
        if (!song.list.length || (song.curnum + song.curpage * perpage) >= song.totalnum) {
          this.hasMore = false
        }
      },
      selectItem (item) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        } else {
          this.insertSong(item)
        }
        // 搜索结果被选择的时候 把关键词添加到搜索记录里 包括添加到VUEX及本地缓存中
        this.$emit('select')
        // console.log('insert one')
      },
      listScroll () {
        this.$emit('listScroll') // 监听到子组件的时间后 对外派发listScroll事件 由此组件的父组件search.vue监听
      },
      refresh () {
        this.$refs.suggest.refresh()
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      query () {
        this.search()
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>