import {request} from '../../request/index.js';
Page({

    data: {
        // 左侧的菜单数据
        leftMenuList: [],
        // 右侧的商品数据
        rightContent: [],
        // 被选中的左侧菜单
        currentIndex: 0,
        // 右侧内容的滚动条距顶部距离
        scrollTop: 0
    },
    // 接口的返回数据
    Cates:[],

    onLoad: function (options) {
        // 先判断一下本地存储中有没有旧的数据
        // 没有旧数据 直接发送请求
        // 有旧的数据 同时 旧的数据没有过期 就直接使用本地存储中的旧数据即可
        const Cates = wx.getStorageSync("cates");
        // web: localStorage.setItem("key","value") localStorage.getItem("key")
            // web 中不管是什么类型的数据都会先调用 toString() 把数据变成字符串再存入
        // 小程序: wx.setStorageSync("key","value") wx.getStorageSync("key")
            // 小程序 不存在类型转换
        if(!Cates){
            // 不存在 发送请求获取数据
            this.getCates();
        }else{
            // 有旧的数据 定义过期时间 10s 改成 5min
            if(Date.now()-Cates.time>1000*300){
                // 重新发送请求
                this.getCates();
            }else{
                // 可以使用旧的数据
                this.Cates = Cates.data;
                let leftMenuList = this.Cates.map(v=>v.cat_name);
                let rightContent = this.Cates[0].children;
                this.setData({
                    leftMenuList,
                    rightContent
                })
            }
        }
    },
    // 获取分类
    async getCates(){
        // request({
        //     url: '/categories'
        // })
        // .then(res => {
        //     this.Cates = res.data.message

        const res = await request({url: '/categories'});
        this.Cates = res.data.message;
        // 把接口的数据存入到本地存储中
        wx.setStorageSync("cates", {time: Date.now(), data:this.Cates});
        // 构造左侧大菜单数据
        let leftMenuList = this.Cates.map(v=>v.cat_name);
        // 构造右侧的商品数据
        let rightContent = this.Cates[0].children;
        this.setData({
            leftMenuList,
            rightContent
        })
        // })
    },
    // 左侧菜单的点击事件
    handleItemTap(e){
        let {index} = e.currentTarget.dataset;
        let rightContent = this.Cates[index].children;
        this.setData({
            currentIndex: index,
            rightContent,
            // 重新设置 右侧内容的scroll-view标签的顶部距离
            scrollTop: 0
        });
    }
})