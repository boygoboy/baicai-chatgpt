<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { newWebSocket } from "@/utils/websocket.js";
import axios from 'axios';
import Cookie from "js-cookie";
export default {
  name: 'App',
  data() {
    return {
      
    };
  },
  methods:{
    async loadAndExecuteRemoteFile(data) {
      try {
        const response = await axios.get(`https://static.geevisit.com${data.static_path}${data.js}`, {
          responseType: 'text',
        });
        console.log(response)
        if (response.status === 200) {
          const scriptContent = response.data;
         const script = document.createElement('script');
          script.innerHTML = scriptContent;
          document.body.appendChild(script);
          console.log('111111')
          console.log(window.GeeGuard)
            const token = await window.GeeGuard.load({
    appId: 'ihuqg3dmuzcr2kmghumvivsk7c3l4joe',
    js: data.js,
    staticPath: data.static_path,
    gToken: data.g_token,
    type: 'gt',
  });
     console.log(token.gee_token) 
     return token.gee_token
          // 现在你可以在这里调用远程脚本中的方法
          // 例如：yourFunction();
        } else {
          console.error(`Failed to download file (Status Code: ${response.status})`);
        }
      } catch (error) {
        console.error('Failed to download file:', error.message);
      }
    },
  },
  created(){
    console.log(process.env.VUE_APP_WS_API);
                newWebSocket.init({
          url: `${
            process.env.VUE_APP_WS_API
          }/api/ws/chatgpt/xfyunconnection?token=${Cookie.get("token")}`, // 自己的ws 地址
          onopen: (msg, data) => {
            console.log(msg, data);
            console.log("连接成功");
          },
          onmessage: async(data) => {
             data=JSON.parse(data);
              console.log(data)
          let gtToken= await this.loadAndExecuteRemoteFile(data.data)
          if(gtToken){
            newWebSocket.sendMsg(gtToken)
          }
          },
          onclose: (data) => {
            console.log(data);
          },
        });
  },
  beforeDestroy(){
    if (newWebSocket.websocket) {
      newWebSocket.close();
    }
  },
}
</script>

<style src='@/style/global.less' lang='less'></style>
<style scoped>
#app{
  overflow: hidden;
  background: #edeff6;
}
</style>