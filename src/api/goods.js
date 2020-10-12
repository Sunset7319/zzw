import axios from 'axios'
//单品列表
export const productList = (params) => {
  return axios.post("/api/biz/v02/listBizProduct.do",params); 
};
//新增/修改单品
export const saveProduct = params => {
  return axios.post("/api/biz/v02/saveBizProduct.do",params); 
};
//套餐列表
export const packageList = params => {
  return axios.post("/api/biz/v02/listBizFoodSet.do",params); 
};
//新增/修改套餐
export const savePackage = params => {
  return axios.post("/api/biz/v02/saveBizFoodSet.do",params); 
};
//用户订单列表
export const orderList = params => {
  return axios.post("/api/biz/v02/listBizStoreOrder.do",params); 
};
//机器人订单列表
export const robotList = params => {
  return axios.post("/api/biz/v02/listRobotStoreOrder.do",params); 
};


//分时段菜单列表
export const showTimeList = params => {
  return axios.get("/api/biz/v01/show/time/?status=-1&storeId="+params.storeId,params); 
};
//新增分时段商品
export const saveShowTime = params => {
  return axios.post("/api/biz/v01/show/time/",params); 
};
//修改分时段商品
export const modifyShowTime = params => {
  return axios.put("/api/biz/v01/show/time/"+params.id,params); 
};
//删除分时段商品
export const delShowTime = params => {
  return axios.delete("/api/biz/v01/show/time/"+params.id,{data: params}); 
};