const axios = require('axios')
const http = require('http');
const { SocksProxyAgent } = require('socks-proxy-agent');
const httpsProxyAgent = require('https-proxy-agent');
const { HttpsProxyAgent } = httpsProxyAgent
const { handlePrompt } = require('../../utils/chatgptTool')
const { v4: uuidv4 } = require('uuid');
const {createParser} = require('eventsource-parser');
const {decrypt}=require('../../utils/encryption')


//   获取聊天消息
function getStreamGptMessage(options, handleMessage) {
    let proxyAgent = null
    let { url, key, model,proxyObj, modelParams, message } = options
    key=decrypt(key)
    let proxyData = []
    let proxytype=''
    if(proxyObj&&proxyObj.proxytype){
        proxytype=proxyObj.proxytype
        proxyData=[proxyObj.ip,proxyObj.port,proxyObj.username,proxyObj.password]
    }
    if (proxytype == "socks5" && proxyData.length >= 2) {
        proxyAgent = new SocksProxyAgent({
            hostname: proxyData[0],
            port: proxyData[1],
            username: proxyData[2] ? proxyData[2] : "",
            password: proxyData[3] ? proxyData[3] : "",
            protocol: 'socks5',
        });
    }
    if ((proxytype == "https") && proxyData.length >= 2) {
        proxyAgent = new HttpsProxyAgent({
            hostname: proxyData[0],
            port: proxyData[1],
            username: proxyData[2] ? proxyData[2] : "",
            password: proxyData[3] ? proxyData[3] : "",
        })
    }
    let gptParams = {}
    modelParams.forEach(item => {
        gptParams[item.parameter] = item.value
    })
    gptParams.stream = gptParams.stream == 1 ? true : false
    let config = {
        method: "POST",
        baseURL: url || "https://api.openai.com/v1/chat/completions",
        // baseURL:"http://154.23.248.79:81/v1/chat/completions",
        //  proxy:{
        //    protocol:"http",
        //    host: "111.67.197.117",
        //    port: "7090",
        //  },
        headers: {
            "Authorization": `Bearer ${key || process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
            "Accept": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
        data: {
            "model": model || "gpt-3.5-turbo",
            // "messages": message,
            ...gptParams
        },
        responseType: "stream"
    }
    if (proxytype == "socks5" || proxytype == "https") {
        config.httpsAgent = proxyAgent
    }
    if (proxytype == "http"&&proxyData.length >= 2) {
        // config.httpAgent = proxyAgent
                config.proxy={
              protocol:"http",
              host: proxyData[0],
              port: proxyData[1],
              username:proxyData[2] ? proxyData[2] : "",
              password:proxyData[3] ? proxyData[3] : "",
         }
    }
    if(model=="gpt-3.5-turbo"||model=="gpt-3.5-turbo-0301"){
        config.data.messages=message
    }
    if(model=="text-davinci-003"){
        config.data.prompt=handlePrompt(message)
    }
    let isstart = true
    axios(config).then(res => {
        res.data.on('data', (chunck) => {
            if (isstart) {
                handleMessage('[START]')
                isstart = false
            }
            const lines = chunck.toString().split('\n').filter(line => line.trim() !== '');
            for (const line of lines) {
                console.log(line)
                if(model=="gpt-3.5-turbo"||model=="gpt-3.5-turbo-0301"){
                    const message = line.replace(/^data: /, '');
                    if (message === '[DONE]') {
                        handleMessage(message)
                        return;
                    }
                    try {
                        const regex1 = /"content":"(.*?)"}/;
                        const match1 = message.match(regex1);
                        if (match1) {
                            handleMessage(match1[1].replace(/\\"/g, '"'));
                            if (gptParams.stream == false) {
                                handleMessage('[DONE]')
                            }
                        }
                    } catch (error) {
                        console.error('Could not JSON parse stream message', message, error);
                    }
                }

                if(model=='text-davinci-003'){
                    const message = line.replace(/^data: /, '');
                    if (message === '[DONE]') {
                        handleMessage(message)
                        return;
                    }
                    try{
                        const regex=/"choices":\[{"text":"(.*?)","index"/
                        const match = message.match(regex);
                        if(match){
                            handleMessage(match[1].replace(/\\"/g, '"'));
                            if (gptParams.stream == false) {
                                handleMessage('[DONE]')
                            }
                        }
                    }catch(error){
                        console.error('Could not JSON parse stream message', message, error);
                    }
                }
            }
        })
    }).catch(err => {
        console.log(err)
        handleMessage('[ERROR]')
        throw err
    })
}

  function unOfficalChat(options,params,handleMessage){
    let isstart=true
    let contextObj={
        parentMessageId:null,
        conversationId:null
    }
    let {url,key,model}=params
    let conversationResponse=null
    const onMessage=(data) =>{
        if (data === '[DONE]') {
           handleMessage('[DONE]'+JSON.stringify(contextObj))
        }
        try {
          const _checkJson = JSON.parse(data)
        } catch (error) {
          console.log('warning: parse error.')
          return
        }
        try {
          const convoResponseEvent = JSON.parse(data)
          conversationResponse = convoResponseEvent
          if (convoResponseEvent.conversation_id) {
            contextObj.conversationId = convoResponseEvent.conversation_id
          }

          if (convoResponseEvent.message.id) {
           contextObj.parentMessageId = convoResponseEvent.message.id
          }

          const partialResponse =
              convoResponseEvent.message.content.parts[0]
          if (partialResponse) {
            response = partialResponse
            handleMessage(response)
          }
        } catch (err) {
          console.warn('fetchSSE onMessage unexpected error', err)
        }
      }


    let {
        conversationId,
        parentMessageId,
        messageId ,
        action = 'next',
        prompt="hello"
      } = options
      conversationId=conversationId?conversationId:null
      parentMessageId=parentMessageId?parentMessageId:uuidv4()
        messageId=messageId?messageId:uuidv4()
        action=action?action:'next'
        prompt=prompt?prompt:'hello'
      let config = {
        method: "POST",
        baseURL: url|| "http://154.23.248.79:3020/backend-api/conversation",
        headers: {
            accept: 'text/event-stream',
            'x-openai-assistant-app-id': '',
            authorization: `Bearer ${key||process.env.OPENAI_ACCESS_TOKEN}`,
            'content-type': 'application/json',
            referer: 'https://chat.openai.com/chat',
            library: 'chatgpt-plugin'
        },
        referrer: 'https://chat.openai.com/chat',
        data: {
            action,
            messages: [
              {
                id: messageId,
                role: 'user',
                content: {
                  content_type: 'text',
                  parts: [prompt]
                }
              }
            ],
            // model: (key||process.env.ENABLE_GPT4) ? 'gpt-4' : 'text-davinci-002-render-sha',
            model: model,
            parent_message_id: parentMessageId,
            conversation_id: conversationId?conversationId:null,
          },
        responseType: "stream"
    }


    const parser = createParser((event) => {
        if (event.type === 'event') {
          onMessage(event.data)
        }
      })

      axios(config).then(res=>{
        res.data.on('data', (chunck) => {
            if(isstart){
                handleMessage('[START]')
                isstart=false
            }
            let str = chunck.toString()
            parser.feed(str)
        })

      }).catch(error=>{
        console.log(error)
        throw error
      })

}



module.exports = {
    getStreamGptMessage,unOfficalChat
}