<template>
    <el-button size="mini" :disabled="isPerm" @click="handleClick">
      <slot />
    </el-button>
</template>
<script>
import hasPerm from "@/utils/hasPermSign";
import Vue from "vue";
import { Button } from "element-ui";
Vue.use(Button);
export default {
  props: {
    perm: {
      type: String,
      default:''
    },
  },
  data() {
    return {
      isPerm: true,
    };
  },
  watch: {
      //子组件props首次获取到父组件传来的值时，需要执行函数，此时就需要将immediate设为true
      "perm":{
        handler:function(val){
            this.isPerm = this.hasPerm(val);
        },
        immediate:true
    }
  },
  methods: {
      handleClick: function () {
      // 按钮操作处理函数
      this.$emit('click')
    }, 
    hasPerm,
  }
};
</script>
