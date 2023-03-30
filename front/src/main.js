import Vue from 'vue'
import App from './App.vue'
import router from './router'
Vue.config.productionTip = false
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
import store from '@/store'
//import '@/mock'
import $http from '@/http'

Vue.use($http);
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
