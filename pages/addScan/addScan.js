// pages/addScan/addScan.js
const app = getApp()
const util = require('../../utils/util.js')
const scanData = ({

  /**
   * 页面的初始数据
   */
  data: {
    showList: [],
    scancodetemp: [],
    batchId: '',
    status: '',
    codetemp: '',
    scanArea: [],
    showModal: false,
    logistics_number: '',
    batch_number: undefined,
    batchList: [],
    scancodetemp: []
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.batchId = options.id
    try {
      this.setData({
        showList: wx.getStorageSync('showList') || []
      })
    } catch (e) {
      console.log('showList is empty , filter is not a function')
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
    // try {
    //   this.setData({
    //     showList: wx.getStorageSync('showList') || []
    //   })
    // } catch (e) {
    //   console.log('showList is empty , filter is not a function')
    // }
    // function filterBatch(element) {
    //   return (element['id'] == this.batchId)
    // }
    // this.setData({
    //   showList: wx.getStorageSync('showList').filter(filterBatch) || []
    // })
    // this.setData({
    //   showList: wx.getStorageSync('showList') || []
    // })
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
  bindTask: function (e) {
    this.setData({
      logistics_number: e.detail.value
    })
  },
  bindBatchNumber: function (e) {
    this.setData({
      batch_number: e.detail.value
    })
  },
  addBatchNumber: function() {
    if (this.data.batch_number == undefined || this.data.batch_number.trim().length < 1) {
      wx.showToast({
        title: '请输入批次号',
        icon: 'none',
        duration: 1000
      })
      return
    }
    this.setData({
      batchList: []
    })
    console.log(this.data.batch_number)
    var that = this
    wx.request({
      // url: app.globalData.baseurl + '/admin/store_ins?batch_number=' + that.data.batch_number +'&status=7',
      url: app.globalData.baseurl + '/admin/store_ins?batch_number=' + that.data.batch_number + '&status=7',
      header: {
        'Authorization': wx.getStorageSync('id_token'),
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        if (res.data.code == 200) {
          if(res.data.count != 0) {
            for (let i = 0; i < Math.ceil(res.data.count / 20); i++) {
              that.getBatchNumbers(i+1)
            }
          }
          that.setData({
            batchList: that.data.batchList
          })
          if(res.data.data.length ==0) {
            wx.showModal({
              title: '提示',
              content: '暂无入库单',
              showCancel: false
            })
          }
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false
          })
        }
        console.log(that.data.batchList)
      },
    })
  },
  getBatchNumbers: function(page) {
    var that = this
    wx.request({
      // url: app.globalData.baseurl + '/admin/store_ins?page='+ page +'&batch_number=' + that.data.batch_number + '&status=7',
      url: app.globalData.baseurl + '/admin/store_ins?page=' + page + '&batch_number=' + that.data.batch_number + '&status=7',
      header: {
        'Authorization': wx.getStorageSync('id_token'),
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        if (res.data.code == 200) {
          that.data.batchList = that.data.batchList.concat(res.data.data)
          that.setData({
            batchList: that.data.batchList
          })
          // if (res.data.data.length == 0) {
          //   wx.showModal({
          //     title: '提示',
          //     content: '暂无入库单',
          //     showCancel: false
          //   })
          // }
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false
          })
        }
        console.log(that.data.batchList)
      },
    })
  },
  addLogisticsNumber: function() {
    if (this.data.logistics_number.trim().length < 1) {
      wx.showToast({
        title: '请输入物流单号',
        icon: 'none',
        duration: 1000
      })
      return
    }
    var that = this
    this.data.codetemp = this.data.logistics_number
    let productList = that.data.batchList
    if (1) {
      // temp2.push(this.data.codetemp)
      wx.setStorageSync('scancodetemp', temp)
      let tempTime = util.formatTime(new Date())
      wx.request({
        // url: app.globalData.baseurl + '/admin/store_ins/done_by_logistics_number',
        url: app.globalData.baseurl + '/admin/store_ins/done_by_logistics_number',
        data: {
          logistics_number: this.data.codetemp,
          date: tempTime
        },
        header: {
          'Authorization': wx.getStorageSync('id_token'),
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
          if (res.data.code == 200) {
            productList[productIndex]['status'] = 4
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false
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
  },
  filterBatchs: function(element) {
    return (element['id'] == this.data.batchId)
  },
  addScan: function(res) {
    var that = this
    try {
      wx.scanCode({
        success: (res) => {
          this.data.codetemp = res.result
          let batchList = that.data.batchList
          let resultIndex = undefined
          for(let i=0; i<batchList.length; i++) {
            if (batchList[i]['logistics_number'] == res.result) {
              resultIndex = i
              break
            }
          }
          console.log(resultIndex)
          // if (1) {
          //   let tempTime = util.formatTime(new Date())
          //   wx.request({
          //     url: app.globalData.baseurl + '/admin/store_ins/done_by_logistics_number',
          //     // url: 'https://warehouse.superspeedus.com/admin/store_ins/done_by_logistics_number',
          //     data: {
          //       logistics_number: res.result,
          //       date: tempTime
          //     },
          //     header: {
          //       'Authorization': wx.getStorageSync('id_token'),
          //     },
          //     method: 'POST',
          //     success: function(res) {
          //       if (res.data.code == 200) {
          //       } else {
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
  reupload: function(e) {
    let productIndex = e.currentTarget.dataset.productindex
    let productList = this.data.batchList
    let timetemp2 = util.formatTime(new Date())
    var that = this
    wx.request({
      // url: app.globalData.baseurl + '/admin/store_ins/done_by_logistics_number',
      url: app.globalData.baseurl + '/admin/store_ins/done_by_logistics_number',
      data: {
        logistics_number: productList[productIndex]['logistics_number'],
        date: timetemp2
      },
      header: {
        'Authorization': wx.getStorageSync('id_token'),
      },
      method: 'POST',
      success: function(res) {
        if (res.data.code == 200) {
          productList[productIndex]['status'] = 4
        } else {
          productList[productIndex]['status'] = 8
          wx.showModal({
            title: '出错啦',
            content: res.data.message,
            showCancel: false
          })
        }
        let temp = productList[productIndex]
        productList.splice(productIndex, 1)
        productList.unshift(temp)
        that.setData({
          batchList: productList
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
    let productList = this.data.showList
    productList[productIndex].xmove = xmove

    this.setData({
      showList: productList
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
    let productList = this.data.showList
    console.log(productList)

    function filterShowlist(element, index, array) {
      return (element['id'] == productList[productIndex]['id'])
    }
    let showListtemp = wx.getStorageSync("showList")
    let showListtemp2 = showListtemp.filter(filterShowlist)
    for (let i = 0; i < showListtemp2.length; i++) {
      if (showListtemp2[i]['scancode'] == productList[productIndex]['scancode']) {
        showListtemp2[i]['status'] = ""
        showListtemp2[i]['time'] = ""
        showListtemp2[i]['scancode'] = ""
        showListtemp2[i]['id'] = ""
      }
    }
    wx.setStorageSync("showList", showListtemp)
    let scancodetemp2 = wx.getStorageSync("scancodetemp")
    let scancodetemp3 = scancodetemp2.filter(filterShowlist)[0]['codes']
    if (scancodetemp3.indexOf(productList[productIndex]['scancode']) != -1) {
      scancodetemp3[scancodetemp3.indexOf(productList[productIndex]['scancode'])] = ""
    }
    wx.setStorageSync("scancodetemp", scancodetemp2)
    productList.splice(productIndex, 1)
    this.setData({
      showList: productList
    })
    // wx.setStorageSync("showList", productList)
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
      content: "确定入库吗？",
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
    console.log(this.data.scancodetemp)
    console.log(e.detail.result)
    if(this.data.scancodetemp.indexOf(e.detail.result) != -1) {
      return
    }
    this.data.scancodetemp.push(e.detail.result)
    let tempTime = util.formatTime(new Date())
    let batchList = this.data.batchList
    let resultIndex = undefined
    var that = this
    that.data.codetemp = e.detail.result
    for (let i = 0; i < batchList.length; i++) {
      if (batchList[i]['logistics_number'] == that.data.codetemp) {
        resultIndex = i
        break
      }
    }
    if(resultIndex == undefined) {
      wx.showToast({
        title: '请扫描正确的单号',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (1) {
      wx.request({
        // url: app.globalData.baseurl + '/admin/store_ins/done_by_logistics_number',
        url: app.globalData.baseurl + '/admin/store_ins/done_by_logistics_number',
        data: {
          logistics_number: batchList[resultIndex]['logistics_number'],
          date: tempTime
        },
        header: {
          'Authorization': wx.getStorageSync('id_token'),
        },
        method: 'POST',
        success: function(res) {
          console.log(res)
          if (res.data.code == 200) {
            batchList[resultIndex]['status'] = 4
          } else {
            batchList[resultIndex]['status'] = 8
            // wx.showModal({
            //   title: '提示',
            //   content: res.data.message,
            // })
          }
          let temp = batchList[resultIndex]
          batchList.splice(resultIndex, 1)
          batchList.unshift(temp)
          that.setData({
            batchList: batchList,
            scancodetemp: that.data.scancodetemp
          })
        },
      })
    } else {
      wx.showToast({
        title: '重复啦',
        icon: 'loading',
        duration: 1000
      })
    }
  },
  error: function(e) {
    console.log(e);
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

Page(scanData)