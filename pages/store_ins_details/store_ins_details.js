// pages/store_ins_details/store_ins_details.js
const app = getApp()
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
    if (this.data.logistics_number.trim().length < 1) {
      wx.showToast({
        title: '请输入物流单号',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    var that = this
    wx.request({
      // url: app.globalData.baseurl + '/admin/store_ins/info',
      url: app.globalData.baseurl + '/admin/store_ins/info',
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
          that.hideModal();
          that.setData({
            logistics_number: ''
          })
        } else {
          wx.showModal({
            title: '出错啦',
            content: res.data.message,
            showCancel: false
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
          // url: app.globalData.baseurl + '/admin/store_ins/info',
          url: app.globalData.baseurl + '/admin/store_ins/info',
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
                title: '出错啦',
                content: res.data.message,
                showCancel: false
              })
            }
          }
        })
      }
    })
  },
  /**
   * 弹窗
   */
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () { },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.hideModal();
  }
})