<template>
  <div class="k-and311">
    <el-menu
      :default-active="$route.path"
      class="el-menu-vertical-demo"
     :collapse="collapse"
      router
    >
      <menuItem v-for="item in navTree" :key="item.id" :item="item"> </menuItem>
    </el-menu>
  </div>
</template>
<script>
import { Menu, MenuItemGroup, MenuItem, Submenu } from "element-ui";
import Vue from "vue";
import { mapState } from "vuex";
import menuItem from "./component/menuItem.vue";
Vue.use(Menu);
Vue.use(MenuItemGroup);
Vue.use(MenuItem);
Vue.use(Submenu);
export default {
  components: {
    menuItem,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState("navMenu", ["navTree","collapse"]),
  }
};
</script>
<style lang="less" src="./index.less"></style>
