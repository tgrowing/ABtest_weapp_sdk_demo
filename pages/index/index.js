// index.js
// 获取应用实例
const app = getApp();
const abtest = require('../../utils/tabc_sdk.wx.js');

Page({
  data: {
    userInfo: {},
    reportUrl: '',
    experimentUrl: '',
    appkey: '',
    eventCode: '',
    isTest:false,
    guid: '',
    expId: '',
    initStatus: app.globalData.abtest,
  },
  async initSDK() {
    const { appkey,isTest,reportUrl,experimentUrl,guid} = this.data;
    console.log("isTest",isTest)
    const self = this;
    const abtestStatus = await abtest.init({
      // 必填，应用的appkey
      appkey,
      // 选填 上报url，私有化必须填写！！！
      reportUrl,
      // 选填 拉取实验配置url，私有化必须填写！！！
      experimentUrl,
      //可选；用户id，传人一个用户身份，用来做分流标识
      guid,
      // 选填，isTest为true表示测试环境，默认为false
      isTest: isTest,
      onInit: function (data) {
        // init回调, 已经完成本地初始化，可以使用缓存的数据了
        console.log("onInit", data);
        self.setData({initStatus:true});
      },
      onNetData: function (data) {
        // 拉取网络策略回调，表示拿到最新的网络数据
        console.log("onNetData", data);
      },
    });
    if(abtestStatus){
      app.globalData.abtest = abtestStatus;
    }
  },
  async switchUser(){
    if(this.getInitStatus()){
      const {guid} = this.data;
      const status  = await abtest.switchUser(guid);
      if(status){
        wx.showToast({
          title: '切换id成功',
          icon: 'success',
        });
      }else{
        wx.showToast({
          title: '切换id失败',
          icon: 'error',
        });
      }
      console.log("status",status);
    }
  },
  getInitStatus(){
    // console.log("initStatus",initStatus);
    if(!app.globalData.abtest){
      wx.showToast({
        title: '请先初始化sdk',
        icon: 'error',
      });
    }
    return app.globalData.abtest;
  },
  getExpId(){
    const { expId } = this.data;
    console.log("expId",this.data.expId);
    if(!expId){
      wx.showToast({
        title: '请填写实验id',
        icon: 'error',
      });
    }
    return expId;
  },
  async reportExpData(){
    const { expId } = this.data;
    if(this.getInitStatus()&&this.getExpId()){
      const exp = await abtest.getExpByName(expId);
      console.log("exp",exp);
      // 上报实验曝光
      abtest.reportExpExpose(exp);
    }
  },
  async reportExpAndCodeData(){
    if(this.getInitStatus()&&this.getExpId()){
      const { eventCode,expId } = this.data;
      if(!eventCode){
        if(!app.globalData.abtest){
          wx.showToast({
            title: '请填写事件code',
            icon: 'error',
          });
          return;
        }
      }
      const exp = await abtest.getExpByName(expId);
      // 上报一次事件
      abtest.reportExpEvent(eventCode, exp);
    }
  },
})
