<template>
  <div v-if="$route.name == 'home' || $route.name == 'goods' || $route.name == 'recharge'|| $route.name == 'setUp'">
    <van-tabbar v-model="active" inactive-color="#333" active-color="#1989fa" fixed placeholder>
      <van-tabbar-item replace v-for="(item, index) in tabbarList" :key="index" :to="item.path">
        <span>{{ item.title }}</span>
        <!-- <img slot="icon" slot-scope="props" :src="props.active ? item.active : item.normal" /> -->
        <van-icon class="iconfont" size="18" slot="icon" slot-scope="props" class-prefix="zzw-h5" :name="props.active ? item.active : item.normal" ></van-icon>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
export default {
  name: "Tabbar",
  data() {
    return {
      active: 0,
      tabbarList: [
        {
          path: "/home",
          title: "首页",
          normal: "home",
          active: "home",
        },
        {
          path: "/goods",
          title: "分段",
          normal: "shijian",
          active: "shijian",
        },
        {
          path: "/recharge",
          title: "充值",
          normal: "recharge",
          active: "recharge",
        },
        {
          path: "/setUp",
          title: "我的",
          normal: "personal",
          active: "personal",
        },
      ],
    };
  },
  mounted(){
    console.log(this.$route.path)
    this.activeTab(this.$route.path)
  },
  watch: {
    $route(to,from) {
      console.log(to,from)
      this.activeTab(to.path);
    },
  },

  methods: {
    activeTab(path) {
      var index = this.tabbarList.map((item) => item.path).indexOf(path);
      if (index != -1) {
        this.active = index;
      }
    },
  },
}
</script>
<style scoped>

</style>