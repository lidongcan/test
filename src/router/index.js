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
    ],
  },
]

const router = new VueRouter({
  routes,
  mode: 'history',
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
