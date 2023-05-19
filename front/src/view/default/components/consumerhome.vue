<template>
  <div class="app">
    <div class="first-block">
     <div class="item">
        <div class="header">近一个月对话</div>
        <div class="content">
        <div class="title">总次数</div>
        <div class="number">{{totalChatCount}}</div>
        </div>
        <img src="@/assets/images/home/line.png"/>
     </div>
     <div class="item">
        <div class="header">近一个月对话</div>
        <div class="content">
        <div class="title">消耗积分</div>
         <div class="number">{{totalUsageCount}}</div>
        </div>
         <img src="@/assets/images/home/line.png"/>
     </div>
     <div class="item">
     <div class="header" style="position:relative;">账户资金
        <span style="position:absolute;right:10px;top:2px;cursor:pointer;z-index:99;">
              <div class="upgrade-btn" style="color:#ffffff;padding:4px 8px;">去充值</div>
        </span>
     </div>
        <div class="content">
        <div class="title">剩余积分</div>
         <div class="number">300</div>
        </div>
         <img src="@/assets/images/home/line1.png"/>
     </div>
     <div class="item" style="background: linear-gradient(225deg, rgba(165, 155, 255, 1) 0%, rgba(126, 114, 242, 1) 100%);">
     <div class="header" style="color:#ffffff;margin-bottom:10px;">套餐类型
        <span style="margin-left:8px;">(免费计划)</span>
        <span style="float:right;margin-right:10px;">
              <div class="upgrade-btn">升级</div>
        </span>
     </div>
        <div class="plan">
        <div class="list">有效期：
            <span>(2023-06-14) ~ (2023-06-14)</span>
            <ul>
                <li>******</li>
                <li>******</li>
                <li>******</li>
                <li>******</li>
            </ul>
        </div>
        </div>
     </div>
    </div>
    <div class="second-block">
        <div class="item">
            <div class="top">
             <div class="search-box">
                <el-form :inline="true"  :model="searchForm">
                <el-form-item label="对话类型：" style="margin-left: 10px;" >
                <el-select v-model="searchForm.type" @change="changType" style="width:160px;">
                    <el-option label="chatgpt官方" value="chatgpt官方"></el-option>
                     <el-option label="chatgpt非官方" value="chatgpt非官方"></el-option>
                     <el-option label="newbing非官方" value="newbing非官方"></el-option>
               </el-select>
                </el-form-item>
                 <el-form-item label="对话模型：" style="margin-left: 10px;">
                <el-select v-model="searchForm.model">
                   <el-option v-for="(item,index) in modelOptions" :key="index"
                    :label="item.label" :value="item.value"
                   ></el-option>
               </el-select>
                </el-form-item>
               <el-form-item>
                <el-button type="primary"  style="margin-left: 10px;" @click="searchecharts">查 询</el-button>
                <el-button   style="margin-left: 10px;" @click="resetecharts">重 置</el-button>
               </el-form-item>
                </el-form>
             </div>
              <div class="echarts-box">
              <v-chart class="chart" :option="countOption"/>
            </div>
            </div>
            <el-divider></el-divider>
             <div class="bottom">
                 <div class="echarts-box">
              <v-chart class="chart" :option="moneyOption"/>
            </div>
            </div>
        </div>
        <div class="item">
          <div class="search-box">
                  <el-form :inline="true"  :model="searchDetailForm">
                <el-form-item label="对话类型：" style="margin-left: 10px;" >
                <el-select v-model="searchDetailForm.type" @change="changType1" style="width:160px;">
                    <el-option label="chatgpt官方" value="chatgpt官方"></el-option>
                     <el-option label="chatgpt非官方" value="chatgpt非官方"></el-option>
                     <el-option label="newbing非官方" value="newbing非官方"></el-option>
               </el-select>
                </el-form-item>
                 <el-form-item label="对话模型：" style="margin-left: 10px;">
                <el-select v-model="searchDetailForm.model">
                   <el-option v-for="(item,index) in modelOptions1" :key="index"
                    :label="item.label" :value="item.value"
                   ></el-option>
               </el-select>
                </el-form-item>
               <el-form-item>
                <el-button type="primary"  style="margin-left: 10px;" @click="searchDetail">查 询</el-button>
                <el-button   style="margin-left: 10px;" @click="resetDetail">重 置</el-button>
               </el-form-item>
                </el-form>
            </div>  
            <div class="title">
                <span>积分详细使用记录</span>
            </div>
            <div class="table-box">
                     <el-table
                height="calc(100vh - 530px)"
                :data="tableData"
                stripe
                border
                 :header-row-style="{height:'40px'}"
                :header-cell-style="{padding:'0px 6px'}"
                style="width: 100%">
              <el-table-column label="对话类型" prop="type"> 
              </el-table-column>
              <el-table-column label="对话模型" prop="model"> 
              </el-table-column>
             <el-table-column label="消耗积分" prop="count"> 
              </el-table-column>
              <el-table-column label="对话时间" prop="date"> 
              </el-table-column>
             </el-table>
                     <div style="float:right;margin:15px 0px;">
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
    </div>
  </div>
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import { countOption,moneyOption} from './js/barOptions.js'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";

use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
]);
export default {
      components: {
    VChart
  },
//   provide: {
//     [THEME_KEY]: "dark"
//   },
     data() {
        return {
            searchForm: {
                type:'',
                model:''
            },
            searchDetailForm:{
                type:'',
                model:''
            },
            modelOptions:[],
            modelOptions1:[],
            tableData:[],
            currentPage:1,
            pageSize:10,
            total:0,
            modelArr:[
                {
                type:'chatgpt官方',  
                modelOptions:[
                    {label:'gpt-3.5-turbo-0301',value:'gpt-3.5-turbo-0301'},
                    {label:'gpt-3.5-turbo',value:'gpt-3.5-turbo'},
                    {label:'text-davinci-003',value:'text-davinci-003'},
                    {label:'gpt-4',value:'gpt-4'},
                ]
            },
                            {
                type:'chatgpt非官方',  
                modelOptions:[
                    {label:'text-davinci-002-render-sha',value:'text-davinci-002-render-sha'},
                    {label:'gpt-3.5-turbo',value:'gpt-3.5-turbo'},
                    {label:'gpt-3.5-turbo-0301',value:'gpt-3.5-turbo-0301'},
                    {label:'text-davinci-003',value:'text-davinci-003'},
                    {label:'gpt-4',value:'gpt-4'},
                ]
            },
                            {
                type:'newbing非官方',  
                modelOptions:[
                    {label:'creative',value:'creative'},
                    {label:'precise',value:'precise'},
                    {label:'fast',value:'fast'},
                    {label:'balanced',value:'balanced'},
                    {label:'Sydney',value:'Sydney'},
                ]
            }
            ],
            countOption,
            moneyOption,
            totalChatCount:0,
            totalUsageCount:0,
            remainCount:0,
        };
     },
     methods:{
        changType(value){
            this.modelOptions = this.modelArr.filter(item=>item.type == value)[0].modelOptions
      },
        changType1(value){
            this.modelOptions1 = this.modelArr.filter(item=>item.type == value)[0].modelOptions
      },
      handleCurrentChange(val){
        this.currentPage = val
        this.getChatDetail()
      },
      handleSizeChange(val){
        this.pageSize = val
        this.getChatDetail()
      },
      async getChatStatistics(type,model){
        let query={
           type,
           model
        } 
      let res=await this.$http.getChatStatistics(query)
      if(res.errorCode=='0000'){
       this.countOption.xAxis.data = res.data.xAxisData
       this.countOption.series[0].data = res.data.yAxisCountsData
       this.moneyOption.xAxis.data = res.data.xAxisData
        this.moneyOption.series[0].data = res.data.yAxisTotalPointsData
        this.totalChatCount = res.data.totalUsage.totalChats
        this.totalUsageCount = res.data.totalUsage.totalPoints
      }else{
        this.$message.error(res.message)
      }
      },
      searchecharts(){
         this.getChatStatistics(this.searchForm.type,this.searchForm.model)
      },
      resetecharts(){
        this.searchForm.type=''
        this.searchForm.model=''
        this.getChatStatistics('','')
      },
     async getChatDetail(){
        const query={
            type:this.searchDetailForm.type,
            model:this.searchDetailForm.model,
            pageNum:this.currentPage,
            pageSize:this.pageSize
        }
       let res=await this.$http.getChatDetail(query)
         if(res.errorCode=='0000'){
              this.tableData = res.data.chatlist
              this.total = res.data.pager.total
      }
     },
     searchDetail(){
        this.currentPage=1
        this.pageSize=10
        this.getChatDetail()
     },
     resetDetail(){
        this.searchDetailForm.type=''
        this.searchDetailForm.model=''
        this.currentPage=1
        this.pageSize=10
        this.getChatDetail()
     }
     },
     created(){
        this.getChatStatistics('','')
        this.getChatDetail()
     }
}
</script>

<style lang="less" scoped>
.app{
    .first-block{
        display: flex;
        flex-wrap: nowrap;
        .item{
            height:180px;
            flex: 1;
            border-radius: 10px;
            overflow: hidden;
            background: #ffffff;
            margin: 0 10px;
            position: relative;
             .header{
                    padding-left: 25px;
                    margin-bottom: 15px;
                    margin-top: 10px;
                    color:#a06eff;
                    font-size: 22px;
                }
            .content{
                border-left: 2px solid #a06eff;
                padding-bottom: 30px;
                height: 90px;
                padding: 0px 25px;
                .title{
                    color:#6d699c;
                    font-size: 18px;
                }
                .number{
                    color: #656197;
                    font-size: 25px;
                    margin-top: 30px;
                    span{
                    margin-left: 5px;
                    color: #656197;
                    font-size: 28px;
                }
                }
            }
            .content1{
                border-left: 2px solid #a06eff;
                padding-bottom: 30px;
                height: 45px;
                padding: 0px 25px;
                display: flex;
                align-items: center;
                .title{
                    color:#6d699c;
                    font-size: 16px;
                }
                .number{
                    color: #656197;
                    font-size: 23px;
                     margin-left:10px;
                    span{
                    margin-left: 5px;
                    color: #656197;
                    font-size: 26px;
                }
                }
            }
            img{
                position: absolute;
                top: 5px;
                right: 5px;
            }
            .plan{
                margin-top: 5px;
                .list{
                    color:#ffffff;
                    font-size: 14px;
                    margin-left: 30px;
                    ul{
                        margin-top: 10px;
                        li{
                            height: 22px;
                            line-height: 22px;
                        }
                    }
                }
            }
        }
        .item:nth-child(1){
            margin-left: 0px;
        }
        .item:nth-child(4){
            margin-right: 0px;
        }
    }
    .second-block{
        display: flex;
        flex-wrap: nowrap;
        margin-top: 20px;
        .item{
            height:calc(100vh - 330px);
            flex: 1;
            border-radius: 10px;
            overflow: hidden;
            background: #ffffff;
            margin: 0 10px;
        }
          .item:nth-child(1){
            margin-left: 0px;
            padding: 20px;
            .top{
                height: 52%;
                .search-box{

                }
                .echarts-box{
                 height: calc(50vh - 220px);
                }
            }
            .bottom{
                height: 48%;
                 .echarts-box{
                 height: calc(50vh - 240px);
                }
            }
        }
        .item:nth-child(2){
            margin-right: 0px;
            padding: 20px;
            .search-box{
              
            }
            .title{
                text-align: center;
                color: #a06eff;
                font-size: 22px;
                margin-bottom: 20px;
            }
        }
    }
}
</style>
<style scoped>
.upgrade-btn{
    font-size: 14px;
    color: #e5e0e0;
    background:#7541e1;
    padding: 2px 6px;
    border-radius: 6px;
    cursor: pointer;
}
</style>