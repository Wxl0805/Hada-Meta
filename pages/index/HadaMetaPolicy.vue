<template>
  <view class="content">
    <view v-html="doc"></view>
  </view>
</template>

<script>
// #ifdef APP-PLUS
import APPUpdate from "@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate";
// #endif
export default {
  data() {
    return {
      doc: "",
      // 记录触发了几次需要更新APP
      appUpdate: 0,
    };
  },
  onReady() {
    if (uni.getStorageSync("lang")) {
      if (uni.getStorageSync("lang") == "zh-Hant") {
        this.callinterface("YSZC_zh_HK");
        return;
      } else {
        this.callinterface("YSZC_zh_CN");
        return;
      }
    }
    if (uni.getSystemInfoSync().language == "zh-TW") {
      this.callinterface("YSZC_zh_HK");
      return;
    }
    if (uni.getSystemInfoSync().language == "zh-CN") {
      this.callinterface("YSZC_zh_CN");
      return;
    }
    this.callinterface("YSZC_zh_HK");
  },
  methods: {
    callinterface(value) {
      uni.showLoading({
        mask: true,
        title: this.$t("common.wait"),
      });
      uni.request({
        url: this.host + "/base1/get_agreement?title=" + value,
        header: {
          "Content-Type": "application/json",
          //version
          version: this.version,
        },
        method: "GET",
        data: "",
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
          this.doc = res.data.data;
        },
        complete: () => {
          uni.hideLoading();
        },
      });
    },
  },
};
</script>

<style>
.content {
  width: 100%;
  height: 100%;
  padding: 20rpx 20rpx 100rpx 20rpx;
  box-sizing: border-box;
  border-top: 1px solid #efece8;
  font-size: 30rpx;
}
</style>
