import Vue from 'vue'
import VueRouter from 'vue-router'
import user from '@/view/user/route'
//import home from '@/view/content/router'
import Cookies from 'js-cookie'
import store from '@/store'
import addRoutes from "./addRouter"
Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    {
      name: '首页',
      path: '/',
      component: () => import(/* webpackChunkName: "content" */'@/view/content'), 
      children:[
        {
          name: '默认首页',
          path: '',
          component:()=>import('@/view/default/index.vue')
         }
      ]
    },
    ...user,
  ]
})
router.beforeEach(async (to, from, next) => {
  const token = Cookies.get('token')
  if (to.path === '/login') {
    // 如果是访问登录界面，如果token信息存在，代表已登录过，跳转到主页
    if (token) {
      next("/")
      return
    }
    next()
    return
  }
  // 如果访问非登录界面，token不存在，则跳转到登录界面
  if (!token) {
    next({ path: '/login' })
    return
  }
  // 加载动态菜单和路由
  const menuTree = store.state.navMenu.navTree;
  if (!menuTree) {
   
    const menuList = await store.dispatch('navMenu/addMenuList',1)
   
    if(!menuList){
      next()
      return
    }
    let routes = await addRoutes(menuList)
    for (let childRoutes of routes) {
      //为名为‘首页’的路由添加子路由
      
      router.addRoute('首页', childRoutes)
    }
    //如果首次或者刷新界面，这里会循环遍历路由，如果to找不到对应的路由那么他会再执行一次beforeEach((to, from, next))直到找到对应的路由
    next({ ...to, replace: true })
    return
  }
  next()


})
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
export default router;