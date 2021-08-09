/*
    1. 页面加载的时候
        1. 从缓存中获取购物车数据 渲染到页面中
            这些数据 checked = true
    2. 微信支付
        1. 哪些人 哪些账号 可以实现微信支付
            1. 企业账号 
            2. 企业账号的小程序后台中 必须 给开发者 添加上白名单
                1. 一个 appid 可以同时绑定多个开发者
                2. 这些开发者就可以共用 appid 和它的开发权限
    3. 支付按钮
        1. 先判断缓存中有没有 token
        2. 没有 跳转到授权页面 进行获取 token
        3. 有 token 创建订单  获取订单编号
        4. 已经完成了微信支付
        5. 手动删除缓存中 已经被选中了的商品
        6. 删除后的购物车数据 填充回缓存中
        7. 再跳转页面
*/ 

import { request } from '../../request/index.js';
import { requestPayment, showToast } from '../../utils/asyncWx.js'
Page({
    data:{
        address: {},
        cart: [],
        totalPrice: 0,
        totalNum: 0
    },
    onShow(){
        // 1. 获取缓存中的收货地址信息
        const address = wx.getStorageSync('address');
        // 1. 获取缓存中的购物车数据
        let cart = wx.getStorageSync('cart')||[];
        // 过滤后的购物车数组
        cart = cart.filter(v => v.checked);

        let totalPrice = 0;
        let totalNum = 0;
        cart.forEach(v=>{
            totalPrice += v.num * v.goods_price;
            totalNum += v.num;
        })
        this.setData({
            totalPrice,
            totalNum,
            cart,
            address
        });
    },
    // 点击支付的功能
    async handleOrderPay(){
        try{
            // 1. 判断缓存中有没有 token
            const token = wx.getStorageSync('token');
            // 2. 判断
            if(!token){
                wx.navigateTo({
                  url: '/pages/auth/index',
                });

                return;
            }
            // 3. 创建订单
            // 3.1 准备 请求头参数
            const header = { Authorization: token };
            // 3.2 准备 请求体参数
            const order_price = this.data.totalPrice;
            const consignee_addr = this.data.address.full;
            const cart = this.data.cart;
            let goods = [];
            cart.forEach(v=>goods.push({
                goods_id: v.goods_id,
                goods_number: v.num,
                goods_price: v.goods_price
            }));
            const orderParams = { order_price, consignee_addr, goods }
            // 4. 准备发送请求 创建订单  获取订单编号
            const res = await request({
                url: '/my/orders/create',
                method: 'post',
                data: orderParams
            });
            const {order_number} = res.data.message;
            // 5. 发起 预支付接口
            const readyPay = await request({
                url: '/my/orders/req_unifiedorder',
                method: 'post',
                data: {order_number}
            });
            const { pay } = readyPay.data.message;
            // 6. 发起微信支付
            // await requestPayment(pay);
            // 7. 查询订单状态
            const result = await request({
                url: '/my/orders/chkOrder',
                method: 'post',
                data: {order_number}
            });
            await showToast({title: '支付成功'});
            // 8. 手动删除缓存中 已经支付了的商品
            let newCart = wx.getStorageSync('cart');
            newCart = newCart.filter(v=>!v.checked);
            wx.setStorageSync('cart', newCart);
            // 8. 支付成功 跳转到订单页面
            wx.navigateTo({
              url: '/pages/order/index',
            })
        }catch(err){
            await showToast({title: '支付失败'});
            console.log(err);
        }
    }
})