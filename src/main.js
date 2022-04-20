import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import element from 'element-ui'
import { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/index.css'
import ZkTable from 'vue-table-with-tree-grid'

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$message = Message
Vue.use(element)
Vue.component('tree-table', ZkTable)

axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  },
  (err) => {
    return this.$message.error('请求超时')
  }
)
new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
