<template>
  <div>

    <van-form @submit="inquiryUser">
      <van-field
        v-model="num"
        name="取餐号"
        label="取餐号"
        placeholder="取餐号"
        :rules="[{ required: true, message: '请填写取餐号' }]"
      />
      <van-field
        readonly
        clickable
        name="calendar"
        :value="createTime"
        label="日期 "
        placeholder="点击选择日期"
        @click="show = true"
        :rules="[{ required: true, message: '请选择日期' }]"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">查询用户</van-button>
      </div>
    </van-form>
    <van-calendar v-model="show" :min-date="minDate" @confirm="onConfirm" />


    <van-form @submit="addUserBalance" v-show="show2" >
      <van-field
        label="用户名"
        v-model="user.nickname"
        placeholder="用户名"
        disabled
      />
      <van-field
        label="剩余余额"
        v-model="user.oldBalance"
        placeholder="剩余余额"
        :formatter="priceFilter"
        disabled
      />
      <van-field
        label="充值金额"
        v-model="user.balance"
        type="number"
        placeholder="充值金额"
        :rules="[{ required: true, message: '请填写充值金额' }]"
      />
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">充值</van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import { getOrderUser, addUserBalance } from "../api/recharge.js"
import { Dialog, Toast } from 'vant';
export default {
 data() {
    return {
      num: '',
      createTime: '',
      show: false,
      show2: false,
      minDate: new Date(2010, 0, 1),
      user:{
        id:'',
        nickname:'',
        oldBalance:'',
        balance:''
      }
    };
  },
  methods: {
    formatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    onConfirm(date) {
      this.show = false;
      this.createTime = this.formatDate(date);
    },
    priceFilter(value) {
      return "￥" + (value/100).toFixed(2);
    },
    //查询用户
    inquiryUser(values) {
      // console.log('submit', values);
      let params = {"storeId":this.$store.state.user.storeId,"num":this.num,"createTime":new Date(this.createTime).getTime()}
      getOrderUser(params).then(result => {
        if(result.data.resultCode==200){
          if(result.data.resultMessage){
            Toast(result.data.resultMessage);
          }else{
            this.user.id=result.data.id;
            this.user.nickname=result.data.nickname;
            this.user.oldBalance=result.data.oldBalance;
            this.show2 = true;
          }
        }else{
          Toast(result.data.resultMessage);
        }
      }).catch(e => {
        console.error(e)
      })
    },
    //充值
    addUserBalance(errorInfo) {
      console.log('failed', errorInfo);
      let params = {"id":this.user.id,"balance":Number(this.user.balance)*100}
      addUserBalance(params).then(result => {
        if(result.data.resultCode==200){
          Dialog.alert({
            title: '充值成功',
            message: '原余额为'+this.priceFilter(result.data.oldBalance)+ ",现余额为"+this.priceFilter(result.data.balance),
          }).then(() => {
            // on close
            // this.inquiryUser()
          })
        }else{
          Toast(result.data.resultMessage);
        }
      }).catch(e => {
        console.error(e)
      })
    },
  },
}
</script>