<template>
  <div class="app-box">
    <div class="main">
      <div class="left-box">
        <div class="header">
          <span>官方密钥</span>
        <el-button type="text" 
        v-if="!isEditOffical"
        style="float: right;line-height:22px;color:#ba94bf;margin-right:20px;margin-top:10px;" @click="openOfficalSetting"
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
                      <el-option :label="`${item.label} (${item.usedcount}/${item.sharecount})`"
                       :value="item.key" :disabled="item.disabled" v-for="(item,index) in key3Options" :key="index">
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
                      >
                        <el-option :label="`${item.label} (${item.usedcount}/${item.sharecount})`" 
                        :value="item.key" :disabled="item.disabled" v-for="(item,index) in key4Options" :key="index">
                       </el-option>
                      </el-select>
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
           style="float: right;line-height:22px;color:#ba94bf;margin-right:20px;margin-top:10px;" @click="openUnOfficalSetting"
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
                      >
                      <el-option :label="`${item.label} (${item.usedcount}/${item.sharecount})`"
                       :value="item.token" :disabled="item.disabled" v-for="(item,index) in accesstoken3Options" :key="index">
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
                        v-model="unofficalkeyForm.accesstoken4"
                        placeholder="请选择或创建accesstoken"
                        style="width: 100%"
                      >
                      <el-option :label="`${item.label} (${item.usedcount}/${item.sharecount})`"
                       :value="item.token" :disabled="item.disabled" v-for="(item,index) in accesstoken4Options" :key="index">
                       </el-option>
                      </el-select>
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
                        @change="selectBingToken"
                      >
                     <el-option :label="`${item.label} (${item.usedcount}/${item.sharecount})`"
                       :value="item.token" :disabled="item.disabled" v-for="(item,index) in bingtokenOptions" :key="index">
                       </el-option>
                      </el-select>
                    </div>
                  </div>
                </el-form-item>
              </div>
               <div class="form-body" style="padding-top:0px;">
                <el-form-item>
                  <div class="form-item">
                    <span slot="label">cookie</span>
                    <div>
                    <el-input :disabled="!isEditUnOffical||unofficalkeyForm.newbingtoken==''"
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

              <div class="block">
              <div class="title">
                <span>bard</span>
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
                        v-model="unofficalkeyForm.bardtoken"
                        placeholder="请选择或输入token"
                        style="width: 100%"
                      >
                     <el-option :label="`${item.label} (${item.usedcount}/${item.sharecount})`"
                       :value="item.token" :disabled="item.disabled" v-for="(item,index) in bardtokenOptions" :key="index">
                       </el-option>
                      </el-select>
                    </div>
                  </div>
                </el-form-item>
              </div>
            </div>

               <div class="block">
              <div class="title">
                <span>claude</span>
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
                        v-model="unofficalkeyForm.claudetoken"
                        placeholder="请选择或输入token"
                        style="width: 100%"
                        @change="selectClaudeToken"
                      >
                     <el-option :label="`${item.label} (${item.usedcount}/${item.sharecount})`"
                       :value="item.token" :disabled="item.disabled" v-for="(item,index) in claudetokenOptions" :key="index">
                       </el-option>
                      </el-select>
                    </div>
                  </div>
                </el-form-item>
              </div>
               <div class="form-body" style="padding-top:0px;">
                <el-form-item>
                  <div class="form-item">
                    <span slot="label">appid</span>
                    <div>
                    <el-input :disabled="!isEditUnOffical||unofficalkeyForm.claudetoken==''"
                      type="textarea"
                      :rows="1"
                      placeholder="请输入appid"
                      v-model="unofficalkeyForm.claudeappid">
                      </el-input>
                    </div>
                  </div>
                </el-form-item>
              </div>
            </div>
            
                 <div class="block">
              <div class="title">
                <span>hugging</span>
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
                        v-model="unofficalkeyForm.huggingtoken"
                        placeholder="请选择或输入token"
                        style="width: 100%"
                      >
                     <el-option :label="`${item.label} (${item.usedcount}/${item.sharecount})`"
                       :value="item.token" :disabled="item.disabled" v-for="(item,index) in huggingtokenOptions" :key="index">
                       </el-option>
                      </el-select>
                    </div>
                  </div>
                </el-form-item>
              </div>
            </div>

              <div class="block">
              <div class="title">
                <span>xfyun</span>
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
                        v-model="unofficalkeyForm.xfyuntoken"
                        placeholder="请选择或输入token"
                        style="width: 100%"
                      >
                     <el-option :label="`${item.label} (${item.usedcount}/${item.sharecount})`"
                       :value="item.token" :disabled="item.disabled" v-for="(item,index) in xfyuntokenOptions" :key="index">
                       </el-option>
                      </el-select>
                    </div>
                  </div>
                </el-form-item>
              </div>
            </div>

                 <div class="block">
              <div class="title">
                <span>poe</span>
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
                        v-model="unofficalkeyForm.poetoken"
                        placeholder="请选择或输入token"
                        style="width: 100%"
                      >
                     <el-option :label="`${item.label} (${item.usedcount}/${item.sharecount})`"
                       :value="item.token" :disabled="item.disabled" v-for="(item,index) in poetokenOptions" :key="index">
                       </el-option>
                      </el-select>
                    </div>
                  </div>
                </el-form-item>
              </div>
            </div>
           
              <div class="block">
              <div class="title">
                <span>chatglm</span>
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
                        v-model="unofficalkeyForm.chatglmtoken"
                        placeholder="请选择或输入token"
                        style="width: 100%"
                        @change="selectGlmToken"
                      >
                     <el-option :label="`${item.label} (${item.usedcount}/${item.sharecount})`"
                       :value="item.token" :disabled="item.disabled" v-for="(item,index) in chatglmtokenOptions" :key="index">
                       </el-option>
                      </el-select>
                    </div>
                  </div>
                </el-form-item>
              </div>
               <div class="form-body" style="padding-top:0px;">
                <el-form-item>
                  <div class="form-item">
                    <span slot="label">cookie</span>
                    <div>
                    <el-input :disabled="!isEditUnOffical||unofficalkeyForm.chatglmtoken==''"
                      type="textarea"
                      :rows="3"
                      placeholder="请输入cookie"
                      v-model="unofficalkeyForm.chatglmcookie">
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
        chatglmtoken: [],
        chatglmcookie: "",
        bardtoken:[],
        claudetoken:[],
        claudeappid:"",
        huggingtoken:[],
        xfyuntoken:[],
        poetoken:[],
      },
      isEditOffical:false,
      isEditUnOffical:false,
      key3Options:[],
      key4Options:[],
      accesstoken3Options:[],
      accesstoken4Options:[],
      bingtokenOptions:[],
      bardtokenOptions:[],
      claudetokenOptions:[],
      huggingtokenOptions:[],
      xfyuntokenOptions:[],
      poetokenOptions:[],
      chatglmtokenOptions:[],
    };
  },
  methods:{
    openOfficalSetting(){
        this.isEditOffical=true
        this.initofficalkeylist()
    },
    openUnOfficalSetting(){
        this.isEditUnOffical=true
        this.initunofficaltokenlist()
    },
    submitUnofficalForm(){
       const data={
          accesstoken3:this.unofficalkeyForm.accesstoken3.length>0?this.unofficalkeyForm.accesstoken3[0]:'',
          accesstoken4:this.unofficalkeyForm.accesstoken4.length>0?this.unofficalkeyForm.accesstoken4[0]:'',
          newbingKey:{
            newbingtoken:this.unofficalkeyForm.newbingtoken.length>0?this.unofficalkeyForm.newbingtoken[0]:'',
            newbingcookie:this.unofficalkeyForm.newbingcookie?this.unofficalkeyForm.newbingcookie:''
          },
           chatglmKey:{
            chatglmtoken:this.unofficalkeyForm.chatglmtoken.length>0?this.unofficalkeyForm.chatglmtoken[0]:'',
            chatglmcookie:this.unofficalkeyForm.chatglmcookie?this.unofficalkeyForm.chatglmcookie:''
          },
          bardtoken:this.unofficalkeyForm.bardtoken.length>0?this.unofficalkeyForm.bardtoken[0]:'',
          claudeKey:{
            token:this.unofficalkeyForm.claudetoken.length>0?this.unofficalkeyForm.claudetoken[0]:'',
            appid:this.unofficalkeyForm.claudeappid?this.unofficalkeyForm.claudeappid:''
          },
          huggingtoken:this.unofficalkeyForm.huggingtoken.length>0?this.unofficalkeyForm.huggingtoken[0]:'',
          xfyuntoken:this.unofficalkeyForm.xfyuntoken.length>0?this.unofficalkeyForm.xfyuntoken[0]:'',
          poetoken:this.unofficalkeyForm.poetoken.length>0?this.unofficalkeyForm.poetoken[0]:'',
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
        }).finally(()=>{
          this.initunofficaltokenlist()
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
        }).finally(()=>{
            this.initofficalkeylist()
        })
    },
    cancelOfficalEdit(){
        this.isEditOffical=false
        this.officalkeyForm={
        chatgpt3Key: [],
        chatgpt4Key: [],
      }
      this.getOfficalKeys()
    },
    cancelUnOfficalEdit(){
        this.isEditUnOffical=false
        this.unofficalkeyForm={
        accesstoken3: [],
        accesstoken4: [],
        newbingtoken: [],
        newbingcookie: "",
        chatglmtoken: [],
        chatglmcookie: "",
        bardtoken:[],
        claudetoken:[],
        claudeappid:"",
        huggingtoken:[],
        xfyuntoken:[],
        poetoken:[],
      }
      this.getUnOfficalKeys()
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
          this.key3Options.forEach(item=>{
            if(item.key==this.officalkeyForm.chatgpt3Key[0]){
              item.disabled=false
            }
          })
          console.log(this.key4Options)
          this.key4Options.forEach(item=>{
            if(item.key==this.officalkeyForm.chatgpt4Key[0]){
              item.disabled=false
            }
          })
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
          this.unofficalkeyForm.chatglmtoken=(res.data.chatglmKey&&res.data.chatglmKey.chatglmtoken)?[res.data.chatglmKey.chatglmtoken]:[]
          this.unofficalkeyForm.chatglmcookie=(res.data.chatglmKey&&res.data.chatglmKey.chatglmcookie)?res.data.chatglmKey.chatglmcookie:''
          this.unofficalkeyForm.bardtoken=res.data.bardtoken?[res.data.bardtoken]:[]
          this.unofficalkeyForm.claudetoken=(res.data.claudeKey&&res.data.claudeKey.token)?[res.data.claudeKey.token]:[]
          this.unofficalkeyForm.claudeappid=(res.data.claudeKey&&res.data.claudeKey.appid)?res.data.claudeKey.appid:''
          this.unofficalkeyForm.huggingtoken=res.data.huggingtoken?[res.data.huggingtoken]:[]
          this.unofficalkeyForm.xfyuntoken=res.data.xfyuntoken?[res.data.xfyuntoken]:[]
          this.unofficalkeyForm.poetoken=res.data.poetoken?[res.data.poetoken]:[]
          if(res.data._id){
            this.unofficalkeyForm._id=res.data._id
          }
          this.accesstoken3Options.forEach(item=>{
            if(item.token==this.unofficalkeyForm.accesstoken3[0]){
              item.disabled=false
            }
          })
          this.accesstoken4Options.forEach(item=>{
            if(item.token==this.unofficalkeyForm.accesstoken4[0]){
              item.disabled=false
            }
          })
          this.bingtokenOptions.forEach(item=>{
            if(item.token==this.unofficalkeyForm.newbingtoken[0]){
              item.disabled=false
            }
          })
          this.bardtokenOptions.forEach(item=>{
            if(item.token==this.unofficalkeyForm.bardtoken[0]){
              item.disabled=false
            }
          })
          this.claudetokenOptions.forEach(item=>{
            if(item.token==this.unofficalkeyForm.claudetoken[0]){
              item.disabled=false
            }
          })
          this.huggingtokenOptions.forEach(item=>{
            if(item.token==this.unofficalkeyForm.huggingtoken[0]){
              item.disabled=false
            }
          })
          this.xfyuntokenOptions.forEach(item=>{
            if(item.token==this.unofficalkeyForm.xfyuntoken[0]){
              item.disabled=false
            }
          })
          this.poetokenOptions.forEach(item=>{
            if(item.token==this.unofficalkeyForm.poetoken[0]){
              item.disabled=false
            }
          })
           this.chatglmtokenOptions.forEach(item=>{
            if(item.token==this.unofficalkeyForm.chatglmtoken[0]){
              item.disabled=false
            }
          })
       }else{
          this.$message.warning(res.message)
        }
      })
    },
    // 获取key下拉列表
  async getOfficalKeyList(type){
      const query={
        type
      }
     let res=await this.$http.getOfficalKeyList(query)
             if(res.errorCode=='0000'){
          if(type=='key3.0'){
             this.key3Options=res.data
           let res1=await this.$http.getOfficalKeyList({type:'免费key'})
            if(res1.errorCode=='0000'){
                this.key3Options=this.key3Options.concat(res1.data)
                console.log('111',this.key3Options)
              }
          }
          if(type=='key4.0'){
            this.key4Options=JSON.parse(JSON.stringify(res.data)) 
          }
        }else{
          this.$message.warning(res.message)
        }
    },
    // 初始化key下拉列表
  async initofficalkeylist(){
         await this.getOfficalKeyList('key3.0')
         await this.getOfficalKeyList('key4.0')
         this.getOfficalKeys()
    },
    // chatgpt非官方token下拉列表
    async getUnofficaltokenList(type){
      const query={
        type
      }
      let res=await this.$http.getUnofficaltokenList(query)
      if(res.errorCode=='0000'){
        if(type=='免费账号'){
          this.accesstoken3Options=res.data
        }
        if(type=='升级账号'){
          this.accesstoken4Options=res.data
        }
      }
    },
    // 获取bing token下拉列表
    async getBingTokenList(){
      let res=await this.$http.getBingTokenList()
      if(res.errorCode=='0000'){
        this.bingtokenOptions=res.data
      }
    },
        // 获取claude token下拉列表
    async getClaudeTokenList(){
      let res=await this.$http.getClaudeTokenList()
      if(res.errorCode=='0000'){
        this.claudetokenOptions=res.data
      }
    },
    // 获取bard token下拉列表
    async getBardTokenList(){
      let res=await this.$http.getBardTokenList()
      if(res.errorCode=='0000'){
        this.bardtokenOptions=res.data
      }
    },
    // 获取hugging token下拉列表
    async getHuggingTokenList(){
      let res=await this.$http.getHuggingTokenList()
      if(res.errorCode=='0000'){
        this.huggingtokenOptions=res.data
      }
    },
    // 获取讯飞token下拉列表
        async getXfyunTokenList(){
      let res=await this.$http.getXfyunTokenList()
      if(res.errorCode=='0000'){
        this.xfyuntokenOptions=res.data
      }
    },
        // 获取poe token下拉列表
        async getPoeTokenList(){
      let res=await this.$http.getPoeTokenList()
      if(res.errorCode=='0000'){
        this.poetokenOptions=res.data
      }
    },
    // 获取chatglm token下拉列表
        async getChatGlmTokenList(){
      let res=await this.$http.getChatGlmTokenList()
      if(res.errorCode=='0000'){
        this.chatglmtokenOptions=res.data
      }
    },
    // 初始化chatgpt非官方token下拉列表
    async initunofficaltokenlist(){
      await this.getUnofficaltokenList('免费账号')
      await this.getUnofficaltokenList('升级账号')
      await this.getBingTokenList()
      await this.getBardTokenList()
      await this.getClaudeTokenList()
      await this.getHuggingTokenList()
      await this.getXfyunTokenList()
      await this.getPoeTokenList()
      await this.getChatGlmTokenList()
      this.getUnOfficalKeys()  
    },
    // 选择bingtoken事件
    selectBingToken(val){
      this.unofficalkeyForm.newbingcookie=''
      let result=this.bingtokenOptions.find(item=>item.token==val)
      if(result){
        this.unofficalkeyForm.newbingcookie=result.cookie
      }
    },
        selectGlmToken(val){
      this.unofficalkeyForm.chatglmcookie=''
      let result=this.chatglmtokenOptions.find(item=>item.token==val)
      if(result){
        this.unofficalkeyForm.chatglmcookie=result.cookie
      }
    },
    // 选择claudetoken事件
    selectClaudeToken(val){
      this.unofficalkeyForm.claudeappid=''
      let result=this.claudetokenOptions.find(item=>item.token==val)
      if(result){
        this.unofficalkeyForm.claudeappid=result.appid
      }
    },
  },
  created(){
    this.initofficalkeylist()
    this.initunofficaltokenlist()
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
      border-radius: 10px;
      .header {
        height: 45px;
        line-height: 45px;
        background: #1b0055;
        padding: 0 20px;
        padding-right: 0px;
        font-size: 16px;
        color: #ffffff;;
        opacity: 0.9;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }
      .body {
        padding: 20px;
        height: calc(100vh - 260px);
        overflow-y: auto;
        .block {
          border: 1px solid #e4e7ed;
          margin-bottom: 20px;
          border-radius: 10px;
          .title {
            font-size: 14px;
            background: #7e55d7;
            height: 35px;
            line-height: 35px;
            padding-left: 10px;
            color: #ffffff;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
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
      border-radius: 10px;
      .header {
        height: 45px;
        line-height: 45px;
        background: #1b0055;
        padding: 0 20px;
     padding-right: 0px;
        font-size: 16px;
        color: #ffffff;
        opacity: 0.9;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }
      .body {
        padding: 20px;
        height: calc(100vh - 260px);
        overflow-y: auto;
        .block {
          border: 1px solid #e4e7ed;
          margin-bottom: 20px;
          border-radius: 10px;
          .title {
            font-size: 14px;
            background: #7e55d7;
            height: 35px;
            line-height: 35px;
            padding-left: 10px;
            color: #ffffff;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
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