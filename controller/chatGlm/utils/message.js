const axios=require('axios');
const moment=require('moment');
// 获取当前时间一个月后的时间
const getNextMonthDateTime=() =>{
    const nextMonthDateTime = moment().add(1, 'months').format('YYYY-MM-DD HH:mm:ss');
    return nextMonthDateTime;
}
// 新建聊天
const createChat=async (token,cookie,message)=>{
    // cookie为chatglm_refresh_token
    // token为chatglm_token
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
            return result.data.result.task_id
        }else{
            return null
        }
    }catch(error){
        return false
    }
}

// 获取聊天列表
const getChatList=async (token,cookie)=>{
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
const createChatId=async (token,cookie,taskId,message)=>{
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
            return result.data.result.context_id
        }else{
            return null
        }
    }catch(error){
        return false
    }
}

// 发送聊天消息获取回复
const getChatMessage=async (token,cookie,contextId,handleMessage)=>{
    try{
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
            let str=chunk.toString();
            if(str.indexOf('event:id')!=-1){
             return
            }
            if(str.indexOf('event:finish')!=-1){
                handleMessage(`[DONE]`)
                return
            }
            str=str.replace(/data:/g,'').replace(/event:add/g,'')
            handleMessage(str) 
        })
    }catch(error){
        handleMessage('[ERROR]')
        throw error
    }
}
// 删除聊天窗口
const deleteChat=async (token,cookie,taskId)=>{
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

const sendMessage=async (options,handleMessage)=>{
     // cookie为chatglm_refresh_token
    // token为chatglm_token
      let {token,cookie,taskId,message}=options
      if(!token||!cookie||!message){
        handleMessage('[ERROR]')
        return false
      }
      if(!taskId){
        // 创建聊天窗口
       taskId =await createChat(token,cookie,message)
         if(!taskId){
            handleMessage('[ERROR]')
            return false
         }
      }
        // 生成本次对话的聊天id
        let contextId=await createChatId(token,cookie,taskId,message)
        if(!contextId){
            handleMessage('[ERROR]')
            return false
        }
        // 发送聊天消息获取回复
        await getChatMessage(token,cookie,contextId,(data)=>{
            if(data=='[DONE]'){
                data=`[DONE]${taskId}`
            }
            handleMessage(data)
            console.log(data)
        })
}

module.exports={
    createChat,getChatList,sendMessage
}