<template>
  <div class="chat-box">
  <div class="top-bar">
    <div class="login-action">
       <el-button  type="success">登录</el-button>
        <el-button>注册</el-button>
    </div>
  </div>
  <div class="main-body"> 
  <div class="left-box"></div>
  <div class="center-box">
    <el-card class="card">
        <div class="message-box">
        <div v-for="item in 2" :key="item" class="message-item">
          <div v-if="item%2==0" class="from-bot-box">
            <div class="date-avator">
              <span>2023/03/31 12:00:00</span>
            </div>
            <div style="position:relative;"> 
            <div class="from-bot">
              12frfjf结算单防守打法收到四大护法三等奖发生的发大水发斯蒂芬斯蒂芬发生的防守打法哦狗狗恶搞隔热32
              </div>
           <div style="position:absolute;left:-40px;top:-15px;"><el-avatar :size="30" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar></div>
            </div>
          </div>
          <div v-else class="from-me-box">
            <div class="date-avator">
              <span>2023/03/31 12:00:00</span>
            </div>
            <div style="position:relative;">
               <div class="from-me">12313fdfjf佛is地方红烧豆腐发生大火佛挡杀佛水电费撒旦法123</div>
           <div style="position:absolute;right:-30px;top:-15px;"><el-avatar :size="30" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar></div>
            </div>
          </div>
        </div>
        </div>
    <div class="send-message">
     <el-input v-model="sendMessage" class="message-input" placeholder="请输入聊天消息"
  autofocus="true" type="textarea" :autosize="{minRows: 1, maxRows: 3 }"
     ></el-input>
       <el-button type="success"  icon="el-icon-s-promotion" style="margin-left:5px;" @click="sendMsg"></el-button>
        </div>
    </el-card>
  </div>
  <div class="right-box"></div>
  </div>
  </div>
</template>

<script>
export default {
     data(){
        return{
            sendMessage:''
        }
     },
     methods:{
         sendMsg(){
          this.$http.getChatGptMessage(this.sendMessage).then(res=>{
            const eventSource = new EventSource(`/api/chatgpt/testask/${this.sendMessage}`);
            eventSource.onmessage = function(event) {
            const data = JSON.parse(event.data);
            console.log(data)
  };

  eventSource.onerror = function(event) {
    console.log('error')
  };
  console.log(res)
          })
         },
     }
}
</script>

<style lang="less" scoped>
.chat-box{
    .top-bar{
        background: #24292f;
        height: 55px;
        line-height: 55px;
        .login-action{
          float: right;
          margin-right: 20px;
        }
    }
    .main-body{
        display: flex;
        height: calc(100vh - 60px);
        .left-box{
          width:15%;
          height: 100%;

        }
        .center-box{
          width: 70%;
          padding-top: 20px;
          padding-bottom: 20px;
          .card{
            height: 100%;
            position: relative;
            background: #f2f6fc !important;
            .message-box{
                height: calc(100vh - 200px);
                overflow-y: scroll;
                display: flex;
                flex-direction: column;
               .message-item{
                   margin: 0 50px;
                  .from-bot-box{
                    .date-avator{
                    margin-bottom: 10px;
                    padding-left: 10px;
                    font-size: 12px;
                    opacity: 0.9;
                  }
                .from-bot{
                 max-width: 45%;
                  background: #d3dee9;
                  display: inline-block;
                  padding: 10px;
                  border-radius: 10px;
                  font-size: 14px;
                  line-height: 25px;
                }
                }
                .from-me-box{
                  .date-avator{
                    display: flex;
                    justify-content: end;
                    margin-bottom: 10px;
                    padding-right: 20px;
                    font-size: 12px;
                    opacity: 0.9;
                  }
                .from-me{
                 float: right;
                 margin-right: 10px;
                 max-width: 40%;
                 background: #67c23a;
                 color: black;
                 border-radius: 10px;
                 padding: 10px;
                 text-align: right;
                 font-size: 14px;
                 line-height: 25px;
                 margin-bottom: 20px;
                 opacity: 0.7;
                }
                }
              }
            }
            .send-message{
                display: flex;
           position: absolute;
            bottom: 20px;
            left: 10%;
            width: 80%;
            align-items: center;
            }
          }
        }
        .right-box{
        width: 15%;
          height: 100%;
        }
    }
}
</style>
<style scoped>
.message-input /deep/ .el-textarea__inner{
 border: solid 1px #b2b3b5;
 border-radius: 5px;
    }
     .message-box::-webkit-scrollbar{
        width:5px;
        height:10px;
        /**/
      }
      .message-box::-webkit-scrollbar-track{
        background: rgb(239, 239, 239);
        border-radius:2px;
      }
      .message-box::-webkit-scrollbar-thumb{
        background: #bfbfbf;
        border-radius:10px;
      }
      .message-box::-webkit-scrollbar-thumb:hover{
        background: #333;
      }
      .message-box::-webkit-scrollbar-corner{
        background: #179a16;
      }
      /deep/ .el-card__body{
        padding-right: 0px !important;
        opacity: 0.8 !important;
      }
</style>