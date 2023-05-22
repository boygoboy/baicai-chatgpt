<template>
  <div class="app">
    <el-card>
    <div class="search" slot="header">
      <el-form :inline="true" :model="searchForm" class="inline-form">
        <el-form-item label="邮箱：">
          <el-input
            style="width: 160px"
            v-model="searchForm.email"
            placeholder="请输入账号邮箱"
          ></el-input>
        </el-form-item>
          <el-form-item label="token状态：">
          <el-select
            style="width: 160px"
            v-model="searchForm.tokenstatus"
            placeholder="请选择账号状态"
            clearable
          >
            <el-option label="在线" value="在线"></el-option>
            <el-option label="离线" value="离线"></el-option>
          </el-select>
        </el-form-item>
            <el-form-item label="启用状态：">
          <el-select
            style="width: 160px"
            v-model="searchForm.enablestatus"
            placeholder="请选择启用状态"
            clearable
          >
            <el-option label="启用" value="启用"></el-option>
            <el-option label="禁用" value="禁用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <div class="action-btn">
        <el-button type="primary" size="small" @click="addAccount" icon="el-icon-plus"
          >新建</el-button
        >
      </div>
      <div class="table">
        <el-table
          height="calc(100vh - 340px)"
          :data="tableData"
          stripe
          border
          style="width: 100%"
        >
                 <el-table-column type="expand">
      <template slot-scope="scope">
        <el-form label-position="left" label-width="100px">
          <div style="display:flex;">
          <div style="flex:1;">
          <el-form-item label="token：">
            <el-input v-model="scope.row.token" :disabled="true"
            type="textarea" style="width:80%;" :autosize="true"
            ></el-input>
          </el-form-item>
            <el-form-item label="共享者角色：">
            <span>{{ scope.row.shareroleNames.join(',') }}</span>
          </el-form-item>
          </div>
          <div style="flex:1;">
            <el-form-item label="到期时间：">
            <span>{{ scope.row.endtime&&scope.row.endtime.split('T')[0] }}</span>
          </el-form-item>
          </div>
          </div>
        </el-form>
      </template>
    </el-table-column>
          <el-table-column prop="email" label="邮箱" min-width="20" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="password" label="密码" min-width="20" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="tokenstatus" label="token状态" min-width="15" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="enablestatus" label="启用状态" min-width="15">
            <template slot-scope="scope">
                <el-switch @change="switchBardStatus(scope.row)" :disabled="scope.row.tokenstatus=='离线'"
                    v-model="scope.row.enablestatus"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-value="启用"
                    inactive-value="禁用"
                ></el-switch>

            </template>
          </el-table-column>
        <el-table-column prop="sharestatus" label="共享状态" min-width="15">
          <template slot-scope="scope">
           <span>{{scope.row.usedcount}}</span>/{{scope.row.sharecount}}
          </template>
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template slot-scope="scope">
              <el-button type="text" class="text-btn" @click="editKey(scope.row)">编辑</el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button type="text" class="text-btn" @click="deleteKey(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="float:right;margin:10px 0px;">
          <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="total">
    </el-pagination>
        </div>
      </div>
    </div>

    <!-----------------------------------------新建账户弹窗开始-------------------------------------->
    <el-dialog
      :title="`${tokenForm._id ? '编辑' : '新建'}账号`"
      :visible.sync="dialogVisible"
      width="35%"
      :before-close="handleClose"
    >
      <el-form
        :model="tokenForm"
        :rules="rules"
        ref="tokenForm"
        label-width="110px"
      >
        <el-form-item label="账号邮箱：" prop="email">
          <el-input
            v-model="tokenForm.email"
            placeholder="请输入账号邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item label="账号密码：" prop="password">
          <el-input
            v-model="tokenForm.password"
            placeholder="请输入账号密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="token：" prop="token">
          <el-input
            v-model="tokenForm.token"
            placeholder="请输入token"
          ></el-input>
        </el-form-item>
        <el-form-item label="共享人数：" prop="sharecount">
          <el-input-number
            v-model="tokenForm.sharecount"
            :min="1"
            label="共享人数"
            style="width: 100%"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="共享者角色：" prop="shareroles">
          <el-select
            style="width: 100%"
            v-model="tokenForm.shareroles"
            clearable
            multiple
            collapse-tags
            placeholder="请选择共享者角色"
          >
            <el-option
              v-for="item in roleOptions"
              :key="item._id"
              :label="item.roleName"
              :value="item._id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="到期时间：">
          <el-date-picker
            style="width: 100%"
            v-model="tokenForm.endtime"
            type="date"
           value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitTokenResource">确 定</el-button>
      </span>
    </el-dialog>

    <!------------------------------------------新建账户弹窗结束-------------------------------------->
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchForm: {
        email: "",
        enablestatus: "",
        tokenstatus: "",
      },
      tokenForm: {
        _id: "",
        email: "",
        password: "",
        token: "",
        sharecount: "",
        shareroles: [],
        shareroleNames: [],
        endtime: "",
      },
      tableData: [],
      dialogVisible: false,
      roleOptions: [],
      rules: {
        email:[
            { required: true, message: "请输入账号邮箱", trigger: "blur" },
        ],
        password:[
            { required: true, message: "请输入账号密码", trigger: "blur" },
        ],
        token:[
            { required: true, message: "请输入token", trigger: "blur" },
        ],
        sharecount:[
            { required: true, message: "请输入共享人数", trigger: "blur" },
        ],
        shareroles:[
            { required: true, message: "请选择共享者角色", trigger: "change" },
        ],
      },
      currentPage:1,
      pageSize:10,
      total:0

    };
  },
  methods: {
    search() {
       this.currentPage=1
       this.pageSize=10
       this.getBardList()
    },
    reset() {
      this.currentPage=1
      this.pageSize=10
      this.total=0
      this.searchForm = {
        email: "",
        enablestatus: "",
        tokenstatus: "",
      };
      this.getBardList()
    },
    addAccount() {
      this.dialogVisible = true;
      this.getRoleOptions();
    },
    handleClose() {
      this.$refs.tokenForm.resetFields();
      this.dialogVisible = false;
      this.getBardList()
      this.tokenForm={
        _id: "",
        email: "",
        password: "",
        token: "",
        sharecount: "",
        shareroles: [],
        shareroleNames: [],
        endtime: "",
      }
    },
    submitTokenResource() {
        this.$refs.tokenForm.validate(valid=>{
            if(valid){
                let shareroleNames=[]
                this.tokenForm.shareroles.forEach(item=>{
                    this.roleOptions.forEach(role=>{
                        if(item==role._id){
                            shareroleNames.push(role.roleName)
                        }
                    })
                })
                const data={
                    email:this.tokenForm.email,
                    password:this.tokenForm.password,
                    token:this.tokenForm.token,
                    sharecount:this.tokenForm.sharecount,
                    shareroles:this.tokenForm.shareroles,
                    shareroleNames:shareroleNames,
                    endtime:this.tokenForm.endtime,
                }

                if(this.tokenForm._id){
                   data._id=this.tokenForm._id
                   this.$http.putBardList(data).then(res=>{
                    if(res.errorCode=='0000'){
                        this.$message.success('编辑bard资源成功！')
                        this.handleClose()
                    }else{
                        this.$message.warning(res.message)
                    }
                   })
                }else{
                     this.$http.postBardList(data).then(res=>{
                    if(res.errorCode=='0000'){
                        this.$message.success('操作成功')
                        this.handleClose()
                    }else{
                        this.$message.warning(res.message)
                    }
                })
                }
            }
        })
    },
    //  获取角色列表
    async getRoleOptions() {
      const { errorCode, data } = await this.$http.roleList({});
      if (errorCode === "0000") {
        this.roleOptions = data.rolelist;
      }
    },
    // 获取token列表
    getBardList(){
        const query={
            email:this.searchForm.email,
            enablestatus:this.searchForm.enablestatus,
            tokenstatus:this.searchForm.tokenstatus,
            pageNum:this.currentPage,
            pageSize:this.pageSize,
        }
        this.$http.getBardList(query).then(res=>{
            if(res.errorCode=='0000'){
                this.tableData = res.data.bardlist
                this.total=res.data.pager.total
            }else{
                this.$message.warning(res.message)
            }
        })
    },
   editKey(row){
    this.dialogVisible=true
    this.getRoleOptions()
      this.$http.getBardDetail(row._id).then(res=>{
          if(res.errorCode=='0000'){
            let result=res.data
            this.tokenForm={
                _id: result._id,
                email: result.email,
                password: result.password,
                token: result.token,
                sharecount: result.sharecount,
                shareroles: result.shareroles,
                shareroleNames: result.shareroleNames,
                endtime: result.endtime,
            }
          }
      })
    },
    deleteKey(row){
        this.$confirm('是否删除该bard账号？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
          this.$http.deleteBardList(row._id).then(res=>{
        if(res.errorCode=='0000'){
            this.$message.success(res.message)
            this.getBardList()
        }else{
            this.$message.warning(res.message)
        }
      })
          })
    },
    switchBardStatus(row){
       const data={
              _id:row._id,
              enablestatus:row.enablestatus
       }
       this.$http.changeBardStatus(data).then(res=>{
        if(res.errorCode=='0000'){
            this.$message.success(`${row.enablestatus}状态成功！`)
            this.getBardList()
        }else{
            this.$message.warning(res.message)
        }
       })
    },
    handleCurrentChange(val){
        this.currentPage=val
        this.getBardList()
    },
    handleSizeChange(val){
        this.pageSize=val
        this.getBardList()
    },
  },
  created(){
    this.search()
  },
};
</script>

<style lang="less" scoped>
.app {
  .search {
  }
  .table-box {
    .action-btn {
      margin: 0px 0px 20px 0px;
    }
    .table {
    }
  }
}
.el-table {
    // 看这里！！！！！！！！！！！！！！！！！！！！！！！！！！！！
    // 深度选择器，去除默认的padding
    /deep/ th {
      padding: 10px ;
    }
    /deep/ td {
      padding: 10px;
    }
  }
</style>
<style scoped>
</style>