const Counter = require('../../db/models/counterSchema')
const claudeList = require('../../db/models/chatgpt/claudeListSchema')
const pagerFun = require('../../utils/pager')
const {claudeceIsLive} =require('./utils/gptCommon')
const {updateClaudeUsedCount}=require('../../utils/timedTask')

const getClaudeList=async(req,res)=>{
    let {type, email,enablestatus,tokenstatus, pageNum, pageSize }=req.query
    let pager = {}
    let params = {}
    if(type)params.type=type
    if(email)params.email=email
     if(enablestatus)params.enablestatus=enablestatus
        if(tokenstatus)params.tokenstatus=tokenstatus
    try{
        updateClaudeUsedCount()
        const query =  claudeList.find(params)
        const claudelist = await query.skip(pagerFun(pageNum, pageSize).skipIndex).limit(pagerFun(pageNum, pageSize).pager.pageSize)
        const total = await claudeList.countDocuments(params)
        pager.total = total
        pager.pageNum = parseInt(pageNum)
        if (claudelist) { 
            return res.json({
                errorCode: '0000',
                message: '查询claude资源列表成功!',
                data: { claudelist, pager }
            })
     }
        return res.json({
            errorCode: '2002',
            message: '查询claude资源列表失败!',
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
const postClaudeList=async(req,res)=>{
    let {type,email,password,token,appid,sharecount,shareroles,shareroleNames,endtime} = req.body
    //新增gptaccount
    if (!type||!email||!password||!token||!appid||!sharecount||!shareroles,!shareroleNames) {
        return res.json({
            errorCode: '2002',
            message: '参数缺失!',
            data: null
        })
    }
    const result = await claudeList.findOne({token})
    if (result) {
        return res.json({
            errorCode: '2002',
            message: '新建token已存在!',
            data: null
        })
    }
    try {
        //这一步运行一次就可以注释掉，自增需要有个初始值
        const result = await Counter.findOne({ id: "claudeListId" })
        if (!result) {
            await Counter.create({
                "id": "claudeListId",
                "sequence_value": 0
            })
        }
       let islive= claudeceIsLive(token,appid)
       if(!islive){
        return res.json({
            errorCode: '2002',
            message: 'token不可用!',
            data: null
        })
       }
        //处理自增userId
        const count = await Counter.findOneAndUpdate({ id: 'claudeListId' }, { $inc: { sequence_value: 1 } }, { new: true })
        const claudelist = await new claudeList({
         claudeListId: count.sequence_value,
         type,
        email,
        password,
        token,
        appid,
        sharecount,
        shareroles,
        usedcount:0,
        shareroleNames,
        endtime,
        enablestatus:'启用',
        tokenstatus:'在线'
    })
    try{
        await claudelist.save();
        return res.json({
            errorCode: '0000',
            message: '新增claude资源成功!',
            data: null
        })
    }catch(error){
        res.json({
            errorCode: '2002',
            message: '新增claude资源失败!',
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
const putClaudeList=async (req,res)=>{
    let {_id,type,email,password,token,appid,sharecount,shareroles,shareroleNames,endtime} = req.body
    if (!_id||!type||!email||!password||!token||!appid||!sharecount||!shareroles,!shareroleNames) {
        return res.json({
            errorCode: '2002',
            message: '参数缺失!',
            data: null
        })
    }    
    try {
        const result =await claudeList.findOne({
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

        //这里更新的时候需要判断分享人数要大于等于已经分享的人数
         let filterResult= await claudeList.findOne({_id})
         if(sharecount<filterResult.usedcount){
            return res.json({
                errorCode: '2002',
                message: '分享人数不能小于已经分享的人数!',
                data: null
            })
         }

         let islive= await claudeceIsLive(token,appid)
         if(!islive){
          return res.json({
              errorCode: '2002',
              message: 'token不可用!',
              data: null
          })
         }

        const claudelist = await claudeList.findOneAndUpdate({ _id }, {
            type,
            email,
            password,
            token,
            appid,
            sharecount,
            shareroles,
            shareroleNames,
            tokenstatus:'在线',
            endtime
        })
        if (claudelist) {
            return res.json({
                errorCode: '0000',
                message: '修改claude资源成功!',
                data:null
            })
        }
        return res.json({
            errorCode: '2002',
            message: '修改claude资源失败!',
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

const getClaudeDetail=async(req,res)=>{
    let _id = req.params.id;
    if (!_id) {
        return res.json({
            errorCode: '2002',
            message: '参数缺失!',
            data: null
        })
    }
    try{
        const result = await claudeList.findOne({_id})
        if(result){
            return res.json({
                errorCode: '0000',
                message: '查询claude资源成功!',
                data: result
            })
        }
        return res.json({
            errorCode: '2002',
            message: '获取claude资源失败!',
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

const deleteClaudeList=async (req,res)=>{
    let _ids = req.params.ids.split(',');
    if (_ids.length==0) {
        return res.json({
            errorCode: '2002',
            message: '参数错误!',
            data: null
        })
    }
    const results = await claudeList.find({ _id: { $in: _ids } });
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
        const result = await claudeList.deleteMany({ _id: { $in: _ids } })
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

const changeClaudeStatus=async (req,res)=>{
    let {_id,enablestatus} = req.body
    if (!_id||!enablestatus) {
        return res.json({
            errorCode: '2002',
            message: '参数缺失!',
            data: null
        })
    }
    try {
        const result = await claudeList.findOneAndUpdate({ _id }, { enablestatus})
        if (result) {
            return res.json({
                errorCode: '0000',
                message: '修改claude资源状态成功!',
                data:null
            })
        }
        return res.json({
            errorCode: '2002',
            message: '修改claude资源状态失败!',
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
    getClaudeList,postClaudeList,putClaudeList,getClaudeDetail,deleteClaudeList,changeClaudeStatus,
}