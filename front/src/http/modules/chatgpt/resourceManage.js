
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



// 提交bard信息
const postBardList = (data) => {
    return $http({
        url:'/api/chatgpt/bardlist',
        method:'post',
        data
    })
}
// 获取Bard信息
const getBardList = (query) => {
    console.log(query)
    return $http({
        url:'/api/chatgpt/bardlist',
        method:'get',
        data:query
    })
}
// 删除Bard信息
const deleteBardList = (ids) => {
    return $http({
        url:`/api/chatgpt/bardlist/${ids}`,
        method:'delete',
    })
}
// 修改Bard信息
const putBardList= (data) => {
    return $http({
        url:`/api/chatgpt/bardlist`,
        method:'put',
        data
    })
}
// 获取单个Bard信息
const getBardDetail= (id) => {
    return $http({
        url:`/api/chatgpt/onebard/${id}`,
        method:'get',
    })
}
// 修改Bard状态
const changeBardStatus= (data) => {
    return $http({
        url:`/api/chatgpt/bardlist/bardstatus`,
        method:'put',
        data
    })
}


// 提交claude信息
const postClaudeList = (data) => {
    return $http({
        url:'/api/chatgpt/claudelist',
        method:'post',
        data
    })
}
// 获取claude信息
const getClaudeList = (query) => {
    console.log(query)
    return $http({
        url:'/api/chatgpt/claudelist',
        method:'get',
        data:query
    })
}
// 删除claude信息
const deleteClaudeList = (ids) => {
    return $http({
        url:`/api/chatgpt/claudelist/${ids}`,
        method:'delete',
    })
}
// 修改claude信息
const putClaudeList= (data) => {
    return $http({
        url:`/api/chatgpt/claudelist`,
        method:'put',
        data
    })
}
// 获取单个claude信息
const getClaudeDetail= (id) => {
    return $http({
        url:`/api/chatgpt/oneclaude/${id}`,
        method:'get',
    })
}
// 修改claude状态
const changeClaudeStatus= (data) => {
    return $http({
        url:`/api/chatgpt/claudelist/claudestatus`,
        method:'put',
        data
    })
}


// 提交hugging信息
const postHuggingList = (data) => {
    return $http({
        url:'/api/chatgpt/hugginglist',
        method:'post',
        data
    })
}
// 获取hugging信息
const getHuggingList = (query) => {
    console.log(query)
    return $http({
        url:'/api/chatgpt/hugginglist',
        method:'get',
        data:query
    })
}
// 删除hugging信息
const deleteHuggingList = (ids) => {
    return $http({
        url:`/api/chatgpt/hugginglist/${ids}`,
        method:'delete',
    })
}
// 修改hugging信息
const putHuggingList= (data) => {
    return $http({
        url:`/api/chatgpt/hugginglist`,
        method:'put',
        data
    })
}
// 获取单个hugging信息
const getHuggingDetail= (id) => {
    return $http({
        url:`/api/chatgpt/onehugging/${id}`,
        method:'get',
    })
}
// 修改hugging状态
const changeHuggingStatus= (data) => {
    return $http({
        url:`/api/chatgpt/hugginglist/huggingstatus`,
        method:'put',
        data
    })
}


// 提交xfyun信息
const postXfyunList = (data) => {
    return $http({
        url:'/api/chatgpt/xfyunlist',
        method:'post',
        data
    })
}
// 获取xfyun信息
const getXfyunList = (query) => {
    console.log(query)
    return $http({
        url:'/api/chatgpt/xfyunlist',
        method:'get',
        data:query
    })
}
// 删除xfyun信息
const deleteXfyunList = (ids) => {
    return $http({
        url:`/api/chatgpt/xfyunlist/${ids}`,
        method:'delete',
    })
}
// 修改xfyun信息
const putXfyunList= (data) => {
    return $http({
        url:`/api/chatgpt/xfyunlist`,
        method:'put',
        data
    })
}
// 获取单个xfyun信息
const getXfyunDetail= (id) => {
    return $http({
        url:`/api/chatgpt/onexfyun/${id}`,
        method:'get',
    })
}
// 修改xfyun状态
const changeXfyunStatus= (data) => {
    return $http({
        url:`/api/chatgpt/xfyunlist/xfyunstatus`,
        method:'put',
        data
    })
}



// 提交poe信息
const postPoeList = (data) => {
    return $http({
        url:'/api/chatgpt/poelist',
        method:'post',
        data
    })
}
// 获取poe信息
const getPoeList = (query) => {
    console.log(query)
    return $http({
        url:'/api/chatgpt/poelist',
        method:'get',
        data:query
    })
}
// 删除poe信息
const deletePoeList = (ids) => {
    return $http({
        url:`/api/chatgpt/poelist/${ids}`,
        method:'delete',
    })
}
// 修改poe信息
const putPoeList= (data) => {
    return $http({
        url:`/api/chatgpt/poelist`,
        method:'put',
        data
    })
}
// 获取单个poe信息
const getPoeDetail= (id) => {
    return $http({
        url:`/api/chatgpt/onepoe/${id}`,
        method:'get',
    })
}
// 修改poe状态
const changePoeStatus= (data) => {
    return $http({
        url:`/api/chatgpt/poelist/poestatus`,
        method:'put',
        data
    })
}

export default{
    postKeyList,getKeyList,deleteKeyList,putKeyList,getKeyDetail,changeKeyStatus,
    postTokenList,getTokenList,deleteTokenList,putTokenList,getTokenDetail,changeTokenStatus,
    loginToken,loginSession,
    postBingList,getBingList,deleteBingList,putBingList,getBingDetail,changeBingStatus,
    postBardList,getBardList,deleteBardList,putBardList,getBardDetail,changeBardStatus,
    postClaudeList,getClaudeList,deleteClaudeList,putClaudeList,getClaudeDetail,changeClaudeStatus,
    postHuggingList,getHuggingList,deleteHuggingList,putHuggingList,getHuggingDetail,changeHuggingStatus,
    postXfyunList,getXfyunList,deleteXfyunList,putXfyunList,getXfyunDetail,changeXfyunStatus,
    postPoeList,getPoeList,deletePoeList,putPoeList,getPoeDetail,changePoeStatus
}