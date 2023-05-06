const Counter = require('../../db/models/counterSchema')
const officalkeys = require('../../db/models/chatgpt/keyOfficalSchema')
const unofficalkeys = require('../../db/models/chatgpt/keyUnOfficalSchema')

const getOfficalKeys=async (req,res)=>{
    let {userId}=req.user.userList
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
        const count = await Counter.findOneAndUpdate({ id: 'officalkeyId' }, { $inc: { sequence_value: 1 } }, { new: true })
        if(!_id){
            try{
                const officalKeys = await new officalkeys({
                    officalkeyId:count.sequence_value,
                    userId,
                    chatgpt3Key,
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


module.exports={
    getOfficalKeys,postOfficalKeys,getUnofficalKeys,postUnofficalKeys
}