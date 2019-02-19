const baseURL = ''
const http = ({url, data, method, ...other} = {}) => {
  //添加请求加载等待
  wx.showLoading({
    title: '加载中...',
  })
  //Promise 封装处理
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseURL+url,
      data: data,
      //获取请求头配置
      header: {
        'content-type': 'application/json'
      },
      method: method,
      ...other,
      //成功或失败处理
      complete: (res) => {
        //关闭等待
        wx.hideLoading()
        //进行状态码判断并处理
        if(res.data.code === 204){
          resolve(res)
        }else if (res.data.code !== 200){
          let title = res.data.message
          showToast(title)
        }else if(res.data.code == 200){
          resolve(res)
        }else{
          reject(res)
        }
      }
    })
  })
}

const showToast = title => {
  wx.showToast({
    title: title,
    icon: 'none',
    duration: 1500,
    mask: true
  })
}

const getUrl = (url) => {
  if(url.indexOf('://') == -1) {
    url = baseURL + url
  }
  return url
}