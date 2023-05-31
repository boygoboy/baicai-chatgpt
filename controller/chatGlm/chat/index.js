const {sendGlmMessage}=require('../utils/message')
const {decrypt}=require('../../../utils/encryption.js')


const chatGlmMessage=async (option,handleMessage)=>{
    let {token,cookie,taskId,message,enablecontext}=option
    if(!token||!cookie||!message){
        handleMessage('[ERROR]')
        return
    }
     if(!enablecontext){
        taskId=''
     }
    token=decrypt(token)
    cookie=decrypt(cookie)
    let opt={
        token,
        cookie,
        taskId,
        message
    }
    let isstart=false
    sendGlmMessage(opt,(data)=>{
        if(!isstart){
            handleMessage('[START]')
            isstart=true
        }
        handleMessage(data)
    })

}

module.exports={
    chatGlmMessage
}