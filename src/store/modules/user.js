const user={
  state: {
    userInfo:localStorage.getItem('userInfo')||undefined,
    accessToken:localStorage.getItem('accessToken')||undefined,
    storeId:localStorage.getItem('storeId')||undefined,
  },
  mutations: {
      USER_USERINFO:(state,value)=>{
          localStorage.setItem('userInfo',value)
          state.userInfo=value;
      },
      USER_ACCESSTOKEN:(state,value)=>{
        localStorage.setItem('accessToken',value)
          state.accessToken=value;
      },
      USER_STOREID:(state,value)=>{
        localStorage.setItem('storeId',value)
        state.storeId=value;
      },
  },
  actions: {
      
  }
}
export default user