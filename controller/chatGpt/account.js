const Counter = require('../../db/models/counterSchema')
const chatparam = require('../../db/models/chatParmSchema')
const Role = require('../../db/models/roleSchema')
const User = require('../../db/models/userSchema')
const gptAccount = require('../../db/models/gptAccountSchema')
const pagerFun = require('../../utils/pager')
const axios = require('axios')
const {computedMoney,unfficalChatApiLive} =require('./utils/gptCommon')

const addAccountList=async (req,res)=>{
    let {accounttype,accountemail,accountpassword,accountsession,accesstoken,apikey,sharecount,shareroles,shareroleNames} = req.body
    //新增gptaccount
    if (!accounttype||!accountemail||(!accesstoken&&!apikey)||!sharecount||!shareroles) {
        return res.json({
            errorCode: '2002',
            message: '参数缺失!',
            data: null
        })
    }
    const result = await gptAccount.findOne({ $or: [{ accesstoken},{apikey}] })
    if (result) {
        return res.json({
            errorCode: '2002',
            message: '新增账号密钥或则accesstoken已存在!',
            data: null
        })
    }
    try {
        //这一步运行一次就可以注释掉，自增需要有个初始值
        const result = await Counter.findOne({ id: "gptaccountId" })
        if (!result) {
            await Counter.create({
                "id": "gptaccountId",
                "sequence_value": 0
            })
        }
        //处理自增userId
        const count = await Counter.findOneAndUpdate({ id: 'gptaccountId' }, { $inc: { sequence_value: 1 } }, { new: true })
    //    计算gpt账号表中其他数据
    //  获取当前账号资源的状态，消费金额和总金额
       if(accesstoken){
      let pass= await unfficalChatApiLive(accesstoken)
        if(!pass){
            return res.json({
                errorCode:'2002',
                message:'您添加的accesstoken无效',
                data:null
            })
        }
       }
       let apiKeyInfo=null
       if(apikey){
         apiKeyInfo= await computedMoney(apikey,7)
        if(!apiKeyInfo){
            return res.json({
                errorCode:'2002',
                message:'您添加的apikey无效',
                data:null
            })
        }
       }

       const gptaccount = await new gptAccount({
        gptaccountId: count.sequence_value,
        accounttype,
        accountemail,
        accountpassword,
        accountsession,
        accesstoken,
        apikey,
        sharecount,
        shareroles,
        usedcount:0,
        shareroleNames,
        endtime:null,
        isenable:true,
        accountstatus:'启用',
        quota:apiKeyInfo?apiKeyInfo.total:0,
        consumption:apiKeyInfo?apiKeyInfo.total_usage:0,
        balance:apiKeyInfo?apiKeyInfo.remain_money:0,
        history_usage:apiKeyInfo?apiKeyInfo.history_usage:[],
        keyList:[{
            key:apikey,
            name:'默认',
            created:Date.now(),
            last_use:Date.now(),
        }]

    })
    await gptaccount.save();
        return res.json({
            errorCode: '0000',
            message: '新增账号资源成功!',
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

const  editAccountList=async (req,res)=>{
    let {_id,accounttype,accountemail,accountpassword,accountsession,accesstoken,apikey,sharecount,shareroles,shareroleNames} = req.body
    if (!accounttype||!accountemail||(!accesstoken&&!apikey)||!sharecount||!shareroles) {
        return res.json({
            errorCode: '2002',
            message: '参数缺失!',
            data: null
        })
    }    
    try {
        const result =await gptAccount.findOne({
            $and: [
              { $or: [{ accesstoken }, { apikey }] },
              { _id: { $ne: _id } }
            ]
          });
        if (result) {
            return res.json({
                errorCode: '2002',
                message: '修改的账号密钥或则accesstoken已存在!',
                data: null
            })
        }

        //这里更新的时候需要判断分享人数要大于等于已经分享的人数
         let filterResult= await gptAccount.findOne({_id})
         if(sharecount<filterResult.usedcount){
            return res.json({
                errorCode: '2002',
                message: '分享人数不能小于已经分享的人数!',
                data: null
            })
         }

             //  获取当前账号资源的状态，消费金额和总金额
       if(accesstoken){
        let pass= await unfficalChatApiLive(accesstoken)
          if(!pass){
              return res.json({
                  errorCode:'2002',
                  message:'您添加的accesstoken无效',
                  data:null
              })
          }
         }
         let apiKeyInfo=null
         if(apikey){
           apiKeyInfo= await computedMoney(apikey,7)
          if(!apiKeyInfo){
              return res.json({
                  errorCode:'2002',
                  message:'您添加的apikey无效',
                  data:null
              })
          }
         }

         filterResult.keyList.forEach(item=>{
            if(item.key==apikey){
                item.key=apikey
                item.name='默认'
                item.created=Date.now()
                item.last_use=Date.now()
            }
         })

        const accountList = await gptAccount.findOneAndUpdate({ _id }, {
            accounttype,accountemail,accountpassword,accountsession,accesstoken,
            apikey,sharecount,shareroles,shareroleNames,
            quota:apiKeyInfo?apiKeyInfo.total:0,
            consumption:apiKeyInfo?apiKeyInfo.total_usage:0,
            balance:apiKeyInfo?apiKeyInfo.remain_money:0,
            history_usage:apiKeyInfo?apiKeyInfo.history_usage:[],
            keyList:filterResult.keyList
        })
        if (accountList) {
            return res.json({
                errorCode: '0000',
                message: '修改账号资源成功!',
                data:null
            })
        }
        return res.json({
            errorCode: '9999',
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

const getAccountList=async (req,res)=>{
//    let result= await computedMoney('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',7)
//    console.log(JSON.stringify(result))

   let { accounttype,accountemail,accesstoken,apikey,accountstatus, pageNum, pageSize }=req.query
   let pager = {}
   let params = {}
   if(accounttype)params.accounttype=accounttype
   if(accountemail)params.accountemail=accountemail
    if(accesstoken)params.accesstoken=accesstoken
    if(apikey)params.apikey=apikey
    if(accountstatus)params.accountstatus=accountstatus
   try{
       const query = gptAccount.find(params)
       const accountlist = await query.skip(pagerFun(pageNum, pageSize).skipIndex).limit(pagerFun(pageNum, pageSize).pager.pageSize)
       const total = await gptAccount.countDocuments(params)
       pager.total = total
       pager.pageNum = parseInt(pageNum)
       console.log(accountlist)
       if (accountlist) { 
           return res.json({
               errorCode: '0000',
               message: '查询gpt资源列表成功!',
               data: { accountlist, pager }
           })
    }
       return res.json({
           errorCode: '9999',
           message: '查询gpt资源列表失败!',
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

const deleteAccountList=async (req,res)=>{

    let _ids = req.params.ids.split(',');
     
    if (_ids.length==0) {
        return res.json({
            errorCode: '2002',
            message: '参数错误!',
            data: null
        })
    }
    const results = await gptAccount.find({ _id: { $in: _ids } });
    if(results.length==0){
        return res.json({
            errorCode: '2002',
            message: '账号资源不存在!',
            data: null
        })
    }

   if(results.findIndex(item=>item.isenable)!=-1){
        return res.json({
            errorCode: '2002',
            message: '存在账号资源已经启用，不能删除!',
            data: null
        })
   }
    //_id接收数组
    try {
        const result = await gptAccount.deleteMany({ _id: { $in: _ids } })
        return res.json({
            errorCode: '200',
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

const addApiKey=async (req,res)=>{

}
const  deleteApiKey = async (req,res)=>{

}
const getApiKey =async (req,res)=>{

}
module.exports = {
    addAccountList, editAccountList, getAccountList, deleteAccountList,addApiKey,deleteApiKey,getApiKey
}