<template>
  <div class="progress-bar" ref="progressBar" @click='progressClick'>
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent='progressTouchStart'
        @touchmove.pvevent='progressTouchMove'
        @touchend.pvevent='progressTouchEnd'
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {prefixStyle} from 'common/js/dom'
  const transform = prefixStyle('transform')

  const progressBtnWidth = 16 // 黄色小球宽度
  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    methods: {
      progressTouchStart (e) {
        this.touch.initiated = true
        this.touch.startX = e.touches[0].pageX
        this.touch.left = this.$refs.progress.clientWidth
      },
      progressTouchMove (e) {
        if (!this.touch.initiated) {
          return
        }
        const deltaX = e.touches[0].pageX - this.touch.startX
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
        this._offset(offsetWidth)
      },
      progressTouchEnd () {
        this.touch.initiated = false
        // 拖动后触发percent改变
        this._triggerPercent()
      },
      _offset (offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      },
      _triggerPercent () {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const percent = this.$refs.progress.clientWidth / barWidth
        this.$emit('percentChange', percent) // 派发事件 基础组件 不执行任何业务逻辑
      },
      progressClick (e) {
        // console.log(e)
        // this._offset(e.offsetX) // 这里有bug 点击的时候不能正确获取位置信息. 原因是当点击btn的时候 点击事件被btn捕获了 导致获取不到进度条的 event.offsetX 解决办法 用event.clientX
        const rect = this.$refs.progressBar.getBoundingClientRect()
        const offsetWidth = e.clientX - rect.left
        this._offset(offsetWidth)
        this._triggerPercent()
      }
    },
    created () {
      this.touch = {}
    },
    watch: {
      percent (newPercent) {
        // console.log(newPercent)
        if (newPercent >= 0 && !this.touch.initiated) {
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          const offsetWidth = newPercent * barWidth
          // console.log(newPercent)
          this._offset(offsetWidth)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>