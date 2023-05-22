const Counter = require('../../db/models/counterSchema')
const bardList = require('../../db/models/chatgpt/bardListSchema')
const pagerFun = require('../../utils/pager')
const {bardIsLive} =require('./utils/gptCommon')
const {updateBardUsedCount}=require('../../utils/timedTask')

const getBardList=async(req,res)=>{
    let {email,enablestatus,tokenstatus, pageNum, pageSize }=req.query
    let pager = {}
    let params = {}
    if(email)params.email=email
     if(enablestatus)params.enablestatus=enablestatus
        if(tokenstatus)params.tokenstatus=tokenstatus
    try{
        updateBardUsedCount()
        const query =  bardList.find(params)
        const bardlist = await query.skip(pagerFun(pageNum, pageSize).skipIndex).limit(pagerFun(pageNum, pageSize).pager.pageSize)
        const total = await bardList.countDocuments(params)
        pager.total = total
        pager.pageNum = parseInt(pageNum)
        if (bardlist) { 
            return res.json({
                errorCode: '0000',
                message: '查询bard资源列表成功!',
                data: { bardlist, pager }
            })
     }
        return res.json({
            errorCode: '2002',
            message: '查询bard资源列表失败!',
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
const postBardList=async(req,res)=>{
    let {email,password,token,sharecount,shareroles,shareroleNames,endtime} = req.body
    //新增gptaccount
    if (!email||!password||!token||!sharecount||!shareroles,!shareroleNames) {
        return res.json({
            errorCode: '2002',
            message: '参数缺失!',
            data: null
        })
    }
    const result = await bardList.findOne({token})
    if (result) {
        return res.json({
            errorCode: '2002',
            message: '新建token已存在!',
            data: null
        })
    }
    try {
        //这一步运行一次就可以注释掉，自增需要有个初始值
        const result = await Counter.findOne({ id: "bardListId" })
        if (!result) {
            await Counter.create({
                "id": "bardListId",
                "sequence_value": 0
            })
        }
       let islive= bardIsLive(token)
       if(!islive){
        return res.json({
            errorCode: '2002',
            message: 'token不可用!',
            data: null
        })
       }
        //处理自增userId
        const count = await Counter.findOneAndUpdate({ id: 'bardListId' }, { $inc: { sequence_value: 1 } }, { new: true })
        const bardlist = await new bardList({
         bardListId: count.sequence_value,
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
        await bardlist.save();
        return res.json({
            errorCode: '0000',
            message: '新增bard资源成功!',
            data: null
        })
    }catch(error){
        res.json({
            errorCode: '2002',
            message: '新增bard资源失败!',
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
const putBardList=async (req,res)=>{
    let {_id,email,password,token,sharecount,shareroles,shareroleNames,endtime} = req.body
    if (!_id||!email||!password||!token||!sharecount||!shareroles,!shareroleNames) {
        return res.json({
            errorCode: '2002',
            message: '参数缺失!',
            data: null
        })
    }    
    try {
        const result =await bardList.findOne({
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
         let filterResult= await bardList.findOne({_id})
         if(sharecount<filterResult.usedcount){
            return res.json({
                errorCode: '2002',
                message: '分享人数不能小于已经分享的人数!',
                data: null
            })
         }

         let islive= await bardIsLive(token)
         if(!islive){
          return res.json({
              errorCode: '2002',
              message: 'token不可用!',
              data: null
          })
         }

        const bardlist = await bardList.findOneAndUpdate({ _id }, {
            email,
            password,
            token,
            sharecount,
            shareroles,
            shareroleNames,
            tokenstatus:'在线',
            endtime
        })
        if (bardlist) {
            return res.json({
                errorCode: '0000',
                message: '修改bard资源成功!',
                data:null
            })
        }
        return res.json({
            errorCode: '2002',
            message: '修改bard资源失败!',
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

const getBardDetail=async(req,res)=>{
    let _id = req.params.id;
    if (!_id) {
        return res.json({
            errorCode: '2002',
            message: '参数缺失!',
            data: null
        })
    }
    try{
        const result = await bardList.findOne({_id})
        if(result){
            return res.json({
                errorCode: '0000',
                message: '查询bard资源成功!',
                data: result
            })
        }
        return res.json({
            errorCode: '2002',
            message: '获取bard资源失败!',
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

const deleteBardList=async (req,res)=>{
    let _ids = req.params.ids.split(',');
    if (_ids.length==0) {
        return res.json({
            errorCode: '2002',
            message: '参数错误!',
            data: null
        })
    }
    const results = await bardList.find({ _id: { $in: _ids } });
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
        const result = await bardList.deleteMany({ _id: { $in: _ids } })
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

const changeBardStatus=async (req,res)=>{
    let {_id,enablestatus} = req.body
    if (!_id||!enablestatus) {
        return res.json({
            errorCode: '2002',
            message: '参数缺失!',
            data: null
        })
    }
    try {
        const result = await bardList.findOneAndUpdate({ _id }, { enablestatus})
        if (result) {
            return res.json({
                errorCode: '0000',
                message: '修改bard资源状态成功!',
                data:null
            })
        }
        return res.json({
            errorCode: '2002',
            message: '修改bard资源状态失败!',
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
    getBardList,postBardList,putBardList,getBardDetail,deleteBardList,changeBardStatus,
}