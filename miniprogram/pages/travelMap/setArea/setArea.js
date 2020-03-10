// miniprogram/pages/travelMap/setArea/setArea.js
const app = getApp();
let gdJson = require("../../../data/json.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    result: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let arr = [];
    for (let i in gdJson.dataList.features) {
      arr.push(gdJson.dataList.features[i].properties.name);
    }
    this.setData({
      list: arr
    });
    this.handleGetAreaData();
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
  onChange(event) {
    this.setData({
      result: event.detail
    });
  },
  toggle(event) {
    const { index } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${index}`);
    checkbox.toggle();
  },

  noop() { },
  handleGetAreaData() {
    const db = wx.cloud.database();
    db.collection('gdTravelData').get()
      .then((res) => {
        // console.log(res.data[0].list);
        this.setData({
          result: res.data[0].list
        });
    })
  },
  onConfirm() {
    const db = wx.cloud.database();
    let upload = this.data.result;
    console.log(upload);
    wx.cloud.callFunction({
      name: 'setGdTravelArea',
      data: {
        list: upload
      },
      success: (res) => {
        wx.showToast({
          title: "成功(〃'▽'〃)",
          icon: 'success',
          duration: 1500,
          //延时操作，显示完Toast再返回
          success: function () {
            setTimeout(function () {
              wx.navigateBack();
            }, 1500);
          }
        })
      },
      fail: console.error
    })
  }
})