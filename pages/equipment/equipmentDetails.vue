<template>
  <view>
    <view @touchend="onTouchEnd" @touchstart="onTouchStart" class="content">
      <view class="segmented-box">
        <!-- 左滑版 -->
        <uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" styleType="text" activeColor="#009BF9" :class="control" v-show="leftSlide">
        </uni-segmented-control>
        <!-- 右滑版 -->
        <uni-segmented-control
          :current="current"
          :values="items"
          @clickItem="onClickItem"
          styleType="text"
          activeColor="#009BF9"
          class="control-copy"
          v-show="rightSlide"
        ></uni-segmented-control>
      </view>

      <view class="content">
        <view v-show="current === 0" class="table-page">
          <!-- 这里放一个详细信息组件 -->
          <equipmentDetail :equipmentDetailInfo="equipmentDetailInfo"></equipmentDetail>
        </view>
        <view v-show="current === 1" class="echarts-page">
          <!-- 这里放一个投资收益信息组件 -->
          <equipmentInvestmentIncome
            :equipmentInvestmentIncomeInfo="equipmentInvestmentIncomeInfo"
            :echartsInfo="echartsInfo"
            :latestCoinPrice="latestCoinPrice"
          ></equipmentInvestmentIncome>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import equipmentDetail from "@/components/ETH/equipment/equipmentDetailInfo.vue";
import equipmentInvestmentIncome from "@/components/ETH/equipment/equipmentInvestmentIncome.vue";
// #ifdef APP-PLUS
import APPUpdate from "@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate";
// #endif
export default {
  name: "EquipmentDetails",
  components: {
    equipmentDetail,
    equipmentInvestmentIncome,
  },
  data() {
    return {
      // 记录触发了几次需要更新APP
      appUpdate: 0,
      userToken: "",
      items: [this.$t("Home.Swiper.equipment.equipmentInfo"), this.$t("Home.Swiper.equipment.equipmentIncome")],
      current: 1,
      // 获取当前点击的是哪个设备,1是hada1,2是hada1pro
      currentEquipmentId: null,
      // 设备详细信息
      equipmentDetailInfo: {},
      // 设备收益计算相关信息
      equipmentInvestmentIncomeInfo: {},
      // 獲取接口 ETH價格信息
      echartsInfo: [],
      // 獲取接口 ETH價格信息-最新币价
      latestCoinPrice: "0",
      // usd转rmb
      USDtoRMB: 6.7,
      // 存页面触摸相关信息
      touchStartX: null,
      leftSlide: true,
      rightSlide: false,

      control: "test1",
    };
  },
  onLoad(option) {
    try {
      const value = uni.getStorageSync("token");
      if (value) {
        // 获取token
        this.userToken = value;
      }
    } catch (e) {
      // error
    }
    // 获取设备详情页面传来的id
    this.currentEquipmentId = parseInt(option.id);

    // 获取接口 查询设备详细信息
    this.getBuyEquipmentMoreInfo();
    // 获取接口 查询设备信息(投资收益计算用)
    this.getEquipmentIncomeInfo();
    // 获取接口 以太坊价格信息
    this.getEthPrice();
  },
  onShow() {},
  methods: {
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
          let date = [];
          let ETHprice = [];

          const data = res.data.data;
          data.forEach((d) => {
            date.push(this.dateChangeFormat("m.dd", d.Date));
            ETHprice.push(d.AvgPrices);
          });
          // ETH
          this.echartsInfo.date = date;
          this.echartsInfo.RMBdata = ETHprice;
          let length = ETHprice.length;
          let num = parseFloat(ETHprice[length - 1]);
          // 获取最新币价
          this.latestCoinPrice = num.toFixed(0);
        },
      });
    },
    // 获取接口 查询设备详细信息
    getBuyEquipmentMoreInfo() {
      uni.request({
        url: this.host + "/app/equipment/one/detailed/" + this.currentEquipmentId,
        method: "GET",
        header: {
          //token
          "x-token": this.userToken,
          //version
          version: this.version,
        },
        success: (res) => {
          if (res.data.code != 0) {
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
          if (res.data.code == 0) {
            this.equipmentDetailInfo = res.data.data[0];
          }
        },
        complete: (res) => {},
      });
    },
    // 获取接口 查询设备信息(投资收益计算用)
    getEquipmentIncomeInfo() {
      uni.request({
        url: this.host + "/app/equipment/one/detailed/income/" + this.currentEquipmentId,
        method: "GET",
        header: {
          //token
          "x-token": this.userToken,
          //version
          version: this.version,
        },
        success: (res) => {
          if (res.data.code != 0) {
            return;
          }
          if (res.data.code == 0) {
            this.equipmentInvestmentIncomeInfo = res.data.data[0];
          }
        },
        complete: (res) => {},
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
    // 点击顶部选项卡更改选项卡index
    onClickItem(e) {
      if (this.current != e.currentIndex) {
        this.current = e.currentIndex;
        this.leftSlide = !this.leftSlide;
        this.rightSlide = !this.rightSlide;
        // 添加动画
        this.control = "test2";
      }
    },
    // 滑动更改选项卡index
    onTouchStart(e) {
      this.touchStartX = e.changedTouches[0].clientX;
    },
    onTouchEnd(e) {
      // 右滑
      if (this.touchStartX - e.changedTouches[0].clientX <= -120) {
        this.leftSlide = true;
        this.rightSlide = false;
        // 添加动画
        this.control = "test2";
        // 如果此时在投资收益tab才允许切换
        if (this.current) {
          this.current = 1 ^ this.current;
        }
        // console.log(~1);
        // console.log(1^0);
        // console.log(1^1);
        return;
      }
      // 左滑
      if (this.touchStartX - e.changedTouches[0].clientX >= 120) {
        this.leftSlide = false;
        this.rightSlide = true;
        // 如果此时在设备详情tab才允许切换
        if (!this.current) {
          this.current = 1 ^ this.current;
        }
        return;
      }
    },
  },
};
</script>

<style>
page {
  background-color: #f3f5f7;
}
</style>

<style lang="less" scoped>
@import "@/static/css/MainColor.less";
// 顶部导航栏分割线
.nav-line {
  width: 100%;
  height: 4rpx;
  background-color: #f2f2f2;
}
.segmented-box {
  position: relative;
}
// 顶部右滑动画
@keyframes fadenum12 {
  0% {
    opacity: 0;
    transform: translate(0%);
  }
  20% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
    transform: translate(-50%);
  }
}
// 顶部左滑动画
@keyframes fadenum34 {
  0% {
    opacity: 0;
    transform: translate(0%);
  }
  20% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
    transform: translate(50%);
  }
}

// 整体右滑动画
@keyframes fade12 {
  0% {
    opacity: 0.7;
  }
  // 20% {
  //   opacity: 0.4;
  // }
  80% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}
// 整体左滑动画
@keyframes fade34 {
  0% {
    opacity: 0.7;
  }
  80% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}

.content {
  .table-page {
    animation: fade12 0.4s 1;
  }
  .echarts-page {
    animation: fade34 0.4s 1;
  }
}

// 页面第一次进入的时候无动画
.test1 {
  background-color: #fbfdfd;
  /deep/ .segmented-control__item--text {
    span {
      transition: all 0.5s;
      position: relative;
    }
    span::after {
      content: "";
      display: block;
      position: absolute;
      bottom: -16rpx;
      left: 50%;
      transform: translate(-50%);
      width: 70%;
      height: 8rpx;
      // background-color: #009bf9;
      background-color: @main-color;
      // animation: fadenum12 0.8s 1;
      // animation-play-state: paused;
    }
  }
}
// 右滑切换过一次/点击一次后有动画
.test2 {
  background-color: #fbfdfd;
  /deep/ .segmented-control__item--text {
    span {
      transition: all 0.5s;
      position: relative;
    }
    span::after {
      content: "";
      display: block;
      position: absolute;
      bottom: -16rpx;
      left: 50%;
      transform: translate(-50%);
      width: 70%;
      height: 8rpx;
      // background-color: #009bf9;
      background-color: @main-color;
      animation: fadenum12 0.8s 1;
      animation-play-state: running;
    }
  }
}
.control-copy {
  background-color: #fbfdfd;
  /deep/ .segmented-control__item--text {
    span {
      transition: all 0.5s;
      position: relative;
    }
    span::after {
      content: "";
      display: block;
      position: absolute;
      bottom: -16rpx;
      right: 50%;
      transform: translate(50%);
      width: 70%;
      height: 8rpx;
      // background-color: #009bf9;
      background-color: @main-color;
      animation: fadenum34 0.8s 1;
      // animation-play-state: paused;
    }
  }
}
</style>
