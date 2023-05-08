const Counter = require('../../db/models/counterSchema')
const keyUnOffical = require('../../db/models/chatgpt/keyUnOfficalSchema')
const Role = require('../../db/models/roleSchema')
const User = require('../../db/models/userSchema')
const binglist = require('../../db/models/chatgpt/bingListSchema')
const pagerFun = require('../../utils/pager')
const axios = require('axios')
const {newBingIsLive} =require('./utils/gptCommon')
const {updateBingStatus,updateBingUsedCount}=require('../../utils/timedTask')

const getBingList=async(req,res)=>{
    let {email,enablestatus,tokenstatus, pageNum, pageSize }=req.query
    let pager = {}
    let params = {}
    if(email)params.email=email
     if(enablestatus)params.enablestatus=enablestatus
        if(tokenstatus)params.tokenstatus=tokenstatus
    try{
        updateBingUsedCount()
        const query = binglist.find(params)
        const bingList = await query.skip(pagerFun(pageNum, pageSize).skipIndex).limit(pagerFun(pageNum, pageSize).pager.pageSize)
        const total = await binglist.countDocuments(params)
        pager.total = total
        pager.pageNum = parseInt(pageNum)
        if (bingList) { 
            return res.json({
                errorCode: '0000',
                message: '查询token资源列表成功!',
                data: { bingList, pager }
            })
     }
        return res.json({
            errorCode: '2002',
            message: '查询bing资源列表失败!',
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
const postBingList=async(req,res)=>{
    let {email,password,token,cookie,sharecount,shareroles,shareroleNames,endtime} = req.body
    //新增gptaccount
    if (!email||!password||!token||!cookie||!sharecount||!shareroles,!shareroleNames) {
        return res.json({
            errorCode: '2002',
            message: '参数缺失!',
            data: null
        })
    }
    const result = await binglist.findOne({token})
    if (result) {
        return res.json({
            errorCode: '2002',
            message: '新建token已存在!',
            data: null
        })
    }
    const result1 = await binglist.findOne({cookie})
    if (result1) {
        return res.json({
            errorCode: '2002',
            message: '新建cookie已存在!',
            data: null
        })
    }
    try {
        //这一步运行一次就可以注释掉，自增需要有个初始值
        const result = await Counter.findOne({ id: "bingListId" })
        if (!result) {
            await Counter.create({
                "id": "bingListId",
                "sequence_value": 0
            })
        }
       let islive= newBingIsLive(token,cookie)
       if(!islive){
        return res.json({
            errorCode: '2002',
            message: 'token或cookie不可用!',
            data: null
        })
       }
        //处理自增userId
        const count = await Counter.findOneAndUpdate({ id: 'bingListId' }, { $inc: { sequence_value: 1 } }, { new: true })
        const bingList = await new binglist({
        bingListId: count.sequence_value,
        email,
        password,
        token,
        cookie,
        sharecount,
        shareroles,
        usedcount:0,
        shareroleNames,
        endtime,
        enablestatus:'启用',
        tokenstatus:'在线'
    })
    try{
        await bingList.save();
        return res.json({
            errorCode: '0000',
            message: '新增bing资源成功!',
            data: null
        })
    }catch(error){
        res.json({
            errorCode: '2002',
            message: '新增bing资源失败!',
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
const putBingList=async (req,res)=>{
    let {_id,email,password,token,cookie,sharecount,shareroles,shareroleNames,endtime} = req.body
    if (!_id||!email||!password||!token||!cookie||!sharecount||!shareroles,!shareroleNames) {
        return res.json({
            errorCode: '2002',
            message: '参数缺失!',
            data: null
        })
    }    
    try {
        const result =await binglist.findOne({
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
        const result1 =await binglist.findOne({
            $and: [
              { cookie},
              { _id: { $ne: _id } }
            ]
          });

        if (result1) {
            return res.json({
                errorCode: '2002',
                message: '修改的cookie已存在!',
                data: null
            })
        }

        //这里更新的时候需要判断分享人数要大于等于已经分享的人数
         let filterResult= await binglist.findOne({_id})
         if(sharecount<filterResult.usedcount){
            return res.json({
                errorCode: '2002',
                message: '分享人数不能小于已经分享的人数!',
                data: null
            })
         }

         let islive= await newBingIsLive(token,cookie)
         if(!islive){
          return res.json({
              errorCode: '2002',
              message: 'token或cookie不可用!',
              data: null
          })
         }

        const bingList = await binglist.findOneAndUpdate({ _id }, {
            email,
            password,
            token,
            cookie,
            sharecount,
            shareroles,
            shareroleNames,
            tokenstatus:'在线',
            endtime
        })
        if (bingList) {
            return res.json({
                errorCode: '0000',
                message: '修改bing资源成功!',
                data:null
            })
        }
        return res.json({
            errorCode: '2002',
            message: '修改bing资源失败!',
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

const getBingDetail=async(req,res)=>{
    let _id = req.params.id;
    if (!_id) {
        return res.json({
            errorCode: '2002',
            message: '参数缺失!',
            data: null
        })
    }
    try{
        const result = await binglist.findOne({_id})
        if(result){
            return res.json({
                errorCode: '0000',
                message: '查询bing资源成功!',
                data: result
            })
        }
        return res.json({
            errorCode: '2002',
            message: '获取bing资源失败!',
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

const deleteBingList=async (req,res)=>{
    let _ids = req.params.ids.split(',');
    if (_ids.length==0) {
        return res.json({
            errorCode: '2002',
            message: '参数错误!',
            data: null
        })
    }
    const results = await binglist.find({ _id: { $in: _ids } });
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
        const result = await binglist.deleteMany({ _id: { $in: _ids } })
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

const changeBingStatus=async (req,res)=>{
    let {_id,enablestatus} = req.body
    if (!_id||!enablestatus) {
        return res.json({
            errorCode: '2002',
            message: '参数缺失!',
            data: null
        })
    }
    try {
        const result = await binglist.findOneAndUpdate({ _id }, { enablestatus})
        if (result) {
            return res.json({
                errorCode: '0000',
                message: '修改bing资源状态成功!',
                data:null
            })
        }
        return res.json({
            errorCode: '2002',
            message: '修改bing资源状态失败!',
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
    getBingList,postBingList,putBingList,deleteBingList,getBingDetail,changeBingStatus,
}