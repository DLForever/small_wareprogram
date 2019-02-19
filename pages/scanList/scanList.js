// pages/scanList/scanList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskList: []
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let batchId = options.id
    console.log(batchId)
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
    // this.getData()
    this.setData({
      taskList: wx.getStorageSync('taskList') || []
    })
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

  },

  getData: function() {
    console.log(wx.getStorageSync('id_token'))
    var that = this
    wx.request({
      // url: app.globalData.baseurl + '/admin/store_ins',
      url: app.globalData.baseurl + '/admin/store_ins',
      data: {

      },
      header: {
        'Authorization': wx.getStorageSync('id_token'),
      },
      method: 'GET',
      success: function(res) {
        that.setData({
          taskList: res.data.data
        })
        console.log(res.data.data)
      },
      fail: function(res) {
        console.log(res.data);
        console.log('is failed')
      }
    })
  },
  batchdetail: function(event) {
    console.log(event.currentTarget.id)
    wx.navigateTo({
      url: "/pages/addScan/addScan?id=" + event.currentTarget.id,
    })
  },
  /**
 * 显示删除按钮
 */
  showDeleteButton: function (e) {
    let productIndex = e.currentTarget.dataset.productindex
    this.setXmove(productIndex, -65)
  },

  /**
   * 隐藏删除按钮
   */
  hideDeleteButton: function (e) {
    let productIndex = e.currentTarget.dataset.productindex

    this.setXmove(productIndex, 0)
  },
  /**
  * 设置movable-view位移
  */
  setXmove: function (productIndex, xmove) {
    let productList = this.data.taskList
    productList[productIndex].xmove = xmove

    this.setData({
      taskList: productList
    })
  },

  /**
   * 处理movable-view移动事件
   */
  handleMovableChange: function (e) {
    if (e.detail.source === 'friction') {
      if (e.detail.x < -30) {
        this.showDeleteButton(e)
      } else {
        this.hideDeleteButton(e)
      }
    } else if (e.detail.source === 'out-of-bounds' && e.detail.x === 0) {
      this.hideDeleteButton(e)
    }
  },
  /**
   * 删除产品
   */
  handleDeleteProduct: function (e) {
    let productIndex = e.currentTarget.dataset.productindex
    let productList = this.data.taskList

    productList.splice(productIndex, 1)

    this.setData({
      taskList: productList
    })
    wx.setStorageSync("taskList", productList)
    if (productList[productIndex]) {
      this.setXmove(productIndex, 0)
    }
  }
})