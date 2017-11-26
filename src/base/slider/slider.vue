<template>
  <div class="slider" ref='slider'><!-- 设置better-scroll -->
  	<div class='slider-group' ref='sliderGroup'><!-- 图片包裹层宽度设置 -->
  		<slot></slot>
  	</div>
  	<div class='dots'>
  		<span v-for='(item,index) in dots' class='dot' :class="{'active':index===currentPageIndex}"></span>
  	</div>
  </div>
</template>

<script type="text/ecmascript-6">
  // 此处导入的不是公共基础组件
  import BScroll from 'better-scroll'
  import {addClass} from 'common/js/dom'

  export default {
    data () {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoplay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    methods: {
      _setSliderWidth (isResize) {
        this.children = this.$refs.sliderGroup.children

        let width = 0
        // 客户端显示区的宽度
        let sliderWidth = this.$refs.slider.clientWidth
        for (let i = 0; i < this.children.length; i++) {
          // chiildren[i]超级低级的错误 超级低级的错误 拼写错误
          let child = this.children[i]

          // 应为动态添加了元素 所以要手动添加class 在vfor的时候就为每一个div添加slider-item 也可以
          addClass(child, 'slider-item')
          // 为每一个div动态设置宽度
          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }
        // 总宽度
        if (this.loop && !isResize) {
          width += sliderWidth * 2
        }
        // console.log(width)
        this.$refs.sliderGroup.style.width = width + 'px'
      },

      _initSlider () {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          },
          click: true
        })
        // console.log('pageIndex-orig:B', this.children.length) // 7 创建了new scroll对象后 children的长度变为7了 在首尾两处动态添加了2个元素

        // 设置currentPageIndex
        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX
          if (this.loop) {
            // 如果循环滚动 当前index减去1
            pageIndex -= 1
          }
          this.currentPageIndex = pageIndex

          // 每次轮播的时候 清除定时器
          if (this.autoplay) {
            clearTimeout(this.timer)
            this._play()
          }
        })
      },

      _initDots () {
        this.dots = new Array(this.children.length)
      },

      // 设置自动播放 通过修改currentIndex的值 用betterScroll的goToPage()方法来实现
      _play () {
        // index 分别是                 0 1 2 3 4
        // pagex 原始值分别是         0 1 2 3 4 5 6
        // currentIndex值是             0 1 2 3 4
        // 如果不轮播 pageIndex值是     1 2 3 4 5
        // 如果轮播 pageIndex值是       2 3 4 5 6
        // 在slider的goToPage中的参数值pageIndex值是(设置下一次跳转的页面 所以要加1)
        //                              6 2 3 4 5
        // goToPage方法中goToPage(1, 0, 400)中的1就代表dot数组中index为0的第一页 2就代表第二页 ---5代表第五页 6代表回到第一页6%5 即取余
        //                              1 2 3 4 5 6（参数6回到第一页）
        let pageIndex = this.currentPageIndex + 1
        if (this.loop) {
          pageIndex += 1
        }
        // console.log(pageIndex, this.currentPageIndex)
        // 设置定时器
        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0, 400)
        }, this.interval)
      }
    },
    mounted () {
      // 在dom还没加载完成的时候直接计算长度会是0 这个时候还没有加载每个div元素
      setTimeout(() => {
        this._setSliderWidth()
        this._initDots()
        this._initSlider()
        // 设置自动播放
        if (this.autoplay) {
          this._play()
        }
      }, 20)

      // 增加一个监听
      window.addEventListener('resize', () => {
        if (!this.slider) {
          return
        }
        // 此时this.children.length已经是7了
        // console.log(this.children.length) // 7
        this._setSliderWidth(true) // 此时遍历的是长度为7的数组 所以加个判断 就不需要增加宽度了
        this.slider.refresh()
      })
    },
    destroyed () {
      // 在组件销毁的时候清除定时器
      clearTimeout(this.timer)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>