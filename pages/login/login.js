// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: '海外仓系统',
    userName: 'linzihao',
    userPassword: 'linzihao'
  },

  userNameInput: function(e) {
    this.setData({
      userName: e.detail.value
    })
  },
  userPasswordInput: function(e) {
    this.setData({
      userPassword: e.detail.value
    })
  },
  logIn: function() {
    var that = this
    wx.request({
      url: 'http://47.74.177.128:3000/admin/authentication',
      data: {
        username: this.data.userName,
        password: this.data.userPassword,
      },
      method: 'POST',
      success: function(res) {
        // that.setData({
        //   responseData: res.data.result[0].body
        // });
        wx.setStorage({
          key: "responseData",
          data: that.data.responseData
        });
        try {
          wx.setStorageSync('id_token', res.data.data.token)
          console.log(wx.getStorageSync('id_token'))
        } catch (e) {
          console.log('there is no id_token')
        }
        if (res.data.code == 200) {
          wx.redirectTo({
            url: '/pages/home/home',
          })
          // wx.switchTab({
          //   url: '../index/index'
          // })
        } else {
          wx.showToast({
            title: '密码错误',
            icon: 'loading',
            duration: 1000
          })
        }
        console.log(res.data);
      },
      fail: function(res) {
        console.log(res);
        console.log('is failed')
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})