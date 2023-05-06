<template>
    <div class="app">
        <div class="main-box">
      <el-tabs  class="tab-box" @tab-click="changeTab">
                      <el-tab-pane  class="token-list">
              <span slot="label"><i class="fa fa-list-alt" style="margin-right:5px;"></i>token管理</span>
                  <token-list></token-list>
                   </el-tab-pane>
                   <el-tab-pane  class="key-list">
              <span slot="label"><i class="fa fa-database" style="margin-right:5px;"></i>key管理</span>
              <key-list></key-list>
                   </el-tab-pane>
      </el-tabs>
        </div>
    </div>
</template>

<script>
import keyList from '../components/keyList.vue'
import tokenList from '../components/tokenList.vue' 
export default {
    components:{
      keyList,tokenList
    },
    data() {
        return {
            
        };
    },
    methods:{
        changeTab(){

        },
    }
}
</script>

<style lang="less" scoped>
.app {
  .main-box {
    height: calc(100vh - 135px);
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
        .key-list {

        }

      .token-list{

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
</style>
