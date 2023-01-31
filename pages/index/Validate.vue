<template>
  <view class="page flex-col">
    <view class="group27 flex-row">
      <view class="main4 flex-col">
        <view class="mod18 flex-col">
          <view class="outer16 flex-row"></view>

          <view class="bd2 flex-col" @click="back"></view>
          <view class="TextGroup5 flex-col justify-between">
            <text class="txt1">{{ $t("signcount.title") }}</text>

            <!-- 发送验证码到邮箱 -->
            <view class="layer1" v-if="vali">
              <text class="info2">{{ $t("signcount.title-bottom") }}</text>
              <text class="word2">{{ Str }}</text>
            </view>

            <!-- 发送验证码到手机 -->
            <view class="layer1" v-else>
              <text class="info2">{{ $t("signcount.title-bottom-tel") }}</text>
              <text class="word2">+{{ zone }}&nbsp;{{ Str }}</text>
            </view>
          </view>

          <view class="outer17 flex-row">
            <xt-verify-code v-model="verifyCode"></xt-verify-code>
          </view>

          <view class="info5">
            <button class="btn-vali" :class="{ style: styles }" :disabled="forbidden" @click="sendvalidate">{{ valinum }}</button>
          </view>

          <view class="goup"></view>

          <view class="Button1 flex-col" @click="submit">
            <text class="word8">{{ $t("common.next") }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
// #ifdef APP-PLUS
import APPUpdate from "@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate";
// #endif
export default {
  data() {
    return {
      verifyCode: null,
      vali: true,
      Str: "",
      zone: "86",
      valinum: this.$t("common.sendcode"),

      forbidden: false,
      styles: false,
      defaultnum: 0,
      // 记录触发了几次需要更新APP
      appUpdate: 0,
	  // 用于判断是哪个系统
	  system: 0,
    };
  },
  onLoad(option) {
    let strvalue = option.value;
    let strfront = option.telfront;
    this.Str = strvalue;
    if (strvalue.indexOf("@") != -1) {
      this.vali = true;
    } else {
      this.vali = false;
      this.zone = strfront;
    }
    this.msg();
    if (option.msg == "操作成功") {
      uni.showToast({
        title: this.$t("common.send-success"),
        icon: "none",
      });
    }
    if (option.msg == "验证码还在有效期内，请勿重复发送") {
      uni.showToast({
        title: this.$t("common.sendcode-error"),
        icon: "none",
      });
    }
  },
  onShow() {
  	// 判断是安卓还是ios
  	const platform = uni.getSystemInfoSync().platform;
  	if (platform == "android") {
  	  this.system = 0;
  	} else {
  	  this.system = 1;
  	}
  },

  methods: {
    sendEmail() {
      uni.showLoading({
        mask: true,
        title: this.$t("common.send"),
      });
      uni.request({
        header: {
          "Content-Type": "application/json",
          //version
          version: this.version,
        },
        url: this.host + "/base/send_email_code/?email=" + this.Str + "&operatingSystem=" + this.system,
        method: "GET",
        data: {},
        dataType: "json",
        success: (res) => {
          if (res.data.code == 2) {
            console.log("需要更新版本");
            this.appUpdate++;
            // 控制只出现一次弹窗
            if (this.appUpdate >= 0 && this.appUpdate < 2) {
              // #ifdef APP-PLUS
              APPUpdate(true);
              // #endif
            }
            return;
          }
          this.styles = true;
          this.forbidden = true;
          let num = 60;
          let run = setInterval(() => {
            this.valinum = num + this.$t("common.chongfa");
            num--;
            if (num == -1) {
              clearInterval(run);
              this.valinum = this.$t("common.sendcode");
              this.styles = false;
              // this.errorBind = false;
              this.forbidden = false;
            }
          }, 1000);
          if (res.data.msg == "操作成功") {
            uni.showToast({
              title: this.$t("common.send-success"),
              icon: "none",
            });
            return;
          }
          if (res.data.msg == "验证码还在有效期内，请勿重复发送") {
            uni.showToast({
              title: this.$t("common.sendcode-error"),
              icon: "none",
            });
            return;
          }
        },
        fail() {
          uni.showToast({
            icon: "none",
            title: res.data.msg,
          });
        },
        complete: () => {
          uni.hideLoading();
        },
      });
    },
    sendTel() {
      uni.showLoading({
        mask: true,
        title: this.$t("common.send"),
      });
      uni.request({
        header: {
          "Content-Type": "application/json",
          //version
          version: this.version,
        },
        url: this.host + "/base/sendsms?phone=" + this.Str + "&operatingSystem=" + this.system,
        method: "GET",
        data: {},
        dataType: "json",
        success: (res) => {
          if (res.data.code == 2) {
            console.log("需要更新版本");
            this.appUpdate++;
            // 控制只出现一次弹窗
            if (this.appUpdate >= 0 && this.appUpdate < 2) {
              // #ifdef APP-PLUS
              APPUpdate(true);
              // #endif
            }
            return;
          }
          this.styles = true;
          this.forbidden = true;
          let num = 60;
          let run = setInterval(() => {
            this.valinum = num + this.$t("common.chongfa");
            num--;
            if (num == -1) {
              clearInterval(run);
              this.valinum = this.$t("common.sendcode");
              this.styles = false;
              // this.errorBind = false;
              this.forbidden = false;
            }
          }, 1000);
          if (res.data.msg == "操作成功") {
            uni.showToast({
              title: this.$t("common.send-success"),
              icon: "none",
            });
            return;
          }
          if (res.data.msg == "验证码还在有效期内，请勿重复发送") {
            uni.showToast({
              title: this.$t("common.sendcode-error"),
              icon: "none",
            });
            return;
          }
        },
        fail() {
          uni.showToast({
            icon: "none",
            title: res.data.msg,
          });
        },
        complete: () => {
          uni.hideLoading();
        },
      });
    },
    submit() {
      if (this.vali == true) {
        uni.showLoading({
          mask: true,
          title: this.$t("common.wait"),
        });
        uni.request({
          header: {
            "Content-Type": "application/json",
            "x-token": uni.getStorageSync("token"),
            //version
            version: this.version,
          },
          // http://127.0.0.1:8887/base/check_email_code/376462759@qq.com/372740
          url: this.host + "/base/check_email_code/" + this.Str + "/" + this.verifyCode + "?operatingSystem=" + this.system,
          method: "GET",
          data: {},
          dataType: "json",
          success: (res) => {
            if (res.data.code == 0) {
              uni.navigateTo({
                url: `/pages/index/SignCount?email=${this.Str}&code=${this.verifyCode}`,
                success(res) {},
                fail(res) {},
              });
            } else {
              if (res.data.code == 2) {
                console.log("需要更新版本");
                this.appUpdate++;
                // 控制只出现一次弹窗
                if (this.appUpdate >= 0 && this.appUpdate < 2) {
                  // #ifdef APP-PLUS
                  APPUpdate(true);
                  // #endif
                }
                return;
              }
              uni.showToast({
                icon: "none",
                title: this.$t("common.vericode-error"),
              });
            }
            // this.$router.push('/pages/index/SignCount')
          },
          fail() {
            // 验证失败
            uni.showToast({
              icon: "none",
              title: this.$t("common.error-veri-code"),
            });
          },
          complete: () => {
            uni.hideLoading();
          },
        });
      } else {
        uni.showLoading({
          mask: true,
          title: this.$t("common.wait"),
        });
        uni.request({
          header: {
            "Content-Type": "application/json",
            "x-token": uni.getStorageSync("token"),
            //version
            version: this.version,
          },
          // http://192.168.3.33:8887/base/check_sms_code/13311714408/29770
          url: this.host + "/base/check_sms_code/" + this.Str + "/" + this.verifyCode + "?operatingSystem=" + this.system,
          method: "GET",
          data: {},
          dataType: "json",
          success: (res) => {
            if (res.data.code == 0) {
              uni.navigateTo({
                url: `/pages/index/SignCount?tel=${this.Str}&code=${this.verifyCode}`,
                success(res) {},
                fail(res) {},
              });
            } else {
              if (res.data.code == 2) {
                console.log("需要更新版本");
                this.appUpdate++;
                // 控制只出现一次弹窗
                if (this.appUpdate >= 0 && this.appUpdate < 2) {
                  // #ifdef APP-PLUS
                  APPUpdate(true);
                  // #endif
                }
                return;
              }
              uni.showToast({
                icon: "none",
                title: this.$t("common.vericode-error"),
              });
            }
            // this.$router.push('/pages/index/SignCount')
          },
          fail() {
            // 验证失败
            uni.showToast({
              icon: "none",
              title: this.$t("common.error-veri-code"),
            });
          },
          complete: () => {
            uni.hideLoading();
          },
        });
      }
    },
    back() {
      // uni.navigateTo({
      // 	url: '/pages/index/SignIn',
      // 	animationType:"slide-in-left",
      // 	success(res){
      // 	},
      // 	fail(res){
      // 	}
      // });
      uni.navigateBack({
        delta: 1,
      });
    },
    sendvalidate() {
      if (this.vali == true) {
        this.sendEmail();
      } else {
        this.sendTel();
      }
    },
    msg() {
      this.styles = true;
      this.forbidden = true;

      let num = 60;
      let run = setInterval(() => {
        this.valinum = num + this.$t("common.chongfa");
        num--;
        if (num == -1) {
          clearInterval(run);
          this.valinum = this.$t("common.sendcode");
          this.styles = false;
          // this.errorBind = false;
          this.forbidden = false;
        }
      }, 1000);
    },
  },
};
</script>
<style scoped>
@import "@/static/css/common.css";
@import "@/static/css/inputvali.css";
.goup {
  height: 87rpx;
  margin: 35rpx 0 0 133rpx;
}
.btn-vali {
  width: 100%;
  height: 100%;
  font-size: 30rpx;
  line-height: 38rpx;
  border-radius: 10rpx;
}
uni-button:disabled {
  background-color: #ffffff;
}
uni-button[disabled]:not([type]) {
  background-color: #ffffff;
}
/* 提示信息弹窗 */
.popup-content {
  padding: 30rpx;
  color: #ffffff;
  .text {
    .icons {
      margin-right: 10rpx;
      size: 28rpx;
      display: inline-block;
      transform: rotate(180deg);
    }
  }
}
.style {
  color: rgba(0, 155, 249, 1);
}
</style>
