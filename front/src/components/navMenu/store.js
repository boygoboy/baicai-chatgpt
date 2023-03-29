import $http from '@/http/api'
export default {
    namespaced: true,
    state: {
        navTree: '',
        collapse:false
    },
    mutations: {
        setNavTree(state, data) {
            
            state.navTree = data
        },
        setCollapse(state,data){
            state.collapse = data
        }
    },
    actions: {
        addMenuList({commit},menuType) {
           /**
            * @params {Number} menu 是否获取按钮列表 0：获取 1：不获取
            */
           return new Promise((resolve,reject)=>{
          $http.menuList({menuType}).then(res=>{
                if (res.errorCode != "0000") {
                    return reject('error');
                }  
    
                if(menuType==1){
                //设置侧边栏菜单
                commit('setNavTree',res.data)
                }
                resolve(res.data)
            })
           })
        }
    }
}