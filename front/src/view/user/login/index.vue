<template>
  <div class="k-pk44lv" :style="{paddingTop:isRegister?'160px':'200px'}">
     <transition name="el-fade-in-linear">
    <div class="k-dt8vs8" v-if="!isRegister">
      <el-form ref="loginform" :model="loginForm" label-width="80px" :rules="loginRules">
        <el-form-item label-width="0" prop="username">
          <el-input class="login-input"
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prop="username"
            size="large"
            autocomplete="new-password"
          >
            <i slot="prefix">账号</i
          ></el-input>
        </el-form-item>
        <el-form-item label-width="0" prop="password">
          <el-input class="login-input"
            v-model="loginForm.password"
            type="password"
            size="large"
            prop="password"
            placeholder="密码"
            autocomplete="new-password"
          >
            <i slot="prefix">密码</i
          ></el-input>
        </el-form-item>
        <div class="remeber">
          <el-checkbox v-model="remember" class="remeber-checkbox">记住密码</el-checkbox>
        </div>
        <div class="k-dt8vs8-login" label-width="0">
          <el-button class="login-btn"
            size="large"
            type="primary"
            style="width: 100%"
            @click.native.prevent="login"
            >登 录</el-button
          >
        </div>
        <div class="register-box">创建一个账号？<span @click="openRegister">立即注册</span></div>
      </el-form>
    </div>
     </transition>
      <transition name="el-fade-in-linear">
        <div class="k-dt8vs8" v-if="isRegister">
      <el-form ref="registerform" :model="registerForm" label-width="80px" :rules="registerRules">
        <el-form-item label-width="0" prop="username">
          <el-input class="login-input" @blur="checkUsername"
            v-model="registerForm.username"
            placeholder="请输入用户名"
            prop="username"
            size="large"
          >
            <i slot="prefix">用户名</i
          >
          <span slot="suffix" class="el-icon-loading" v-if="isLoading"></span>
          </el-input>
        </el-form-item>
                <el-form-item label-width="0" prop="email">
          <el-input class="login-input"
            v-model="registerForm.email"
            placeholder="请输入邮箱"
            prop="email"
            size="large"
          >
            <i slot="prefix">邮箱</i>
            </el-input>
        </el-form-item>
           <el-form-item label-width="0" prop="code">
            <el-input class="login-input"
            v-model="registerForm.code"
            placeholder="请输入验证码"
            prop="code"
            size="large"
          >
            <i slot="prefix">验证码</i>
            <el-button slot="suffix" class="code-btn" v-if="!isSend" @click="sendEmailCode">点击发送</el-button>
          <timer-countdown slot="suffix" v-if="isSend&&isRegister"
          :deadline="deadline" :ignore-day="true"
          @done="isSend=false"  
          > 
           <template slot-scope="scope">{{scope.second}}s 后可重新发送</template>
          </timer-countdown>
            </el-input>
        </el-form-item>
        <el-form-item label-width="0" prop="password">
          <el-input class="login-input"
            v-model="registerForm.password"
            type="password"
            size="large"
            prop="password"
            placeholder="密码"
          >
            <i slot="prefix">密码</i
          ></el-input>
        </el-form-item>
              <el-form-item label-width="0" prop="confirmPassword">
          <el-input class="login-input"
            v-model="registerForm.confirmPassword"
            type="password"
            size="large"
            prop="confirmPassword"
            placeholder="确认密码"
          >
            <i slot="prefix">确认密码</i
          ></el-input>
        </el-form-item>
        <div class="k-dt8vs8-login" label-width="0" style="margin-top:30px;">
          <el-button class="login-btn"
            size="large"
            type="primary"
            style="width: 100%"
            @click.native.prevent="handleRegister"
            >注 册</el-button
          >
        </div>
        <div class="register-box">返回登录页？<span @click="openLogin">立即返回</span></div>
      </el-form>
    </div>
      </transition>
  </div>
</template>
<script>
import Vue from "vue";
import { Button, Form, Input, FormItem, Checkbox } from "element-ui";
import { mapMutations,mapActions } from "vuex";
import vueTimerCountdown from 'vue-timer-countdown'
Vue.use(Button);
Vue.use(Form);
Vue.use(Input);
Vue.use(FormItem);
Vue.use(Checkbox);
import Cookie from "js-cookie";
export default {
  components: {
    // 局部注册
    TimerCountdown: vueTimerCountdown
  },
  data() {
    const validatepwd = (rule, value, callback) => {
     if(value==this.registerForm.password){
      callback()
     }else{
      callback(new Error('两次密码不一致!'))
     }
};
    return {
      remember: true,
      loginForm: {
        username: "",
        password: "",
      },
      isRegister:false,
      registerForm:{
        username:'',
        email:'',
        code:'',
        password:'',
        confirmPassword:''
      },
      isSend:false,
      deadline:59*1,
      isLoading:false,
      loginRules:{
        username:[
          {required:true,message:'请输入用户名',trigger:'blur'}
        ],
        password:[
          {required:true,message:'请输入密码',trigger:'blur'}
        ]
      },
      registerRules:{
        username:[
          {required:true,message:'请输入用户名',trigger:'blur'}
        ],
        email:[
          {required:true,message:'请输入邮箱',trigger:'blur'},
          {type:'email',message:'请输入正确的邮箱',trigger:'blur'}
        ],
        code:[
          {required:true,message:'请输入6位数字',trigger:'blur'},
          {pattern:/^\d{6}$/,message:'请输入6位数字',trigger:'blur'}
        ],
        password:[
          {required:true,message:'请输入密码',trigger:'blur'}
        ],
        confirmPassword:[
          {required:true,message:'请输入确认密码',trigger:'blur'},
          {validator:validatepwd,trigger:'blur'}
        ]
      }
    };
  },
  methods: {
    // 判断用户名是否存在
    checkUsername(){
      if(!this.registerForm.username){
        return
      }
      this.isLoading=true
       this.$http.checkIsUser({username:this.registerForm.username}).then(res=>{
        if(res.errorCode=='0000'){
           this.isLoading=false
        }else{
          this.$message.warning({
            message:res.message,
            type:'warning',
            customClass:'message-warning'
          })
          this.isLoading=false
        }
       })
    },
    // 发送邮箱验证码
    sendEmailCode(){
      let reg=/^[\w-]+(.[\w-]+)*@([\w-]+.)+[a-zA-Z]{2,7}$/
      if(!this.registerForm.email){
        this.$message.warning({
          message:'请输入邮箱！',
          type:'warning',
          customClass:'message-warning'
        })
        return
      }
      if(!reg.test(this.registerForm.email)){
               this.$message.warning({
          message:'请输入正确的邮箱！',
          type:'warning',
          customClass:'message-warning'
        })
        return
      }
      this.$http.sendEmailCode({email:this.registerForm.email}).then(res=>{
        if(res.errorCode=='0000'){
          this.$message.success({
            message:'发送成功！',
            type:'success',
            customClass:'message-success'
          })
               this.isSend=true
        }else{
          this.$message.warning({
            message:res.message,
            type:'warning',
            customClass:'message-warning'
          })
        }
      })
    },
    // 打开登录页面
    openLogin(){
      this.isRegister = false
    },
    // 打开注册页面
    openRegister(){
      this.isRegister = true
    },
    // 处理注册
    handleRegister(){
      this.$refs.registerform.validate(valid=>{
        if(valid){
      const data={
        username:this.registerForm.username,
        userEmail:this.registerForm.email,
        code:this.registerForm.code,
        password:this.registerForm.password,
      }
      this.$http.register(data).then(res=>{
        if(res.errorCode=='0000'){
          this.$message.success({
            message:'注册成功！',
            type:'success',
            customClass:'message-success'
          })
          this.isRegister = false
        }else{
          this.$message.warning({
            message:res.message,
            type:'warning',
            customClass:'message-warning'
          })
        }
      })
        }
      })
    },
    ...mapMutations("permSign", ["setPermSign"]),
        ...mapActions("navMenu", ["addMenuList"]),
        // 处理登录
    async login() {
      this.$refs.loginform.validate(async (valid)=>{
        if(valid){
      const { errorCode, data } = await this.$http.login({
        ...this.loginForm,
        isShowToast: true,
      });
      if (errorCode === "0000") {
        //返回token与按钮权限permSign
        Cookie.set("token", data.token);
        Cookie.set(
          "user",
          `${this.loginForm.username},${this.loginForm.password}`
        );
        if (this.remember) {
          localStorage.setItem("user", JSON.stringify(this.loginForm));
        }
        this.setPermSign(data.permSign);
        await this.addMenuList(1)
        this.$router.push("/chat");
      }
        }
      })
    },
    reset() {
      this.loginForm = {
        username: "",
        password: "",
      };
    },
    getLocalUser() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;
      this.loginForm.username = user.username;
      this.loginForm.password = user.password;
    },
  },
  watch: {
    remember(val) {
      if (val) {
        return;
      }
      localStorage.clear();
    },
    isRegister(val){
      if(val){
        this.$refs.registerform.resetFields()
      }else{
        this.$refs.loginform.resetFields()
      }
    }
  },
  created() {
    this.getLocalUser();
    if(this.$route.query.type=='login') {
      this.isRegister=false
    }else{
      this.isRegister=true
    }
  },
};
</script>
<style src="./index.less" lang="less"></style>
<style scoped>
.login-input /deep/ .el-input__inner{
    color: #fff;
    font-weight: 100;
    margin: 3em 0 0;
    width: 100%;
    display: block;
    border: none;
    padding: 1em;
    border-bottom: solid 1px #fff;
    -webkit-transition: all 0.3s cubic-bezier(0.64, 0.09, 0.08, 1);
    transition: all 0.3s cubic-bezier(0.64, 0.09, 0.08, 1);
    background: -webkit-linear-gradient(top, rgba(255, 255, 255, 0) 96%, #fff 4%);
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 96%, #fff 4%);
    background-position: -800px 0;
    background-size: 100%;
    background-repeat: no-repeat;
    border-radius: 0px;
}
.login-input /deep/ .el-input__prefix{
  color: #ffffff;
  height: 30px;
}
.remeber-checkbox /deep/ .el-checkbox__inner{
  background: #6439af;
  border: solid 1px #6439af;
}
.remeber-checkbox /deep/ .el-checkbox__input.is-checked{
  background: #6439af;
  border: solid 1px #6439af;
}
.remeber-checkbox /deep/ .el-checkbox__label{
  color: #fff !important;
}
.register-box{
  display: flex;
  height: 35px;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
  color: #fff;
}
.register-box span{
  cursor: pointer;
}
.register-box span:hover{
  color:rgb(197, 135, 18)
}
.code-btn{
  border: none;
  background: #6439af;
  border-radius: 10px;
  padding: 10px 20px;
  color: #fff;
  opacity: 0.9;
}
</style>
<style>
.message-warning {
  background: #8961e1 !important;
  color: #fff;
  border: none;
}
.message-warning .el-message__content{
  color: #fff;
}
.message-success {
  background: #6661f5!important;
  color: #fff;
  border: none;
}
.message-success .el-message__content{
  color: #fff;
}
</style>
