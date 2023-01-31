<template>
  <view>
    <!-- 导航栏部分 -->
    <!-- <view class="box-bg">
      <view class="nav-title">
        <view class="iconLeft" @click="back">
          <uni-icons type="back" size="28" color="#000000"></uni-icons>
        </view>
        <view class="text">
          <text class="uni-nav-bar-text">{{ $t("Aleo.InviteCustomers.title") }}</text>
        </view>
        <!~~ 邀请记录 -->
        <!-- <view class="invite-record" @click="onInviteRecordClick">
          <text>{{ $t("Aleo.InviteCustomersRecord.topTabbar-title") }}</text>
        </view> ~~>
      </view>
    </view> -->

    <view class="content">
      <view class="uni-form-item">
        <text class="myInviteCodeTitle">{{ $t("Aleo.InviteCustomers.my-invitation-code") }}</text>
        <view class="myInviteCode">
          <input :disabled="true" class="uni-input" :value="inviteCode" name="equipmentID" />
          <button class="copyBtn" type="default" @click="onCopyBtnClick">
            <text class="copy">{{ $t("Aleo.InviteCustomers.copy") }}</text>
          </button>
        </view>
      </view>

      <!-- <view style="width: 548rpx; margin-top: 64rpx; border: 1rpx dotted #e9e9e9;"></view> -->

      <view class="uni-form-item1">
        <view class="qrcode-box">
          <view class="qrcode">
            <u-qrcode
              ref="qr6"
              canvas-id="qr6"
              :value="inviteCode"
              :size="size"
              :options="{
                foregroundImageWidth: 50,
                foregroundImageHeight: 50,
                foregroundImageBorderRadius: 6,
                foregroundImageSrc: '/static/images/income/Aleo/inviteCustomers/logo.png',
              }"
            ></u-qrcode>
            <!-- /static/images/income/Aleo/inviteCustomers/logo.png -->
            <!-- @click="remake('qr6')" -->
            <!-- @complete="complete($event, 'qr6')" -->
          </view>
          <view class="msg" @click="save('qr6')">
            <view class="download-icon"></view>
            {{ $t("Aleo.InviteCustomers.download-QRcode") }}
          </view>
          <view class="invite-url-block">
            <text class="invite-title">{{ $t("Aleo.InviteCustomers.inviteLink") }}</text>
            <text class="invite-url">{{ inviteLink }}</text>
            <view class="copy-icon" @click="copylink"></view>
          </view>
        </view>
      </view>

      <view class="uni-btn-v">
        <button type="primary" @click="ShareLink" class="uni-btn-add">
          {{ $t("Aleo.InviteCustomers.shareLink") }}
        </button>
      </view>
    </view>

    <view class="group_4 flex-col" v-if="openlink">
      <view class="group_5 flex-row justify-between">
        <text class="text_10">{{ $t("common.fenxiangzhi") }}</text>
        <view class="icon_1 flex-col" @click="openlink = false"></view>
      </view>
      <view class="group_6 flex-row justify-between">
        <view class="image-text_2 flex-col justify-between" @click="copy">
          <view class="icon_2 flex-col"></view>
          <text class="text-group_3">{{ $t("common.fuzhilianjie") }}</text>
        </view>
        <view class="image-text_3 flex-col justify-between" @click="shareweixin">
          <view class="icon_3 flex-col"></view>
          <text class="text-group_4">{{ $t("common.weixinhaoyou") }}</text>
        </view>
      </view>
    </view>

    <view class="mask" v-if="openlink" @click="openlink = false" @touchmove="false"></view>
  </view>
</template>

<script>
// #ifdef APP-PLUS
import APPUpdate from "@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate";
// 分享
import appShare, { closeShare } from "@/uni_modules/zhouWei-APPshare/js_sdk/appShare";
// #endif
export default {
  data() {
    return {
      // 记录触发了几次需要更新APP
      appUpdate: 0,
      userToken: "",
      productList: [],
      productNameList: [],
      productCodeList: [],
      inputEquipmentName: "",
      // 邀请码(假数据 )
      fake: "HadaMeta",
      // 裝從接口獲取到的邀请码
      inviteCode: "HadaMeta",
      // 二维码大小(px)
      size: 200,
      // 邀请链接
      // inviteLink: 'http://18.141.18.249:8889/join',
      inviteLink: "",
      openlink: false,
    };
  },
  onLoad(options) {
    try {
      const value = uni.getStorageSync("token");
      if (value) {
        // 获取token
        this.userToken = value;
      }
    } catch (e) {
      // error
    }
    // 获取Aleo邀請客戶的邀請碼
    this.getAleoInviteCode();
  },
  onShow() {
    // 获取邀请链接
    uni.request({
      url: this.host + "/app/inviteUrl",
      method: "GET",
      header: {
        //token
        "x-token": uni.getStorageSync("token"),
        //version
        version: this.version,
      },
      success: (res) => {
        // code为0为成功
        if (res.data.code != 0) {
          if (res.data.code == 2) {
            console.log("需要更新版本");
            this.appUpdate++;
            // 控制只出现一次弹窗
            if (this.appUpdate >= 0 && this.appUpdate < 2) {
              // #ifdef APP-PLUS
              APPUpdate(true);
              // #endif
            }
          }
          return;
        }
        if (res.data.code == 0) {
          // 從接口獲取到的邀请码存入inviteCode
          this.inviteLink = res.data.data;
        }
      },
    });
  },
  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    // 邀请记录文字被点击
    onInviteRecordClick() {
      uni.navigateTo({
        url: "/pages/income/AleoIncome/inviteCustomersRecord",
      });
    },
    // 获取Aleo邀請客戶的邀請碼，product_id固定為2
    getAleoInviteCode() {
      uni.request({
        url: this.host + "/app/invitation_code?product_id=2",
        method: "GET",
        header: {
          //token
          "x-token": this.userToken,
          //version
          version: this.version,
        },
        success: (res) => {
          // code为0为成功
          if (res.data.code != 0) {
            if (res.data.code == 2) {
              console.log("需要更新版本");
              this.appUpdate++;
              // 控制只出现一次弹窗
              if (this.appUpdate >= 0 && this.appUpdate < 2) {
                // #ifdef APP-PLUS
                APPUpdate(true);
                // #endif
              }
            }
            return;
          }
          if (res.data.code == 0) {
            // 從接口獲取到的邀请码存入inviteCode
            this.inviteCode = res.data.data;
          }
        },
      });
    },
    copy() {
      uni.setClipboardData({
        data: this.inviteLink,
        success: (res) => {},
        fail: (res) => {},
      });
      this.openlink = false;
    },
    // 复制链接
    copylink() {
      uni.setClipboardData({
        data: this.inviteLink,
        success: (res) => {},
        fail: (res) => {},
      });
    },
    // 点击复制按钮
    onCopyBtnClick() {
      // 使用uniapp自带的api
      uni.setClipboardData({
        data: this.inviteCode,
        success: (res) => {},
        fail: (res) => {},
      });
      //  // 使用native.js
      //  //#ifdef APP-PLUS
      // try{
      //  // 获取手机操作系统
      //  const os = plus.os.name;
      //  // 想要复制到系统剪贴板的内容
      //  let text = this.inviteCode;

      //  if('iOS' == os){
      //  const pasteboard = plus.ios.invoke('UIPasteboard', 'generalPasteboard');
      //  plus.ios.invoke(pasteboard, 'setValue:forPasteboardType:', text, 'public.utf8-plain-text');
      //  }else{
      //  const main = plus.android.runtimeMainActivity();
      //  const clip = main.getSystemService('clipboard');
      //  plus.android.invoke(clip, 'setText', text);
      //  }
      // }catch(e){
      //  console.error('error @setClipboardText!!');
      // }
      //  //#endif
    },
    // 二维码生成回调
    // complete(e, refName) {
    //   if (e.success) {
    //   } else {
    //   }
    // },
    // 刷新二维码
    remake(refName) {
      const ref = this.$refs[refName];
      /* ref通过v-for遍历后会自动包裹在数组里，所以要判断一下 */
      if (Array.isArray(ref)) {
        ref[0].remake();
      } else {
        ref.remake();
      }
    },
    // 保存二维码
    save(refName) {
      uni.showLoading({
        title: this.$t("common.saveing"),
        mask: true,
      });
      const ref = this.$refs[refName];
      /* ref通过v-for遍历后会自动包裹在数组里，所以要判断一下 */
      if (Array.isArray(ref)) {
        ref[0].save({
          success: (res) => {
            uni.hideLoading();
            uni.showToast({
              icon: "success",
              title: this.$t("common.save-success"),
            });
          },
          fail: (err) => {
            uni.showToast({
              icon: "none",
              title: JSON.stringify(err),
            });
          },
        });
      } else {
        ref.save({
          success: (res) => {
            uni.hideLoading();
            uni.showToast({
              icon: "success",
              title: this.$t("common.save-success"),
            });
          },
          fail: (err) => {
            uni.showToast({
              icon: "none",
              title: JSON.stringify(err),
            });
          },
        });
      }
    },
    // 分享链接
    ShareLink() {
      this.openlink = true;

      // // #ifdef APP-PLUS
      // let shareData = {
      //     shareUrl:"https://kemean.com/",
      //     shareTitle:"分享的标题",
      //     shareContent:"分享的描述",
      //     shareImg:"http://qn.kemean.cn//upload/202004/18/1587189024467w6xj18b1.jpg",
      // };
      // // 调用
      // let shareObj = appShare(shareData,res => {
      //     console.log("分享成功回调",res);
      //     // 分享成功后关闭弹窗
      //     // 第一种关闭弹窗的方式
      //     closeShare();
      // });
      // // setTimeout(() => {
      // //     // 第二种关闭弹窗的方式
      // //     shareObj.close();
      // // },5000);
      // // #endif
    },

    shareweixin() {
      uni.setClipboardData({
        data: this.inviteLink,
        showToast: false,
        success: (res) => {},
        fail: (res) => {},
      });
      // #ifdef APP-PLUS
      plus.runtime.openURL("weixin://", function (res) {
        console.log(res);
      });
      // #endif
    },
  },
};
</script>

<style lang="less">
@import "@/static/css/common.css";
page {
  position: relative;
  background-image: url("@/static/images/income/Aleo/inviteCustomers/backbg.png");
  background-size: cover;
  background-repeat: no-repeat;
}
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
}
</style>

<style lang="less" scoped>
@import "@/static/css/MainColor.less";
// 导航栏css
.box-bg {
  z-index: 998;
  position: relative;
  .nav-title {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
    padding-top: var(--status-bar-height);
    z-index: 50;
    // background-color: transparent;
    background-color: #ffffff;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .iconLeft {
      position: absolute;
      top: calc(var(--status-bar-height) + 14rpx);
      bottom: 10rpx;
      left: 40rpx;
    }

    .iconRight {
      position: absolute;
      top: calc(var(--status-bar-height) + 14rpx);
      bottom: 10rpx;
      right: 40rpx;
    }

    .text {
      margin-top: 18rpx;
      margin-bottom: 24rpx;
      text {
        margin-right: 12rpx;
        font-size: 34rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #242733;
      }
    }

    // 邀请记录
    .invite-record {
      z-index: 999;
      position: absolute;
      top: calc(var(--status-bar-height) + 20rpx);
      right: 42rpx;
      text {
        font-size: 30rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        // color: #009bf9;
        color: @main-color;
      }
    }
  }
}

.content {
  // margin: 205rpx auto 0rpx;
  margin: 45rpx auto;
  width: 700rpx;
  height: 1301rpx;
  background-image: url("@/static/images/income/Aleo/inviteCustomers/aleobg.png");
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  // 上方文字
  .uni-form-item {
    margin-top: 60rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  // qrcode
  .uni-form-item1 {
    margin-top: 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

// 下载二维码按钮
.uni-btn-v {
  position: absolute;
  bottom: 50rpx;
  left: 10rpx;
  right: 10rpx;
  // width: 750rpx;
  height: 90rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  .uni-btn-add {
    width: 573rpx;
    border-radius: 100rpx;
    // background-color: #009bf9;
    background-color: @main-color;
    text {
      font-size: 32rpx;
      font-family: AlibabaPuHuiTiM;
      color: #ffffff;
    }
  }
}

// 我的邀请码文字
.myInviteCodeTitle {
  margin-top: 16rpx;
  margin-bottom: 32rpx;
  display: block;
  font-size: 34rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #2e334e;
}
.myInviteCode {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // 输入框整体
  /deep/ .uni-input {
    width: 70vw;
    background-color: rgba(245, 249, 250, 1);
    border-radius: 100rpx;
    height: 106rpx;
    // padding-top: 24rpx;
    // padding-bottom: 24rpx;
    text-align: center;
    color: #9ea3bb;
    // placeholder提示
    /deep/ .uni-input-wrapper {
      font-size: 45rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #9ea3bb;
    }
  }
  // 复制按钮
  .copyBtn {
    max-resolution: 10rpx;
    // width: 200rpx;
    background-color: #ffffff;
    .copy {
      font-size: 34rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      // color: #009bf9;
      color: @main-color;
      // text-decoration-line: underline;
      // border-bottom: 2rpx solid #009bf9;
      border-bottom: 2rpx solid @main-color;
    }
  }
}

// 二维码整体
.qrcode-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx 30rpx 60rpx;
  margin-top: 30rpx;

  // background-color: #ffffff;
  .qrcode {
    padding: 16rpx;
    background-color: #ffffff;
    // box-shadow: 0 6rpx 12rpx rgba(0, 0, 0, 0.1);
    border-radius: 2rpx;
    overflow: hidden;
  }
  // 下载二维码
  .msg {
    margin-top: 40rpx;
    font-size: 30rpx;
    color: #2e334e;
    display: flex;
    justify-content: space-around;
    .download-icon {
      width: 40rpx;
      height: 40rpx;
      background: url("@/static/images/income/Aleo/inviteCustomers/xiazai.png");
      background-size: 100% 100%;
    }
  }

  // 邀请链接
  .invite-url-block {
    width: 100%;
    border: 2rpx solid #F5F9FA;
    border-radius: 12rpx;
    display: flex;
    flex-direction: column;
    padding: 20rpx 20rpx;
    margin-top: 40rpx;
    word-break: break-all;
    position: relative;
  
    .invite-title {
      color: #9ea3bb;
      font-size: 26rpx;
      margin-bottom: 16rpx;
    }
  
    .invite-url {
      font-size: 22rpx;
      color: #2E334E;
    }
  }

  .copy-icon {
    width: 34rpx;
    height: 34rpx;
    background: url("@/static/images/income/Aleo/inviteCustomers/copy.png");
    background-size: 100% 100%;
    position: absolute;
    right: 20rpx;
    top: 20rpx;
  }

  .save {
    margin-top: 10rpx;
  }
}

.mask {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}
.group_4 {
  background-color: rgba(255, 255, 255, 1);
  border-radius: 12px 12px 0px 0px;
  position: fixed;
  z-index: 1000;
  bottom: 0;
  height: 333rpx;
  width: 100%;
  // animation: bottompopOpen 0.2s linear alternate;
}

// @keyframes bottompopOpen {
// 	0%{
// 		bottom: -333rpx;
// 	}
// 	30%{
// 		bottom: -222rpx;
// 	}
// 	60%{
// 		bottom: -111rpx;
// 	}
// 	100%{
// 		bottom: 0;
// 	}
// }

.group_5 {
  width: 680rpx;
  height: 44rpx;
  margin: 35rpx 0 0 35rpx;
}

.text_10 {
  width: 84rpx;
  height: 40rpx;
  overflow-wrap: break-word;
  color: rgba(136, 141, 167, 1);
  font-size: 28rpx;
  font-family: PingFang-SC-Medium;
  text-align: left;
  white-space: nowrap;
  line-height: 40rpx;
  margin-top: 2rpx;
}

.icon_1 {
  width: 44rpx;
  height: 44rpx;
  background: url("@/static/cha.png") 100% no-repeat;
  background-size: 100% 100%;
}

.group_6 {
  width: 273rpx;
  height: 129rpx;
  margin: 40rpx 0 85rpx 35rpx;
}

.image-text_2 {
  width: 104rpx;
  height: 129rpx;
}

.icon_2 {
  width: 80rpx;
  height: 80rpx;
  background: url("@/static/link.png") 100% no-repeat;
  background-size: 100% 100%;
  margin-left: 12rpx;
}

.text-group_3 {
  width: 104rpx;
  height: 37rpx;
  overflow-wrap: break-word;
  color: rgba(136, 141, 167, 1);
  font-size: 26rpx;
  font-family: PingFang-SC-Medium;
  text-align: left;
  white-space: nowrap;
  line-height: 37rpx;
  margin-top: 12rpx;
}

.image-text_3 {
  width: 104rpx;
  height: 129rpx;
}

.icon_3 {
  width: 80rpx;
  height: 80rpx;
  background: url("@/static/weixin.png") 100% no-repeat;
  background-size: 100% 100%;
  margin-left: 12rpx;
}

.text-group_4 {
  width: 104rpx;
  height: 37rpx;
  overflow-wrap: break-word;
  color: rgba(136, 141, 167, 1);
  font-size: 26rpx;
  font-family: PingFang-SC-Medium;
  text-align: left;
  white-space: nowrap;
  line-height: 37rpx;
  margin-top: 12rpx;
}
</style>
