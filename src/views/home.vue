<template>
  <div>
    <van-tabs v-model="active" @click="onClick" swipeable class="my-tab">
      <van-tab title="单品列表"></van-tab>
      <van-tab title="套餐列表"></van-tab>
      <van-tab title="用户订单"></van-tab>
      <van-tab title="机器人订单"></van-tab>
    </van-tabs>
    <form action="/" v-if="active==0 || active==1" class="my-search">
      <van-search v-model="name" placeholder="请输入商品名搜索" @search="onSearch" />
    </form>
    <form action="/" v-if="active==2" class="my-search">
      <van-search v-model="serNum" placeholder="请输入订单编号搜索" @search="onSearch" />
    </form>
    <form action="/" v-if="active==3" class="my-search">
      <van-search v-model="userName" placeholder="请输入用户名搜索" @search="onSearch" />
    </form>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" class="my-table">
      <table class="table1" v-if="active==0">
        <tr class="my-table-th">
          <th>商品名</th>
          <th>价格</th>
          <th>库存</th>
          <th>操作</th>
        </tr>
      </table>
      <table class="table2" v-if="active==0">
        <tr v-for="(item,index) in listProduct" :key="index">
          <td>{{item.name}}</td>
          <td>{{item.price | priceFilter}}</td>
          <td>{{item.stock}}</td>
          <td @click="modify(item)">修改</td>
        </tr>
      </table>
      <table class="table1" v-if="active==1">
        <tr class="my-table-th">
          <th>商品名</th>
          <th>价格</th>
          <th>库存</th>
          <th>操作</th>
        </tr>
      </table>
      <table class="table2" v-if="active==1">
        <tr v-for="(item,index) in listFoodSet" :key="index">
          <td>{{item.name}}</td>
          <td>{{item.price | priceFilter}}</td>
          <td>{{item.stock}}</td>
          <td @click="modify2(item)">修改</td>
        </tr>
      </table>
      <table class="table1" v-if="active==2">
        <tr>
          <th>订单编号</th>
          <th width="65px">订单状态</th>
          <th width="65px">支付方式</th>
          <th width="50px">总额</th>
          <th>创建时间</th>
        </tr>
      </table>
      <table class="table2" v-if="active==2">
        <tr v-for="(item,index) in listOrder" :key="index">
          <td>{{item.serNum}}</td>
          <td width="65px">{{item.payStatus | payStatusFilter}}</td>
          <td width="65px">{{item.payTime | payTimeFilter}}</td>
          <td width="50px">{{item.totalFee  | priceFilter}}</td>
          <td>{{item.createTime | createTimeFilter}}</td>
        </tr>
      </table>
      <table  class="table1" v-if="active==3">
        <tr>
          <th>用户名</th>
          <th width="65px">订单状态</th>
          <th width="65px">支付类型</th>
          <th width="50px">总额</th>
          <th>创建时间</th>
        </tr>
      </table>
      <table  class="table2" v-if="active==3">
        <tr v-for="(item,index) in ListRobot" :key="index">
          <td>{{item.userName}}</td>
          <td width="65px">{{item.statusCode | statusCodeFilter}}</td>
          <td width="65px">{{item.payType | payTypeFilter}}</td>
          <td width="50px">{{item.totalPrice | priceFilter}}</td>
          <td>{{item.createTime | createTimeFilter2}}</td>
        </tr>
      </table>
    </van-list>
    
    <van-dialog v-model="show" title="修改" show-cancel-button :beforeClose="chargeBtn">
      <van-form >
        <van-field v-model="modifyInfo.name" label="商品名" placeholder="请输入商品名" />
        <van-field v-model="modifyInfo.price" label="价格(分)" placeholder="请输入价格" />
        <van-field v-model="modifyInfo.stock" label="库存" placeholder="请输入库存" />
      </van-form>
    </van-dialog>
    <van-dialog v-model="show2" title="修改" show-cancel-button :beforeClose="chargeBtn2">
      <van-form >
        <van-field v-model="modifyInfo2.name" label="商品名" placeholder="请输入商品名" />
        <van-field v-model="modifyInfo2.price" label="价格(分)" placeholder="请输入价格" />
      </van-form>
    </van-dialog>
  </div>
</template>
<script>
import { productList, packageList, saveProduct, savePackage, orderList, robotList } from "../api/goods.js"
import { Toast, Dialog, Field, Search } from 'vant';
import { priceFilter, nullFilter, payStatusFilter, payTimeFilter, createTimeFilter, createTimeFilter2, statusCodeFilter, payTypeFilter } from "../filter/filter.js"
export default {
  data() {
    return {
      active: 0,
      listProduct: [],//单品列表
      listFoodSet: [],//套餐列表
      listOrder: [],//用户订单列表
      ListRobot: [],//机器人订单列表
      name:'',//商品名
      serNum:'',//订单编号
      userName:'',//用户名
      loading: false,
      finished: false,
      pageNo:1,
      pageSize:20,
      show: false,
      show2: false,
      modifyInfo:{//修改
        id:'',
        name:'',
        price:'',
        stock:0
      },
      modifyInfo2:{//修改
        id:'',
        name:'',
        price:'',
        stock:0
      },
      cancel: null
    };
  },
  methods: {
    //点击菜单
    onClick(){
      this.list = [];
      this.pageNo=1
      this.onLoad()
    },
    //搜索
    onSearch(val) {
      this.onClick()
    },
    //list
    onLoad() {
      // console.log("pageNo",this.pageNo)
      if(this.pageNo==1){
        this.listProduct = [];
        this.listFoodSet = [];
        this.listOrder = [];
        this.ListRobot = [];
      }
      //单品列表、套餐列表
      if(this.active==0 || this.active==1){
        let api = '';//api
        let LIST = [];
        if(this.active==0){
          api = productList
          LIST = this.listProduct
        }
        if(this.active==1){
          api = packageList
          LIST = this.listFoodSet
        }
        let params = {"storeId":this.$store.state.user.storeId,"name":this.name,"pageNo":this.pageNo,"pageSize":this.pageSize}
        api(params).then(result => {
          this.loading = false;
          if(result.data.resultCode==200){
            for (let i = 0; i < result.data.list.length; i++) {
              LIST.push(result.data.list[i]);
            }
            this.pageNo++;
            if (result.data.list.length==0) {
              this.finished = true;
            }else{
              this.finished = false;
            }
          }else{
            Toast(result.data.resultMessage);
          }
        }).catch(e => {
          console.error(e)
        })
      }
      if(this.active==2 || this.active==3){
        let api = '';//api
        let params = {};//参数
        let LIST = [];
        if(this.active==2){
          api = orderList
          LIST = this.listOrder
          params = {"storeId":this.$store.state.user.storeId,"serNum":this.serNum,"pageNo":this.pageNo,"pageSize":this.pageSize}
        }
        if(this.active==3){
          api = robotList
          LIST = this.ListRobot
          params = {"restaurantId":this.$store.state.user.storeId,"userName":this.userName,"pageNo":this.pageNo,"pageSize":this.pageSize}
        }
        api(params).then(result => {
          this.loading = false;
          if(result.data.resultCode==200){
            for (let i = 0; i < result.data.list.length; i++) {
              LIST.push(result.data.list[i]);
            }
            this.pageNo++;
            if (result.data.list.length==0) {
              this.finished = true;
            }else{
              this.finished = false;
            }
          }else{
            Toast(result.data.resultMessage);
          }
        }).catch(e => {
          console.error(e)
        })
      }
    },
    //修改弹窗
    modify(item){
      this.modifyInfo = item
      this.show = true
    },
    //修改弹窗
    modify2(item){
      this.modifyInfo2 = item
      this.show2 = true
    },
    //修改
    chargeBtn(action, done){
      if (action === 'cancel') {//取消按钮
        done();
      } else if (action === 'confirm') {//确定按钮
        if (nullFilter(this.modifyInfo.name)) {
          Toast("请输入商品名");
          done(false);
          return;
        }
        if (nullFilter(this.modifyInfo.price)) {
          Toast("请输入价格");
          done(false);
          return;
        }
        if (nullFilter(this.modifyInfo.stock)) {
          Toast("请输入库存");
          done(false);
          return;
        }
        let params = this.modifyInfo
        saveProduct(params).then(result => {
          if(result.data.resultCode==200){
            this.onClick();
            Toast("修改成功");
          }else{
            Toast(result.data.resultMessage);
          }
          done();
        }).catch(e => {
          console.error(e)
        })
      };
    },
    //修改
    chargeBtn2(action, done){
      if (action === 'cancel') {//取消按钮
        done();
      } else if (action === 'confirm') {//确定按钮
        if (nullFilter(this.modifyInfo2.name)) {
          Toast("请输入商品名");
          done(false);
          return;
        }
        if (nullFilter(this.modifyInfo2.price)) {
          Toast("请输入价格");
          done(false);
          return;
        }
        let params = this.modifyInfo2
        savePackage(params).then(result => {
          if(result.data.resultCode==200){
            this.onClick();
            Toast("修改成功");
          }else{
            Toast(result.data.resultMessage);
          }
          done();
        }).catch(e => {
          console.error(e)
        })
      };
    },
  }
}
</script>
<style scoped>
table{
  width: 100%;
  border-collapse: collapse;
  table-layout:fixed;
  word-break:break-all;
  word-wrap:break-word;
  margin:0;
  padding:0;
  background: #fff;
}
table tr{
  width: 100%;
}
table th,table td{
  /* width: 25%; */
  min-height: 30px;
  border: 1px solid #eee;
  line-height: 30px;
  text-align: center;
}
.table1{
  position: fixed;
  width: 100%;
  height: 35px;
  background: #fff;
  z-index: 2;
}
.table2{
  position: relative;
  margin-top: 35px;
  width: 100%;
}
table1 th:nth-child(1),
table1 td:nth-child(1){
  width: 40%;
}
table1 th:nth-child(2),
table1 td:nth-child(2),
table1 th:nth-child(3),
table1 td:nth-child(3),
table1 th:nth-child(4),
table1 td:nth-child(4){
  width: 20%;
}

table th{
  font-size: 14px;
}
table td{
  font-size: 12px;
}
.my-tab{
  position: fixed;
  width: 100%;
  z-index: 2;
  background: #fff;
}
.my-search{
  position: fixed;
  width: 100%;
  top: 44px;
  z-index: 2;
  background: #fff;
}
.my-table{
  position: absolute;
  width: 100%;
  top: 98px;
  margin-bottom: 100px;
}
</style>