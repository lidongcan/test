import VueRouter from 'vue-router'
import Vue from 'vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/login',
    name: 'Login',
    meta: { title: '登录' },
    component: () => import('../components/Login.vue'),
  },
  {
    path: '/home',
    name: 'Home',
    meta: { title: '首页' },
    component: () => import('../components/Home.vue'),
    children: [
      {
        path: '/users',
        name: 'users',
        meta: { title: '用户列表' },
        component: () => import('../view/Users.vue'),
      },
      {
        path: '/roles',
        name: 'roles',
        meta: { title: '角色列表' },
        component: () => import('../view/Authority/Roles.vue'),
      },
      {
        path: '/rights',
        name: 'Rights',
        meta: { title: '权限列表' },
        component: () => import('../view/Authority/Rights.vue'),
      },
      {
        path: '/goods',
        name: 'Goods',
        meta: { title: '商品列表' },
        component: () => import('../view/Commodity/Goods.vue'),
      },
      {
        path: '/params',
        name: 'Params',
        meta: { title: '分类参数' },
        component: () => import('../view/Commodity/Params.vue'),
      },
      {
        path: '/categories',
        name: 'Categories',
        meta: { title: '商品分类' },
        component: () => import('../view/Commodity/Categories.vue'),
      },
      {
        path: '/orders',
        name: 'Orders',
        meta: { title: '订单列表' },
        component: () => import('../view/Orders/Orders.vue'),
      },
      {
        path: '/reports',
        name: 'Reports',
        meta: { title: '数据统计' },
        component: () => import('../view/Reports/Reports.vue'),
      },
    ],
  },
]

const router = new VueRouter({
  routes,
  mode: 'history',
})

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
