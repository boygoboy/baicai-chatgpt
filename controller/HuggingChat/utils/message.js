const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const huggingchat = async (options, handleMessage) => {
    // 创建新的会话
    const createConversationId = async (cookie) => {
        try {
            let config = {
                method: "POST",
                baseURL: "https://huggingface.co/chat/conversation",
                headers: {
                    "Cookie": cookie,
                    "Content-Type": "application/json",
                    'Origin': 'https://huggingface.co',
                    'Referer': 'https://huggingface.co/chat',
                    'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36`,
                },
                data:{
                        "model": "OpenAssistant/oasst-sft-6-llama-30b-xor"
                }
            }
            let result = await axios(config)
            return result.data.conversationId ? result.data.conversationId : null
        } catch (error) {
            return false
        }
    }

    // 创建会话记录
    const createHistoryChat = async (conversationId, cookie) => {
        try {
            let config = {
                method: "GET",
                baseURL: `https://huggingface.co/chat/conversation/${conversationId}/__data.json`,
                headers: {
                    "Cookie": cookie,
                    "Content-Type": "application/json",
                    'Origin': 'https://huggingface.co',
                    'Referer': 'https://huggingface.co/chat',
                    'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36`,
                },
                params: {
                    'x-sveltekit-invalidated': 1_1
                }
            }
            await axios(config)
        } catch (error) {
            throw error
        }
    }

    if (!options) {
        handleMessage('[ERROR]')
        return
    }
    let { cookie, conversationId, message } = options
    if (!cookie || !message) {
        handleMessage('[ERROR]')
        return
    }
    // 如果没有conversationId,则创建一个  
    createConversationId(cookie)
    if (!conversationId) {
        conversationId = await createConversationId(cookie)
        if (!conversationId) {
            handleMessage('[ERROR]')
            return
        }
    }

    let chatconfig = {
        method: "POST",
        baseURL: `https://huggingface.co/chat/conversation/${conversationId}`,
        headers: {
            "Cookie": cookie,
            "Content-Type": "application/json",
            'Origin': 'https://huggingface.co',
            'Referer': 'https://huggingface.co/chat',
            'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36`,
        },
        data: {
            "inputs": message,
            "parameters": {
                "temperature": 0.9,
                "truncate": 1000,
                "max_new_tokens": 1024,
                "stop": [
                    "</s>"
                ],
                "top_p": 0.95,
                "repetition_penalty": 1.2,
                "top_k": 50,
                "return_full_text": false
            },
            "stream": true,
            "options": {
                "id": uuidv4(),
                "response_id": uuidv4(),
                "is_retry": false,
                "use_cache": false
            }
        },
        responseType: "stream"
    }
    return new Promise((resolve,reject)=>{
        axios(chatconfig).then(res => {
            res.data.on('data', async (chunk) => {
                // let str = chunk.toString().trim()!=""? JSON.parse(chunk.toString().replace('data:', '')):''
                // let message = str.token.text
                let message=''
                let str=chunk.toString()
                console.log(str)
                var match = str.match(/"text":"(.*?)","logprob"/);
                if (match) {
                    message = match[1];
                }
                if (message == '</s>') {
                    handleMessage(`[DONE]${conversationId}`)
                    // 执行完生成会话记录
                    createHistoryChat(conversationId, cookie)
                    return resolve({conversationId:conversationId})
                } else {
                    handleMessage(message)
                }
            })
        }).catch(error=>{
            reject(error)
        })
    })
}

module.exports = {
    huggingchat
}