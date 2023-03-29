import http from "@/http/api"
import Cookie from "js-cookie"
export default {
    namespaced: true,
    state: {
        permSign: []
    },
    mutations: {
        setPermSign(state, data) {
            console.log(data)
            state.permSign = data
        }
    },
    actions: {
        async login({commit}) {
            const user = Cookie.get("user")
            if (!user) return
            const loginForm = {
                username: user.split(',')[0],
                password: user.split(',')[1],
            }
            const { errorCode, data } = await http.login({ ...loginForm, isShowToast: true })
            if (errorCode === '0000') {
                //返回token与按钮权限permSign
                Cookie.set('token', data.token)
                commit("setPermSign",data.permSign)
            }

        }
    }
}