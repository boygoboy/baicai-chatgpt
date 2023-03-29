<template>
  <div class="k-0g35po">
    <div
      :class="collapse ? 'k-0g35po-title k-0g35po-collapse' : 'k-0g35po-title'"
    >
      {{appName}}
    </div>
    <div class="k-0g35po-conent">
      <div class="k-0g35po-continer">
        <headerBar />
        <mainContent />
      </div>
    </div>
    <navMenu />
  </div>
</template>
<script>
import navMenu from "@/components/navMenu";
import mainContent from "@/components/mainContent";
import headerBar from "@/components/headerBar";
import { mapState } from "vuex"; 
export default {
  data(){
    return {
      appName:process.env.VUE_APP_NAME
    }
  },
  components: {
    navMenu,
    mainContent,
    headerBar,
  },
  computed: {
    ...mapState("navMenu", ["collapse"]),
  },
};
</script>
<style lang="less" src="./index.less"></style>
