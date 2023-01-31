<template>
  <view class="introduction">
    <view class="title">
      <view class="left">
        <text>{{ clientInfo.NickName }}</text>
        <text>(UID:{{ clientInfo.Uid }})</text>
      </view>
      <view class="right">
        <text>{{ clientInfo.totalG }}G</text>
      </view>
    </view>
    <view class="content">
      <view class="self">
        <text>{{ $t("Aleo.Metaverse.self") }}：</text>
        <text>{{ clientInfo.ChangeAmount }}</text>
      </view>
      <view class="customer">
        <text>{{ $t("Aleo.Metaverse.customer") }}：</text>
        <text>{{ clientInfo.InvitationAmountTotal }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    clientInfo: {
      type: Object,
    },
  },
  data() {
    return {
      // 客户信息(假数据)
      cInfo: {
        name: "Tom",
        code: "1707129",
        grossInvestment: 1000000,
        totalCommission: 100,
      },
    };
  },
};
</script>

<style lang="less">
page {
  position: absolute;
  // z-index: -999;
  background-color: #f3f5f7;
}
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
}
</style>

<style lang="less" scoped>
// 产品简介
.introduction {
  width: 700rpx;
  // margin: 10rpx 20rpx;
  background-color: #ffffff;
  border-radius: 12rpx;
  // padding: 24rpx 40rpx;
  .title {
    margin-top: 30rpx;
    margin-left: 40rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      text {
        display: inline-block;
        margin-left: 10rpx;
        font-size: 34rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #2e334e;
      }
      text:first-child {
        margin: 0rpx;
      }
    }
    .right {
      margin-right: 43rpx;
      text {
        font-size: 32rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #2e334e;
        line-height: 45rpx;
      }
    }
  }
  .content {
    margin: 30rpx 0rpx;
    margin-left: 40rpx;
    display: flex;
    // justify-content: space-between;
    text {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #888da7;
      line-height: 48rpx;
    }
    .self::before {
      content: "";
      background-image: url("@/static/images/income/Aleo/Metaverse/selfIcon.png");
      background-size: cover;
      display: inline-block;
      width: 45rpx;
      height: 45rpx;
      margin-right: 10rpx;
    }
    .customer::before {
      content: "";
      background-image: url("@/static/images/income/Aleo/Metaverse/customerIcon.png");
      background-size: cover;
      display: inline-block;
      width: 45rpx;
      height: 45rpx;
      margin-right: 10rpx;
    }
    .self {
      display: flex;
      align-items: center;
    }
    .customer {
      margin-left: 60rpx;
      display: flex;
      align-items: center;
    }
  }
}
</style>
