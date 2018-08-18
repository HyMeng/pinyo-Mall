// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'element-ui/lib/theme-chalk/index.css'
// 导入quill样式的插件
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import Vue from 'vue'

import App from './App'

import router from './router'
// 导入axios
import axios from 'axios'
// 导入element-ui
import ElementUI from 'element-ui'

// 导入moment插件
import moment from 'moment'
// 导入vue-quill-editor富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 使用插件
Vue.use(VueQuillEditor)

Vue.use(ElementUI)

Vue.filter('dataFilter', (Input, format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(Input).format(format)
})
Vue.config.productionTip = false
// 将axios方法添加到vue的原型对象上
Vue.prototype.axios = axios
// 给axios配置拦截器

// 添加请求拦截器,拦截器的作用：
// 在拦截器中可以获取到axios的配置，在config中修改东西
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // console.log('哈哈，我拦截到了请求', config)
  // 只需要给config配置baseURL 以及 headers
  config.headers.Authorization = localStorage.getItem('userToken')
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// axios.defaults.headers.common['Authorization'] = localStorage.getItem('userToken')
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
