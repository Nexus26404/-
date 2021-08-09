import {request} from '../../request/index.js';
/*
    1. 点击轮播图 预览大图
        1. 给轮播图绑定点击事件
        2. 调用小程序的api   previewImage
    2. 点击加入购物车
        1. 绑定点击事件
        2. 获取缓存中的购物车数据 数组格式
        3. 先判断一下 当前的商品是否已经存在于 购物车
        4. 已经存在 修改商品数据  执行购物车数量 ++ 重新把购物车数组 填充回缓存中
        5. 不存在于购物车的数组中 直接给购物车数组添加一个新元素 新元素 带上 购买数量属性 num
        6. 弹出提示
    3. 商品收藏
        1. 页面 onShow 的时候  加载缓存中的商品收藏数据
        2. 判断当前商品是否被收藏
            1. 是 改变页面的图标
            2. 不是
        3. 点击商品 收藏按钮
            1. 判断该商品是否存在于缓存数组中
            2. 已经存在 删除该商品
            3. 没有存在 把商品添加到收藏数组中 存入到缓存中
*/ 
Page({
    data: {
        goodsObj: {},
        isCollect: false
    },
    // 商品对象
    GoodsInfo: {},
    onShow() {
        let pages = getCurrentPages();
        let currentPages = pages[pages.length-1];
        let options = currentPages.options;
        const {goods_id} = options;
        this.getGoodsDetail(goods_id);
    },
    // 获取商品的详情数据
    async getGoodsDetail(goods_id){
        const res = await request({url:"/goods/detail", data:{goods_id}});
        this.GoodsInfo = res.data.message;
        // 1. 获取缓存中的商品收藏数组
        let collect = wx.getStorageSync('collect')||[];
        // 2. 判断当前商品是否被收藏
        let isCollect = collect.some(v=>v.goods_id === this.GoodsInfo.goods_id);
        const obj = res.data.message;
        this.setData({
            goodsObj: {
                goods_name: obj.goods_name,
                goods_price: obj.goods_price,
                // iphone 部分手机 不识别 webp 图片格式
                // 最好找到后台 进行修改
                // 临时自己改 确保后台存在 1.webp => 1.jpg
                goods_introduce: obj.goods_introduce.replace(/\.webp/g, '.jpg'),
            pics: obj.pics
            },
            isCollect
        })
    },
    // 点击轮播图 放大预览
    handlePreview(e){
        // 1. 先构造要预览的图片数组
        const urls = this.GoodsInfo.pics.map(v=>v.pics_mid);
        // 2. 接收传递过来的图片url
        const current = e.currentTarget.dataset.url;
        wx.previewImage({
          urls,
          current
        })
    },
    // 点击 加入购物车
    handleCartAdd(){
        // 1. 获取缓存中的 购物车数组
        let cart = wx.getStorageSync("cart")||[];
        // 2. 判断 商品对象是否存在于购物车数组中
        let index = cart.findIndex(v=>v.goods_id === this.GoodsInfo.goods_id);
        if(index === -1){
            // 3. 不存在 第一次添加
            this.GoodsInfo.num = 1;
            this.GoodsInfo.checked = true;
            cart.push(this.GoodsInfo);
        }else{
            // 4. 已经存在的购物车数据 执行 num++
            cart[index].num++;
        }
        // 5. 把购物车重新添加回缓存中
        wx.setStorageSync("cart", cart);
        // 6. 弹窗提示
        wx.showToast({
          title: '加入购物车成功',
          icon: 'success',
          // mask 防止用户手抖
          mask: true
        })
    },
    // 点击商品收藏图标
    handleCollect(){
        let isCollect = false;
        // 1. 获取缓存中的商品收藏数组
        let collect = wx.getStorageSync('collect')||[];
        // 2. 判断该商品是否被收藏过
        let index = collect.findIndex(v=>v.goods_id === this.GoodsInfo.goods_id);
        // 3. 当 index !=-1 表示 已经收藏过
        if(index!=-1){
            // 能找到该商品 已经收藏过
            collect.splice(index, 1);
            isCollect = false;
            wx.showToast({
              title: '取消收藏',
              mask: true,
              icon: 'success'
            })
        }else{
            // 没有收藏过
            collect.push(this.GoodsInfo);
            isCollect = true;
            wx.showToast({
              title: '收藏成功',
              mask: true,
              icon: 'success'
            })
        }
        // 4. 把数组存入到缓存中
        wx.setStorageSync('collect', collect);
        // 5. 修改 data 中的属性  isCollect
        this.setData({isCollect});
    }
})