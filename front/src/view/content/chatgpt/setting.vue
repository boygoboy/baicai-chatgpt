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
                >{{chatsettingForm.channel}}</el-descriptions-item
              >
               <el-descriptions-item label="请求接口">{{chatsettingForm.url}} </el-descriptions-item>
              <el-descriptions-item label="请求密钥"
                >{{chatsettingForm.key[0]}}</el-descriptions-item
              >
              <el-descriptions-item label="聊天模型"
                >{{chatsettingForm.model}}</el-descriptions-item
              >
               <el-descriptions-item label="上下文对话"
                >{{chatsettingForm.enablecontext?'开启':'关闭'}}</el-descriptions-item
              >
              <el-descriptions-item label="代理地址"
                >
                <span v-if="chatsettingForm.proxytype">
                  {{chatsettingForm.proxytype}}://{{chatsettingForm.proxyurl}}
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
      width="30%"
      :before-close="handleClose"
    >
     
<el-form :model="chatsettingForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="聊天渠道：" prop="channel">
    <el-select v-model="chatsettingForm.channel" placeholder="请选择聊天渠道" style="width:100%;">
      <el-option label="官方" value="官方"></el-option>
      <el-option label="非官方" value="非官方"></el-option>
    </el-select>
  </el-form-item>
    <el-form-item label="请求接口：" prop="url">
    <el-input v-model="chatsettingForm.url" placeholder="请输入请求接口" style="width:100%;"></el-input>
  </el-form-item>
    <el-form-item label="请求密钥：" prop="key">
    <el-select style="width:100%;"
    v-model="chatsettingForm.key"
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
    </el-option>
  </el-select>
  </el-form-item>
    <el-form-item label="聊天模型：" prop="model" v-if="chatsettingForm.channel=='官方'">
    <el-select v-model="chatsettingForm.model" placeholder="请选择聊天模型" :clearable="true" style="width:100%;">
      <el-option label="gpt-3.5-turbo" value="gpt-3.5-turbo"></el-option>
      <el-option label="gpt-3.5-turbo-0301" value="gpt-3.5-turbo-0301"></el-option>
      <el-option label="text-davinci-003" value="text-davinci-003"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="上下文对话：" prop="enablecontext" v-if="chatsettingForm.channel=='官方'">
    <el-switch v-model="chatsettingForm.enablecontext"></el-switch>
  </el-form-item>
    <el-form-item label="代理类型：" prop="proxytype" v-if="chatsettingForm.channel=='官方'">
    <el-select v-model="chatsettingForm.proxytype" placeholder="请选择类型" :clearable="true" style="width:100%;">
      <el-option label="socks5" value="socks5"></el-option>
      <el-option label="http" value="https"></el-option>
      <el-option label="https" value="https"></el-option>
    </el-select>
  </el-form-item>
    <el-form-item label="代理地址：" prop="pxoxyurl" v-if="chatsettingForm.channel=='官方'">
    <el-input v-model="chatsettingForm.proxyurl" placeholder="请输入ip:端口号:用户名:密码格式" style="width:100%;"></el-input>
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
        tableData: [
          {
            model:'gpt-3.5-turbo',
            parameter:'temperature',
            value:1,
            description:'使用什么样的采样温度，介于0和2之间。较高的值（如0.8）将使输出更随机，而较低的值（如0.2）将使其更集中和确定性。',
            type:'float',
            range:'0,2'
        },
           {
            model:'gpt-3.5-turbo',
            parameter:'top_p',
            value:1,
            description:'温度采样的替代方案，称为核采样，其中模型考虑具有top_p概率质量的令牌的结果。因此，0.1意味着仅考虑包含前10%概率质量的令牌,我们通常建议更改此值或 temperature ，但不要同时更改这两个值。',
            type:'float',
            range:'0,1'
          },
             {
            model:'gpt-3.5-turbo',
            parameter:'stream',
            value:false,
            description:'如果设置，将发送部分消息增量，就像在ChatGPT中一样。令牌可用时将作为仅数据服务器发送事件发送，流由 data: [DONE] 消息终止,如果未设置，则将在完成时发送完整消息。总结就是设置true开启流式输出。',
            type:'bool',
            range:'true,false'
          },
              {
            model:'gpt-3.5-turbo',
            parameter:'max_tokens',
            value:4000,
            description:'输入标记和生成标记的总长度受模型上下文长度的限制。最大长度4096,实际测试最多4000。',
            type:'int',
            range:'1,4000'
          },
              {
            model:'gpt-3.5-turbo',
            parameter:'presence_penalty',
            value:0,
            description:'介于-2.0和2.0之间的数字。正值会根据新标记到目前为止是否出现在文本中来惩罚它们，从而增加模型谈论新主题的可能性。',
            type:'float',
            range:'-2,2'
          },
            {
            model:'gpt-3.5-turbo',
            parameter:'frequency_penalty',
            value:0,
            description:'介于-2.0和2.0之间的数字。正值会根据新标记在文本中的现有频率惩罚新标记，从而降低模型逐字重复同一行的可能性。',
            type:'float',
            range:'-2,2'
          },


           {
            model:'gpt-3.5-turbo-0301',
            parameter:'temperature',
            value:1,
            description:'使用什么样的采样温度，介于0和2之间。较高的值（如0.8）将使输出更随机，而较低的值（如0.2）将使其更集中和确定性。',
            type:'float',
            range:'0,2'
          },
           {
            model:'gpt-3.5-turbo-0301',
            parameter:'top_p',
            value:1,
            description:'温度采样的替代方案，称为核采样，其中模型考虑具有top_p概率质量的令牌的结果。因此，0.1意味着仅考虑包含前10%概率质量的令牌,我们通常建议更改此值或 temperature ，但不要同时更改这两个值。',
            type:'float',
            range:'0,1'
          },
             {
            model:'gpt-3.5-turbo-0301',
            parameter:'stream',
            value:false,
            description:'如果设置，将发送部分消息增量，就像在ChatGPT中一样。令牌可用时将作为仅数据服务器发送事件发送，流由 data: [DONE] 消息终止,如果未设置，则将在完成时发送完整消息。总结就是设置true开启流式输出。',
            type:'bool',
            range:'true,false'
          },
              {
            model:'gpt-3.5-turbo-0301',
            parameter:'max_tokens',
            value:4000,
            description:'输入标记和生成标记的总长度受模型上下文长度的限制。最大长度4096,实际测试最多4000。',
            type:'int',
            range:'1,4000'
          },
              {
           model:'gpt-3.5-turbo-0301',
            parameter:'presence_penalty',
            value:0,
            description:'介于-2.0和2.0之间的数字。正值会根据新标记到目前为止是否出现在文本中来惩罚它们，从而增加模型谈论新主题的可能性。',
            type:'float',
            range:'-2,2'
          },
            {
            model:'gpt-3.5-turbo-0301',
            parameter:'frequency_penalty',
            value:0,
            description:'介于-2.0和2.0之间的数字。正值会根据新标记在文本中的现有频率惩罚新标记，从而降低模型逐字重复同一行的可能性。',
            type:'float',
            range:'-2,2'
          },


             {
            model:'text-davinci-003',
            parameter:'temperature',
            value:1,
            description:'使用什么样的采样温度，介于0和2之间。较高的值（如0.8）将使输出更随机，而较低的值（如0.2）将使其更集中和确定性。',
            type:'float',
            range:'0,2'
          },
           {
            model:'text-davinci-003',
            parameter:'top_p',
            value:1,
            description:'温度采样的替代方案，称为核采样，其中模型考虑具有top_p概率质量的令牌的结果。因此，0.1意味着仅考虑包含前10%概率质量的令牌,我们通常建议更改此值或 temperature ，但不要同时更改这两个值。',
            type:'float',
            range:'0,1'
          },
             {
            model:'text-davinci-003',
            parameter:'stream',
            value:false,
            description:'如果设置，将发送部分消息增量，就像在ChatGPT中一样。令牌可用时将作为仅数据服务器发送事件发送，流由 data: [DONE] 消息终止,如果未设置，则将在完成时发送完整消息。总结就是设置true开启流式输出。',
            type:'bool',
            range:'true,false'
          },
              {
            model:'text-davinci-003',
            parameter:'max_tokens',
            value:4000,
            description:'输入标记和生成标记的总长度受模型上下文长度的限制。最大长度4097,实际测试最多4000。',
            type:'int',
            range:'1,4000'
          },
              {
           model:'text-davinci-003',
            parameter:'presence_penalty',
            value:0,
            description:'介于-2.0和2.0之间的数字。正值会根据新标记到目前为止是否出现在文本中来惩罚它们，从而增加模型谈论新主题的可能性。',
            type:'float',
            range:'-2,2'
          },
            {
            model:'text-davinci-003',
            parameter:'frequency_penalty',
            value:0,
            description:'介于-2.0和2.0之间的数字。正值会根据新标记在文本中的现有频率惩罚新标记，从而降低模型逐字重复同一行的可能性。',
            type:'float',
            range:'-2,2'
          },


        ],
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
        rules:{

        },
        keyOptions:[],
        enableEdit:false
      };
    },
    methods:{
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
  this.dialogVisible=true
},
handleClose(){
  this.dialogVisible=false
},
submitChatSetting(){
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
},
enableSetting(){
this.enableEdit=true
},
saveSetting(){

this.enableEdit=false
},
// 获取聊天配置参数
getChatParam(){
  this.$http.getChatParam().then(res=>{
    if(res.errorCode=='0000'){
      let {channel,url,key,model,enablecontext,proxytype,proxyurl}=res.data
      console.log(res)
       this.chatsettingForm={
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
}
    },
    created(){
      this.getChatParam()
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
.el-dialog__footer {
  text-align: center;
}
</style>

