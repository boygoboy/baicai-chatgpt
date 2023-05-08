const Counter = require('../../db/models/counterSchema')
const keyOffical = require('../../db/models/chatgpt/keyOfficalSchema')
const keyUnOffical = require('../../db/models/chatgpt/keyUnOfficalSchema')
const Role = require('../../db/models/roleSchema')
const User = require('../../db/models/userSchema')
const tokenlist = require('../../db/models/chatgpt/tokenListSchema')
const pagerFun = require('../../utils/pager')
const axios = require('axios')
const {unfficalChatApiLive,sessionIsLive} =require('./utils/gptCommon')
const {updateTokenStatus,updateTokenAndSessionStatus}=require('../../utils/timedTask')

const getTokenList=async(req,res)=>{
    let { type,email,tokenstatus,sessionstatus, pageNum, pageSize }=req.query
    let pager = {}
    let params = {}
    if(type)params.type=type
    if(email)params.email=email
     if(tokenstatus)params.tokenstatus=tokenstatus
     if(sessionstatus)params.sessionstatus=sessionstatus
    try{
        updateTokenStatus()
        updateTokenAndSessionStatus()
        const query = tokenlist.find(params)
        const tokenList = await query.skip(pagerFun(pageNum, pageSize).skipIndex).limit(pagerFun(pageNum, pageSize).pager.pageSize)
        const total = await tokenlist.countDocuments(params)
        pager.total = total
        pager.pageNum = parseInt(pageNum)
        if (tokenList) { 
            return res.json({
                errorCode: '0000',
                message: '查询token资源列表成功!',
                data: { tokenList, pager }
            })
     }
        return res.json({
            errorCode: '2002',
            message: '查询token资源列表失败!',
            data:null
        })
    }catch(error){
        res.json({
            errorCode: '500',
            message: '服务器错误!',
            data: error
        })
    }
}
const postTokenList=async(req,res)=>{
    let {type,email,password,token,session,sharecount,shareroles,shareroleNames,endtime} = req.body
    //新增gptaccount
    if (!type||!email||!password||!token||!session||!sharecount||!shareroles,!shareroleNames) {
        return res.json({
            errorCode: '2002',
            message: '参数缺失!',
            data: null
        })
    }
    const result = await tokenlist.findOne({token})
    if (result) {
        return res.json({
            errorCode: '2002',
            message: '新建token已存在!',
            data: null
        })
    }
    const result1 = await tokenlist.findOne({session})
    if (result1) {
        return res.json({
            errorCode: '2002',
            message: '新建session已存在!',
            data: null
        })
    }
    try {
        //这一步运行一次就可以注释掉，自增需要有个初始值
        const result = await Counter.findOne({ id: "tokenListId" })
        if (!result) {
            await Counter.create({
                "id": "tokenListId",
                "sequence_value": 0
            })
        }
        //处理自增userId
        const count = await Counter.findOneAndUpdate({ id: 'tokenListId' }, { $inc: { sequence_value: 1 } }, { new: true })
    //    计算gpt账号表中其他数据
    //  获取当前账号资源的状态，消费金额和总金额
       if(token){
         let islive= await unfficalChatApiLive(token)
        if(!islive){
            return res.json({
                errorCode:'2002',
                message:'您添加的token无效',
                data:null
            })
        }
       }
       if(session){
        let islive= await sessionIsLive(session)
         if(!islive){
                return res.json({
                    errorCode:'2002',
                    message:'您添加的session无效',
                    data:null
                })
         }
       }

       const tokenList = await new tokenlist({
        tokenListId: count.sequence_value,
        type,
        email,
        password,
        token,
        session,
        sharecount,
        shareroles,
        usedcount:0,
        shareroleNames,
        endtime,
        enablestatus:'启用',
        tokenstatus:'在线',
        sessionstatus:'在线',
    })
    try{
        await tokenList.save();
        return res.json({
            errorCode: '0000',
            message: '新增token资源成功!',
            data: null
        })
    }catch(error){
        res.json({
            errorCode: '2002',
            message: '新增token资源失败!',
            data: error
        })
    }
    } catch (error) {
         res.json({
            errorCode: '500',
            message: '服务器错误!',
            data: error
        })
        throw error
    }
}
const putTokenList=async (req,res)=>{
    let {_id,type,email,password,token,session,sharecount,shareroles,shareroleNames,endtime} = req.body
    if (!_id||!type||!email||!password||!token||!session||!sharecount||!shareroles,!shareroleNames) {
        return res.json({
            errorCode: '2002',
            message: '参数缺失!',
            data: null
        })
    }    
    try {
        const result =await tokenlist.findOne({
            $and: [
              { token},
              { _id: { $ne: _id } }
            ]
          });

        if (result) {
            return res.json({
                errorCode: '2002',
                message: '修改的token已存在!',
                data: null
            })
        }
        const result1 =await tokenlist.findOne({
            $and: [
              { session},
              { _id: { $ne: _id } }
            ]
          });

        if (result1) {
            return res.json({
                errorCode: '2002',
                message: '修改的session已存在!',
                data: null
            })
        }

        //这里更新的时候需要判断分享人数要大于等于已经分享的人数
         let filterResult= await tokenlist.findOne({_id})
         if(sharecount<filterResult.usedcount){
            return res.json({
                errorCode: '2002',
                message: '分享人数不能小于已经分享的人数!',
                data: null
            })
         }
             //  获取当前账号资源的状态
         if(token){
            let islive= await unfficalChatApiLive(token)
          if(!islive){
              return res.json({
                  errorCode:'2002',
                  message:'您添加的token无效',
                  data:null
              })
          }
         }

         if(session){
            let islive= await sessionIsLive(session)
             if(!islive){
                    return res.json({
                        errorCode:'2002',
                        message:'您添加的session无效',
                        data:null
                    })
             }
           }

        const tokenList = await tokenlist.findOneAndUpdate({ _id }, {
            type,
            email,
            password,
            token,
            session,
            sharecount,
            shareroles,
            shareroleNames,
            endtime,
            tokenstatus:'在线',
            sessionstatus:'在线',
        })
        if (tokenList) {
            return res.json({
                errorCode: '0000',
                message: '修改token资源成功!',
                data:null
            })
        }
        return res.json({
            errorCode: '2002',
            message: '修改token资源失败!',
            data: null
        })
    } catch (error) {
        return res.json({
            errorCode: '500',
            message: '服务器错误!',
            data: error
        })
    }
}

const getTokenDetail=async(req,res)=>{
    let _id = req.params.id;
    if (!_id) {
        return res.json({
            errorCode: '2002',
            message: '参数缺失!',
            data: null
        })
    }
    try{
        const result = await tokenlist.findOne({_id})
        if(result){
            return res.json({
                errorCode: '0000',
                message: '查询token资源成功!',
                data: result
            })
        }
        return res.json({
            errorCode: '2002',
            message: '获取token资源失败!',
            data: null
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

const deleteTokenList=async (req,res)=>{
    let _ids = req.params.ids.split(',');
    if (_ids.length==0) {
        return res.json({
            errorCode: '2002',
            message: '参数错误!',
            data: null
        })
    }
    const results = await tokenlist.find({ _id: { $in: _ids } });
    if(results.length==0){
        return res.json({
            errorCode: '2002',
            message: '账号资源不存在!',
            data: null
        })
    }

   if(results.findIndex(item=>item.enablestatus=='启用')!=-1){
        return res.json({
            errorCode: '2002',
            message: '存在token资源已经启用，不能删除!',
            data: null
        })
   }
    //_id接收数组
    try {
        const result = await tokenlist.deleteMany({ _id: { $in: _ids } })
        return res.json({
            errorCode: '0000',
            message: `删除成功${result.deletedCount}条`,
            data: null
        })
    } catch (error) {
        res.json({
            errorCode: '500',
            message: '服务器错误!',
            data: error
        })
        throw error
    }
}

const changeEnableStatus=async (req,res)=>{
    let {_id,enablestatus} = req.body
    if (!_id||!enablestatus) {
        return res.json({
            errorCode: '2002',
            message: '参数缺失!',
            data: null
        })
    }
    try {
        const result = await tokenlist.findOneAndUpdate({ _id }, { enablestatus})
        if (result) {
            return res.json({
                errorCode: '0000',
                message: '修改token资源状态成功!',
                data:null
            })
        }
        return res.json({
            errorCode: '2002',
            message: '修改token资源状态失败!',
            data: null
        })
    } catch (error) {
        return res.json({
            errorCode: '500',
            message: '服务器错误!',
            data: error
        })
    }
}

// 获取token
const loginToken=async (req,res)=>{
     let {email,password}=req.body
        if(!email||!password){
            return res.json({
                errorCode:'2002',
                message:'参数缺失!',
                data:null
            })
        }
        try{
            let config = {
                method: "POST",
                baseURL: `${process.env.CHAT_GPT_API}/chatgpt/login`,
                headers: {
                    'content-type': 'application/json',
                },
                data: {
                    username:email,
                    password
                  }
            }
            let response = await axios(config)
            if(response.status==200){
                return res.json({
                    errorCode:'0000',
                    message:'获取token成功!',
                    data:response.data
                })
            }else{
                return res.json({
                    errorCode:'2002',
                    message:'获取token失败!',
                    data:response.data
                })
            }
        }catch(error){
            return res.json({
                errorCode:'500',
                message:'服务器错误!',
                data:error
            })
        }
}

// 获取session
const loginSession=async (req,res)=>{
    let {email,password}=req.body
    if(!email||!password){
        return res.json({
            errorCode:'2002',
            message:'参数缺失!',
            data:null
        })
    }
    try{
        let config = {
            method: "POST",
            baseURL: `${process.env.CHAT_GPT_API}/platform/login`,
            headers: {
                'content-type': 'application/json',
            },
            data: {
                username:email,
                password
              }
        }
        let response = await axios(config)
        if(response.status==200){
            return res.json({
                errorCode:'0000',
                message:'获取session成功!',
                data:response.data
            })
        }else{
            return res.json({
                errorCode:'2002',
                message:'获取session失败!',
                data:response.data
            })
        }
    }catch(error){
        return res.json({
            errorCode:'500',
            message:'服务器错误!',
            data:error
        })
    }
}

module.exports={
    getTokenList,postTokenList,putTokenList,deleteTokenList,getTokenDetail,changeEnableStatus,
    loginToken,loginSession
}