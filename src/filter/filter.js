export const priceFilter = num =>{
  return "￥" + (num/100).toFixed(2)
}
export const nullFilter = num =>{
  if(num=='' || num == null | num == undefined){
    return true
  }else{
    return false
  }
}
export const payStatusFilter = status => {
  const statusMap = {
    'NOT_PAY': '未支付',
    'PAID': '已支付'
  }
  return statusMap[status]
}
export const payTimeFilter = status => {
  const statusMap = {
    'PAY_NOW': '微信支付',
    'PAY_YUE': '余额支付',
  }
  return statusMap[status]
}
export const createTimeFilter = value => {
  var date = new Date(value)// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '/'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/'
  var D = date.getDate() + '/'
  var h = date.getHours() + ':'
  var m = date.getMinutes() + ':'
  var s = date.getSeconds()
  return Y + M + D + h + m + s
}
export const createTimeFilter2 = value =>  {
  var date = new Date(value*1000)// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '/'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/'
  var D = date.getDate() + '/'
  var h = date.getHours() + ':'
  var m = date.getMinutes() + ':'
  var s = date.getSeconds()
  return Y + M + D + h + m + s
}
//时间戳转时分秒
export const hourMinuteSecondFilter = value =>  {
  var date = new Date(value);
  var y=date.getFullYear();
  var m=date.getMonth()+1;
  var d=date.getDate();
  var h=date.getHours();
  var m1=date.getMinutes();
  var s=date.getSeconds();
  h = h<10?("0"+h):h;
  m1 = m1<10?("0"+m1):m1;
  s = s<10?("0"+s):s;
  m = m<10?("0"+m):m;
  d = d<10?("0"+d):d;
  return h+":"+m1
  // return y+"-"+m+"-"+d + "   "+h+":"+m1+":"+s
}
//时分秒时间戳 -> hh:mm:ss
export const timesFilter = data =>  {
  var s = 0;
  var hour = data.split(':')[0];
  var min = data.split(':')[1];
  var sec = data.split(':')[2];
  s = Number(hour * 3600) + Number(min * 60) + Number(sec);
  return s;
}
export const statusCodeFilter = status => {
  const statusMap = {
    '-1': '已取消',
    '0': '未支付',
    '1': '已支付',
    '2': '配送中',
    '3': '已完成',
  }
  return statusMap[status]
}
export const payTypeFilter = status => {
  const statusMap = {
    '1': '微信支付',
    '2': '余额支付',
    '3': '校园卡支付',
    '4': '线下支付'
  }
  return statusMap[status]
}
export const showTypeFilter = status => {
  const statusMap = {
    '1': '自选',
    '2': '套餐',
  }
  return statusMap[status]
}