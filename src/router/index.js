import Vue from 'vue'
import Router from 'vue-router'
// import Recommend from 'components/recommend/recommend'
// import Singer from 'components/singer/singer'
// import Rank from 'components/rank/Rank'
// import Search from 'components/search/Search'
// import userCenter from 'components/user-center/user-center'
// import SingerDetail from 'components/singer-detail/singer-detail'
// import Disc from 'components/disc/disc'
// import Toplist from 'components/top-list/top-list'
// 路由懒加载 新版本写法 简洁高效
const Recommend = () => import('components/recommend/recommend')
const Singer = () => import('components/singer/singer')
const Rank = () => import('components/rank/Rank')
const Search = () => import('components/search/Search')
const userCenter = () => import('components/user-center/user-center')
const SingerDetail = () => import('components/singer-detail/singer-detail')
const Disc = () => import('components/disc/disc')
const Toplist = () => import('components/top-list/top-list')

// 以下方式是老版本写法 得比较麻烦
// const Recommend = (resolve) => {
//   import('components/recommend/recommend').then((module) => {
//     resolve(module)
//   })
// }
// const Singer = (resolve) => {
//   import('components/singer/singer').then((module) => {
//     resolve(module)
//   })
// }
// const Rank = (resolve) => {
//   import('components/rank/Rank').then((module) => {
//     resolve(module)
//   })
// }
// const Search = (resolve) => {
//   import('components/search/Search').then((module) => {
//     resolve(module)
//   })
// }
// const userCenter = (resolve) => {
//   import('components/user-center/user-center').then((module) => {
//     resolve(module)
//   })
// }
// const SingerDetail = (resolve) => {
//   import('components/singer-detail/singer-detail').then((module) => {
//     resolve(module)
//   })
// }
// const Disc = (resolve) => {
//   import('components/disc/disc').then((module) => {
//     resolve(module)
//   })
// }
// const Toplist = (resolve) => {
//   import('components/top-list/top-list').then((module) => {
//     resolve(module)
//   })
// }

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [{
        path: ':id',
        component: Disc
      }]
    },
    {
      path: '/singer',
      component: Singer,
      children: [{
        path: ':id',
        component: SingerDetail
      }]
    },
    {
      path: '/rank',
      component: Rank,
      children: [{
        path: ':id',
        component: Toplist
      }]
    },
    {
      path: '/search',
      component: Search,
      children: [{
        path: ':id',
        component: SingerDetail
      }]
    },
    {
      path: '/user',
      component: userCenter
    }
  ]
})
