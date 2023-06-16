const axios=require('axios');
const chatglmList=require('../../../db/models/chatgpt/chatGlmListSchema');
const keyUnOffical=require('../../../db/models/chatgpt/keyUnOfficalSchema');
const moment=require('moment');
// 获取当前时间一个月后的时间
const getNextMonthDateTime=() =>{
    const nextMonthDateTime = moment().add(1, 'months').format('YYYY-MM-DD HH:mm:ss');
    return nextMonthDateTime;
}
// 更新newToken到数据库配置表中
const updateToken=async(token,cookie,userId)=>{
    // 将新的token更新到chatGlmListSchema表中
    try{
        const updatedGlm = await chatglmList.findOneAndUpdate(
            { cookie: cookie },  //找到cookie值匹配的文档
            { $set: { token: token } }, //设置新的token值
            { new: true }  //这个选项意味着返回的文档是更新后的版本
        );
        console.log(`更新chatglmList成功${updatedGlm}`)
    //   更新keyUnOffical表中的token
        console.log('userId',userId)
    if(!userId&&userId!=0){
        return
    }
    const updatedUnOffical = await keyUnOffical.findOneAndUpdate(
        { "userId": userId, "chatglmKey.chatglmcookie": cookie },
        { $set: { "chatglmKey.chatglmtoken": token } },
        { new: true }  // This option makes sure the function returns the updated document
    );
    console.log(`更新keyUnOffical成功${updatedUnOffical}`)
    }catch(error){
        throw error
    }
}
// 新建聊天
const createChat=async (token,cookie,message,retryCount,userId)=>{
    // cookie为chatglm_refresh_token
    // token为chatglm_token
    if(retryCount>3){
        return false
    }
    try{
        let config = {
            method: "POST",
            baseURL: "https://chatglm.cn/chatglm/backend-api/v1/conversation",
            headers: {
                'Connection': 'keep-alive',
                'sec-ch-ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=UTF-8',
                'sec-ch-ua-mobile': '?0',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
                'sec-ch-ua-platform': "Windows",
                'Origin': 'https://chatglm.cn',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
               ' Sec-Fetch-Dest': 'empty',
                'Referer': 'https://chatglm.cn/detail',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                "Authorization":`Bearer ${token}`,
                'Cookie': `chatglm_token=${token};chatglm_token_expires=${getNextMonthDateTime()};chatglm_refresh_token=${cookie}`,
            },
            data: {
                prompt: message
            }
        }
        let result=await axios(config);
        if(result.status==200){
            return {task_id:result.data.result.task_id}
        }else{
            return null
        }
    }catch(error){
        if (error.response?.status === 401) {
            // 刷新 Token...
            retryCount++
          let newToken =await refreshGlmToken(cookie)
          if(newToken){
            // 获取newToken成功，将新的newToken存入数据库相应位置
            updateToken(newToken,cookie,userId)
           let {task_id}= await createChat(newToken,cookie,message,retryCount)
           if(task_id){
                return {task_id,token:newToken}
           }else{
                return null
           }
          }else{
            return false
          }
    }else{
        return false
    }
}
}

// 获取聊天列表
const getGlmChatList=async (token,cookie)=>{
    try{
        let config = {
            method: "GET",
            baseURL: "https://chatglm.cn/chatglm/backend-api/v1/conversation/list",
            headers: {
                'Connection': 'keep-alive',
                'sec-ch-ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=UTF-8',
                'sec-ch-ua-mobile': '?0',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
                'sec-ch-ua-platform': "Windows",
                'Origin': 'https://chatglm.cn',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
               ' Sec-Fetch-Dest': 'empty',
                'Referer': 'https://chatglm.cn/detail',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                "Authorization":`Bearer ${token}`,
                'Cookie': `chatglm_token=${token};chatglm_token_expires=${getNextMonthDateTime()};chatglm_refresh_token=${cookie}`,
            },
            params: {
                offset: 0,
                size:25
            }
        }
        let result=await axios(config);
        if(result.status==200){
            return result.data.result.results
        }else{
            return []
        }
    }catch(error){
        return false
    }
}

// 生成本次对话的聊天id
const createChatId=async (token,cookie,taskId,message,retryCount,userId)=>{
    if(retryCount>3){
        return false
    }
    try{
        let config = {
            method: "POST",
            baseURL: "https://chatglm.cn/chatglm/backend-api/v1/stream_context",
            headers: {
                'Connection': 'keep-alive',
                'sec-ch-ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=UTF-8',
                'sec-ch-ua-mobile': '?0',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
                'sec-ch-ua-platform': "Windows",
                'Origin': 'https://chatglm.cn',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
               ' Sec-Fetch-Dest': 'empty',
                'Referer': 'https://chatglm.cn/detail',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                "Authorization":`Bearer ${token}`,
                'Cookie': `chatglm_token=${token};chatglm_token_expires=${getNextMonthDateTime()};chatglm_refresh_token=${cookie}`,
            },
            data: {
                "prompt": message,
                "seed": Math.floor(Math.random() * 100000),
                "max_tokens": 512,
                "conversation_task_id": taskId,
                "retry": false,  //此处待定
                "retry_history_task_id": null   //此处待定
            }
        }
        let result=await axios(config);
        if(result.status==200){
            return {context_id:result.data.result.context_id}
        }else{
            return null
        }
    }catch(error){
        retryCount++
        if (error.response?.status === 401) {
            // 刷新 Token...
          let newToken =await refreshGlmToken(cookie)
          if(newToken){
            // 获取newToken成功，将新的newToken存入数据库相应位置
            updateToken(newToken,cookie,userId)
           let {context_id}= await createChatId(newToken,cookie,taskId,message,retryCount)
           if(context_id){
                return {context_id,token:newToken}
           }else{
                return null
           }
          }else{
            return false
          }
    }else{
        return false
    }
    }
}


// 删除聊天窗口
const deleteGLmChat=async (token,cookie,taskId)=>{
    try{
        let config = {
            method: "GET",
            baseURL: `https://chatglm.cn/chatglm/backend-api/v1/conversation/delete/${taskId}`,
            headers: {
                'Accept':'application/json, text/plain, */*',
                'Accept-Encoding':'gzip, deflate, br',
                'Accept-Language':'zh-CN,zh;q=0.9,en;q=0.8',
                'Referer':'https://chatglm.cn/detail',
                'Sec-Ch-Ua':'"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24',
                'Sec-Ch-Ua-Mobile':'?0',
                'Sec-Ch-Ua-Platform':"Windows",
                'Sec-Fetch-Dest':'empty',
                'Sec-Fetch-Mode':'cor',
                'Sec-Fetch-Site':'same-origi',
                'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.3',
                "Authorization":`Bearer ${token}`,
                'Cookie': `chatglm_token=${token};chatglm_token_expires=${getNextMonthDateTime()};chatglm_refresh_token=${cookie}`,
            }
        }
        let result=await axios(config);
        if(result.status==200&&result.data.message=='success'){
            return  true
        }else{
            return null
        }
    }catch(error){
        return false
    }
}

const sleep=(ms)=>{
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 刷新token
const refreshGlmToken=async (cookie)=>{
     // cookie为chatglm_refresh_token
    // token为chatglm_token
    let PPA_CI='19c6593bb4552d8b160574409c8c5c3b'
    try{
        let config = {
            method: "POST",
            baseURL: "https://chatglm.cn/chatglm/backend-api/v1/user/refresh",
            headers: {
                'Accept':'application/json, text/plain, */*',
                'Accept-Encoding':'gzip, deflate, br',
                'Accept-Language':'zh-CN,zh;q=0.9',
                'Authorization':`Bearer ${cookie}`,
                'Content-Type':'application/json;charset=UTF-8',
                'Cookie':`PPA_CI=${PPA_CI}; chatglm_token_expires=${moment().format('YYYY-MM-DD HH:mm:ss')}; chatglm_refresh_token=${cookie}`,
                'Dnt':1,
                'Origin':'https://chatglm.cn',
                'Referer':'https://chatglm.cn/detail',
                'Sec-Ch-Ua':'"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
                'Sec-Ch-Ua-Mobile':'?0',
                'Sec-Ch-Ua-Platform':"Windows",
                'Sec-Fetch-Dest':'empty',
                'Sec-Fetch-Mode':'cors',
                'Sec-Fetch-Site':'same-origin',
                'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36'
            },
            data: {}
        }
        let result=await axios(config);
        if(result.status==200){
            return result.data.result.accessToken
        }else{
            return null
        }
    }catch(error){
        return false
    }
}

const sendGlmMessage=async (options,handleMessage)=>{
    try{
     // cookie为chatglm_refresh_token
    // token为chatglm_token
    let isRefresh=false
    let {token,cookie,taskId,message,userId}=options
    if(!token||!cookie||!message){
      handleMessage('[ERROR]')
      return false
    }
    if(!taskId){
      // 创建聊天窗口
      let retryCount=0
     const taskIdObj =await createChat(token,cookie,message,retryCount,userId)
       if(!taskIdObj){
          handleMessage('[ERROR]')
          return false
       }else{
            taskId=taskIdObj.task_id
            token=taskIdObj.token?taskIdObj.token:token
            isRefresh=taskIdObj.token?true:false
       }
    }
      // 生成本次对话的聊天id
      let retryCount=0
      let contextIdObj=await createChatId(token,cookie,taskId,message,retryCount,userId)
      let contextId=''
      if(!contextIdObj){
          handleMessage('[ERROR]')
          return false
      }else{
            token=contextIdObj.token?contextIdObj.token:token
            contextId=contextIdObj.context_id
            if(!isRefresh){
                isRefresh=contextIdObj.token?true:false
            }
      }
      // 发送聊天消息获取回复
      let config = {
          method: "GET",
          baseURL: "https://chatglm.cn/chatglm/backend-api/v1/stream",
          headers: {
              'Accept-Encoding':'gzip, deflate, br',
              'Accept-Language':'zh-CN,zh;q=0.9,en;q=0.8',
              'Cache-Control':'no-cache',
              'Referer':'https://chatglm.cn/detail',
              'Sec-Ch-Ua':'"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
              'Sec-Ch-Ua-Mobile':'?0',
              'Sec-Ch-Ua-Platform':"Windows",
              'Sec-Fetch-Dest':'empty',
              'Sec-Fetch-Mode':'cors',
              'Sec-Fetch-Site':'same-origin',
              'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
              "Authorization":`Bearer ${token}`,
              'Cookie': `chatglm_token=${token};chatglm_token_expires=${getNextMonthDateTime()};chatglm_refresh_token=${cookie}`,
          },
          params: {
              context_id: contextId,
          },
          responseType: "stream"
      }
      let res=await axios(config);
      res.data.on('data',async(chunk)=>{
          let allstr=chunk.toString();
          console.log(allstr)
          allstr=allstr.split('\n\n')
          console.log(allstr)
          allstr.forEach(str=>{
            if(str=='')return
            if(str.indexOf('event:id')!=-1){
             return
            }
            if(str.indexOf('event:finish')!=-1){
                const resultObj={
                    taskId,
                    isRefresh
                }
                handleMessage(`[DONE]${JSON.stringify(resultObj)}`)
                return
            }
            str=str.replace(/data:/g,'').replace(/event:add/g,'')
           handleMessage(str)
          })
      })

    }catch(error){
        handleMessage('[ERROR]')
        throw error
    }
}

module.exports={
    createChat,getGlmChatList,sendGlmMessage,deleteGLmChat
}