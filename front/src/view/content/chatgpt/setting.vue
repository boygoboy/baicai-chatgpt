<template>
  <div class="app">
    <div class="main-box">
      <el-tabs type="border-card" class="tab-box">
        <el-tab-pane label="聊天参数" class="chat-model">
          <div class="title" style="margin-bottom: 20px">
            <span class="fa fa-comment-o"></span>
            <span>聊天配置</span>
            <el-button type="text" style="float: right" @click="openDialog"
              >配置</el-button
            >
          </div>
          <div class="chat-setting">
            <el-descriptions class="margin-top" :column="3">
                <el-descriptions-item label="聊天渠道"
                >{{chatsettingView.channel}}</el-descriptions-item
              >
               <el-descriptions-item label="请求接口">{{chatsettingView.url}} </el-descriptions-item>
              <el-descriptions-item label="请求密钥" content-class-name="key-content" >
              {{chatsettingView.key[0]}}
               </el-descriptions-item
              >
              <el-descriptions-item label="聊天模型"
                >{{chatsettingView.model}}</el-descriptions-item
              >
               <el-descriptions-item label="上下文对话"
                >{{chatsettingView.enablecontext?'开启':'关闭'}}</el-descriptions-item
              >
              <el-descriptions-item label="代理地址"
                >
                <span v-if="chatsettingView.proxytype">
                  {{chatsettingView.proxytype}}://{{chatsettingView.proxyurl}}
                </span>
                </el-descriptions-item
              >
            </el-descriptions>
            
          </div>
          <div class="title" style="margin-top: 20px">
            <span class="fa fa-wrench"></span>
            <span>模型参数</span>
              <el-button type="text" style="float: right" @click="enableSetting" v-if="!enableEdit"
              >配置</el-button
            >
             <el-button type="text" style="float: right" @click="saveSetting" v-else
              >保存</el-button
            >
          </div>
          <el-table height="calc(100vh - 400px)"
            class="model-table"
            :span-method="objectSpanMethod"
            :data="tableData"
            border
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
      </el-tabs>
    </div>

    <!---------------------------------------配置聊天参数弹窗开始---------------------------------->

    <el-dialog
      title="聊天配置"
      :visible.sync="dialogVisible"
      width="35%"
      :before-close="handleClose"
    >
     
<el-form :model="chatsettingForm" :rules="rules" ref="chatsettingForm" label-width="130px" class="demo-ruleForm">
  <el-form-item label="聊天渠道：" prop="channel">
    <el-select v-model="chatsettingForm.channel" placeholder="请选择聊天渠道" 
    style="width:100%;" @change="changeChannel">
      <el-option label="官方" value="官方"></el-option>
      <el-option label="非官方" value="非官方"></el-option>
    </el-select>
  </el-form-item>
      <el-form-item label="聊天模型：" prop="model">
    <el-select v-model="chatsettingForm.model" placeholder="请选择聊天模型"
     :clearable="true" style="width:100%;" 
     @change="changeModel" v-if="chatsettingForm.channel=='官方'">
      <el-option label="gpt-3.5-turbo" value="gpt-3.5-turbo"></el-option>
      <el-option label="gpt-3.5-turbo-0301" value="gpt-3.5-turbo-0301"></el-option>
      <el-option label="text-davinci-003" value="text-davinci-003"></el-option>
    </el-select>
        <el-select v-model="chatsettingForm.model" placeholder="请选择聊天模型"
         :clearable="true" style="width:100%;" 
          @change="changeModel" v-else>
      <el-option label="text-davinci-002-render-sha" value="text-davinci-002-render-sha"></el-option>
      <el-option label="gpt-4" value="gpt-4"></el-option>
        <el-option label="gpt-3.5-turbo" value="gpt-3.5-turbo"></el-option>
      <el-option label="gpt-3.5-turbo-0301" value="gpt-3.5-turbo-0301"></el-option>
      <el-option label="text-davinci-003" value="text-davinci-003"></el-option>
    </el-select>
  </el-form-item>
    <el-form-item label="请求接口：" prop="url">
    <el-input v-model="chatsettingForm.url" placeholder="请输入对应模型请求接口" style="width:100%;"></el-input>
  </el-form-item>
    <el-form-item label="请求密钥：" prop="key">
    <el-select style="width:100%;"
     popper-class="popper-class" 
     :popper-append-to-body="false"
    v-model="chatsettingForm.key"
    :multiple-limit="1"
    multiple
    filterable
    allow-create
    clearable
    default-first-option
    placeholder="请选择或者创建密钥">
    <el-option
      v-for="item in keyOptions"
      :key="item.value"
      :label="item.value"
      :value="item.value">
        <el-tooltip
          placement="top"
          :disabled="item.value.length<17"
        >
            <div slot="content">
                <span>{{item.value}}</span>
            </div>
            <div class="iclass-text-ellipsis">{{ item.value }}</div>
        </el-tooltip>
    </el-option>
  </el-select>
  </el-form-item>
  <el-form-item label="上下文对话：" prop="enablecontext" v-if="chatsettingForm.channel=='官方'">
    <el-switch v-model="chatsettingForm.enablecontext"></el-switch>
  </el-form-item>
    <el-form-item label="代理类型：" prop="proxytype" v-if="chatsettingForm.channel=='官方'">
    <el-select v-model="chatsettingForm.proxytype" placeholder="请选择类型" :clearable="true" style="width:100%;" @change="changProxyType">
      <el-option label="socks5" value="socks5"></el-option>
      <el-option label="http" value="http"></el-option>
      <el-option label="https" value="https"></el-option>
    </el-select>
  </el-form-item>
    <el-form-item label="代理地址：" prop="pxoxyurl" v-if="chatsettingForm.channel=='官方'">
    <el-input v-model="chatsettingForm.proxyurl" placeholder="请输入ip:端口号:用户名:密码格式" style="width:100%;" :disabled="!chatsettingForm.proxytype"></el-input>
  </el-form-item>
</el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitChatSetting">确 定</el-button>
      </span>
    </el-dialog>
    <!---------------------------------------配置聊天参数弹窗结束---------------------------------->
  </div>
</template>

<script>
export default {
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
        enableEdit:false
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
}
    },
    created(){
      this.getChatParam()
      this.getModelParam()
    }
}
</script>

 <style lang="less" scoped>
.app {
  .main-box {
    height: calc(100vh - 135px);
    .tab-box {
      height: 100%;

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
</style>
