// pages/project/wisdomjoinRequestPublish/wisdomjoinRequestPublish.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlPath: app.globalData.https + "/images/",
    pic: [],
    display: "none",
    focus: false,
    input: '',
    placeholder: "",
    value: '',
    textarea: "",
    memid: "",
    qid: "",
    state: 0,
    now: 0,
    disabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      memid: options.memid,
      qid: options.qid,
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
  /**
* 图片
*/
  tupian: function () {
    console.log("图片")
    var that = this
    var temp = []
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        var pic = ""
        that.setData({
          state: tempFilePaths.length,
          disabled: true,
          now: 0
        })

        for (var i = 0; i < tempFilePaths.length; i++) {
          wx.uploadFile({
            url: app.globalData.https + "/x/Operate/Zhihe.ashx",
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
              'method': 'Add_ZhiheAnswerpic',
            },
            success: function (uploadRes) {
              console.log("上传图片" + uploadRes.data)
              if (uploadRes.data.flag == "0") {
                wx.showToast({
                  title: '操作失败',
                  icon: 'loading',
                })
              }
              else if (uploadRes.data.flag == "-4") {
                wx.showToast({
                  title: '图片为空',
                  icon: 'loading',
                })
              }
              else if (uploadRes.data.flag == "-2") {
                wx.showToast({
                  title: '图片格式错误',
                  icon: 'loading',
                })
              }
              else if (uploadRes.data.flag == "-3") {
                wx.showToast({
                  title: '图片过大',
                  icon: 'loading',
                })
              } else {
                wx.showToast({
                  title: '上传成功',
                  icon: 'loading',
                })
                temp = that.data.pic
                temp.push(uploadRes.data)
                that.setData({
                  now: that.data.now + 1,
                  pic: temp
                })
                console.log("state=" + that.data.state)
                console.log("now=" + that.data.now)
                if (that.data.state == that.data.now) {
                  that.setData({
                    disabled: false
                  })
                }
              }
            },
            fail: function (res) {
              console.log("上传图片失败" + JSON.stringify(res))
            }
          })
        }

      }

    })
  },
  /**
* 预览图片
*/
  pro: function (e) {
    if (e.currentTarget.dataset.src != "") {
      wx.previewImage({
        current: e.currentTarget.dataset.src, // 当前显示图片的http链接
        urls: [e.currentTarget.dataset.src] // 需要预览的图片http链接列表
      })
      console.log("src=" + e.currentTarget.dataset.src)
    }

  },
  /**
* 删除图片
*/
  delete: function (e) {
    var that = this
    console.log(e.currentTarget.dataset.index)
    var temp = []
    temp = that.data.pic
    temp.splice(e.currentTarget.dataset.index, 1)
    that.setData({
      pic: temp
    })
  },
  /**
* 监听textarea
*/
  textarea: function (e) {
    var that = this
    this.setData({
      textarea: e.detail.value
    })
    console.log(that.data.textarea)
  },
  /**
* 发布
*/
  fabu: function (e) {
    var that = this
    var pic = that.data.pic.join("|")
    if (that.data.textarea.length != 0) {
      wx.request({
        url: app.globalData.https + '/x/operate/zhihe.ashx',
        data: ({
          method: "Add_ZhiheAnswer",
          question_id: that.data.qid,
          memid: that.data.memid,
          imgurl: pic,
          descs: that.data.textarea
        }),
        success: function (res) {
          console.log("结果=" + res.data)
          if (res.data == 1) {
            wx.showToast({
              title: '发布成功',
              icon: 'success',
            })
            wx.navigateBack({
            })
          } else {
            wx.showToast({
              title: '发布失败',
              icon: 'loading',
            })
          }
        }
      })
    }

  }
})