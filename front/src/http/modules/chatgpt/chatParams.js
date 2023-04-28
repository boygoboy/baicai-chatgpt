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

export default{
    postChatParams,getChatParams
}