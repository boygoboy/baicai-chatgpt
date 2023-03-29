<template>
  <div>
    <el-submenu
      :index="''+item.id"
      v-if="item.children && item.children.length > 0"
    >
      <template slot="title">
        <i :class="item.icon"></i>
        <span>{{ item.name }}</span>
      </template>
      <menuItem v-for="tree in item.children" :item="tree" :key="tree.id" />
    </el-submenu>
    <el-menu-item v-else :index="item.url">
      <i :class="item.icon"></i>
      <span slot="title">{{ item.name }}</span>
    </el-menu-item>
  </div>
</template>
<script>
export default {
  name: 'menuItem',
  props: {
    item: {
      type: Object,
    },
  },
  methods:{
      handleRoute(item){
          this.$router.push(item.url)
      },
     
  }
};
</script>
