import Vue from 'vue'
import App from './App.vue'
import router from './router'
Vue.config.productionTip = false
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import highlight from 'highlight.js';
import 'font-awesome/css/font-awesome.min.css'

Vue.use(highlight);
Vue.use(ElementUI)
import store from '@/store'
//import '@/mock'
import $http from '@/http'

//封装成一个指令
Vue.directive('highlight', (el) => {
  let blocks = el.querySelectorAll('pre code')
  blocks.forEach((block) => {
    highlight.highlightBlock(block)
  })
})


Vue.use($http);
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
