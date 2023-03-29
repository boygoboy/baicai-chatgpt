import api from './api'
const install = (Vue)=>{
    
    Object.defineProperty(Vue.prototype,'$http',{
        value:api
    })
}
export default install