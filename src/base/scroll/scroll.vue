<template>
  <div ref="wrapper" class='scroll-template-test'>
  	<slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default {
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      // 从父元素传递过来的数据
      data: {
        type: Array,
        default: null
      },
      // 监听滚动事件
      listenScroll: {
        type: Boolean,
        // 默认是false 由调用这个scroll组件的父元素来提供数据
        default: false
      },
      // 设置是否可以上拉更新数据
      pullup: {
        type: Boolean,
        default: false
      },
      // 是否监听失去焦点事件
      beforScroll: {
        type: Boolean,
        default: false
      },
      refreshDelay: {
        type: Number,
        default: 20
      }
    },
    mounted () {
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      _initScroll () {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })
        // 监听滚动事件 派发事件 pos是位置信息 有X 和 Y属性
        if (this.listenScroll) {
          let me = this
          this.scroll.on('scroll', (pos) => {
            me.$emit('scroll', pos)
          })
        }
        // 监听上拉
        if (this.pullup) {
          this.scroll.on('scrollEnd', () => {
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              this.$emit('scrollToEnd')
            }
          })
        }
        // 监听失去焦点事件
        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScroll') // 对外派发一个事件 由父组件监听
          })
        }
      },

      disable () {
        this.scroll && this.scroll.disable()
      },
      enable () {
        this.scroll && this.scroll.enable()
      },
      // 刷新高度 重新刷新页面
      refresh () {
        this.scroll && this.scroll.refresh()
      },
      // 拓展滚动的方法
      scrollTo () {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement () {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    // 实时监听数据变化 刷新页面的数据
    watch: {
      data () {
        setTimeout(() => {
          this.refresh()
        }, 20)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style> 