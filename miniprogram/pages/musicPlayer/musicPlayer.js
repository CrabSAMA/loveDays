// miniprogram/pages/musicPlayer/musicPlayer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: 'a',
    tab: 'a',
    // 与音乐播放有关的属性
    // 播放列表 假数据
    playlist: [
      {
        // 音乐id
        id: 1,
        // 音乐标题
        title: 'GIANTS',
        // 音乐歌手
        singer: '英雄联盟 / True Damage',
        // 音乐路径
        src: 'https://isure.stream.qqmusic.qq.com/C400002HR2au0HgiOK.m4a?guid=4831708816&vkey=DA3151CD291924AFB7FBF5674D4791BE297A9DF09AC1821033337C8B5DCE52F781EF3B3C9A5025DC594AAB438AF08F3246176F035C1A0D37&uin=0&fromtag=66',
        // 音乐图片
        coverImgUrl: 'https://y.gtimg.cn/music/photo_new/T002R300x300M000002vzuym3ygjed.jpg?max_age=2592000'
      },
      {
        // 音乐id
        id: 2,
        // 音乐标题
        title: '涅槃 (Phoenix)',
        // 音乐歌手
        singer: '英雄联盟',
        // 音乐路径
        src: 'https://isure.stream.qqmusic.qq.com/C40000379G5G3FxmKx.m4a?guid=4831708816&vkey=0E32A54703D5D30EAACCC8ACCCF44150EF382895AE0680AE22B8A7174954DA40E427961A4E865E938EAD3AAB9D87B2EE6103835F7CB88DFD&uin=0&fromtag=66',
        // 音乐图片
        coverImgUrl: 'https://y.gtimg.cn/music/photo_new/T002R300x300M000004NHcSP4IIbSC.jpg?max_age=2592000'
      },
      {
        // 音乐id
        id: 3,
        // 音乐标题
        title: 'Legends Never Die (传奇永不熄灭)',
        // 音乐歌手
        singer: '英雄联盟 / Against the Current',
        // 音乐路径
        src: 'https://isure.stream.qqmusic.qq.com/C400004bdAos2G4h88.m4a?guid=4831708816&vkey=B9FDC75AE419FCC1453FDC248C41FDEAF2E24E62E67BAB827BC1F334C57D8DC5B8C965FB42CEA8283C27374786672FC82EE3C58B6EED6F0E&uin=0&fromtag=66',
        // 音乐图片
        coverImgUrl: 'https://y.gtimg.cn/music/photo_new/T002R300x300M000002TNUCE0M6XJH.jpg?max_age=2592000'
      },
    ],
    // 当前播放状态 running-正在播放 paused-暂停
    state: 'paused',
    // 当前播放的曲目的id
    playIndex: 0,
    // 当前播放曲目的信息
    play: {
      currentTime: '00:00',
      duration: '00:00',
      percent: 0,
      title: '',
      singer: '',
      coverImgUrl: './images/cover.jpg'
    }
  },
  audioCtx: null,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.audioCtx = wx.createInnerAudioContext();
    let _this = this;
    // （仅在 iOS 生效）是否遵循静音开关，设置为 false 之后，即使是在静音模式下，也能播放声音
    wx.setInnerAudioOption({
      obeyMuteSwitch: false
    });
    this.audioCtx.onError(() => {
      console.log("播放失败");
    })
    this.audioCtx.onEnded(() => {
      _this.next();
    })
    // 自动更新播放进度
    // this.audioCtx.onPlay(() => {
    //   _this.setData({
    //     'play.duration': formatTime(_this.audioCtx.duration),
    //     'play.currentTime': formatTime(_this.audioCtx.currentTime),
    //     'play.percent': _this.audioCtx.currentTime / _this.audioCtx.duration * 100
    //   });
    // })
    // this.audioCtx.onPause(() => {
    //   _this.setData({
    //     'play.duration': formatTime(_this.audioCtx.duration),
    //     'play.currentTime': formatTime(_this.audioCtx.currentTime),
    //     'play.percent': _this.audioCtx.currentTime / _this.audioCtx.duration * 100
    //   });
    // })
    // 自动更新播放进度
    this.audioCtx.onTimeUpdate(() => {
      _this.setData({
        'play.duration': formatTime(_this.audioCtx.duration),
        'play.currentTime': formatTime(_this.audioCtx.currentTime),
        'play.percent': _this.audioCtx.currentTime / _this.audioCtx.duration * 100
      });
    })
    // this.audioCtx.onSeeked(() => {
    //   _this.setData({
    //     'play.duration': formatTime(_this.audioCtx.duration),
    //     'play.currentTime': formatTime(_this.audioCtx.currentTime),
    //     'play.percent': _this.audioCtx.currentTime / _this.audioCtx.duration * 100
    //   });
    // })
    this.setMusic(0);
    function formatTime(time) {
      let minute = Math.floor(time / 60) % 60;
      let second = Math.floor(time) % 60;
      return (minute < 10 ? '0' + minute : minute) + ":" + (second < 10 ? '0' + second : second);
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(this.audioCtx) {
      if (this.data.state === 'paused') {
        this.play();
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // 判断当前状态 如果为播放 则停止 否则不操作
    if (this.data.state === 'running') {
      this.pause();
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.audioCtx.destroy();
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
  changeItem(e) {
    this.setData({
      item: e.target.dataset.item
    })
  },
  changeTab(e) {
    this.setData({
      tab: e.detail.currentItemId
    })
  },
  changePage() {
    this.setData({
      item: 'c'
    });
  },
  setMusic(index) {
    // 获取当前音乐信息
    let music = this.data.playlist[index];
    this.audioCtx.src = music.src;
    this.setData({
      playIndex: index,
      'play.title': music.title,
      'play.singer': music.singer,
      'play.coverImgUrl': music.coverImgUrl,
      'play.currentTime': '00:00',
      'play.duration': '00:00',
      'play.percent': '0'
    });
  },
  play() {
    this.audioCtx.play();
    this.setData({
      state: 'running'
    });
  },
  pause() {
    this.audioCtx.pause();
    this.setData({
      state: 'paused'
    });
  },
  next() {
    let index = this.data.playIndex >= (this.data.playlist.length - 1) ? 0 :(this.data.playIndex + 1);
    this.setMusic(index);
    // 判断当前状态 如果为播放 则立即播放 否则不立即播放
    if(this.data.state === 'running') {
      this.play();
    }
  },
  sliderChange(e) {
    let second = e.detail.value * this.audioCtx.duration / 100;
    this.audioCtx.seek(second);
  },
  change(e) {
    this.setMusic(e.currentTarget.dataset.index);
    this.play();
  },
  gotoPlayer() {
    this.setData({
      item: 'b'
    })
  }
})