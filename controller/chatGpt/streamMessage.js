const axios = require('axios')
const http = require('http');
const { SocksProxyAgent } = require('socks-proxy-agent');
const httpsProxyAgent = require('https-proxy-agent');
const { HttpsProxyAgent } = httpsProxyAgent
const { handlePrompt } = require('../../utils/chatgptTool')

//   获取聊天消息
function getStreamGptMessage(options, handleMessage) {
    let proxyAgent = null
    let { url, key, model, proxytype, proxyurl, modelParams, message } = options
    const proxyData = proxyurl.split(":")
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
            "Authorization": `Bearer ${key[0] || process.env.OPENAI_API_KEY}`,
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


module.exports = {
    getStreamGptMessage
}