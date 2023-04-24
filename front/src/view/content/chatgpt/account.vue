<template>
  <div>
    <el-card class="box-card">
  <div slot="header">
   <el-form :inline="true" :model="searchForm" class="inline-form">
     <el-form-item label="类型：">
     <el-select v-model="searchForm.accounttype" placeholder="请选择账号类型" clearable>
      <el-option label="免费账号" value="免费账号"></el-option>
      <el-option label="chatgpt-plus" value="chatgpt-plus"></el-option>
      <el-option label="升级账号" value="升级账号"></el-option>
      <el-option label="bing账号" value="bing账号"></el-option>
     </el-select>
  </el-form-item>
  <el-form-item label="邮箱：">
    <el-input v-model="searchForm.accountemail" placeholder="请输入账号邮箱"></el-input>
  </el-form-item>
    <el-form-item label="accesstoken：">
    <el-input v-model="searchForm.accesstoken" placeholder="请输入accesstoken"></el-input>
  </el-form-item>
     <el-form-item label="api密钥：">
    <el-input v-model="searchForm.apikey" placeholder="请输入api密钥"></el-input>
  </el-form-item>
    <el-form-item label="账号状态：">
        <el-select v-model="searchForm.accountstatus" placeholder="请选择状态" clearable>
          <el-option label="启用" value="启用"></el-option>
      <el-option label="禁用" value="禁用"></el-option>
      <el-option label="警告" value="警告"></el-option>
      <el-option label="失效" value="失效"></el-option>
     </el-select>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="search">查询</el-button>
    <el-button  @click="reset">重置</el-button>
  </el-form-item>
</el-form>
  </div>
  <div class="action-btn">
    <el-button type="primary" size="small" @click="addAccount">新建</el-button>
  </div>
  <div class="table-box">
     <el-table
     height="calc(100vh - 350px)"
    :data="tableData"
    stripe
     border
    style="width: 100%">
      <el-table-column
      prop="accounttype"
      label="类型"
      min-width="20">
    </el-table-column>
    <el-table-column
      prop="accountemail"
      label="邮箱"
      min-width="20">
    </el-table-column>
    <el-table-column
      prop="password"
      label="密码"
      min-width="20">
    </el-table-column>
    <el-table-column
      prop="accesstoken"
      label="accesstoken"
      min-width="20"
      >
    </el-table-column>
        <el-table-column
      prop="apikey"
      label="api密钥"
     min-width="20">
    </el-table-column>
      <el-table-column
      prop="accountstatus"
      label="账号状态"
     min-width="20">
    </el-table-column>
     <el-table-column
      prop="sharestatus"
      label="共享状态"
     min-width="20">
    </el-table-column>
        <el-table-column
      prop="sharecount"
      label="共享者角色"
     min-width="20">
    </el-table-column>
      <el-table-column
      prop="quota"
      label="额度"
      min-width="20">
    </el-table-column>
      <el-table-column
      prop="consumption"
      label="消费"
      min-width="20">
    </el-table-column>
      <el-table-column
      prop="balance"
      label="余额"
      min-width="20"></el-table-column>
     <el-table-column
      label="操作"
      width="180">
      <template slot-scope="scope">
        <el-button type="text">启用</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button type="text">禁用</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button type="text">编辑</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button type="text">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  </div>
</el-card>
<!-----------------------------------------新建账户弹窗开始-------------------------------------->
    <el-dialog
      :title="`${accountForm._id?'编辑':'新建'}账号`"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
     
<el-form :model="accountForm" :rules="rules" ref="accountForm" label-width="130px" class="demo-ruleForm">
  <el-form-item label="账号类型：" prop="accounttype">
   <el-select v-model="accountForm.accounttype" placeholder="请选择账号类型" clearable style="width:100%;">
    <el-option label="免费账号" value="免费账号"></el-option>
     <el-option label="升级账号" value="升级账号"></el-option>
      <el-option label="plus账号" value="plus账号"></el-option>
       <el-option label="bing账号" value="bing账号"></el-option>
   </el-select>
  </el-form-item>
    <el-form-item label="账号邮箱：" prop="accountemail">
    <el-input v-model="accountForm.accountemail" placeholder="请输入账号邮箱"></el-input>
  </el-form-item>
    <el-form-item label="账号密码：" >
    <el-input v-model="accountForm.accountpassword" placeholder="请输入账号密码"></el-input>
  </el-form-item>
  <el-form-item label="账号session">
 <el-input v-model="accountForm.accountsession"  placeholder="请输入账号session"></el-input>
  </el-form-item>
     <el-form-item label="accesstoken：">
    <el-input v-model="accountForm.accesstoken" type="textarea" placeholder="请输入accesstoken"></el-input>
  </el-form-item>
    <el-form-item label="api密钥：">
    <el-input v-model="accountForm.apikey"  placeholder="请输入账号密钥"></el-input>
  </el-form-item>
    <el-form-item label="共享人数：" prop="sharecount">
     <el-input-number v-model="accountForm.sharecount" :min="1"  label="共享人数" style="width:100%;"></el-input-number>
  </el-form-item>
    <el-form-item label="共享者角色：" prop="shareroles">
      <el-select style="width:100%;"
     v-model="accountForm.shareroles"
     clearable
    multiple
    collapse-tags
    placeholder="请选择共享者角色">
    <el-option
      v-for="item in roleOptions"
      :key="item._id"
      :label="item.roleName"
      :value="item._id">
    </el-option>
  </el-select>
  </el-form-item>
</el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitAccountResource">确 定</el-button>
      </span>
    </el-dialog>


<!------------------------------------------新建账户弹窗借宿-------------------------------------->
  </div>
</template>

<script>
export default {
         data() {
          return {
             searchForm:{

             },
             tableData:[],
             dialogVisible:false,
             accountForm:{

             },
             roleOptions:[],
             rules:{
              accounttype:[
                { required: true, message: '请选择账号类型', trigger: 'change' }
              ],
              accountemail:[
                { required: true, message: '请输入账号邮箱', trigger: 'blur' }
              ],
              sharecount:[
                { required: true, message: '请输入共享人数', trigger: 'blur' }
              ],
              shareroles:[
                { required: true, message: '请选择共享者角色', trigger: 'change' }
              ]
             },
          };
         },
         methods:{
           addAccount(){
            this.dialogVisible=true
            this.getRoleOptions()
           },
           search(){

           },
           reset(){

           },
           handleClose(){
           this.dialogVisible=false
           this.$refs.accountForm.resetFields()
           },
           submitAccountResource(){
            if(!this.accountForm.accesstoken&&!this.accountForm.apikey){
                this.$message.warning('accesstoken和apikey至少填写一个!')
                return
            }
              this.$refs.accountForm.validate(valid=>{
                if(valid){
                 
                }
              })
           },
          //  获取角色列表
         async getRoleOptions(){
          const { errorCode, data } = await this.$http.roleList({});
         if (errorCode === "0000") {
        this.roleOptions = data.rolelist;
       }
          },
         },
         created(){
         }
}
</script>

<style scoped lang="less">
.box-card{

  .action-btn{
    margin-bottom: 20px;
  }
}
</style>
<style scoped>
/deep/ .el-dialog__footer {
  text-align: center;
}
</style>