<template>
  <div class="chat-box">
    <!-- <div class="top-bar">
      <div class="login-action">
        <el-button type="success">登录</el-button>
        <el-button>注册</el-button>
      </div>
    </div> -->
    <div class="main-body">
      <div class="left-box">
        <div class="card">
          <div class="btn-box">
         <el-button class="addchat-btn" icon="el-icon-plus">新建聊天</el-button>
          </div>
          <div class="history-chatbox"></div>
          <div class="system-box">
           <div class="user-info">
            <el-avatar :size="50" src="https://imgurl-1301237494.cos.accelerate.myqcloud.com/imgs/2023/04/02/d5e3fab7f333d8d8.png"></el-avatar>
           <div class="user">
             <div>机皮啼</div>
             <div>free acount</div>
           </div>
           </div>
               <div class="action-btn">
            <span class="fa fa-download"></span>
            <span>下载聊天记录</span>
           </div>
             <div class="action-btn">
            <span class="fa fa-graduation-cap"></span>
            <span>chatgpt学习</span>
           </div>
            <div class="action-btn">
            <span class="fa fa-tachometer"></span>
            <span>后台管理</span>
           </div>
           <div class="action-btn">
            <span class="fa fa-sign-out"></span>
            <span>退出</span>
           </div>
          </div>
        </div>
      </div>
      <div class="center-box">
        <div class="card">
          <div class="message-box">
            <div v-for="(item,index) in messageData" :key="index" class="message-item">
              <div v-if="item.type=='bot'" class="from-bot-box">
                <div class="date-avator">
                  <span>{{item.time}}</span>
                </div>
                <div style="position: relative">
                  <div class="from-bot">
                    <div v-highlight v-html="botobj.output"  v-if="inputText&&index==messageData.length-1"></div>
                    <!-- <span class="easy-typed-cursor">|</span> -->
                      <div v-else  v-highlight v-html="item.content"></div>
                  </div>
                  <div style="position: absolute; left: -40px; top: -15px">
                    <el-avatar
                      :size="30"
                      src="https://imgurl-1301237494.cos.accelerate.myqcloud.com/imgs/2023/04/02/0274ffcf2ad54e96.png"
                    ></el-avatar>
                  </div>
                </div>
              </div>
              <div v-else class="from-me-box">
                <div class="date-avator">
                  <span>{{item.time}}</span>
                </div>
                <div style="position: relative">
                  <div class="from-me">
                   {{item.content}}
                  </div>
                  <div style="position: absolute; right: -30px; top: -15px">
                    <el-avatar
                      :size="30"
                      src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
                    ></el-avatar>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="send-message">
            <el-input
              v-model="sendMessage"
              class="message-input"
              placeholder="请输入聊天消息"
              autofocus="true"
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 3 }"
            ></el-input>
            <el-button
              type="success"
              icon="el-icon-s-promotion"
              style="margin-left: 5px"
              class="send-btn"
              @click="sendMsg"
            ></el-button>
          </div>
        </div>
      </div>
      <div class="right-box">
        <div class="card"></div>
      </div>
    </div>
  </div>
</template>

<script>
// import WebSocket from '@/utils/class/ws';
import { newWebSocket } from "@/utils/websocket.js";
import { isJSON } from "@/utils/common.js";
import Cookie from "js-cookie";
import EasyTyper from "easy-typer-js";
// 将markdown转换成html
import { marked } from "marked";
// 引入样式
import "highlight.js/styles/github-dark.css";
import moment from 'moment'

export default {
  data() {
    return {
      sendMessage: "",
      ws: null,
      botobj: {
        output: "",
        isEnd: false,
        speed: 30,
        singleBack: false,
        sleep: 0,
        type: "normal",
        backSpeed: 40,
        sentencePause: false,
      },
      printbot: null,
      inputText: "",
      testdata: [],
      messageData:[],
      
    };
  },
  methods: {
    sendMsg() {
      let meItem={
        content:this.sendMessage,
        type:'me',
        time:moment().format('YYYY-MM-DD HH:mm:ss')
      }
      this.messageData.push(meItem,{
        content:'正在思考中，请耐心等待...',
        type:'bot',
        time:''
      })
      newWebSocket.sendMsg(this.sendMessage);
    },
    //  处理http收到的消息
    handleHttpMessage() {
      this.$http
        .getChatGptMessage({ message: this.sendMessage })
        .then((res) => {
          if (res.errorCode == "0000") {
            this.inputText = res.data.choices[0].message.content;
            this.inputText = marked(this.inputText);
            this.initTyped(this.inputText);
          }
        });
    },

    // 处理ws收到的消息
    handleWSMessage(data) {
      let jsonobj = null;
      if (isJSON(data)) {
        jsonobj = JSON.parse(data);
      }
      console.log(data);
      if (isJSON(data) && jsonobj.choices[0] && jsonobj.choices[0].delta.role) {
        // 开始打字
        this.$set(this.messageData[this.messageData.length-1],'time',moment().format('YYYY-MM-DD HH:mm:ss')) 
    }
      if (
        isJSON(data) &&
        jsonobj.choices[0] &&
        jsonobj.choices[0].finish_reason == "stop"
      ) {
        this.inputText = marked(this.inputText);
        this.initTyped(this.inputText,this.handleMessageOutputEnd);
      }
      if (jsonobj) {
        this.inputText += jsonobj.choices[0].delta.content
          ? jsonobj.choices[0].delta.content
          : "";
      }
    },

// 处理打字机输出结束
    handleMessageOutputEnd(){
      console.log('输出结束')
      this.addMessageData()
    },
// 添加消息数据
addMessageData(){
  
  let botItem={
    content:marked(this.inputText),
    type:'bot',
    time:moment().format('YYYY-MM-DD HH:mm:ss')
  }
  this.messageData.splice(this.messageData.length-1,1,botItem)
  this.inputText=''
  this.botobj.output=''
},
    translateWs() {
      newWebSocket.init({
        url: `${
          process.env.VUE_APP_WS_API
        }/api/ws/chatgpt/send?token=${Cookie.get("token")}`, // 自己的ws 地址
        onopen: (msg, data) => {
          console.log(msg, data);
        },
        onmessage: (data) => {
          this.handleWSMessage(data);
        },
        onclose: (data) => {
          console.log(data);
        },
      });
    },

    initTyped(input, fn, hooks) {
      const obj = this.botobj;
      this.printbot = new EasyTyper(obj, input, fn, hooks);
    },
  },
  created() {},
  mounted() {
    this.translateWs();
  },
  beforeDestroy() {
    newWebSocket.close();
  },
};
</script>

<style lang="less" scoped>
.chat-box {
  .top-bar {
    background: #24292f;
    height: 55px;
    line-height: 55px;
    .login-action {
      float: right;
      margin-right: 20px;
    }
  }
  .main-body {
    display: flex;
    height: 100vh;
    .left-box {
      width: 15%;
      height: 100%;
      background: #170a35;
      .card{
        background: #2a1651 !important;
        height: 100%;
        border-top-right-radius: 35px;
        border-bottom-right-radius: 35px;
        .btn-box{
          display: flex;
          justify-content: center;
          padding-top: 45px;
                .addchat-btn{
          background: #7e55d7;
          color: #ffffff;
          font-weight: 500;
          border: none;
          width: 70%;
          padding: 16px 20px !important;
          border-radius: 8px !important;
        }
        }
        .history-chatbox{
          height: calc(100vh - 350px);
          border-bottom: solid 1px #463668;
          overflow-y:scroll;
        }
        .system-box{
          
          .user-info{
            display: flex;
            padding: 20px;
            .user{
              color: white;
              margin-left: 15px;
              div:nth-child(1){
                font-size: 17px;
                font-weight: 500;
                margin-bottom: 3px;
              }
            }
          }

          .action-btn{
            color: #ffffff;
            font-size: 14px;
            padding: 0px 50px 20px 50px;
            cursor: pointer;
            span:nth-child(1){
              font-size: 19px;
              margin-right: 10px;
            }
            span:nth-child(2){
                 vertical-align: top;
            }
          }
        }
      }
    }
    .center-box {
      width: 70%;
      .card {
        height: 100%;
        position: relative;
        background: #170a35 !important;
        .message-box {
          height: calc(100vh - 140px);
          overflow-y: scroll;
          display: flex;
          flex-direction: column;
          .message-item {
            margin: 0 50px;
            .from-bot-box {
              color: whitesmoke;
              font-weight: 500;
              .date-avator {
                margin-bottom: 10px;
                padding-left: 10px;
                font-size: 12px;
              }
              .from-bot {
                max-width: 60%;
                background: #a865e5;
                display: inline-block;
                padding: 20px;
                border-radius: 10px;
                font-size: 13px;
                line-height: 23px;
                color: floralwhite;
              }
            }
            .from-me-box {
               color: whitesmoke;
               font-weight: 500;
              .date-avator {
                display: flex;
                justify-content: end;
                margin-bottom: 10px;
                padding-right: 20px;
                font-size: 12px;
              }
              .from-me {
                float: right;
                margin-right: 10px;
                max-width: 30%;
                background: #6661f5;
                color: black;
                border-radius: 10px;
                padding: 10px;
                text-align: right;
                font-size: 13px;
                line-height: 23px;
                margin-bottom: 20px;
                font-weight: 500;
                color: white;
              }
            }
          }
        }
        .send-message {
          display: flex;
          position: absolute;
          bottom: 20px;
          left: 10%;
          width: 80%;
          align-items: center;
        }
      }
    }
    .right-box {
      width: 15%;
      height: 100%;
      background: #170a35;
      .card{
        background: #2a1651 !important;
        height: 100%;
        border-top-left-radius: 35px;
        border-bottom-left-radius: 35px;
      }
    }
  }
}

.typed-cursor {
  margin-left: 10px;
  opacity: 1;
  -webkit-animation: blink 0.7s infinite;
  -moz-animation: blink 0.7s infinite;
  animation: blink 0.7s infinite;
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-webkit-keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-moz-keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
<style scoped>
.message-input /deep/ .el-textarea__inner {
  border-radius: 5px;
  background: #1c1f37 !important;
  color: #fff;
  border: solid 1px #1c1f37 !important;
}
.message-box::-webkit-scrollbar {
  width: 5px;
  height: 10px;
  /**/
}
.message-box::-webkit-scrollbar-track {
  background: #170a35;
  border-radius: 2px;
}
.message-box::-webkit-scrollbar-thumb {
  background: #170a35;
  border-radius: 10px;
}
.message-box::-webkit-scrollbar-thumb:hover {
  background: #170a35;
}

.history-chatbox::-webkit-scrollbar {
  width: 5px;
  height: 10px;
  /**/
}
.history-chatbox::-webkit-scrollbar-track {
  background: #2a1651;
  border-radius: 2px;
}
.history-chatbox::-webkit-scrollbar-thumb {
  background: #2a1651;
  border-radius: 10px;
}
.history-chatbox::-webkit-scrollbar-thumb:hover {
  background: #2a1651;
}

/deep/ .el-card__body {
  padding-right: 0px !important;
  opacity: 0.8 !important;
}
.send-btn{
      color: floralwhite;
    background-color: #524cf7;
    border-color: #2a25ab;
    padding: 10px 20px !important;
    border-radius: 5px !important;
}
</style>