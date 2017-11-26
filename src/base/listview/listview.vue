<template>
  <scroll 
    :data='data' 
    class="listview" 
    ref='listview' 
    :listenScroll='listenScroll'
    :probeType='probeType'
    @scroll='scroll'>
    <!-- 左侧内容区块 -->
    <ul>
      <li v-for="group in data" class="list-group" ref="listgroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <uL>
          <li
            @click='selectItem(item)'
            v-for="(item,index) in group.items" 
            class="list-group-item">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 右侧快捷跳转列表 -->
    <div class="list-shortcut" @touchstart='onshortCutTouchStart' @touchmove.stop.prevent='onShortCutTouchMove'>
      <ul>
        <li v-for="(item, index) in shortcutList"
            :data-index="index"
            class="item"
            :class="{'current': currentIndex===index}">
          {{item}}
        </li>
      </ul>
    </div>
    <!-- 顶部绝对定位区块 -->
    <div class='list-fixed' v-show='fixedTitle' ref='fixed'>
      <h1 class='fixed-title'>{{fixedTitle}}</h1>
    </div>
    <!-- loading预加载 -->
    <div v-show='!data.length' class='loading-container'>
      <loading></loading>
    </div>
  </scroll>
</template>
<script>
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {getData} from 'common/js/dom.js'

  const ANCHOR_HEIGHT = 18
  const LIST_FIXED_HEIGHT = 30

  export default {
    created () {
      this.touch = {}
      this.listenScroll = true
      this.listHeight = []
      this.probeType = 3
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    data () {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1
      }
    },
    components: {
      Scroll,
      Loading
    },
    methods: {
      onshortCutTouchStart (e) {
        // 获取data-index的属性值 即index
        let anchorIndex = getData(e.target, 'index')
        // console.log(anchorIndex)
        // 点击的时候 设置currentIndex 不成功
        // 以你为currentIndex 依赖scrollY的值变化 所以这里要改变scrollY的值 还是不成功
        // 在这里设置scrollY和currentIndex都是不成功的 解决方法 在_scrollTo中手工改变scrollY的值
        // this.scrollY = this.listHeight[anchorIndex + 1]
        // console.log(this.currentIndex, this.scrollY)

        // 获取第一次touch的时候的坐标值和当前的index
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex // 记录当前的锚点

        // this.$refs.listview.scrollToElement(this.$refs.listgroup[anchorIndex], 0)
        this._scrollTo(anchorIndex)
      },
      onShortCutTouchMove (e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let delta = Math.floor((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT)
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta
        // console.log(anchorIndex)
        this._scrollTo(anchorIndex)
        // this.$refs.listview.scrollToElement(this.$refs.listgroup[anchorIndex], 0)
      },
      _scrollTo (index) {
        // 在滚动的时候执行的代码 手工设置scrollY的值
        this.scrollY = -this.listHeight[index]
        this.$refs.listview.scrollToElement(this.$refs.listgroup[index], 0)
      },
      scroll (pos) {
        // console.log(pos)
        this.scrollY = pos.y
        // console.log('scrollY', this.scrollY)
      },
      // 计算高度
      _calculateHeight () {
        this.listHeight = []
        const list = this.$refs.listgroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
        // console.log('listHeight', this.listHeight)
      },
      selectItem (item) {
        this.$emit('select', item)
      },
      refresh () {
        this.$refs.listview.refresh()
      }
    },
    computed: {
      shortcutList () {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      fixedTitle () {
        // 当向上拖动的时候 会多出一个‘热门’的div 此时设置内容为空
        if (this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    watch: {
      // data变化重新计算高度 this._calculateHeight()需要确保在dom渲染好后再执行 用setTimeout设置延迟时间20ms就成功 在延迟时间计算不准确的情况下 使用this.nextTick是个较好的方法
      data () {
        this.$nextTick(() => {
          this._calculateHeight()
        })
      },
      // 监控scrollY的变化 监控scrollY变化的时候 传参的值即为实时scoll的值
      scrollY (newY) {
        // console.log('newY', newY)
        for (let i = 1; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i - 1]
          let height2 = this.listHeight[i]
          if (height1 <= Math.abs(newY) && Math.abs(newY) < height2) {
            this.currentIndex = i - 1
            // 设置diff的值
            this.diff = height2 - (-this.scrollY + LIST_FIXED_HEIGHT)
            // console.log(this.diff)
            return
          }
          // console.log('result', Math.abs(newY), height1, height2, this.currentIndex)
        }
      },
      diff (val) {
        if (val < 0) {
          // console.log('val小于0', val)
          this.$refs.fixed.style.transform = `translate3d(0,${val}px,0)`
          // console.log(val + LIST_FIXED_HEIGHT)
        } else {
          this.$refs.fixed.style.transform = 'translate3d(0,0,0)'
        }
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>

