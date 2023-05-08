<template>
  <div class="app-box">
    <div class="main">
      <div class="left-box">
        <div class="header">
          <span>官方密钥</span>
        <el-button type="text" 
        v-if="!isEditOffical"
        style="float: right;line-height:22px;" @click="openOfficalSetting"
          >配置</el-button>
        </div>
        <div class="body">
          <el-form ref="officalkeyForm" :model="officalkeyForm">
            <div class="block">
              <div class="title">
                <span>chatgpt3</span>
              </div>
              <div class="form-body">
                <el-form-item>
                  <div class="form-item">
                    <span slot="label">apikey</span>
                    <div>
                      <el-select :disabled="!isEditOffical"
                        popper-class="popper-class"
                        :popper-append-to-body="false"
                        :multiple-limit="1"
                        multiple
                        filterable
                        allow-create
                        clearable
                        default-first-option
                        v-model="officalkeyForm.chatgpt3Key"
                        placeholder="请选择或创建key"
                        style="width: 100%"
                      >
                      <el-option :label="`${item.label} (${item.usedcount}/${item.sharecount})`" :value="item.key" v-for="(item,index) in key3Options" :key="index">

                       </el-option>
                      </el-select>
                    </div>
                  </div>
                </el-form-item>
              </div>
            </div>
            <div class="block">
              <div class="title">
                <span>chatgpt4</span>
              </div>
              <div class="form-body">
                <el-form-item>
                  <div class="form-item">
                    <span slot="label">apikey</span>
                    <div>
                      <el-select :disabled="!isEditOffical"
                        popper-class="popper-class"
                        :popper-append-to-body="false"
                        :multiple-limit="1"
                        multiple
                        filterable
                        allow-create
                        clearable
                        default-first-option
                        v-model="officalkeyForm.chatgpt4Key"
                        placeholder="请选择或创建key"
                        style="width: 100%"
                      ></el-select>
                    </div>
                  </div>
                </el-form-item>
              </div>
            </div>
          </el-form>
              <div class="action-btn" v-if="isEditOffical">
                <el-button @click="cancelOfficalEdit">取 消</el-button>
            <el-button type="primary" @click="submitOfficalForm">提交</el-button>
        </div>
        </div>
      </div>
      <div class="right-box">
        <div class="header">
          <span>非官方密钥</span>
          <el-button type="text"
          v-if="!isEditUnOffical"
           style="float: right;line-height:22px;" @click="openUnOfficalSetting"
          >配置</el-button>
        </div>
        <div class="body">
          <el-form ref="unofficalkeyForm" :model="unofficalkeyForm">
            <div class="block">
              <div class="title">
                <span>chatgpt3</span>
              </div>
              <div class="form-body">
                <el-form-item>
                  <div class="form-item">
                    <span slot="label">accesstoken</span>
                    <div>
                      <el-select :disabled="!isEditUnOffical"
                        popper-class="popper-class"
                        :popper-append-to-body="false"
                        :multiple-limit="1"
                        multiple
                        filterable
                        allow-create
                        clearable
                        default-first-option
                        v-model="unofficalkeyForm.accesstoken3"
                        placeholder="请选择或创建accesstoken"
                        style="width: 100%"
                      ></el-select>
                    </div>
                  </div>
                </el-form-item>
              </div>
            </div>
            <div class="block">
              <div class="title">
                <span>chatgpt4</span>
              </div>
              <div class="form-body">
                <el-form-item>
                  <div class="form-item">
                    <span slot="label">apikey</span>
                    <div>
                      <el-select :disabled="!isEditUnOffical"
                        popper-class="popper-class"
                        :popper-append-to-body="false"
                        :multiple-limit="1"
                        multiple
                        filterable
                        allow-create
                        clearable
                        default-first-option
                        v-model="unofficalkeyForm.accesstoken4"
                        placeholder="请选择或创建accesstoken"
                        style="width: 100%"
                      ></el-select>
                    </div>
                  </div>
                </el-form-item>
              </div>
            </div>
                        <div class="block">
              <div class="title">
                <span>newbing</span>
              </div>
              <div class="form-body">
                <el-form-item>
                  <div class="form-item">
                    <span slot="label">token</span>
                    <div>
                      <el-select :disabled="!isEditUnOffical"
                        popper-class="popper-class"
                        :popper-append-to-body="false"
                        :multiple-limit="1"
                        multiple
                        filterable
                        allow-create
                        clearable
                        default-first-option
                        v-model="unofficalkeyForm.newbingtoken"
                        placeholder="请选择或输入token"
                        style="width: 100%"
                      ></el-select>
                    </div>
                  </div>
                </el-form-item>
              </div>
               <div class="form-body" style="padding-top:0px;">
                <el-form-item>
                  <div class="form-item">
                    <span slot="label">cookie</span>
                    <div>
                    <el-input :disabled="!isEditUnOffical"
                      type="textarea"
                      :rows="3"
                      placeholder="请输入cookie"
                      v-model="unofficalkeyForm.newbingcookie">
                      </el-input>
                    </div>
                  </div>
                </el-form-item>
              </div>
            </div>
          </el-form>
                  <div class="action-btn" v-if="isEditUnOffical">
             <el-button @click="cancelUnOfficalEdit">取 消</el-button>
            <el-button type="primary" @click="submitUnofficalForm">提 交</el-button>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      officalkeyForm: {
        chatgpt3Key: [],
        chatgpt4Key: [],
      },
      unofficalkeyForm: {
        accesstoken3: [],
        accesstoken4: [],
        newbingtoken: [],
        newbingcookie: "",
      },
      isEditOffical:false,
      isEditUnOffical:false,
      key3Options:[],
    };
  },
  methods:{
    openOfficalSetting(){
        this.isEditOffical=true
    },
    openUnOfficalSetting(){
        this.isEditUnOffical=true
    },
    submitUnofficalForm(){
       const data={
          accesstoken3:this.unofficalkeyForm.accesstoken3.length>0?this.unofficalkeyForm.accesstoken3[0]:'',
          accesstoken4:this.unofficalkeyForm.accesstoken4.length>0?this.unofficalkeyForm.accesstoken4[0]:'',
          newbingKey:{
            newbingtoken:this.unofficalkeyForm.newbingtoken.length>0?this.unofficalkeyForm.newbingtoken[0]:'',
            newbingcookie:this.unofficalkeyForm.newbingcookie?this.unofficalkeyForm.newbingcookie:''
          }
        }
        if(this.unofficalkeyForm._id){
          data._id=this.unofficalkeyForm._id
        }
        this.$http.postUnofficalKeys(data).then(res=>{
          if(res.errorCode=='0000'){
          this.$message.success('保存密钥成功！')
            this.isEditUnOffical=false
            this.getUnOfficalKeys()
          }else{
            this.$message.warning(res.message)
          }
        })

    },
    submitOfficalForm(){
        const data={
          chatgpt3Key:this.officalkeyForm.chatgpt3Key.length>0?this.officalkeyForm.chatgpt3Key[0]:'',
          chatgpt4Key:this.officalkeyForm.chatgpt4Key.length>0?this.officalkeyForm.chatgpt4Key[0]:'',
        }
        if(this.officalkeyForm._id){
          data._id=this.officalkeyForm._id
        }
        this.$http.postOfficalKeys(data).then(res=>{
          if(res.errorCode=='0000'){
          this.$message.success('保存密钥成功！')
            this.isEditOffical=false
            this.getOfficalKeys()
          }else{
            this.$message.warning(res.message)
          }
        })
    },
    cancelOfficalEdit(){
        this.isEditOffical=false
        this.officalkeyForm={
        chatgpt3Key: [],
        chatgpt4Key: [],
      }
    },
    cancelUnOfficalEdit(){
        this.isEditUnOffical=false
        this.unofficalkeyForm={
        accesstoken3: [],
        accesstoken4: [],
        newbingtoken: [],
        newbingcookie: "",
      }
    },
    getOfficalKeys(){
      this.$http.getOfficalKeys().then(res=>{
        if(res.errorCode=='0000'){
          if(!res.data||res.data.length==0){
            return
          }
          this.officalkeyForm.chatgpt3Key=res.data.chatgpt3Key?[res.data.chatgpt3Key]:[]
          this.officalkeyForm.chatgpt4Key=res.data.chatgpt4Key?[res.data.chatgpt4Key]:[]
          if(res.data._id){
            this.officalkeyForm._id=res.data._id
          }
        }else{
          this.$message.warning(res.message)
        }
      })
    },
    getUnOfficalKeys(){
      this.$http.getUnofficalKeys().then(res=>{
        if(res.errorCode=='0000'){
           if(!res.data||res.data.length==0){
            return
          }
          this.unofficalkeyForm.accesstoken3=res.data.accesstoken3?[res.data.accesstoken3]:[]
          this.unofficalkeyForm.accesstoken4=res.data.accesstoken4?[res.data.accesstoken4]:[]
          this.unofficalkeyForm.newbingtoken=(res.data.newbingKey&&res.data.newbingKey.newbingtoken)?[res.data.newbingKey.newbingtoken]:[]
          this.unofficalkeyForm.newbingcookie=(res.data.newbingKey&&res.data.newbingKey.newbingcookie)?res.data.newbingKey.newbingcookie:''
          if(res.data._id){
            this.unofficalkeyForm._id=res.data._id
          }
       }else{
          this.$message.warning(res.message)
        }
      })
    },
    // 获取key下拉列表
    getOfficalKeyList(type){
      const query={
        type
      }
      this.$http.getOfficalKeyList(query).then(res=>{
        if(res.errorCode=='0000'){
          this.key3Options=res.data
          if(type=='key3.0'){
            this.$http.getOfficalKeyList({type:'免费key'}).then(res=>{
              if(res.errorCode=='0000'){
                this.key3Options=this.key3Options.concat(res.data)
              }
            })
          }
        }else{
          this.$message.warning(res.message)
        }
      })
    }
  },
  created(){
    this.getOfficalKeys()
    this.getUnOfficalKeys()
    this.getOfficalKeyList('key3.0')
    
  }
};
</script>

<style lang="less" scoped>
.app-box {
  .main {
    display: flex;
    flex-wrap: nowrap;
    .left-box {
      flex: 1;
      margin-right: 10px;
      border: 1px solid #e4e7ed;
      .header {
        height: 45px;
        line-height: 45px;
        background: #eaeaf4;
        padding: 0 20px;
        padding-right: 0px;
        font-size: 16px;
        color: #303133;
        opacity: 0.9;
      }
      .body {
        padding: 20px;
        height: calc(100vh - 280px);
        overflow-y: auto;
        .block {
          border: 1px solid #e4e7ed;
          margin-bottom: 20px;
          .title {
            font-size: 14px;
            background: #ececf5;
            height: 35px;
            line-height: 35px;
            padding-left: 10px;
          }
          .form-body {
            padding: 5px 20px;
            .form-item {
              display: flex;
              flex-direction: column;
            }
          }
        }
        .action-btn{
            display: flex;
            justify-content: center;
            align-items: center;
        }
      }
    }

    .right-box {
      flex: 1;
      margin-left: 10px;
      border: 1px solid #e4e7ed;
      .header {
        height: 45px;
        line-height: 45px;
        background: #eaeaf4;
        padding: 0 20px;
     padding-right: 0px;
        font-size: 16px;
        color: #303133;
        opacity: 0.9;
      }
      .body {
        padding: 20px;
        height: calc(100vh - 280px);
        overflow-y: auto;
        .block {
          border: 1px solid #e4e7ed;
          margin-bottom: 20px;
          .title {
            font-size: 14px;
            background: #ececf5;
            height: 35px;
            line-height: 35px;
            padding-left: 10px;
          }
          .form-body {
            padding: 5px 20px;
            .form-item {
              display: flex;
              flex-direction: column;
            }
          }
        }
         .action-btn{
            display: flex;
            justify-content: center;
            align-items: center;
        }
      }
    }
  }
}
</style>
<style scoped>
/deep/ .el-form-item{
    margin-bottom: 10px !important;
}
</style>