<template>
  <div class="k-9sptci">
    <el-form
      ref="userForm"
      :inline="true"
      class="k-9sptci-header"
      :model="userForm"
    >
      <el-form-item label="用户名" prop="username">
        <el-input placeholder="用户名" v-model="userForm.username"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input placeholder="手机号" v-model="userForm.mobile"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="handleQuery">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary " @click="addUser">新增用户</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleReset($refs['userForm'])">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="userTable"
      style="margin-top:20px"
      @selection-change="handleSelect"
    >
      <el-table-column
        v-for="item in userList"
        :key="item._id"
        :prop="item.prop"
        :type="item.type"
        :label="item.label"
        :width="item.width"
        :formatter="item.formatter"
      >
      </el-table-column>
      <el-table-column  label="角色">
        <template slot-scope="scope">
          <el-select disabled :value="scope.row.roleNames" multiple placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item._id"
              :label="item.roleName"
              :value="item._id"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDel(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="k-9sptci-footer">
      <el-button type="danger" @click="batchDelete">批量删除</el-button>
      <el-pagination
        @current-change="handleQuery"
        :current-page.sync="pager.pageNum"
        layout="prev, pager, next"
        :total="pager.total"
      >
      </el-pagination>
    </div>
    <el-dialog
      :title="action ? '编辑用户' : '新增用户'"
      :visible.sync="userVisible"
    >
      <el-form ref="userForm" :model="userParams" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userParams.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userParams.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realname">
          <el-input v-model="userParams.realname"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="userParams.userEmail"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="userParams.mobile"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
         <el-select v-model="userParams.sex"> 
           <el-option label="男" :value="0"></el-option>
           <el-option label="女" :value="1"></el-option>
         </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="roleNames">
          <el-select
            v-model="userParams.roleNames"
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="item in roleList"
              :key="item._id"
              :label="item.roleName"
              :value="item._id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="confirm">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import Vue from "vue";
import {
  Form,
  FormItem,
  Input,
  Button,
  Table,
  TableColumn,
  Pagination,
  MessageBox,
  Message,
  Dialog,
  Select,
  Option,
} from "element-ui";
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Select);
Vue.use(Option);
Vue.prototype.$message = Message;
Vue.prototype.$ELEMENT = { size: "small", zIndex: 3000 };
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      ids: [],
      action: 0,
      userParams: {
        username: "",
        realname: "",
        mobile: "",
        userEmail: "",
        password: "",
        roleNames: [],
      },
      userVisible: false,
      userList: [
        {
          type: "selection",
          width: 55,
        },
        {
          prop: "username",
          label: "用户名",
        },
        {
          prop: "realname",
          label: "真实姓名",
        },
        {
          prop: "mobile",
          label: "手机号",
        },
        {
          prop: "userEmail",
          label: "邮箱",
        },
        {
          prop: "sex",
          label: "性别",
          formatter: (...rest) => {
            return {
              0: "男",
              1: "女",
            }[rest[2]];
          },
        }
      ],
      roleList: [], //角色列表
    };
  },
  computed: {
    ...mapState("user", ["userForm", "userTable", "pager"]),
  },
  methods: {
    addUser() {
      this.action = 0;
      this.userVisible = true;
    },
    //新增用户
    async confirm() {
      if(this.action==0){
        const { errorCode } = await this.$http.addUser({
        ...this.userParams,
        action: this.action,
      });
      if (errorCode === "0000") {
        this.$message({
          type: "success",
          message: "操作成功",
        });
        this.handleQuery();
        this.$refs["userForm"].resetFields();
        this.userVisible = false;
      }
      }else{
        const { errorCode } = await this.$http.editUser({
        ...this.userParams,
        action: this.action,
      });
      if (errorCode === "0000") {
        this.$message({
          type: "success",
          message: "操作成功",
        });
        this.handleQuery();
        this.$refs["userForm"].resetFields();
        this.userVisible = false;
      }
      }
    },
    cancel() {
      this.$refs["userForm"].resetFields();
      this.userVisible = false;
    },
    ...mapActions("user", ["handleQuery"]),
    handleReset(){
       this.userForm.username=''
       this.userForm.mobile=''
       this.handleQuery()
    },
    handleEdit(row) {
      //action=1 编辑
      this.action = 1;
      this.userVisible = true;
      const {
        _id,
        username,
        realname,
        mobile,
        userEmail,
        password,
        sex,
        roleNames,
      } = row;
      //表单渲染完成再赋值 否则重置有问题
      this.$nextTick(()=>{
        this.userParams = {
        username,
        realname,
        mobile,
        userEmail,
        password:'',
        roleNames,
        sex,
        _id,
      };
      })
      
    },
    //选中
    handleSelect(id) {
      let arr = [];
      id.forEach((item) => {
        arr.push(item._id);
      });
      this.ids = arr;
      console.log(this.ids);
    },
    //删除
    async handleDel(row, state) {
      const _id = state ? this.ids : [row._id];
      try {
        await MessageBox.confirm("此操作将删除用户信息, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        const { errorCode } = await this.$http.dellist(_id);
        if (errorCode == "0000") {
          this.$message({
            type: "success",
            message: "删除成功",
          });
          this.handleQuery();
        }
      } catch (err) {
        console.log(err);
      }
    },
    async batchDelete() {
      this.handleDel(this.ids, 1);
    },
    converSex(index) {
      return {
        0: "男",
        1: "女",
      }[index];
    },
    //获取角色列表
    async queryRoleList() {
      const { errorCode, data } = await this.$http.roleList(this.roleForm);
      if (errorCode === "0000") {
        this.roleList = data.rolelist;
      }
    },
  },
  async created() {
    this.handleQuery();
    this.queryRoleList();
  },
};
</script>
<style lang="less" src="../less/user.less"></style>
