import Vue from 'vue'

import Router from 'vue-router'

// 导入Login.vue
// import Login from '@/components/Login'
const Login = () => import(/* webpackChunkName:'login' */'@/components/Login')
// 导入Home.vue
// import Home from '@/components/Home'
const Home = () => import(/* webpackChunkName:'home' */'@/components/Home')
// 导入Users.vue
// import Users from '@/components/users/Users'
const Users = () => import(/* webpackChunkName:'users' */'@/components/users/Users')
// 导入Roles.vue
// import Roles from '@/components/right/Roles'
const Roles = () => import(/* webpackChunkName:'roles' */'@/components/right/Roles')
// 导入Right.vue
// import Rights from '@/components/right/Rights'
const Rights = () => import(/* webpackChunkName:'rights' */'@/components/right/Rights')

// import Categories from '@/components/product/Categories'
const Categories = () => import(/* webpackChunkName:'categories' */'@/components/product/Categories')

// import Goods from '@/components/product/Goods'
const Goods = () => import(/* webpackChunkName:'goods' */'@/components/product/Goods')

// import GoodsAdd from '@/components/goods-add/Goods-add'
const GoodsAdd = () => import(/* webpackChunkName:'goods-add' */'@/components/goods-add/Goods-add')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
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
      }, {
        path: '/roles',
        name: 'Roles',
        component: Roles
      }, {
        path: '/rights',
        name: 'Rights',
        component: Rights
      }, {
        path: '/categories',
        name: 'Categories',
        component: Categories
      }, {
        path: '/goods',
        name: 'Goods',
        component: Goods
      }, {
        path: '/goods-add',
        name: 'Goods-add',
        component: GoodsAdd
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
