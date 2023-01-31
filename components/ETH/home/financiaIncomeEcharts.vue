<template>
  <view class="content">
    <view v-for="(info, index) in eInfo" :key="index" class="item">
      <view class="title">
        <text>{{ info.echartsName }}</text>
        <text
          >{{ $t("Home.ETH.FinancialNews.unit3") }}：
          <text v-if="!info.currIdx">{{ $t("Home.ETH.FinancialNews.unit1") }}</text>
          <text v-if="info.currIdx">{{ $t("Home.ETH.FinancialNews.unit2") }}</text>
        </text>
      </view>

      <!-- 选项卡组件 -->
      <view class="switch-content">
        <l-echart ref="chart" class="echarts"></l-echart>

        <view class="switch-title" @click="onclick(index)">
          <view @tap="tap(index)" v-for="(item, index) in list" :key="index" :class="[info.currIdx == index ? 'active' : '']">
            <text>{{ item.title }}</text>
            <view :class="[info.currIdx == index ? 'activeBz adeaduibz' : 'adeaduibz']"></view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import * as echarts from "echarts";

export default {
  props: {
    echartsInfo: {
      type: Array,
    },
    unit: {
      type: Array,
    },
    plus: {
      type: Number,
    },
  },
  data() {
    return {
      // 这里偷懒了，没用自定义事件或者eventBus来解决子传父的问题，之间利用复杂数据类型传的是地址来解决子传父的问题
      eInfo: this.echartsInfo,
      echartsDate: [],
      items: ["USD", "RMB"],
      // 当前v-for循环到的哪个组件的下标
      currentView: 0,
      flag: 0,
      list: [
        {
          title: "USD",
          name: "第一个",
        },
        {
          title: "RMB",
          name: "第二个",
        },
      ],
    };
  },
  methods: {
    // 获取组件内选项卡的下标并存到flag里面
    tap(index) {
      this.flag = index;
    },
    // 获取当前v-for循环到的哪个组件的下标并更新到currentView变量里
    // 并且更新echarts里的数据
    onclick(index) {
      // 更新currentView的值
      this.currentView = index;

      // 如果当前循环到的组件的currIdx!=选项卡里的flag,让他们相等
      if (this.eInfo[this.currentView].currIdx != this.flag) {
        this.eInfo[this.currentView].currIdx = this.flag;

        // 更新echarts里的值
        this.$refs.chart[this.currentView].init(echarts, (chart) => {
          const afterData = [];
          this.eInfo[this.currentView].USDdata.forEach((num) => {
            if (this.eInfo[this.currentView].currIdx == 1) {
              afterData.push(num * this.plus);
            }
            if (this.eInfo[this.currentView].currIdx == 0) {
              afterData.push(num);
            }
          });
          const changeOption = {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 1,
                  color: "#37FFFC", // 0% 处的颜色
                },
                {
                  offset: 0,
                  color: "#0DFF4B", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
            tooltip: {
              trigger: "axis",
            },
            legend: {
              show: false,
              bottom: "5%",
              left: "center",
            },
            grid: {
              left: "4%",
              right: "5%",
              top: "10%",
              bottom: "5%",
              containLabel: true,
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: this.echartsDate[index],
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
                name: this.$t("Home.ETH.FinancialNews.financialIncomeEcharts.echarts-tooltip"),
                type: "line",
                smooth: true,
                showSymbol: false,
                data: afterData,
              },
            ],
          };

          chart.setOption(changeOption, true);
        });
      }
    },
    // 获取echarts初始数据并放入图表
    setEchartsData() {
      // 因为此时在v-for里面,所以ref变成数组了,需要拿到下标!!!
      this.echartsInfo.forEach((item, index) => {
        // 获取数据
        // this.echartsData[index]=item.USDdata;
        const beforeData = [];
        item.USDdata.forEach((num) => {
          beforeData.push(num);
        });
        // 获取日期数据
        this.echartsDate[index] = item.date;

        const option = {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 1,
                color: "#37FFFC", // 0% 处的颜色
              },
              {
                offset: 0,
                color: "#0DFF4B", // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
          tooltip: {
            trigger: "axis",
            valueFormatter: (value) => parseFloat(value).toFixed(2),
          },
          legend: {
            show: false,
          },
          grid: {
            left: "6%",
            right: "5%",
            top: "10%",
            bottom: "5%",
            containLabel: true,
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: this.echartsDate[index],
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
              name: this.$t("Home.ETH.FinancialNews.financialIncomeEcharts.echarts-tooltip"),
              type: "line",
              smooth: true,
              showSymbol: false,
              data: beforeData,
            },
          ],
        };

        this.$refs.chart[index].init(echarts, (chart) => {
          chart.setOption(option);
        });
      });
    },
  },
  // watch: {
  //   // 监听单位变化,如果变了,那么重新加载echarts
  //   currentView(newVal, oldVal) {
  //     if (newVal !== oldVal) {
  //       this.$nextTick(() => {
  //         // 渲染圆环echarts
  //         this.renderCircleEcharts();
  //       });
  //     }
  //   },
  // },
  mounted() {
    // this.$nextTick(() => {
    //   this.setEchartsData();
    // setTimeout(() => {
    //   this.setEchartsData();
    // }, 100);
    // });
    //设置定时器，1s更新一次
  },
};
</script>

<style lang="less" scoped>
	@import "@/static/css/MainColor.less";
.item {
  margin: 20rpx;
  border: 4rpx solid #f2f2f2;
  border-radius: 12rpx;
  padding: 20rpx 0;
  // padding-right: 0rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #ffffff;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 32rpx;
    font-size: 34rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #2e334e;
    text:last-child {
      // font-size: 28rpx;
      // color: #666666;
      margin-right: 16rpx;
      // font-weight: 500;
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #888da7;
    }
  }

  // 选项卡css
  .switch-content {
    // echarts
    .echarts {
      width: 680rpx;
      height: 500rpx;
    }
    // 选项卡切换部分css
    .switch-title {
      display: flex;
      justify-content: space-around;
      // position: absolute;
      border-bottom: 2rpx solid #f1f1f3;
      margin-top: 24rpx;
      margin-bottom: 30rpx;
      view {
        // font-weight: 700;
        margin: 0 20rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
        text {
          display: block;
          text-align: center;
          line-height: 32rpx;
          font-size: 32rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
        }
        .adeaduibz {
          margin-top: 10rpx;
          width: 38rpx;
          height: 10rpx;
        }
      }
      .activeBz {
        // background-color: #009bf9;
        background-color: @main-color;
      }
      .active {
        // color: #009bf9;
        color: @main-color;
      }
    }
  }
}
</style>
