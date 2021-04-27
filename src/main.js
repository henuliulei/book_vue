import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import './assets/fonts/iconfont.css'
import './assets/css/global.css'
Vue.prototype.$http= axios
Vue.use(ElementUI)
Vue.config.productionTip = false
//指向后端路由
axios.defaults.baseURL = 'http://127.0.0.1:8080/'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
