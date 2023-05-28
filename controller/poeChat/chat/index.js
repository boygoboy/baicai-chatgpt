const {decrypt}=require('../../../utils/encryption.js')
let modelObj={
    'Claude-instant': 'a2' ,
     'Claude+':'a2_2'  ,
     'GPT-4': 'beaver' ,
     'Sage': 'capybara', 
      'Dragonfly': 'nutria',
      'ChatGPT': 'chinchilla',
      'NeevaAI':'hutia'
}

const resetEnv = () => {
    process.env['poe-formkey']=''
    process.env['buildId']=''
    process.env['capybara_-_Sage_chatId']=''
    process.env['capybara_-_Sage_id']=''
    process.env['beaver_-_GPT-4_chatId']=''
   process.env['beaver_-_GPT-4_id']=''
      process.env['a2_2_-_Claude_2_chatId']=''
   process.env['a2_2_-_Claude_2_id']=''
   process.env['a2_100k_-_Claude-instant-100k_chatId']=''
   process.env['a2_100k_-_Claude-instant-100k_id']=''
   process.env['a2_-_Claude-instant_chatId']=''
   process.env['a2_-_Claude-instant_id']=''
   process.env['chinchilla_-_ChatGPT_chatId']=''
   process.env['chinchilla_-_ChatGPT_id']=''
   process.env['nutria_-_Dragonfly_chatId']=''
   process.env['nutria_-_Dragonfly_id']=''
}

const poeChatMessage=async (opt,handleMessage)=>{
    let {cookie,model,message}=opt
    cookie=decrypt(cookie)
    model=modelObj[model]
    const {BotNickNameEnum, PoeClient, sleep} = await import("poe-node-api")
    const client = new PoeClient({
        debug: false,
        cookie
    })
    resetEnv()
    await client.updateAllBotInfo()
    await client.init()
    resetEnv()
    let isstart=false
  let result=  await client.sendMessage(message, BotNickNameEnum[model], false, (data) => {
      if(!isstart){
        handleMessage('[START]')
        isstart=true
      }
      handleMessage(data)
        console.log(`${data}`)
    })
    console.log(result)
    handleMessage('[DONE]')
}


module.exports={
    poeChatMessage
}