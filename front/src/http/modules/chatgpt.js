import $http from '../http'
//发送聊天消息
const getChatGptMessage = (data) => {
    return $http({
        url:`/api/chatgpt/ask`,
        method:'post',  
        data
    })
}

// 获取聊天配置参数
const getChatParam = () => {
   return $http({
    url:'/api/gptparam/chatparam',
    method:'get'
   })
}
// 更新聊天配置参数
const putChatParam = (data) => {
    return $http({
        url:'/api/gptparam/chatparam',
        method:'put',
        data
    })
}
// 获取模型配置参数
const getModelParam = () => {
    return $http({
        url:'/api/gptparam/modelparam',
        method:'get'
    })
}
// 更新模型配置参数
const putModelParam = (data) => {
    return $http({
        url:'/api/gptparam/modelparam',
        method:'put',
        data
    })
}
export default{
    getChatGptMessage,getChatParam,putChatParam,getModelParam,putModelParam
}