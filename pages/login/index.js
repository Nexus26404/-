// pages/login/index.js
Page({
    handleGetUserInfo(){
        // getUserInfo 已经被启用 现改为 getUserProfile
        // const {userInfo} = e.detail;
        // console.log(e);
        // wx.setStorageSync('userinfo', userInfo);
        // wx.navigateBack({
        //   delta: 1,
        // });
        wx.getUserProfile({
          lang: 'zh_CN',
          desc: '获取用户登录信息',
          success(res){
            const {userInfo} = res;
            wx.setStorageSync('userinfo', userInfo);
            wx.navigateBack({
              delta: 1
            })
          }
        })
    }
})