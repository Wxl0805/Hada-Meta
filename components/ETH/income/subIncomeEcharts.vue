<template>
  <view class="content">
    <view class="title">
      <text>{{ $t('ETH.SubAccount.SubIncomeEcharts.title') }}</text>
      <text>{{ $t('ETH.SubAccount.SubIncomeEcharts.unit')}}：{{ unit }}</text>
    </view>
    <l-echart ref="chart" class="echarts"></l-echart>
  </view>
</template>

<script>
import * as echarts from "echarts";
export default {
  props: {
    xData: Array,
    yData: Array,
    unit: String,
  },
  data() {
    return {
      option: {
        color: ["#009BF9", "#37FFFC"],
        tooltip: {
          trigger: "axis",
        },
        legend: {
          show: false,
          bottom: "5%",
          left: "center",
        },
        grid: {
          left: "16%",
          right: "10%",
          top: "10%",
          bottom: "20%",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.xData,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            //x轴文字的配置
            show: true,
            textStyle: {
              color: "#888DA7",
            },
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            //y轴文字的配置
            show: true,
            textStyle: {
              color: "#888DA7",
            },
          },
          splitLine: {
            //分割线配置
            show: true,
            lineStyle: {
              color: "#f5f9fa",
            },
          },
        },
        series: [
          {
            type: "line",
            smooth: true,
            showSymbol: false,
            data: this.yData,
          },
        ],
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.chart.init(echarts, (chart) => {
        chart.setOption(this.option);
      });
    });
  },
};
</script>

<style lang="less" scoped>
	@import "@/static/css/MainColor.less";
.content {
  padding: 20rpx;
  // padding-right: 0rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  .title {
    margin-top: 10rpx;

    width: 700rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // border-left: 10rpx solid #009bf9;
    text:first-child {
      padding-left: 33rpx;
      font-size: 34rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #000000;
    }
    text:last-child {
      margin-right: 42rpx;
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #888da7;
    }
  }
  .echarts {
    width: 700rpx;
    height: 500rpx;
  }
}
</style>
