const mongoose = require('mongoose');
const keylist = require('../db/models/chatgpt/keyListSchema')
const tokenlist=require('../db/models/chatgpt/tokenListSchema')
const binglist=require('../db/models/chatgpt/bingListSchema')
const bardlist=require('../db/models/chatgpt/bardListSchema')
const claudelist=require('../db/models/chatgpt/claudeListSchema')
const hugginglist=require('../db/models/chatgpt/huggingListSchema')
const xfyunlist=require('../db/models/chatgpt/xfyunListSchema')
const poelist=require('../db/models/chatgpt/poeListSchema')
const keyoffical=require('../db/models/chatgpt/keyOfficalSchema')
const keyunoffical=require('../db/models/chatgpt/keyUnOfficalSchema')
const {computedMoney,unfficalChatApiLive,sessionIsLive,newBingIsLive,bardIsLive,claudeceIsLive,huggingIsLive,
  xfyunIsLive,poeIsLive} =require('../controller/chatGpt/utils/gptCommon');
let intervalInstance = null;
let updateGptAccountInstance = null;
let updateTokenInstance = null;
let updateTokenAndSessionInstance=null;
let updateBingUsedCountInstance=null;
let updateBingStatusInstance=null;
let updateBardUsedCountInstance=null;
let updateBardStatusInstance=null;
let updateClaudeUsedCountInstance=null;
let updateClaudeStatusInstance=null;
let updateHuggingUsedCountInstance=null;
let updateHuggingStatusInstance=null;
let updateXfyunUsedCountInstance=null;
let updateXfyunStatusInstance=null;
let updatePoeUsedCountInstance=null;
let updatePoeStatusInstance=null;
const intervalTime = 1000 * 60 * 60; // 3 minutes
const xfyunintervalTime=1000*60*120
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

// 将bardtoken数量更新到bardlist表中
async function updateBardTokenUsedCount(token, usedCount) {
  try {
    // 检查集合是否存在
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some((collection) => collection.name === 'bardListSchema');

    if (!collectionExists) {
      console.log('bardListSchema collection does not exist. Skipping update.');
      return;
    }

    const result = await bardlist.findOneAndUpdate(
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
// 将huggingtoken数量更新到hugginglist表中
async function updateHuggingTokenUsedCount(token, usedCount) {
  try {
    // 检查集合是否存在
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some((collection) => collection.name === 'huggingListSchema');

    if (!collectionExists) {
      console.log('huggingListSchema collection does not exist. Skipping update.');
      return;
    }

    const result = await hugginglist.findOneAndUpdate(
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
// 将xfyuntoken数量更新到xfyunlist表中
async function updateXfyunTokenUsedCount(token, usedCount) {
  try {
    // 检查集合是否存在
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some((collection) => collection.name === 'xfyunListSchema');

    if (!collectionExists) {
      console.log('xfyunListSchema collection does not exist. Skipping update.');
      return;
    }

    const result = await xfyunlist.findOneAndUpdate(
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

// 将poetoken数量更新到poelist表中
async function updatePoeTokenUsedCount(token, usedCount) {
  try {
    // 检查集合是否存在
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some((collection) => collection.name === 'poeListSchema');

    if (!collectionExists) {
      console.log('poeListSchema collection does not exist. Skipping update.');
      return;
    }

    const result = await poelist.findOneAndUpdate(
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

// 更新bard的使用数量
const updateBardUsedCount =async ()=>{
  const bardUsedInfo = {};
  try {
    // 检查集合是否存在
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some((collection) => collection.name === 'keyUnOfficalSchema');

    if (!collectionExists) {
      console.log('keyUnOfficalSchema collection does not exist. Skipping count update.');
      return;
    }
   
    const collectionExists1 = collections.some((collection) => collection.name === 'bardListSchema');

    if (!collectionExists1) {
      console.log('bardListSchema collection does not exist. Skipping update.');
      return;
    }


    await bardlist.updateMany({}, { $set: { usedcount: 0 } });

    const aggregation = await keyunoffical.aggregate([
     { $match: { "bardtoken": { $exists: true, $ne: "" } } },
     { $group: { _id: "$bardtoken", count: { $sum: 1 } } },
 ]);
 
    aggregation.forEach(({ _id, count }) => {
      bardUsedInfo[_id] = count;
    });


    // 将统计的token被使用数量更新到bingList表中
    for (const [bardtoken, usedCount] of Object.entries(bardUsedInfo)) {
        await updateBardTokenUsedCount(bardtoken, usedCount);
    }

    console.log('Updated token count:', JSON.stringify(bardUsedInfo));
  } catch (error) {
    console.error('Error fetching API key count:', error);
  }
}

// 更新bard的状态
const updateBardStatus =async ()=>{
  try {
    // 检查集合是否存在
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some((collection) => collection.name === 'bardListSchema');

    if (!collectionExists) {
      console.log('bardListSchema collection does not exist. Skipping update.');
      return;
    }

    const records = await bardlist.find({});

    const updatedRecords = records.map(async(record) => {
      // 根据需要修改字段
      if(record.token){
       let tokenstatus= await bardIsLive(record.token)
       if(tokenstatus){
        record.tokenstatus = '在线'
       }else{
        record.tokenstatus='离线'
       }
      }
      return record.save();
    });

    await Promise.all(updatedRecords);
    console.log('Updated all records in the bardList collection.');
  } catch (error) {
    console.error('Error updating records:', error);
  }
}



// 更新claude的使用数量
const updateClaudeUsedCount =async ()=>{
  const claudeUsedInfo = {};
  try {
    // 检查集合是否存在
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some((collection) => collection.name === 'keyUnOfficalSchema');

    if (!collectionExists) {
      console.log('keyUnOfficalSchema collection does not exist. Skipping count update.');
      return;
    }
   
    const collectionExists1 = collections.some((collection) => collection.name === 'claudeListSchema');

    if (!collectionExists1) {
      console.log('claudeListSchema collection does not exist. Skipping update.');
      return;
    }


    await claudelist.updateMany({}, { $set: { usedcount: 0 } });

    const aggregation = await keyunoffical.aggregate([
      { $match: { "claudeKey.token": { $exists: true, $ne: "" } } },
      { $group: { _id: "$claudeKey.token", count: { $sum: 1 } } },
 ]);
 
    aggregation.forEach(({ _id, count }) => {
      claudeUsedInfo[_id] = count;
    });


    // 将统计的token被使用数量更新到bingList表中
    for (const [claudetoken, usedCount] of Object.entries(claudeUsedInfo)) {
        await updateClaudeTokenUsedCount(claudetoken, usedCount);
    }

    console.log('Updated token count:', JSON.stringify(claudeUsedInfo));
  } catch (error) {
    console.error('Error fetching API key count:', error);
  }
}

// 将claudetoken数量更新到claudelist表中
async function updateClaudeTokenUsedCount(token, usedCount) {
  try {
    // 检查集合是否存在
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some((collection) => collection.name === 'claudeListSchema');

    if (!collectionExists) {
      console.log('claudeListSchema collection does not exist. Skipping update.');
      return;
    }

    const result = await claudelist.findOneAndUpdate(
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

// 更新claude的状态
const updateClaudeStatus =async ()=>{
  try {
    // 检查集合是否存在
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some((collection) => collection.name === 'claudeListSchema');

    if (!collectionExists) {
      console.log('claudeListSchema collection does not exist. Skipping update.');
      return;
    }

    const records = await claudelist.find({});

    const updatedRecords = records.map(async(record) => {
      // 根据需要修改字段
      if(record.token){
       let tokenstatus= await claudeceIsLive(record.token,record.appid)
       if(tokenstatus){
        record.tokenstatus = '在线'
       }else{
        record.tokenstatus='离线'
       }
      }
      return record.save();
    });

    await Promise.all(updatedRecords);
    console.log('Updated all records in the claudeList collection.');
  } catch (error) {
    console.error('Error updating records:', error);
  }
}


// 更新hugging的使用数量
const updateHuggingUsedCount =async ()=>{
  const huggingUsedInfo = {};
  try {
    // 检查集合是否存在
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some((collection) => collection.name === 'keyUnOfficalSchema');

    if (!collectionExists) {
      console.log('keyUnOfficalSchema collection does not exist. Skipping count update.');
      return;
    }
   
    const collectionExists1 = collections.some((collection) => collection.name === 'huggingListSchema');

    if (!collectionExists1) {
      console.log('huggingListSchema collection does not exist. Skipping update.');
      return;
    }


    await hugginglist.updateMany({}, { $set: { usedcount: 0 } });

    const aggregation = await keyunoffical.aggregate([
     { $match: { "huggingtoken": { $exists: true, $ne: "" } } },
     { $group: { _id: "$huggingtoken", count: { $sum: 1 } } },
 ]);
 
    aggregation.forEach(({ _id, count }) => {
      huggingUsedInfo[_id] = count;
    });


    // 将统计的token被使用数量更新到huggingList表中
    for (const [huggingtoken, usedCount] of Object.entries(huggingUsedInfo)) {
        await updateHuggingTokenUsedCount(huggingtoken, usedCount);
    }

    console.log('Updated token count:', JSON.stringify(huggingUsedInfo));
  } catch (error) {
    console.error('Error fetching API key count:', error);
  }
}

// 更新hugging的状态
const updateHuggingStatus =async ()=>{
  try {
    // 检查集合是否存在
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some((collection) => collection.name === 'huggingListSchema');

    if (!collectionExists) {
      console.log('huggingListSchema collection does not exist. Skipping update.');
      return;
    }

    const records = await hugginglist.find({});

    const updatedRecords = records.map(async(record) => {
      // 根据需要修改字段
      if(record.token){
       let tokenstatus= await huggingIsLive(record.token)
       if(tokenstatus){
        record.tokenstatus = '在线'
       }else{
        record.tokenstatus='离线'
       }
      }
      return record.save();
    });

    await Promise.all(updatedRecords);
    console.log('Updated all records in the huggingList collection.');
  } catch (error) {
    console.error('Error updating records:', error);
  }
}


// 更新xfyun的使用数量
const updateXfyunUsedCount =async ()=>{
  const xfyunUsedInfo = {};
  try {
    // 检查集合是否存在
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some((collection) => collection.name === 'keyUnOfficalSchema');

    if (!collectionExists) {
      console.log('keyUnOfficalSchema collection does not exist. Skipping count update.');
      return;
    }
   
    const collectionExists1 = collections.some((collection) => collection.name === 'xfyunListSchema');

    if (!collectionExists1) {
      console.log('xfyunListSchema collection does not exist. Skipping update.');
      return;
    }


    await xfyunlist.updateMany({}, { $set: { usedcount: 0 } });

    const aggregation = await keyunoffical.aggregate([
     { $match: { "xfyuntoken": { $exists: true, $ne: "" } } },
     { $group: { _id: "$xfyuntoken", count: { $sum: 1 } } },
 ]);
 
    aggregation.forEach(({ _id, count }) => {
      xfyunUsedInfo[_id] = count;
    });


    // 将统计的token被使用数量更新到xfyunList表中
    for (const [xfyuntoken, usedCount] of Object.entries(xfyunUsedInfo)) {
        await updateXfyunTokenUsedCount(xfyuntoken, usedCount);
    }

    console.log('Updated token count:', JSON.stringify(xfyunUsedInfo));
  } catch (error) {
    console.error('Error fetching API key count:', error);
  }
}

// 更新xfyun的状态
const updateXfyunStatus =async ()=>{
  try {
    // 检查集合是否存在
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some((collection) => collection.name === 'xfyunListSchema');

    if (!collectionExists) {
      console.log('xfyunListSchema collection does not exist. Skipping update.');
      return;
    }

    const records = await xfyunlist.find({});

    const updatedRecords = records.map(async(record) => {
      // 根据需要修改字段
      if(record.token){
       let tokenstatus= await xfyunIsLive(record.token)
       if(tokenstatus){
        record.tokenstatus = '在线'
       }else{
        record.tokenstatus='离线'
       }
      }
      return record.save();
    });

    await Promise.all(updatedRecords);
    console.log('Updated all records in the xfyunList collection.');
  } catch (error) {
    console.error('Error updating records:', error);
  }
}


// 更新poe的使用数量
const updatePoeUsedCount =async ()=>{
  const poeUsedInfo = {};
  try {
    // 检查集合是否存在
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some((collection) => collection.name === 'keyUnOfficalSchema');

    if (!collectionExists) {
      console.log('keyUnOfficalSchema collection does not exist. Skipping count update.');
      return;
    }
   
    const collectionExists1 = collections.some((collection) => collection.name === 'poeListSchema');

    if (!collectionExists1) {
      console.log('poeListSchema collection does not exist. Skipping update.');
      return;
    }


    await poelist.updateMany({}, { $set: { usedcount: 0 } });

    const aggregation = await keyunoffical.aggregate([
     { $match: { "poetoken": { $exists: true, $ne: "" } } },
     { $group: { _id: "$poetoken", count: { $sum: 1 } } },
 ]);
 
    aggregation.forEach(({ _id, count }) => {
      poeUsedInfo[_id] = count;
    });


    // 将统计的token被使用数量更新到xfyunList表中
    for (const [poetoken, usedCount] of Object.entries(poeUsedInfo)) {
        await updatePoeTokenUsedCount(poetoken, usedCount);
    }

    console.log('Updated token count:', JSON.stringify(poeUsedInfo));
  } catch (error) {
    console.error('Error fetching API key count:', error);
  }
}

// 更新poe的状态
const updatePoeStatus =async ()=>{
  try {
    // 检查集合是否存在
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some((collection) => collection.name === 'poeListSchema');

    if (!collectionExists) {
      console.log('poeListSchema collection does not exist. Skipping update.');
      return;
    }

    const records = await poelist.find({});

    const updatedRecords = records.map(async(record) => {
      // 根据需要修改字段
      if(record.token){
       let tokenstatus= await poeIsLive(record.token)
       if(tokenstatus){
        record.tokenstatus = '在线'
       }else{
        record.tokenstatus='离线'
       }
      }
      return record.save();
    });

    await Promise.all(updatedRecords);
    console.log('Updated all records in the poeList collection.');
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

// 定时更新bard的使用情况
const loopUpdateBardUsedCount=async ()=>{
  if(updateBardUsedCountInstance){
      clearInterval(updateBardUsedCountInstance);
  }
  updateBardUsedCountInstance= setInterval(()=>{
    updateBardUsedCount()
  }, intervalTime);
}
// 定时更新bard的状态
const loopUpdateBardStatus=async ()=>{
  if(updateBardStatusInstance){
      clearInterval(updateBardStatusInstance);
  }
  updateBardStatusInstance= setInterval(()=>{
    updateBardStatus()
  }, intervalTime);
}

// 定时更新claude的使用情况
const loopUpdateClaudeUsedCount=async ()=>{
  if(updateClaudeUsedCountInstance){
      clearInterval(updateClaudeUsedCountInstance);
  }
  updateClaudeUsedCountInstance= setInterval(()=>{
    updateClaudeUsedCount()
  }, intervalTime);
}

// 定时更新claude的状态
const loopUpdateClaudeStatus=async ()=>{
  if(updateClaudeStatusInstance){
      clearInterval(updateClaudeStatusInstance);
  }
  updateClaudeStatusInstance= setInterval(()=>{
    updateClaudeStatus()
  }, intervalTime);
}
// 定时更新hugging的使用情况
const loopUpdateHuggingUsedCount=async ()=>{
  if(updateHuggingUsedCountInstance){
      clearInterval(updateHuggingUsedCountInstance);
  }
  updateHuggingUsedCountInstance= setInterval(()=>{
    updateHuggingUsedCount()
  }, intervalTime);
}
// 定时更新hugging的状态
const loopUpdateHuggingStatus=async ()=>{
  if(updateHuggingStatusInstance){
      clearInterval(updateHuggingStatusInstance);
  }
  updateHuggingStatusInstance= setInterval(()=>{
    updateHuggingStatus()
  }, intervalTime);
}
// 定时更新xfyun的使用情况
const loopUpdateXfyunUsedCount=async ()=>{
  if(updateXfyunUsedCountInstance){
      clearInterval(updateXfyunUsedCountInstance);
  }
  updateXfyunUsedCountInstance= setInterval(()=>{
    updateXfyunUsedCount()
  }, xfyunintervalTime);
}

// 定时更新xfyun的状态
const loopUpdateXfyunStatus=async ()=>{
  if(updateXfyunStatusInstance){
      clearInterval(updateXfyunStatusInstance);
  }
  updateXfyunStatusInstance= setInterval(()=>{
    updateXfyunStatus()
  }, xfyunintervalTime);
}

// 定时更新poe的使用情况
const loopUpdatePoeUsedCount=async ()=>{
  if(updatePoeUsedCountInstance){
      clearInterval(updatePoeUsedCountInstance);
  }
  updatePoeUsedCountInstance= setInterval(()=>{
    updatePoeUsedCount()
  }, intervalTime);
}

// 定时更新poe的状态
const loopUpdatePoeStatus=async ()=>{
  if(updatePoeStatusInstance){
      clearInterval(updatePoeStatusInstance);
  }
  updatePoeStatusInstance= setInterval(()=>{
    updatePoeStatus()
  }, intervalTime);
}


module.exports={
    updateAccountStatus,updateAccountStatusOnce,updateGptAccountStatusOnce,loopupdateGptAccountStatus,
    loopUpdateTokenStatus,updateTokenStatus,updateTokenAndSessionStatus,loopUpdateTokenAndSessionStatus,
    updateBingUsedCount,loopUpdateBingUsedCount,updateBingStatus,loopUpdateBingStatus,
    updateBardUsedCount,loopUpdateBardUsedCount,updateBardStatus,loopUpdateBardStatus,
    updateClaudeUsedCount,loopUpdateClaudeUsedCount,updateClaudeStatus,loopUpdateClaudeStatus,
    updateHuggingUsedCount,loopUpdateHuggingUsedCount,updateHuggingStatus,loopUpdateHuggingStatus,
    updateXfyunStatus,updateXfyunUsedCount,loopUpdateXfyunUsedCount,loopUpdateXfyunStatus,
    updatePoeUsedCount,loopUpdatePoeUsedCount,updatePoeStatus,loopUpdatePoeStatus
}


