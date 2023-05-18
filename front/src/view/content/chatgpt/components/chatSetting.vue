<template>
  <div class="app">
    <div class="main-box">
      <div class="action-btn">
        <el-button type="primary" icon="el-icon-plus" @click="createSetting">新建配置</el-button>
      </div>
      <div class="table-box">
        <el-table
          height="calc(100vh - 270px)"
          class="model-table"
          :data="chatSettingTableData"
          border
          style="width: 100%"
        >
          <el-table-column label="聊天渠道" prop="chatchannel" width="180">
          </el-table-column>
          <el-table-column label="聊天模型" prop="model" min-width="70">
          </el-table-column>
          <el-table-column
            label="聊天接口"
            prop="url"
            :show-overflow-tooltip="true"
            min-width="100"
          >
          </el-table-column>
          <el-table-column label="上下文对话" prop="enablecontext" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.enablecontext">开启</span>
              <span v-else>关闭</span>
            </template>
          </el-table-column>
          <el-table-column
            label="代理地址"
            prop="proxyurl"
            :show-overflow-tooltip="true"
            min-width="100"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.proxyObj&&scope.row.proxyObj.proxytype">
                {{ scope.row.proxyObj.proxytype }}://{{
                  scope.row.proxyObj.ip
                }}:{{ scope.row.proxyObj.port }}
              </span>
              <span v-if="scope.row.proxyObj&&scope.row.proxyObj.username">
                {{ scope.row.proxyObj.username }}:{{
                  scope.row.proxyObj.password
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                type="text"
                class="text-btn"
                @click="editChatParams(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="text"
                class="text-btn"
                style="color: red"
                @click="deleteChatParam(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!---------------------------------------配置聊天参数弹窗开始---------------------------------->

    <el-dialog
      :title="`${chatsettingForm._id ? '编辑' : '新建'}配置`"
      :visible.sync="dialogVisible"
      width="35%"
      :before-close="handleClose"
    >
      <el-form
        :model="chatsettingForm"
        :rules="rules"
        ref="chatsettingForm"
        label-width="130px"
        class="demo-ruleForm"
      >
        <el-form-item label="聊天渠道：" prop="chatchannel">
          <el-select :disabled="chatsettingForm._id!=''"
            v-model="chatsettingForm.chatchannel"
            placeholder="请选择聊天渠道"
            clearable
            style="width: 100%"
            @change="changeChatChannel"
          >
            <el-option label="chatgpt官方" value="chatgpt官方"></el-option>
            <el-option label="chatgpt非官方" value="chatgpt非官方"></el-option>
            <el-option label="newbing非官方" value="newbing非官方"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="聊天模型："
          prop="model"
          v-if="chatsettingForm.chatchannel"
        >
          <el-select :disabled="chatsettingForm._id!=''"
            v-model="chatsettingForm.model"
            placeholder="请选择聊天模型"
            :clearable="true"
            style="width: 100%"
            @change="changeModel"
            v-if="chatsettingForm.chatchannel == 'chatgpt官方'"
          >
            <el-option label="gpt-3.5-turbo" value="gpt-3.5-turbo"></el-option>
            <el-option
              label="gpt-3.5-turbo-0301"
              value="gpt-3.5-turbo-0301"
            ></el-option>
            <el-option
              label="text-davinci-003"
              value="text-davinci-003"
            ></el-option>
          </el-select>
          <el-select
            v-model="chatsettingForm.model"
            placeholder="请选择聊天模型"
            :clearable="true"
            style="width: 100%"
            @change="changeModel"
            v-if="chatsettingForm.chatchannel == 'chatgpt非官方'"
          >
            <el-option label="gpt-4" value="gpt-4"></el-option>
            <el-option
              label="text-davinci-002-render-sha"
              value="text-davinci-002-render-sha"
            ></el-option>
            <el-option label="gpt-3.5-turbo" value="gpt-3.5-turbo"></el-option>
            <el-option
              label="gpt-3.5-turbo-0301"
              value="gpt-3.5-turbo-0301"
            ></el-option>
            <el-option
              label="text-davinci-003"
              value="text-davinci-003"
            ></el-option>
          </el-select>
          <el-select
            v-model="chatsettingForm.model"
            placeholder="请选择聊天模型"
            :clearable="true"
            style="width: 100%"
            @change="changeModel"
            v-if="chatsettingForm.chatchannel == 'newbing非官方'"
          >
          <el-option label="balanced" value="balanced"></el-option>
            <el-option label="creative" value="creative"></el-option>
            <el-option label="precise" value="precise"></el-option>
            <el-option label="fast" value="fast"></el-option>
            <el-option label="Sydney" value="Sydney"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="聊天接口："
          prop="url"
          v-if="chatsettingForm.chatchannel"
        >
          <el-select
            popper-class="popper-class"
            :popper-append-to-body="false"
            :multiple-limit="1"
            multiple
            filterable
            allow-create
            clearable
            default-first-option
            v-model="chatsettingForm.url"
            placeholder="请选择或创建对应模型聊天接口"
            style="width: 100%"
          ></el-select>
        </el-form-item>
        <el-form-item
          label="上下文对话："
          prop="enablecontext"
          v-if="chatsettingForm.chatchannel"
        >
          <el-switch v-model="chatsettingForm.enablecontext"></el-switch>
        </el-form-item>
        <el-form-item
          label="代理类型："
          prop="proxytype"
          v-if="
            chatsettingForm.chatchannel == 'chatgpt官方' ||
            chatsettingForm.chatchannel == 'newbing非官方'
          "
        >
          <el-select
            v-model="chatsettingForm.proxytype"
            placeholder="请选择类型"
            :clearable="true"
            style="width: 100%"
            @change="changProxyType"
          >
            <el-option label="socks5" value="socks5"></el-option>
            <el-option label="http" value="http"></el-option>
            <el-option label="https" value="https"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="代理地址："
          prop="proxyUrlData"
          v-if="
            chatsettingForm.chatchannel == 'chatgpt官方' ||
            chatsettingForm.chatchannel == 'newbing非官方'
          "
        >
          <div class="proxy-url">
            <el-input
              v-model="chatsettingForm.proxyUrlData[0]"
              placeholder="ip"
              style="flex: 1; margin-right: 5px"
            ></el-input>
            <el-input
              v-model="chatsettingForm.proxyUrlData[1]"
              placeholder="端口"
              style="flex: 1; margin-right: 5px"
            ></el-input>
            <el-input
              v-model="chatsettingForm.proxyUrlData[2]"
              placeholder="用户名"
              style="flex: 1; margin-right: 5px"
            ></el-input>
            <el-input
              v-model="chatsettingForm.proxyUrlData[3]"
              placeholder="密码"
              style="flex: 1"
            ></el-input>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitChatSetting">确 定</el-button>
      </span>
    </el-dialog>
    <!---------------------------------------配置聊天参数弹窗结束---------------------------------->

    <!-----------------------------------------聊天配置弹窗据开始-->
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      chatsettingForm: {
        _id: "",
        chatchannel: "",
        model: "",
        url: [],
        enablecontext: true,
        proxytype: "",
        proxyUrlData: ["", "", "", ""],
      },
      rules: {
        chatchannel: [
          { required: true, message: "请选择聊天渠道", trigger: "change" },
        ],
        model: [
          { required: true, message: "请选择聊天模型", trigger: "change" },
        ],
        url: [
          {
            required: true,
            message: "请选择或创建聊天接口",
            trigger: "change",
          },
        ],
      },
      chatSettingTableData: [],
    };
  },
  methods: {
    // 编辑聊天配置
    editChatParams(row) {
      this.chatsettingForm = {
        _id: row._id,
        chatchannel: row.chatchannel,
        model: row.model,
        url: [row.url],
        enablecontext: row.enablecontext,
        proxytype: (row.proxyObj&&row.proxyObj.proxytype) ? row.proxyObj.proxytype : "",
        proxyUrlData: [],
      };
      if (row.proxyObj&&row.proxyObj.proxytype) {
        this.chatsettingForm.proxyUrlData.push(row.proxyObj.ip);
        this.chatsettingForm.proxyUrlData.push(row.proxyObj.port);
        this.chatsettingForm.proxyUrlData.push(
          row.proxyObj.username ? row.proxyObj.username : ""
        );
        this.chatsettingForm.proxyUrlData.push(
          row.proxyObj.password ? row.proxyObj.password : ""
        );
      }else{
        this.chatsettingForm.proxyUrlData = ["", "", "", ""];
      }
      this.dialogVisible = true;
    },
    // 删除聊天配置
    deleteChatParam(row) {
      this.$confirm("此操作将永久删除该聊天配置, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$http.deleteChatParams(row._id).then((res) => {
          if (res.errorCode == "0000") {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getChatParams();
          } else {
            this.$message({
              type: "warning",
              message: res.message,
            });
          }
        });
      });
    },
    // 改变聊天渠道
    changeChatChannel() {
      this.chatsettingForm.model = "";
      this.chatsettingForm.url = [];
      this.chatsettingForm.enablecontext = true;
      this.chatsettingForm.proxytype = "";
      this.chatsettingForm.proxyUrlData = ["", "", "", ""];
    },

    // 弹窗
    createSetting() {
      this.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
      this.$refs.chatsettingForm.resetFields();
      this.chatsettingForm = {
        _id: "",
        chatchannel: "",
        model: "",
        url: [],
        enablecontext: true,
        proxytype: "",
        proxyUrlData: ["", "", "", ""],
      };
      this.getChatParams();
    },
    submitChatSetting() {
      this.$refs.chatsettingForm.validate((valid) => {
        if (valid) {
          let proxyObj = {};
          if (this.chatsettingForm.proxytype) {
            proxyObj = {
              proxytype: this.chatsettingForm.proxytype,
              ip: this.chatsettingForm.proxyUrlData[0],
              port: this.chatsettingForm.proxyUrlData[1],
              username: this.chatsettingForm.proxyUrlData[2],
              password: this.chatsettingForm.proxyUrlData[3],
            };
          }else{
            proxyObj = {
              proxytype: "",
              ip: "",
              port: "",
              username: "",
              password: "",
            };
          }
          const data = {
            chatchannel: this.chatsettingForm.chatchannel,
            model: this.chatsettingForm.model,
            url: this.chatsettingForm.url.length
              ? this.chatsettingForm.url[0]
              : "",
            enablecontext: this.chatsettingForm.enablecontext,
            proxyObj: proxyObj,
          };
          if (this.chatsettingForm._id) {
            data._id = this.chatsettingForm._id;
            this.$http.putChatParams(data).then((res) => {
              if (res.errorCode == "0000") {
                this.$message({
                  type: "success",
                  message: "修改成功",
                });
                this.handleClose();
              } else {
                this.$message({
                  type: "warning",
                  message: res.message,
                });
              }
            });
            return;
          }
          this.$http.postChatParams(data).then((res) => {
            if (res.errorCode == "0000") {
              this.$message({
                type: "success",
                message: "创建成功",
              });
              this.handleClose();
              this.getChatParams();
            } else {
              this.$message({
                type: "warning",
                message: res.message,
              });
            }
          });
        }
      });
    },
    getChatParams() {
      this.$http.getChatParams().then((res) => {
        if (res.errorCode == "0000") {
          this.chatSettingTableData = res.data;
        } else {
          this.$message({
            type: "warning",
            message: res.message,
          });
        }
      });
    },

    // 改变代理类型
    changProxyType(value) {
      if (value == "") {
        this.chatsettingForm.proxyurl = "";
      }
    },
    // 改变聊天模型
    changeModel(value) {},
  },
  created() {
    this.getChatParams();
  },
};
</script>

 <style lang="less" scoped>
.app {
  .main-box {
    height: calc(100vh - 90px);
    .tab-box {
      height: 100%;

      .chat-model {
        .chat-setting {
          margin-top: 20px;
          border: solid 1px #ebeef5;
          padding: 10px;
          padding-bottom: 0;
        }
        .title {
          margin-top: 10px;
          span:nth-child(1) {
            font-size: 18px;
            color: #7a69ee;
            margin-right: 10px;
          }
          span:nth-child(2) {
            font-size: 16px;
            color: rgb(29, 28, 28);
            opacity: 0.8;
          }
        }
        .model-table {
          margin-top: 20px;
        }
      }

      .chat-setting {
        .action-btn {
          margin-bottom: 20px;
        }

        .table-box {
        }
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
/deep/ .el-select__tags {
  overflow: hidden;
}
/deep/ .key-content {
  width: 70%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.proxy-url {
  display: flex;
}
.text-btn {
  padding: 0px !important;
}
</style>
