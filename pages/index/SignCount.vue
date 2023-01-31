<template>
  <view class="page flex-col">
    <view class="section3 flex-row"></view>

    <view class="outer2 flex-col" @click="back"></view>
    <text class="word1">{{ $t("signcount.title-header") }}</text>

    <uni-forms>
      <!-- 请输入用户名 -->
      <view class="outer3 setwidth setmargin">
        <uni-easyinput type="text" :inputBorder="false" v-model="name" :placeholder="$t('common.name-input')" class="nameinput" />
      </view>

      <!-- 请输入密码和重复密码 -->
      <view class="section4 flex-col">
        <!-- 请输入密码 -->
        <view class="outer3 setpassword setwidth">
          <uni-easyinput type="password" :inputBorder="false" v-model="password" :placeholder="$t('common.password-input')" />
        </view>

        <!-- 请重复输入密码 -->
        <view class="outer3 setpassword setwidth">
          <uni-easyinput type="password" :inputBorder="false" v-model="confirmpassword" :placeholder="$t('common.password-confirm-input')" />
        </view>
      </view>
    </uni-forms>

    <!-- 确认按钮 -->
    <view class="outer6 flex-col" @click="submit"
      ><text class="word4">{{ $t("common.confirm") }}</text></view
    >
  </view>
</template>
<script>
// #ifdef APP-PLUS
import APPUpdate from "@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate";
// #endif
export default {
  data() {
    return {
      name: "",
      password: "",
      confirmpassword: "",
      tel: "",
      email: "",
      code: "",
      // 记录触发了几次需要更新APP
      appUpdate: 0,
	  // 用于判断是哪个系统
	  system: 0,
    };
  },
  onLoad(option) {
    if (option.email) {
      this.email = option.email;
      this.code = option.code;
    } else {
      this.tel = option.tel;
      this.code = option.code;
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
    NameNull() {
      uni.showToast({
        icon: "none",
        title: this.$t("common.name-null"),
      });
    },

    PasswordNull() {
      uni.showToast({
        icon: "none",
        title: this.$t("common.password-null"),
      });
    },

    PasswordError() {
      uni.showToast({
        icon: "none",
        title: this.$t("common.password-confirmpassword"),
      });
    },

    Formaterror() {
      uni.showToast({
        icon: "none",
        title: this.$t("common.password-input"),
      });
    },

    SuccessSign() {
      if (this.email) {
        uni.showLoading({
          mask: true,
          title: this.$t("common.wait"),
        });
        uni.request({
          header: {
            "Content-Type": "application/json",
            //version
            version: this.version,
          },
          url: this.host + "/base/customer_register?operatingSystem=" + this.system,
          method: "POST",
          data: {
            email: this.email,
            passWord: this.password,
            nickName: this.name,
            emailCode: this.code,
          },
          dataType: "json",
          success: (res) => {
            if (res.data.code == 0) {
              uni.showToast({
                icon: "none",
                title: this.$t("common.signout-success"),
              });
              // this.$refs.popup.close();
              uni.navigateTo({
                url: "/pages/index/VerificationLogin?email=" + this.email,
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
                title: this.$t("common.signout-error"),
              });
            }
          },
          fail: (err) => {},
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
            //version
            version: this.version,
          },
          url: this.host + "/base/customer_register_phone?operatingSystem=" + this.system,
          method: "POST",
          data: {
            phone: this.tel,
            passWord: this.password,
            nickName: this.name,
            phoneCode: this.code,
          },
          dataType: "json",
          success: (res) => {
            if (res.data.code == 0) {
              uni.showToast({
                icon: "none",
                title: this.$t("common.signout-success"),
              });
              // this.$refs.popup.close();
              uni.navigateTo({
                url: "/pages/index/VerificationLogin?tel=" + this.tel,
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
                title: this.$t("common.signout-error"),
              });
            }
          },
          complete: () => {
            uni.hideLoading();
          },
        });
      }
    },

    submit() {
      // 姓名为空
      // 密码和确认密码同时为空
      // 密码和确认密码不一致
      // 请输入8-16位密码
      // 成功注册
      if (this.name == "") {
        this.NameNull();
        return;
      } else if (this.password == "" && this.confirmpassword == "") {
        this.PasswordNull();
        return;
      } else if (this.password != this.confirmpassword) {
        this.PasswordError();
        return;
      } else if (this.password == this.confirmpassword && (this.password.length < 8 || this.password.length > 16)) {
        this.Formaterror();
        return;
      } else {
        this.SuccessSign();
        return;
      }
    },
    back() {
      uni.navigateBack({
        delta: 1, //返回层数，2则上上页
      });
    },
  },
};
</script>
<style scoped>
@import "@/static/css/common.css";
@import "@/static/css/signinform.css";
.setpassword {
  margin: 0 0 32rpx 26rpx;
}
.setwidth {
  width: 635rpx;
}
.setmargin {
  margin-left: 58rpx;
}
.outer3 {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30upx;
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
</style>
