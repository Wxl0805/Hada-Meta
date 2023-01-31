<template>
  <view>
    <view class="status_bar">
      <!-- 这里是占位状态栏 -->
    </view>
    <view class="bg"></view>
    <!-- 导航栏部分 -->
    <view class="box-bg">
      <view class="title" :style="topNavStyle.style">
        <view class="leftIcon" @click="showDrawer('showLeft')">
          <text class="uni-nav-bar-text">{{
            $t("ETH.Equipment.Index.topTabbar-title")
          }}</text>
          <image src="@/static/images/income/triangle.png"></image>
        </view>
        <view class="uni-segmented-control">
          <uni-segmented-control
            :current="current"
            :values="units"
            style-type="text"
            :active-color="activeColor"
            @clickItem="onClickItem"
          />
        </view>
      </view>

      <!-- 选项卡组件 -->
      <view class="segmented-content">
        <view v-if="current === 0">
          <!-- 放一个组件 -->
          <incomeTotal :incomeInfo="info1" :incomeUnit="unit1"></incomeTotal>
        </view>
        <view v-if="current === 1">
          <incomeTotal :incomeInfo="info2" :incomeUnit="unit2"></incomeTotal>
        </view>
        <view v-if="current === 2">
          <incomeTotal :incomeInfo="info3" :incomeUnit="unit3"></incomeTotal>
        </view>
      </view>
    </view>

    <!-- 子账户收益信息组件 -->
    <view class="subAccountIncome">
      <subAccountIncome
        :subAccountIncomeInfo="subIncomeData"
        :subAccountIncomeUnit="item"
        :subAccountIncomeUrl="subAccountIncomeUrl"
      ></subAccountIncome>
    </view>

    <!-- 弹窗 -->
    <uni-popup ref="popup" :is-mask-click="false" type="center">
      <view class="addPop">
        <view class="addPop-img">
          <image src="@/static/images/equipment/hada1bg.png"></image>
        </view>
        <view class="addPop-title">
          <p>添加设备</p>
          <text>您还未添加设备，请立即添加设备获取收益</text>
        </view>
        <view class="addPop-Btn">
          <button @click="onAddEquipmentClick" type="default">
            <text>立即添加</text>
          </button>
        </view>
      </view>
    </uni-popup>

    <!-- 左侧侧边栏 -->
    <view class="left-aside">
      <uni-drawer
        ref="showLeft"
        mode="left"
        :width="260"
        @change="change($event, 'showLeft')"
      >
        <view class="close">
          <scroll-view class="scroll-view-box" scroll-y="true">
            <view class="left-aside-title">{{
              $t("ETH.Aleo.Index.aside-title")
            }}</view>
            <uni-list :border="false">
              <uni-list-item :border="false" clickable @click="onClick('eth')">
                <!-- v-for="(sub, index) in subData" -->
                <!-- :key="index" -->
                <template v-slot:body>
                  <!-- <text class="list-item">{{ sub.subAccountName }}</text> -->
                  <text class="list-item">{{
                    $t("ETH.Aleo.Index.aside-ETH")
                  }}</text>
                </template>
              </uni-list-item>
              <uni-list-item :border="false" clickable @click="onClick('aleo')">
                <!-- v-for="(sub, index) in subData" -->
                <!-- :key="index" -->
                <template v-slot:body>
                  <!-- <text class="list-item">{{ sub.subAccountName }}</text> -->
                  <text class="list-item">{{
                    $t("ETH.Aleo.Index.aside-Aleo")
                  }}</text>
                </template>
              </uni-list-item>
            </uni-list>
          </scroll-view>
        </view>
      </uni-drawer>
    </view>
  </view>
</template>

<script>
import incomeTotal from "@/components/ETH/income/incomeTotal.vue";
import subAccountIncome from "@/components/ETH/income/subAccountIncome.vue";

export default {
  components: {
    incomeTotal,
    subAccountIncome,
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
    // 切换底部tabbar
    this.switchTabbar();
  },
  onShow() {
    // 获取接口 用户拥有的设备在线情况信息
    this.getUserEquipmentTotalInfo();

    // 获取接口 用户拥有的产品信息
    this.getUserProductTotalInfo();

    setTimeout(() => {
      this.startMyTimer();
    }, 2000);
  },
  data() {
    return {
      // 记录页面滚动距离
      pageScrollTop: "",
      timer: null,
      userToken: "",
      units: ["ETH", "RMB", "USD"],
      current: 0,
      activeColor: "#007aff",
      // 判断是否需要显示“请先绑定设备”
      showPop: false,
      // 用户绑定的设备总数
      totalEquipmentNum: "",
      // 用户拥有的产品信息
      productData: [],
      // 转换率
      USDtoRMB: 7,
      ETHtoUSD: 1200,
      // 存收益顶上那部分所有子账号收益的信息
      incomeData: {
        yesterdayIncome: "0.000000",
        // 前天收益
        YesyesterdayIncome: 0,
        todayForecast: "0.000000",
        totalIncome: "0.000000",
      },
      data: [],
      // 用来接处理后的真数据
      subIncomeData: [
        {
          productCode: "ETHP1",
          productName: "以定盈",
          YesterdayCredit: "0.000000",
          EstimateCredit: "0.000000",
          TotalCredit: "0.000000",
          data: [],
        },
      ],
      unit1: "ETH",
      unit2: "RMB",
      unit3: "USD",
      subAccountIncomeUrl: "subAccount",
      // 存现在的币种是eth还是aleo
      coinType: "eth",
    };
  },
  computed: {
    ETHtoRMB() {
      return this.ETHtoUSD * this.USDtoRMB;
    },
    item() {
      return this.units[this.current];
    },
    info1() {
      return {
        yesterdayIncome: (this.incomeData.yesterdayIncome * 1).toFixed(4),
        todayForecast: (this.incomeData.todayForecast * 1).toFixed(4),
        totalIncome: (this.incomeData.totalIncome * 1).toFixed(4),
        // 计算昨日收益占前天收益的百分比
        // 因为0/0是NaN,任何数/0是infinity,所以需要加个判断!
        // (昨天 - 前天) / 前天 * 100
        YesyesterdayIncomePercent:
          this.incomeData.YesyesterdayIncome == 0
            ? 0
            : (
                ((this.incomeData.yesterdayIncome -
                  this.incomeData.YesyesterdayIncome) /
                  this.incomeData.YesyesterdayIncome) *
                100
              ).toFixed(2),
      };
    },
    info2() {
      return {
        yesterdayIncome: (
          this.incomeData.yesterdayIncome * this.ETHtoRMB
        ).toFixed(2),
        todayForecast: (this.incomeData.todayForecast * this.ETHtoRMB).toFixed(
          2
        ),
        totalIncome: (this.incomeData.totalIncome * this.ETHtoRMB).toFixed(2),
        // 计算昨日收益占前天收益的百分比
        YesyesterdayIncomePercent:
          this.incomeData.YesyesterdayIncome == 0
            ? 0
            : (
                ((this.incomeData.yesterdayIncome -
                  this.incomeData.YesyesterdayIncome) /
                  this.incomeData.YesyesterdayIncome) *
                100
              ).toFixed(2),
      };
    },
    info3() {
      return {
        yesterdayIncome: (
          this.incomeData.yesterdayIncome * this.ETHtoUSD
        ).toFixed(2),
        todayForecast: (this.incomeData.todayForecast * this.ETHtoUSD).toFixed(
          2
        ),
        totalIncome: (this.incomeData.totalIncome * this.ETHtoUSD).toFixed(2),
        // 计算昨日收益占前天收益的百分比
        YesyesterdayIncomePercent:
          this.incomeData.YesyesterdayIncome == 0
            ? 0
            : (
                ((this.incomeData.yesterdayIncome -
                  this.incomeData.YesyesterdayIncome) /
                  this.incomeData.YesyesterdayIncome) *
                100
              ).toFixed(2),
      };
    },
    topNavStyle() {
      let r = this.pageScrollTop / 40;
      return {
        style: `background-color: rgba(63, 74, 91,${r >= 1 ? 1 : r});`,
      };
    },
  },
  // 页面滚动监听
  onPageScroll(e) {
    this.pageScrollTop = Math.floor(e.scrollTop);
  },
  methods: {
    // 左侧侧边栏点击跳转
    onClick(type) {
      this.coinType = type;
      this.switchTabbar();
    },
    // 切换tabbar
    switchTabbar() {
      if (this.coinType == "aleo") {
        // 隐藏eth的tabbar
        uni.setTabBarItem({
          index: 2,
          visible: false,
          success: (res) => {
            // 显示aleo的tabbar
            uni.setTabBarItem({
              index: 3,
              visible: true,
              success: (res) => {
                // 隐藏設備tabbar
                uni.setTabBarItem({
                  index: 1,
                  visible: false,
                  success: (res) => {
                    uni.switchTab({
                      url: "/pages/income/AleoIncome/income",
                      complete: (res) => {
                      },
                    });
                    // 關閉側邊欄
                    this.closeDrawer("showLeft");
                  },
                });
              },
            });
          },
        });
      }
      if (this.coinType == "eth") {
        // 隐藏aleo的tabbar
        uni.setTabBarItem({
          index: 3,
          visible: false,
          success: (res) => {
            // 显示eth的tabbar
            uni.setTabBarItem({
              index: 2,
              visible: true,
              success: (res) => {
                // 顯示設備tabbar
                uni.setTabBarItem({
                  index: 1,
                  visible: true,
                  success: (res) => {
                    uni.switchTab({
                      url: "/pages/income/ETHIncome/income",
                      complete: (res) => {
                      },
                    });
                    // 關閉側邊欄
                    this.closeDrawer("showLeft");
                  },
                });
              },
            });
          },
        });
      }
    },
    // 打开窗口
    showDrawer(e) {
      this.$refs[e].open();
    },
    // 关闭窗口
    closeDrawer(e) {
      this.$refs[e].close();
    },
    // 抽屉状态发生变化触发
    change(e, type) {
      this[type] = e;
    },
    startMyTimer() {
      if (this.timer == null) {
        this.timer = setInterval(() => {
          this.getIncomeInfo();
        }, 60000);
      }
    },
    stopMyTimer() {
      if (this.timer != null) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    // 获取接口 用户拥有的设备在线情况信息
    getUserEquipmentTotalInfo() {
      uni.request({
        url: this.host + "/app/machine/online",
        method: "GET",
        header: {
          //token
          "x-token": this.userToken,
        },
        success: (res) => {
          let total = 0;
          let online = 0;
          let offline = 0;
          // 设备首页绑定设备总数
          if (res.data.data == null) {
            this.totalEquipmentNum = 0;
            this.showPop = true;
          } else {
            this.totalEquipmentNum = res.data.data.length;
          }
          // 如果设备数不为0
          if (this.totalEquipmentNum !== 0) {
            this.showPop = false;
          }

          // 判断showPop是否为true
          if (this.showPop) {
            this.$refs.popup.open("center");
          }
          if (!this.showPop) {
            this.$refs.popup.close();
          }
        },
      });
    },
    // 获取接口 用户拥有的产品信息
    getUserProductTotalInfo() {
      uni.request({
        url: this.host + "/app/user/product/list",
        method: "GET",
        header: {
          //token
          "x-token": this.userToken,
        },
        success: (res) => {
          if (res.data.code != 0) {
            return;
          }

          if (res.data.data == null) {
            return;
          }
          if (res.data.data) {
            this.productData = res.data.data;
          }

          // 获取接口 昨日收益/今日预期收益
          this.getIncomeInfo();
        },
      });
    },
    // 获取收益信息 所有子账户收益[昨日收益接口]
    getIncomeInfo() {
      uni.request({
        url: this.host + "/app/user/credit",
        method: "GET",
        header: {
          //token
          "x-token": this.userToken,
        },
        success: (res) => {
          if (res.data.code != 0) {
            uni.showToast({
              icon: "none",
              title: "获取信息出错",
            });
            return;
          }
          // 如果为空,给一个初始值
          // 问题:如果没绑定设备,也会有默认的值

          // 清空subIncomeData
          this.subIncomeData = [];

          if (res.data.data == null) {
            // 遍历用户拥有的子账户信息
            this.productData.forEach((p) => {
              const eachSubProduct = {
                productCode: p.ProductCode,
                productName: p.ProductName,
                YesterdayCredit: "0.0000",
                // 前天的收益信息
                YesYesterdayCredit: 0,
                EstimateCredit: "0.0000",
                TotalCredit: "0.0000",
                data: [0],
              };
              this.subIncomeData.push(eachSubProduct);
            });
          }
          // 所有子账户收益信息
          this.data = res.data.data;

          this.productData.forEach((p) => {
            const eachSubProduct = {
              productCode: p.ProductCode,
              productName: p.ProductName,
              YesterdayCredit: 0,
              EstimateCredit: 0,
              TotalCredit: 0,
              data: [],
            };

            this.subIncomeData.push(eachSubProduct);
          });

          // 昨日
          let subYesterdayIncome = 0;
          // 前天
          let subYesYesterdayIncome = 0;
          // 今日预估
          let subTodayForecast = 0;
          // 总共
          let subTotalIncome = 0;

          // 计算所有子账户各收益总和
          this.data.forEach((sub, index) => {
            // 昨日收益
            subYesterdayIncome += parseFloat(sub.YesterdayCredit);
            this.incomeData.yesterdayIncome = subYesterdayIncome.toFixed(6);
            // 今日预估
            subTodayForecast += parseFloat(sub.EstimateCredit);
            this.incomeData.todayForecast = subTodayForecast.toFixed(6);
            // 累计收益
            subTotalIncome += parseFloat(sub.TotalCredit);
            this.incomeData.totalIncome = subTotalIncome.toFixed(6);

            // 前天收益
            subYesYesterdayIncome += parseFloat(sub.YesYesterdayCredit);
            this.incomeData.YesyesterdayIncome = subYesYesterdayIncome;
          });

          // 计算单个子账户的各收益总和
          this.data.forEach((sub, index) => {
            this.subIncomeData[index].productCode = sub.ProductCode;
            this.subIncomeData[index].productName = sub.ProductName;
            this.subIncomeData[index].YesterdayCredit = parseFloat(
              sub.YesterdayCredit
            ).toFixed(2);
            this.subIncomeData[index].EstimateCredit = parseFloat(
              sub.EstimateCredit
            ).toFixed(4);
            this.subIncomeData[index].TotalCredit = parseFloat(
              sub.TotalCredit
            ).toFixed(4);

            let obj = {
              value: parseFloat(
                subYesterdayIncome - sub.YesterdayCredit
              ).toFixed(6),
            };
            this.subIncomeData[index].data.push(obj);

            if (sub.YesterdayCredit != 0) {
              let subObj = {
                value: parseFloat(sub.YesterdayCredit).toFixed(6),
              };
              this.subIncomeData[index].data.push(subObj);
            }
          });
        },
      });
    },
    // 更新当前下标
    onClickItem(e) {
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex;
      }
    },
    // 点击跳转收益-子产品收益详情
    onSubProductIncomeClick() {
      uni.navigateTo({
        url: "../product",
        success(res) {
        },
        fail(res) {
        },
      });
    },
    // 点击跳转绑定设备页面
    onAddEquipmentClick() {
      uni.navigateTo({
        url: "../equipment/bindEquipment",
        success(res) {
        },
        fail(res) {
        },
      });
    },
  },

  onHide() {
    this.stopMyTimer();
  },
};
</script>

<style lang="less">
// @import url("@/static/css/font.css");
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
	@import "@/static/css/MainColor.less";
// 添加设备弹窗css
.addPop {
  width: 640rpx;
  height: 698rpx;
  background-color: #ffffff;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  .addPop-img {
    padding-top: 24rpx;
    image {
      width: 592rpx;
      height: 352rpx;
    }
  }
  .addPop-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    //添加设备
    p {
      margin-top: 24rpx;
      font-size: 42rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #2e334e;
    }
    // 您还未xx
    text {
      margin-top: 24rpx;
      margin-bottom: 36rpx;
      font-size: 28rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #9ea3bb;
    }
  }
  .addPop-Btn {
    button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 576rpx;
      height: 90rpx;
      // background-color: #009bf9;
      background-color: @main-color;
      border-radius: 100rpx;
    }

    text {
      font-size: 32rpx;
      font-family: AlibabaPuHuiTiM;
      color: #ffffff;
    }
  }
}

.bg {
  z-index: 10;
  position: absolute;
  top: 0rpx;
  width: 750rpx;
  // height: 634rpx;
  height: 728rpx;
  background-image: url("@/static/images/income/bg.png");
  background-repeat: no-repeat;
  background-size: 100%;
}

.box-bg {
  z-index: 999;
  position: relative;
  .title {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 90rpx;
    padding-top: var(--status-bar-height);
    z-index: 999;
    background-color: transparent;
    // color: rgba(255,255,255,0.8);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .leftIcon {
      display: flex;
      align-items: center;
      margin-left: 48rpx;
      margin-top: 14rpx;
      margin-bottom: 14rpx;
      text {
        margin-right: 12rpx;
        font-size: 40rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #ffffff;
      }
      image {
        width: 34rpx;
        height: 34rpx;
      }
    }
    // 币种选项css
    .uni-segmented-control {
      // z-index: 20;
      width: 300rpx;
      margin-right: 24rpx;
    }
  }
}
.segmented-content {
  z-index: 30;
  position: relative;
  margin-top: 114rpx;
  // margin-top: 1140rpx;
  display: flex;
  justify-content: center;
  // background-color: #ffffff;
}
.subAccountIncome {
  z-index: 30;
  position: relative;
}
// 左侧侧边栏整体
.left-aside {
  .left-aside-title {
    width: 220rpx;
    height: 62rpx;
    font-size: 44rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #2e334e;
    line-height: 62rpx;
    margin-top: 83rpx;
    margin-left: 42rpx;
    margin-bottom: 55rpx;
    white-space: nowrap;
  }
  .list-item {
    padding: 15rpx 0;
    font-size: 34rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #2e334e;
  }
}
</style>
