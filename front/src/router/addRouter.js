// 递归添加路由
const addRoutes = (menuList = [], routes = []) => {
    for (let i in menuList) {
      if (menuList[i].children && menuList[i].children.length > 0) {
        addRoutes(menuList[i].children, routes)
      } else {
        routes.push({
          meta:{
            reset:menuList[i].reset,
          },
          name: menuList[i].name,
          path: menuList[i].url,
          // 路由文件写在url下，如/sys/user就在sys下创建user.vue文件
          component: () => import(`@/view/content${menuList[i].url}`),
        })
      }
  
    }
    return routes
  }
  export default addRoutes