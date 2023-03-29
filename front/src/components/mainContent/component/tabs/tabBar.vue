<template>
  <div class="k-kt6p6u">
    <el-tabs
      v-model="bars.tabsValue"
      type="card"
      closable
      @tab-click="handleTabsClick"
      @tab-remove="removeTab"
    >
      <el-tab-pane
        :key="item.name"
        v-for="item in bars.tabsList"
        :label="item.title"
        :name="item.name"
      >
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { Tabs, TabPane } from "element-ui";
import Vue from "vue";
Vue.use(Tabs);
Vue.use(TabPane);
import { mapActions, mapState, mapMutations } from "vuex";
import { setItem, getItem } from "@/utils/storage";
export default {
  data() {
    return {};
  },
  watch: {
    $route: {
      handler: function(item) {
        let sessionBar =getItem("bars");
        //如果有tab缓存并且id为0(代表页面是否重置)才会取缓存的tab,同时调用login防止按钮权限丢失
        if (this.bars.id == 0 && sessionBar) {
          this.setBars(sessionBar)
          this.login()
        }

        const tabs = this.bars.tabsList;
        const isAdd = tabs.find((arg) => {
          return arg.title === item.name;
        });

        if (isAdd) {
          this.bars.tabsValue = isAdd.name;
          return;
        }
        this.addTabs(item);
        setItem("bars", this.bars);
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    ...mapState("tabs", ["bars"]),
  },
  methods: {
    ...mapMutations("tabs", ["setBars"]),
    ...mapActions("tabs", [
      "handleTabsEdit",
      "addTabs",
      "handleTabsClick",
      "removeTab",
    ]),
    ...mapActions('permSign',['login'])
  },
};
</script>
<style src="./index.less" lang="less"></style>
