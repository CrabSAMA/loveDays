//index.js
//获取应用实例
const app = getApp();

var amapFile = require('../../libs/amap-wx.js');
var myAmapFun;

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    img: "",
    loveDay:"",
    jmWeather:'',  //江门天气
    czWeather:'',  //潮州天气
    jmTemperature:'',  //江门温度
    czTemperature:'',  //潮州温度
    temperature:'',  //两地相差温度
    
    //跑马灯效果
    scrollText: 'loveWelcome',
    marqueePace: 1, //滚动速度
    marqueeDistance: 0, //初始滚动距离
    marqueeDistance2: 0,
    size: 16,
    orientation: 'left', //滚动方向
    interval: 20 // 时间间隔
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    let _this = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    //初始化云环境
    wx.cloud.init();
    //此处获取日期
    let loveDayGet = this.handleLoveDays();
    this.setData({
      loveDay: loveDayGet,
    });
    
    
    //此处加载定位
    this.loadLocation();
    //此处调用云函数登录，创建账户，在数据库中添加ID信息
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        console.log("result: ", res);
        app.globalData.userID = res.result.openid;
      }
    })

    //实例化高德地图的API
    
    // myAmapFun.getWeather({
    //   city: '445100',
    //   success: function (data) {
    //     console.log(data);
    //   },
    //   fail: function (info) {
    //     console.log(info);
    //   }
    // })
  },

  onShow: function() {
    let _this = this;
    myAmapFun = new amapFile.AMapWX({ key: '5bb0fb6d4a9eaa20406fe7930f840431' });  //定义高德地图的实体对象

    _this.getWeather(_this.setTemperature);

    let length = _this.data.scrollText.length * _this.data.size;  //文字长度
    let windowWidth = wx.getSystemInfoSync().windowWidth;  //屏幕宽度
    _this.setData({
      length: length,
      windowWidth: windowWidth,
      marquee2_margin: length < windowWidth ? windowWidth - length : _this.data.marquee2_margin  ////当文字长度小于屏幕长度时，需要增加补白
    });
    _this.scroll();
    //此处从本地存储中获取背景图，放在此处会影响性能，但是可以做到即时预览功能，以后做成crop.js回调调用一次，将这个放回onLoad生命周期将提升性能
    this.getImageFromStorage();
  },

  setTemperature: function(){
    let _this = this;
    _this.setData({
      temperature: '相差' + Math.abs(this.data.jmTemperature - this.data.czTemperature) + '°C',
    });
  },

  getWeather: function(callback){
    let _this = this;
    _this.getJmWeather();
    _this.getCzWeather();
  },

  getJmWeather: function(){
    let _this = this;
    myAmapFun.getWeather({
      city: '440700',  //江门的地区编码
      success: function (data) {
        let weather = data.liveData.temperature + "°C " + data.liveData.weather;
        console.log(weather);
        _this.setData({
          jmWeather: weather,
          jmTemperature: data.liveData.temperature,
        });
        _this.setTemperature();
      },
      fail: function (info) {
        console.log(info);
      }
    })
  },

  getCzWeather: function(){
    let _this = this;
    myAmapFun.getWeather({
      city: '445100',  //潮州的地区编码
      success: function (data) {
        let weather = data.liveData.temperature + "°C " + data.liveData.weather;
        console.log(weather);
        _this.setData({
          czWeather: weather,
          czTemperature: data.liveData.temperature,
        });
        _this.setTemperature();
      },
      fail: function (info) {
        console.log(info);
      }
    })
  },

  getImageFromStorage: function(){
    /**
     * 方法作用：用于在进入时在本地缓存获取当前设置的背景图
     */
    let _this = this;
    wx.getStorage({
      key: 'bgImg',
      success: function (res) {
        console.log(res)
        app.globalData.backgroundImageSrc = res.data;
        _this.setData({
          img: app.globalData.backgroundImageSrc
        });
        console.log(app.globalData.backgroundImageSrc);
      },
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        console.log("result: ", res);
        app.globalData.userID = res.result.openid;
      }
    })
  },
  handldImg: function() {
    /**
     * 方法作用：用于选择图片，此处直接跳转到crop页面处理
     */
    var _this = this;
    // wx.chooseImage({
    //   count: 1,
    //   sizeType:['original'],
    //   success(res){
    //     var tempFilePath = res.tempFilePaths;
    //     for(let i of tempFilePath){
    //       _this.setData({
    //         img:i
    //       });
    //     }
    //   },
    // })
    wx.navigateTo({
      url: '../../pages/crop/crop',
    })
  },

  handleLoveDays: function(){
    /**
     * 方法作用：用于计算相爱日期天数
     * 有可能会在31号出现问题，因为JS日期处理的原因
     */
    var now = new Date();
    var love = new Date();
    love.setFullYear(2017);
    love.setDate(12);
    love.setMonth(5);  //此处为6月
    var days = now.getTime() - love.getTime();
    var day = parseInt(days / (1000*60*60*24));
    return day;
  },

  loadLocation: function(){
    /**
     * 方法作用：用于获取定位
     */
    var _this = this;
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        console.log(res);
      },
    })
  },

  scroll: function(){
    /**
     * 方法作用：用于处理滚动事件，有待解析
     */
    let _this = this;
    let interval = setInterval(function() {
      if(-(_this.data.marqueeDistance) < _this.data.length){
        _this.setData({
          marqueeDistance: _this.data.marqueeDistance - _this.data.marqueePace,
        });
      }else{
        clearInterval(interval);
        _this.setData({
          marqueeDistance: _this.data.windowWidth
        });
        _this.scroll();
      }
    }, _this.data.interval);
  },
})
