import axios from 'axios'
//获取用户
export const getOrderUser = (params) => {
  return axios.get("/api/biz/v01/order/recharge/store/"+params.storeId+"/num/"+params.num+"?createTime="+params.createTime,params); 
};
//添加余额
export const addUserBalance = (params) => {
  return axios.post("/api/biz/v01/order/recharge/",params); 
};