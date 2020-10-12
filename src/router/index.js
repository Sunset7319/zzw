import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login'
import goods from '@/views/goods'
import home from '@/views/home'
import setUp from '@/views/setUp'
import recharge from '@/views/recharge'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base:"/h5",
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/home',
      name: 'home',
      component: home
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/goods',
      name: 'goods',
      component: goods
    },
    {
      path: '/setUp',
      name: 'setUp',
      component: setUp
    },
    {
      path: '/recharge',
      name: 'recharge',
      component: recharge
    },
  ]
})
// // 【添加代码】解决vue-router在3.0版本以上重复点路由报错
// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }