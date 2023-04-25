//导入 express
const express = require('express');
const router = express.Router();
const ChatGpt3=require('../../controller/chatgptClass/chatgptClass')
const {bingUnOfficalChat} =require('../../controller/newBing/chat/index')

router.post('/ask', (req,res)=>{
//     if(!req.body.message){
//         return res.json({
//             errorCode:'1001',
//             message:'消息不能为空！',
//             data:null
//         })
//     }
//      new ChatGpt3({temperature:0.6,maxtokens:6000}).getChat3Message(req.body.message).then(resultData=>{
//        res.json({
//          errorCode:'0000',
//           message:'ok',
//          data:resultData
//        })
//  }).catch(err=>{
//     res.json({
//         errorCode:'500',   
//         msg:'连接失败！',
//         errdata:err
//     })
//  })

bingUnOfficalChat()
})

module.exports = router;
