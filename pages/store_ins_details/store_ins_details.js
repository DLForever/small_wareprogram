// pages/store_ins_details/store_ins_details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailsList: [],
    detailsList2: [],
    logistics_number: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindTask: function (e) {
    this.setData({
      logistics_number: e.detail.value
    })
  },
  addLogisticsNumber: function () {
    var that = this
    wx.request({
      url: 'http://47.74.177.128:3000/admin/store_ins/info',
      header: {
        'Authorization': wx.getStorageSync('id_token'),
      },
      data: {
        logistics_number: that.data.logistics_number
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code == 200) {
          console.log(res.data.data)
          that.setData({
            detailsList: [res.data.data],
            detailsList2: res.data.data.product_store_ins
          })
          that.setData({
            logistics_number: ''
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.message,
          })
        }
      }
    })
  },
  scanLogisticsNumber: function () {
    var that = this
    wx.scanCode({
      success: (res) => {
        wx.request({
          url: 'http://47.74.177.128:3000/admin/store_ins/info',
          header: {
            'Authorization': wx.getStorageSync('id_token'),
          },
          data: {
            logistics_number: res.result
          },
          method: 'GET',
          success: function(res) {
            if(res.data.code == 200) {
              console.log(res.data.data)
              that.setData({
                detailsList: [res.data.data],
                detailsList2: res.data.data.product_store_ins
              })
              
            } else {
              wx.showModal({
                title: '提示',
                content: res.data.message,
              })
            }
          }
        })
      }
    })
  }
})