// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vant from 'vant';
import 'vant/lib/index.css';
import axios from 'axios';
import store from './store/index';
import * as filter from './filter/filter';
Object.keys(filter).forEach(key => Vue.filter(key, filter[key]));


Vue.use(Vant);
Vue.config.productionTip = false


router.beforeEach((to, from, next) => {
  let accessToken =localStorage.getItem('accessToken');
  if (!accessToken && to.path!='/login') {
    next('/login')
  }else{
    next()
  }
})
axios.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (localStorage.getItem('accessToken')) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers['accessToken'] = localStorage.getItem('accessToken')
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
  }
)
axios.interceptors.response.use((response) => {
  if(response.data.resultCode != "200"){
      console.error(response.config.url,response.data.resultCode,response.data.resultMessage)
      if(response.data.resultCode == "401"){
          sessionStorage.clear();
          localStorage.clear();
          location.href=window.location.href.split("/h5")[0]+"/h5/login"
      }
  }
  return response;
}, (error) => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
      console.error(error.response)
    }
  }
  return Promise.reject(error)
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
