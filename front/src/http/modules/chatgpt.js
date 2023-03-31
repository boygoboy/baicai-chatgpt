import $http from '../http'
//发送聊天消息
const getChatGptMessage = (message) => {
    return $http({
        url:`/api/chatgpt/testask/${message}`,
        method:'get',  
    })
}

export default{
    getChatGptMessage
}