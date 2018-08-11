import Vue from 'vue'

import Router from 'vue-router'

// 导入Login.vue
import Login from '@/components/Login'
// 导入Home.vue
import Home from '@/components/Home'
// 导入Users.vue
import Users from '@/components/Users'

Vue.use(Router)

const router = new Router({
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
      component: Home,
      // 通过children给home组件设置子组件
      children: [{
        path: '/users',
        name: 'Users',
        component: Users
      }]
    }
  ]
})
router.beforeEach((to, from, next) => {
  console.log(to)
  if (to.path === '/login') {
    next()
    return
  }
  if (localStorage.getItem('userToken')) {
    next()
  } else {
    next('/login')
  }
})
export default router
