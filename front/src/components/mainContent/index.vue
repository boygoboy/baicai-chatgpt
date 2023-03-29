<template>
    <div>
        <tabBar />
        <div class="k-owao1y">
        <router-view />
        </div>
    </div>
</template>
<script>
import tabBar from './component/tabs/tabBar.vue'
export default {
    components:{
        tabBar
    }
}
</script>
<style lang="less">
.k-owao1y{
    padding: 10px;
}
</style>