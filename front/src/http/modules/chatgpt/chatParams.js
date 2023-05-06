import $http from '../../http'

// 提交聊天配置参数
const postChatParams = (data) => {
    return $http({
        url:'/api/chatgpt/chatparams',
        method:'post',
        data
    })
}
// 获取聊天配置参数
const getChatParams = () => {
    return $http({
        url:'/api/chatgpt/chatparams',
        method:'get',
    })
}
// 删除聊天配置
const deleteChatParams = (id) => {
    return $http({
        url:`/api/chatgpt/chatparams/${id}`,
        method:'delete',
    })
}
// 修改聊天配置
const putChatParams = (data) => {
    return $http({
        url:`/api/chatgpt/chatparams`,
        method:'put',
        data
    })
}

// 获取官方密钥配置
const getOfficalKeys = () => {
    return $http({
        url:'/api/chatgpt/officalkeysetting',
        method:'get',
    })
}
// 提交官方密钥配置
const postOfficalKeys = (data) => {
    return $http({
        url:'/api/chatgpt/officalkeysetting',
        method:'post',
        data
    })
}

// 获取非官方密钥配置
const getUnofficalKeys = () => {
    return $http({
        url:'/api/chatgpt/unofficalkeysetting',
        method:'get',
    })
}
// 提交非官方密钥配置
const postUnofficalKeys = (data) => {
    return $http({
        url:'/api/chatgpt/unofficalkeysetting',
        method:'post',
        data
    })
}

export default{
    postChatParams,getChatParams,deleteChatParams,putChatParams
    ,getOfficalKeys,postOfficalKeys,getUnofficalKeys,postUnofficalKeys
}