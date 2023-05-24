const Counter = require('../../db/models/counterSchema')
const officalkeys = require('../../db/models/chatgpt/keyOfficalSchema')
const unofficalkeys = require('../../db/models/chatgpt/keyUnOfficalSchema')
const keylist =require('../../db/models/chatgpt/keyListSchema')
const tokenlist=require('../../db/models/chatgpt/tokenListSchema')
const binglist=require('../../db/models/chatgpt/bingListSchema')
const bardlist=require('../../db/models/chatgpt/bardListSchema')
const claudelist=require('../../db/models/chatgpt/claudeListSchema')
const hugginglist=require('../../db/models/chatgpt/huggingListSchema')
const {encrypt,decrypt}=require('../../utils/encryption')
const {updateAccountStatusOnce,updateTokenStatus,updateBingUsedCount,updateBardUsedCount,updateClaudeUsedCount,updateHuggingUsedCount}=require('../../utils/timedTask')
const AsyncLock = require('async-lock');
const { type } = require('fetch-undici')
const lock = new AsyncLock();

const getOfficalKeys=async (req,res)=>{
    let {userId}=req.user.userList
    console.log(req.user.userList)
    try{
        const result=await officalkeys.findOne({userId}).exec()
       // 如果密钥非启用状态，不返回密钥
        if(result&&result.chatgpt3Key){
            const obj=await keylist.findOne({key:result.chatgpt3Key}).exec()
            if(obj&&obj.keystatus!='启用'){
                result.chatgpt3Key=''
            }
        }
        if(result&&result.chatgpt4Key){
            const obj=await keylist.findOne({key:result.chatgpt4Key}).exec()
            if(obj&&obj.keystatus!='启用'){
                result.chatgpt4Key=''
            }
        }
        if(result){
            result.chatgpt3Key=result.chatgpt3Key?encrypt(result.chatgpt3Key):result.chatgpt3Key
            result.chatgpt4Key=result.chatgpt4Key?encrypt(result.chatgpt4Key):result.chatgpt4Key
        }
        return res.json({
            errorCode:'0000',
            message:'查询成功！',
            data:result
        })
    }catch(error){
        res.json({
            errorCode: '500',
            message: '服务器错误!',
            data: error
        })
        throw error
    }
}

const postOfficalKeys=async (req,res)=>{
    await lock.acquire("officalkeysetting", async (done) => {
        let {_id,chatgpt3Key,chatgpt4Key}=req.body
        let {userId}=req.user.userList
        try{
          await  updateAccountStatusOnce()
            const countResult= await Counter.findOne({id:'officalkeyId'})
            if(!countResult){
              await Counter.create({
                  "id":"officalkeyId",
                  "sequence_value":1
              })
            }
            chatgpt3Key=chatgpt3Key?decrypt(chatgpt3Key):chatgpt3Key
            chatgpt4Key=chatgpt4Key?decrypt(chatgpt4Key):chatgpt4Key
         //   检查最新的资源被使用情况
            if(chatgpt3Key){
                let result3=await keylist.findOne({key:chatgpt3Key})
                // 如果更新的是已经绑定的密钥则跳过校验
                let obj=await officalkeys.findOne({userId})
                if(!obj||obj.chatgpt3Key!=chatgpt3Key){
                    if(result3){
                        if(result3.usedcount>=result3.sharecount){
                            return res.json({
                                errorCode:'2002',
                                message:'该密钥已被使用完!',
                                data:null
                            })
                        }
                    }
                }
            }
            if(chatgpt4Key){
                let result4=await keylist.findOne({key:chatgpt4Key})
                // 如果更新的是已经绑定的密钥则跳过校验
                let obj=await officalkeys.findOne({userId})
                if(!obj||obj.chatgpt4Key!=chatgpt4Key){
                    if(result4){
                        if(result4.usedcount>=result4.sharecount){
                            return res.json({
                                errorCode:'2002',
                                message:'该密钥已被使用完!',
                                data:null
                            })
                        }
                    }
                }
            }
            const count = await Counter.findOneAndUpdate({ id: 'officalkeyId' }, { $inc: { sequence_value: 1 } }, { new: true })
            if(!_id){
                try{
                    const officalKeys = await new officalkeys({
                        officalkeyId:count.sequence_value,
                        userId,
                        chatgpt3Key: chatgpt3Key,
                        chatgpt4Key:chatgpt4Key
                    })
                    await officalKeys.save();
                    done()
                        return res.json({
                            errorCode:'0000',
                            message:'保存密钥成功!',
                            data:null
                      })
                }catch(error){
                    done()
                    return res.json({
                        errorCode:'2002',
                        message:'保存密钥失败!',
                        data:null
                    })
                }
            }   
                const row=await officalkeys.findOneAndUpdate({_id},{
                    chatgpt3Key,
                    chatgpt4Key
                 })
                if(row){
                        done()
                        return res.json({
                            errorCode:'0000',
                            message:'修改成功!',
                            data:null
                        })
                }else{
                    done()
                    return res.json({
                        errorCode:'2002',
                        message:'保存密钥失败!',
                        data:null
                    })
                }
        }catch(error){
            done()
            res.json({
                errorCode: '500',
                message: '服务器错误!',
                data: error
            })
            throw error
        }
    });
}

const getUnofficalKeys=async (req,res)=>{
    let {userId}=req.user.userList
    try{
        const result=await unofficalkeys.findOne({userId})
        // 如果密钥非启用状态，不返回密钥
        if(result&&result.accesstoken3){
            const obj=await tokenlist.findOne({token:result.accesstoken3}).exec()
            if(obj&&obj.enablestatus!='启用'){
                result.accesstoken3=''
            }
        }
        if(result&&result.accesstoken4){
            const obj=await tokenlist.findOne({token:result.accesstoken4}).exec()
            if(obj&&obj.enablestatus!='启用'){
                result.accesstoken4=''
            }
        }
        if(result&&result.newbingKey&&result.newbingKey.newbingtoken){
            const obj=await binglist.findOne({token:result.newbingKey.newbingtoken}).exec()
            if(obj&&obj.enablestatus!='启用'){
                result.newbingKey.newbingtoken=''
                result.newbingKey.newbingcookie=''
            }
        }
        if(result&&result.bardtoken){
            const obj=await bardlist.findOne({token:result.bardtoken}).exec()
            if(obj&&obj.enablestatus!='启用'){
                result.bardtoken=''
            }
        }
        if(result&&result.claudeKey&&result.claudeKey.token){
            const obj=await claudelist.findOne({token:result.claudeKey.token}).exec()
            if(obj&&obj.enablestatus!='启用'){
                result.claudeKey.token=''
                result.claudeKey.appid=''
            }
        }
        if(result&&result.huggingtoken){
            const obj=await hugginglist.findOne({token:result.huggingtoken}).exec()
            if(obj&&obj.enablestatus!='启用'){
                result.huggingtoken=''
            }
        }
        if(result){
            result.accesstoken3=result.accesstoken3?encrypt(result.accesstoken3):result.accesstoken3
            result.accesstoken4=result.accesstoken4?encrypt(result.accesstoken4):result.accesstoken4
            result.newbingKey.newbingtoken=result.newbingKey.newbingtoken?encrypt(result.newbingKey.newbingtoken):result.newbingKey.newbingtoken
            result.newbingKey.newbingcookie=result.newbingKey.newbingcookie?encrypt(result.newbingKey.newbingcookie):result.newbingKey.newbingcookie
            result.bardtoken=result.bardtoken?encrypt(result.bardtoken):result.bardtoken
            result.claudeKey.token=result.claudeKey.token?encrypt(result.claudeKey.token):result.claudeKey.token
            result.claudeKey.appid=result.claudeKey.appid?encrypt(result.claudeKey.appid):result.claudeKey.appid
            result.huggingtoken=result.huggingtoken?encrypt(result.huggingtoken):result.huggingtoken
        }
        return res.json({
            errorCode:'0000',
            message:'查询成功！',
            data:result
        })
    }catch(error){
        res.json({
            errorCode: '500',
            message: '服务器错误!',
            data: error
        })
        throw error
    }
}

const postUnofficalKeys=async (req,res)=>{
    await lock.acquire("unofficalkeysetting", async (done) => {
      let {_id,accesstoken3,accesstoken4,newbingKey,bardtoken,claudeKey,huggingtoken}=req.body
        let {userId}=req.user.userList
        try{
             await updateTokenStatus()
             await updateBingUsedCount()
             await updateBardUsedCount()
             await updateClaudeUsedCount()
             await updateHuggingUsedCount()
            const countResult= await Counter.findOne({id:'unofficalkeyId'})
            if(!countResult){
              await Counter.create({
                  "id":"unofficalkeyId",
                  "sequence_value":1
              })
            }
      
            accesstoken3=accesstoken3?decrypt(accesstoken3):accesstoken3
            accesstoken4=accesstoken4?decrypt(accesstoken4):accesstoken4
            newbingKey.newbingtoken=newbingKey.newbingtoken?decrypt(newbingKey.newbingtoken):newbingKey.newbingtoken
            newbingKey.newbingcookie=newbingKey.newbingcookie?decrypt(newbingKey.newbingcookie):newbingKey.newbingcookie
            bardtoken=bardtoken?decrypt(bardtoken):bardtoken
            claudeKey.token=claudeKey.token?decrypt(claudeKey.token):claudeKey.token
            claudeKey.appid=claudeKey.appid?decrypt(claudeKey.appid):claudeKey.appid
            huggingtoken=huggingtoken?decrypt(huggingtoken):huggingtoken
            const count = await Counter.findOneAndUpdate({ id: 'unofficalkeyId' }, { $inc: { sequence_value: 1 } }, { new: true })
        //   判断资源被使用数量校验能够提交
            if(accesstoken3){
                let result3=await tokenlist.findOne({token:accesstoken3})
                // 如果更新的是已经绑定的密钥则跳过校验
                let obj=await unofficalkeys.findOne({userId})
                if(!obj||obj.accesstoken3!=accesstoken3){
                    if(result3){
                        if(result3.usedcount>=result3.sharecount){
                            return res.json({
                                errorCode:'2002',
                                message:'该token已被使用完!',
                                data:null
                            })
                        }
                    }
                }
            }
            if(accesstoken4){
                let result4=await tokenlist.findOne({token:accesstoken4})
                // 如果更新的是已经绑定的密钥则跳过校验
                let obj=await unofficalkeys.findOne({userId})
                if(!obj||obj.accesstoken4!=accesstoken4){
                    if(result4){
                        if(result4.usedcount>=result4.sharecount){
                            return res.json({
                                errorCode:'2002',
                                message:'该token已被使用完!',
                                data:null
                            })
                        }
                    }
                }
            }

            if(newbingKey.newbingtoken){
                let result=await binglist.findOne({token:newbingKey.newbingtoken}).exec()
            // 如果更新的是已经绑定的密钥则跳过校验
            let obj= await unofficalkeys.findOne({userId})
                if(!obj||obj.newbingKey.newbingtoken!=newbingKey.newbingtoken){
                    if(result){
                        if(result.usedcount>=result.sharecount){
                            return res.json({
                                errorCode:'2002',
                                message:'该token已被使用完!',
                                data:null
                            })
                        }
                    }
                } 
            }
          
            if(bardtoken){
                let result4=await bardlist.findOne({token:bardtoken})
                // 如果更新的是已经绑定的密钥则跳过校验
                let obj=await unofficalkeys.findOne({userId})
                if(!obj||obj.bardtoken!=bardtoken){
                    if(result4){
                        if(result4.usedcount>=result4.sharecount){
                            return res.json({
                                errorCode:'2002',
                                message:'该token已被使用完!',
                                data:null
                            })
                        }
                    }
                }
            }

            if(claudeKey.token){
                let result=await claudelist.findOne({token:claudeKey.token}).exec()
            // 如果更新的是已经绑定的密钥则跳过校验
            let obj= await unofficalkeys.findOne({userId})
                if(!obj||obj.claudeKey.token!=claudeKey.token){
                    if(result){
                        if(result.usedcount>=result.sharecount){
                            return res.json({
                                errorCode:'2002',
                                message:'该token已被使用完!',
                                data:null
                            })
                        }
                    }
                } 
            }

            if(huggingtoken){
                let result4=await hugginglist.findOne({token:huggingtoken})
                // 如果更新的是已经绑定的密钥则跳过校验
                let obj=await unofficalkeys.findOne({userId})
                if(!obj||obj.huggingtoken!=huggingtoken){
                    if(result4){
                        if(result4.usedcount>=result4.sharecount){
                            return res.json({
                                errorCode:'2002',
                                message:'该token已被使用完!',
                                data:null
                            })
                        }
                    }
                }
            }

            if(!_id){
              try{
                const unofficalKeys = await new unofficalkeys({
                    unofficalkeyId:count.sequence_value,
                    userId,
                    accesstoken3,
                    accesstoken4,
                    newbingKey,
                    bardtoken,
                    claudeKey,
                    huggingtoken
                })
                await unofficalKeys.save();
                done()
                return res.json({
                    errorCode:'0000',
                    message:'保存密钥成功!',
                    data:null
              })
              }catch(error){
                done()
                return res.json({
                    errorCode:'2002',
                    message:'保存密钥失败!',
                    data:null
                })
              }
           }
              const row=await unofficalkeys.findOneAndUpdate({_id},{
                accesstoken3,
                accesstoken4,
                newbingKey,
                bardtoken,
                claudeKey,
                huggingtoken
              })
              if(row){
                done()
                return res.json({
                    errorCode:'0000',
                    message:'保存密钥成功!',
                    data:null
                })
              }else{
                done()
                return res.json({
                    errorCode:'2002',
                    message:'保存密钥失败!',
                    data:null
                })
              }
        }catch(error){
            done()
            res.json({
                errorCode: '500',
                message: '服务器错误!',
                data: error
            })
            throw error
        }
    })
}

const getOfficalKeyList=async (req,res)=>{
    let {userId,role,roleNames}=req.user.userList
    let {type}=req.query
    if(type!='key3.0'&&type!='key4.0'&&type!='免费key'){
        return res.json({
            errorCode: '2002',
            message: '参数错误!',
            data: null
        })
    }
     try{
        await updateAccountStatusOnce()
        // 查询所有可用的key
        const results = await findKeys(roleNames, type, role);
        console.log(results);
       const finalResult= filterKeyList(results)
        return res.json({
            errorCode:'0000',
            message:'查询成功！',
            data:finalResult
        })
     }catch(error){
        res.json({
            errorCode: '500',
            message: '服务器错误!',
            data: error
        })
        throw error
     }
}
// 过滤keylist
const filterKeyList = (results) => {
    let finalResult = [];
    results.forEach((item,index) => {
        console.log(item.key);
        let obj={
            id:item._id,
            type:item.type,
            key:encrypt(item.key),
            usedcount:item.usedcount,
            sharecount:item.sharecount,
            label:`${item.type}-线路${index+1}`
        }
        if(item.usedcount==item.sharecount){
            obj.disabled=true
        }else{
            obj.disabled=false
        }
        finalResult.push(obj)
    })
    return finalResult
}

// 筛选符合条件的key
        // 筛选条件：
        // 1.根据用户角色过滤出对应的key，如果是管理员则不过滤
        //2.根据key类型过滤对应的key。
        //3.根据key的状态过滤对应的key，只有状态为可用的key且没被禁用的key才能被查询出来
        //4.根据key的使用情况过滤，只有key被使用的数量小于共享的数量才能被查询出来
const findKeys = async (roleNames, type, role) => {
    const query = keylist.find({
        keystatus: '启用',
        $expr: {
          $lte: ['$usedcount', '$sharecount']
        }
      });

  if (role !== 0) {
    query.where('shareroles').in(roleNames);
  }

  if (['免费key', 'key3.0', 'key4.0'].includes(type)) {
    query.where('type').equals(type);
  }

  const results = await query.exec();
  return results;
};

const findTokens = async (roleNames, type, role) => {
    const query = tokenlist.find({
        enablestatus: '启用',
        tokenstatus: '在线',
        $expr: {
          $lte: ['$usedcount', '$sharecount']
        }
      });

  if (role !== 0) {
    query.where('shareroles').in(roleNames);
  }

  if (['免费账号','升级账号'].includes(type)) {
    query.where('type').equals(type);
  }

  const results = await query.exec();
  return results;
};

const filterTokenList = (results) => {
    let finalResult = [];
    results.forEach((item,index) => {
        let obj={
            id:item._id,
            type:item.type,
            token:encrypt(item.token),
            usedcount:item.usedcount,
            sharecount:item.sharecount,
            label:`${item.type}-线路${index+1}`
        }
        if(item.usedcount==item.sharecount){
            obj.disabled=true
        }else{
            obj.disabled=false
        }
        finalResult.push(obj)
    })
    return finalResult
}

// 获取非官方token下拉列表
const getUnofficaltokenList=async (req,res)=>{
    let {userId,role,roleNames}=req.user.userList
    let {type}=req.query
    if(type!='免费账号'&&type!='升级账号'){
        return res.json({
            errorCode: '2002',
            message: '参数错误!',
            data: null
        })
    }
    try{
        await updateTokenStatus()
        const results = await findTokens(roleNames, type, role);
        console.log(results);
       const finalResult= filterTokenList(results)
        return res.json({
            errorCode:'0000',
            message:'查询成功！',
            data:finalResult
        })
    }catch(error){
        res.json({
            errorCode: '500',
            message: '服务器错误!',
            data: error
        })
        throw error
    }
}

const findBingTokens = async (roleNames, role) => {
    const query = binglist.find({
        enablestatus: '启用',
        tokenstatus: '在线',
        $expr: {
          $lte: ['$usedcount', '$sharecount']
        }
      });

  if (role !== 0) {
    query.where('shareroles').in(roleNames);
  }
  const results = await query.exec();
  return results;
};

const filterBingTokenList = (results) => {
    let finalResult = [];
    results.forEach((item,index) => {
        let obj={
            id:item._id,
            token:encrypt(item.token),
            cookie:encrypt(item.cookie),
            usedcount:item.usedcount,
            sharecount:item.sharecount,
            label:`bing-线路${index+1}`
        }
        if(item.usedcount==item.sharecount){
            obj.disabled=true
        }else{
            obj.disabled=false
        }
        finalResult.push(obj)
    })
    return finalResult
}

const getBingTokenList=async (req,res)=>{
    let {userId,role,roleNames}=req.user.userList
    try{
        await updateBingUsedCount()
        const results = await findBingTokens(roleNames, role);
        console.log(results);
       const finalResult= filterBingTokenList(results)
        return res.json({
            errorCode:'0000',
            message:'查询成功！',
            data:finalResult
        })
    }catch(error){
        res.json({
            errorCode: '500',
            message: '服务器错误!',
            data: error
        })
        throw error
    }
}

// 获取bard token下拉列表
const getBardUnofficalList=async (req,res)=>{
    let {userId,role,roleNames}=req.user.userList
    try{
        await updateBardUsedCount()
        const results = await findBardTokens(roleNames, role);
        console.log(results);
       const finalResult= filterBardTokenList(results)
        return res.json({
            errorCode:'0000',
            message:'查询成功！',
            data:finalResult
        })
    }catch(error){
        res.json({
            errorCode: '500',
            message: '服务器错误!',
            data: error
        })
        throw error
    }
}

const findBardTokens = async (roleNames, role) => {
    const query = bardlist.find({
        enablestatus: '启用',
        tokenstatus: '在线',
        $expr: {
          $lte: ['$usedcount', '$sharecount']
        }
      });

  if (role !== 0) {
    query.where('shareroles').in(roleNames);
  }
  const results = await query.exec();
  return results;
};

const filterBardTokenList = (results) => {
    let finalResult = [];
    results.forEach((item,index) => {
        let obj={
            id:item._id,
            token:encrypt(item.token),
            usedcount:item.usedcount,
            sharecount:item.sharecount,
            label:`bard-线路${index+1}`
        }
        if(item.usedcount==item.sharecount){
            obj.disabled=true
        }else{
            obj.disabled=false
        }
        finalResult.push(obj)
    })
    return finalResult
}
// 获取claude token下拉列表
const getClaudeTokenList=async (req,res)=>{
    let {userId,role,roleNames}=req.user.userList
    try{
        await updateClaudeUsedCount()
        const results = await findClaudeTokens(roleNames, role);
        console.log(results);
       const finalResult= filterClaudeTokenList(results)
        return res.json({
            errorCode:'0000',
            message:'查询成功！',
            data:finalResult
        })
    }catch(error){
        res.json({
            errorCode: '500',
            message: '服务器错误!',
            data: error
        })
        throw error
    }
}

const findClaudeTokens = async (roleNames, role) => {
    const query = claudelist.find({
        enablestatus: '启用',
        tokenstatus: '在线',
        $expr: {
          $lte: ['$usedcount', '$sharecount']
        }
      });

  if (role !== 0) {
    query.where('shareroles').in(roleNames);
  }
  const results = await query.exec();
  return results;
};
const filterClaudeTokenList = (results) => {
    let finalResult = [];
    results.forEach((item,index) => {
        let obj={
            id:item._id,
            type:item.type,
            token:encrypt(item.token),
            appid:encrypt(item.appid),
            usedcount:item.usedcount,
            sharecount:item.sharecount,
            label:`claude-${item.type}线路${index+1}`
        }
        if(item.usedcount==item.sharecount){
            obj.disabled=true
        }else{
            obj.disabled=false
        }
        finalResult.push(obj)
    })
    return finalResult
}

// 获取hugging token 下拉列表
const getHuggingUnofficalList=async (req,res)=>{
    let {userId,role,roleNames}=req.user.userList
    try{
        await updateHuggingUsedCount()
        const results = await findHuggingTokens(roleNames, role);
        console.log(results);
       const finalResult= filterHuggingTokenList(results)
        return res.json({
            errorCode:'0000',
            message:'查询成功！',
            data:finalResult
        })
    }catch(error){
        res.json({
            errorCode: '500',
            message: '服务器错误!',
            data: error
        })
        throw error
    }
}

const findHuggingTokens = async (roleNames, role) => {
    const query = hugginglist.find({
        enablestatus: '启用',
        tokenstatus: '在线',
        $expr: {
          $lte: ['$usedcount', '$sharecount']
        }
      });

  if (role !== 0) {
    query.where('shareroles').in(roleNames);
  }
  const results = await query.exec();
  return results;
};

const filterHuggingTokenList = (results) => {
    let finalResult = [];
    results.forEach((item,index) => {
        let obj={
            id:item._id,
            token:encrypt(item.token),
            usedcount:item.usedcount,
            sharecount:item.sharecount,
            label:`hugging-线路${index+1}`
        }
        if(item.usedcount==item.sharecount){
            obj.disabled=true
        }else{
            obj.disabled=false
        }
        finalResult.push(obj)
    })
    return finalResult
}

module.exports={
    getOfficalKeys,postOfficalKeys,getUnofficalKeys,postUnofficalKeys,getOfficalKeyList,
    getUnofficaltokenList,getBingTokenList,getBardUnofficalList,getClaudeTokenList,getHuggingUnofficalList
}