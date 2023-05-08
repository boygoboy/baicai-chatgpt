const Counter = require('../../db/models/counterSchema')
const officalkeys = require('../../db/models/chatgpt/keyOfficalSchema')
const unofficalkeys = require('../../db/models/chatgpt/keyUnOfficalSchema')
const keylist =require('../../db/models/chatgpt/keyListSchema')
const {encrypt,decrypt}=require('../../utils/encryption')
const fixedKeyHex = '8a7c2f4d6a3e1b9c0d5f8e8g4c9a1b2c3d4e5f6a7b8c9d0e';
const fixedKey = Buffer.from(fixedKeyHex, 'hex');
const getOfficalKeys=async (req,res)=>{
    let {userId}=req.user.userList
    console.log(req.user.userList)
    try{
        const result=await officalkeys.findOne({userId})
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
    let {_id,chatgpt3Key,chatgpt4Key}=req.body
    let {userId}=req.user.userList
    try{
        const countResult= await Counter.findOne({id:'officalkeyId'})
        if(!countResult){
          await Counter.create({
              "id":"officalkeyId",
              "sequence_value":1
          })
        }
        chatgpt3Key=decrypt(chatgpt3Key)

        const count = await Counter.findOneAndUpdate({ id: 'officalkeyId' }, { $inc: { sequence_value: 1 } }, { new: true })
        if(!_id){
            try{
                const officalKeys = await new officalkeys({
                    officalkeyId:count.sequence_value,
                    userId,
                    chatgpt3Key: chatgpt3Key,
                    chatgpt4Key
                })
                await officalKeys.save();
                return res.json({
                    errorCode:'0000',
                    message:'保存密钥成功!',
                    data:null
              })
            }catch(error){
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
                return res.json({
                    errorCode:'0000',
                    message:'修改成功!',
                    data:null
                })
            }else{
                return res.json({
                    errorCode:'2002',
                    message:'保存密钥失败!',
                    data:null
                })
            }
    }catch(error){
        res.json({
            errorCode: '500',
            message: '服务器错误!',
            data: error
        })
        throw error
    }
}

const getUnofficalKeys=async (req,res)=>{
    let {userId}=req.user.userList
    try{
        const result=await unofficalkeys.findOne({userId})
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
      let {_id,accesstoken3,accesstoken4,newbingKey}=req.body
        let {userId}=req.user.userList
        try{
            const countResult= await Counter.findOne({id:'unofficalkeyId'})
            if(!countResult){
              await Counter.create({
                  "id":"unofficalkeyId",
                  "sequence_value":1
              })
            }
            const count = await Counter.findOneAndUpdate({ id: 'unofficalkeyId' }, { $inc: { sequence_value: 1 } }, { new: true })
           if(!_id){
              try{
                const unofficalKeys = await new unofficalkeys({
                    unofficalkeyId:count.sequence_value,
                    userId,
                    accesstoken3,
                    accesstoken4,
                    newbingKey
                })
                await unofficalKeys.save();
                return res.json({
                    errorCode:'0000',
                    message:'保存密钥成功!',
                    data:null
              })
              }catch(error){
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
                newbingKey
              })
              if(row){
                return res.json({
                    errorCode:'0000',
                    message:'保存密钥成功!',
                    data:null
                })
              }else{
                return res.json({
                    errorCode:'2002',
                    message:'保存密钥失败!',
                    data:null
                })
              }
        }catch(error){
            res.json({
                errorCode: '500',
                message: '服务器错误!',
                data: error
            })
            throw error
        }
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
          $lt: ['$usedcount', '$sharecount']
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




module.exports={
    getOfficalKeys,postOfficalKeys,getUnofficalKeys,postUnofficalKeys,getOfficalKeyList
}