<template>
  <view
    :class="
      subEquipmentInfo.IfOnline ? 'subEquipInfo' : 'subEquipInfo error-border'
    "
  >
    <view class="title">
      <!-- @click="onSubEquipClick" -->
      <view>
        <view>
          <image
            src="@/static/images/equipment/subEquipment/equipLogo.png"
          ></image>
        </view>
        <text class="equipmentName">
          <!-- 设备1（Hada1） -->
          {{ subEquipmentInfo.MachineName }}({{ subEquipmentInfo.Model }})
        </text>
      </view>
      <p class="normal" v-if="subEquipmentInfo.IfOnline == 1">在线</p>
      <p class="error" v-if="subEquipmentInfo.IfOnline == 0">
        <image
          src="@/static/images/equipment/subEquipment/error.png"
          class="error-img"
        />
        离线
      </p>
    </view>
    <view class="hashRateContent">
      <view class="box1">
        <p class="subTitle">
          <image
            src="@/static/images/equipment/subEquipment/shebeisuanli.png"
          />设备算力
        </p>
        <text ref="hashRate"
          >{{ (subEquipmentInfo.HashRate / 1000 / 1000).toFixed(2) }}
          <p>MH/s</p>
        </text>
      </view>
      <view class="box2">
        <p class="subTitle">
          <image
            src="@/static/images/equipment/subEquipment/shebeigonglv.png"
          />设备功率
        </p>
        <text ref="power"
          >{{ subEquipmentInfo.Power }}
          <p>W</p></text
        >
      </view>
    </view>
    <!-- 重启设备按钮 -->
    <view
      class="resetBtn"
      v-if="subEquipmentInfo.IfOnline == 0"
      @click="resetEquipment(subEquipmentInfo)"
    >
      <button type="primary">
        <text class="word-btn-white">重启设备</text>
      </button>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    subEquipmentInfo: {
      type: Object,
    },
    subIndex: {
      type: Number,
    },
  },
  data() {
    return {
      // 存一下信息共点进去查看设备算力详情的时候用
      nowSubInfo: this.subEquipmentInfo,
    };
  },
  methods: {
    // 点击设备进入设备详情页面
    onSubEquipClick(subEquipmentInfo) {
      uni.navigateTo({
        url:
          "../equipment/subEquipmentInfo?idx=" +
          encodeURIComponent(JSON.stringify(this.subIndex)),
        success(res) {
        },
        fail(res) {
        },
      });
    },
    // 重启设备按钮函数
    resetEquipment(info) {
      uni.request({
        header: {
          "Content-Type": "application/json",
          "x-token": uni.getStorageSync("token"),
        },
        url: this.host + "/app/machine/command/reboot/" + info.MachineCode,
        method: "GET",
        data: {},
        dataType: "json",
        success: (res) => {
          uni.showToast({
            title: "重启成功",
          });
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
	@import "@/static/css/MainColor.less";
// 设备详细信息模块
.subEquipInfo {
  background-color: #ffffff;
  border-width: 2rpx;
  border-style: solid;
  border-color: #f2f2f2;
  border-radius: 12rpx;
  margin: 0 20rpx;

  width: 702rpx;
  // height: 884rpx;
  .error {
    color: #f90000;
    display: flex;
    flex-direction: row;
    align-items: center;
    .error-img {
      margin-top: 4rpx;
      margin-right: 10rpx;
      width: 30rpx;
      height: 30rpx;
    }
  }
  .normal {
    // color: #009bf9;
    color: @main-color;
  }
  // 设备名称标题
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 40rpx 32rpx;
    view {
      display: flex;
      align-items: center;
      .equipmentName {
        font-size: 34rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #000000;
        margin-left: 16rpx;
      }
      p {
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        font-size: 30rpx;
      }
      image {
        width: 32rpx;
        height: 32rpx;
      }
    }
  }
  .hashRateContent {
    // background-color: #ffffff;
    // height: 600rpx;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr;
    margin-top: 12rpx;
    margin-bottom: 24rpx;
    view:nth-child(2n) {
      margin-left: 8rpx;
      margin-right: 24rpx;
    }
    view:nth-child(2n-1) {
      margin-left: 24rpx;
      margin-right: 8rpx;
    }
    view {
      width: 320rpx;
      height: 220rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      // padding-left: 40rpx;
      margin-top: 10rpx;
      margin-bottom: 10rpx;
      // border: 4rpx solid #f2f2f2;
      border-radius: 12rpx;
      background-size: cover;
      background-repeat: no-repeat;
      // 小标题
      .subTitle {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 28rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #888da7;
        margin-left: 24rpx;
        image {
          width: 60rpx;
          height: 60rpx;
          margin-right: 5rpx;
        }
      }
      // 大数字
      text:first-of-type {
        margin-left: 32rpx;
        color: #2e334e;
        font-size: 50rpx;
        font-weight: 700;
        // 单位
        p:first-child {
          display: inline-block;
          font-size: 26rpx;
          font-weight: 500;
          margin-left: 20rpx;
        }
      }
    }
    .box1 {
      grid-row-start: 1;
      grid-row-end: 1;
      grid-column-start: 1;
      grid-column-end: 2;
      // background-image: url('@/static/images/equipment/subEquipment/shebeisuanliBig.png');
    }
    .box2 {
      grid-row-start: 1;
      grid-row-end: 1;
      grid-column-start: 2;
      grid-column-end: 3;
      // background-image: url('@/static/images/equipment/subEquipment/shebeigonglvBig.png');
    }
  }
  .resetBtn {
    padding: 20rpx 31rpx;
    button {
      border-radius: 100rpx;
      // background: #009bf9;
      background: @main-color;
      .word-btn-white {
        width: 126rpx;
        height: 44rpx;
        font-size: 32rpx;
        font-family: AlibabaPuHuiTiM;
        color: #ffffff;
        line-height: 44rpx;
      }
    }
  }
}
// 异常边框颜色
.error-border {
  border: 1rpx solid #f90000;
}
</style>
