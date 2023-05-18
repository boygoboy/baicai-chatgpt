const requestCount= require('../../../db/models/chatgpt/interfaceRate/requestCountSchema')
const interfacerate= require('../../../db/models/chatgpt/interfaceRateSchema')

const limitRequestCount=async (req,params)=>{
    let { type,model} = params
    let {userId,roleNames}=req.user.userList
    let roleId=roleNames[0]
    try{
        // 获取用户的接口速率限制配置
        const rateConfig = await interfacerate.findOne({ roleId, type, model });
        if (!rateConfig) {
          console.error('未找到接口速率限制配置');
          return false;
        }
        const requestcount= await requestCount.findOne({ userId, type, model });
        let requestResult=null
        if (!requestcount) {
            requestResult = await new requestCount({ userId, type, model });
        }else{
            requestResult=requestcount
        }
        // 获取当前时间
        const now = Date.now();
        // 检查是否需要重置消息计数
        let interval = rateConfig.unit=='分钟'?1000*60:1000*60*60;
        if (now - requestResult.resetTime > rateConfig.cycle * interval) {
            requestResult.messageCount = 0;
            requestResult.resetTime = now;
        }
    
        // 检查消息计数是否超过限制
        if (requestResult.messageCount >= rateConfig.count) {
          console.error('客户端消息数量超过限制');
            return false;
        } else {
            requestResult.messageCount++;
          await requestResult.save();
            return true
        }
    }catch(error){
       throw error
    }
}

module.exports={
    limitRequestCount
}