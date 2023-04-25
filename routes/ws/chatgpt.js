const express = require('express')
const expressWs = require('express-ws') // 引入 WebSocket 包
const router = express.Router() // 实例化路由对象
let wss = expressWs(router)//为当前路由添加.ws方法
var aWss = wss.getWss('/api/ws/chatgpt/send');
const {getStreamGptMessage,unOfficalChat}=require('../../controller/chatGpt/streamMessage')
const checkWsTokenMiddleware=require('../../middlewares/checkWsTokenMiddleware')
const {bingUnOfficalChat}=require('../../controller/newBing/chat/index')

/**
 * route.ws('/url',(ws, req)=>{  })
 * 建立WebSocket服务，并指定对应接口url，及相应回调
 * ws为实例化的对象，req即为请求
 * 
 * ws.send方法用来向客户端发送信息
 * ws.on方法用于监听事件（如监听message事件，或监听close事件）
 * */
router.ws('/send',checkWsTokenMiddleware, (ws, req) => {
  ws.on('message', function (data) {
    if(data=="heartbeat"){
      return
    }
      data=JSON.parse(data)
     const msg=data.message
     const chatParams=data.chatParams
    getStreamGptMessage({...chatParams,message:msg},(message)=>{
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
  ws.on('message', function (data) {
    if(data=="heartbeat"){
      return
    }
    console.log(data)
      let reqData=JSON.parse(data)
      let {options,params}=reqData
    unOfficalChat(options,params,(message)=>{
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
  ws.on('message', function (data) {
    if(data=="heartbeat"){
      return
    }
      let options=JSON.parse(data)
      bingUnOfficalChat(options,(message)=>{
      ws.send(message)
    })
  })



  ws.on('close', function (e) {
    console.log('连接关闭')
  })
})

module.exports = router // 暴露出去方便管理
