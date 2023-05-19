import $http from '../../http'

// 获取用户对话统计信息
const getChatStatistics = (query) => {
    return $http({
        url:'/api/homestatistics/chatStatistics',
        method:'get',
        data:query
    })
}

const getChatDetail = (query) => {
    return $http({
        url:'/api/homestatistics/chatdetaildata',
        method:'get',
        data:query
    })
}

export default{
    getChatStatistics,getChatDetail
}