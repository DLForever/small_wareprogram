// pages/addScan/addScan.js
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
    logistics_number: ''
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.batchId = options.id
    try {
      this.setData({
        showList: wx.getStorageSync('showList').filter(this.filterBatchs) || []
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
  addLogisticsNumber: function() {
    if (this.data.logistics_number.trim().length < 1) {
      wx.showToast({
        title: '请输入物流单号',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    var that = this
    this.data.codetemp = this.data.logistics_number
    let showList = that.data.showList
    let temp = wx.getStorageSync('scancodetemp') || []
    let temp2 = temp.filter(this.filterBatchs)[0]['codes']
    let status = ""
    if (temp2.indexOf(this.data.codetemp) == -1) {
      temp2.push(this.data.codetemp)
      wx.setStorageSync('scancodetemp', temp)
      let tempTime = util.formatTime(new Date())
      wx.request({
        url: 'http://47.74.177.128:3000/admin/store_ins/done_by_logistics_number',
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
            status = "成功"
            showList.push({
              time: tempTime,
              scancode: that.data.codetemp,
              id: that.data.batchId,
              status: status
            })
            that.setData({
              showList: showList,
              logistics_number: ''
            })
            let showListTemp = wx.getStorageSync("showList") || []
            showListTemp.push(showList[showList.length - 1])
            wx.setStorageSync("showList", showListTemp)
          } else {
            status = "失败"
            showList.push({
              time: tempTime,
              scancode: that.data.codetemp,
              id: that.data.batchId,
              status: status
            })
            that.setData({
              showList: showList,
            })
            let showListTemp = wx.getStorageSync("showList") || []
            showListTemp.push(showList[showList.length - 1])
            wx.setStorageSync("showList", showListTemp)
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
          let showList = that.data.showList
          let temp = wx.getStorageSync('scancodetemp') || []
          let temp2 = temp.filter(this.filterBatchs)[0]['codes']
          let status = ""
          if (temp2.indexOf(res.result) == -1) {
            temp2.push(res.result)
            wx.setStorageSync('scancodetemp', temp)
            let tempTime = util.formatTime(new Date())
            wx.request({
              url: 'http://47.74.177.128:3000/admin/store_ins/done_by_logistics_number',
              data: {
                logistics_number: res.result,
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
                  showList.push({
                    time: tempTime,
                    scancode: that.data.codetemp,
                    id: that.data.batchId,
                    status: status
                  })
                  that.setData({
                    showList: showList,
                  })
                  let showListTemp = wx.getStorageSync("showList") || []
                  showListTemp.push(showList[showList.length - 1])
                  wx.setStorageSync("showList", showListTemp)
                } else {
                  status = "失败"
                  showList.push({
                    time: tempTime,
                    scancode: that.data.codetemp,
                    id: that.data.batchId,
                    status: status
                  })
                  that.setData({
                    showList: showList,
                  })
                  let showListTemp = wx.getStorageSync("showList") || []
                  showListTemp.push(showList[showList.length - 1])
                  wx.setStorageSync("showList", showListTemp)
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

        }
      })
    } catch (e) {
      console.log('scan stop')
    }

  },
  reupload: function(e) {
    let productIndex = e.currentTarget.dataset.productindex
    let productList = this.data.showList
    let timetemp2 = util.formatTime(new Date())
    console.log(productList[productIndex]['scancode'])

    function filterShowlist(element, index, array) {
      return (element['id'] == productList[productIndex]['id'])
    }
    var that = this
    wx.request({
      url: 'http://47.74.177.128:3000/admin/store_ins/done_by_logistics_number',
      data: {
        logistics_number: productList[productIndex]['scancode'],
        date: timetemp2
      },
      header: {
        'Authorization': wx.getStorageSync('id_token'),
      },
      method: 'POST',
      success: function(res) {
        let showListtemp = wx.getStorageSync("showList")
        let showListtemp2 = showListtemp.filter(filterShowlist)
        if (res.data.code == 200) {
          for (let i = 0; i < showListtemp2.length; i++) {
            if (showListtemp2[i]['scancode'] == productList[productIndex]['scancode']) {
              showListtemp2[i]['status'] = "成功"
              showListtemp2[i]['time'] = timetemp2
            }
          }
        } else {
          for (let i = 0; i < showListtemp2.length; i++) {
            if (showListtemp2[i]['scancode'] == productList[productIndex]['scancode']) {
              showListtemp2[i]['status'] = "失败"
              showListtemp2[i]['time'] = timetemp2
            }
          }
          wx.showModal({
            title: '出错啦',
            content: res.data.message,
            showCancel: false
          })
        }
        wx.setStorageSync("showList", showListtemp)
        that.setData({
          showList: wx.getStorageSync('showList').filter(that.filterBatchs) || []
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
      content: "确定重新入库吗？",
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
    let showList = this.data.showList
    let temp = wx.getStorageSync('scancodetemp') || []
    let temp2 = temp.filter(this.filterBatchs)[0]['codes']
    let status = ""
    var that = this
    if (temp2.indexOf(e.detail.result) == -1) {
      temp2.push(e.detail.result)
      wx.setStorageSync('scancodetemp', temp)
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
            showList.push({
              time: tempTime,
              scancode: that.data.codetemp,
              id: that.data.batchId,
              status: status
            })
            that.setData({
              showList: showList,
            })
            let showListTemp = wx.getStorageSync("showList") || []
            showListTemp.push(showList[showList.length - 1])
            wx.setStorageSync("showList", showListTemp)
          } else {
            status = "失败"
            showList.push({
              time: tempTime,
              scancode: that.data.codetemp,
              id: that.data.batchId,
              status: status
            })
            that.setData({
              showList: showList,
            })
            let showListTemp = wx.getStorageSync("showList") || []
            showListTemp.push(showList[showList.length - 1])
            wx.setStorageSync("showList", showListTemp)
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

Page(scanData)