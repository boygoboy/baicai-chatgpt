
import $http from '../../http'

// 提交key信息
const postKeyList = (data) => {
    return $http({
        url:'/api/chatgpt/keylist',
        method:'post',
        data
    })
}
// 获取key信息
const getKeyList = (query) => {
    console.log(query)
    return $http({
        url:'/api/chatgpt/keylist',
        method:'get',
        data:query
    })
}
// 删除key信息
const deleteKeyList = (ids) => {
    return $http({
        url:`/api/chatgpt/keylist/${ids}`,
        method:'delete',
    })
}
// 修改key信息
const putKeyList= (data) => {
    return $http({
        url:`/api/chatgpt/keylist`,
        method:'put',
        data
    })
}
// 获取单个key信息
const getKeyDetail= (id) => {
    return $http({
        url:`/api/chatgpt/onekey/${id}`,
        method:'get',
    })
}
// 修改key状态
const changeKeyStatus= (data) => {
    return $http({
        url:`/api/chatgpt/keylist/keystatus`,
        method:'put',
        data
    })
}

// 提交Token信息
const postTokenList = (data) => {
    return $http({
        url:'/api/chatgpt/tokenlist',
        method:'post',
        data
    })
}
// 获取Token信息
const getTokenList = (query) => {
    console.log(query)
    return $http({
        url:'/api/chatgpt/tokenlist',
        method:'get',
        data:query
    })
}
// 删除Token信息
const deleteTokenList = (ids) => {
    return $http({
        url:`/api/chatgpt/tokenlist/${ids}`,
        method:'delete',
    })
}
// 修改Token信息
const putTokenList= (data) => {
    return $http({
        url:`/api/chatgpt/tokenlist`,
        method:'put',
        data
    })
}
// 获取单个Token信息
const getTokenDetail= (id) => {
    return $http({
        url:`/api/chatgpt/onetoken/${id}`,
        method:'get',
    })
}
// 修改Token状态
const changeTokenStatus= (data) => {
    return $http({
        url:`/api/chatgpt/tokenlist/enablestatus`,
        method:'put',
        data
    })
}
// 获取token
const loginToken= (data) => {
    return $http({
        url:`/api/chatgpt/login/token`,
        method:'post',
        data
    })
}
// 获取session
const loginSession= (data) => {
    return $http({
        url:`/api/chatgpt/login/session`,
        method:'post',
        data
    })
}



// 提交bing信息
const postBingList = (data) => {
    return $http({
        url:'/api/chatgpt/binglist',
        method:'post',
        data
    })
}
// 获取Bing信息
const getBingList = (query) => {
    console.log(query)
    return $http({
        url:'/api/chatgpt/binglist',
        method:'get',
        data:query
    })
}
// 删除Bing信息
const deleteBingList = (ids) => {
    return $http({
        url:`/api/chatgpt/binglist/${ids}`,
        method:'delete',
    })
}
// 修改Bing信息
const putBingList= (data) => {
    return $http({
        url:`/api/chatgpt/binglist`,
        method:'put',
        data
    })
}
// 获取单个Bing信息
const getBingDetail= (id) => {
    return $http({
        url:`/api/chatgpt/onebing/${id}`,
        method:'get',
    })
}
// 修改Bing状态
const changeBingStatus= (data) => {
    return $http({
        url:`/api/chatgpt/binglist/bingstatus`,
        method:'put',
        data
    })
}

export default{
    postKeyList,getKeyList,deleteKeyList,putKeyList,getKeyDetail,changeKeyStatus,
    postTokenList,getTokenList,deleteTokenList,putTokenList,getTokenDetail,changeTokenStatus,
    loginToken,loginSession,
    postBingList,getBingList,deleteBingList,putBingList,getBingDetail,changeBingStatus
}