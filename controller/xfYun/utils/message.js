const axios = require('axios');
let retryCount=0
// 创建新的聊天窗口
const createNewChat = async (cookie) => {
    try {
        let config = {
            method: "POST",
            baseURL: "https://xinghuo.xfyun.cn/iflygpt/u/chat-list/v1/create-chat-list",
            headers: {
                'Host': 'xinghuo.xfyun.cn',
                'Connection': 'keep-alive',
                'Content-Length': 2,
                'sec-ch-ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'sec-ch-ua-mobile': '?0',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
                'sec-ch-ua-platform': "Windows",
                'Origin': 'https://xinghuo.xfyun.cn',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://xinghuo.xfyun.cn/desk',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'Cookie': cookie,
            },
            data: {

            }
        }
        let result = await axios(config)
        if (result.status == 200) {
            // 返回本次会话id
            return result.data.data.id
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

// 重命名聊天名称
const renameChat = async (cookie, chatListId, chatListName) => {
    try {
        let config = {
            method: "POST",
            baseURL: "https://xinghuo.xfyun.cn/iflygpt/u/chat-list/v1/rename-chat-list",
            headers: {
                'Host': 'xinghuo.xfyun.cn',
                'Connection': 'keep-alive',
                'sec-ch-ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'sec-ch-ua-mobile': '?0',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
                'sec-ch-ua-platform': "Windows",
                'Origin': 'https://xinghuo.xfyun.cn',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://xinghuo.xfyun.cn/desk',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'Cookie': cookie,
            },
            data: {
                "chatListId": chatListId,
                "chatListName": chatListName
            }
        }
        let result = await axios(config)
        if (result.status == 200) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}
// 消息解码
const decode=(text)=>{
    return Buffer.from(text, 'base64').toString('utf8');
}

// 聊天完成保存聊天记录
const saveChatRecord = async (cookie, text) => {
    try{
        let config = {
            method: "POST",
            baseURL: "https://xinghuo.xfyun.cn/iflygpt/u/chat-list/v1/create-chat-list",
            headers: {
                'Host': 'xinghuo.xfyun.cn',
                'Connection': 'keep-alive',
                'sec-ch-ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryhOqL1xcQ9ljCufA3',
                'X-Requested-With': 'XMLHttpRequest',
                'sec-ch-ua-mobile': '?0',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
                'sec-ch-ua-platform': "Windows",
                'Origin': 'https://xinghuo.xfyun.cn',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
               ' Sec-Fetch-Dest': 'empty',
                'Referer': 'https://xinghuo.xfyun.cn/desk',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'Cookie': cookie,
            },
            data: {
                text
            }
        }
        let result = await axios(config)
        if (result.status == 200) {
            return true
        }else{
            return false
        }
    }catch(error){
        return false
    }
}

// 发送消息
const sendMessage = async (options,handleMessage) => {
    if(!options){
      handleMessage('[ERROR]')
      return
    }
    let {fd,chatId,message,GtToken,cookie,Validate,Seccode,Challenge}=options
      if(!fd||!message||!GtToken||!cookie){
        handleMessage('[ERROR]')
        return
      }
      if(!chatId){
        chatId=await createNewChat(cookie)
        if(!chatId){
          handleMessage('[ERROR]')
          return
        }else{
            // 重命名聊天名称
            let renameResult=await renameChat(cookie,chatId,message)
            if(!renameResult){
                handleMessage('[ERROR]')
                return
            }
        }
      }
    try{
        const data={
            fd,
            isBot:0,
            chatId,
            text:message,
            GtToken,
            clientType:1
        }
        let config = {
            method: "POST",
            baseURL: "https://xinghuo.xfyun.cn/iflygpt-chat/u/chat_message/chat",
            headers: {
                'Host': 'xinghuo.xfyun.cn',
                'Connection': 'keep-alive',
                'sec-ch-ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
                'sec-ch-ua-mobile': '?0',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
                'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryS5MhaEB85MJzYmwo',
                'sec-ch-ua-platform': "Windows",
                'Origin': 'https://xinghuo.xfyun.cn',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://xinghuo.xfyun.cn/desk',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'Cookie': cookie,
                // 'Validate':'b3c50849f3dfcac30290e02a5946f7ee',
                // 'Seccode':'YjNjNTA4NDlmM2RmY2FjMzAyOTBlMDJhNTk0NmY3ZWV8am9yZGFu',
                // 'Challenge':'d855489e9a385d5ff6f6bbaa15a28dc9el'
            },
            data: data,
            responseType: "stream"
        }
        if(Seccode&&Validate&&Challenge){
            config.headers['Seccode']=Seccode
            config.headers['Validate']=Validate
            config.headers['Challenge']=Challenge
        }
        let res = await axios(config)
        let isOver=false
        let chatcontent=''
        res.data.on('data', async(chunk) => {
            if(isOver){
                return
            }
            let encoded_data = chunk.toString().replace(/data:/g,"");
            console.log('------------------')
            console.log(encoded_data)
            if(encoded_data.includes('当前请求已被拦截，请完成验证后重试')){
                isOver=true
                handleMessage('[VERIFY]')
                return
            }
            console.log('------------------')
            // 如果聊天id失效或者错误则新建聊天窗口
            if(encoded_data.startsWith('[belongerr]')){
                if(retryCount>2){
                    isOver=true
                    handleMessage('[ERROR]')
                    retryCount=0
                    return
                }
                retryCount++
                console.log('聊天id失效或者错误')
                options.chatId=''
                // 失效重新新建窗口发送消息需要延迟发送，否则接口会返回访问过快错误
                setTimeout(()=>{sendMessage(options,handleMessage)},5000)
                return
            }
            let missing_padding = encoded_data.length % 4;
            if (missing_padding !== 0) {
                encoded_data += '='.repeat(4 - missing_padding);
            }
            let answer = decode(encoded_data);
             if(answer.startsWith('zw')){
                isOver=true
                handleMessage(`[DONE]${chatId}`)
                // 调用聊天完成保存接口
                 console.log(chatcontent)
                let saveResult=await saveChatRecord(cookie,chatcontent)
                if(!saveResult){
                    console.log('保存聊天记录失败')
                }else{
                    console.log('保存聊天记录成功')
                }
                return
             }
                answer = answer.replace('\n\n', '\n');
                chatcontent+=answer
                handleMessage(answer)
        });
        return res
    }catch(error){
        handleMessage('[ERROR]')
        return false
    }
}

// 生成gtToken
const getGtToken = async (req,res) => {
    try{
        let config = {
            method: "GET",
            baseURL: "https://riskct.geetest.com/g2/api/v1/pre_load?client_type=web",
            headers: {
                'Host': 'riskct.geetest.com',
                'Connection': 'keep-alive',
                'sec-ch-ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
                'sec-ch-ua-mobile': '?0',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
                'sec-ch-ua-platform': "Windows",
                'Sec-Fetch-Site': 'cross-site',
                'Sec-Fetch-Mode': 'no-cors',
                'Sec-Fetch-Dest': 'script',
                'Referer': 'https://xinghuo.xfyun.cn/',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            }
        }
        let result = await axios(config)
        console.log(result.data)
        const configData = JSON.parse(result.data.slice(1, -1));
        return res.json({
            errorCode:'0000',
            message:'success',
            data:configData
        })
    }catch(error){
        console.log(error)
        return res.json({
            errorCode:'500',
            message:'系统异常',
            data:null
        })
    }
}

// 获取聊天列表
const getChatList = async (cookie) => {
    try {
        let config = {
            method: "GET",
            baseURL: "https://xinghuo.xfyun.cn/iflygpt/u/chat-list/v1/chat-list?isBot=false",
            headers: {
                'Host': 'xinghuo.xfyun.cn',
                'Connection': 'keep-alive',
                'sec-ch-ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'sec-ch-ua-mobile': '?0',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
                'sec-ch-ua-platform': "Windows",
                'Origin': 'https://xinghuo.xfyun.cn',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://xinghuo.xfyun.cn/desk',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'Cookie': cookie,
            },
        }
        let result = await axios(config)
        if (result.status == 200) {
            return result.data.data
        } else {
            return []
        }
    } catch (error) {
        return false
    }
}


//删除聊天列表
const deleteChatList = async (cookie,chatId) => {
    try {
        let config = {
            method: "POST",
            baseURL: "https://xinghuo.xfyun.cn/iflygpt/u/chat-list/v1/del-chat-list",
            headers: {
                'Host': 'xinghuo.xfyun.cn',
                'Connection': 'keep-alive',
                'sec-ch-ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'sec-ch-ua-mobile': '?0',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
                'sec-ch-ua-platform': "Windows",
                'Origin': 'https://xinghuo.xfyun.cn',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://xinghuo.xfyun.cn/desk',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'Cookie': cookie,
            },
            data:{
                "chatListId": chatId
            }
        }
        let result = await axios(config)
        if (result.status == 200) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
} 

module.exports = {
    sendMessage,getGtToken,getChatList,deleteChatList
}