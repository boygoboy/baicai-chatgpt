<template>
  <div>
    <div class="k-j2nnc8">
      <div class="k-j2nnc8-cos" @click="setCollapse(!collapse)">
        <i :class="collapse?'el-icon-s-unfold':'el-icon-s-fold'"></i>
      </div>
      <div class="action-box">
      <div class="k-j2nnc8-loginout" @click="loginOut" style="margin-right:20px;cursor:pointer;">退出</div>
      <div class="k-j2nnc8-loginout" @click="openChat" style="cursor:pointer;">聊天</div>
      </div>
    </div>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import { MessageBox } from "element-ui";
import { mapMutations, mapState } from "vuex";
export default {
  computed: {
    ...mapState("navMenu", ["collapse"]),
  },
  methods: {
    ...mapMutations("navMenu", ["setCollapse"]),

     loginOut() {
        MessageBox.confirm("此操作将退出系统, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(()=>{
        Cookies.remove("token");
        sessionStorage.clear();
        this.$router.push("/chat");
        this.$store.state.navMenu.navTre=''
        this.$store.state.tabs.bars= {
            tabsValue: "0",
            id:0,
            tabsList: [
            ]
        }
        this.$router.push({path:'/chat'})
        })
    },
    openChat(){
     this.$router.push({
      path:'/chat'
     })
    },
  },
};
</script>
<style src="./index.less" lang="less"></style>
<style scoped lang="less">
.action-box{
  display: flex;
  padding-right: 20px;
}
</style>
