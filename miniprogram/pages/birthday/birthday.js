// miniprogram/pages/birthday/birthday.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    birthdayData: []
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
    this.handleGetBirthdayData();
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

  handleClick(){
    wx.navigateTo({
      url: '../birthday/addBirthday/addBirthday',
    })
  },

  handleGetBirthdayData(){
    const db = wx.cloud.database();
    db.collection('birthday').where({
      _openid: app.globalData.userID
    }).get()
    .then((res) => {
      this.setData({
        birthdayData: res.data
      });
      this.handleChangeDate();
    })
  },

  handleChangeDate(){
    let _this = this;
    let data = _this.data.birthdayData;
    for(let i in data){
      let date = data[i].birthday;
      var year = date.getFullYear(),
        month = date.getMonth() + 1,//月份是从0开始的
        day = date.getDate(),
        hour = date.getHours(),
        min = date.getMinutes(),
        sec = date.getSeconds();
      var newTime = year + '-' +
        month + '-' +
        day;
      data[i].birthday = newTime;
    }
    this.setData({
      birthdayData: data
    });
  },

  handleClickBirthDay(e){
    let _this = this;
    let index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../birthday/addBirthday/addBirthday',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('birthdayData', { 
          birthday: _this.data.birthdayData[index],
          change: true
        })
      }
    })
  }
})