const Counter = require('../../db/models/counterSchema')
const keyOffical = require('../../db/models/chatgpt/keyOfficalSchema')
const keyUnOffical = require('../../db/models/chatgpt/keyUnOfficalSchema')
const Role = require('../../db/models/roleSchema')
const User = require('../../db/models/userSchema')
const keylist = require('../../db/models/chatgpt/keyListSchema')
const pagerFun = require('../../utils/pager')
const axios = require('axios')
const {computedMoney,unfficalChatApiLive} =require('./utils/gptCommon')
const {updateAccountStatusOnce,updateGptAccountStatusOnce}=require('../../utils/timedTask')

const getKeyList=async(req,res)=>{
    let { type,email,key,keystatus, pageNum, pageSize }=req.query
    let pager = {}
    let params = {}
    if(type)params.type=type
    if(email)params.email=email
     if(key)params.key=key
     if(keystatus)params.keystatus=keystatus
    try{
        updateAccountStatusOnce()
        // updateGptAccountStatusOnce()
        const query = keylist.find(params)
        const keyList = await query.skip(pagerFun(pageNum, pageSize).skipIndex).limit(pagerFun(pageNum, pageSize).pager.pageSize)
        const total = await keylist.countDocuments(params)
        pager.total = total
        pager.pageNum = parseInt(pageNum)
        if (keyList) { 
            return res.json({
                errorCode: '0000',
                message: '查询key资源列表成功!',
                data: { keyList, pager }
            })
     }
        return res.json({
            errorCode: '2002',
            message: '查询key资源列表失败!',
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
const postKeyList=async(req,res)=>{
    let {type,email,password,key,sharecount,shareroles,shareroleNames,endtime} = req.body
    //新增gptaccount
    if (!type||!email||!password||!key||!sharecount||!shareroles,!shareroleNames) {
        return res.json({
            errorCode: '2002',
            message: '参数缺失!',
            data: null
        })
    }
    const result = await keylist.findOne({key})
    if (result) {
        return res.json({
            errorCode: '2002',
            message: '新建key密钥已存在!',
            data: null
        })
    }
    try {
        //这一步运行一次就可以注释掉，自增需要有个初始值
        const result = await Counter.findOne({ id: "keyListId" })
        if (!result) {
            await Counter.create({
                "id": "keyListId",
                "sequence_value": 0
            })
        }
        //处理自增userId
        const count = await Counter.findOneAndUpdate({ id: 'keyListId' }, { $inc: { sequence_value: 1 } }, { new: true })
    //    计算gpt账号表中其他数据
    //  获取当前账号资源的状态，消费金额和总金额
       let apiKeyInfo=null
       if(key){
         apiKeyInfo= await computedMoney(key,7)
        if(!apiKeyInfo){
            return res.json({
                errorCode:'2002',
                message:'您添加的key无效',
                data:null
            })
        }
       }
       let keystatus='启用'
       if(apiKeyInfo.remain_money<0.5){
        keystatus='失效'
       }
       const keyList = await new keylist({
        keyListId: count.sequence_value,
        type,
        email,
        password,
        key,
        sharecount,
        shareroles,
        usedcount:0,
        shareroleNames,
        endtime,
        isenable:true,
        keystatus:keystatus,
        quota:apiKeyInfo?apiKeyInfo.total:0,
        consumption:apiKeyInfo?apiKeyInfo.total_usage:0,
        balance:apiKeyInfo?apiKeyInfo.remain_money:0,
        history_usage:apiKeyInfo?apiKeyInfo.history_usage:[],
    })
    try{
        await keyList.save();
        return res.json({
            errorCode: '0000',
            message: '新增key资源成功!',
            data: null
        })
    }catch(error){
        res.json({
            errorCode: '2002',
            message: '新增key资源失败!',
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
const putKeyList=async (req,res)=>{
    let {_id,type,email,password,key,sharecount,shareroles,shareroleNames,endtime} = req.body
    if (!_id||!type||!email||!password||!key||!sharecount||!shareroles,!shareroleNames) {
        return res.json({
            errorCode: '2002',
            message: '参数缺失!',
            data: null
        })
    }    
    try {
        const result =await keylist.findOne({
            $and: [
              { key},
              { _id: { $ne: _id } }
            ]
          });

        if (result) {
            return res.json({
                errorCode: '2002',
                message: '修改的key密钥已存在!',
                data: null
            })
        }

        //这里更新的时候需要判断分享人数要大于等于已经分享的人数
         let filterResult= await keylist.findOne({_id})
         if(sharecount<filterResult.usedcount){
            return res.json({
                errorCode: '2002',
                message: '共享人数不能小于已经分享的人数!',
                data: null
            })
         }
             //  获取当前账号资源的状态，消费金额和总金额
         let apiKeyInfo=null
         if(key){
           apiKeyInfo= await computedMoney(key,7)
          if(!apiKeyInfo){
              return res.json({
                  errorCode:'2002',
                  message:'您添加的api密钥',
                  data:null
              })
          }
         }

         let keystatus='启用'
         const keyresult=await keylist.findOne({_id})
         if(keyresult){
            if(!keyresult.isenable){
                keystatus='禁用'
            }
         }

         if(apiKeyInfo.remain_money<0.5){
            keystatus='失效'
           }

        const keyList = await keylist.findOneAndUpdate({ _id }, {
            type,email,password,endtime,
            key,sharecount,shareroles,shareroleNames,
            keystatus:keystatus,
            quota:apiKeyInfo?apiKeyInfo.total:0,
            consumption:apiKeyInfo?apiKeyInfo.total_usage:0,
            balance:apiKeyInfo?apiKeyInfo.remain_money:0,
            history_usage:apiKeyInfo?apiKeyInfo.history_usage:[],
        })
        if (keyList) {
            return res.json({
                errorCode: '0000',
                message: '修改账号资源成功!',
                data:null
            })
        }
        return res.json({
            errorCode: '2002',
            message: '修改账号资源失败!',
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

const getKeyDetail=async(req,res)=>{
    let _id = req.params.id;
    if (!_id) {
        return res.json({
            errorCode: '2002',
            message: '参数缺失!',
            data: null
        })
    }
    try{
        const result = await keylist.findOne({_id})
        if(result){
            return res.json({
                errorCode: '0000',
                message: '查询账号资源成功!',
                data: result
            })
        }
        return res.json({
            errorCode: '2002',
            message: '获取账号资源失败!',
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

const deleteKeyList=async (req,res)=>{
    let _ids = req.params.ids.split(',');
    if (_ids.length==0) {
        return res.json({
            errorCode: '2002',
            message: '参数错误!',
            data: null
        })
    }
    const results = await keylist.find({ _id: { $in: _ids } });
    if(results.length==0){
        return res.json({
            errorCode: '2002',
            message: '账号资源不存在!',
            data: null
        })
    }

   if(results.findIndex(item=>item.keystatus=='启用')!=-1){
        return res.json({
            errorCode: '2002',
            message: '存在账号资源已经启用，不能删除!',
            data: null
        })
   }
    //_id接收数组
    try {
        const result = await keylist.deleteMany({ _id: { $in: _ids } })
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

const changeKeyStatus=async (req,res)=>{
    let {_id,keystatus} = req.body
    if (!_id||!keystatus) {
        return res.json({
            errorCode: '2002',
            message: '参数缺失!',
            data: null
        })
    }
    try {
        const result = await keylist.findOneAndUpdate({ _id }, { keystatus,isenable:keystatus=='启用'?true:false })
        if (result) {
            return res.json({
                errorCode: '0000',
                message: '修改key资源状态成功!',
                data:null
            })
        }
        return res.json({
            errorCode: '2002',
            message: '修改key资源状态失败!',
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

module.exports={
    getKeyList,postKeyList,putKeyList,deleteKeyList,getKeyDetail,changeKeyStatus
}