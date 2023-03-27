const axios = require('axios')
const http = require('http');

class ChatGpt {
    constructor(options,message) {
        if (!message) {
            throw new Error('Message is required');
          }
        this.options = options
        this.message=message
    }
    //   获取聊天消息
    getChat3Message(message) {
        console.log(process.env.OPENAI_API_KEY)
        return new Promise((resolve, reject) => {
            let {temperature,maxtokens}=this.options
            let config={
                method: "POST",
                // baseURL: "https://api.openai.com/v1/chat/completions",
                baseURL:"http://89.58.36.180:4500/proxy/v1/chat/completions",
                //  proxy:{
                //    protocol:"http",
                //    host: "111.67.197.117",
                //    port: "7090",
                //  },
                headers:{
                    "Authorization":`Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
                data:{
                    "model": "gpt-3.5-turbo",
                    "max_tokens": maxtokens?(maxtokens>=4000?4000:maxtokens):4000,
                    "temperature": temperature || 0.9,
                    "messages": [{role: "user", content: this.message}],
                },
            }
            axios(config).then(res=>{
                console.log(res.data)
                resolve(res.data)
            }).catch(err=>{
                // console.log(err)
                reject(err)
            })

        })
    }
}

module.exports=ChatGpt