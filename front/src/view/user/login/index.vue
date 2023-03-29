<template>
  <div class="k-pk44lv">
    <div class="k-dt8vs8">
      <p class="k-dt8vs8-til">后台权限管理</p>
      <el-form ref="form" :model="loginForm" label-width="80px">
        <el-form-item label-width="0">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            prop="username"
            size="large"
            autocomplete="new-password"
          >
            <i slot="prefix" class="el-input__icon el-icon-user"></i
          ></el-input>
        </el-form-item>
        <el-form-item label-width="0">
          <el-input
            v-model="loginForm.password"
            type="password"
            size="large"
            prop="password"
            placeholder="密码"
            autocomplete="new-password"
          >
            <i slot="prefix" class="el-input__icon el-icon-lock"></i
          ></el-input>
        </el-form-item>
        <div class="remeber">
          <el-checkbox v-model="remember">记住密码</el-checkbox>
        </div>
        <div class="k-dt8vs8-login" label-width="0">
          <el-button size="large" style="width: 45%" @click="reset"
            >重 置</el-button
          >
          <el-button
            size="large"
            type="primary"
            style="width: 45%"
            @click.native.prevent="login"
            >登 录</el-button
          >
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Button, Form, Input, FormItem, Checkbox } from "element-ui";
import { mapMutations,mapActions } from "vuex";
Vue.use(Button);
Vue.use(Form);
Vue.use(Input);
Vue.use(FormItem);
Vue.use(Checkbox);
import Cookie from "js-cookie";
export default {
  data() {
    return {
      remember: true,
      loginForm: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    ...mapMutations("permSign", ["setPermSign"]),
        ...mapActions("navMenu", ["addMenuList"]),
    async login() {
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
        this.$router.push("/");
        location.reload()
      }
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
  },
  created() {
    this.getLocalUser();
  },
};
</script>
<style src="./index.less" lang="less"></style>
