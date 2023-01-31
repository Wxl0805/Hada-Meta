<template>
  <view class="equip-info-content">
    <view class="title">
      <view class="GPU-name">
        <text>{{ equipmentGPUInfo.GPUName }}</text>
      </view>
      <view class="temperature">
        <view>
          <text>{{ equipmentGPUInfo.temperature }}°C</text>
        </view>
        <view>
          <text>显存 {{ equipmentGPUInfo.memorySize }}M 5%</text>
        </view>
      </view>
    </view>

    <view class="bottom">
      <view class="hashrate">
        <text>{{ equipmentGPUInfo.hashRate }}</text>
        <text>MH/s</text>
        <text>97%</text>
      </view>
      <view class="power"><text>500</text><text>W</text></view>
      <view class="other">
        <text>{{ equipmentGPUInfo.fanSpeed }}</text>
        <text>RPM/s</text>
        <text>(80%)</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    equipmentGPUInfo: {
      type: Object,
    },
  },
  data() {
    return {
      GPUInfo: {
        GPUName: "Geforce RTX 3090",
        temperature: "90",
        memorySize: "5",
        hashRate: "50.6",
        power: "500",
        fanSpeed: "500",
      },
    };
  },
};
</script>

<style lang="less" scoped>
.equip-info-content {
  width: 702rpx;
  // border-radius: 12rpx;
  background-color: #ffffff;

  padding-top: 46rpx;
  padding-bottom: 46rpx;
  // margin-bottom: 10rpx;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .title {
    width: 702rpx;

    margin-top: 12rpx;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    // RTX 3080
    .GPU-name {
      margin-left: 32rpx;
      text {
        font-size: 28rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #2e334e;
      }
    }

    .temperature {
      margin-right: 32rpx;

      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      text {
        color: #2e334e;
      }
      // 90 C
      view:first-child {
        background-color: #fa8001;
        display: flex;
        align-items: center;
        padding: 4rpx 6rpx;
        text {
          font-size: 24rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ffffff;
        }
      }
      // 显存 5M 5%
      view:last-child {
        text {
          font-size: 28rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
        }
      }
    }
  }

  .bottom {
    width: 702rpx;

    margin-bottom: 12rpx;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .hashrate {
      margin-left: 32rpx;

      text {
        color: #2e334e;
      }
      // 50.6
      text:nth-of-type(1) {
        color: rgba(82, 196, 26, 1);
        font-size: 26rpx;
        font-family: PingFangSC-Medium;
      }
      // MH/s
      text:nth-of-type(2) {
        color: rgba(136, 141, 167, 1);
        font-size: 26rpx;
        font-family: PingFangSC-Medium;
      }
      // 97%
      text:nth-of-type(3) {
        color: rgba(136, 141, 167, 1);
        font-size: 26rpx;
        font-family: PingFangSC-Medium;
      }
    }
    .power {
      // 500
      text:first-of-type {
        color: rgba(0, 155, 249, 1);
        font-size: 26rpx;
        font-family: PingFangSC-Medium;
      }
      // w
      text:last-of-type {
        color: rgba(0, 155, 249, 1);
        font-size: 26rpx;
        font-family: PingFangSC-Medium;
      }
    }
    .other {
      margin-right: 32rpx;

      text {
        color: #2e334e;
        font-size: 26rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #888da7;
      }
      // 500
      text:nth-of-type(1) {
        // font-size: 28rpx;
      }
      // RPM/s
      text:nth-of-type(2) {
        // font-size: 24rpx;
      }
      // (80%)
      text:nth-of-type(3) {
        // font-size: 24rpx;
      }
    }
  }
}
</style>
