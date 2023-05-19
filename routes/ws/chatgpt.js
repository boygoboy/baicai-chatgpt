const express = require('express')
const expressWs = require('express-ws') // 引入 WebSocket 包
const router = express.Router() // 实例化路由对象
let wss = expressWs(router)//为当前路由添加.ws方法
var aWss = wss.getWss('/api/ws/chatgpt/send');
const {getStreamGptMessage,unOfficalChat}=require('../../controller/chatGpt/streamMessage')
const checkWsTokenMiddleware=require('../../middlewares/checkWsTokenMiddleware')
const {bingUnOfficalChat}=require('../../controller/newBing/chat/index')
const {limitRequestCount}=require('../../controller/chatGpt/utils/limitRequestCount')
const {createChatInfo}=require('../../controller/homeStatistics/createChatInfo')
const {bardUnofficalChat}=require('../../controller/googleBard/chat.js')
/**
 * route.ws('/url',(ws, req)=>{  })
 * 建立WebSocket服务，并指定对应接口url，及相应回调
 * ws为实例化的对象，req即为请求
 * 
 * ws.send方法用来向客户端发送信息
 * ws.on方法用于监听事件（如监听message事件，或监听close事件）
 * */
router.ws('/send',checkWsTokenMiddleware, (ws, req) => {
  ws.on('message', async function (data) {
    if(data=="heartbeat"){
      return
    }
    console.log(data)
      data=JSON.parse(data)
     const msg=data.message
     const chatParams=data.chatParams

      let result=await limitRequestCount(req,{type:"chatgpt官方",model:chatParams.model})
      if(!result){
        ws.send('该模型接口请求次数超过限制！')
        return
      }
    getStreamGptMessage({...chatParams,message:msg},(message)=>{
      if(message=="[DONE]"){
        createChatInfo(req,'chatgpt官方',chatParams.model)
      }
      ws.send(message)
    })

    aWss.clients.forEach((client)=> {
      client.send(data);
  });
  })



  ws.on('close', function (e) {
    console.log('连接关闭')
  })
})



router.ws('/unofficalChat',checkWsTokenMiddleware, (ws, req) => {
  ws.on('message', async function (data) {
    if(data=="heartbeat"){
      return
    }
    console.log(data)
      let reqData=JSON.parse(data)
      let {options,params}=reqData
      let result=await limitRequestCount(req,{type:"chatgpt非官方",model:params.model})
      if(!result){
        ws.send('该模型接口请求次数超过限制！')
        return
      }
    unOfficalChat(options,params,(message)=>{
      if(message=="[DONE]"){
        createChatInfo(req,'chatgpt非官方',params.model)
      }
      ws.send(message)
    })
    aWss.clients.forEach((client)=> {
      client.send(data);
  });
  })



  ws.on('close', function (e) {
    console.log('连接关闭')
  })
})

// new bing非官方聊天
router.ws('/bingUnOfficalChat',checkWsTokenMiddleware, (ws, req) => {
  ws.on('message', async function (data) {
    if(data=="heartbeat"){
      return
    }
      let options=JSON.parse(data)
      let result=await limitRequestCount(req,{type:"newbing非官方",model:options.model})
      if(!result){
        ws.send('该模型接口请求次数超过限制！')
        return
      }
      bingUnOfficalChat(options,(message)=>{
        if(message.startsWith('[DONE]')){
          createChatInfo(req,'newbing非官方',options.model)
        }
      ws.send(message)
    },req)
  })



  ws.on('close', function (e) {
    console.log('连接关闭')
  })
})

// router.ws('/bardUnOfficalChat',checkWsTokenMiddleware, (ws, req) => {
//   ws.on('message', async function (data) {
//     if(data=="heartbeat"){
//       return
//     }
//       let options=JSON.parse(data)
//       let result=await limitRequestCount(req,{type:"bard非官方",model:options.model})
//       if(!result){
//         ws.send('该模型接口请求次数超过限制！')
//         return
//       }
//       bingUnOfficalChat(options,(message)=>{
//         if(message.startsWith('[DONE]')){
//           createChatInfo(req,'bard非官方',options.model)
//         }
//       ws.send(message)
//     },req)
//   })
// })

router.post('/test',(req,res)=>{
   bardUnofficalChat(req,res)
})


module.exports = router // 暴露出去方便管理
