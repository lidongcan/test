import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
// import element from 'element-ui'
// import { Message } from 'element-ui'

import './assets/css/index.css'
// 树形表格
import ZkTable from 'vue-table-with-tree-grid'
// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入nprogress进度条
import nprogress from 'nprogress'

// 阻止启动生产消息
Vue.config.productionTip = false
Vue.prototype.$http = axios
// Vue.prototype.$message = Message
// Vue.use(element)
Vue.component('tree-table', ZkTable)
Vue.use(VueQuillEditor /* { default global options } */)

axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    nprogress.start()
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  },
  (err) => {
    return this.$message.error('请求超时')
  },
)
// 响应拦截器
axios.interceptors.response.use((config) => {
  nprogress.done()
  return config
})

// 时间过滤器，毫秒转换成年月日时分秒
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
