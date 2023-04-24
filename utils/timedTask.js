const mongoose = require('mongoose');
const chatparam = require('../db/models/chatParmSchema')
const gptAccount = require('../db/models/gptAccountSchema')
const {computedMoney,unfficalChatApiLive} =require('../controller/chatGpt/utils/gptCommon')
let intervalInstance = null;
let updateGptAccountInstance = null;
const intervalTime = 1000 * 60 * 3; // 1 minutes
async function updateApikeyCount() {
 const apikeyUsedInfo = {};
  try {
    // 检查集合是否存在
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some((collection) => collection.name === 'chatparam');

    if (!collectionExists) {
      console.log('chatparam collection does not exist. Skipping count update.');
      return;
    }

    const aggregation = await chatparam.aggregate([
      { $unwind: '$key' },
      { $match: { key: { $exists: true } } },
      { $group: { _id: '$key', count: { $sum: 1 } } },
    ]);

    aggregation.forEach(({ _id, count }) => {
        apikeyUsedInfo[_id] = count;
    });


    // 将统计的apikey被使用数量更新到gptaccount表中
    for (const [apikey, usedCount] of Object.entries(apikeyUsedInfo)) {
        await updateUsedCount(apikey, usedCount);
    }

    console.log('Updated API key count:', JSON.stringify(apikeyUsedInfo));
  } catch (error) {
    console.error('Error fetching API key count:', error);
  }
}

// 将被使用的apikey的数量更新到gptaccount表中
async function updateUsedCount(apikey, usedCount) {
  try {
    // 检查集合是否存在
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some((collection) => collection.name === 'gptaccount');

    if (!collectionExists) {
      console.log('GptAccount collection does not exist. Skipping update.');
      return;
    }

    const result = await gptAccount.findOneAndUpdate(
      { $or: [{ accesstoken: apikey }, { apikey: apikey }] },
      { usedcount: usedCount },
      { new: true }
    );

    if (result) {
      console.log('Updated usedcount:', result);
    } else {
      console.log('No matching document found.');
    }
  } catch (error) {
    console.error('Error updating usedcount:', error);
  }
}

// 定时更新gptaccount账号表中账号的状态，是启用、禁用、警告：表中有一个apikey或者accesstoken不能使用了、失效：表中一个账号下所有的apikey和accesstoken都不能使用了
//表中每个账号的apikey总额度，已使用额度，剩余额度的情况
const updateGptAccountStatus =async ()=>{
    try {
        // 检查集合是否存在
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionExists = collections.some((collection) => collection.name === 'gptaccount');
    
        if (!collectionExists) {
          console.log('GptAccount collection does not exist. Skipping update.');
          return;
        }
    
        const records = await gptAccount.find({});
    
        const updatedRecords = records.map(async(record) => {
            // 此处需要掉用查询apikey费用查询接口，获取apikey的总额度，已使用额度，剩余额度的情况
          // 根据需要修改字段
          let apikeystatus=true
          let accesstokenstatus=true
          if(record.apikey){
           let usageresult= await computedMoney()
           if(usageresult==false){
            apikeystatus=false
           }else{
            let {total,total_usage,remain_money,history_usage}=usageresult
            record.quota = total
            record.consumption = total_usage
            record.balance = remain_money
            record.history_usage = history_usage
            if(remain_money<0.5){
                apikeystatus=false
            }
           }
          }else{
            record.quota = 0
            record.consumption = 0
            record.balance = 0
            record.history_usage = []
          }
          if(record.accesstoken){
            let accesstokenresult= await unfficalChatApiLive(record.accesstoken)
            if(accesstokenresult==false){
              accesstokenstatus=false
            }
          }
        //   根据上面计算结果，判断账号的状态
           if(apikeystatus==false&&accesstokenstatus==false){
            record.accountstatus = '失效'
           }
           if(apikeystatus==true&&accesstokenstatus==true){
            record.accountstatus = '启用'
           }
           if(apikeystatus==false&&accesstokenstatus==true){
            record.accountstatus = '警告（apikey失效）'
           }
           if(apikeystatus==true&&accesstokenstatus==false){
            record.accountstatus = '警告（accesstoken失效）'
           }
      
          return record.save();
        });
    
        await Promise.all(updatedRecords);
    
        console.log('Updated all records in the GptAccounts collection.');
      } catch (error) {
        console.error('Error updating records:', error);
      }
}


// 定时更新apikey被使用情况
const  updateAccountStatus= async ()=>{
    if(intervalInstance){
        clearInterval(intervalInstance);
    }
   intervalInstance= setInterval(()=>{
        updateApikeyCount();
    }, intervalTime);
}
// 单独更新apikey被使用情况
const updateAccountStatusOnce= async ()=>{
    updateApikeyCount();
}

// 更新gptaccount账号表中的信息
const updateGptAccountStatusOnce= async ()=>{
    updateGptAccountStatus()
}

// 定时更新gptaccount账号表中的信息
const loopupdateGptAccountStatus= async ()=>{
    if(updateGptAccountInstance){
        clearInterval(updateGptAccountInstance);
    }
    updateGptAccountInstance= setInterval(()=>{
        updateGptAccountStatus()
    }, intervalTime);
}



module.exports={
    updateAccountStatus,updateAccountStatusOnce,updateGptAccountStatusOnce,loopupdateGptAccountStatus
}


