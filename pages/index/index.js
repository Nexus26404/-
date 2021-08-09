// 引入 用来发送请求的方法 一定要把路径补全
import {request} from "../../request/index.js";

wx-Page({
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航数组
    catesList: [],
    floorList: []
  },
  // 页面开始加载 就会触发
  onLoad(options){
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },
  // 获取轮播图数据
  getSwiperList(){
    // 发送异步请求获取轮播图数据  优化的手段可以通过 es6 的 promise 来解决这个问题
    // wx-wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     this.setData({
    //       swiperList: result.data.message
    //     })
    //   }
    // })
    request({url: "/home/swiperdata"}).then(result => {
      let swiperList = result.data.message;
      swiperList.forEach(v=>{
        v.navigator_url = v.navigator_url.replace('/main', '/index');
      })
      this.setData({
        swiperList
      })
    })
  },
  // 获取分类导航数据
  getCateList(){
    request({url: "/home/catitems"}).then(result => {
      this.setData({
        catesList: result.data.message
      })
    })
  },
  // 获取楼层数据
  getFloorList(){
    request({url: "/home/floordata"}).then(result => {
      let floorList = result.data.message;
      floorList.forEach(v=>{
        v.product_list.forEach(i=>{
          i.navigator_url = i.navigator_url.replace('list', 'list/index');
        })
      })
      this.setData({
        floorList
      })
    })
  },
  // 点击转发按钮时触发
  onShareAppMessage(){
    return{
      title: '黑心优购',
      path: '/pages/index/index'
    }
  }
})