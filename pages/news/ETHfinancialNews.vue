<template>
  <view>
    <view class="status_bar">
      <!-- 这里是占位状态栏 -->
    </view>

    <view class="bg"></view>
    <!-- 导航栏部分 -->

    <view class="box-bg">
      <view class="nav-title" :style="topNavStyle.style">
        <view class="iconLeft" @click="back">
          <uni-icons type="arrow-left" size="28" color="#ffffff"></uni-icons>
        </view>
        <view class="text">
          <text class="uni-nav-bar-text">{{ $t("Home.ETH.FinancialNews.title") }}</text>
        </view>
      </view>
    </view>

    <view class="title">
      <text>{{ $t("Home.ETH.FinancialNews.ETH-title") }}</text>
      <text>{{ $t("Home.ETH.FinancialNews.ETH-description") }}</text>
    </view>
    <!-- 这里要放一个组件,数据可视化 -->
    <view>
      <financiaIncomeEcharts ref="myFinanciaIncomeEcharts" :echartsInfo="echartsInfo" :unit="unit" :plus="plus"></financiaIncomeEcharts>
    </view>
  </view>
</template>

<script>
import financiaIncomeEcharts from "@/components/ETH/home/financiaIncomeEcharts.vue";
// #ifdef APP-PLUS
import APPUpdate from "@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate";
// #endif
export default {
  name: "financialNews",
  components: {
    financiaIncomeEcharts,
  },
  data() {
    return {
      // 记录触发了几次需要更新APP
      appUpdate: 0,
      userToken: "",
      // 记录页面滚动距离
      pageScrollTop: "",
      unit: ["USD", "RMB"],
      plus: 7,
      echartsInfo: [
        {
          echartsName: this.$t("Home.ETH.FinancialNews.ETH-price"),
          currIdx: 0,
          date: [],
          USDdata: [],
        },
        {
          echartsName: this.$t("Home.ETH.FinancialNews.Hada1-price"),
          currIdx: 0,
          date: [],
          USDdata: [],
        },
        {
          echartsName: this.$t("Home.ETH.FinancialNews.Hada1Pro-price"),
          currIdx: 0,
          date: [],
          USDdata: [],
        },
      ],
    };
  },
  onLoad() {
    try {
      const value = uni.getStorageSync("token");
      if (value) {
        // 获取token
        this.userToken = value;
      }
    } catch (e) {
      // error
    }
    // 获取接口 以太坊价格信息
    this.getEthPrice();
  },
  computed: {
    topNavStyle() {
      let r = this.pageScrollTop / 100;
      return {
        style: `background-color: rgba(97, 115, 153,${r >= 1 ? 1 : r});`,
      };
    },
  },
  // 页面滚动监听
  onPageScroll(e) {
    this.pageScrollTop = Math.floor(e.scrollTop);
  },
  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    // 转换日期格式
    dateChangeFormat(format, date) {
      date = new Date(date);
      const dataItem = {
        "Y+": date.getFullYear().toString(),
        "m+": (date.getMonth() + 1).toString(),
        "d+": date.getDate().toString(),
        "H+": date.getHours().toString(),
        "M+": date.getMinutes().toString(),
        "S+": date.getSeconds().toString(),
      };
      Object.keys(dataItem).forEach((item) => {
        const ret = new RegExp(`(${item})`).exec(format);
        if (ret) {
          format = format.replace(ret[1], ret[1].length === 1 ? dataItem[item] : dataItem[item].padStart(ret[1].length, "0"));
        }
      });
      return format;
    },
    // 获取接口 eth价格信息
    getEthPrice() {
      uni.request({
        url: this.host + "/app/eth/avgPrice",
        method: "GET",
        header: {
          "x-token": this.userToken,
          //version
          version: this.version,
        },
        success: (res) => {
          if (res.data.code !== 0) {
            // 设置echarts图标没数据时为0
            // ETH
            this.echartsInfo[0].date = [1, 2, 3, 4, 5, 6, 7, 8];
            this.echartsInfo[0].USDdata = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            // Hada1
            this.echartsInfo[1].date = [1, 2, 3, 4, 5, 6, 7, 8];
            this.echartsInfo[1].USDdata = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            // Hada1Pro
            this.echartsInfo[2].date = [1, 2, 3, 4, 5, 6, 7, 8];
            this.echartsInfo[2].USDdata = [0, 0, 0, 0, 0, 0, 0, 0, 0];

            if (res.data.code == 2) {
              console.log("需要更新版本");
              this.appUpdate++;
              // 控制只出现一次弹窗
              if (this.appUpdate >= 0 && this.appUpdate < 2) {
                // #ifdef APP-PLUS
                APPUpdate(true);
                // #endif
              }
            }
            return;
          }
          let date = [];
          let ETHprice = [];
          let Hada1price = [];
          let Hada1ProPrice = [];

          const data = res.data.data;
          data.forEach((d) => {
            date.push(this.dateChangeFormat("m.dd", d.Date));
            ETHprice.push(d.AvgPrices);
            Hada1price.push(d.AvgHada1Prices);
            Hada1ProPrice.push(d.AvgHadaProPrices);
          });
          // ETH
          this.echartsInfo[0].date = date;
          // this.echartsInfo[0].USDdata = ETHprice;

          // 这里使用$set来改变echarts需要的数组数据,只有这样才能触发数据改变时vue的某个回调检测???
          this.$set(this.echartsInfo[0], "USDdata", ETHprice);
          // Hada1
          this.echartsInfo[1].date = date;
          // this.echartsInfo[1].USDdata = Hada1price;
          this.$set(this.echartsInfo[1], "USDdata", Hada1price);
          // Hada1Pro
          this.echartsInfo[2].date = date;
          // this.echartsInfo[2].USDdata = Hada1ProPrice;
          this.$set(this.echartsInfo[2], "USDdata", Hada1ProPrice);
          // 22.8.12:赵总帮忙修改了 调用渲染Echarts函数 的调用位置(从子组件内mounted渲染改到父组件内调用子组件函数渲染);
          this.$refs.myFinanciaIncomeEcharts.setEchartsData();
        },
      });
    },
  },
};
</script>

<style>
page {
  position: absolute;
  /* z-index: -999; */
  background-color: #f3f5f7;
}
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
}
</style>

<style lang="less" scoped>
// 背景图片
.bg {
  z-index: -10;
  position: absolute;
  left: -4rpx;
  top: -8rpx;
  width: 754rpx;
  height: 1193rpx;
  background-image: url("@/static/images/home/financial/ETHInvestmentBg.png");
  background-repeat: no-repeat;
  background-size: cover;
}
// 导航栏css
.box-bg {
  z-index: 999;
  position: relative;
  .nav-title {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
    padding-top: var(--status-bar-height);
    z-index: 50;
    background-color: transparent;
    // color: rgba(255,255,255,0.8);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .iconLeft {
      position: absolute;
      top: calc(var(--status-bar-height) + 14rpx);
      bottom: 10rpx;
      left: 40rpx;

      image {
        width: 30rpx;
        height: 30rpx;
      }
    }

    .text {
      // display: flex;
      // align-items: center;
      // margin-left: 48rpx;
      margin-top: 18rpx;
      margin-bottom: 24rpx;
      text {
        margin-right: 12rpx;
        font-size: 34rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #f5f9fa;
      }
    }
  }
}

.title {
  color: #ffffff;
  padding: 120rpx 30rpx 30rpx;
  display: flex;
  flex-direction: column;
  // 以定盈
  text:first-child {
    width: 144rpx;
    height: 67rpx;
    font-size: 48rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #ffffff;
    line-height: 67rpx;
  }
  // 基于xxx
  text:last-child {
    width: 578rpx;
    height: 40rpx;
    font-size: 28rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 40rpx;
  }
}
</style>
