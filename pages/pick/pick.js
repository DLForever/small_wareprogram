// pages/pick/pick.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
  done_pick: function() {
    wx.scanCode({
      success: (res) => {
        console.log(res.result)
        wx.request({
          // url: app.globalData.baseurl + '/admin/outbound_orders/' + res.result.split('_')[1] + '/done_pick',
          url: app.globalData.baseurl + '/admin/outbound_orders/' + res.result.split('_')[1] + '/done_pick',
          header: {
            'Authorization': wx.getStorageSync('id_token'),
          },
          method: 'GET',
          success: function (res) {
            if (res.data.code == 200) {
              wx.showModal({
                title: '成功',
                content: "拣货成功!",
                showCancel: false
              })
            } else {
              wx.showModal({
                title: '提示',
                content: res.data.message,
                showCancel: false
              })
            }
          }
        })
      }
    })
  }
})