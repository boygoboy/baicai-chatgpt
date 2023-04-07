import Vue from 'vue'
import App from './App.vue'
import router from './router'
Vue.config.productionTip = false
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import highlight from 'highlight.js';
import 'font-awesome/css/font-awesome.min.css'
import VueTypedJs from 'vue-typed-js'

Vue.use(VueTypedJs)

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


// Vue.directive('highlight', (el) => {
//   const escapeHtml = (unsafe) => {
//     return unsafe
//       .replace(/&/g, '&amp;')
//       .replace(/</g, '&lt;')
//       .replace(/>/g, '&gt;')
//       .replace(/"/g, '&quot;')
//       .replace(/'/g, '&#039;');
//   }

//   let blocks = el.querySelectorAll('pre code')
//   blocks.forEach((block) => {
//     block.innerHTML = escapeHtml(block.innerHTML)
//     highlight.highlightBlock(block)
//   })
// })


Vue.use($http);
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
