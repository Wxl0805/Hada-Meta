<template>
  <view class="content">
    <view class="block">
      <view class="header-title">
        <text>{{ $t("add.invitecode") }}</text
        ><span style="color: rgb(47, 172, 255);">*</span>
      </view>
      <view class="footer">
        <view class="footer-left-input">
          <input type="text" :adjust-position="false" v-model="invitecode" :placeholder="$t('add.invitecode-input')" />
        </view>
        <view class="footer-right-input">
          <view class="scan-img" @click="scan"></view>
        </view>
      </view>
    </view>

    <view class="bg">
      <view class="bg-title"></view>
      <view class="bg-text">{{ $t("common-identity.text") }}</view>
    </view>

    <view class="btn">
      <button @click="getcode">{{ $t("common.tijiao") }}</button>
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
      // 记录触发了几次需要更新APP
      appUpdate: 0,
      invitecode: "",
    };
  },
  methods: {
    // 获取邀请码
    getcode() {
      if (this.invitecode == "") {
        uni.showToast({
          icon: "none",
          title: this.$t("add.invitecode-input"),
        });
        return;
      }
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
        url: this.host + "/app/bind_Leader_Code?code=" + this.invitecode,
        // url: 'http://192.168.3.112:8888/app/bind_Leader_Code?code='+this.invitecode,
        method: "GET",
        data: {},
        dataType: "json",
        success: (res) => {
          if (res.data.code !== 0) {
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
            uni.showToast({
              icon: "none",
              title: this.$t("common.identity-success"),
            });
            uni.redirectTo({
              url: "/pages/income/AleoIncome/inviteCustomers",
            });
          } else {
            uni.showToast({
              icon: "none",
              title: this.$t("add.code-error"),
            });
          }
        },
        complete: () => {
          uni.hideLoading();
        },
      });
    },
    scan() {
      uni.navigateTo({
        url: "/pages/news/scan?text=" + this.textscan + "&type=" + this.typescan,
      });
    },
    otherFun(object) {
      if (object) {
        this.invitecode = object.result;
      } else {
        return;
      }
    },
  },
};
</script>

<style>
page {
  background-color: rgba(243, 245, 247, 1);
}
.content {
  width: 100%;
  /* height: 640rpx; */
  height: 200rpx;
  background-color: #ffffff;
  border-top: 1px solid rgba(243, 245, 247, 1);
  padding: 0 40rpx 0 40rpx;
  box-sizing: border-box;
}
.block {
  width: 100%;
  height: 200rpx;
  padding: 40rpx 0 0 0;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(243, 245, 247, 1);
}
.header-title {
  width: 100%;
  height: 60rpx;
  color: rgba(46, 51, 78, 1);
  font-size: 30rpx;
}
.footer {
  width: 100%;
  height: 100rpx;
  display: flex;
}
.footer-left-input > input {
  width: 100%;
  font-size: 30rpx;
}
.uni-input-placeholder {
  color: rgba(158, 163, 187, 1);
}
.footer-left-input {
  flex: 5;
  display: flex;
  justify-content: center;
  align-items: center;
  word-wrap: break-word;
  word-break: break-all;
  /* color: rgba(158, 163, 187, 1); */
  font-size: 30rpx;
}
.footer-right-input {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.scan-img {
  width: 40rpx;
  height: 40rpx;
  background: url("@/static/images/scan.png");
  background-size: 100% 100%;
}
.bg {
  width: 100%;
  height: 500rpx;
  margin-top: 100rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.bg-title {
  width: 400rpx;
  height: 400rpx;
  background: url("@/static/images/identity.png");
  background-size: 100% 100%;
}
.bg-text {
  font-size: 28rpx;
  color: #9ea3bb;
  margin-top: 30rpx;
}
.btn {
  margin-top: 300rpx;
  margin-bottom: 100rpx;
  background-color: rgb(47, 172, 255);
  border-radius: 100rpx;
  overflow: hidden;
  font-size: 30rpx;
}
.btn > button {
  color: #ffffff;
}
</style>
