//导入 express
const express = require('express');
//导入 jwt
const jwt = require('jsonwebtoken');
//导入中间件
let checkTokenMiddleware = require('../../middlewares/checkTokenMiddleware');

const router = express.Router();
const ChatGpt3=require('../../logic/chatgptClass/chatgptClass')

//获取chatgpt聊天信息
router.post('/ask',   (req,res)=>{
 new ChatGpt3({temperature:0.6,maxtokens:6000},req.body.message).getChat3Message().then(resultData=>{
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


module.exports = router;
