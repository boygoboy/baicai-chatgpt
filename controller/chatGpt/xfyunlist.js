const Counter = require('../../db/models/counterSchema')
const xfyunList = require('../../db/models/chatgpt/xfyunListSchema')
const pagerFun = require('../../utils/pager')
const {xfyunIsLive} =require('./utils/gptCommon')
const {updateXfyunUsedCount}=require('../../utils/timedTask')

const getXfyunList=async(req,res)=>{
    let { email,enablestatus,tokenstatus, pageNum, pageSize }=req.query
    let pager = {}
    let params = {}
    if(email)params.email=email
     if(enablestatus)params.enablestatus=enablestatus
        if(tokenstatus)params.tokenstatus=tokenstatus
    try{
        updateXfyunUsedCount()
        const query =  xfyunList.find(params)
        const xfyunlist = await query.skip(pagerFun(pageNum, pageSize).skipIndex).limit(pagerFun(pageNum, pageSize).pager.pageSize)
        const total = await xfyunList.countDocuments(params)
        pager.total = total
        pager.pageNum = parseInt(pageNum)
        if (xfyunlist) { 
            return res.json({
                errorCode: '0000',
                message: '查询xfyun资源列表成功!',
                data: { xfyunlist, pager }
            })
     }
        return res.json({
            errorCode: '2002',
            message: '查询xfyun资源列表失败!',
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
const postXfyunList=async(req,res)=>{
    let {email,password,token,sharecount,shareroles,shareroleNames,endtime} = req.body
    //新增gptaccount
    if (!email||!password||!token||!sharecount||!shareroles,!shareroleNames) {
        return res.json({
            errorCode: '2002',
            message: '参数缺失!',
            data: null
        })
    }
    const result = await xfyunList.findOne({token})
    if (result) {
        return res.json({
            errorCode: '2002',
            message: '新建token已存在!',
            data: null
        })
    }
    try {
        //这一步运行一次就可以注释掉，自增需要有个初始值
        const result = await Counter.findOne({ id: "xfyunListId" })
        if (!result) {
            await Counter.create({
                "id": "xfyunListId",
                "sequence_value": 0
            })
        }
       let islive=await xfyunIsLive(token)
       console.log('islive',islive) 
       if(!islive){
        return res.json({
            errorCode: '2002',
            message: 'token不可用!',
            data: null
        })
       }
        //处理自增userId
        const count = await Counter.findOneAndUpdate({ id: 'xfyunListId' }, { $inc: { sequence_value: 1 } }, { new: true })
        const xfyunlist = await new xfyunList({
        xfyunListId: count.sequence_value,
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
        await xfyunlist.save();
        return res.json({
            errorCode: '0000',
            message: '新增xfyun资源成功!',
            data: null
        })
    }catch(error){
        res.json({
            errorCode: '2002',
            message: '新增xfyun资源失败!',
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
const putXfyunList=async (req,res)=>{
    let {_id,email,password,token,sharecount,shareroles,shareroleNames,endtime} = req.body
    if (!_id||!email||!password||!token||!sharecount||!shareroles,!shareroleNames) {
        return res.json({
            errorCode: '2002',
            message: '参数缺失!',
            data: null
        })
    }    
    try {
        const result =await xfyunList.findOne({
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
         let filterResult= await xfyunList.findOne({_id})
         if(sharecount<filterResult.usedcount){
            return res.json({
                errorCode: '2002',
                message: '分享人数不能小于已经分享的人数!',
                data: null
            })
         }

         let islive=await xfyunIsLive(token)
         if(!islive){
          return res.json({
              errorCode: '2002',
              message: 'token不可用!',
              data: null
          })
         }

        const xfyunlist = await xfyunList.findOneAndUpdate({ _id }, {
            email,
            password,
            token,
            sharecount,
            shareroles,
            shareroleNames,
            tokenstatus:'在线',
            endtime
        })
        if (xfyunlist) {
            return res.json({
                errorCode: '0000',
                message: '修改xfyun资源成功!',
                data:null
            })
        }
        return res.json({
            errorCode: '2002',
            message: '修改xfyun资源失败!',
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

const getXfyunDetail=async(req,res)=>{
    let _id = req.params.id;
    if (!_id) {
        return res.json({
            errorCode: '2002',
            message: '参数缺失!',
            data: null
        })
    }
    try{
        const result = await xfyunList.findOne({_id})
        if(result){
            return res.json({
                errorCode: '0000',
                message: '查询xfyun资源成功!',
                data: result
            })
        }
        return res.json({
            errorCode: '2002',
            message: '获取xfyun资源失败!',
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

const deleteXfyunList=async (req,res)=>{
    let _ids = req.params.ids.split(',');
    if (_ids.length==0) {
        return res.json({
            errorCode: '2002',
            message: '参数错误!',
            data: null
        })
    }
    const results = await xfyunList.find({ _id: { $in: _ids } });
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
        const result = await xfyunList.deleteMany({ _id: { $in: _ids } })
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

const changeXfyunStatus=async (req,res)=>{
    let {_id,enablestatus} = req.body
    if (!_id||!enablestatus) {
        return res.json({
            errorCode: '2002',
            message: '参数缺失!',
            data: null
        })
    }
    try {
        const result = await xfyunList.findOneAndUpdate({ _id }, { enablestatus})
        if (result) {
            return res.json({
                errorCode: '0000',
                message: '修改xfyun资源状态成功!',
                data:null
            })
        }
        return res.json({
            errorCode: '2002',
            message: '修改xfyun资源状态失败!',
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
    getXfyunList,postXfyunList,putXfyunList,getXfyunDetail,deleteXfyunList,changeXfyunStatus
}