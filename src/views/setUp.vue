<template>
  <div>
    <div class="signOut">
      <van-button type="danger" size="normal" @click="signOut">退出登录</van-button>
    </div> 
  </div>
</template>
<script>
import { Dialog } from 'vant';
export default {
  data() {
    return {
    };
  },
  methods:{
    signOut(){
        localStorage.clear();
        sessionStorage.clear();
        Dialog.alert({
        message: '退出登录成功',
        theme: 'round-button',
      }).then(() => {
        this.$router.push({ path: '/login' })
      });
      }
    },
}
</script>
<style>
.signOut{
  /* margin: 10px 0; */
  margin-top: 280px;
  text-align: center;
}
</style>