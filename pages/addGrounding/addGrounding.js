// pages/addGrounding/addGrounding.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groundingBatchList: [],
    groundingcodetemp: [],
    groundBatchId: 0,
    task: '',
    tipsHidden: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      groundingBatchList: wx.getStorageSync('groundingBatchList') || []
    })
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
    this.onLoad()
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
  toHideTips: function () {
    this.setData({
      tipsHidden: true
    });
  },
  toShowTips: function () {
    this.setData({
      tipsHidden: false
    });
  },
  bindTask: function (e) {
    this.setData({
      task: e.detail.value
    })
  },
  batchdetail: function (event) {
    console.log(event.currentTarget.id)
    wx.navigateTo({
      url: "/pages/addGroundingScan/addGroundingScan?id=" + event.currentTarget.id,
    })
  },
  toCreate: function () {
    if (wx.getStorageSync("groundBatchId") == 0) {
      wx.setStorageSync("groundBatchId", 1)
      this.data.groundBatchId = wx.getStorageSync("groundBatchId")
      console.log('batch:' + this.data.groundBatchId)
    } else {
      this.data.groundBatchId = wx.getStorageSync("groundBatchId") + 1
      wx.setStorageSync("groundBatchId", this.data.groundBatchId)
      console.log('batch2:' + this.data.groundBatchId)
    }
    let groundingBatchList = this.data.groundingBatchList;
    let groundingcodetemp = wx.getStorageSync('groundingcodetemp') || []
    if (this.data.task.trim().length < 1) {
      this.toShowTips();
    } else {
      groundingBatchList.unshift({
        text: this.data.task,
        id: this.data.groundBatchId,
        time: util.formatTime(new Date())
      });
      groundingcodetemp.unshift({
        codes: [],
        id: this.data.groundBatchId
      });
      this.setData({
        task: '',
        groundingBatchList: groundingBatchList
      });
      wx.setStorageSync('groundingBatchList', groundingBatchList);
      wx.setStorageSync('groundingcodetemp', groundingcodetemp);
    }
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
    let productList = this.data.groundingBatchList
    productList[productIndex].xmove = xmove

    this.setData({
      groundingBatchList: productList
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
    let productList = this.data.groundingBatchList

    productList.splice(productIndex, 1)

    this.setData({
      groundingBatchList: productList
    })
    wx.setStorageSync("groundingBatchList", productList)
    if (productList[productIndex]) {
      this.setXmove(productIndex, 0)
    }
  },
  delet: function (e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: "确定删除吗?",
      success: function (res) {
        if (res.confirm) {
          that.handleDeleteProduct(e)
        }
      }
    })
  }
})