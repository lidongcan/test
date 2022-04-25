import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import element from 'element-ui'
import { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/index.css'
import ZkTable from 'vue-table-with-tree-grid'
// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$message = Message
Vue.use(element)
Vue.component('tree-table', ZkTable)
Vue.use(VueQuillEditor /* { default global options } */)

axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  },
  (err) => {
    return this.$message.error('请求超时')
  },
)

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
