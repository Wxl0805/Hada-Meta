<template>
  <view class="content">
    <view class="status_bar"></view>

    <!-- 顶部导航栏 -->
    <view class="header-fixed">
      <uni-nav-bar height="118rpx" backgroundColor="#ffffff" left-icon="left" @clickLeft="back">
        <view class="header-title">
          <span>提现管理</span>
        </view>
      </uni-nav-bar>
    </view>

    <view class="all">
      <view class="currencyCategory" v-for="(value, key) in accounts" :key="key">
        <view class="ProductName" @click="withdraw(value.ID)">
          <text>{{ value.productName }}</text>
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
      accounts: [],
      // 记录触发了几次需要更新APP
      appUpdate: 0,
    };
  },
  onLoad() {
    uni.request({
      header: {
        "Content-Type": "application/json",
        "x-token": uni.getStorageSync("token"),
        //version
        version: this.version,
      },
      url: this.host + "/app/product/List",
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
        if (res.data.data) {
          this.accounts = res.data.data;
        }
      },
    });
  },
  methods: {
    withdraw(productid) {
      uni.navigateTo({
        url: "/pages/mine/WithDraw?productid=" + productid,
      });
    },
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
  },
};
</script>

<style>
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
  background-color: #ffffff;
  position: fixed;
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
page {
  background-color: rgba(243, 245, 247, 1);
}
.currencyCategory {
  width: 100%;
  height: 100rpx;
  background-color: #ffffff;
  border-top: 1px solid rgba(243, 245, 247, 1);
  line-height: 100rpx;
  padding-left: 20rpx;
  box-sizing: border-box;
}
.all {
  position: relative;
  top: calc(var(--status-bar-height) + 118rpx);
}
</style>
