<template>
  <view class="content">
    <view
      v-for="(info, index) in subAccountIncomeInfo"
      :key="info.key"
      class="item"
    >
      <view class="title">
        <view>
          <image src="@/static/images/equipment/subEquipment/equipLogo.png"></image>
          <text> {{ info.productName }}</text>
        </view>
        <p
          @click="onSubAccountClick(index, info.productCode, info.productName)"
        >
          {{ $t('ETH.SubAccountIncome.detail') }}
        </p>
      </view>

      <view class="echartsContent">
        <view class="echarts">
          <l-echart ref="chart"></l-echart>
        </view>
        <view class="hashRateContent">
          <view>
            <text v-show="subAccountIncomeUnit == 'ETH'">{{
              info.EstimateCredit
            }}</text>
            <text v-show="subAccountIncomeUnit == 'RMB'">{{
              (info.EstimateCredit * ETHtoRMB).toFixed(2)
            }}</text>
            <text v-show="subAccountIncomeUnit == 'USD'">{{
              (info.EstimateCredit * ETHtoUSD).toFixed(2)
            }}</text>
            <p>{{$t('ETH.IncomeInfo.SubAccountIncome.financial-today')}}({{ subAccountIncomeUnit }})</p>
          </view>
          <view>
            <text v-show="subAccountIncomeUnit == 'ETH'">{{
              info.TotalCredit
            }}</text>
            <text v-show="subAccountIncomeUnit == 'RMB'">{{
              (info.TotalCredit * ETHtoRMB).toFixed(2)
            }}</text>
            <text v-show="subAccountIncomeUnit == 'USD'">{{
              (info.TotalCredit * ETHtoUSD).toFixed(2)
            }}</text>
            <p>{{$t('ETH.IncomeInfo.SubAccountIncome.SubIncomeTotal.financial-total')}}({{ subAccountIncomeUnit }})</p>
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
    subAccountIncomeInfo: {
      type: Array,
    },
    subAccountIncomeUnit: {
      type: String,
    },
    subAccountIncomeUrl: {
      type: String,
    },
  },
  data() {
    return {
      // 转换率
      USDtoRMB: 7,
      ETHtoUSD: 1200,
      echartsData: [],
    };
  },
  computed: {
    ETHtoRMB() {
      return this.ETHtoUSD * this.USDtoRMB;
    },
  },
  watch: {
    // 监听单位变化,如果变了,那么重新加载圆环echarts
    subAccountIncomeInfo(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$nextTick(() => {
          // 渲染圆环echarts
          this.renderCircleEcharts();
        });
      }
    },
  },
  methods: {
    //跳转到子账户收益详情页
    onSubAccountClick(index, code, name) {
      uni.navigateTo({
        url:
          this.subAccountIncomeUrl +
          "?productCode=" +
          code +
          "&productName=" +
          name,
        success(res) {
        },
        fail(res) {
        },
      });
    },
    // 圆环echarts
    renderCircleEcharts() {
      // 因为此时在v-for里面,所以ref变成数组了,需要拿到下标!!!
      this.subAccountIncomeInfo.forEach((item, index) => {
        //反方向剩下部分的样式
        const placeHolderStyle = {
          normal: {
            label: {
              show: false,
              position: "center",
            },
            labelLine: {
              show: false,
            },
            color: "#E9E9E9",
            borderColor: "#E9E9E9",
            borderWidth: 1,
          },
        };

        // 如果>1,有两个以上数据
        if (item.data.length > 1) {
          // 获取数据
          let newObj = {
            value: item.data[0].value,
            // value:5000-4000,
            itemStyle: placeHolderStyle,
          };

          this.echartsData[index] = [
            newObj,
            {
              value: item.data[1].value,
              // value: 4000,
            },
          ];
        } else {
          this.echartsData[index] = [{value:0,itemStyle: placeHolderStyle,}];
        }

        const option = {
          color: [
            {
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
                  color: "#009BF9", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          ],
          title: [
            {
              text: `{val|${item.YesterdayCredit}}\n{name|${this.$t('ETH.IncomeInfo.SubAccountIncome.SubIncomeTotal.financial-yesterday')}(${this.subAccountIncomeUnit})}`,
              top: "center",
              left: "center",
              textStyle: {
                rich: {
                  name: {
                    fontSize: 12,
                    fontWeight: 400,
                    color: "#888DA7",
                    padding: [4, 0],
                    fontFamily: "PingFangSC-Regular, PingFang SC",
                  },
                  val: {
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#2E334E",
                    fontFamily: "AlibabaPuHuiTiB",
                  },
                },
              },
            },
          ],
          tooltip: {
            show: false,
            trigger: "item",
          },
          series: [
            {
              type: "pie",
              clockwise: false, //顺时加载
              silent: "true", //图形是否不响应和触发鼠标事件
              // animation:false,
              force: {
                layoutAnimation: false,
              },
              radius: ["78%", "86%"],
              startAngle: 360,
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 4,
                borderColor: {
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
                      color: "#009BF9", // 100% 处的颜色
                    },
                  ],
                  global: false, // 缺省为 false
                },
                borderWidth: 8,
              },
              label: {
                show: false,
                position: "center",
              },
              labelLine: {
                show: false,
              },
              // data: [{ value: 1, itemStyle: placeHolderStyle }, 10],
              data: this.echartsData[index],
            },
          ],
        };

        // 把 echarts 传入
        this.$refs.chart[index].init(echarts, (chart) => {
          chart.setOption(option);
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
	@import "@/static/css/MainColor.less";
.item {
  margin: 20rpx auto;
  background-color: #ffffff;
  width: 702rpx;
  border-radius: 12rpx;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32rpx 32rpx;
    // border-bottom: 1px solid #f2f2f2;
    view {
      display: flex;
      align-items: center;
      text {
        font-size: 34rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #2e334e;
      }
      image {
        margin-right: 10rpx;
        width: 32rpx;
        height: 32rpx;
      }
    }
    p {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #888da7;
    }
  }

  .echartsContent {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    .echarts {
      position: relative;
      width: 348rpx;
      height: 348rpx;
      margin-left: 28rpx;
      margin-bottom: 40rpx;
    }
    .titleBlock {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: absolute;
      bottom: 160rpx;
      left: 114rpx;
      .echartsTitle {
        // right:114rpx;
        // font-size: 20rpx;
        font-size: 26rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #888da7;
      }
      .echartsYesterdayNum {
        // position: absolute;
        // bottom: 160rpx;
        // left:134rpx;
        font-size: 36rpx;
        font-weight: 700;
      }
    }

    // 今日预估()+累计收益()
    .hashRateContent {
      margin-bottom: 40rpx;
      view {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-left: 40rpx;
        // margin-bottom: 30rpx;
        // 小标题
        p {
          font-size: 26rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #888da7;
        }
      }
      view:first-child {
        margin-bottom: 80rpx;
      }
      // 大数字
      view > text {
        font-weight: 700;
        font-size: 34rpx;
        font-family: AlibabaPuHuiTiB;
        color: #2e334e;
        // 00
        p:first-child {
          display: inline-block;
          font-size: 20rpx;
          font-weight: 700;
          margin-left: 0rpx;
        }
        // MH/s
        p {
          display: inline-block;
          font-size: 30rpx;
          font-weight: 400;
          margin-left: 20rpx;
        }
      }
    }
  }
}
</style>
