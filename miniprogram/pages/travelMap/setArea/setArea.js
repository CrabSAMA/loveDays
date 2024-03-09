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
    try {
      const value = wx.getStorageSync('gdTravelData');
      if (value) {
        this.setData({
          result: value
        });
      }
    } catch (error) {
      
    }
  },
  onConfirm() {
    let upload = this.data.result;
    console.log(upload);
    try {
      wx.setStorageSync('gdTravelData', upload);
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
    } catch (error) {
    }
  }
})