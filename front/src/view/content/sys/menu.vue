<template>
  <div class="k-2kibew">
    <div class="k-2kibew-add">
      <el-cascader
        v-model="parentId"
        :options="navTree"
        :props="{ checkStrictly: true, label: 'name', value: '_id' }"
        clearable
      ></el-cascader>
      <el-button type="primary" class="k-2kibew-btn" @click="addMenu"
        >新增</el-button
      >
    </div>
    <el-table
      :data="menuTree"
      style="width: 100%;margin-bottom: 20px;"
      row-key="_id"
      max-height="450"
      border
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        v-for="item in tableMenu"
        :key="item._id"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :type="item.type"
        :formatter="item.formatter"
      >
      </el-table-column>
      <el-table-column label="菜单类型" align="center">
        <template slot-scope="scope">
          <el-button size="mini" :type="scope.row.menuType==1?'primary':'success'">
            {{scope.row.menuType==1?"菜单":"按钮"}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" @click="editMenu(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" size="mini" @click="delMenu(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 菜单编辑新增dialog -->
    <el-dialog
      :title="action ? '编辑菜单' : '新增菜单'"
      :visible.sync="menuVisible"
    >
      <el-form ref="menuForm" :rules="menuRule" :model="menuForm" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="menuForm.name"></el-input>
        </el-form-item>
        <el-form-item label="路由" v-show="menuForm.menuType==1" prop="url">
          <el-input v-model="menuForm.url"></el-input>
        </el-form-item>
        <el-form-item v-show="menuForm.menuType==2" label="标识" prop="limitCode">
          <el-input v-model="menuForm.limitCode"></el-input>
        </el-form-item>
        <el-form-item label="图标" v-show="menuForm.menuType==1" prop="icon">
          <el-input v-model="menuForm.icon"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input v-model="menuForm.orderNum"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="menuType">
          <el-radio v-model="menuForm.menuType" label="1">菜单</el-radio>
          <el-radio v-model="menuForm.menuType" label="2">按钮</el-radio>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirm">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<style lang="less" src="../less/menu.less"></style>
<script>
import Vue from "vue";
import addRoutes from "@/router/addRouter";
import router from "@/router";
Vue.prototype.$ELEMENT = { size: "small", zIndex: 3000 };
import {
  Tree,
  Button,
  Cascader,
  MessageBox,
  Message,
  Dialog,
  Form,
  FormItem,
  Select,
  Option,
  Input,
  Radio,
  Table,
  TableColumn,
} from "element-ui";
Vue.use(Tree);
Vue.use(Button);
Vue.use(Cascader);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Select);
Vue.use(Option);
Vue.use(Radio);
Vue.use(Input);
Vue.use(Table);
Vue.use(TableColumn);
Vue.prototype.$message = Message;
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      formLabelWidth: "200",
      parentId: null,
      menuForm: {
        name: "",
        url: "",
        icon: "",
        orderNum: "",
        menuType: "1",
      },
      menuVisible: false,
      menuTree: [],
      action: 0, //0:新增菜单，1:编辑菜单
      tableMenu: [
        {
          label: "id",
          prop: "id",
          //type设置空值可以使树形表格箭头移到后一项
          type:"",
          width:50
        },
        {
          label: "名称",
          prop: "name",
        },
        {
          label: "图标",
          prop: "icon",
        },
        {
          label: "路由",
          prop: "url",
        },
        {
          label: "排序",
          prop: "orderNum",
        }
      ],
      menuRule:{
        name: [
          { required: true, message: "请输入菜单名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" },
        ],
        url: [
          { required: true, message: "请输入路由", trigger: "blur" },
        ]
      }
    };
  },
  computed: {
    ...mapState("navMenu", ["navTree"]),
  },
  watch:{
    //1 菜单 2按钮
    "menuForm.menuType":(val)=>{
      console.log(val)
    }
  },
  methods: {
    ...mapActions("navMenu", ["addMenuList"]),
    //删除菜单
    async delMenu(dat) {
      try {
        await MessageBox.confirm("此操作将删除菜单, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        const { errorCode } = await this.$http.delMenuList( dat._id );
        if (errorCode === "0000") {
          this.$message({
            type: "success",
            message: "删除成功",
          });
          this.parentId = null;
          //查询菜单
          this.menuTree = await this.addMenuList();
        }
      } catch (err) {
        console.log(err);
      }
    },
    //查询菜单
    async queryMenu() {
      this.menuTree = await this.addMenuList();
      console.log(this.menuTree)
    },
    //新增
    addMenu() {
      this.action = 0;
      this.menuVisible = true;
    },
    //编辑
    editMenu(dat) {
      const { name, url, icon, orderNum, _id, parentId } = dat;
      const menuType = dat.menuType.toString();
       //等页面渲染完成再进行赋值，否则resetFields重置的是赋值后的data
      this.$nextTick(()=>{
      this.menuForm = { name, url, icon, orderNum, menuType, _id, parentId };
      this.action = 1;
      })
      this.menuVisible = true;
    },
    async confirm() {
      console.log(this.parentId);
      if(this.action==0){
               const { errorCode } = await this.$http.addMenuList({
        parentId: this.parentId
          ? this.parentId[this.parentId.length - 1]
          : null,
        action: this.action,
        ...this.menuForm,
      });
      if (errorCode === "0000") {
        this.$message({
          showClose: true,
          message: "新增成功",
          type: "success",
        });
      }
      }else{
            const { errorCode } = await this.$http.updateMenuList({
        parentId: this.parentId
          ? this.parentId[this.parentId.length - 1]
          : null,
        action: this.action,
        ...this.menuForm,
      });
      if (errorCode === "0000") {
        this.$message({
          showClose: true,
          message: "编辑成功",
          type: "success",
        });
      }
      }
        //重置表单查询菜单
        this.menuVisible = false;
        this.$refs["menuForm"].resetFields();
        this.menuTree = await this.addMenuList();
        //添加路由
        let routes = await addRoutes(this.menuTree);
        for (let childRoutes of routes) {
          //为名为‘首页’的路由添加子路由(如果不添加 菜单点击找不到路由 必须刷新页面才能正常)
          router.addRoute("首页", childRoutes);
        }

    },
    cancel() {
      this.menuVisible = false;
      this.$refs["menuForm"].resetFields();
    },
  },
  created() {
    this.queryMenu();
  },
};
</script>
