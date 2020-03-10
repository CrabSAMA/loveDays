// miniprogram/pages/travelMap/travelMap.js
import * as echarts from '../../component/ec-canvas/echarts';
let gdJson = require("../../data/json.js");
let chart = null;
function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    // 适配屏幕重点 否则会导致模糊
    devicePixelRatio: dpr
  });
  canvas.setChart(chart);
  echarts.registerMap("guangdong", gdJson.dataList);
  let option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}'
    },
    series: [
      {
        name: "旅行地图",
        type: "map",
        map: "guangdong",
        itemStyle: {
          normal: {
            borderColor: '#FFB6C1',
            areaColor: '#fff',
            shadowColor: 'rgba(255, 182, 193, 0.5)',
            shadowBlur: 10
          },
          emphasis: {
            areaColor: '#FFB6C1',
            borderColor: '#8E8E8E',

            label: {
              show: false
            }
          }
        },
        data: []
      }
    ]
  };
  chart.setOption(option);  
  return chart;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: initChart
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    console.log("show");
    this.getAreaData();
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  setArea() {
    wx.navigateTo({
      url: '../travelMap/setArea/setArea',
    })
  },
  getAreaData() {
    let _this = this;
    if (chart !== null) {
      chart.showLoading();
      const db = wx.cloud.database();
      db.collection('gdTravelData').get()
        .then((res) => {
          console.log(res.data[0].list);
          let arr = [];
          for (let i in res.data[0].list) {
            let data = {
              name: res.data[0].list[i],
              selected: true
            }
            arr.push(data);
          }
          chart.setOption({
            series: [{
              // 根据名字对应到相应的系列
              name: '旅行地图',
              data: arr
            }]
          });
          chart.hideLoading();
        })
    } else {
      // 如果未初始化成功 则1秒后重新获取数据
      setTimeout(function() {
        _this.getAreaData();
      }, 1000);
    }
  }
})