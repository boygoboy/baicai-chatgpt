const {sendGlmMessage}=require('../utils/message')
const {decrypt}=require('../../../utils/encryption.js')


const chatGlmMessage=async (option,handleMessage)=>{
    let {token,cookie,taskId,message,enablecontext,userId}=option
    if(!token||!cookie||!message){
        handleMessage('[ERROR]')
        return
    }
     if(!enablecontext){
        taskId=''
     }
    token=decrypt(token)
    cookie=decrypt(cookie)
    token=token
    let opt={
        token,
        cookie,
        taskId,
        message,
        userId
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