// pages/addGroundingScan/addGroundingScan.js
const util = require('../../utils/util.js')
const app = getApp()
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
    amount: 0,
    fillamount: 0,
    isFnsku: 1,
    fnsku: undefined,
    fnskuList: [],
    selectAllStatus: false,
    batchList: [],
    wareList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.groundBatchId = options.id
    try {
      this.setData({
        groundingList: wx.getStorageSync('groundingList').filter(this.filterBatchs) || []
        // groundingList: wx.getStorageSync('groundingList') || []
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
    const index = e.currentTarget.dataset.productindex;
    let groundingList = this.data.groundingList;
    groundingList[index]['amount'] = Number(e.detail.value)
    for (let i = 0; i < groundingList.length; i++) {
      groundingList[i]['selected'] = false
    }
    this.setData({
      amount: e.detail.value,
      groundingList: groundingList,
      batchList: []
    })
  },
  bindFnsku: function (e) {
    this.setData({
      fnsku: e.detail.value
    })
  },
  filterBatchs: function(element) {
    element['selected'] = false
    return (element['groundingId'] != '')
  },
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let groundingList = this.data.groundingList;
    const selected = groundingList[index].selected;
    let temparr = []
    groundingList[index].selected = !selected;
    for (let i = 0; i < groundingList.length; i++) {
      if (groundingList[i].selected) {
        temparr.push(groundingList[i])
      }
    }
    // if(groundingList[index].selected) {
    //   for (let i = 0; i < groundingList.length; i++) {
    //     if (groundingList[i].selected) {
    //       temparr.push(groundingList[index])
    //     }
    //   }
    // }
    this.setData({
      groundingList: groundingList,
      batchList: temparr
    });
    console.log('bat')
    console.log(this.data.batchList)
  },
  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let groundingList = this.data.groundingList;
    let tempArr = []

    for (let i = 0; i < groundingList.length; i++) {
      groundingList[i].selected = selectAllStatus;
      if (groundingList[i].selected == true) {
        tempArr.push(groundingList[i])
      }
    }
    // if(selectAllStatus == false) {
    //   this.data.batchList = []
    // }
    this.setData({
      selectAllStatus: selectAllStatus,
      groundingList: groundingList,
      batchList: tempArr
    });
  },
  batchPutaway: function() {
    if(this.data.batchList.length ==0) {
      wx.showModal({
        title: '出错啦',
        content: '请选择fnsku',
        showCancel: false
      })
      return
    }
    for(let i=0; i<this.data.batchList.length; i++) {
      if(this.data.batchList[i]['warecode'] == '') {
        wx.showModal({
          title: '出错啦',
          content: '请扫描库位',
          showCancel: false
        })
        return
      }
    }
    console.log(this.data.batchList)
    let fnsku = []
    let ware_house_name = []
    let sum = []
    for(let i = 0; i < this.data.batchList.length; i++) {
      fnsku.push(this.data.batchList[i]['scancode'])
      ware_house_name.push(this.data.batchList[i]['warecode'])
      sum.push(this.data.batchList[i]['amount'])
    }
    // let productIndex = e.currentTarget.dataset.productindex
    // let productList = this.data.groundingList
    let timetemp2 = util.formatTime(new Date())
    // console.log(productList[productIndex]['scancode'])

    // function filterGroundinglist(element, index, array) {
    //   return (element['groundingId'] == productList[productIndex]['groundingId'])
    // }
    // let groundingListtemp = wx.getStorageSync("groundingList")
    // let groundingListtemp2 = groundingListtemp.filter(filterGroundinglist)[0]
    var that = this
    // console.log('that.data.amount:')
    // console.log(productList)
    wx.request({
      // url: app.globalData.baseurl + '/admin/cargos/putaway_fnsku',
      url: app.globalData.baseurl + '/admin/cargos/putaway_fnsku',
      data: {
        fnsku: fnsku,
        ware_house_name: ware_house_name,
        sum: sum,
        date: util.formatTime(new Date())
      },
      header: {
        'Authorization': wx.getStorageSync('id_token'),
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (res.data.code == 200) {
          for(let i = 0; i<that.data.groundingList.length; i++) {
            if(that.data.groundingList[i]['selected']) {
              that.data.groundingList[i]['status'] = '成功'
              that.data.groundingList[i]['time'] = util.formatTime(new Date())
            }
          }
          wx.setStorageSync("groundingList", that.data.groundingList)
          that.setData({
            groundingList: wx.getStorageSync('groundingList').filter(that.filterBatchs) || [],
            batchList: []
          })
        } else {
          for (let i = 0; i < that.data.groundingList.length; i++) {
            if (that.data.groundingList[i]['selected']) {
              that.data.groundingList[i]['status'] = '失败'
            }
          }
          // app.showErrorModal(res.data.message, "提示")
          wx.showModal({
            title: '出错啦',
            content: res.data.message,
            showCancel: false
          })
        }
        // groundingListtemp2['amount'] = that.data.amount
        wx.setStorageSync("groundingList", that.data.groundingList)
        that.setData({
          groundingList: wx.getStorageSync('groundingList') || []
        })
      }
    })
  },
  addFnsku: function() {
    if (this.data.fnsku == undefined || this.data.fnsku.trim().length < 1) {
      wx.showToast({
        title: '请输入Fnsku',
        icon: 'none',
        duration: 1000
      })
      return
    }
    console.log(this.data.fnsku)
    this.data.codetemp = this.data.fnsku
    var that = this
    wx.request({
      // url: app.globalData.baseurl + '/admin/cargos/search_by_fnsku?query=' + that.data.fnsku,
      url: app.globalData.baseurl + '/admin/cargos/search_by_fnsku?query=' + this.data.fnsku,
      // data: {
      //   query: this.data.fnsku
      // },
      header: {
        'Authorization': wx.getStorageSync('id_token'),
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code == 200) {
          that.data.isFnsku = 1
          res.data.data.forEach((data) => {
            if (data.fnsku == that.data.codetemp) {
              that.data.fillamount = data.arrive_sum
              that.data.isFnsku = 0
              that.data.wareList = data.cargo_ware_houses
            }
          })
          console.log(123)
          console.log(that.data.isFnsku)
          if (that.data.isFnsku) {
            wx.showModal({
              title: '出错啦',
              content: '请提供正确的fnsku',
              showCancel: false
            })
            that.setData({
              wareList: []
            })
            return
          }
          let groundingList = that.data.groundingList
          let temp = wx.getStorageSync('groundingcodetemp') || []
          // let temp2 = temp.filter(that.filterBatchs)[0]['codes']
          let status = ""
          if (wx.getStorageSync("groundingId") == 0) {
            wx.setStorageSync("groundingId", 1)
            that.data.groundingId = wx.getStorageSync("groundingId")
            console.log('groundingId:' + that.data.groundingId)
          } else {
            that.data.groundingId = wx.getStorageSync("groundingId") + 1
            wx.setStorageSync("groundingId", that.data.groundingId)
            console.log('groundingId2:' + that.data.groundingId)
          }
          groundingList.push({
            time: '',
            scancode: that.data.codetemp,
            id: that.data.groundBatchId,
            groundingId: that.data.groundingId,
            status: '待上架',
            warecode: that.data.warecode,
            amount: that.data.fillamount,
            selected: false
          })
          that.setData({
            groundingList: groundingList,
            wareList: that.data.wareList
          })
          let groundingListTemp = wx.getStorageSync("groundingList") || []
          groundingListTemp.push(groundingList[groundingList.length - 1])
          wx.setStorageSync("groundingList", groundingListTemp)
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
  addScan: function(res) {
    // let productIndex = res.currentTarget.dataset.productindex
    // let productList = this.data.groundingList
    // console.log('id:' + productList['scancode'])
    var that = this
    try {
      wx.scanCode({
        success: (res) => {
          console.log(res.result)
          this.data.codetemp = res.result
          that.data.fillamount = 0
          wx.request({
            // url: app.globalData.baseurl + '/admin/cargos/search_by_fnsku?query=' + res.result,
            url: app.globalData.baseurl + '/admin/cargos/search_by_fnsku?query=' + res.result,
            // data: {
            //   query: res.result
            // },
            header: {
              'Authorization': wx.getStorageSync('id_token'),
            },
            method: 'GET',
            success: function (res) {
              if (res.data.code == 200) {
                that.data.isFnsku = 1
                res.data.data.forEach((data) => {
                  if(data.fnsku == that.data.codetemp) {
                    that.data.fillamount = data.arrive_sum
                    that.data.isFnsku = 0
                    that.data.wareList = data.cargo_ware_houses
                  }
                })
                
                if(that.data.isFnsku) {
                  wx.showModal({
                    title: '出错啦',
                    content: '请提供正确的fnsku',
                    showCancel: false
                  })
                  that.setData({
                    wareList: []
                  })
                  return
                }
                let groundingList = that.data.groundingList
                let temp = wx.getStorageSync('groundingcodetemp') || []
                // let temp2 = temp.filter(that.filterBatchs)[0]['codes']
                let status = ""
                if (wx.getStorageSync("groundingId") == 0) {
                  wx.setStorageSync("groundingId", 1)
                  this.data.groundingId = wx.getStorageSync("groundingId")
                  console.log('groundingId:' + that.data.groundingId)
                } else {
                  that.data.groundingId = wx.getStorageSync("groundingId") + 1
                  wx.setStorageSync("groundingId", that.data.groundingId)
                  console.log('groundingId2:' + that.data.groundingId)
                }
                groundingList.push({
                  time: '',
                  scancode: that.data.codetemp,
                  id: that.data.groundBatchId,
                  groundingId: that.data.groundingId,
                  status: '待上架',
                  warecode: that.data.warecode,
                  amount: that.data.fillamount
                })
                that.setData({
                  groundingList: groundingList,
                  wareList: that.data.wareList
                })
                let groundingListTemp = wx.getStorageSync("groundingList") || []
                groundingListTemp.push(groundingList[groundingList.length - 1])
                wx.setStorageSync("groundingList", groundingListTemp)
              } else {
                wx.showModal({
                  title: '出错啦',
                  content: res.data.message,
                  showCancel: false
                })
              }
            }
          })
          // this.data.codetemp = res.result
          // let groundingList = that.data.groundingList
          // let temp = wx.getStorageSync('groundingcodetemp') || []
          // let temp2 = temp.filter(this.filterBatchs)[0]['codes']
          // let status = ""
          // if (wx.getStorageSync("groundingId") == 0) {
          //   wx.setStorageSync("groundingId", 1)
          //   this.data.groundingId = wx.getStorageSync("groundingId")
          //   console.log('groundingId:' + this.data.groundingId)
          // } else {
          //   this.data.groundingId = wx.getStorageSync("groundingId") + 1
          //   wx.setStorageSync("groundingId", this.data.groundingId)
          //   console.log('groundingId2:' + this.data.groundingId)
          // }
          // groundingList.push({
          //   time: '',
          //   scancode: that.data.codetemp,
          //   id: that.data.groundBatchId,
          //   groundingId: that.data.groundingId,
          //   status: '待上架',
          //   warecode: that.data.warecode,
          //   amount: that.data.fillamount
          // })
          // console.log('lll')
          // that.setData({
          //   groundingList: groundingList,
          // })
          // let groundingListTemp = wx.getStorageSync("groundingList") || []
          // groundingListTemp.push(groundingList[groundingList.length - 1])
          // wx.setStorageSync("groundingList", groundingListTemp)
          // if (temp2.indexOf(res.result) == -1) {
          //   temp2.push(res.result)
          //   wx.setStorageSync('groundingcodetemp', temp)
          //   let tempTime = util.formatTime(new Date())
          //   wx.request({
          //     url: 'https://warehouse.superspeedus.com/admin/store_ins/done_by_logistics_number',
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
    try {
      wx.scanCode({
        success: (res) => {
          productList[productIndex]['warecode'] = res.result
          for (let i = 0; i < productList.length; i++) {
            productList[i]['selected'] = false
          }
          this.setData({
            groundingList: productList,
            batchList: []
          })
          wx.setStorageSync("groundingList", this.data.groundingList)
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
    if (productList[productIndex]['warecode'] == '') {
      wx.showModal({
        title: '出错啦',
        content: '请扫描库位',
        showCancel: false
      })
      return
    }
    console.log(productList[productIndex]['scancode'])
    let fnsku = []
    let ware_house_name = []
    let sum = []
    fnsku.push(productList[productIndex]['scancode'])
    ware_house_name.push(productList[productIndex]['warecode'])
    sum.push(productList[productIndex]['amount'])
    // function filterGroundinglist(element, index, array) {
    //   return (element['groundingId'] == productList[productIndex]['groundingId'])
    // }
    // let groundingListtemp = wx.getStorageSync("groundingList")
    // let groundingListtemp2 = groundingListtemp.filter(filterGroundinglist)[0]
    var that = this
    console.log('that.data.amount:')
    console.log(productList)
    wx.request({
      // url: app.globalData.baseurl + '/admin/cargos/putaway_fnsku',
      url: app.globalData.baseurl + '/admin/cargos/putaway_fnsku',
      data: {
        fnsku: fnsku,
        ware_house_name: ware_house_name,
        sum: sum,
        date: util.formatTime(new Date())
      },
      header: {
        'Authorization': wx.getStorageSync('id_token'),
      },
      method: 'POST',
      success: function(res) {
        if (res.data.code == 200) {
          productList[productIndex]['status'] = "成功"
          productList[productIndex]['time'] = util.formatTime(new Date())
        } else {
          productList[productIndex]['status'] = "失败"
          // app.showErrorModal(res.data.message, "提示")
          wx.showModal({
            title: '出错啦',
            content: res.data.message,
            showCancel: false
          })
        }
        // groundingListtemp2['amount'] = that.data.amount
        // wx.setStorageSync("groundingList", groundingListtemp)
        wx.setStorageSync("groundingList", that.data.groundingList)
        that.setData({
          groundingList: productList
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
        // url: app.globalData.baseurl + '/admin/store_ins/done_by_logistics_number',
        url: app.globalData.baseurl + '/admin/store_ins/done_by_logistics_number',
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