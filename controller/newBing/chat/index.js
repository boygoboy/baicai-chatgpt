const BingAIClient =require('../utils/message.js')
const {KeyvFile} = require('keyv-file');
const bingUnOfficalChat=async (bingoptions,handleMessage,req)=>{
const {decrypt}=require('../../../utils/encryption.js')
let {userId}=req.user.userList
let { url, token,cookie,  proxyObj, model,enablecontext, message,conversationSignature, conversationId,
    clientId,invocationId,jailbreakConversationId,parentMessageId} = bingoptions

   console.log(bingoptions)
    if(token){
        token=decrypt(token)
    }
    if(cookie){
        cookie=decrypt(cookie)
    }
    const options = {
        // Necessary for some people in different countries, e.g. China (https://cn.bing.com)
        host: url|| 'https://www.bing.com',
        // "_U" cookie from bing.com
        userToken: token||process.env.BING_USER_TOKEN,
        // If the above doesn't work, provide all your cookies as a string instead
        // cookies: process.env.BING_AI_SESSION,
        cookies:cookie|| process.env.BING_AI_COOKIE,
        // A proxy string like "http://<ip>:<port>"
        proxy: proxyObj,
        // (Optional) Set to true to enable `console.debug()` logging
        debug: false,
    };
    const cacheOptions = {
        namespace: model|| process.env.TONE_STYLE||'balanced',
        store: new KeyvFile({ filename: `/chatjson/cache${userId}.json` })
      }
      let bingAIClient = null
      if(model=='Sydney'&&enablecontext){
         bingAIClient = new BingAIClient({...options,cache:cacheOptions});
      }else{
        bingAIClient=new BingAIClient({...options});
      }
    
    let isStart=true
    let chatoptions={
        // (Optional) Set a conversation style for this message (default: 'balanced')
        toneStyle: model|| process.env.TONE_STYLE||'balanced', // or creative, precise, fast
        onProgress: (token) => {
            if(isStart){
                handleMessage('[START]')
                isStart=false
            }
            handleMessage(token)
            process.stdout.write(token);
        },
    }
    if(model=='Sydney'){
        if(!jailbreakConversationId){
            chatoptions.jailbreakConversationId=true
        }else{
            chatoptions.jailbreakConversationId=jailbreakConversationId
        }
        if(parentMessageId){
            chatoptions.parentMessageId=parentMessageId
        }
    }else{
        if(enablecontext){
            chatoptions.conversationSignature= conversationSignature
            chatoptions.conversationId=conversationId
            chatoptions.clientId=clientId
            chatoptions.invocationId=invocationId
        }
    }
    if(!chatoptions.conversationSignature){
        delete chatoptions.conversationSignature
    }
    if(!chatoptions.conversationId){
        delete chatoptions.conversationId
    }
    if(!chatoptions.clientId){
        delete chatoptions.clientId
    }
    if(!chatoptions.invocationId){
        delete chatoptions.invocationId
    }
    let response = await bingAIClient.sendMessage(message, chatoptions);
    handleMessage(`[DONE]${JSON.stringify(response, null, 2)}`)
    console.log(JSON.stringify(response, null, 2)); // {"jailbreakConversationId":false,"conversationId":"...","conversationSignature":"...","clientId":"...","invocationId":1,"messageId":"...","conversationExpiryTime":"2023-03-08T03:20:07.324908Z","response":"Here is a short poem about cats that I wrote: ... I hope you like it. 😊","details":{ /* raw response... */ }}
}
module.exports={
    bingUnOfficalChat
}