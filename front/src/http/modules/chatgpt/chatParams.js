
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

// 获取官方密钥下拉列表
const getOfficalKeyList = (query) => {
    return $http({
        url:'/api/chatgpt/officalkeylist',
        method:'get',
        data:query
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
// 获取chatgpt非官方token下拉列表
const getUnofficaltokenList = (query) => {
    return $http({
        url:'/api/chatgpt/unofficaltokenlist',
        method:'get',
        data:query
    })
}
// 获取bing非官方token下拉列表
const getBingTokenList = (query) => {
    return $http({
        url:'/api/chatgpt/bingtokenlist',
        method:'get',
        data:query
    })
}

// 获取bard非官方token下拉列表
const getBardTokenList = (query) => {
    return $http({
        url:'/api/chatgpt/bardtokenlist',
        method:'get',
        data:query
    })
}
// 获取claudetoken非官方token下拉列表
const getClaudeTokenList = (query) => {
    return $http({
        url:'/api/chatgpt/claudetokenlist',
        method:'get',
        data:query
    })
}
// 获取huggingface非官方token下拉列表
const getHuggingTokenList = (query) => {
    return $http({
        url:'/api/chatgpt/huggingtokenlist',
        method:'get',
        data:query
    })
}

export default{
    postChatParams,getChatParams,deleteChatParams,putChatParams
    ,getOfficalKeys,postOfficalKeys,getUnofficalKeys,postUnofficalKeys,
    getOfficalKeyList,getUnofficaltokenList,getBingTokenList,getBardTokenList,
    getClaudeTokenList,getHuggingTokenList
}