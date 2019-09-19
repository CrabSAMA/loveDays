// pages/crop/crop.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src:'',
    width: 300,
    height: 520,
    max_width: 300,
    max_height: 520,
    min_width: 200,
    min_height: 346,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.cropper = this.selectComponent("#image-cropper");
    this.cropper.upload();
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
  cropperload(e) {
    console.log("cropper初始化完成");
  },
  loadimage(e) {
    console.log("图片加载完成", e);
    wx.hideLoading();
    //重置图片角度、缩放、位置
    this.cropper.imgReset();
  },
  clickcut(e) {
    console.log(e.detail);
    //点击裁剪框阅览图片
    wx.previewImage({
      current: e.detail.url, // 当前显示图片的http链接
      urls: [e.detail.url] // 需要预览的图片http链接列表
    })
  },
  submit(){
    this.cropper.getImg((obj) => {
      //清缓存
      wx.getSavedFileList({
        success(res){
          console.log(res);
          res.fileList.forEach((val,key) => {
            wx.removeSavedFile({
              filePath: val.filePath
            });
          })
        }
      })
      wx.saveFile({
        tempFilePath: obj.url,
        success(res){
          console.log(res);
          app.globalData.backgroundImageSrc = res.savedFilePath;
          console.log(app.globalData.backgroundImageSrc);
          wx.setStorage({
            key: 'bgImg',
            data: res.savedFilePath,
            success(res) {
              console.log(res);
            }
          });
          wx.navigateBack({
            delta: -1
          });
        },
        fail(res){
          console.log(res);
        }
      })
      
      
    });
  }
})