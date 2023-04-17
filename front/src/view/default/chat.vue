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
            <div @mouseover="showActionBtn(item)" @mouseleave="hideActionBtn(item)"
              v-for="item in allMessageData"
              :key="item.id"
              class="item"
              @click="selectHistoryItem(item)"
              :class="historyItem?item.id == historyItem.id ? 'selct-class' : '':''"
            >
              <span class="fa fa-commenting-o"></span>
              <el-input ref="historychatinput" class="historychat-input" v-model="item.messageData[0].content" v-if="item.isedit" @blur="saveHistoryItem(item)"></el-input>
              <span v-else>{{item.messageData[0]?item.messageData[0].content:''}}</span>
              <div class="action-btn">
                <span :class="historyItem?(item.id == historyItem.id ) ? 'el-icon-edit' : '':item.hover?'el-icon-edit':''" @click="editHistoryItem(item)"></span>
              <el-popconfirm cancel-button-type="primary" popper-class="chat-popconfirm" title="确认要删除这条消息聊天吗？" @confirm="deleteHistoryItem(item)">
              <span slot="reference" :class="historyItem?(item.id == historyItem.id )? 'el-icon-delete' : '':item.hover?'el-icon-delete':''" style="margin-left:5px;"></span>
              </el-popconfirm>
              </div>
            </div>
          </div>
          <div class="clear-all" v-if="allMessageData.length">
             <el-popconfirm cancel-button-type="primary" popper-class="chat-popconfirm" title="确认要删除所有消息聊天吗？" @confirm="deleteAllHistoryItem">
             <span slot="reference"> <span class="el-icon-delete" style="margin-right:5px;color:#ffffff;"></span><span style="color:#ffffff;">清除所有聊天</span></span>
              </el-popconfirm>
          </div>
          <div class="system-box">
            <div class="user-info">
              <el-avatar
                :size="45"
                src="https://imgurl-1301237494.cos.accelerate.myqcloud.com/imgs/2023/04/04/baa46d5e44e75977.png"
              ></el-avatar>
              <div class="user">
                <div>BAICAI-GPT</div>
                <!-- <div>free acount</div> -->
              </div>
            </div>
            <!-- <div class="action-btn">
              <span class="fa fa-download"></span>
              <span>下载聊天记录</span>
            </div>
            <div class="action-btn">
              <span class="fa fa-external-link"></span>
              <span>chatgpt学习</span>
            </div> -->
            <div class="action-btn" v-if="!token" @click="handleLogin">
              <span class="fa fa-sign-in"></span>
              <span>登录</span>
            </div>
            <div class="action-btn" v-if="!token" @click="openRegister">
              <span class="fa fa-user-circle-o"></span>
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
      <div class="center-box" :style="{width:isStrech?'85%':'70%'}">
        <div class="card">
               <div class="strech-box" @click="switchStretch" style="cursor:pointer;">
          <span class="el-icon-d-arrow-left" v-if="isStrech"></span>
        </div>
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
                      v-html="formatMd"
                      v-if="inputText && index == messageData.length - 1"
                    ></div>
                   <div v-else v-highlight v-html="item.content"></div>
                  </div>
                  <div style="position: absolute; left: -40px; top: -15px">
                    <el-avatar
                      :size="30"
                      src="https://imgurl-1301237494.cos.accelerate.myqcloud.com/imgs/2023/04/03/e06ac96787602371.png"
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
                      src="https://imgurl-1301237494.cos.accelerate.myqcloud.com/imgs/2023/04/03/da98ec6ccdcf12e2.png"
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
      <transition enter-active-class="animate__fadeInRight" leave-active-class="animate__fadeOutRight">
      <div style="cursor:pointer;" class="right-box" :style="{width:isStrech?'0px':'15%'}" v-show="!isStrech">
        <div class="strech-box" @click="switchStretch">
          <span class="el-icon-d-arrow-right" v-if="!isStrech"></span>
        </div>
        <div class="card"></div>
      </div>
      </transition>
    </div>
  </div>
</template>
<script>
// import WebSocket from '@/utils/class/ws';
import { newWebSocket } from "@/utils/websocket.js";
import Cookie from "js-cookie";
import EasyTyper from "easy-typer-js";
// 将markdown转换成html
import { marked } from "marked";
// 引入样式
// import "highlight.js/styles/github-dark.css";
import moment from "moment";
import Dexie from "dexie";
import MarkdownIt from 'markdown-it';
// import Prism from 'prismjs';
import Prism from '@/utils/prism.js';
import 'prismjs/themes/prism-tomorrow.css';
import MarkdownTypewriter from './components/MarkdownTypewriter.vue';
import ClipboardJS from 'clipboard';
import VueTypewriter from './components/VueTypewriter.vue';


export default {
  components:{
    MarkdownTypewriter,VueTypewriter
    },
  data() {
       // 随机生产uuid
   const uuid=() =>{
    let s = [];
    let hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    let uuid = s.join("");
    return uuid;
}
    return {
      formatText:'',
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
      isStrech:false,
      typeEnable:false,
      typewriterOptions: {
        delay: 28,
      },
      md: new MarkdownIt({
        html: true,
        highlight: (str, lang) => {
          const currentId = `code-block-${uuid()}`;
          if (lang && Prism.languages[lang]) {
            try {
              return (
                  '<pre class="code-container" style="position:relative;background:#181616;">'+
                '<pre style="background:#100f0f;" class="language-' +
                lang +
                '" id="'+currentId+'"><code>' +
                Prism.highlight(str, Prism.languages[lang], lang) +
                '</code></pre>' +
                '<button style="position:absolute;top:0;right:0;" class="copy-button" data-clipboard-target="#'+
                currentId+
                '"><i class="fa fa-copy"></i> Copy</button>'+'</pre>'
              );
            } catch (e) {}
          }
          return (
             '<pre class="code-container" style="position:relative;background:#181616;">'+
            '<pre style="background:#100f0f;" class="language-' +
            lang +
            '" id="'+currentId+'"><code>' +
            str.replace(/[&<>]/g, (m) => ({
              '&': '&amp;',
              '<': '&lt;',
              '>': '&gt;',
            })[m]) +
            '</code></pre>'+
                           '<button style="position:absolute;top:0;right:0;" class="copy-button" data-clipboard-target="#'+
                currentId+
                '"><i class="fa fa-copy"></i> Copy</button>'+'</pre>'
          );
        },
      }),
      userChatParams:{},  //用户聊天参数
    };
  },
  methods: {
    // 复制粘贴功能
         initClipboard() {
      new ClipboardJS('.copy-button');
    },
    openRegister(){
      this.$router.push({path:'/login',query:{type:'register'}})
    },
    // 切换伸缩
    switchStretch(){
      this.isStrech = !this.isStrech
    },
    // 退出登录
    logout() {
      this.$confirm("此操作将退出系统, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: 'logout-confirm'
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
      setTimeout(()=>{location.reload();},200) 
    },
    // 处理登录
    handleLogin() {
      this.$router.push({ path: "/login" ,query:{type:'login'}});
    },
    sendMsg() {
      if(!this.sendMessage){
          this.$message.warning({
          message:'请输入聊天消息！',
          type:'warning',
          customClass:'message-warning'
        })
        return
      }
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
        originalContent: this.sendMessage,
        content: this.sendMessage,
        type: "me",
        time: moment().format("YYYY-MM-DD HH:mm:ss"),
      };
      this.messageData.push(meItem, {
        originalContent: "正在思考中，请耐心等待...",
        content: "正在思考中，请耐心等待...",
        type: "bot",
        time: "",
      });
      console.log(this.handleChatMessageContent())
      newWebSocket.sendMsg(JSON.stringify(this.handleChatMessageContent()));
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
      console.log(data)
      if (data == "token校验失败!"||data=='缺少token!') {
        this.notifyInstance = this.$notify({
          title: "警告",
          message: "您还未登录，登录后可聊天！",
          type: "warning",
          duration: 10000,
          customClass: "notiyfy",
        });
      }
      if (data=='[START]') {
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

        // 处理开始打字流程
        let tempIntervalInstance= setInterval(()=>{
           if(this.inputText){
          this.typeEnable=true
          clearInterval(tempIntervalInstance)
          }
        },200) 
      }
      if (
       data=='[DONE]'
      ) {
        setTimeout(()=>{
           this.handleMessageOutputEnd()
        },300)
        return
      }
      if (data!='[START]'&&data!='[DONE]') {
        setTimeout(() => {
        let newdata=data.replace(/\\n/g,'\r\n')
        this.inputText += newdata
        }, 50)
      }
    },

    // 处理打字机输出结束
    handleMessageOutputEnd() {
      console.log("输出结束");
      this.typeEnable=false
      this.initClipboard()
      this.addMessageData();
    },
    // 添加消息数据
    async addMessageData() {
      let botItem = {
        // content: marked(this.inputText),
        originalContent: this.inputText,
        content: this.md.render(this.inputText),
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
        this.scrollFlag = true;
      }
    },
    // 选中历史聊天记录
    selectHistoryItem(item) {
      this.historyItem = item;
      this.messageData = item.messageData;
      this.initClipboard()
    },
    // 鼠标移入历史聊天记录
    showActionBtn(item) {
      this.$set(item,'hover',true)
    },
    // 鼠标移出历史聊天记录
    hideActionBtn(item) {
      this.$set(item,'hover',false)
    },
    // 编辑历史聊天记录
    editHistoryItem(item) {
       this.$set(item,'isedit',true)

    },
    // 保存历史聊天记录
    saveHistoryItem(item) {
      this.$set(item,'isedit',false)
      this.updateHistoryChatIndexDb(item)
    },
    // 删除历史聊天记录
    deleteHistoryItem(item){
        this.deleteOneChatIndexDb(item.id)
       let index= this.allMessageData.findIndex(obj=>obj.id==item.id)
       this.allMessageData.splice(index,1)
       this.messageData=[]
       this.historyItem=null
    },
    deleteAllHistoryItem(){
      this.deleteAllChatIndexDb()
       this.messageData=[]
       this.historyItem=null
       this.allMessageData=[]
    },
    // 初始化indexdb数据库
    async initIndexDb() {
      this.chatdb = new Dexie("chatDataBase");
      this.chatdb.version(1).stores({
        chats: "++id, &time, messageData",
      });
      this.allMessageData = await this.chatdb.chats.toArray();
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
        // 更新历史聊天记录到indexdb数据库
    async updateHistoryChatIndexDb(item){
      this.chatdb.chats.put({
        id: item.id,
        time: item.time,
        messageData: item.messageData,
      });
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
      }
         this.initIndexDb();
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
        messageData: [{time:'',content:'',type:'me'}],
      });
      }else{
        this.allMessageData.push({
        id: -1,
        time: null,
        messageData: [{time:'',content:'',type:'me'}],
      });
      }
    },
    // 获取用户聊天参数
    getUserChatParam(){ 
         this.$http.getUserChatParam().then(res=>{
            if(res.errorCode=='0000'){
              this.userChatParams=res.data
            }
         })
    },
    //处理发送的聊天消息
    handleChatMessageContent(){
      const enablecontext=this.userChatParams.chatParam.enablecontext
       const historyMessageData=this.messageData.slice(-8)
       const message=[]
       if(enablecontext){
        historyMessageData.forEach((item,index)=>{
          if(index==historyMessageData.length-1){
            return
          }
          if(item.type=='me'){
            message.push({"role": "user", "content": item.originalContent})
          }else{
            message.push({"role": "assistant", "content": item.originalContent})
          }
        })
       }else{
         message.push({"role": "user", "content": this.sendMessage})
       }
        message.unshift({"role": "system", "content": "You are a helpful assistant."})
        message.forEach(item=>{
            item.content=item.content.replace(/[\r]/g, "")
        })
        return message
    }
  },
  computed:{
           formatMd(){
      return this.md.render(this.inputText)
    },
  },
  created() {
    this.initIndexDb();
    this.getUserChatParam()
  },
  mounted() {
    if(!this.token){
              this.notifyInstance = this.$notify({
          title: "警告",
          message: "您还未登录，登录后可聊天！",
          type: "warning",
          duration: 10000,
          customClass: "notiyfy",
        });
    }
    Cookie.get("token")&&this.translateWs();
    this.handleMessagebooxScroll();
    Prism.highlightAll()
  },
  beforeDestroy() {
    if(newWebSocket.websocket){
    newWebSocket.close();
    }
    this.$refs.messageBox.removeEventListener("scroll", () => {
      this.scrolling();
    });
    if(this.intervalInstance){
      clearInterval(this.intervalInstance)
    }
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
          height: calc(100vh - 300px);
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
            &:hover {
              background: #39226a;
            }
            span:nth-child(1) {
              font-size: 16px;
              margin-right: 10px;
            }
            span:nth-child(2) {
                 width: 65%;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
            }
            .historychat-input{
               /deep/ .el-input__inner{
                height: 25px !important;
                line-height: 25px !important;
                border: none;
               }
            }
            .action-btn{
              display: flex;
              align-items: center;
              padding-left: 5px;
            }
          }
        }
        .clear-all{
          height: 40px;
          line-height: 40px;
          display: flex;
          align-items: center;
          padding: 0 20px 5px 27%;
          cursor: pointer;
        }
        .system-box {
          border-top: solid 1px #463668;
          .user-info {
            display: flex;
            padding: 20px;
            .user {
              color: white;
              margin-left: 15px;
              display: flex;
              align-items: center;
              div:nth-child(1) {
                font-size: 17px;
                font-weight: 500;
                margin-bottom: 3px;
              }
            }
          }

          .action-btn {
            color: #ffffff;
            font-size: 13px;
            padding: 0px 50px 20px 50px;
            cursor: pointer;
            span:nth-child(1) {
              font-size: 17px;
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
              .strech-box{
        position: absolute;
        top:40px;
        right: -5px;
        width: 35px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background: #2a1651;
        color: #ffffff;
        border-top-left-radius: 15px;
        border-bottom-left-radius: 15px;
      }
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
                padding: 20px 25px;
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
                text-align: left;
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
      position: relative;
      .strech-box{
        position: absolute;
        top:40px;
        left: -35px;
        width: 35px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background: #2a1651;
        color: #ffffff;
        border-top-left-radius: 15px;
        border-bottom-left-radius: 15px;
      }
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
.chat-popconfirm {
background: #6d3cd9 !important;
color: #ffffff !important;
border: none !important;
}
.chat-popconfirm .el-popconfirm .el-popconfirm__action{
  text-align: center !important;
  padding-top: 8px;
}
.chat-popconfirm .el-popconfirm .el-popconfirm__action .el-button:nth-child(1){
  color: #ffffff !important;
  border: none !important;
  background: #524cf7 !important;
}
.chat-popconfirm .el-popconfirm .el-popconfirm__action .el-button:nth-child(2){
  color: #ffffff !important;
  background: #524cf7 !important;
  border: none;
}
.logout-confirm{
  background: #6d3cd9 !important;
  color: #ffffff !important;
  border: none !important;
}
.logout-confirm .el-message-box__header .el-message-box__title{
  color: #ffffff !important;
}
.logout-confirm .el-message-box__header .el-message-box__headerbtn .el-message-box__close{
  color: #ffffff !important;
}
.logout-confirm .el-message-box__content{
  color: #ffffff !important;
}
.logout-confirm .el-message-box__btns{
  text-align: center !important;
}
.logout-confirm .el-message-box__btns .el-button{
  color: #ffffff !important;
  background: #524cf7 !important;
  border: none;
}
.message-warning {
  background: #524cf7 !important;
  color: #fff;
  border: none;
}
.message-warning .el-message__content{
  color: #fff;
}

.code-container {
  position: relative;
}

.copy-button {
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.2);
  border: none;
  color: white;
  padding: 5px 8px;
  font-size: 12px;
  cursor: pointer;
  border-radius: 0 0 0 5px;
}

.copy-button:hover {
  background-color: rgba(0, 0, 0, 0.3);
}
</style>