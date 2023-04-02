import $http from '../http'
//发送聊天消息
const getChatGptMessage = (data) => {
    return $http({
        url:`/api/chatgpt/ask`,
        method:'post',  
        data
    })
}

export default{
    getChatGptMessage
}