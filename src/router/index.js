import Vue from 'vue'

import Router from 'vue-router'

// 导入Login.vue
import Login from '@/components/Login'
// 导入Home.vue
import Home from '@/components/Home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    }
  ]
})
