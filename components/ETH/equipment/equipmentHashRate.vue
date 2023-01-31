<template>
  <view class="content">
    <view class="title">
      <text>算力变化趋势图</text>
      <text>单位:MH/s</text>
    </view>
    <l-echart ref="chart" class="echarts"></l-echart>
  </view>
</template>

<script>
import * as echarts from "echarts";
export default {
  data() {
    return {};
  },
  mounted() {
    this.$refs.chart.init(echarts, (chart) => {
      const dataAxis = [
        "0:00",
        "1:00",
        "2:00",
        "3:00",
        "4:00",
        "5:00",
        "6:00",
        "7:00",
        "8:00",
        "9:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00",
        "次日0:00",
      ];
      const data = [
        220,
        182,
        191,
        234,
        290,
        330,
        310,
        123,
        442,
        321,
        90,
        149,
        210,
        122,
        133,
        334,
        198,
        123,
        125,
        220,
        198,
        123,
        125,
        220,
        320,
      ];
      // const yMax = 500;
      // const dataShadow = [];

      // for (let i = 0; i < data.length; i++) {
      // 	dataShadow.push(yMax);
      // }

      const option = {
        title: {
          // text: '算力变化趋势图',
          // subtext: 'Feature Sample: Gradient Color, Shadow, Click Zoom'
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          show: true,
          bottom: "5%",
          left: "center",
        },
        xAxis: {
          data: dataAxis,
          axisLabel: {
            inside: false,
            textStyle: {
              color: "#666666",
            },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          z: 10,
        },
        yAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: "#666666",
            },
          },
        },
        dataZoom: [
          {
            type: "inside",
          },
        ],
        series: [
          {
            name: "算力",
            type: "bar",
            showBackground: true,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#83bff6" },
                { offset: 0.5, color: "#188df0" },
                { offset: 1, color: "#188df0" },
              ]),
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#2378f7" },
                  { offset: 0.7, color: "#2378f7" },
                  { offset: 1, color: "#83bff6" },
                ]),
              },
            },
            data: data,
          },
        ],
      };

      chart.setOption(option);
      const zoomSize = 6;
      chart.on("click", function (params) {
        chart.dispatchAction({
          type: "dataZoom",
          startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
          endValue:
            dataAxis[
              Math.min(params.dataIndex + zoomSize / 2, data.length - 1)
            ],
        });
      });
    });
  },
};
</script>

<style lang="less" scoped>
.content {
  width: 702rpx;
  background-color: #ffffff;
  // margin: 0 20rpx;
  // border: 4rpx solid #f2f2f2;
  border-radius: 12rpx;
  // padding: 20rpx;
  // padding-left: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .title {
    width: 660rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // border-left: 10rpx solid #188df0;
    // padding-left: 10rpx;
    font-weight: 700;
    text:first-child {
      margin-top: 32rpx;
      margin-left: 12rpx;
      font-size: 34rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #000000;
    }
    // 单位
    text:last-child {
      margin-top: 32rpx;
      margin-right: 32rpx;
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #888da7;
    }
  }
  .echarts {
    height: 700rpx;
  }
}
</style>
