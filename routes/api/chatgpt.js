//导入 express
const express = require('express');
const router = express.Router();
const ChatGpt3=require('../../controller/chatgptClass/chatgptClass')
const {getStreamGptMessage}=require('../../controller/chatGpt/streamMessage')

//获取chatgpt聊天信息
router.post('/ask',(req,res)=>{
    if(!req.body.message){
        return res.json({
            errorCode:'1001',
            message:'消息不能为空！',
            data:null
        })
    }
 new ChatGpt3({temperature:0.6,maxtokens:6000}).getChat3Message(req.body.message).then(resultData=>{
    console.log(resultData)
    console.log('error')
       res.json({
           code:'200',
           msg:'ok',
           data:resultData
       })
 }).catch(err=>{
    res.json({
        code:'500',
        msg:'连接失败！',
        errdata:err
    })
 })

});

router.get('/testask/:message',(req,res)=>{
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader("Keep-Alive", "timeout=5")  
    if(!req.params.message){
        return res.json({
            errorCode:'1001',
            message:'消息不能为空！',
            data:null
        })
    }
 
    
    getStreamGptMessage({temperature:0.6,maxtokens:6000,message:req.params.message}).then(resultData=>{
       res.json({
           code:'200',
           msg:'ok',
           data:resultData
       })
 }).catch(err=>{
    res.json({
        code:'500',
        msg:'连接失败！',
        errdata:err
    })
 })
})


module.exports = router;
