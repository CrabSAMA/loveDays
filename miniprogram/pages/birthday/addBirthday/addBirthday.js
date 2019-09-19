// miniprogram/pages/birthday/addBirthday/addBirthday.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    birthdayDate: '',
    dbID: '',
    change: false
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
    let _this = this;
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('birthdayData', function (data) {
      _this.setData({
        name: data.birthday.name,
        birthdayDate: data.birthday.birthday,
        dbID: data.birthday._id,
        change: data.change
      })
    })
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

  bindDateChange: function (e) {
    this.setData({
      birthdayDate: e.detail.value
    })
  },
  handleAdd: function(){
    let _this = this;
    //检验是否填写完整
    if(_this.data.name != '' && _this.data.birthdayDate != ''){
      const db = wx.cloud.database();
      db.collection('birthday').add({
        data: {
          //此处不需要userID字段，添加后会有一个_openid字段用于辨识
          // userID: app.globalData.userID,
          name: _this.data.name,
          birthday: new Date(_this.data.birthdayDate)
        },
        success: function (res) {
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
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
    }else{
      wx.showToast({
        title: '填写完整后再添加哦~',
        icon: 'none',
        duration: 2000
      })
    }
    
  },
  handleChange(){
    let _this = this;
    if (_this.data.name != '' && _this.data.birthdayDate != ''){
      const db = wx.cloud.database();
      db.collection('birthday').doc(_this.data.dbID).set({
        data: {
          name: _this.data.name,
          birthday: new Date(_this.data.birthdayDate)
        },
        success: function (res) {
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
    } else {
      wx.showToast({
        title: '填写完整后再添加哦~',
        icon: 'none',
        duration: 2000
      })
    }
  },
  handleDelete(){
    let _this = this;
    const db = wx.cloud.database();
    db.collection('birthday').doc(_this.data.dbID).remove({
      success: function (res) {
        wx.showToast({
          title: "删除成功~",
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
  },
  onChange(event) {
    this.setData({
      name: event.detail
    })
  }
})