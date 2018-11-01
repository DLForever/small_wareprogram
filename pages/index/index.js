//index.js
//获取应用实例
const util = require('../../utils/util.js')
const app = getApp()

const pageData = {
  data: {
    motto: 'Hello World',
    userInfo: {},
    show: '',
    taskList: [],
    task: '',
    batchId: 0,
    tipsHidden: true,
    hasUserInfo: false,
    showModal: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onShow: function() {
    this.onLoad()
    // this.setData({
    //   taskList: wx.getStorageSync('taskList') || []
    // })
  },
  onLoad: function() {
    this.setData({
      taskList: wx.getStorageSync('taskList') || []
    })
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true,
    //     taskList: wx.getStorageSync('taskList') || []
    //   })
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true,
    //       taskList: wx.getStorageSync('taskList') || []
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true,
    //         taskList: wx.getStorageSync('taskList') || []
    //       })
    //     }
    //   })
    // }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  scan: function(res) {
    wx.scanCode({
      success: (res) => {
        this.show = res.result
        this.setData({
          show: this.show
        })
        console.log(res)
      }
    })
  },
  bindTask: function(e) {
    this.setData({
      task: e.detail.value
    })
  },
  toCreate: function() {
    if (this.data.task.trim().length < 1) {
      this.toShowTips();
      return
    }
    if (wx.getStorageSync("batchId") == 0) {
      wx.setStorageSync("batchId", 1)
      this.data.batchId = wx.getStorageSync("batchId")
      console.log('batch:' + this.data.batchId)
    } else {
      this.data.batchId = wx.getStorageSync("batchId") + 1
      wx.setStorageSync("batchId", this.data.batchId)
      console.log('batch2:' + this.data.batchId)
    }
    let taskList = this.data.taskList;
    let scancodetemp = wx.getStorageSync('scancodetemp') || []
    if (this.data.task.trim().length < 1) {
      this.toShowTips();
    } else {
      taskList.unshift({
        text: this.data.task,
        id: this.data.batchId,
        time: util.formatTime(new Date())
      });
      scancodetemp.unshift({
        codes: [],
        id: this.data.batchId
      });
      this.setData({
        task: '',
        taskList: taskList
      });
      wx.setStorageSync('taskList', taskList);
      wx.setStorageSync('scancodetemp', scancodetemp);
      this.hideModal();
    }
  },
  batchdetail: function(event) {
    console.log(event.currentTarget.id)
    wx.navigateTo({
      url: "/pages/addScan/addScan?id=" + event.currentTarget.id,
    })
  },
  editList: function() {
    console.log('lyh')
  },
  toHideTips: function() {
    this.setData({
      tipsHidden: true
    });
  },
  toShowTips: function() {
    this.setData({
      tipsHidden: false
    });
  },
  /**
   * 显示删除按钮
   */
  showDeleteButton: function(e) {
    let productIndex = e.currentTarget.dataset.productindex
    this.setXmove(productIndex, -65)
  },

  /**
   * 隐藏删除按钮
   */
  hideDeleteButton: function(e) {
    let productIndex = e.currentTarget.dataset.productindex

    this.setXmove(productIndex, 0)
  },
  /**
   * 设置movable-view位移
   */
  setXmove: function(productIndex, xmove) {
    let productList = this.data.taskList
    productList[productIndex].xmove = xmove

    this.setData({
      taskList: productList
    })
  },

  /**
   * 处理movable-view移动事件
   */
  handleMovableChange: function(e) {
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
  handleDeleteProduct: function(e) {
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
  },
  delet: function(e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: "确定删除吗？",
      success: function(res) {
        if (res.confirm) {
          that.handleDeleteProduct(e)
        }
      }
    })
  },
  /**
   * 弹窗
   */
  showDialogBtn: function() {
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {},
  /**
   * 隐藏模态对话框
   */
  hideModal: function() {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function() {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function() {
    this.hideModal();
  }
}

Page(pageData)