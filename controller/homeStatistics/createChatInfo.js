const conversationStatistics=require('../../db/models/chatgpt/conversationStatisticsSchema');
const interfacePrice=require('../../db/models/chatgpt/interfacePriceSchema');
const Counter = require('../../db/models/counterSchema')
const moment = require('moment');

const createChatInfo=async (req,type,model)=>{
let {roleNames,userId}=req.user.userList
let roleId=roleNames[0]

try{
   let result =await interfacePrice.findOne({roleId,type,model})
   if(result){
    // 创建一条对话信息保存到数据库
        //这一步运行一次就可以注释掉，自增需要有个初始值
        const countresult = await Counter.findOne({ id: "statisticsId" })
        if (!countresult) {
            await Counter.create({
                "id": "statisticsId",
                "sequence_value": 0
            })
        }
        const countnum = await Counter.findOneAndUpdate({ id: 'statisticsId' }, { $inc: { sequence_value: 1 } }, { new: true })
        const conversation = await new conversationStatistics({
        statisticsId: countnum.sequence_value,
        userId,
        type,
        model,
        count:result.count,
        date:new Date()
    })
    await conversation.save()
   }
}catch(error){
    throw error
}

}


module.exports={
    createChatInfo
}