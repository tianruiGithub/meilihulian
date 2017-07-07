// xiangguanzhizi.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlPath: app.globalData.https + "/images/",
    pics: null,
    actionSheetHidden: true,
    actionSheetItems: [
      { bindtap: 'Delete', txt: '删除' }
    ],
    pic_id: '',
    projectId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      projectId: options.project_id
    })
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
    this.loadPic();
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
    return {
      title: '美丽互联',
      desc: app.globalData.shareContent,
      path: '/pages/project/project'
    }
  },
  //加载图片
  loadPic: function () {
    var that = this
    //请求数据
    wx.request({
      url: app.globalData.https + '/x/Handler/Handler.ashx',
      data: {
        a: 'Get_Pic',
        project_id: that.data.projectId,
        type: '2'    
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          pics: res.data.pic_info
        })
      },
      fail:function(){
        wx.showModal({
          title: '提示',
          content: '请求数据失败',
          showCancel:false
        })
      }
    });
  },
  //添加资质图片
  addPic: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        console.log("选择图片" + JSON.stringify(res))
        wx.uploadFile({
          url: app.globalData.https + "/x/Handler/Handler.ashx",
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'a': 'Add_Pic',
            'pictype': '2',
            'project_id': that.data.projectId,
            'orderby': '1 ' 
          },
          success: function (uploadRes) {
            console.log("上传图片" + uploadRes.data)
            if (uploadRes.data.flag == "1") {
              wx.showToast({
                title: '添加成功',
                icon: 'success',
                duration: 2000
              })
            }
            else if (uploadRes.data.flag == "-1") {
              wx.showToast({
                title: '数据插入失败',
                icon: 'success',
                duration: 2000
              })
            }
            else if (uploadRes.data.flag == "-2") {
              wx.showToast({
                title: '图片格式错误',
                icon: 'success',
                duration: 2000
              })
            }
            else if (uploadRes.data.flag == "-3") {
              wx.showToast({
                title: '图片过大',
                icon: 'success',
                duration: 2000
              })
            }
            that.loadPic();
          },
          fail: function (res) {
            console.log("上传图片失败" +  JSON.stringify(res))
          }
        })
      }
    })
  },
  //点击图片
  actionSheetTap: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden,
      pic_id: e.currentTarget.dataset.id
    })
  },
  actionSheetbindchange: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  //删除
  bindDelete: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
    var that = this
    //请求数据
    wx.request({
      url: app.globalData.https + '/x/Handler/Handler.ashx',
      data: {
        a: 'Del_Pic',
        pic_id: that.data.pic_id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        that.loadPic();
      }
    });
  }
})