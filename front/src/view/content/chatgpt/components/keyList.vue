<template>
  <div class="app">
    <div class="search">
      <el-form :inline="true" :model="searchForm" class="inline-form">
        <el-form-item label="类型：">
          <el-select
            style="width: 160px"
            v-model="searchForm.type"
            placeholder="请选择key类型"
            clearable
          >
            <el-option label="免费key" value="免费key"></el-option>
             <el-option label="key3.0" value="key3.0"></el-option>
            <el-option label="key4.0" value="key4.0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱：">
          <el-input
            style="width: 160px"
            v-model="searchForm.email"
            placeholder="请输入账号邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item label="密钥：">
          <el-input
            style="width: 160px"
            v-model="searchForm.key"
            placeholder="请输入api密钥"
          ></el-input>
        </el-form-item>
        <el-form-item label="key状态：">
          <el-select
            style="width: 160px"
            v-model="searchForm.keystatus"
            placeholder="请选择状态"
            clearable
          >
            <el-option label="启用" value="启用"></el-option>
            <el-option label="禁用" value="禁用"></el-option>
            <el-option label="失效" value="失效"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-divider></el-divider>
    <div class="table-box">
      <div class="action-btn">
        <el-button type="primary" size="small" @click="addAccount" icon="el-icon-plus"
          >新建</el-button
        >
      </div>
      <div class="table">
        <el-table
          height="calc(100vh - 420px)"
          :data="tableData"
          stripe
          border
          style="width: 100%"
        >
         <el-table-column type="expand">
      <template slot-scope="scope">
        <el-form label-position="left">
          <div style="display:flex;">
          <div style="flex:1;">
          <el-form-item label="邮箱名称：">
            <span>{{ scope.row.email}}</span>
          </el-form-item>
          <el-form-item label="邮箱密码：">
            <span>{{ scope.row.password }}</span>
          </el-form-item>
          </div>
          <div style="flex:1;">
          <el-form-item label="共享者角色：">
            <span>{{ scope.row.shareroleNames.join(',') }}</span>
          </el-form-item>
            <el-form-item label="到期时间：">
            <span>{{ scope.row.endtime&&scope.row.endtime.split('T')[0] }}</span>
          </el-form-item>
          </div>
          </div>
            <div>
           <el-form-item label="key使用记录：">
            <el-table stripe 
             :header-row-style="{height:'30px'}"
             :header-cell-style="{padding:'0px'}"
             :data="scope.row.history_usage" border style="width:80%;">
            <el-table-column prop="date" label="日期" min-width="50"></el-table-column>
            <el-table-column prop="cost" label="消费额" min-width="50"></el-table-column>
            </el-table>
          </el-form-item>
          </div>
        </el-form>
      </template>
    </el-table-column>
          <el-table-column prop="type" label="类型" min-width="15">
          </el-table-column>
          <el-table-column prop="key" label="密钥" min-width="20" show-overflow-tooltip>
          </el-table-column>
            <el-table-column prop="sharestatus" label="共享状态" min-width="15">
          <template slot-scope="scope">
           <span>{{scope.row.usedcount}}</span>/{{scope.row.sharecount}}
          </template>
          </el-table-column>
          <el-table-column prop="keystatus" label="key状态" min-width="15" show-overflow-tooltip>
           <template slot-scope="scope">
            <div v-if="scope.row.keystatus!='失效'">
                      <el-switch @change="switchKeyStatus(scope.row)" 
                    v-model="scope.row.keystatus"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-value="启用"
                    inactive-value="禁用"

                ></el-switch>
            </div>
            <div v-else>
            {{scope.row.keystatus}}
            </div>
           </template>
          </el-table-column>
          <el-table-column prop="quota" label="额度" min-width="15">
          </el-table-column>
          <el-table-column prop="consumption" label="消费" min-width="15">
          </el-table-column>
          <el-table-column
            prop="balance"
            label="余额"
            min-width="15"
          ></el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="text" class="text-btn" @click="editKey(scope.row)">编辑</el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button type="text" class="text-btn" @click="deleteKey(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="float:right;margin-top:10px;">
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
      :title="`${keyForm._id ? '编辑' : '新建'}密钥`"
      :visible.sync="dialogVisible"
      width="35%"
      :before-close="handleClose"
    >
      <el-form
        :model="keyForm"
        :rules="rules"
        ref="keyForm"
        label-width="110px"
      >
        <el-form-item label="key类型：" prop="type">
          <el-select
            v-model="keyForm.type"
            placeholder="请选择key类型"
            clearable
            style="width: 100%"
          >
            <el-option label="免费key" value="免费key"></el-option>
            <el-option label="key3.0" value="key3.0"></el-option>
            <el-option label="key4.0" value="key4.0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号邮箱：" prop="email">
          <el-input
            v-model="keyForm.email"
            placeholder="请输入账号邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item label="账号密码：">
          <el-input
            v-model="keyForm.password"
            placeholder="请输入账号密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="api密钥：">
          <el-input
            v-model="keyForm.key"
            placeholder="请输入账号密钥"
          ></el-input>
        </el-form-item>
        <el-form-item label="共享人数：" prop="sharecount">
          <el-input-number
            v-model="keyForm.sharecount"
            :min="1"
            label="共享人数"
            style="width: 100%"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="共享者角色：" prop="shareroles">
          <el-select
            style="width: 100%"
            v-model="keyForm.shareroles"
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
            v-model="keyForm.endtime"
            type="date"
           value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitKeyResource">确 定</el-button>
      </span>
    </el-dialog>

    <!------------------------------------------新建账户弹窗结束-------------------------------------->
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchForm: {
        type: "",
        email: "",
        key: "",
        keystatus: "",
      },
      keyForm: {
        _id: "",
        type: "",
        email: "",
        password: "",
        key: "",
        sharecount: "",
        shareroles: [],
        shareroleNames: [],
        endtime: "",
      },
      tableData: [],
      dialogVisible: false,
      roleOptions: [],
      rules: {
        type:[
            { required: true, message: "请选择key类型", trigger: "change" },
        ],
        email:[
            { required: true, message: "请输入账号邮箱", trigger: "blur" },
        ],
        password:[
            { required: true, message: "请输入账号密码", trigger: "blur" },
        ],
        key:[
            { required: true, message: "请输入账号密钥", trigger: "blur" },
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
       this.getKeyList()
    },
    reset() {
      this.currentPage=1
      this.pageSize=10
      this.total=0
      this.searchForm = {
        type: "",
        email: "",
        key: "",
        keystatus: "",
      };
      this.getKeyList()
    },
    addAccount() {
      this.dialogVisible = true;
      this.getRoleOptions();
    },
    handleClose() {
      this.$refs.keyForm.resetFields();
      this.dialogVisible = false;
      this.getKeyList()
      this.keyForm={
        _id: "",
        type: "",
        email: "",
        password: "",
        key: "",
        sharecount: "",
        shareroles: [],
        shareroleNames: [],
        endtime: "",
      }
    },
    submitKeyResource() {
        this.$refs.keyForm.validate(valid=>{
            if(valid){
                let shareroleNames=[]
                this.keyForm.shareroles.forEach(item=>{
                    this.roleOptions.forEach(role=>{
                        if(item==role._id){
                            shareroleNames.push(role.roleName)
                        }
                    })
                })
                const data={
                    type:this.keyForm.type,
                    email:this.keyForm.email,
                    password:this.keyForm.password,
                    key:this.keyForm.key,
                    sharecount:this.keyForm.sharecount,
                    shareroles:this.keyForm.shareroles,
                    shareroleNames:shareroleNames,
                    endtime:this.keyForm.endtime,
                }

                if(this.keyForm._id){
                   data._id=this.keyForm._id
                   this.$http.putKeyList(data).then(res=>{
                    if(res.errorCode=='0000'){
                        this.$message.success('编辑key资源成功！')
                        this.handleClose()
                    }else{
                        this.$message.warning(res.message)
                    }
                   })
                }else{
                     this.$http.postKeyList(data).then(res=>{
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
    // 获取key列表
    getKeyList(){
        const query={
            type:this.searchForm.type,
            email:this.searchForm.email,
            key:this.searchForm.key,
            keystatus:this.searchForm.keystatus,
            pageNum:this.currentPage,
            pageSize:this.pageSize,
        }
        this.$http.getKeyList(query).then(res=>{
            if(res.errorCode=='0000'){
                this.tableData = res.data.keyList
                this.total=res.data.pager.total
            }else{
                this.$message.warning(res.message)
            }
        })
    },
   editKey(row){
    this.dialogVisible=true
    this.getRoleOptions()
      this.$http.getKeyDetail(row._id).then(res=>{
          if(res.errorCode=='0000'){
            let result=res.data
            this.keyForm={
                _id: result._id,
                type: result.type,
                email: result.email,
                password: result.password,
                key: result.key,
                sharecount: result.sharecount,
                shareroles: result.shareroles,
                shareroleNames: result.shareroleNames,
                endtime: result.endtime,
            }
          }
      })
    },
    deleteKey(row){
        this.$confirm('是否删除该key？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
          this.$http.deleteKeyList(row._id).then(res=>{
        if(res.errorCode=='0000'){
            this.$message.success(res.message)
            this.getKeyList()
        }else{
            this.$message.warning(res.message)
        }
      })
          })
    },
    switchKeyStatus(row){
       const data={
              _id:row._id,
              keystatus:row.keystatus
       }
       this.$http.changeKeyStatus(data).then(res=>{
        if(res.errorCode=='0000'){
            this.$message.success(`${tag}key状态成功！`)
            this.getKeyList()
        }else{
            this.$message.warning(res.message)
        }
       })
    },
    handleCurrentChange(val){
        this.currentPage=val
        this.getKeyList()
    },
    handleSizeChange(val){
        this.pageSize=val
        this.getKeyList()
    }
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
      margin: 20px 0px;
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