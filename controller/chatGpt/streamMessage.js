const axios = require('axios')
const http = require('http');
const {SocksProxyAgent} = require('socks-proxy-agent');
const httpsProxyAgent = require('https-proxy-agent');
const { match } = require('assert');
const { HttpsProxyAgent } = httpsProxyAgent


// const proxyAgent = new SocksProxyAgent({
//     hostname: 'geo.iproyal.com',
//     port: '42324',
//     username: 'baicai',
//     password: 'baicai666_country-us',
//     protocol: 'socks5',
//   });
  const proxyAgent = new HttpsProxyAgent({
    hostname: 'geo.iproyal.com',
    port: '12321',
    username: 'baicai',
    password:'baicai666_country-us'
  })

    //   获取聊天消息
    function getStreamGptMessage(options ,handleMessage) {
    let {temperature,maxtokens,message}=options
            let config={
                method: "POST",
                baseURL: "https://api.openai.com/v1/chat/completions",
                // baseURL:"https://chatgptproxy.baicai.blog/v1/chat/completions",
                 proxy:{
                   protocol:"http",
                   host: "111.67.197.117",
                   port: "7090",
                 },
                headers:{
                    "Authorization":`Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                     "Accept": "text/event-stream",
                    //  "Transfer-Encoding": "chunked",
                     "Cache-Control": "no-cache",
                     "Connection": "keep-alive",
                    // "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    //  "Access-Control-Allow-Headers": "Content-Type"
                },
                // httpAgent : proxyAgent,
                httpsAgent: proxyAgent,
                data:{
                    "model": "gpt-3.5-turbo",
                    "max_tokens": maxtokens?(maxtokens>=4000?4000:maxtokens):4000,
                    "temperature": temperature || 0.9,
                    "messages": [{role: "user", content: message}],
                     "stream":true
                },
                responseType: "stream"
            }
            let isstart=true
            axios(config).then(res=>{
               res.data.on('data',(chunck)=>{
                if(isstart){
                    handleMessage('[START]')
                    isstart=false
                }
                const lines = chunck.toString().split('\n').filter(line => line.trim() !== '');
                for (const line of lines) {
                    const message = line.replace(/^data: /, '');
                    if (message === '[DONE]') {
                        handleMessage(message)
                        return; 
                    }
                    try {
                            const regex1 = /"content":"(.*?)"}/;
                            const match1 = message.match(regex1);
                            if (match1) {
                                handleMessage(match1[1].replace(/\\"/g,'"'));
                                }
                    } catch(error) {
                        console.error('Could not JSON parse stream message', message, error);
                    }
                }
               })
            }).catch(err=>{
                console.log(err)
                handleMessage('[ERROR]')
               throw err
            })
    }


module.exports={
    getStreamGptMessage
}