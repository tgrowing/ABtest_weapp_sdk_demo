// sdk 初始化
var abtest = null;
App({
  onLaunch() {
    this.sdk = {}
    // 登录
    wx.login({
      success: res => {
      }
    })
  },
  onShow() {
    console.log('appshow');
  },
  onHide() {
    console.log('apphide');
  },
  globalData: {
    userInfo: null,
  }
})
