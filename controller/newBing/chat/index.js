const BingAIClient =require('../utils/message.js')
const {KeyvFile} = require('keyv-file');
const bingUnOfficalChat=async (bingoptions,handleMessage)=>{

let { url, key,  proxytype, proxyurl,  message,conversationSignature, conversationId,
    clientId,invocationId,jailbreakConversationId,parentMessageId} = bingoptions
    console.log(jailbreakConversationId,parentMessageId)
    const options = {
        // Necessary for some people in different countries, e.g. China (https://cn.bing.com)
        host: url|| 'https://www.bing.com',
        // "_U" cookie from bing.com
        userToken: key||process.env.BING_USER_TOKEN,
        // If the above doesn't work, provide all your cookies as a string instead
        // cookies: process.env.BING_AI_SESSION,
        cookies: process.env.BING_AI_COOKIE,
        // A proxy string like "http://<ip>:<port>"
        proxy: `${proxytype}:${proxyurl}`,
        // (Optional) Set to true to enable `console.debug()` logging
        debug: false,
    };
    if(!proxytype){
        delete options.proxy
    }
    const cacheOptions = {
        namespace: process.env.TONE_STYLE||'balanced',
        store: new KeyvFile({ filename: 'cache.json' })
      }
    let bingAIClient = new BingAIClient({...options,cache:cacheOptions});
    let isStart=true
    let chatoptions={
        // (Optional) Set a conversation style for this message (default: 'balanced')
        toneStyle: process.env.TONE_STYLE||'balanced', // or creative, precise, fast
        // jailbreakConversationId: true,
        // jailbreakConversationId: jailbreakConversationId?jailbreakConversationId:null,
        // parentMessageId: parentMessageId?parentMessageId:null,
        // conversationSignature: conversationSignature,
        // conversationId: conversationId,
        // clientId: clientId,
        // invocationId:invocationId, 
        onProgress: (token) => {
            if(isStart){
                handleMessage('[START]')
                isStart=false
            }
            handleMessage(token)
            process.stdout.write(token);
        },
    }
    if(!jailbreakConversationId){
        chatoptions.jailbreakConversationId=true
    }else{
        chatoptions.jailbreakConversationId=jailbreakConversationId
    }
    if(parentMessageId){
        chatoptions.parentMessageId=parentMessageId
    }
    // if(!conversationSignature){
    //     delete chatoptions.conversationSignature
    // }
    // if(!conversationId){
    //     delete chatoptions.conversationId
    // }
    // if(!clientId){
    //     delete chatoptions.clientId
    // }
    // if(!invocationId){
    //     delete chatoptions.invocationId
    // }

    let response = await bingAIClient.sendMessage(message, chatoptions);
    handleMessage(`[DONE]${JSON.stringify(response, null, 2)}`)
    console.log(JSON.stringify(response, null, 2)); // {"jailbreakConversationId":false,"conversationId":"...","conversationSignature":"...","clientId":"...","invocationId":1,"messageId":"...","conversationExpiryTime":"2023-03-08T03:20:07.324908Z","response":"Here is a short poem about cats that I wrote: ... I hope you like it. 😊","details":{ /* raw response... */ }}
}
module.exports={
    bingUnOfficalChat
}