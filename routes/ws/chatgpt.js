const express = require('express')
const expressWs = require('express-ws') // 引入 WebSocket 包
const router = express.Router() // 实例化路由对象
let wss = expressWs(router)//为当前路由添加.ws方法
var aWss = wss.getWss('/api/ws/chatgpt/send');
const {getStreamGptMessage}=require('../../controller/chatGpt/streamMessage')
const checkWsTokenMiddleware=require('../../middlewares/checkWsTokenMiddleware')



// demo
// router.get('/demo', (req, res) => {
//   let apiRes = {
//     code: 0,
//     msg: "成功",
//     data: '请求通过'
//   }
//   res.send(apiRes)
// })

/**
 * route.ws('/url',(ws, req)=>{  })
 * 建立WebSocket服务，并指定对应接口url，及相应回调
 * ws为实例化的对象，req即为请求
 * 
 * ws.send方法用来向客户端发送信息
 * ws.on方法用于监听事件（如监听message事件，或监听close事件）
 * */
router.ws('/send',checkWsTokenMiddleware, (ws, req) => {
  ws.on('message', function (msg) {
    if(msg=="heartbeat"){
      ws.send("heartbeatSuccess!")
      return
    }
    getStreamGptMessage({temperature:0.6,maxtokens:4000,message:msg},(message)=>{
      ws.send(message)
    })
    aWss.clients.forEach((client)=> {
      client.send(msg);
  });
  })



  ws.on('close', function (e) {
    console.log('连接关闭')
  })
})

module.exports = router // 暴露出去方便管理
