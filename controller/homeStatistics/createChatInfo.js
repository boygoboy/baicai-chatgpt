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
    generateData(type,model,userId)
   }
}catch(error){
    throw error
}

}



async function generateData(type,model,userId) {
    // 近30天的日期列表
    const dates = Array.from({length: 30}, (_, i) => moment().subtract(i, 'days').toDate());
    
    const data = dates.flatMap(date => {
        // 每天生成10条数据
        return Array.from({length: 10}, (_, i) => {
            return {
                statisticsId: i + 1,
                userId,
                type: type,
                model: model,
                count: Math.floor(Math.random() * 30) + 1, // 生成1-30的随机数
                date: date
            };
        });
    });

    try {
        await conversationStatistics.insertMany(data);
        console.log('Data inserted successfully');
    } catch (err) {
        console.error(err);
    }
}

module.exports={
    createChatInfo
}