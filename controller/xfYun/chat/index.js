
const {sendMessage}=require('../utils/message')
const {decrypt}=require('../../../utils/encryption.js')
const generateFD=()=> {
    const ms = String(+new Date())
    return ms.substring(ms.length - 6)
  }

const xfyunChat=async(opt,handleMessage)=>{
    let {cookie,userId,GtToken,message,conversationId,enablecontext}=opt
    if(!enablecontext){
        conversationId=''
    }

    cookie=decrypt(cookie)
    let options={
        fd:generateFD(),
        chatId:conversationId,
        message:message,
        GtToken:GtToken,
        cookie:cookie,
    }
    let isStart=false
    let result=await sendMessage(options,(data)=>{
        if(!isStart){
            isStart=true
            handleMessage('[START]')
        }
        handleMessage(data)
        console.log(data)
    })
}


module.exports={
    xfyunChat
}