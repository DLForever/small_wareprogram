// pages/addGroundingScan/addGroundingScan.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groundingList: [],
    groundingcodetemp: [],
    groundBatchId: '',
    groundingId: 0,
    warecode: '',
    status: '',
    codetemp: '',
    warecodetemp: '',
    scanArea: [],
    listtemp: [],
    amount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.groundBatchId = options.id
    try {
      this.setData({
        groundingList: wx.getStorageSync('groundingList').filter(this.filterBatchs) || []
      })
    } catch (e) {
      console.log('groundingList is empty , filter is not a function')
    }
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

  },
  handelInput: function(e) {
    this.setData({
      amount: e.detail.value
    })
  },
  filterBatchs: function(element) {
    return (element['id'] == this.data.groundBatchId)
  },
  addScan: function(res) {
    // let productIndex = res.currentTarget.dataset.productindex
    // let productList = this.data.groundingList
    // console.log('id:' + productList['scancode'])
    var that = this
    try {
      wx.scanCode({
        success: (res) => {
          this.data.codetemp = res.result
          let groundingList = that.data.groundingList
          let temp = wx.getStorageSync('groundingcodetemp') || []
          let temp2 = temp.filter(this.filterBatchs)[0]['codes']
          let status = ""
          if (wx.getStorageSync("groundingId") == 0) {
            wx.setStorageSync("groundingId", 1)
            this.data.groundingId = wx.getStorageSync("groundingId")
            console.log('groundingId:' + this.data.groundingId)
          } else {
            this.data.groundingId = wx.getStorageSync("groundingId") + 1
            wx.setStorageSync("groundingId", this.data.groundingId)
            console.log('groundingId2:' + this.data.groundingId)
          }
          groundingList.push({
            time: '',
            scancode: that.data.codetemp,
            id: that.data.groundBatchId,
            groundingId: that.data.groundingId,
            status: '待上架',
            warecode: that.data.warecode,
            amount: 0
          })
          that.setData({
            groundingList: groundingList,
          })
          let groundingListTemp = wx.getStorageSync("groundingList") || []
          groundingListTemp.push(groundingList[groundingList.length - 1])
          wx.setStorageSync("groundingList", groundingListTemp)
          // if (temp2.indexOf(res.result) == -1) {
          //   temp2.push(res.result)
          //   wx.setStorageSync('groundingcodetemp', temp)
          //   let tempTime = util.formatTime(new Date())
          //   wx.request({
          //     url: 'http://47.74.177.128:3000/admin/store_ins/done_by_logistics_number',
          //     data: {
          //       logistics_number: res.result,
          //       date: tempTime
          //     },
          //     header: {
          //       'Authorization': wx.getStorageSync('id_token'),
          //     },
          //     method: 'POST',
          //     success: function (res) {
          //       console.log(res)
          //       if (res.data.code == 200) {
          //         status = "成功"
          //         groundingList.push({
          //           time: tempTime,
          //           scancode: that.data.codetemp,
          //           id: that.data.groundBatchId,
          //           status: status
          //         })
          //         that.setData({
          //           groundingList: groundingList,
          //         })
          //         let groundingListTemp = wx.getStorageSync("groundingList") || []
          //         groundingListTemp.push(groundingList[groundingList.length - 1])
          //         wx.setStorageSync("groundingList", groundingListTemp)
          //       } else {
          //         status = "失败"
          //         groundingList.push({
          //           time: tempTime,
          //           scancode: that.data.codetemp,
          //           id: that.data.groundBatchId,
          //           status: status
          //         })
          //         that.setData({
          //           groundingList: groundingList,
          //         })
          //         let groundingListTemp = wx.getStorageSync("groundingList") || []
          //         groundingListTemp.push(groundingList[groundingList.length - 1])
          //         wx.setStorageSync("groundingList", groundingListTemp)
          //         wx.showModal({
          //           title: '提示',
          //           content: res.data.message,
          //         })
          //       }
          //     },
          //   })

          // } else {
          //   wx.showToast({
          //     title: '重复啦',
          //     icon: 'loading',
          //     duration: 1000
          //   })
          // }
        }
      })
    } catch (e) {
      console.log('scan stop')
    }

  },
  /**
   * 扫描库位
   */
  addWareScan: function(res) {
    let productIndex = res.currentTarget.dataset.productindex
    let productList = this.data.groundingList

    function filterGroundinglist(element, index, array) {
      return (element['groundingId'] == productList[productIndex]['groundingId'])
    }
    var that = this
    try {
      wx.scanCode({
        success: (res) => {
          that.data.warecodetemp = res.result
          let groundingListtemp = wx.getStorageSync("groundingList")
          let groundingListtemp2 = groundingListtemp.filter(filterGroundinglist)[0]
          groundingListtemp2['warecode'] = that.data.warecodetemp
          wx.setStorageSync("groundingList", groundingListtemp)
          that.setData({
            groundingList: wx.getStorageSync('groundingList').filter(that.filterBatchs) || []
          })
        }
      })
    } catch (e) {
      console.log('scan stop')
    }

  },
  reupload: function(e) {
    let productIndex = e.currentTarget.dataset.productindex
    let productList = this.data.groundingList
    let timetemp2 = util.formatTime(new Date())
    console.log(productList[productIndex]['scancode'])

    function filterGroundinglist(element, index, array) {
      return (element['groundingId'] == productList[productIndex]['groundingId'])
    }
    let groundingListtemp = wx.getStorageSync("groundingList")
    let groundingListtemp2 = groundingListtemp.filter(filterGroundinglist)[0]
    var that = this
    wx.request({
      url: 'http://47.74.177.128:3000/admin/cargos/putaway_fnsku',
      data: {
        fnsku: groundingListtemp2['scancode'],
        ware_house_id: groundingListtemp2['warecode'],
        sum: that.data.amount,
        date: util.formatTime(new Date())
      },
      header: {
        'Authorization': wx.getStorageSync('id_token'),
      },
      method: 'POST',
      success: function(res) {
        if (res.data.code == 200) {
          groundingListtemp2['status'] = "成功"
          groundingListtemp2['time'] = util.formatTime(new Date())
        } else {
          groundingListtemp2['status'] = "失败"
          // app.showErrorModal(res.data.message, "提示")
          wx.showModal({
            title: '出错啦',
            content: res.data.message,
            showCancel: false
          })
        }
        groundingListtemp2['amount'] = that.data.amount
        wx.setStorageSync("groundingList", groundingListtemp)
        that.setData({
          groundingList: wx.getStorageSync('groundingList').filter(that.filterBatchs) || []
        })
      }
    })
  },
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
    let productList = this.data.groundingList
    productList[productIndex].xmove = xmove

    this.setData({
      groundingList: productList
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
    let productList = this.data.groundingList
    console.log(productList)

    function filterShowlist(element, index, array) {
      return (element['groundingId'] == productList[productIndex]['groundingId'])
    }
    let groundingListtemp = wx.getStorageSync("groundingList")
    let groundingListtemp2 = groundingListtemp.filter(filterShowlist)[0]
    groundingListtemp2['id'] = ""
    groundingListtemp2['scancode'] = ""
    groundingListtemp2['groundingId'] = ""
    groundingListtemp2['status'] = ""
    wx.setStorageSync("groundingList", groundingListtemp)
    productList.splice(productIndex, 1)
    this.setData({
      groundingList: productList
    })
    // wx.setStorageSync("groundingList", productList)
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
  upload: function(e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: "确定上架吗？",
      success: function(res) {
        if (res.confirm) {
          that.reupload(e)
        }
      }
    })
  },

  /**
   * 一维码扫描
   */
  scanHandler: function(e) {
    this.data.codetemp = e.detail.result
    let groundingList = this.data.groundingList
    let temp = wx.getStorageSync('groundingcodetemp') || []
    let temp2 = temp.filter(this.filterBatchs)[0]['codes']
    let status = ""
    var that = this
    if (temp2.indexOf(e.detail.result) == -1) {
      temp2.push(e.detail.result)
      wx.setStorageSync('groundingcodetemp', temp)
      let tempTime = util.formatTime(new Date())
      wx.request({
        url: 'http://47.74.177.128:3000/admin/store_ins/done_by_logistics_number',
        data: {
          logistics_number: e.detail.result,
          date: tempTime
        },
        header: {
          'Authorization': wx.getStorageSync('id_token'),
        },
        method: 'POST',
        success: function(res) {
          console.log(res)
          if (res.data.code == 200) {
            status = "成功"
            groundingList.push({
              time: tempTime,
              scancode: that.data.codetemp,
              id: that.data.groundBatchId,
              status: status
            })
            that.setData({
              groundingList: groundingList,
            })
            let groundingListTemp = wx.getStorageSync("groundingList") || []
            groundingListTemp.push(groundingList[groundingList.length - 1])
            wx.setStorageSync("groundingList", groundingListTemp)
          } else {
            status = "失败"
            groundingList.push({
              time: tempTime,
              scancode: that.data.codetemp,
              id: that.data.groundBatchId,
              status: status
            })
            that.setData({
              groundingList: groundingList,
            })
            let groundingListTemp = wx.getStorageSync("groundingList") || []
            groundingListTemp.push(groundingList[groundingList.length - 1])
            wx.setStorageSync("groundingList", groundingListTemp)
            wx.showModal({
              title: '提示',
              content: res.data.message,
            })
          }
        },
      })
    } else {
      wx.showToast({
        title: '重复啦',
        icon: 'loading',
        duration: 1000
      })
    }
    console.log(e.detail.result);
  },
  error: function(e) {
    console.log(e);
  },
})