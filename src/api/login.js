import axios from 'axios'
//公钥
export const getRSAPublicKey = params => {
  return axios.post("/api/console/v01/getRSAPublicKey.do",params); 
};
//登录
export const login = params => {
  return axios.post("/api/console/v01/login.do",params); 
};