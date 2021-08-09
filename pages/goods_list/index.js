import {request} from '../../request/index.js'
/*
    1. 用户上滑页面 滚动条触底 开始加载下一条数据
        1.找到滚动条触发事件 微信小程序开发文档中寻找
        2.判断还有没有下一页数据
            1.获取到总页数  只有总条数
                总页数 = Math.ceil(总条数 / 页容量)
            2.获取到当前的页码  pagenum
            3.判断一下 当前的页码是否大于等于 总页数
                表示 没有下一页数据
        3.假如没有下一页数据 弹出一个提示
        4.假如还有下一页数据 来加载下一页数据
            1. 当前的页码 ++
            2. 重新发送请求
            3. 数据请求回来 要对 data 中的数组进行拼接
    2. 下拉刷新页面
        1. 触发下拉刷新事件 需要在页面的 json 文件中添加一个配置
        2. 重置 数据 数组
        3. 重置页码 设置为1
        4. 重新发送请求
        5. 数据请求回来 需要手动关闭 等待效果
*/ 
Page({
    data: {
        tabs: [
            {
                id: 0,
                value: '综合'
            },            {
                id: 1,
                value: '销量'
            },            {
                id: 2,
                value: '价格'
            }
        ],
        currentIndex: 0,
        goodsList: []
    },
    // 接口需要的参数
    QueryParams:{
        query:"",
        cid:"",
        pagenum:1,
        pagesize:10
    },
    // 总页数
    totalPages:1,
    onLoad(options) {
        this.QueryParams.cid = options.cid||"";
        this.QueryParams.query = options.query||"";
        this.getGoodsList();
    },

    // 获取商品列表数据
    async getGoodsList(){
        const res = await request({url: '/goods/search', data: this.QueryParams});
        // 获取 总条数
        const total = res.data.message.total;
        // 计算 总页数
        this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
        this.setData({
            goodsList: [...this.data.goodsList,...res.data.message.goods]
        });
        // 关闭下拉刷新窗口 如果没有调用下拉刷新窗口 直接关闭也不会报错
        wx.stopPullDownRefresh();
    },

    // 标题点击事件 从子组件传递过来
    handleTabsItemChange(e){
        const {index} = e.detail;
        this.setData({
            currentIndex: index
        })
    },

    // 页面上滑 滚动条触底事件
    onReachBottom(){
        // 1. 判断还有没有下一页数据
        if(this.QueryParams.pagenum >= this.totalPages){
            // 没有下一页数据了
            // console.log('没有下一页');
            wx.showToast({
              title: '已经到底啦~',
            })
        }else{
            // 还有下一页数据
            // console.log('还有下一页');
            this.QueryParams.pagenum++;
            this.getGoodsList();
        }
    },
    // 下拉刷新事件
    onPullDownRefresh(){
        // 1. 重置数组
        this.setData({
            goodsList: []
        });
        // 2. 重置页码
        this.QueryParams.pagenum = 1;
        // 3. 发送请求
        this.getGoodsList();
    },
    setName(a,b){
        return a + b
    }
})