const mongoose = require('mongoose');
const keylist = require('../db/models/chatgpt/keyListSchema')
const tokenlist=require('../db/models/chatgpt/tokenListSchema')
const binglist=require('../db/models/chatgpt/bingListSchema')
const keyoffical=require('../db/models/chatgpt/keyOfficalSchema')
const keyunoffical=require('../db/models/chatgpt/keyUnOfficalSchema')
const {computedMoney,unfficalChatApiLive,sessionIsLive,newBingIsLive} =require('../controller/chatGpt/utils/gptCommon');
let intervalInstance = null;
let updateGptAccountInstance = null;
let updateTokenInstance = null;
let updateTokenAndSessionInstance=null;
let updateBingUsedCountInstance=null;
let updateBingStatusInstance=null;
const intervalTime = 1000 * 60 * 60; // 3 minutes
async function updateApikeyCount() {
 const apikeyUsedInfo = {};
 const apikey4UsedInfo = {};
  try {
    // 检查集合是否存在
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some((collection) => collection.name === 'keyOfficalSchema');

    if (!collectionExists) {
      console.log('keyOfficalSchema collection does not exist. Skipping count update.');
      return;
    }
   
    const collectionExists1 = collections.some((collection) => collection.name === 'keyListSchema');

    if (!collectionExists1) {
      console.log('keyListSchema collection does not exist. Skipping update.');
      return;
    }


    await keylist.updateMany({}, { $set: { usedcount: 0 } });

    const aggregation = await keyoffical.aggregate([
      { $match: { chatgpt3Key: { $exists: true ,$ne: ''} } },
      { $group: { _id: '$chatgpt3Key', count: { $sum: 1 } } },
    ]);

    aggregation.forEach(({ _id, count }) => {
        apikeyUsedInfo[_id] = count;
    });


    // 将统计的apikey被使用数量更新到keyList表中
    for (const [api3key, usedCount] of Object.entries(apikeyUsedInfo)) {
        await updateUsedCount(api3key, usedCount);
    }


    // 更新api4key的被使用数量
    const aggregation4 = await keyoffical.aggregate([
        { $match: { chatgpt4Key: { $exists: true ,$ne: ''} } },
        { $group: { _id: '$chatgpt4Key', count: { $sum: 1 } } },
    ])

    aggregation4.forEach(({ _id, count }) => {
      apikey4UsedInfo[_id] = count;
    })
    // 将统计的api4key被使用数量更新到keyList表中
    for (const [api4key, usedCount] of Object.entries(apikey4UsedInfo)) {
      await updateUsedCount(api4key, usedCount);
    }

    console.log('Updated API key count:', JSON.stringify(apikeyUsedInfo));
  } catch (error) {
    console.error('Error fetching API key count:', error);
  }
}

// 将被使用的apikey的数量更新到keylist表中
async function updateUsedCount(apikey, usedCount) {
  try {
    // 检查集合是否存在
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some((collection) => collection.name === 'keyListSchema');

    if (!collectionExists) {
      console.log('keyListSchema collection does not exist. Skipping update.');
      return;
    }

    const result = await keylist.findOneAndUpdate(
      { key: apikey},
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
// 将token数量更新到tokenlist表中
async function updateTokenUsedCount(token, usedCount) {
  try {
    // 检查集合是否存在
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some((collection) => collection.name === 'tokenListSchema');

    if (!collectionExists) {
      console.log('tokenListSchema collection does not exist. Skipping update.');
      return;
    }

    const result = await tokenlist.findOneAndUpdate(
      { token: token},
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

// 将bing token数量更新到binglist表中
async function updateBingTokenUsedCount(token, usedCount) {
  try {
    // 检查集合是否存在
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some((collection) => collection.name === 'bingListSchema');

    if (!collectionExists) {
      console.log('bingListSchema collection does not exist. Skipping update.');
      return;
    }

    const result = await binglist.findOneAndUpdate(
      { token: token},
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
        const collectionExists = collections.some((collection) => collection.name === 'keyListSchema');
    
        if (!collectionExists) {
          console.log('keyListSchema collection does not exist. Skipping update.');
          return;
        }
    
        const records = await keylist.find({});
    
        const updatedRecords = records.map(async(record) => {
            // 此处需要掉用查询apikey费用查询接口，获取apikey的总额度，已使用额度，剩余额度的情况
          // 根据需要修改字段
          let keystatus=true
          if(record.key){
           let usageresult= await computedMoney(record.key,7)
           if(usageresult==false){
            keystatus=false
           }else{
            let {total,total_usage,remain_money,history_usage}=usageresult
            record.quota = total
            record.consumption = total_usage
            record.balance = remain_money
            record.history_usage = history_usage
            if(remain_money<0.5){
                keystatus=false
            }
           }
          }
          if(!keystatus){
            record.keystatus = '失效'
          }else{
            if(record.isenable){
                record.keystatus = '启用'
            }else{
                record.keystatus = '禁用'
            }
          }
        //   根据上面计算结果，判断账号的状态
          return record.save();
        });
    
        await Promise.all(updatedRecords);
        console.log('Updated all records in the keyList collection.');
      } catch (error) {
        console.error('Error updating records:', error);
      }
}

// 更新token账号的状态
const updateTokenAndSessionStatus =async ()=>{
  try {
      // 检查集合是否存在
      const collections = await mongoose.connection.db.listCollections().toArray();
      const collectionExists = collections.some((collection) => collection.name === 'tokenListSchema');
  
      if (!collectionExists) {
        console.log('tokenListSchema collection does not exist. Skipping update.');
        return;
      }
  
      const records = await tokenlist.find({});
  
      const updatedRecords = records.map(async(record) => {
        // 根据需要修改字段
        if(record.token){
         let tokenstatus= await unfficalChatApiLive(record.token)
         if(tokenstatus){
          record.tokenstatus = '在线'
         }else{
          record.tokenstatus='离线'
         }
        }

        if(record.session){
          let sessionstatus= await sessionIsLive(record.session)
          if(sessionstatus){
           record.sessionstatus = '在线'
          }else{
           record.sessionstatus='离线'
          }
        }

      //   根据上面计算结果，判断账号的状态
        return record.save();
      });
  
      await Promise.all(updatedRecords);
      console.log('Updated all records in the tokenList collection.');
    } catch (error) {
      console.error('Error updating records:', error);
    }
}

// 定时更新token的使用情况
const updateTokenStatus =async ()=>{
  const token3UsedInfo = {};
  const token4UsedInfo = {};
   try {
     // 检查集合是否存在
     const collections = await mongoose.connection.db.listCollections().toArray();
     const collectionExists = collections.some((collection) => collection.name === 'keyUnOfficalSchema');
 
     if (!collectionExists) {
       console.log('keyUnOfficalSchema collection does not exist. Skipping count update.');
       return;
     }
    
     const collectionExists1 = collections.some((collection) => collection.name === 'tokenListSchema');
 
     if (!collectionExists1) {
       console.log('tokenListSchema collection does not exist. Skipping update.');
       return;
     }
 
 
     await tokenlist.updateMany({}, { $set: { usedcount: 0 } });
 
     const aggregation = await keyunoffical.aggregate([
       { $match: { accesstoken3: { $exists: true ,$ne: ''} } },
       { $group: { _id: '$accesstoken3', count: { $sum: 1 } } },
     ]);
 
     aggregation.forEach(({ _id, count }) => {
      token3UsedInfo[_id] = count;
     });
 
 
     // 将统计的token3被使用数量更新到keyList表中
     for (const [accesstoken3, usedCount] of Object.entries(token3UsedInfo)) {
         await updateTokenUsedCount(accesstoken3, usedCount);
     }
 
 
     // 更新token4的被使用数量
     const aggregation4 = await keyunoffical.aggregate([
         { $match: { accesstoken4: { $exists: true ,$ne: ''} } },
         { $group: { _id: '$accesstoken4', count: { $sum: 1 } } },
     ])
 
     aggregation4.forEach(({ _id, count }) => {
      token4UsedInfo[_id] = count;
     })
     // 将统计的api4key被使用数量更新到keyList表中
     for (const [accesstoken4, usedCount] of Object.entries(token4UsedInfo)) {
       await updateTokenUsedCount(accesstoken4, usedCount);
     }
 
     console.log('Updated token count:', JSON.stringify(token3UsedInfo));
   } catch (error) {
     console.error('Error fetching API key count:', error);
   }
}

// 更新bing的使用情况
const updateBingUsedCount =async ()=>{
  const bingUsedInfo = {};
   try {
     // 检查集合是否存在
     const collections = await mongoose.connection.db.listCollections().toArray();
     const collectionExists = collections.some((collection) => collection.name === 'keyUnOfficalSchema');
 
     if (!collectionExists) {
       console.log('keyUnOfficalSchema collection does not exist. Skipping count update.');
       return;
     }
    
     const collectionExists1 = collections.some((collection) => collection.name === 'bingListSchema');
 
     if (!collectionExists1) {
       console.log('bingListSchema collection does not exist. Skipping update.');
       return;
     }
 
 
     await binglist.updateMany({}, { $set: { usedcount: 0 } });
 
     const aggregation = await keyunoffical.aggregate([
      { $match: { "newbingKey.newbingtoken": { $exists: true, $ne: "" } } },
      { $group: { _id: "$newbingKey.newbingtoken", count: { $sum: 1 } } },
  ]);
  
     aggregation.forEach(({ _id, count }) => {
      bingUsedInfo[_id] = count;
     });
 
 
     // 将统计的token被使用数量更新到bingList表中
     for (const [bingtoken, usedCount] of Object.entries(bingUsedInfo)) {
         await updateBingTokenUsedCount(bingtoken, usedCount);
     }
 
     console.log('Updated token count:', JSON.stringify(bingUsedInfo));
   } catch (error) {
     console.error('Error fetching API key count:', error);
   }
}

// 更新bing的状态
const updateBingStatus =async ()=>{
  try {
    // 检查集合是否存在
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some((collection) => collection.name === 'bingListSchema');

    if (!collectionExists) {
      console.log('bingListSchema collection does not exist. Skipping update.');
      return;
    }

    const records = await binglist.find({});

    const updatedRecords = records.map(async(record) => {
      // 根据需要修改字段
      if(record.token&&record.cookie){
       let tokenstatus= await newBingIsLive(record.token,record.cookie)
       if(tokenstatus){
        record.tokenstatus = '在线'
       }else{
        record.tokenstatus='离线'
       }
      }
    //   根据上面计算结果，判断账号的状态
      return record.save();
    });

    await Promise.all(updatedRecords);
    console.log('Updated all records in the bingList collection.');
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
   await updateApikeyCount();
}

// 更新keylist表中的信息
const updateGptAccountStatusOnce= async ()=>{
    updateGptAccountStatus()
}

// 定时更新keylist表中的信息
const loopupdateGptAccountStatus= async ()=>{
    if(updateGptAccountInstance){
        clearInterval(updateGptAccountInstance);
    }
    updateGptAccountInstance= setInterval(()=>{
        updateGptAccountStatus()
    }, intervalTime);
}

// 定时更新token的使用情况
const loopUpdateTokenStatus=async ()=>{
    if(updateTokenInstance){
        clearInterval(updateTokenInstance);
    }
    updateTokenInstance= setInterval(()=>{
      updateTokenStatus()
    }, intervalTime);
}
// 定时更新token和session的状态
const loopUpdateTokenAndSessionStatus=async ()=>{
    if(updateTokenAndSessionInstance){
        clearInterval(updateTokenAndSessionInstance);
    }
    updateTokenAndSessionInstance= setInterval(()=>{
      updateTokenAndSessionStatus()
    }, intervalTime);
}

// 定时更新bing的使用情况
const loopUpdateBingUsedCount=async ()=>{
  if(updateBingUsedCountInstance){
      clearInterval(updateBingUsedCountInstance);
  }
  updateBingUsedCountInstance= setInterval(()=>{
    updateBingUsedCount()
  }, intervalTime);
}

// 定时更新bing的状态
const loopUpdateBingStatus=async ()=>{
  if(updateBingStatusInstance){
      clearInterval(updateBingStatusInstance);
  }
  updateBingStatusInstance= setInterval(()=>{
    updateBingStatus()
  }, intervalTime);
}

module.exports={
    updateAccountStatus,updateAccountStatusOnce,updateGptAccountStatusOnce,loopupdateGptAccountStatus,
    loopUpdateTokenStatus,updateTokenStatus,updateTokenAndSessionStatus,loopUpdateTokenAndSessionStatus,
    updateBingUsedCount,loopUpdateBingUsedCount,updateBingStatus,loopUpdateBingStatus
}


