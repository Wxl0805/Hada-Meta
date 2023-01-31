<template>
  <view class="">
    <view class="status_bar"> </view>

    <!-- 顶部导航栏 -->
    <view class="header-fixed">
      <uni-nav-bar height="118rpx" backgroundColor="#ffffff">
        <view class="header-title">
          <span>{{ $t("mine.index-edituserdata") }}</span>
        </view>
        <view slot="left">
          <view class="left" @click="back" v-if="(imgchange || otherchange)">
            <span>{{ $t("common.quxiao") }}</span>
          </view>

          <view class="left" @click="backindex" v-if="!(imgchange || otherchange)">
            <span>{{ $t("common.back") }}</span>
          </view>
        </view>
        <view slot="right">
          <view class="right" @click="save" v-if="(imgchange || otherchange)">
            <span>{{ $t("common.save") }}</span>
          </view>
        </view>
      </uni-nav-bar>
    </view>

    <!-- 弹窗 -->
    <uni-popup ref="alertDialog" type="dialog">
      <uni-popup-dialog
        :type="msgType"
        :cancelText="$t('common.quxiao')"
        :confirmText="$t('common.confirm-1')"
        :title="$t('common.back-confirm')"
        :content="$t('common.back-content')"
        @confirm="dialogConfirm"
        @close="dialogClose"
      ></uni-popup-dialog>
    </uni-popup>

    <!-- 头像、性别设置 -->
    <view class="section3 flex-col">
      <view class="section13 flex-col">
        <helang-compress ref="helangCompress"></helang-compress>
        <view class="SingleAvatar1 flex-col" v-if="showimg" @click="handleOpenPhoto"></view>
        <view class="imgclass" v-else @click="handleOpenPhoto">
		  <view class="background flex-col" @click="handleOpenPhoto" ></view>
          <view class="imgshow">
            <image mode="aspectFill" :src="imgShow" alt=""/>
          </view>
        </view>
		<view class="shexiangtou flex-col" v-if="!showimg" @click="handleOpenPhoto"></view>

        <text class="info2">{{ $t("mine.index-dianjisetimg") }}</text>

        <!-- 设置性别 -->
        <view class="bd7 flex-row justify-between" v-if="selectsex">
          <view class="Button1 flex-col">
            <view class="layer6 flex-row">
              <view class="ImageText8 flex-row justify-between">
                <view class="block1 flex-col"></view>
                <view class="TextGroup8 flex-col">
                  <text class="word3">{{ $t("mine.index-nan") }}</text>
                </view>
              </view>
            </view>
          </view>
          <view class="Search1 flex-col" @click="switchnv">
            <view class="section14 flex-row">
              <view class="ImageText9 flex-row justify-between">
                <view class="bd2 flex-col"></view>
                <view class="TextGroup9 flex-col">
                  <text class="word4">{{ $t("mine.index-nv") }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="box8 flex-row justify-between" v-else>
          <view class="Button2 flex-col" @click="switchnan">
            <view class="mod6 flex-row">
              <view class="ImageText13 flex-row justify-between">
                <view class="bd5 flex-col"></view>
                <view class="TextGroup13 flex-col">
                  <text class="word9">{{ $t("mine.index-nan") }}</text>
                </view>
              </view>
            </view>
          </view>
          <view class="group4 flex-col">
            <view class="group5 flex-row">
              <view class="ImageText14 flex-row justify-between">
                <view class="bd6 flex-col"></view>
                <view class="TextGroup14 flex-col">
                  <text class="word10">{{ $t("mine.index-nv") }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部UID等设置 -->
    <view class="section4 flex-col">
      <view class="box3 flex-row justify-between">
        <text class="info3">UID</text>
        <text class="word5">{{ uid }}</text>
      </view>
      <view class="box4 flex-row justify-between" @click="changeUsername">
        <text class="txt3">{{ $t("mine.index-username") }}</text>
        <view class="flex-row" style="display: flex; align-items: center;">
          <text class="txt4" style="margin-right: 16rpx;">{{ nickname }}</text>
          <view class="box1"></view>
        </view>
      </view>

      <!-- 手机 -->
      <view class="box5 flex-row justify-between" @click="telClick" >
        <text class="word6">{{ $t("mine.index-tel") }}</text>
        <view class="flex-row" style="display: flex; align-items: center;">
          <view style="margin-right: 16rpx;">
            <text class="word7">{{ tel }}</text>
          </view>
          <view class="bd3 flex-col"></view>
        </view>
      </view>

      <!-- 邮箱 -->
      <view class="box6 flex-row justify-between" @click="emailClick">
        <text class="word8">{{ $t("mine.index-email") }}</text>
        <view class="flex-row" style="display: flex; align-items: center;">
          <view style="margin-right: 16rpx;">
            <text class="txt5">{{ email }}</text>
          </view>
          <view class="box1 flex-col"></view>
        </view>
      </view>

      <!-- 生日 -->
      <view class="box7 flex-row justify-between" @click="selectDate">
        <text class="info4">{{ $t("mine.index-birthday") }}</text>
        <view class="flex-row" style="display: flex; align-items: center;">
          <view style="margin-right: 16rpx;">
            <text class="txt6">{{ date }}</text>
          </view>
          <view class="bd4 flex-col"></view>
        </view>
      </view>
    </view>

    <itmister-date-picker ref="dateEl" @dateConfirm="dateConfirm"></itmister-date-picker>
  </view>
</template>

<script>
import itmisterDatePicker from "@/components/itmister-date-picker/itmister-date-picker.nvue";
import helangCompress from "@/components/helang-compress/helang-compress.vue";
	// #ifdef APP-PLUS
	import APPUpdate from '@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate';
	// #endif
export default {
  components: {
    itmisterDatePicker, // 注册组件
    helangCompress,
  },
  data() {
    return {
      imagSizeFlag: true,
      imgShow: "",
      showimg: true,
      type: "center",
      msgType: "message",
      date: this.$t("common.plsselect"),
      tel: this.$t("common.plsbind"),
      email: this.$t("common.plsbind"),
      selectsex: true,
      uid: "",
      nickname: "",
      change: false,
      token: "",
      imgobject: "",

      imgchange: false,
      otherchange: false,
	  // 记录触发了几次需要更新APP
	  appUpdate: 0,
    };
  },

  onBackPress(options) {
    if (!(this.imgchange || this.otherchange)) {
      return false;
    } else {
      this.$refs.alertDialog.open();
      return true;
    }
  },
  onLoad(options) {
    this.token = uni.getStorageSync("token");
    uni.request({
      header: {
        "Content-Type": "application/json",
        "x-token": this.token,
		//version
		version: this.version,
      },
      url: this.host + "/app/user/info",
      method: "GET",
      data: {},
      dataType: "json",
      success: (res) => {
		if (res.data.code == 2) {
			console.log("需要更新版本");
			this.appUpdate++;
			// 控制只出现一次弹窗
			if(this.appUpdate >= 0 && this.appUpdate < 2){
			// #ifdef APP-PLUS
			APPUpdate(true);
			// #endif
			}
			return;
		}
        var uuid = res.data.data.uuid;
        this.uid = uuid.substring(uuid.length - 6, uuid.length);
        this.nickname = res.data.data.nickName;
        this.selectsex = res.data.data.sex == 1 ? true : false;
        if (res.data.data.birthday == "") {
          this.date = this.$t("common.plsselect");
        } else if (res.data.data.birthday == undefined) {
          this.date = this.$t("common.plsselect");
        } else {
          if (res.data.data.birthday.length > 0) {
            this.date = res.data.data.birthday.substring(0, 10);
          }
        }
        if (res.data.data.email == "") {
          this.email = this.$t("common.plsbind");
        } else {
          this.email = res.data.data.email;
        }
        if (res.data.data.phone == "") {
          this.tel = this.$t("common.plsbind");
        } else {
          this.tel = res.data.data.phone;
        }

      },
    });
    uni.showLoading({
      mask: true,
      title: this.$t("common.wait"),
    });
    uni.request({
      url: this.host + "/app/avatar",
      header: { "x-token": this.token,
	   //version
	   version: this.version,
	   },
      method: "GET",
      // data: {},
      // responseType: "ArrayBuffer",
      dataType:'json',
      success: (res) => {
        if (res.data.code == 0) {
			if(res.data.data.Pics){
				this.showimg = false;
				this.imgShow = res.data.data.Pics;
				return;
			}
        }
		if (res.data.code == 2) {
			console.log("需要更新版本");
			this.appUpdate++;
			// 控制只出现一次弹窗
			if(this.appUpdate >= 0 && this.appUpdate < 2){
			// #ifdef APP-PLUS
			APPUpdate(true);
			// #endif
			}
			return;
		}
      },
      complete: () => {
        uni.hideLoading();
      },
    });
    // if(option.sex){
    // 	this.sex = option.sex;
    // }
  },
  methods: {
    back() {
      this.$refs.alertDialog.open();
    },
    backindex() {
      uni.navigateBack({
        delta: 1, //返回层数，2则上上页
      });
    },
    changeHeaderimg() {
      if (!this.imagSizeFlag) {
        uni.showToast({
          icon: "none",
          title: this.$t("common.image-size"),
        });
        return false;
      }
      uni.showLoading({ title: this.$t("common.saveing"), mask: true });
      uni.uploadFile({
        url: this.host + "/app/uploadavatar",
        filePath: this.imgShow,
        fileType: "image",
        name: "avatar",
        header: {
          "x-token": this.token,
		  //version
		  version: this.version,
        },
        fail: (e) => {
          uni.hideLoading();
        },
        success: (uploadFileRes) => {
          uni.hideLoading();
          uni.showToast({
            icon: "none",
            title: JSON.parse(uploadFileRes.data).msg == "图片格式错误" ? this.$t("add.code-imgerror") : this.$t("common.edit-success"),
          });
          if (JSON.parse(uploadFileRes.data).code == 0) {
            uni.switchTab({
              url: "/pages/mine/index",
              animationType: "slide-in-left",
            });
            return;
          }
		  if (JSON.parse(uploadFileRes.data).code == 2) {
		  	console.log("需要更新版本");
		  	this.appUpdate++;
		  	// 控制只出现一次弹窗
		  	if(this.appUpdate >= 0 && this.appUpdate < 2){
		  	// #ifdef APP-PLUS
		  	APPUpdate(true);
		  	// #endif
		  	}
		  	return;
		  }
        },
      });
    },
    changeOther() {
      uni.showLoading({ title: this.$t("common.saveing"), mask: true });
      uni.request({
        header: {
          "Content-Type": "application/json",
          "x-token": this.token,
		  //version
		  version: this.version,
        },
        url: this.host + "/app/user/info",
        method: "POST",
        data: {
          id: this.uid,
          nickName: this.nickname,
          sex: this.selectsex == true ? "1" : "0",
          birthday: this.date,
        },
        dataType: "json",
        success: (res) => {
          var user = uni.getStorageSync("user");
          user.nickName = this.nickname;
          uni.setStorageSync("user", user);
          if (res.data.code == 0) {
            uni.showToast({
              icon: "none",
              title: this.$t("common.edit-success"),
            });
            uni.switchTab({
              url: "/pages/mine/index",
              animationType: "slide-in-left",
            });
            return;
          }
		  if (res.data.code == 2) {
		  	console.log("需要更新版本");
		  	this.appUpdate++;
		  	// 控制只出现一次弹窗
		  	if(this.appUpdate >= 0 && this.appUpdate < 2){
		  	// #ifdef APP-PLUS
		  	APPUpdate(true);
		  	// #endif
		  	}
		  	return;
		  }
        },
        complete: () => {
          uni.hideLoading();
        },
      });
    },
    changeAll() {
      if (!this.imagSizeFlag) {
        uni.showToast({
          icon: "none",
          title: this.$t("common.image-size"),
        });
        return false;
      }
      uni.showLoading({ title: this.$t("common.saveing"), mask: true });
      uni.uploadFile({
        url: this.host + "/app/uploadavatar",
        filePath: this.imgShow,
        fileType: "image",
        name: "avatar",
        header: {
          "x-token": this.token,
		  //version
		  version: this.version,
        },
        fail: (e) => {
          uni.hideLoading();
        },
        success: (uploadFileRes) => {
          if (JSON.parse(uploadFileRes.data).msg == "图片格式错误") {
            uni.showToast({
              icon: "none",
              title: this.$t("add.code-imgerror"),
            });
            return;
          }
          uni.request({
            header: {
              "Content-Type": "application/json",
              "x-token": this.token,
			  //version
			  version: this.version,
            },
            url: this.host + "/app/user/info",
            method: "POST",
            data: {
              id: this.uid,
              nickName: this.nickname,
              sex: this.selectsex == true ? "1" : "0",
              birthday: this.date,
            },
            dataType: "json",
            success: (res) => {
              var user = uni.getStorageSync("user");
              user.nickName = this.nickname;
              uni.setStorageSync("user", user);
              if (res.data.code == 0) {
                uni.showToast({
                  icon: "none",
                  title: this.$t("common.edit-success"),
                });
                uni.switchTab({
                  url: "/pages/mine/index",
                  animationType: "slide-in-left",
                });
                return;
              }
			  if (res.data.code == 2) {
			  	console.log("需要更新版本");
			  	this.appUpdate++;
			  	// 控制只出现一次弹窗
			  	if(this.appUpdate >= 0 && this.appUpdate < 2){
			  	// #ifdef APP-PLUS
			  	APPUpdate(true);
			  	// #endif
			  	}
			  	return;
			  }
            },
          });
        },
        complete: () => {
          uni.hideLoading();
        },
      });
    },
    save() {
      if (this.imgchange & this.otherchange) {
        this.changeAll();
      } else if (this.imgchange) {
        this.changeHeaderimg();
      } else if (this.otherchange) {
        this.changeOther();
      } else {
        // noting
      }
    },

    dialogConfirm() {
      uni.switchTab({
        url: "/pages/mine/index",
        animationType: "slide-in-left",
        success(res) {},
        fail(res) {},
      });
    },
    dialogClose() {
      this.$refs.alertDialog.close();
    },
    handleOpenPhoto() {
      const _this = this;
      uni.chooseImage({
        count: 1, //默认9
        sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], //从相册选择、摄像头
        success: (chooseImageRes) => {
          _this.imgchange = true;
          _this.showimg = false;
          const imgPaths = chooseImageRes.tempFiles;
          const successUp = 0; // 成功计数
          const failUp = 0; // 失败计数
          const count = 0; // 第几张
          const total = imgPaths.length; // 当前已上传个数
          // 调用上传方法
          this.$refs.helangCompress
            .compress({
              src: chooseImageRes.tempFiles[0].path,
              maxSize: 800,
              fileType: "jpg",
              quality: 0.85,
              minSize: 640,
            })
            .then((res) => {
              uni.hideLoading();
              uni.showToast({
                title: this.$t("common.image-yasuo-success"),
                icon: "success",
              });
              this.showPlusFlag = false;
              this.imgShow = res;

              uni.getFileInfo({
                filePath: this.imgShow,
                success: (res) => {
                  uni.hideLoading();
                  if (res.size > 2 * 1024 * 1024) {
                    this.imagSizeFlag = false;
                  } else {
                    this.imagSizeFlag = true;
                  }
                },
                fail: () => reject(null),
              });
            })
            .catch((err) => {
              uni.hideLoading();
              uni.showToast({
                title: this.$t("common.image-yasuo-fail"),
                icon: "none",
              });
            });
        },
        fail: (error) => {
          console.warn(error);
        },
      });
    },
    // 打开选择器
    selectDate() {
      this.$refs.dateEl.show();
    },
    // 选中日期
    dateConfirm(date) {
      this.date = date;
      this.otherchange = true;
    },

    telClick() {
      if (this.tel == this.$t("common.plsbind")) {
        uni.navigateTo({
          url: "/pages/mine/telBind",
          success(res) {},
          fail(res) {},
        });
        // this.$router.push('/pages/mine/telBind');
      } else {
        uni.navigateTo({
          url: "/pages/mine/ChangeTel?tel=" + this.tel,
          success(res) {},
          fail(res) {},
        });
        // this.$router.push('/pages/mine/telBind');
      }
    },
    emailClick() {
      if (this.email == this.$t("common.plsbind")) {
        uni.navigateTo({
          url: "/pages/mine/emailBind",
          success(res) {},
          fail(res) {},
        });
        // this.$router.push('/pages/mine/emailBind');
      } else {
        uni.navigateTo({
          url: "/pages/mine/ChangeEmail?email=" + this.email,
          success(res) {},
          fail(res) {},
        });
      }
    },

    switchnv() {
      this.selectsex = false;
      this.otherchange = true;
    },
    switchnan() {
      this.selectsex = true;
      this.otherchange = true;
    },
    changeUsername() {
      uni.navigateTo({
        url: "/pages/mine/ChangeUsername?username=" + this.nickname,
      });
    },
    otherFun(object) {
      if (object) {
        this.nickname = object.username;
        this.otherchange = true;
      } else {
        return;
      }
    },
    otherFun1(object) {
      if (object) {
        this.email = object.email;
      } else {
        return;
      }
    },
	otherFun2(object) {
	  if (object) {
	    this.tel = object.tel;
	  } else {
	    return;
	  }
	},
	bindemail(object){
		if (object) {
		  this.email = object.email;
		} else {
		  return;
		}
	},
	bindtel(object){
		if (object) {
		  this.tel = object.tel;
		} else {
		  return;
		}
	},
  },
};
</script>

<style>
@import "@/static/css/common.css";
@import "@/static/css/userdata.css";
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
  background-color: #ffffff;
}
page {
  background-color: rgba(243, 245, 247, 1);
  position: relative;
  width: 750rpx;
  height: 1624rpx;
  overflow: hidden;
}
.header-fixed {
  width: 100%;
  position: fixed;
  top: var(--status-bar-height);
  z-index: 100;
}
.header-title {
  width: 100%;
  display: flex;
  align-self: center;
  justify-content: center;
}
.header-title > span {
  width: 204rpx;
  height: 48rpx;
  color: rgba(46, 51, 78, 1);
  font-size: 34rpx;
  font-family: PingFangSC-Medium;
  text-align: center;
  white-space: nowrap;
  line-height: 48rpx;
}
.left,
.right {
  width: 68rpx;
  height: 48rpx;
  color: rgba(0, 155, 249, 1);
  font-size: 34rpx;
  font-family: PingFangSC-Medium;
  text-align: center;
  white-space: nowrap;
}
.popup-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30upx;
  height: 100upx;
  background-color: #fff;
}
.text {
  font-size: 24upx;
  color: #333;
}
.section3 {
  margin-top: 120rpx;
}
.section4 {
  height: 600rpx;
  /* height: 500rpx; */
}
.imgclass {
  width: 249rpx;
  height: 249rpx;
 /* width: 174rpx;
  height: 174rpx;
  margin-top: 30rpx; */
  margin-left: 73rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.background{
	width: 249rpx;
	height: 249rpx;
	background: url('@/static/images/userdata/background.png')
	  no-repeat;
	background-size: 249rpx 251rpx;
	/* margin-left: 73rpx; */
	position: absolute;
}
.shexiangtou{
	width: 61rpx;
	height: 61rpx;
	background: url('@/static/images/userdata/photo.png')
	  no-repeat;
	background-size: 100% 100%;
	position: absolute;
	margin-top: 156rpx;
	margin-left: 216rpx;
}
.imgshow {
  width: 172rpx;
  height: 172rpx;
  border-radius: 50%;
  overflow: hidden;
}
.imgshow > image {
  width: 100%;
  height: 100%;
}
.box8 {
  margin: 48rpx 0 0 0;
}
.ImageText12 {
  width: 200rpx;
}

.ImageText11 {
  width: 435rpx;
}
</style>
