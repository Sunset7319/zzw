<template>
  <div class="login">
    <div class="title">管理平台</div>
    <van-form @submit="Login">
      <van-field v-model="loginForm.account" name="account" label="账号" placeholder="账号" :rules="[{ required: true, message: '请填写账号' }]"/>
      <van-field v-model="loginForm.password" type="password" name="password" label="密码" placeholder="密码" :rules="[{ required: true, message: '请填写密码' }]"/>
      <van-field v-model="loginForm.captcha" name="captcha" label="验证码" placeholder="验证码" :rules="[{ required: true, message: '请填写验证码' }]">
        <template #button>
          <!-- <van-button size="small" type="primary">发送验证码</van-button> -->
          <img :src="captchaUrl"  @click="refreshCaptcha" class="captchaImg" >
        </template>
      </van-field>
      <!-- <img :src="captchaUrl"  @click="refreshCaptcha" > -->
      <div style="margin: 16px;">
        <van-button  :loading=loading  loading-text="登录中" round block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import { getRSAPublicKey, login } from "../api/login.js";
import { httpEncodeSpecialChar } from '@/utils/index'
import { JSEncrypt } from 'jsencrypt'
import md5 from 'js-md5';
import { Toast } from 'vant';
export default {
  data() {
    return {
      captchaUrl: '/api/console/v01/kaptcha/kaptcha.jpg',
      loginForm:{
        account: '',//账号
        password: '',//密码
        captcha:'',//验证码
      },
      publicKey:'',//公钥
      loading:false
    };
  },
  created() {
    //获取公钥
    getRSAPublicKey().then(response => {
      this.publicKey = response.data.keyword
    }).catch(e => {
      console.error(e)
    })
  },
  methods: {
    //验证码
    refreshCaptcha() {
      this.captchaUrl = `/api/console/v01/kaptcha/kaptcha.jpg?date=${new Date().getTime()}`
    },
    //登录
    Login(values) {
      this.loading = true;
      console.log('submit', values);
      const loginInfo = {
        account: this.loginForm.account,
        password: md5(md5(this.loginForm.password) + this.loginForm.captcha),
        verifyCode: this.loginForm.captcha
      }
      console.log(loginInfo)
      const encrypt = new JSEncrypt()
      // 设置公钥
      encrypt.setPublicKey(this.publicKey)
      // 加密
      const theEncrptBodyStr = encrypt.encrypt(JSON.stringify(loginInfo))
      const postJson = httpEncodeSpecialChar(theEncrptBodyStr)
      console.log(postJson)
      login(postJson).then(result => {
        this.loading = false;
          if(result.data.resultCode==200){
            localStorage.setItem("userInfo",JSON.stringify(result.data))
            localStorage.setItem("storeId",result.data.storeList[0].id)
            localStorage.setItem("accessToken",result.data.accessToken)
            this.$store.commit('USER_USERINFO', JSON.stringify(result.data));
            this.$store.commit('USER_STOREID', result.data.storeList[0].id);
            this.$store.commit('USER_ACCESSTOKEN', result.data.accessToken);
            this.$router.push({ path: '/home' })
          }else{
            Toast(result.data.resultMessage);
          }
      }).catch(err => {
          console.log(err);
      });
    }
  },
};
</script>
<style scoped>
.login{
  width: 3.25rem;
  position: absolute;
  top: 30%;
  left: 0.25rem;
  -webkit-transform: translate(0, -30%);
  transform: translate(0, -30%);
}
.title {
  text-align: center;
  font-weight: 500;
  font-size: 0.22rem;
  margin: 20px;
}
.captchaImg{
  width: 60px;
}
</style>