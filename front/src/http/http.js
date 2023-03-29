import axios from 'axios'
import Cookies from 'js-cookie'
import router from '../router'
import { Message } from 'element-ui'
import { Loading } from 'element-ui';
import {removeAll} from '@/utils/storage'
const showStatus = (status) => {
    let message = ''
    switch (status) {
        case 400:
            message = '请求错误(400)'
            break
        case 401:
            message = '未授权，请重新登录(401)'
            break
        case 403:
            message = '拒绝访问(403)'
            break
        case 404:
            message = '请求出错(404)'
            break
        case 408:
            message = '请求超时(408)'
            break
        case 500:
            message = '服务器错误(500)'
            break
        case 501:
            message = '服务未实现(501)'
            break
        case 502:
            message = '网络错误(502)'
            break
        case 503:
            message = '服务不可用(503)'
            break
        case 504:
            message = '网络超时(504)'
            break
        case 505:
            message = 'HTTP版本不受支持(505)'
            break
        default:
            message = `连接出错(${status})!`
    }
    return `${message}，请检查网络或联系管理员！`
}

const service = axios.create({
    method: 'get',
    //判断是请求代理服务器还是直接请求后端服务，直接请求需后端配置跨域
    baseURL: process.env.VUE_APP_API_MODE === 'proxy' ? `${process.env.VUE_APP_SERVER}:${process.env.VUE_APP_SERVER_PORT}` : `${process.env.VUE_APP_API}`,
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    timeout: 30000
})
//请求是否使用全局loading 默认使用
let loading = true
//是否使用默认统一全局弹窗，默认使用
let isShowToast = true
let loadingInstance;
// 请求拦截器
service.interceptors.request.use((config) => {
    let { data } = config
    if (data.isShowToast) { isShowToast = data.isShowToast; delete data.isShowToast }
    if (data.loading) { loading = data.loading; delete data.loading }
    //可以开启全局loading
    if (loading) loadingInstance = Loading.service({ background: 'rgba(0, 0, 0, 0.3)' });

    const token = Cookies.get('token')
    //判断token
    if (token) {
        config.headers.token = token
    } else {
        if (router.app._route.name !== 'login') {
            router.push('/login')
            return
        }
    }
    return config
}, (error) => {
    // 错误抛到业务代码
    //关闭弹窗
    if (loading) loadingInstance.close()
    error.data = {}
    error.data.message = '服务器异常，请联系管理员！'
    return Promise.resolve(error)
})

// 响应拦截器
service.interceptors.response.use((response) => {
    const status = response.status
    let message = ''
    //关闭弹窗
    if (loading) loadingInstance.close()

    if (status < 200 || status >= 300) {
        // 处理http错误，抛到业务代码
        message = showStatus(status)
        if (isShowToast) {
            Message({
                message: message,
                type: 'warning'
            })
        }

        if (typeof response.data === 'string') {
            response.data = { message }
        } else {
            response.data.message = message
        }
    }

    const { errorCode } = response.data
    if (errorCode != '0000') {
        if (isShowToast) {
            let message=''
            switch (errorCode) {
                case '1004':
                    Cookies.remove('token')
                    removeAll()
                    message = "token校验失败"
                    router.push('/login')
                    break
                case '1002':
                    message = "用户名或密码错误"
                    break
                default:
                    message = response.data.message
            }
            Message({
                message: message,
                type: 'warning'
            })
        }


    }
    return response.data
}, (error) => {
    // 错误抛到业务代码
    let errorMsg = {}
    errorMsg.errorCode = -1
    errorMsg.data = null
    errorMsg.message = error
    Message({
        message: '服务器异常，请联系管理员！',
        type: 'warning'
    })
    //关闭弹窗
    if (loading) loadingInstance.close()
    return Promise.resolve(errorMsg)
})
const $http = (options) => {
    if (!options.data) { options.data = {} }

    if (options.method === 'get') {
        options.params = options.data
    }
    return service(options)
}
export default $http