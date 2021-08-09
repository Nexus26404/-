// pages/collect/index.js
Page({
    data: {
        tabs: [{
                id: 0,
                value: '商品收藏'
            },{
                id: 1,
                value: '品牌收藏'
            },{
                id: 2,
                value: '店铺收藏'
            },{
                id: 3,
                value: '浏览足迹'
        }],
        currentIndex: 0,
        collect: []
    },
    handleTabsItemChange(e){
        const {index} = e.detail;
        this.setData({
            currentIndex: index
        })
    },
    onShow(){
        const collect = wx.getStorageSync('collect')||[];
        this.setData({
            collect
        });
    }
})