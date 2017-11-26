// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'common/stylus/index.styl'
// 对ES6的一些API如promise做一些转义
import 'babel-polyfill'
// 解决移动端页面元素点击300毫秒延迟的问题
import fastclick from 'fastclick'
import store from './store'

// 图片懒加载
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png')
})

fastclick.attach(document.body)
// 导入jsonp
// import Jsonp from 'jsonp'
// productionTip 2.2.0 新增 类型： boolean 默认值： true 用法：设置为 false 以阻止 vue 在启动时生成生产提示
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
