
export const newWebSocket = {
    websocket: null,
    heartbeat_timer: null, // 用于心跳检测
    active_close: false, // 是否主动关闭
    init: (params) => {
      newWebSocket.websocket = new WebSocket(params.url)
      newWebSocket.websocket.onopen = (data) => {
        newWebSocket.heartbeat()
        if (params.onopen) {
          params.onopen('webSocket已连接', data)
        }
      }
      newWebSocket.websocket.onmessage = (data) => {
        if (params.onmessage) {
          params.onmessage(data.data)
        }
      }
      newWebSocket.websocket.onclose = () => {
        clearInterval(newWebSocket.heartbeat_timer)
        if (newWebSocket.active_close) {
          if (params.onclose) {
            params.onclose('连接已手动关闭')
          }
        } else {
          newWebSocket.reconnect(params)
          if (params.onclose) {
            params.onclose('连接已关闭, 正在重连')
          }
        }
      }
      newWebSocket.websocket.onerror = () => {
        clearInterval(newWebSocket.heartbeat_timer)
        if (params.onerror) {
          params.message('连接发生错误！等待五秒后重连')
          setTimeout(() => {
            newWebSocket.reconnect(params)
          },5000)
        }
      }
    },
    heartbeat: () => {
      console.log('执行心跳')
      if (newWebSocket.heartbeat_timer) {
        clearInterval(newWebSocket.heartbeat_timer)
      }
      newWebSocket.heartbeat_timer = setInterval(function (){
        newWebSocket.websocket.send('heartbeat')
      },30000)
    },
    reconnect: (params) => {
      console.log('执行重连')
      newWebSocket.active_close = false
      if (newWebSocket.websocket) {
        newWebSocket.websocket.close()
      }
      newWebSocket.init(params)
    },
    close: () => {
      console.log('手动关闭，无需重连')
      clearInterval(newWebSocket.heartbeat_timer)
      newWebSocket.active_close = true
      newWebSocket.websocket.close()
    },
    sendMsg:(msg)=>{
        if (!newWebSocket.websocket) {
            console.warn('WebSocket未连接 无法发消息')
            return
        }
        msg = msg || 'biubiubiu ^_^'
        newWebSocket.websocket.send(msg)
    }
  }
  
  
  