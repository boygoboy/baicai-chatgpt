<template>
  <div class="chat-box">
  <div class="top-bar"></div>
  <div class="main-body"> 
  <div class="left-box"></div>
  <div class="center-box">
    <el-card class="card">
        <div class="message-box">
        <div v-for="item in 500" :key="item">
            <div class="from-bot" v-if="item%2==0">1232</div>
            <div class="from-me" v-else>12313123</div>
        </div>
        </div>
    <div class="send-message">
     <el-input v-model="sendMessage" class="message-input"
  autofocus="true"
     ></el-input>
       <el-button type="success"  icon="el-icon-s-promotion" style="margin-left:5px;"></el-button>
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

     }
}
</script>

<style lang="less" scoped>
.chat-box{
    .top-bar{
      
        height: 55px;
        line-height: 55px;
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
          height: 100%;
          .card{
            height: 100%;
            position: relative;
            .message-box{
                border: solid 1px black;
                height: calc(100vh - 200px);
                overflow-y: scroll;
                width: 85%;
                margin: 0 auto;
                display: flex;
                flex-direction: column;
                .from-bot{
                 max-width: 60%;
                  background: #f4f6f8;
                  display: inline-block;
                }
                .from-me{
                 float: right;
                 margin-right: 10px;
                 max-width: 40%;
                 background: #e57d23;
                 color: black;
                 border-radius: 10px;
                 opacity: 0.7;
                 padding: 5px;
                 text-align: right;
                }
            }
            .send-message{
                display: flex;
           position: absolute;
            bottom: 20px;
            left: 10%;
            width: 80%;
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
.message-input /deep/ .el-input__inner{
 border: solid 1px #b2b3b5;
 border-radius: 10px;
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
</style>