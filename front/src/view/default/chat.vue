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
            <el-button
              class="addchat-btn"
              icon="el-icon-plus"
              @click="createChat"
              >新建聊天</el-button
            >
          </div>
          <div class="history-chatbox">
            <div
              v-for="item in allMessageData"
              :key="item.id"
              class="item"
              @click="selectHistoryItem(item)"
              :class="historyItem?item.id == historyItem.id ? 'selct-class' : '':''"
            >
              <span class="fa fa-commenting-o"></span>
              <span>{{item.messageData[0]?item.messageData[0].content:''}}</span>
            </div>
          </div>
          <div class="system-box">
            <div class="user-info">
              <el-avatar
                :size="45"
                src="https://imgurl-1301237494.cos.accelerate.myqcloud.com/imgs/2023/04/02/d5e3fab7f333d8d8.png"
              ></el-avatar>
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
            <div class="action-btn" v-if="!token" @click="handleLogin">
              <span class="fa fa-sign-in"></span>
              <span>登录</span>
            </div>
            <div class="action-btn" v-if="!token">
              <span class="fa fa-address-book"></span>
              <span>注册</span>
            </div>
            <div class="action-btn" v-if="token" @click="goBack">
              <span class="fa fa-tachometer"></span>
              <span>后台管理</span>
            </div>
            <div class="action-btn" v-if="token" @click="logout">
              <span class="fa fa-sign-out"></span>
              <span>退出</span>
            </div>
          </div>
        </div>
      </div>
      <div class="center-box">
        <div class="card">
          <div class="message-box" ref="messageBox">
            <div
              v-for="(item, index) in messageData"
              :key="index"
              class="message-item"
            >
              <div v-if="item.type == 'bot'" class="from-bot-box">
                <div class="date-avator">
                  <span>{{ item.time }}</span>
                </div>
                <div style="position: relative">
                  <div class="from-bot">
                    <div
                      v-highlight
                      v-html="botobj.output"
                      v-if="inputText && index == messageData.length - 1"
                    ></div>
                    <!-- <span class="easy-typed-cursor">|</span> -->
                    <div v-else v-highlight v-html="item.content"></div>
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
                  <span>{{ item.time }}</span>
                </div>
                <div style="position: relative">
                  <div class="from-me">
                    {{ item.content }}
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
              :disabled="loading"
              v-model="sendMessage"
              class="message-input"
              placeholder="请输入聊天消息"
              autofocus="true"
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 3 }"
            ></el-input>
            <el-button
              :loading="loading"
              :disabled="loading"
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
import moment from "moment";
import Dexie from "dexie";

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
      messageData: [],
      token: Cookie.get("token"),
      notifyInstance: null,
      loading: false,
      oldScrollTop: 0,
      scrollFlag: false,
      intervalInstance: null,
      historyItem: null,
      allMessageData: [],
      chatdb: null,
    };
  },
  methods: {
    // 退出登录
    logout() {
      this.$confirm("此操作将退出系统, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        Cookie.remove("token");
        sessionStorage.clear();
        this.$router.push("/chat");
        this.$store.state.navMenu.navTre = "";
        this.$store.state.tabs.bars = {
          tabsValue: "0",
          id: 0,
          tabsList: [],
        };
        this.$router.push({ path: "/chat" });
        this.token = null;
      });
    },
    // 去后台管理
    goBack() {
      this.$router.push({ path: "/" });
    },
    // 处理登录
    handleLogin() {
      this.$router.push({ path: "/login" });
    },
    sendMsg() {
      if (this.notifyInstance) {
        this.notifyInstance.close();
      }
      if (!this.token) {
        this.notifyInstance = this.$notify({
          title: "警告",
          message: "您还未登录，登录后可聊天！",
          type: "warning",
          duration: 10000,
          customClass: "notiyfy",
        });
        return;
      }
      this.loading = true;
      let meItem = {
        content: this.sendMessage,
        type: "me",
        time: moment().format("YYYY-MM-DD HH:mm:ss"),
      };
      this.messageData.push(meItem, {
        content: "正在思考中，请耐心等待...",
        type: "bot",
        time: "",
      });
      newWebSocket.sendMsg(this.sendMessage);
      this.sendMessage = "";
      this.scrollToBottom();
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
      if (data == "token 校验失败!") {
        this.notifyInstance = this.$notify({
          title: "警告",
          message: "您还未登录，登录后可聊天！",
          type: "warning",
          duration: 10000,
          customClass: "notiyfy",
        });
      }
      let jsonobj = null;
      if (isJSON(data)) {
        jsonobj = JSON.parse(data);
      }
      console.log(data);
      if (isJSON(data) && jsonobj.choices[0] && jsonobj.choices[0].delta.role) {
        // 开始打字
        this.$set(
          this.messageData[this.messageData.length - 1],
          "time",
          moment().format("YYYY-MM-DD HH:mm:ss")
        );
        this.intervalInstance = setInterval(() => {
          this.scrollToBottom();
          if (this.scrollFlag) {
            this.scrollToBottom();
          }
        }, 800);
      }
      if (
        isJSON(data) &&
        jsonobj.choices[0] &&
        jsonobj.choices[0].finish_reason == "stop"
      ) {
        this.inputText = marked(this.inputText);
        setTimeout(() => {
          this.initTyped(this.inputText, this.handleMessageOutputEnd);
        }, 50);
      }
      if (jsonobj) {
        this.inputText += jsonobj.choices[0].delta.content
          ? jsonobj.choices[0].delta.content
          : "";
      }
    },

    // 处理打字机输出结束
    handleMessageOutputEnd() {
      console.log("输出结束");
      this.addMessageData();
    },
    // 添加消息数据
    async addMessageData() {
      let botItem = {
        content: marked(this.inputText),
        type: "bot",
        time: moment().format("YYYY-MM-DD HH:mm:ss"),
      };
      this.messageData.splice(this.messageData.length - 1, 1, botItem);
      this.inputText = "";
      this.botobj.output = "";
      this.loading = false;
      clearInterval(this.intervalInstance);
      this.intervalInstance = null;
      // 添加数据或更新到indexdb数据库中
      if (this.messageData.length > 2) {
        this.updateChatIndexDb();
      } else {
        await this.addChatIndexDb();
        let result = await this.chatdb.chats
          .where("time")
          .equals(this.messageData[0].time)
          .toArray();
        this.allMessageData.splice(0, 1, ...result);
      }
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

    //处理消息盒子滚动
    handleMessagebooxScroll() {
      this.$refs.messageBox.addEventListener("scroll", () => {
        this.scrolling();
      });
    },
    // 滚动事件
    scrolling() {
      console.log("scroll");
    },
    //滚动条保持最底部方法
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messageBox;
        container.scrollTop = container.scrollHeight;
      });
    },
    scrolling() {
      let scrollTop = this.$refs.messageBox.scrollTop;
      // 更新——滚动前，滚动条距文档顶部的距离
      let scrollStep = scrollTop - this.oldScrollTop;
      this.oldScrollTop = scrollTop;
      //判断当前是向上or向下滚动
      if (scrollStep < 0) {
        //向上
        console.log("正在向上滚动");
        this.scrollFlag = false;
      } else {
        console.log("正在向下滚动");
        this.scrollFlag = true;
      }
    },
    // 选中历史聊天记录
    selectHistoryItem(item) {
      this.historyItem = item;
      this.messageData = item.messageData;
    },
    // 初始化indexdb数据库
    async initIndexDb() {
      this.chatdb = new Dexie("chatDataBase");
      this.chatdb.version(1).stores({
        chats: "++id, &time, messageData",
      });
      this.allMessageData = await this.chatdb.chats.toArray();
      console.log(this.allMessageData);
    },
    // 添加聊天记录到indexdb数据库
    async addChatIndexDb() {
      this.chatdb.chats.add({
        time: this.messageData[0].time,
        messageData: this.messageData,
      });
    },
    // 删除聊天记录
    async deleteOneChatIndexDb(id) {
      this.chatdb.chats.delete(id);
    },
    // 删除所有聊天记录
    async deleteAllChatIndexDb() {
      this.chatdb.chats.clear();
    },
    // 更新聊天记录到indexdb数据库
    async updateChatIndexDb() {
      let result = await this.chatdb.chats
        .where("time")
        .equals(this.messageData[0].time)
        .toArray();
      if (result.length) {
        this.chatdb.chats.put({
          id: result[0].id,
          time: this.messageData[0].time,
          messageData: this.messageData,
        });
      } else {
        console.log("没有找到该聊天记录");
      }
    },
    // 新建聊天
    createChat() {
      this.messageData = [];
      this.sendMessage = "";
      this.historyItem={
        id:-1
      }
      if(this.allMessageData.length){
        if(this.allMessageData[0].id==-1){
          return
        }
        this.allMessageData.unshift({
        id: -1,
        time: null,
        messageData: this.messageData,
      });
      }
    },
  },
  created() {
    this.initIndexDb();
  },
  mounted() {
    this.translateWs();
    this.handleMessagebooxScroll();
  },
  beforeDestroy() {
    newWebSocket.close();
    this.$refs.messageBox.removeEventListener("scroll", () => {
      this.scrolling();
    });
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
      .card {
        background: #2a1651 !important;
        height: 100%;
        border-top-right-radius: 35px;
        border-bottom-right-radius: 35px;
        .btn-box {
          display: flex;
          justify-content: center;
          padding-top: 45px;
          .addchat-btn {
            background: #7e55d7;
            color: #ffffff;
            font-weight: 500;
            border: none;
            width: 80%;
            padding: 16px 20px !important;
            border-radius: 8px !important;
          }
        }
        .history-chatbox {
          height: calc(100vh - 350px);
          border-bottom: solid 1px #463668;
          overflow-y: scroll;
          padding-top: 60px;
          .item {
            height: 40px;
            line-height: 40px;
            margin-top: 5px;
            cursor: pointer;
            color: #ffffff;
            padding-left: 35px;
            padding-right: 20px;
            display: flex;
            align-items: center;
            overflow: hidden; //超出的文本隐藏
            text-overflow: ellipsis; //溢出用省略号显示
            white-space: nowrap; //溢出不换行
            &:hover {
              background: #39226a;
            }
            span:nth-child(1) {
              font-size: 16px;
              margin-right: 10px;
            }
          }
        }
        .system-box {
          .user-info {
            display: flex;
            padding: 20px;
            .user {
              color: white;
              margin-left: 15px;
              div:nth-child(1) {
                font-size: 17px;
                font-weight: 500;
                margin-bottom: 3px;
              }
            }
          }

          .action-btn {
            color: #ffffff;
            font-size: 14px;
            padding: 0px 50px 20px 50px;
            cursor: pointer;
            span:nth-child(1) {
              font-size: 19px;
              margin-right: 10px;
            }
            span:nth-child(2) {
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
        padding-top: 10px;
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
                text-align: left;
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
      .card {
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
  width: 1px;
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
.send-btn {
  color: floralwhite;
  background-color: #524cf7;
  border-color: #2a25ab;
  padding: 10px 20px !important;
  border-radius: 5px !important;
}

.selct-class {
  background: #39226a;
}
</style>
<style>
.notiyfy {
  border: none !important;
  background-color: #6d3cd9 !important;
}

.notiyfy .el-notification__group .el-notification__title {
  color: #dd920a;
}
.notiyfy .el-notification__group .el-notification__content {
  color: #fff;
}
</style>