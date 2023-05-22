const {decrypt}=require('../../utils/encryption.js')
let AuthenticatorInstance={}
const claudeUnofficalChat = async (options,handleMessage) => {
  try{
    const module = await import('claude-api');
    let {token,appid,message,userId,conversationId,channelId}=options
    token = decrypt(token)
    appid = decrypt(appid)
    const Authenticator = module.default;
    token = token
    // claude appid
    let bot = appid
   let  text = message
   let authenticator=null
   if(!channelId){
    authenticator = new Authenticator(token, bot)
   }

  // 创建一个频道，已存在则直接返回频道ID
  let  channel = ''
  if(channelId){
    channel=channelId
    authenticator=AuthenticatorInstance[channel]
  }else{
    channel= await authenticator.newChannel(`chat-${userId}`)
    AuthenticatorInstance[channel]=authenticator
  }
  let isStart=false
  let chatoptions = {
    text, channel, onMessage: (data) => {
      if(!isStart){
        isStart=true
        handleMessage('[START]')
      }
      handleMessage(data.text)
    }
  }
  if(conversationId){
    chatoptions.conversationId=conversationId
  }

  let result = await authenticator.sendMessage(chatoptions)
  handleMessage(`[DONE]${JSON.stringify(result)}`)
  console.log('==============1\n', result)
  }catch(error){
   handleMessage(`[ERROR]`)
   throw error
  }
}


module.exports = {
    claudeUnofficalChat
}