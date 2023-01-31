<template>
  <view class="subEquipInfo">
    <view class="title" @click="onSubEquipClick">
      <view class="title-content">
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

      <view class="state">
        <p class="normal" v-if="subEquipmentInfo.IfOnline == 1">在线</p>
        <p class="error" v-if="subEquipmentInfo.IfOnline == 0">
          <image
            src="@/static/images/equipment/subEquipment/error.png"
            class="error-img"
          />
          离线
        </p>
      </view>
    </view>

    <view class="hashRateContent">
      <view class="box1">
        <text ref="power"
          >{{ subEquipmentInfo.Power }}
          <p>W</p></text
        >
      </view>
      <view class="box2">
        <text ref="hashRate"
          >{{ (subEquipmentInfo.HashRate / 1000 / 1000).toFixed(2) }}
          <p>MH/s</p>
        </text>
      </view>
      <view class="box3">
        <text ref="power"
          >{{ subEquipmentInfo.Power }}
          <p>%</p></text
        >
      </view>
      <view class="box4">
        <view class="temperature">
          <view class="t-box">
            <text>
              {{ subEquipmentInfo.Temperature }}
              <p>°</p>
            </text>
          </view>
          <!-- echarts -->
          <l-echart ref="temperatureEcharts" class="echarts"></l-echart>
        </view>
      </view>
    </view>
    <!-- 重启设备按钮 -->
    <view
      class="resetBtn"
      v-if="subEquipmentInfo.IfOnline == 1"
      @click="resetEquipment(subEquipmentInfo)"
    >
      <button type="primary">
        <text class="word-btn-white">重启设备</text>
      </button>
    </view>
  </view>
</template>

<script>
import * as echarts from "echarts";
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
  mounted() {
    // 以下部分是equipment1div区域的柱状图echarts

    // // 获取接口 用户近24h算力
    // uni.request({
    //   url: this.host + "/app/hash/user/24H",
    //   method: "GET",
    //   header: {
    //     //token
    //     "x-token": this.userToken,
    //   },
    //   success: (res) => {
    let hash = [10, 30, 42, 31, 20, 76, 65, 36];
    let date = [0, 1, 2, 3, 4, 5, 6, 7];
    // // 如果不为空，存入数据
    // if (res.data.data !== null) {
    //   res.data.data.forEach((d) => {
    //     hash.unshift(d.HashRate);
    //     date.unshift(d.Hour);
    //     this.echartsData = hash;
    //     this.echartsDate = date;
    //   });
    // }
    // // 如果为空，存入24个0
    // if (res.data.data === null) {
    //   for (let i = 0; i < 24; i++) {
    //     hash.unshift(0);
    //     date.unshift(0);
    //   }
    //   this.echartsData = hash;
    //   this.echartsDate = date;
    // }

    const option = {
      tooltip: {
        show: false,
        trigger: "axis",
      },
      legend: {
        show: false,
      },
      grid: {
        // width:'40',
        height:'-20',
        top: "100%",
      },
      xAxis: {
        show: false,
        type: "category",
        boundaryGap: false,
        data: date,
      },
      yAxis: {
        show: false,
        type: "value",
      },
      series: [
        {
          name: "设备1",
          type: "bar",
          showSymbol: false,
          data: hash,
          itemStyle: {
            color: function (params) {
              let index_color = params.value;
              if (index_color <= 45) {
                return "#C9EFB6";
              } else if (index_color > 45 && index_color <= 75) {
                return "#F9BC65";
              } else if (index_color > 75) {
                return "#FB9266";
              }
            },
            borderRadius: 5,
          },
          barWidth: "5",
          barGap: "20%",
		  barMinHeight:"8"
        },
      ],
    };
    this.$nextTick(() => {
      this.$refs.temperatureEcharts.init(echarts, (chart) => {
        chart.setOption(option);
      });
    });

    // },
    // });
  },
};
</script>

<style lang="less" scoped>
	@import "@/static/css/MainColor.less";
// 设备详细信息模块
.subEquipInfo {
  background-color: #ffffff;
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
    }
    .title-content {
      .equipmentName {
        font-size: 34rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #000000;
        margin-left: 16rpx;
      }
      image {
        width: 32rpx;
        height: 32rpx;
      }
    }
  }
  .hashRateContent {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
    padding-bottom: 28rpx;
    // 有背景颜色的温度
    .temperature {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: flex-end;
      .t-box {
        border-radius: 6rpx;
        width: 56rpx;
        height: 36rpx;
        background-color: #fb9266;
        text-align: center;
        text {
          // padding-bottom: 16rpx;
          font-size: 22rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #000000;
          p {
            display: inline;
            font-size: 22rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #000000;
          }
        }
      }
      .echarts {
        width: 120rpx;
        height: 48rpx;
      }
    }
    view {
      display: flex;
      flex-direction: column;
      justify-content: center;
      // 大数字
      text:first-of-type {
        font-size: 28rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        // 单位
        p:first-child {
          display: inline-block;
          font-size: 26rpx;
          font-weight: 500;
        }
      }
    }
    // 功率和百分比
    .box1,
    .box3 {
      text {
        color: #888da7;
      }
    }
    .box1 {
      margin-left: 32rpx;
    }
    .box4 {
      margin-right: 32rpx;
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
  border-color: #f90000;
}
</style>
