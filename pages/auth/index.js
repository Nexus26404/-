import { request } from '../../request/index.js';
import { login } from '../../utils/asyncWx.js';
Page({
    // 获取用户信息
    async handleGetUserInfo(e){
        try{
            // 1. 获取用户信息
        const{ encryptedData, rawData, iv, signature } = e.detail;
        // 2. 获取小程序登陆成功后的 code 值
        const { code } = await login();
        const loginParams = { encryptedData, rawData, iv, signature, code}
        // 3. 发送请求 发送用户的 token 值
        const res = await request({url: '/users/wxlogin',data: loginParams,method: 'post'} );
        console.log(res.data.message); // null 毕竟不是自己的接口
        // 4. 把 token 存入缓存中 同时跳转回上一个页面
        wx.setStorageSync('token', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo');
        wx.navigateBack({
          delta: 1,
        });
        }catch(err){
            console.log(err);
        }
    }
})