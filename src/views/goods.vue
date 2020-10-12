<template>
  <div>
    <!-- <van-search show-action placeholder="请输入商品名搜索" >
      <template #action>
        <van-button icon="plus" type="info" size="small" @click="add">单选</van-button>
        <van-button icon="plus" type="info" size="small" @click="add2">套餐</van-button>
      </template>
    </van-search> -->
    <div class="add">
      <van-button icon="plus" type="info" size="small" @click="add">单选</van-button>
      <van-button icon="plus" type="info" size="small" @click="add2">套餐</van-button>
    </div>
    
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" class="showTlmeList">
      <table class="table1">
        <tr>
          <!-- <th>商品ID</th> -->
          <th width="100px">商品名</th>
          <th>类型</th>
          <th>排序值</th>
          <th>开始时间</th>
          <th>结束时间</th>
          <th width="60px">操作</th>
        </tr>
      </table>
      <table class="table2">
        <tr v-for="(item,index) in timeList" :key="index">
          <!-- <td>{{item.foodId}}</td> -->
          <td width="100px">{{item.foodId | productIDOrNameFilter}}</td>
          <td>{{item.showType | showTypeFilter}}</td>
          <td>{{item.orderInFood}}</td>
          <td>{{item.timeStart | hourMinuteSecondFilter}}</td>
          <td>{{item.timeEnd | hourMinuteSecondFilter}}</td>
          <td width="60px">
            <van-button type="info" size="mini" @click="modify(item)">修改</van-button>
            <van-button type="danger" size="mini"  @click="Del(item)">删除</van-button>
          </td>
        </tr>
      </table>
    </van-list>
    
    <van-dialog v-model="show" title="修改" show-cancel-button :beforeClose="chargeBtn">
      <van-form >
        <van-field readonly clickable name="picker" :value="modifyInfo.foodName" label="商品名" placeholder="点击选择商品" v-if="modifyInfo.showType==1" @click="showPicker5 = true"/>
        <van-field readonly clickable name="picker" :value="modifyInfo.foodName" label="商品名" placeholder="点击选择商品" v-if="modifyInfo.showType==2" @click="showPicker55 = true"/>
        <van-field v-model="modifyInfo.orderInFood" label="排序值" placeholder="请输入排序值" />
        <van-field readonly clickable name="datetimePicker" :value="modifyInfo.timeStart" label="开始时间" placeholder="点击选择时间" @click="showPicker = true" />
        <van-field readonly clickable name="datetimePicker" :value="modifyInfo.timeEnd" label="结束时间" placeholder="点击选择时间" @click="showPicker2 = true" />
      </van-form>
    </van-dialog>
    <van-dialog v-model="show2" title="新增" show-cancel-button :beforeClose="chargeBtn2">
      <van-form >
        <van-field readonly clickable name="picker" :value="addInfo.foodName" label="商品名" placeholder="点击选择商品" v-if="addInfo.showType==1" @click="showPicker6 = true"/>
        <van-field readonly clickable name="picker" :value="addInfo.foodName" label="商品名" placeholder="点击选择商品" v-if="addInfo.showType==2" @click="showPicker7 = true"/>
        <van-field v-model="addInfo.orderInFood" label="排序值" placeholder="请输入排序值" />
        <van-field readonly clickable name="datetimePicker" :value="addInfo.timeStart" label="开始时间" placeholder="点击选择时间" @click="showPicker3 = true" />
        <van-field readonly clickable name="datetimePicker" :value="addInfo.timeEnd" label="结束时间" placeholder="点击选择时间" @click="showPicker4 = true" />
      </van-form>
    </van-dialog>
    <van-popup v-model="showPicker" position="bottom">
      <van-datetime-picker type="time" @confirm="onConfirm" @cancel="showPicker = false" />
    </van-popup>
    <van-popup v-model="showPicker2" position="bottom">
      <van-datetime-picker type="time" @confirm="onConfirm2" @cancel="showPicker2 = false" />
    </van-popup>
    <van-popup v-model="showPicker3" position="bottom">
      <van-datetime-picker type="time" @confirm="onConfirm3" @cancel="showPicker3 = false" />
    </van-popup>
    <van-popup v-model="showPicker4" position="bottom">
      <van-datetime-picker type="time" @confirm="onConfirm4" @cancel="showPicker4 = false" />
    </van-popup>
    <van-popup v-model="showPicker5" position="bottom">
      <van-picker show-toolbar :columns="columnsOptional" value-key="name" @confirm="onConfirm5"  @cancel="showPicker5 = false" />
    </van-popup>
    <van-popup v-model="showPicker55" position="bottom">
      <van-picker show-toolbar :columns="columnsSetMeal" value-key="name" @confirm="onConfirm55"  @cancel="showPicker55 = false" />
    </van-popup>
    <van-popup v-model="showPicker6" position="bottom">
      <van-picker show-toolbar :columns="columnsOptional" value-key="name" @confirm="onConfirm6"  @cancel="showPicker6 = false" />
    </van-popup>
    <van-popup v-model="showPicker7" position="bottom">
      <van-picker show-toolbar :columns="columnsSetMeal" value-key="name" @confirm="onConfirm7"  @cancel="showPicker7 = false" />
    </van-popup>
  </div>
</template>
<script>
import { Dialog, Toast } from 'vant';
import { productList, packageList ,showTimeList, saveShowTime, modifyShowTime, delShowTime } from "../api/goods.js"
import { priceFilter, hourMinuteSecondFilter, timesFilter, nullFilter} from "../filter/filter.js"
let that;
export default {
  filters:{
    productIDOrNameFilter(id) {
      for (let i = 0; i < that.columns.length; i++) {
        if(that.columns[i].id==id){
          return that.columns[i].name
        }
      }
    },
  },
  data() {
    return {
      loading: false,
      finished: false,
      pageNo:1,
      pageSize:1000,
      timeList:[],
      show: false,
      show2: false,
      modifyInfo: {
        storeId: this.$store.state.user.storeId,
        showType: '',
        foodId: '',
        foodName: '',
        orderInFood: '',
        timeStart: '',
        timeEnd: ''
      },
      addInfo: {
        storeId: this.$store.state.user.storeId,
        showType: '',
        foodId: '',
        foodName: '',
        orderInFood: '',
        timeStart: '',
        timeEnd: ''
      },
      showPicker: false,
      showPicker2: false,
      showPicker3: false,
      showPicker4: false,
      showPicker5: false,
      showPicker55: false,
      showPicker6: false,
      showPicker7: false,
      columns: [],//单选和套餐的商品集合
      columnsOptional: [],//单选商品
      columnsSetMeal: [],//套餐商品
    };
  },
   beforeCreate: function () {
      that = this;
      
  },
  async created(){
    await that.singleChoiceProduct();
    await that.setMealProduct();
  },
  methods:{
    onLoad() {
      this.loading = false;
      if(this.pageNo==1){
        // this.timeList = [];
      }
      let params = {"storeId":this.$store.state.user.storeId,"pageNo":this.pageNo,"pageSize":this.pageSize}
      showTimeList(params).then(result => {
        this.timeList = result.data.list
        this.finished = true
      })
    },
    //修改弹窗
    modify(item){
      this.show = true;
      this.modifyInfo = Object.assign({}, item) // copy obj
      this.modifyInfo.timeStart = hourMinuteSecondFilter(item.timeStart)
      this.modifyInfo.timeEnd = hourMinuteSecondFilter(item.timeEnd)
      this.modifyInfo.foodName = this.$options.filters["productIDOrNameFilter"](item.foodId)
      console.log(this.modifyInfo)
    },
    //新增单选弹窗
    add(item){
      this.addInfo.foodName = '';
      this.addInfo.showType = "1";//1为单选
      this.show2 = true;
    },
    //新增套餐弹窗
    add2(item){
      this.addInfo.foodName = '';
      this.addInfo.showType = "2";//1为套餐
      this.show2 = true
    },
    //修改
    chargeBtn(action, done){
      if (action === 'cancel') {//取消按钮
        done();
      } else if (action === 'confirm') {//确定按钮
        if (nullFilter(this.modifyInfo.foodName)) {
          Toast("请选择商品名");
          done(false);
          return;
        }
        if (nullFilter(this.modifyInfo.orderInFood)) {
          Toast("请输入排序值");
          done(false);
          return;
        }
        if (nullFilter(this.modifyInfo.timeStart)) {
          Toast("请选择开始时间");
          done(false);
          return;
        }
        if (nullFilter(this.modifyInfo.timeEnd)) {
          Toast("请选择结束时间");
          done(false);
          return;
        }
        let params = Object.assign({}, this.modifyInfo);
        delete params.foodName;
        params.timeStart = new Date("1970-01-01 " + this.modifyInfo.timeStart).getTime()
        params.timeEnd = new Date("1970-01-01 " + this.modifyInfo.timeEnd).getTime()
        console.log(params)
        modifyShowTime(params).then(result => {
          if(result.data.resultCode==200){
            this.onLoad();
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
    //新增
    chargeBtn2(action, done){
      if (action === 'cancel') {//取消按钮
        done();
      } else if (action === 'confirm') {//确定按钮
      if (nullFilter(this.addInfo.foodId)) {
          Toast("请选择商品名");
          done(false);
          return;
        }
        if (nullFilter(this.addInfo.orderInFood)) {
          Toast("请输入排序值");
          done(false);
          return;
        }
        if (nullFilter(this.addInfo.timeStart)) {
          Toast("请选择开始时间");
          done(false);
          return;
        }
        if (nullFilter(this.addInfo.timeEnd)) {
          Toast("请选择结束时间");
          done(false);
          return;
        }
        let params = Object.assign({}, this.addInfo);
        delete params.foodName
        params.timeStart = new Date("1970-01-01 " + this.addInfo.timeStart).getTime()
        params.timeEnd = new Date("1970-01-01 " + this.addInfo.timeEnd).getTime()
        console.log(params)
        saveShowTime(params).then(result => {
          if(result.data.resultCode==200){
            this.onLoad();
            Toast("新增成功");
          }else{
            Toast(result.data.resultMessage);
          }
          done();
        }).catch(e => {
          console.error(e)
        })
      }
    },
    //删除
    Del(item){
      let name = this.$options.filters["productIDOrNameFilter"](item.foodId);
      let params = {id:item.id}
      Dialog.confirm({
        title: '提示',
        message: '确定要删除'+ name + '吗？',
      }).then(() => {
        delShowTime(params).then(result => {
          if(result.data.resultCode==200){
            this.onLoad();
            Toast("删除成功");
          }else{
            Toast(result.data.resultMessage);
          }
        }).catch(e => {
          console.error(e)
        })
      }).catch(() => {
          // on cancel
          console.log("b")
        });
    },
    //选择时间(修改)
    onConfirm(time) {
      this.modifyInfo.timeStart = time;
      this.showPicker = false;
    },
    //选择时间(修改)
    onConfirm2(time) {
      this.modifyInfo.timeEnd = time;
      this.showPicker2 = false;
    },
    //选择时间(新增)
    onConfirm3(time) {
      this.addInfo.timeStart = time;
      this.showPicker3 = false;
    },
    //选择时间(新增)
    onConfirm4(time) {
      this.addInfo.timeEnd = time;
      this.showPicker4 = false;
    },
    //选择商品(修改单选)
    onConfirm5(value) {
      this.modifyInfo.foodName = value.name
      this.modifyInfo.foodId = value.id;
      this.showPicker5 = false;
    },
    //选择商品(修改套餐)
    onConfirm55(value) {
      this.modifyInfo.foodName = value.name
      this.modifyInfo.foodId = value.id;
      this.showPicker55 = false;
    },
    //选择商品(新增单选)
    onConfirm6(value) {
      this.addInfo.foodName = value.name
      this.addInfo.foodId = value.id;
      this.showPicker6 = false;
    },
    //选择商品(新增套餐)
    onConfirm7(value){
      this.addInfo.foodName = value.name
      this.addInfo.foodId = value.id;
      this.showPicker7 = false;
    },
    //加载单选商品
    singleChoiceProduct(){
      let params = {"storeId":this.$store.state.user.storeId,"name":this.name,"pageNo":this.pageNo,"pageSize":this.pageSize}
      productList(params).then(result => {
        for (let i = 0; i < result.data.list.length; i++) {
          this.columns.push(result.data.list[i]);
          this.columnsOptional.push(result.data.list[i]);
        }
      }).catch(e => {
        console.error(e)
      })
    },
    //加载套餐商品
    setMealProduct(){
      let params = {"storeId":this.$store.state.user.storeId,"name":this.name,"pageNo":this.pageNo,"pageSize":this.pageSize}
      packageList(params).then(result => {
        for (let i = 0; i < result.data.list.length; i++) {
          this.columns.push(result.data.list[i]);
          this.columnsSetMeal.push(result.data.list[i]);
        }
      }).catch(e => {
        console.error(e)
      })
    },
  }
}
</script>
<style scoped>
.add{
  padding: 10px;
  text-align: center;
  position: fixed;
  width: 100%;
  height: 30px;
  z-index: 2;
  background: #fff;
}
.showTlmeList{
  position: absolute;
  top: 50px;
  margin-bottom: 100px;
}
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
table th{
  font-size: 14px;
}
table td{
  font-size: 12px;
}
table th,table td{
  min-height: 30px;
  border: 1px solid #eee;
  line-height: 30px;
  text-align: center;
}
.table1{
  position: fixed;
  width: 100%;
  height: 65px;
  background: #fff;
  z-index: 2;
}
.table2{
  position: relative;
  margin-top: 65px;
  width: 100%;
}
</style>