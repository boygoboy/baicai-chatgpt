<template>
  <div class="app">
    <div class="main-box">
      <el-tabs  class="tab-box" @tab-click="changeTab">
            <el-tab-pane  class="chat-setting">
            <span slot="label"><i class="fa fa-comments" style="margin-right:5px;"></i>聊天配置</span>
         <chat-setting></chat-setting>
        </el-tab-pane>
        <el-tab-pane  class="chat-model">
          <span slot="label"><i class="fa fa-cogs" style="margin-right:5px;"></i>模型配置</span>
          <div class="title">
            <span class="fa fa-wrench"></span>
            <span>chatgpt模型</span>
              <el-button type="text" style="float: right;color:#7944db;" @click="enableSetting" v-if="!enableEdit"
              >配置</el-button
            >
             <el-button type="text" style="float: right;color:#7944db;" @click="saveSetting" v-else
              >保存</el-button
            >
          </div>
          <el-table height="calc(100vh - 265px)"
            class="model-table"
            :span-method="objectSpanMethod"
            :data="tableData"
            border
            ref="modelTable"
            style="width: 100%"
          >
            <el-table-column prop="model" label="模型名称" min-width="10">
            </el-table-column>
            <el-table-column prop="parameter" label="参数名称" min-width="10">
            </el-table-column>
            <el-table-column prop="value" min-width="12" label="参数值">
              <template slot-scope="scope">
                <span v-if="scope.row.type == 'bool'">
                  <el-switch v-model="scope.row.value" :disabled="!enableEdit"></el-switch>
                </span>
                <span v-if="scope.row.type=='int'">
                  <el-slider v-model="scope.row.value"  :disabled="!enableEdit"
                   :min="Number(scope.row.range.split(',')[0])"
                   :max="Number(scope.row.range.split(',')[1])"></el-slider>
                </span>
                 <span v-if="scope.row.type=='float'">
                   <el-slider v-model="scope.row.value"  :step="0.01" :disabled="!enableEdit"
                    :min="Number(scope.row.range.split(',')[0])" :max="Number(scope.row.range.split(',')[1])"
                   ></el-slider>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="description" min-width="50" label="参数描述">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane  class="key-setting">
        <span slot="label"><i class="fa fa-key" style="margin-right:5px;"></i>密钥配置</span>
        <key-setting></key-setting>
        </el-tab-pane>
      </el-tabs>
    </div>

  </div>
</template>

<script>
import chatSetting from './components/chatSetting.vue'
import keySetting from './components/keySetting.vue'
export default {
  components:{
       chatSetting,keySetting
  },
    data() {
      return {
        tableData: [],
        dialogVisible:false,
        chatsettingForm:{
            channel:'官方',
            url:'',
            key:[],
            model:'',
            enablecontext:false,
            proxytype:'',
            proxyurl:''
        },
        chatsettingView:{
            channel:'官方',
            url:'',
            key:[],
            model:'',
            enablecontext:false,
            proxytype:'',
            proxyurl:''
        },
        rules:{
           channel:[{required:true,message:'请选择聊天渠道',trigger:'change'}],
           url:[{required:true,message:'请输入请求接口',trigger:'blur'}],
           key:[{required:true,message:'请选择或者创建密钥',trigger:'change'}],
           model:[{required:true,message:'请选择聊天模型',trigger:'change'}],
           enablecontext:[{required:true,message:'请选择是否开启上下文对话',trigger:'change'}],
        },
        keyOptions:[],
        enableEdit:false,
        chatSettingTableData:[],
      };
    },
    methods:{
      // 改变聊天渠道
      changeChannel(){
        this.chatsettingForm.model=''
        this.chatsettingForm.url=''
        this.chatsettingForm.key=[]
      },
      //合并单元格 
objectSpanMethod({ row, column, rowIndex, columnIndex }) {

  const  flitterData=(arr)=> {
    let spanOneArr = []
    let concatOne = 0
    arr.forEach((item, index) => {
        if (index === 0) {
            spanOneArr.push(1)
        } else {
            //name 修改
            if (item.model === arr[index - 1].model) {
                //第一列需合并相同内容的判断条件
                spanOneArr[concatOne] += 1
                spanOneArr.push(0)
            }else {
                spanOneArr.push(1)
                concatOne = index
            }
        }
    })
    return {
        one: spanOneArr,
    }
}
    if (columnIndex === 0) {
    // this.tableData  修改
        const _row = flitterData(this.tableData).one[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
        rowspan: _row,
        colspan: _col,
        }
    }
},
// 弹窗
openDialog(){
        this.chatsettingForm={
            channel:this.chatsettingView.channel,
            url:this.chatsettingView.url,
            key:this.chatsettingView.key,
            model:this.chatsettingView.model,
            enablecontext:this.chatsettingView.enablecontext,
            proxytype:this.chatsettingView.proxytype,
            proxyurl:this.chatsettingView.proxyurl
      }
  this.dialogVisible=true
},
handleClose(){
  this.dialogVisible=false
},
submitChatSetting(){
  this.$refs.chatsettingForm.validate(valid=>{
    if(valid){
   const data={
    channel:this.chatsettingForm.channel,
    url:this.chatsettingForm.url,
    key:this.chatsettingForm.key,
    model:this.chatsettingForm.model,
    enablecontext:this.chatsettingForm.enablecontext,
    proxytype:this.chatsettingForm.proxytype,
    proxyurl:this.chatsettingForm.proxyurl
  }
  this.$http.putChatParam(data).then(res=>{
    if(res.errorCode=='0000'){
      this.$message({
        message: '保存成功',
        type: 'success'
      });
      this.getChatParam()
       this.dialogVisible=false
    }else{
      this.$message.error(res.message);
    }
  })
    }
  })
},
enableSetting(){
this.enableEdit=true
},
saveSetting(){
this.$http.putModelParam(this.tableData).then(res=>{
  if(res.errorCode=='0000'){
    this.$message({
      message: '保存成功',
      type: 'success'
    });
    this.getModelParam()
    this.enableEdit=false
  }else{
    this.$message.error(res.message);
  }
})

this.enableEdit=false
},
// 获取聊天配置参数
getChatParam(){
  this.$http.getChatParam().then(res=>{
    if(res.errorCode=='0000'){
      let {channel,url,key,model,enablecontext,proxytype,proxyurl}=res.data
       this.chatsettingView={
            channel,
            url,
            key,
            model,
            enablecontext,
            proxytype,
            proxyurl
        }
    }
  })
},
// 获取模型配置参数
getModelParam(){
  this.$http.getModelParam().then(res=>{
    if(res.errorCode=='0000'){
      this.tableData=res.data
      this.tableData.forEach(item=>{
        if(item.type=='bool'){
        item.value=item.value==1?true:false
        }
      })
    }
  })  
},
// 改变代理类型
changProxyType(value){
  if(value==''){
    this.chatsettingForm.proxyurl=''
  }
},
// 改变聊天模型
changeModel(value){
  if(value==''){
    this.chatsettingForm.url=''
  }
  if(value=='gpt-3.5-turbo'||value=='gpt-3.5-turbo-0301'){
    // this.chatsettingForm.url='https://api.openai.com/v1/chat/completions'
  }
  if(value=='text-davinci-003'){
    // this.chatsettingForm.url='https://api.openai.com/v1/completions'
  }
},
changeTab(){
         this.$nextTick(() => {
        this.$refs.modelTable.doLayout()
    })
}
    },
    created(){
      this.getChatParam()
      this.getModelParam()
    },
    mounted(){
       this.$nextTick(() => {
        this.$refs.modelTable.doLayout()
    })
    },
activated() {
    this.$refs.modelTable.doLayout()
}
}
</script>

 <style lang="less" scoped>
.app {
  .main-box {
    height: calc(100vh - 130px);
    .tab-box {
      height: 100%;
    padding: 20px;
    padding-top: 0px;
    border: 1px solid #EBEEF5;
    background-color: #FFF;
    color: #303133;
    border-radius: 5px;
    transition: .3s;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      .chat-model {
        .chat-setting {
          margin-top: 20px;
          border: solid 1px #ebeef5;
          padding: 10px;
          padding-bottom: 0;
        }
        .title {
          margin-top: 10px;
          span:nth-child(1) {
            font-size: 18px;
            color: #7a69ee;
            margin-right: 10px;
          }
          span:nth-child(2) {
            font-size: 16px;
            color: rgb(29, 28, 28);
            opacity: 0.8;
          }
        }
        .model-table {
          margin-top: 20px;
        }
      }

      .chat-setting{
         .action-btn{
           margin-bottom: 20px;
         }

         .table-box{

         }
      }
    }
  }
}
</style>
<style scoped>
/deep/ .el-dialog__footer {
  text-align: center;
}
.el-select ::v-deep .popper-class {
  width: 300px;
}
.iclass-text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/deep/ .el-select__tags{
  overflow: hidden;
}
/deep/ .key-content{
              width:70%;
              text-overflow:ellipsis;
              white-space:nowrap;
              overflow:hidden;
}
.tab-box /deep/ .el-tabs__nav-wrap{
  margin: 5px 0px;
}
/deep/ .el-slider__bar{
  background-color: #a07eeb !important;
}
/deep/ .el-switch.is-checked .el-switch__core{
    background-color: #a07eeb !important;
    border-color: #a07eeb !important;
}
/deep/ .el-slider__button{
  border: 2px solid #a07eeb !important;
}
</style>
