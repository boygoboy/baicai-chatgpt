<template>
  <div class="app">
    <div class="main">
      <div class="left-box">
        <div class="header">
          <span class="title">角色列表</span>
        </div>
        <div class="body">
            <div class="item" v-for="(item,index) in roleData" :key="index" 
            @click="switchRole(item)"
            :style="{'background-color':(selectRoleItem&&item._id==selectRoleItem._id)?'#7f00ff':'#7e55d7'}"
            >
                <span>{{item.roleName}}</span>
            </div>
        </div>
      </div>
      <div class="right-box">
        <div class="header">
            <span class="title">对话指标</span>
        </div>
        <div class="body">
         <div class="left">
            <div class="title">对话速率</div>
            <div class="block-item">
                <div class="header">
                    <span class="block-title">chatgpt官方</span>
                    <span style="float:right;">
                        <el-button type="text"  size="mini" v-if="!opengptofficalSetting" @click="opengptofficalSetting=true" class="text-btn">配置</el-button>
                        <el-button type="text"  size="mini" v-else @click="saveGptOfficalSetting" class="text-btn">保存</el-button>
                    </span>
                </div>
                <div class="body">
            <el-table
          height="calc(25vh - 55px)"
          :data="gptOfficalTableData"
          stripe
          border
          style="width: 100%"
         :header-row-style="{height:'30px'}"
        :header-cell-style="{padding:'0px 6px'}"
        :cell-style="{padding:opengptofficalSetting?'0':'6px'}"
        >
        <el-table-column prop="model" label="模型" min-width="25">
            <template slot-scope="scope">
            <span :style="{paddingLeft:opengptofficalSetting?'6px':'0px'}">{{scope.row.model}}</span>
            </template>
          </el-table-column>
            <el-table-column prop="count" label="次数" min-width="15">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.count"  v-if="opengptofficalSetting" class="select-inputnumber"
                    size="mini" :min="1"  style="width:100%;"
                     :step="1"></el-input-number>
                    <span v-else>{{scope.row.count}}</span>
                </template>
          </el-table-column>
         <el-table-column prop="cycle" label="周期" min-width="15">
                 <template slot-scope="scope">
                    <el-input-number v-model="scope.row.cycle"  v-if="opengptofficalSetting" class="select-inputnumber"
                    size="mini" :min="1"  style="width:100%;"
                     :step="1"></el-input-number>
                    <span v-else>{{scope.row.cycle}}</span>
                </template>
          </el-table-column>
         <el-table-column prop="unit" label="单位" min-width="15">
                            <template slot-scope="scope">
                     <el-select v-model="scope.row.unit"  style="width:100%;" class="table-select"
                     v-if="opengptofficalSetting">
                        <el-option label="分钟" value="分钟"></el-option>
                        <el-option label="小时" value="小时"></el-option>
                     </el-select>
                    <span v-else>{{scope.row.unit}}</span>
                </template>
          </el-table-column>
        </el-table>
                </div>
            </div>
            <!-- chatgpt非官方 -->
                        <div class="block-item">
                <div class="header">
                    <span class="block-title">chatgpt非官方</span>
                    <span style="float:right;">
                        <el-button type="text"  size="mini" v-if="!opengptunofficalSetting" @click="opengptunofficalSetting=true" class="text-btn">配置</el-button>
                        <el-button type="text"  size="mini" v-else @click="saveGptUnOfficalSetting" class="text-btn">保存</el-button>
                    </span>
                </div>
                <div class="body">
            <el-table
          height="calc(25vh - 20px)"
          :data="gptUnOfficalTableData"
          stripe
          border
          style="width: 100%"
         :header-row-style="{height:'30px'}"
        :header-cell-style="{padding:'0px 6px'}"
        :cell-style="{padding:opengptunofficalSetting?'0':'6px'}"
        >
        <el-table-column prop="model" label="模型" min-width="25">
            <template slot-scope="scope">
            <span :style="{paddingLeft:opengptunofficalSetting?'6px':'0px'}">{{scope.row.model}}</span>
            </template>
          </el-table-column>
            <el-table-column prop="count" label="次数" min-width="15">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.count"  v-if="opengptunofficalSetting" class="select-inputnumber"
                    size="mini" :min="1"  style="width:100%;"
                     :step="1"></el-input-number>
                    <span v-else>{{scope.row.count}}</span>
                </template>
          </el-table-column>
         <el-table-column prop="cycle" label="周期" min-width="15">
                 <template slot-scope="scope">
                    <el-input-number v-model="scope.row.cycle"  v-if="opengptunofficalSetting" class="select-inputnumber"
                    size="mini" :min="1"  style="width:100%;"
                     :step="1"></el-input-number>
                    <span v-else>{{scope.row.cycle}}</span>
                </template>
          </el-table-column>
         <el-table-column prop="unit" label="单位" min-width="15">
                            <template slot-scope="scope">
                     <el-select v-model="scope.row.unit"  style="width:100%;" class="table-select"
                     v-if="opengptunofficalSetting">
                        <el-option label="分钟" value="分钟"></el-option>
                        <el-option label="小时" value="小时"></el-option>
                     </el-select>
                    <span v-else>{{scope.row.unit}}</span>
                </template>
          </el-table-column>
        </el-table>
                </div>
            </div>
            <!-- newbing非官方 -->
              <div class="block-item">
                <div class="header">
                    <span class="block-title">newbing非官方</span>
                    <span style="float:right;">
                        <el-button type="text"  size="mini" v-if="!openbingunofficalSetting" @click="openbingunofficalSetting=true" class="text-btn">配置</el-button>
                        <el-button type="text"  size="mini" v-else @click="saveBingUnOfficalSetting" class="text-btn">保存</el-button>
                    </span>
                </div>
                <div class="body">
            <el-table
          height="calc(25vh - 20px)"
          :data="bingUnOfficalTableData"
          stripe
          border
          style="width: 100%"
         :header-row-style="{height:'30px'}"
        :header-cell-style="{padding:'0px 6px'}"
        :cell-style="{padding:openbingunofficalSetting?'0':'6px'}"
        >
        <el-table-column prop="model" label="模型" min-width="25">
            <template slot-scope="scope">
            <span :style="{paddingLeft:openbingunofficalSetting?'6px':'0px'}">{{scope.row.model}}</span>
            </template>
          </el-table-column>
            <el-table-column prop="count" label="次数" min-width="15">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.count"  v-if="openbingunofficalSetting" class="select-inputnumber"
                    size="mini" :min="1"  style="width:100%;"
                     :step="1"></el-input-number>
                    <span v-else>{{scope.row.count}}</span>
                </template>
          </el-table-column>
         <el-table-column prop="cycle" label="周期" min-width="15">
                 <template slot-scope="scope">
                    <el-input-number v-model="scope.row.cycle"  v-if="openbingunofficalSetting" class="select-inputnumber"
                    size="mini" :min="1"  style="width:100%;"
                     :step="1"></el-input-number>
                    <span v-else>{{scope.row.cycle}}</span>
                </template>
          </el-table-column>
         <el-table-column prop="unit" label="单位" min-width="15">
                            <template slot-scope="scope">
                     <el-select v-model="scope.row.unit"  style="width:100%;" class="table-select"
                     v-if="openbingunofficalSetting">
                        <el-option label="分钟" value="分钟"></el-option>
                        <el-option label="小时" value="小时"></el-option>
                     </el-select>
                    <span v-else>{{scope.row.unit}}</span>
                </template>
          </el-table-column>
        </el-table>
                </div>
            </div>
            <!-- bard非官方 -->
                <div class="block-item">
                <div class="header">
                    <span class="block-title">bard非官方</span>
                    <span style="float:right;">
                        <el-button type="text"  size="mini" v-if="!openbardunofficalSetting" @click="openbardunofficalSetting=true" class="text-btn">配置</el-button>
                        <el-button type="text"  size="mini" v-else @click="saveBardUnOfficalSetting" class="text-btn">保存</el-button>
                    </span>
                </div>
                <div class="body">
            <el-table
          height="calc(25vh - 20px)"
          :data="bardUnOfficalTableData"
          stripe
          border
          style="width: 100%"
         :header-row-style="{height:'30px'}"
        :header-cell-style="{padding:'0px 6px'}"
        :cell-style="{padding:openbardunofficalSetting?'0':'6px'}"
        >
        <el-table-column prop="model" label="模型" min-width="25">
            <template slot-scope="scope">
            <span :style="{paddingLeft:openbardunofficalSetting?'6px':'0px'}">{{scope.row.model}}</span>
            </template>
          </el-table-column>
            <el-table-column prop="count" label="次数" min-width="15">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.count"  v-if="openbardunofficalSetting" class="select-inputnumber"
                    size="mini" :min="1"  style="width:100%;"
                     :step="1"></el-input-number>
                    <span v-else>{{scope.row.count}}</span>
                </template>
          </el-table-column>
         <el-table-column prop="cycle" label="周期" min-width="15">
                 <template slot-scope="scope">
                    <el-input-number v-model="scope.row.cycle"  v-if="openbardunofficalSetting" class="select-inputnumber"
                    size="mini" :min="1"  style="width:100%;"
                     :step="1"></el-input-number>
                    <span v-else>{{scope.row.cycle}}</span>
                </template>
          </el-table-column>
         <el-table-column prop="unit" label="单位" min-width="15">
                            <template slot-scope="scope">
                     <el-select v-model="scope.row.unit"  style="width:100%;" class="table-select"
                     v-if="openbardunofficalSetting">
                        <el-option label="分钟" value="分钟"></el-option>
                        <el-option label="小时" value="小时"></el-option>
                     </el-select>
                    <span v-else>{{scope.row.unit}}</span>
                </template>
          </el-table-column>
        </el-table>
                </div>
            </div>

            <!-- claude非官方 -->
                    <div class="block-item">
                <div class="header">
                    <span class="block-title">claude非官方</span>
                    <span style="float:right;">
                        <el-button type="text"  size="mini" v-if="!openclaudeunofficalSetting" @click="openclaudeunofficalSetting=true" class="text-btn">配置</el-button>
                        <el-button type="text"  size="mini" v-else @click="saveClaudeUnOfficalSetting" class="text-btn">保存</el-button>
                    </span>
                </div>
                <div class="body">
            <el-table
          height="calc(25vh - 20px)"
          :data="claudeUnOfficalTableData"
          stripe
          border
          style="width: 100%"
         :header-row-style="{height:'30px'}"
        :header-cell-style="{padding:'0px 6px'}"
        :cell-style="{padding:openclaudeunofficalSetting?'0':'6px'}"
        >
        <el-table-column prop="model" label="模型" min-width="25">
            <template slot-scope="scope">
            <span :style="{paddingLeft:openclaudeunofficalSetting?'6px':'0px'}">{{scope.row.model}}</span>
            </template>
          </el-table-column>
            <el-table-column prop="count" label="次数" min-width="15">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.count"  v-if="openclaudeunofficalSetting" class="select-inputnumber"
                    size="mini" :min="1"  style="width:100%;"
                     :step="1"></el-input-number>
                    <span v-else>{{scope.row.count}}</span>
                </template>
          </el-table-column>
         <el-table-column prop="cycle" label="周期" min-width="15">
                 <template slot-scope="scope">
                    <el-input-number v-model="scope.row.cycle"  v-if="openclaudeunofficalSetting" class="select-inputnumber"
                    size="mini" :min="1"  style="width:100%;"
                     :step="1"></el-input-number>
                    <span v-else>{{scope.row.cycle}}</span>
                </template>
          </el-table-column>
         <el-table-column prop="unit" label="单位" min-width="15">
                            <template slot-scope="scope">
                     <el-select v-model="scope.row.unit"  style="width:100%;" class="table-select"
                     v-if="openclaudeunofficalSetting">
                        <el-option label="分钟" value="分钟"></el-option>
                        <el-option label="小时" value="小时"></el-option>
                     </el-select>
                    <span v-else>{{scope.row.unit}}</span>
                </template>
          </el-table-column>
        </el-table>
                </div>
            </div>
            <!-- hugging非官方 -->
                    <div class="block-item">
                <div class="header">
                    <span class="block-title">hugging非官方</span>
                    <span style="float:right;">
                        <el-button type="text"  size="mini" v-if="!openhuggingunofficalSetting" @click="openhuggingunofficalSetting=true" class="text-btn">配置</el-button>
                        <el-button type="text"  size="mini" v-else @click="saveHuggingUnOfficalSetting" class="text-btn">保存</el-button>
                    </span>
                </div>
                <div class="body">
            <el-table
          height="calc(25vh - 20px)"
          :data="huggingUnOfficalTableData"
          stripe
          border
          style="width: 100%"
         :header-row-style="{height:'30px'}"
        :header-cell-style="{padding:'0px 6px'}"
        :cell-style="{padding:openhuggingunofficalSetting?'0':'6px'}"
        >
        <el-table-column prop="model" label="模型" min-width="25">
            <template slot-scope="scope">
            <span :style="{paddingLeft:openhuggingunofficalSetting?'6px':'0px'}">{{scope.row.model}}</span>
            </template>
          </el-table-column>
            <el-table-column prop="count" label="次数" min-width="15">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.count"  v-if="openhuggingunofficalSetting" class="select-inputnumber"
                    size="mini" :min="1"  style="width:100%;"
                     :step="1"></el-input-number>
                    <span v-else>{{scope.row.count}}</span>
                </template>
          </el-table-column>
         <el-table-column prop="cycle" label="周期" min-width="15">
                 <template slot-scope="scope">
                    <el-input-number v-model="scope.row.cycle"  v-if="openhuggingunofficalSetting" class="select-inputnumber"
                    size="mini" :min="1"  style="width:100%;"
                     :step="1"></el-input-number>
                    <span v-else>{{scope.row.cycle}}</span>
                </template>
          </el-table-column>
         <el-table-column prop="unit" label="单位" min-width="15">
                            <template slot-scope="scope">
                     <el-select v-model="scope.row.unit"  style="width:100%;" class="table-select"
                     v-if="openhuggingunofficalSetting">
                        <el-option label="分钟" value="分钟"></el-option>
                        <el-option label="小时" value="小时"></el-option>
                     </el-select>
                    <span v-else>{{scope.row.unit}}</span>
                </template>
          </el-table-column>
        </el-table>
                </div>
            </div>


         </div>
          <el-divider direction="vertical"></el-divider>
          <div class="right">
            <div class="title">对话积分</div>
            <!-- chatgpt官方 -->
             <div class="block-item">
                <div class="header">
                    <span class="block-title">chatgpt官方</span>
                    <span style="float:right;">
                        <el-button type="text"  size="mini" v-if="!opengptofficalpriceSetting" @click="opengptofficalpriceSetting=true" class="text-btn">配置</el-button>
                        <el-button type="text"  size="mini" v-else @click="saveGptOfficalPriceSetting" class="text-btn">保存</el-button>
                    </span>
                </div>
                <div class="body">
            <el-table
          height="calc(25vh - 55px)"
          :data="gptofficalPriceTableData"
          stripe
          border
          style="width: 100%"
         :header-row-style="{height:'30px'}"
        :header-cell-style="{padding:'0px 6px'}"
        :cell-style="{padding:opengptofficalpriceSetting?'0':'6px'}"
        >
        <el-table-column prop="model" label="模型" min-width="25">
            <template slot-scope="scope">
            <span :style="{paddingLeft:opengptofficalpriceSetting?'6px':'0px'}">{{scope.row.model}}</span>
            </template>
          </el-table-column>
            <el-table-column prop="count" label="积分" min-width="15">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.count"  v-if="opengptofficalpriceSetting" class="select-inputnumber"
                    size="mini" :min="0"  style="width:100%;"
                     :step="10"></el-input-number>
                    <span v-else>{{scope.row.count}}</span>
                </template>
          </el-table-column>
         <el-table-column prop="unit" label="计量值" min-width="15">
            <template slot-scope="scope">
                <span :style="{paddingLeft:opengptofficalpriceSetting?'6px':'0px'}">{{scope.row.unit}}</span>
            </template>
          </el-table-column>
        </el-table>
                </div>
            </div>
            <!--chatgpt非官方 -->
             <div class="block-item">
                <div class="header">
                    <span class="block-title">chatgpt非官方</span>
                    <span style="float:right;">
                        <el-button type="text"  size="mini" v-if="!opengptunofficalpriceSetting" @click="opengptunofficalpriceSetting=true" class="text-btn">配置</el-button>
                        <el-button type="text"  size="mini" v-else @click="saveGptUnOfficalPriceSetting" class="text-btn">保存</el-button>
                    </span>
                </div>
                <div class="body">
            <el-table
          height="calc(25vh - 20px)"
          :data="gptunofficalPriceTableData"
          stripe
          border
          style="width: 100%"
         :header-row-style="{height:'30px'}"
        :header-cell-style="{padding:'0px 6px'}"
        :cell-style="{padding:opengptunofficalpriceSetting?'0':'6px'}"
        >
        <el-table-column prop="model" label="模型" min-width="25">
            <template slot-scope="scope">
            <span :style="{paddingLeft:opengptunofficalpriceSetting?'6px':'0px'}">{{scope.row.model}}</span>
            </template>
          </el-table-column>
            <el-table-column prop="count" label="积分" min-width="15">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.count"  v-if="opengptunofficalpriceSetting" class="select-inputnumber"
                    size="mini" :min="0"  style="width:100%;"
                     :step="10"></el-input-number>
                    <span v-else>{{scope.row.count}}</span>
                </template>
          </el-table-column>
         <el-table-column prop="unit" label="计量值" min-width="15">
            <template slot-scope="scope">
                <span :style="{paddingLeft:opengptunofficalpriceSetting?'6px':'0px'}">{{scope.row.unit}}</span>
            </template>
          </el-table-column>
        </el-table>
                </div>
            </div>
            <!-- newbing非官方 -->
             <div class="block-item">
                <div class="header">
                    <span class="block-title">newbing非官方</span>
                    <span style="float:right;">
                        <el-button type="text"  size="mini" v-if="!openbingunofficalpriceSetting" @click="openbingunofficalpriceSetting=true" class="text-btn">配置</el-button>
                        <el-button type="text"  size="mini" v-else @click="saveBingUnOfficalPriceSetting" class="text-btn">保存</el-button>
                    </span>
                </div>
                <div class="body">
            <el-table
          height="calc(25vh - 20px)"
          :data="bingunofficalPriceTableData"
          stripe
          border
          style="width: 100%"
         :header-row-style="{height:'30px'}"
        :header-cell-style="{padding:'0px 6px'}"
        :cell-style="{padding:openbingunofficalpriceSetting?'0':'6px'}"
        >
        <el-table-column prop="model" label="模型" min-width="25">
            <template slot-scope="scope">
            <span :style="{paddingLeft:openbingunofficalpriceSetting?'6px':'0px'}">{{scope.row.model}}</span>
            </template>
          </el-table-column>
            <el-table-column prop="count" label="积分" min-width="15">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.count"  v-if="openbingunofficalpriceSetting" class="select-inputnumber"
                    size="mini" :min="0"  style="width:100%;"
                     :step="10"></el-input-number>
                    <span v-else>{{scope.row.count}}</span>
                </template>
          </el-table-column>
         <el-table-column prop="unit" label="计量值" min-width="15">
            <template slot-scope="scope">
                <span :style="{paddingLeft:openbingunofficalpriceSetting?'6px':'0px'}">{{scope.row.unit}}</span>
            </template>
          </el-table-column>
        </el-table>
                </div>
            </div>
<!-- bard非官方 -->
             <div class="block-item">
                <div class="header">
                    <span class="block-title">bard非官方</span>
                    <span style="float:right;">
                        <el-button type="text"  size="mini" v-if="!openbardunofficalpriceSetting" @click="openbardunofficalpriceSetting=true" class="text-btn">配置</el-button>
                        <el-button type="text"  size="mini" v-else @click="saveBardUnOfficalPriceSetting" class="text-btn">保存</el-button>
                    </span>
                </div>
                <div class="body">
            <el-table
          height="calc(25vh - 20px)"
          :data="bardunofficalPriceTableData"
          stripe
          border
          style="width: 100%"
         :header-row-style="{height:'30px'}"
        :header-cell-style="{padding:'0px 6px'}"
        :cell-style="{padding:openbardunofficalpriceSetting?'0':'6px'}"
        >
        <el-table-column prop="model" label="模型" min-width="25">
            <template slot-scope="scope">
            <span :style="{paddingLeft:openbardunofficalpriceSetting?'6px':'0px'}">{{scope.row.model}}</span>
            </template>
          </el-table-column>
            <el-table-column prop="count" label="积分" min-width="15">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.count"  v-if="openbardunofficalpriceSetting" class="select-inputnumber"
                    size="mini" :min="0"  style="width:100%;"
                     :step="10"></el-input-number>
                    <span v-else>{{scope.row.count}}</span>
                </template>
          </el-table-column>
         <el-table-column prop="unit" label="计量值" min-width="15">
            <template slot-scope="scope">
                <span :style="{paddingLeft:openbardunofficalpriceSetting?'6px':'0px'}">{{scope.row.unit}}</span>
            </template>
          </el-table-column>
        </el-table>
                </div>
            </div>

            <!-- claude非官方 -->
             <div class="block-item">
                <div class="header">
                    <span class="block-title">claude非官方</span>
                    <span style="float:right;">
                        <el-button type="text"  size="mini" v-if="!openclaudeunofficalpriceSetting" @click="openclaudeunofficalpriceSetting=true" class="text-btn">配置</el-button>
                        <el-button type="text"  size="mini" v-else @click="saveClaudeUnOfficalPriceSetting" class="text-btn">保存</el-button>
                    </span>
                </div>
                <div class="body">
            <el-table
          height="calc(25vh - 20px)"
          :data="claudeunofficalPriceTableData"
          stripe
          border
          style="width: 100%"
         :header-row-style="{height:'30px'}"
        :header-cell-style="{padding:'0px 6px'}"
        :cell-style="{padding:openclaudeunofficalpriceSetting?'0':'6px'}"
        >
        <el-table-column prop="model" label="模型" min-width="25">
            <template slot-scope="scope">
            <span :style="{paddingLeft:openclaudeunofficalpriceSetting?'6px':'0px'}">{{scope.row.model}}</span>
            </template>
          </el-table-column>
            <el-table-column prop="count" label="积分" min-width="15">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.count"  v-if="openclaudeunofficalpriceSetting" class="select-inputnumber"
                    size="mini" :min="0"  style="width:100%;"
                     :step="10"></el-input-number>
                    <span v-else>{{scope.row.count}}</span>
                </template>
          </el-table-column>
         <el-table-column prop="unit" label="计量值" min-width="15">
            <template slot-scope="scope">
                <span :style="{paddingLeft:openclaudeunofficalpriceSetting?'6px':'0px'}">{{scope.row.unit}}</span>
            </template>
          </el-table-column>
        </el-table>
                </div>
            </div>
            <!-- hugging非官方 -->
                         <div class="block-item">
                <div class="header">
                    <span class="block-title">hugging非官方</span>
                    <span style="float:right;">
                        <el-button type="text"  size="mini" v-if="!openhuggingunofficalpriceSetting" @click="openhuggingunofficalpriceSetting=true" class="text-btn">配置</el-button>
                        <el-button type="text"  size="mini" v-else @click="saveHuggingUnOfficalPriceSetting" class="text-btn">保存</el-button>
                    </span>
                </div>
                <div class="body">
            <el-table
          height="calc(25vh - 20px)"
          :data="huggingunofficalPriceTableData"
          stripe
          border
          style="width: 100%"
         :header-row-style="{height:'30px'}"
        :header-cell-style="{padding:'0px 6px'}"
        :cell-style="{padding:openhuggingunofficalpriceSetting?'0':'6px'}"
        >
        <el-table-column prop="model" label="模型" min-width="25">
            <template slot-scope="scope">
            <span :style="{paddingLeft:openhuggingunofficalpriceSetting?'6px':'0px'}">{{scope.row.model}}</span>
            </template>
          </el-table-column>
            <el-table-column prop="count" label="积分" min-width="15">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.count"  v-if="openhuggingunofficalpriceSetting" class="select-inputnumber"
                    size="mini" :min="0"  style="width:100%;"
                     :step="10"></el-input-number>
                    <span v-else>{{scope.row.count}}</span>
                </template>
          </el-table-column>
         <el-table-column prop="unit" label="计量值" min-width="15">
            <template slot-scope="scope">
                <span :style="{paddingLeft:openhuggingunofficalpriceSetting?'6px':'0px'}">{{scope.row.unit}}</span>
            </template>
          </el-table-column>
        </el-table>
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            gptOfficalTableData: [
                // {model:'gpt-4',count:0,cycle:0,unit:'分钟'},
                // {model:'gpt-3.5-turbo-0301',count:0,cycle:0,unit:'分钟'},
                // {model:'gpt-3.5-turbo',count:0,cycle:0,unit:'分钟'},
                // {model:'text-davinci-003',count:0,cycle:0,unit:'分钟'}
            ],
            opengptofficalSetting:false,
            gptUnOfficalTableData:[
                //  {model:'gpt-4',count:0,cycle:0,unit:'分钟'},
                // {model:'gpt-3.5-turbo-0301',count:0,cycle:0,unit:'分钟'},
                // {model:'gpt-3.5-turbo',count:0,cycle:0,unit:'分钟'},
                // {model:'text-davinci-003',count:0,cycle:0,unit:'分钟'},
                //  {model:'text-davinci-002-render-sha',count:0,cycle:0,unit:'分钟'},
            ],
            opengptunofficalSetting:false,
            bingUnOfficalTableData:[
                // {model:'creative',count:0,cycle:0,unit:'分钟'},
                // {model:'precise',count:0,cycle:0,unit:'分钟'},
                // {model:'fast',count:0,cycle:0,unit:'分钟'},
                //  {model:'Sydney',count:0,cycle:0,unit:'分钟'},
                //   {model:'balanced',count:0,cycle:0,unit:'分钟'},
            ],
            openbingunofficalSetting:false,
            gptofficalPriceTableData:[
                // {model:'gpt-4',count:0,unit:'1次'},
                // {model:'gpt-3.5-turbo-0301',count:0,unit:'1次'},
                // {model:'gpt-3.5-turbo',count:0,unit:'1次'},
                // {model:'text-davinci-003',count:0,unit:'1次'}
            ],
            opengptofficalpriceSetting:false,
            gptunofficalPriceTableData:[
            //    {model:'gpt-4',count:0,unit:'1 次'},
            //     {model:'gpt-3.5-turbo-0301',count:0,unit:'1 次'},
            //     {model:'gpt-3.5-turbo',count:0,unit:'1 次'},
            //     {model:'text-davinci-003',count:0,unit:'1 次'},
            //      {model:'text-davinci-002-render-sha',count:0,unit:'1 次'},
            ],
            opengptunofficalpriceSetting:false,
            bingunofficalPriceTableData:[
                // {model:'creative',count:0,unit:'1 次'},
                // {model:'precise',count:0,unit:'1 次'},
                // {model:'fast',count:0,unit:'1 次'},
                //  {model:'Sydney',count:0,unit:'1 次'},
                //   {model:'balanced',count:0,unit:'1 次'},
            ],
            openbingunofficalpriceSetting:false,
             bardUnOfficalTableData:[
                //  {model:'PaLM 2',count:0,cycle:0,unit:'分钟'},
            ],
            openbardunofficalSetting:false,
            openbardunofficalpriceSetting:false,
            bardunofficalPriceTableData:[
                // {model:'PaLM 2',count:0,unit:'1 次'},
            ],
            openclaudeunofficalSetting:false,
             claudeUnOfficalTableData:[
                //  {model:'slack',count:0,cycle:0,unit:'分钟'},
            ],
            openclaudeunofficalpriceSetting:false,
            claudeunofficalPriceTableData:[
                // {model:'slack',count:0,unit:'1 次'},
            ],
            openhuggingunofficalSetting:false,
            huggingUnOfficalTableData:[],
            openhuggingunofficalpriceSetting:false,
            huggingunofficalPriceTableData:[],
             roleData:[],
             selectRoleItem:null,
        };
    },
    methods: {
        async saveGptOfficalSetting(){
            this.opengptofficalSetting=false;
         let data={
            roleId:this.selectRoleItem._id,
            type:'chatgpt官方',
            rateData:this.gptOfficalTableData
         }
            const { errorCode ,message} = await this.$http.postInterfaceRate(data);
            if (errorCode === "0000") {
                this.$message({
                    message: message,
                    type: "success",
                });
                this.getIngerfaceRateList(this.selectRoleItem._id,'chatgpt官方');
            }else{
                this.$message({
                    message: message,
                    type: "error",
                });
            }
        },
        async saveGptUnOfficalSetting(){
            this.opengptunofficalSetting=false;
         let data={
            roleId:this.selectRoleItem._id,
            type:'chatgpt非官方',
            rateData:this.gptUnOfficalTableData
         }
            const { errorCode ,message} = await this.$http.postInterfaceRate(data);
            if (errorCode === "0000") {
                this.$message({
                    message: message,
                    type: "success",
                });
                this.getIngerfaceRateList(this.selectRoleItem._id,'chatgpt非官方');
            }else{
                this.$message({
                    message: message,
                    type: "error",
                });
            }
        },
       async saveBingUnOfficalSetting(){
            this.openbingunofficalSetting=false;
                     let data={
            roleId:this.selectRoleItem._id,
            type:'newbing非官方',
            rateData:this.bingUnOfficalTableData
         }
            const { errorCode ,message} = await this.$http.postInterfaceRate(data);
            if (errorCode === "0000") {
                this.$message({
                    message: message,
                    type: "success",
                });
                this.getIngerfaceRateList(this.selectRoleItem._id,'newbing非官方');
            }else{
                this.$message({
                    message: message,
                    type: "error",
                });
            }
        },
               async saveBardUnOfficalSetting(){
            this.openbardunofficalSetting=false;
                     let data={
            roleId:this.selectRoleItem._id,
            type:'bard非官方',
            rateData:this.bardUnOfficalTableData
         }
            const { errorCode ,message} = await this.$http.postInterfaceRate(data);
            if (errorCode === "0000") {
                this.$message({
                    message: message,
                    type: "success",
                });
                this.getIngerfaceRateList(this.selectRoleItem._id,'bard非官方');
            }else{
                this.$message({
                    message: message,
                    type: "error",
                });
            }
        },
             async saveClaudeUnOfficalSetting(){
            this.openclaudeunofficalSetting=false;
                     let data={
            roleId:this.selectRoleItem._id,
            type:'claude非官方',
            rateData:this.claudeUnOfficalTableData
         }
            const { errorCode ,message} = await this.$http.postInterfaceRate(data);
            if (errorCode === "0000") {
                this.$message({
                    message: message,
                    type: "success",
                });
                this.getIngerfaceRateList(this.selectRoleItem._id,'claude非官方');
            }else{
                this.$message({
                    message: message,
                    type: "error",
                });
            }
        },
         async saveHuggingUnOfficalSetting(){
            this.openhuggingunofficalSetting=false;
                     let data={
            roleId:this.selectRoleItem._id,
            type:'hugging非官方',
            rateData:this.huggingUnOfficalTableData
         }
            const { errorCode ,message} = await this.$http.postInterfaceRate(data);
            if (errorCode === "0000") {
                this.$message({
                    message: message,
                    type: "success",
                });
                this.getIngerfaceRateList(this.selectRoleItem._id,'hugging非官方');
            }else{
                this.$message({
                    message: message,
                    type: "error",
                });
            }
        },
       async saveGptOfficalPriceSetting(){
            this.opengptofficalpriceSetting=false;
            let data={
            roleId:this.selectRoleItem._id,
            type:'chatgpt官方',
            priceData:this.gptofficalPriceTableData
         }
            const { errorCode ,message} = await this.$http.postInterfacePrice(data);
            if (errorCode === "0000") {
                this.$message({
                    message: message,
                    type: "success",
                });
                this.getInterfacePriceList(this.selectRoleItem._id,'chatgpt官方');
            }else{
                this.$message({
                    message: message,
                    type: "error",
                });
            }
        },
       async saveGptUnOfficalPriceSetting(){
            this.opengptunofficalpriceSetting=false;
            let data={
            roleId:this.selectRoleItem._id,
            type:'chatgpt非官方',
            priceData:this.gptunofficalPriceTableData
         }
            const { errorCode ,message} = await this.$http.postInterfacePrice(data);
            if (errorCode === "0000") {
                this.$message({
                    message: message,
                    type: "success",
                });
                this.getInterfacePriceList(this.selectRoleItem._id,'chatgpt非官方');
            }else{
                this.$message({
                    message: message,
                    type: "error",
                });
            }
        },
       async saveBingUnOfficalPriceSetting(){
            this.openbingunofficalpriceSetting=false;
            let data={
            roleId:this.selectRoleItem._id,
            type:'newbing非官方',
            priceData:this.bingunofficalPriceTableData
         }
            const { errorCode ,message} = await this.$http.postInterfacePrice(data);
            if (errorCode === "0000") {
                this.$message({
                    message: message,
                    type: "success",
                });
                this.getInterfacePriceList(this.selectRoleItem._id,'newbing非官方');
            }else{
                this.$message({
                    message: message,
                    type: "error",
                });
            }
        },
               async saveBardUnOfficalPriceSetting(){
            this.openbardunofficalpriceSetting=false;
            let data={
            roleId:this.selectRoleItem._id,
            type:'bard非官方',
            priceData:this.bardunofficalPriceTableData
         }
            const { errorCode ,message} = await this.$http.postInterfacePrice(data);
            if (errorCode === "0000") {
                this.$message({
                    message: message,
                    type: "success",
                });
                this.getInterfacePriceList(this.selectRoleItem._id,'bard非官方');
            }else{
                this.$message({
                    message: message,
                    type: "error",
                });
            }
        },
          async saveClaudeUnOfficalPriceSetting(){
            this.openclaudeunofficalpriceSetting=false;
            let data={
            roleId:this.selectRoleItem._id,
            type:'claude非官方',
            priceData:this.claudeunofficalPriceTableData
         }
            const { errorCode ,message} = await this.$http.postInterfacePrice(data);
            if (errorCode === "0000") {
                this.$message({
                    message: message,
                    type: "success",
                });
                this.getInterfacePriceList(this.selectRoleItem._id,'claude非官方');
            }else{
                this.$message({
                    message: message,
                    type: "error",
                });
            }
        },
                  async saveHuggingUnOfficalPriceSetting(){
            this.openhuggingunofficalpriceSetting=false;
            let data={
            roleId:this.selectRoleItem._id,
            type:'hugging非官方',
            priceData:this.huggingunofficalPriceTableData
         }
            const { errorCode ,message} = await this.$http.postInterfacePrice(data);
            if (errorCode === "0000") {
                this.$message({
                    message: message,
                    type: "success",
                });
                this.getInterfacePriceList(this.selectRoleItem._id,'hugging非官方');
            }else{
                this.$message({
                    message: message,
                    type: "error",
                });
            }
        },
            //获取角色
    async getRoleList() {
        const query={
            roleName:''
        }
      const { errorCode, data } = await this.$http.roleList(query);
      if (errorCode === "0000") {
        this.roleData = data.rolelist;
        this.handleDefaultShow()
      }
    },
    handleDefaultShow(){
        if(this.roleData.length){
            this.selectRoleItem=this.roleData[0];
            this.getIngerfaceRateList(this.roleData[0]._id,'chatgpt官方');//   查询对应角色的对话指标数据
            this.getIngerfaceRateList(this.roleData[0]._id,'chatgpt非官方');//   查询对应角色的对话指标数据
            this.getIngerfaceRateList(this.roleData[0]._id,'newbing非官方');
            this.getIngerfaceRateList(this.roleData[0]._id,'bard非官方');
            this.getIngerfaceRateList(this.roleData[0]._id,'claude非官方');
            this.getIngerfaceRateList(this.roleData[0]._id,'hugging非官方');
        this.getInterfacePriceList(this.roleData[0]._id,'chatgpt官方');//   查询对应角色的价格数据
        this.getInterfacePriceList(this.roleData[0]._id,'chatgpt非官方');//   查询对应角色的价格数据
        this.getInterfacePriceList(this.roleData[0]._id,'newbing非官方');
        this.getInterfacePriceList(this.roleData[0]._id,'bard非官方');
        this.getInterfacePriceList(this.roleData[0]._id,'claude非官方');
        this.getInterfacePriceList(this.roleData[0]._id,'hugging非官方');
        }
    },
    switchRole(item){
                    this.gptOfficalTableData=[
                // {model:'gpt-4',count:0,cycle:0,unit:'分钟'},
                // {model:'gpt-3.5-turbo-0301',count:0,cycle:0,unit:'分钟'},
                // {model:'gpt-3.5-turbo',count:0,cycle:0,unit:'分钟'},
                // {model:'text-davinci-003',count:0,cycle:0,unit:'分钟'}
            ]
           this.gptUnOfficalTableData=[
                //  {model:'gpt-4',count:0,cycle:0,unit:'分钟'},
                // {model:'gpt-3.5-turbo-0301',count:0,cycle:0,unit:'分钟'},
                // {model:'gpt-3.5-turbo',count:0,cycle:0,unit:'分钟'},
                // {model:'text-davinci-003',count:0,cycle:0,unit:'分钟'},
                //  {model:'text-davinci-002-render-sha',count:0,cycle:0,unit:'分钟'},
            ]
           this.bingUnOfficalTableData=[
                // {model:'creative',count:0,cycle:0,unit:'分钟'},
                // {model:'precise',count:0,cycle:0,unit:'分钟'},
                // {model:'fast',count:0,cycle:0,unit:'分钟'},
                //  {model:'Sydney',count:0,cycle:0,unit:'分钟'},
                //   {model:'balanced',count:0,cycle:0,unit:'分钟'},
            ]
              this.bardUnOfficalTableData=[
                // {model:'PaLM 2',count:0,cycle:0,unit:'分钟'},
            ]
            this.claudeUnOfficalTableData=[
                // {model:'slack',count:0,cycle:0,unit:'分钟'},
            ]
            this.huggingUnOfficalTableData=[]
            this.gptofficalPriceTableData=[
                // {model:'gpt-4',count:0,unit:'1次'},
                // {model:'gpt-3.5-turbo-0301',count:0,unit:'1次'},
                // {model:'gpt-3.5-turbo',count:0,unit:'1次'},
                // {model:'text-davinci-003',count:0,unit:'1次'}
            ],
            this.gptunofficalPriceTableData=[
            //    {model:'gpt-4',count:0,unit:'1 次'},
            //     {model:'gpt-3.5-turbo-0301',count:0,unit:'1 次'},
            //     {model:'gpt-3.5-turbo',count:0,unit:'1 次'},
            //     {model:'text-davinci-003',count:0,unit:'1 次'},
            //      {model:'text-davinci-002-render-sha',count:0,unit:'1 次'},
            ]
            this.bingunofficalPriceTableData=[
                // {model:'creative',count:0,unit:'1 次'},
                // {model:'precise',count:0,unit:'1 次'},
                // {model:'fast',count:0,unit:'1 次'},
                //  {model:'Sydney',count:0,unit:'1 次'},
                //   {model:'balanced',count:0,unit:'1 次'},
            ],
            this.bardunofficalPriceTableData=[
                // {model:'PaLM 2',count:0,unit:'1 次'},
            ]
            this.claudeunofficalPriceTableData=[
                // {model:'slack',count:0,unit:'1 次'},
            ]
            this.huggingunofficalPriceTableData=[]
        this.selectRoleItem=item;
        this.getIngerfaceRateList(item._id,'chatgpt官方');//   查询对应角色的对话指标数据
        this.getIngerfaceRateList(item._id,'chatgpt非官方');//   查询对应角色的对话指标数据
        this.getIngerfaceRateList(item._id,'newbing非官方');
        this.getIngerfaceRateList(item._id,'bard非官方');
        this.getIngerfaceRateList(item._id,'claude非官方');
        this.getIngerfaceRateList(item._id,'hugging非官方');
        this.getInterfacePriceList(item._id,'chatgpt官方');//   查询对应角色的价格数据
        this.getInterfacePriceList(item._id,'chatgpt非官方');//   查询对应角色的价格数据
        this.getInterfacePriceList(item._id,'newbing非官方');
        this.getInterfacePriceList(item._id,'bard非官方');
        this.getInterfacePriceList(item._id,'claude非官方');
        this.getInterfacePriceList(item._id,'hugging非官方');
    },
    // 获取对应角色的对话指标数据
    async getIngerfaceRateList(roleId,type){
        const query={
            type,
            roleId
        }
        const { errorCode, data } = await this.$http.getInterfaceRateList(query);
        if (errorCode === "0000") {
            if(type=='chatgpt官方'){
                if(data.length){
                this.gptOfficalTableData=data;
                }
            }
            if(type=='chatgpt非官方'){
                if(data.length){
                this.gptUnOfficalTableData=data;
                }
            }
            if(type=='newbing非官方'){
                if(data.length){
                this.bingUnOfficalTableData=data;
                }
            }
                if(type=='bard非官方'){
                if(data.length){
                this.bardUnOfficalTableData=data;
                }
            }
                if(type=='claude非官方'){
                if(data.length){
                this.claudeUnOfficalTableData=data;
                }
            }
                if(type=='hugging非官方'){
                if(data.length){
                this.huggingUnOfficalTableData=data;
                }
            }
        }
    },
    // 获取对应角色的价格数据
    async getInterfacePriceList(roleId,type){
        const query={
            type,
            roleId
        }
        const { errorCode, data } = await this.$http.getInterfacePriceList(query);
        if (errorCode === "0000") {
            if(type=='chatgpt官方'){
                if(data.length){
                this.gptofficalPriceTableData=data;
                }
            }
            if(type=='chatgpt非官方'){
                if(data.length){
                this.gptunofficalPriceTableData=data;
                }
            }
            if(type=='newbing非官方'){
                if(data.length){
                this.bingunofficalPriceTableData=data;
                }
            }
            if(type=='bard非官方'){
                if(data.length){
                this.bardunofficalPriceTableData=data;
                }
            }
            if(type=='claude非官方'){
                if(data.length){
                this.claudeunofficalPriceTableData=data;
                }
            }
            if(type=='hugging非官方'){
                if(data.length){
                this.huggingunofficalPriceTableData=data;
                }
            }
        }
    },
    },
    created(){
        this.getRoleList();
    }
};
</script>

<style lang="less" scoped>
.app {
  .main {
    display: flex;
    flex-wrap: nowrap;
    .left-box {
      width: 25%;
      border: 1px solid #d8dce4;
      border-radius: 10px;
      margin-right: 10px;
      overflow: hidden;
      .header {
        height: 45px;
        line-height: 45px;
        padding: 0px 20px;
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
        background: #1b0055;
        .title {
          font-size: 16px;
          color: #ffffff;
        }
      }
      .body {
        height: calc(100vh - 185px);
        padding: 20px;
        background: #ffffff;
        .item{
            display: flex;
            justify-content: center;
            height:45px;
            line-height: 45px;
            background: #7e55d7;
            color: #ffffff;
            border-radius: 5px;
            padding: 0px 20px;
            cursor: pointer;
            margin-bottom: 10px;
        }
      }
    }

    .right-box {
      width: 75%;
            border: 1px solid #d8dce4;
      border-radius: 10px;
      margin-left: 10px;
      overflow: hidden;
      .header {
        height: 45px;
        line-height: 45px;
        padding: 0px 20px;
        background: #1b0055;
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
        .title {
          font-size: 16px;
           color: #ffffff;
        }
      }
      .body {
        height: calc(100vh - 185px);
        display: flex;
        background: #ffffff;
        .left{
            width: 50%;
            padding: 20px 10px 20px 15px;
            overflow-y: auto;
            .title{
                font-size: 16px;
                color: #1b0055;
                text-align: center;
                font-weight: 500;
                text-decoration:underline;
            }
            .block-item{
                border: 1px solid #e4e7ed;
                border-radius: 10px;
                margin-top: 20px;
                .header{
                    background: #1b0055;
                    .block-title{
                        color: #ffffff;
                        font-size: 14px;
                    }
                }
                .body{
                    height: auto;
                }
            }
        }

        .right{
            width: 50%;
            padding: 20px 10px 20px 5px;
            overflow-y: auto;
             .title{
                font-size: 16px;
                color: #1b0055;
                text-align: center;
                font-weight: 500;
                text-decoration:underline;
            }
                .block-item{
                 border: 1px solid #e4e7ed;
                border-radius: 10px;
                margin-top: 20px;
                .header{
                    background: #1b0055;
                    .block-title{
                        color: #ffffff;
                        font-size: 14px;
                    }
                }
                .body{
                    height: auto;
                }
            }
        }
      }
    }
  }
}
</style>
<style scoped>
.el-divider--vertical {
  height: 100%;
}
/deep/ .el-table .cell{
    padding:0px !important;
}
.table-select /deep/ .el-input__inner{
    border: none !important;
    height: 35px !important;
    line-height: 35px !important;
}
.select-inputnumber{
    height: 35px;
    line-height: 35px;
}
.select-inputnumber /deep/ .el-input__inner{
    border: none !important;
    height: 35px !important;
    line-height: 35px !important;
}
.select-inputnumber /deep/ .el-input-number__decrease{
    top: 0px !important;
    bottom: 0px;
}
</style>