const Counter = require('../../db/models/counterSchema')
const huggingList = require('../../db/models/chatgpt/huggingListSchema')
const pagerFun = require('../../utils/pager')
const {huggingIsLive} =require('./utils/gptCommon')
const {updateHuggingUsedCount}=require('../../utils/timedTask')

const getHuggingList=async(req,res)=>{
    let {type, email,enablestatus,tokenstatus, pageNum, pageSize }=req.query
    let pager = {}
    let params = {}
    if(type)params.type=type
    if(email)params.email=email
     if(enablestatus)params.enablestatus=enablestatus
        if(tokenstatus)params.tokenstatus=tokenstatus
    try{
        updateHuggingUsedCount()
        const query =  huggingList.find(params)
        const hugginglist = await query.skip(pagerFun(pageNum, pageSize).skipIndex).limit(pagerFun(pageNum, pageSize).pager.pageSize)
        const total = await huggingList.countDocuments(params)
        pager.total = total
        pager.pageNum = parseInt(pageNum)
        if (hugginglist) { 
            return res.json({
                errorCode: '0000',
                message: '查询hugging资源列表成功!',
                data: { hugginglist, pager }
            })
     }
        return res.json({
            errorCode: '2002',
            message: '查询hugging资源列表失败!',
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
const postHuggingList=async(req,res)=>{
    let {type,email,password,token,sharecount,shareroles,shareroleNames,endtime} = req.body
    //新增gptaccount
    if (!type||!email||!password||!token||!sharecount||!shareroles,!shareroleNames) {
        return res.json({
            errorCode: '2002',
            message: '参数缺失!',
            data: null
        })
    }
    const result = await huggingList.findOne({token})
    if (result) {
        return res.json({
            errorCode: '2002',
            message: '新建token已存在!',
            data: null
        })
    }
    try {
        //这一步运行一次就可以注释掉，自增需要有个初始值
        const result = await Counter.findOne({ id: "huggingListId" })
        if (!result) {
            await Counter.create({
                "id": "huggingListId",
                "sequence_value": 0
            })
        }
       let islive= huggingIsLive(token,appid)
       if(!islive){
        return res.json({
            errorCode: '2002',
            message: 'token不可用!',
            data: null
        })
       }
        //处理自增userId
        const count = await Counter.findOneAndUpdate({ id: 'huggingListId' }, { $inc: { sequence_value: 1 } }, { new: true })
        const hugginglist = await new huggingList({
        huggingListId: count.sequence_value,
         type,
        email,
        password,
        token,
        sharecount,
        shareroles,
        usedcount:0,
        shareroleNames,
        endtime,
        enablestatus:'启用',
        tokenstatus:'在线'
    })
    try{
        await hugginglist.save();
        return res.json({
            errorCode: '0000',
            message: '新增hugging资源成功!',
            data: null
        })
    }catch(error){
        res.json({
            errorCode: '2002',
            message: '新增hugging资源失败!',
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
const putHuggingList=async (req,res)=>{
    let {_id,type,email,password,token,sharecount,shareroles,shareroleNames,endtime} = req.body
    if (!_id||!type||!email||!password||!token||!sharecount||!shareroles,!shareroleNames) {
        return res.json({
            errorCode: '2002',
            message: '参数缺失!',
            data: null
        })
    }    
    try {
        const result =await huggingList.findOne({
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
         let filterResult= await huggingList.findOne({_id})
         if(sharecount<filterResult.usedcount){
            return res.json({
                errorCode: '2002',
                message: '分享人数不能小于已经分享的人数!',
                data: null
            })
         }

         let islive= await huggingIsLive(token,appid)
         if(!islive){
          return res.json({
              errorCode: '2002',
              message: 'token不可用!',
              data: null
          })
         }

        const hugginglist = await huggingList.findOneAndUpdate({ _id }, {
            type,
            email,
            password,
            token,
            sharecount,
            shareroles,
            shareroleNames,
            tokenstatus:'在线',
            endtime
        })
        if (hugginglist) {
            return res.json({
                errorCode: '0000',
                message: '修改hugging资源成功!',
                data:null
            })
        }
        return res.json({
            errorCode: '2002',
            message: '修改hugging资源失败!',
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

const getHuggingDetail=async(req,res)=>{
    let _id = req.params.id;
    if (!_id) {
        return res.json({
            errorCode: '2002',
            message: '参数缺失!',
            data: null
        })
    }
    try{
        const result = await huggingList.findOne({_id})
        if(result){
            return res.json({
                errorCode: '0000',
                message: '查询hugging资源成功!',
                data: result
            })
        }
        return res.json({
            errorCode: '2002',
            message: '获取hugging资源失败!',
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

const deleteHuggingList=async (req,res)=>{
    let _ids = req.params.ids.split(',');
    if (_ids.length==0) {
        return res.json({
            errorCode: '2002',
            message: '参数错误!',
            data: null
        })
    }
    const results = await huggingList.find({ _id: { $in: _ids } });
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
        const result = await huggingList.deleteMany({ _id: { $in: _ids } })
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

const changeHuggingStatus=async (req,res)=>{
    let {_id,enablestatus} = req.body
    if (!_id||!enablestatus) {
        return res.json({
            errorCode: '2002',
            message: '参数缺失!',
            data: null
        })
    }
    try {
        const result = await huggingList.findOneAndUpdate({ _id }, { enablestatus})
        if (result) {
            return res.json({
                errorCode: '0000',
                message: '修改hugging资源状态成功!',
                data:null
            })
        }
        return res.json({
            errorCode: '2002',
            message: '修改hugging资源状态失败!',
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
    getHuggingList,postHuggingList,putHuggingList,getHuggingDetail,deleteHuggingList,changeHuggingStatus,
}