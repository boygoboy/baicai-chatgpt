import vuex from 'vuex'
import Vue from 'vue'
import navMenu from '@/components/navMenu/store'
import tabs from '@/components/mainContent/component/tabs/store'
import user from '@/view/content/sys/store/user.js'
import permSign from './modules/permSign'
Vue.use(vuex)
let Store = {
    modules: {
        navMenu,
        tabs,
        user,
        permSign
    },
    mutations:{
        // resetStore(state){
          
        //     state = JSON.parse(sessionStorage.getItem("init"))
        // }
    
    }

}
let modules = Store.modules
sessionStorage.setItem("init",JSON.stringify(modules))

for (let i in modules) {
    if (!modules[i].mutations) {
        modules[i].mutations = {}
    }
    modules[i].mutations['resetStore'] = (state)=>{
        const init = JSON.parse(sessionStorage.getItem("init"))
        const initState = init[i].state
        for(let key in initState){
            state[key] = initState[key]
        }       
    }
}

export default new vuex.Store(
    Store
)