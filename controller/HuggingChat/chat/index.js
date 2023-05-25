const {huggingchat}=require('../utils/message.js')
const {decrypt}=require('../../../utils/encryption.js')
const huggingChat=async(options,handleMessage)=>{
     options.cookie=decrypt(options.cookie)
    let {enablecontext}=options
    if(!enablecontext){
        options.conversationId=null
    }
    try{
        let isStart=false
        let result=await huggingchat(options,(data)=>{
            if(!isStart){
                isStart=true
                handleMessage('[START]')
            }
             handleMessage(data) 
        })
    }catch(error){
        throw error
    }
}

module.exports={
    huggingChat
}