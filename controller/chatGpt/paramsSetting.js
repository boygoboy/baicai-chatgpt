const Counter = require('../../db/models/counterSchema')
const chatparam = require('../../db/models/chatgpt/chatParamsSchema')
const { computedMoney } = require('./utils/gptCommon')

const getChatParams = async (req, res) => {
    let {
        userId
    } = req.user.userList
    try{
        const result = await chatparam.find({
            userId
        })
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

const putChatParams = async (req, res) => {
      let {_id,chatchannel,model,url,enablecontext=true,proxyObj={
        proxytype:'',
        ip:'',
        port:0,
        username:'',
        password:''
  }}=req.body
  if(!_id||!chatchannel||!model||!url){
        return res.json({
            errorCode:'2002',
            message:'参数错误!',
            data:null
        })
  }
  try{
     const result=await chatparam.findOne({_id})
     if(!result){
        return res.json({
            errorCode:'2002',
            message:'该配置不存在!',
            data:null
        })
     }
     const paramRow=await chatparam.findOneAndUpdate({_id},{
        chatchannel,
        model,
        url,
        enablecontext,
        proxyObj
     })
     if(paramRow){
        return res.json({
            errorCode:'0000',
            message:'修改成功!',
            data:null
        })
     }
     return res.json({
        errorCode:'2002',
        message:'修改失败!',
        data:null
     })
  }catch(error){
     res.json({
        errorCode:'500',
        message:'服务器错误!',
        data:error
    })
    throw error
  }
}

const postChatParams = async (req, res) => {
      let {chatchannel,model,url,enablecontext=true,proxyObj={
            proxytype:'',
            ip:'',
            port:0,
            username:'',
            password:''
      }}=req.body
      let {
        userId
    } = req.user.userList
      try{
          if(!chatchannel||!model||!url){
              return res.json({
                  errorCode:'2002',
                  message:'参数错误!',
                  data:null
              })
          }
          const result = await chatparam.findOne({chatchannel,model})
          if(result){
            return res.json({
                errorCode:'2002',
                message:'配置已存在，不可重复添加!',
            })
          }
          const countResult= await Counter.findOne({id:'chatparamId'})
          if(!countResult){
            await Counter.create({
                "id":"chatparamId",
                "sequence_value":1
            })
          }
          const count = await Counter.findOneAndUpdate({ id: 'chatparamId' }, { $inc: { sequence_value: 1 } }, { new: true })
          const chatParam = await new chatparam({
            chatparamId:count.sequence_value,
            userId,
            chatchannel,
            model,
            url,
            enablecontext,
            proxyObj
        })
        await chatParam.save();
        return res.json({
            errorCode:'0000',
            message:'添加成功!',
            data:null
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

const deleteChatParams = async (req, res) => {
      let _id=req.params.id
      try{
          if(!_id){
                return res.json({
                    errorCode:'2002',
                    message:'参数错误!',
                    data:null
                })
          }
          const deletCount=await chatparam.deleteOne({_id})
          if(deletCount!=0){
            return res.json({
                errorCode:'0000',
                message:'删除成功!',
                data:null
            })
          }else{
            return res.json({
                errorCode:'2002',
                message:'删除失败!',
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
module.exports = {
    getChatParams,
    putChatParams,
    postChatParams,
    deleteChatParams
}