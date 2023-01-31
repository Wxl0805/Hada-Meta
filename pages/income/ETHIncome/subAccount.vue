<template>
  <view>
    <!-- 导航栏部分 -->
    <view class="box-bg">
      <uni-nav-bar
        leftWidth="300rpx"
        rightWidth="328rpx"
        :fixed="true"
        :statusBar="true"
      >
        <block slot="left">
          <view class="leftIcon">
            <uni-icons type="arrow-left" color="#666" size="24" @click="back" />
            <view @click="showDrawer('showLeft')">
              <text class="uni-nav-bar-text">{{ productName }}</text>
              <image src="@/static/images/equipment/triangle.png"></image>
            </view>
          </view>
        </block>
        <block slot="right">
          <!-- 选项卡组件 -->
          <view class="uni-segmented-control">
            <uni-segmented-control
              :current="current"
              :values="items"
              style-type="text"
              :active-color="activeColor"
              @clickItem="onClickItem"
            />
          </view>
        </block>
      </uni-nav-bar>
    </view>
    <view class="segmented-content">
      <view v-if="current === 0">
        <!-- 放一个组件 -->
        <subIncomeTotal
          :incomeInfo="info1"
          :unit="items[current]"
        ></subIncomeTotal>
      </view>
      <view v-if="current === 1">
        <subIncomeTotal
          :incomeInfo="info2"
          :unit="items[current]"
        ></subIncomeTotal>
      </view>
      <view v-if="current === 2">
        <subIncomeTotal
          :incomeInfo="info3"
          :unit="items[current]"
        ></subIncomeTotal>
      </view>
    </view>

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
              $t("ETH.Equipment.SubAccount.aside-title")
            }}</view>
            <uni-list :border="false">
              <uni-list-item
                :border="false"
                clickable
                v-for="(sub, index) in subData"
                :key="index"
                @click="onClick(index)"
              >
                <template v-slot:body>
                  <text class="list-item">{{ sub.subAccountName }}</text>
                </template>
              </uni-list-item>
            </uni-list>
          </scroll-view>
        </view>
      </uni-drawer>
    </view>

    <!-- 收益变化图表组件 -->
    <view class="incomeEcharts">
      <subIncomeEcharts
        :xData="xData"
        :yData="yData"
        :unit="items[current]"
      ></subIncomeEcharts>
    </view>

    <!-- 表格 -->
    <view>
      <view class="uni-container">
        <uni-table
          ref="table"
          :border="false"
          :stripe="false"
          emptyText="暂无更多数据"
        >
          <uni-tr>
            <uni-th width="150" align="center" class="title">{{
              $t("ETH.SubAccount.income-date")
            }}</uni-th>
            <uni-th width="150" align="center" class="title">{{
              $t("ETH.SubAccount.income-num")
            }}</uni-th>
          </uni-tr>
          <uni-tr v-for="(item, index) in tableData" :key="index">
            <uni-td align="left" class="text">{{ item.date }}</uni-td>
            <uni-td align="right" class="text">
              <view class="income"
                >{{ item.income }}
                <view>
                  {{ items[current] }}
                </view>
              </view>
            </uni-td>
          </uni-tr>
        </uni-table>
      </view>
    </view>
  </view>
</template>

<script>
import subIncomeTotal from "@/components/ETH/income/subIncomeTotal.vue";
import subIncomeEcharts from "@/components/ETH/income/subIncomeEcharts.vue";
export default {
  components: {
    subIncomeTotal,
    subIncomeEcharts,
  },
  data() {
    return {
      userToken: "",
      // 获取从收益主页面传递来的子账户id
      subaccountId: null,
      xData: [],
      yData: [],
      // 获取从收益主页面传递来的子账户name
      productName: null,
      tableData: [],
      items: ["ETH", "RMB", "USD"],
      current: 0,
      activeColor: "#009BF9",
      ETHtoRMB: 7000,
      ETHtoUSD: 700,
      data: [],
      info: {
        yesterdayIncome: "0.0000",
        todayForecast: "0.0000",
        totalIncome: "0.0000",
      },
      // 装用户拥有的子账户id,name,子账户实时算力的信息
      subData: [],
      // 接 用户拥有的子账户接口获取到的内容
      productData: [],
    };
  },
  onLoad(option) {
    // 获取从收益主页面传递来的子账户id
    this.subaccountId = option.productCode;
    // 获取从收益主页面传递来的子账户name
    this.productName = option.productName;
    try {
      const value = uni.getStorageSync("token");
      if (value) {
        // 获取token
        this.userToken = value;
      }
    } catch (e) {
      // error
    }

    // 获取接口 用户拥有的子账户信息
    this.getUserProductTotalInfo();

    // 获取接口 用户的收益信息
    this.getIncomeInfo();

    this.load7Day();
  },
  computed: {
    info1() {
      return {
        yesterdayIncome: (this.info.yesterdayIncome * 1).toFixed(4),
        todayForecast: (this.info.todayForecast * 1).toFixed(4),
        totalIncome: (this.info.totalIncome * 1).toFixed(4),
      };
    },
    info2() {
      return {
        yesterdayIncome: (this.info.yesterdayIncome * this.ETHtoRMB).toFixed(2),
        todayForecast: (this.info.todayForecast * this.ETHtoRMB).toFixed(2),
        totalIncome: (this.info.totalIncome * this.ETHtoRMB).toFixed(2),
      };
    },
    info3() {
      return {
        yesterdayIncome: (this.info.yesterdayIncome * this.ETHtoUSD).toFixed(2),
        todayForecast: (this.info.todayForecast * this.ETHtoUSD).toFixed(2),
        totalIncome: (this.info.totalIncome * this.ETHtoUSD).toFixed(2),
      };
    },
  },
  methods: {
    // 左侧侧边栏点击跳转
    onClick(index) {
      uni.navigateTo({
        url:
          "../income/subAccount" +
          `?productCode=${this.productData[index].SubaccountId}` +
          `&productName=${this.productData[index].SubaccountName}`,
      });
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
    // 更新当前下标
    onClickItem(e) {
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex;
      }
    },
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    // 获取接口 用户拥有的产品(子账户)信息【设置productData】
    getUserProductTotalInfo() {
      uni.request({
        url: this.host + "/app/user/product/list",
        method: "GET",
        header: {
          "x-token": this.userToken,
        },
        success: (res) => {
          if (res.data.code != 0) {
            return;
          }

          if (res.data.data == null) {
            return;
          }
          this.productData = res.data.data;
          // 遍历用户拥有的子账户信息,把他们存到subData并初始化
          for (let i = 0; i < this.productData.length; i++) {
            this.subData.push({
              // 接口里获取到的子账户id
              subAccountId: this.productData[i].SubaccountId,
              // 接口里获取到的子账户名称
              subAccountName: this.productData[i].SubaccountName,
            });
          }
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
          if (res.data.data) {
            if (res.data.code != 0) {
              uni.showToast({
                icon: "none",
                title: "获取信息出错",
              });
              return;
            }
            this.data = res.data.data;

            // 昨日
            let subYesterdayIncome = 0;
            // 今日预估
            let subTodayForecast = 0;
            // 总共
            let subTotalIncome = 0;

            this.data.forEach((sub, index) => {
              if (sub.ProductName == this.productName) {
                subYesterdayIncome += parseFloat(sub.YesterdayCredit);
                this.info.yesterdayIncome = subYesterdayIncome.toFixed(6);

                subTodayForecast += parseFloat(sub.EstimateCredit);
                this.info.todayForecast = subTodayForecast.toFixed(6);

                subTotalIncome += parseFloat(sub.TotalCredit);
                this.info.totalIncome = subTotalIncome.toFixed(6);
              }
            });
          }
        },
      });
    },
    load7Day() {
      uni.request({
        url: this.host + "/app/user/credit/7day/" + this.subaccountId,
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

          this.tableData = res.data.data;
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.current == 0) {
              this.tableData[i].income = (this.tableData[i].income * 1).toFixed(
                4
              );
              this.$set(this.xData, i, this.tableData[i].date);
            }
            if (this.current == 1) {
              this.tableData[i].income = (
                this.tableData[i].income * this.ETHtoRMB
              ).toFixed(2);
              this.$set(this.xData, i, this.tableData[i].date);
            }
            if (this.current == 2) {
              this.tableData[i].income = (
                this.tableData[i].income * this.ETHtoUSD
              ).toFixed(2);
              this.$set(this.xData, i, this.tableData[i].date);
            }
            this.$set(this.yData, i, this.tableData[i].income);
          }
        },
      });
    },
  },
  // 监听current值，如果变化了就重新请求一下接口
  watch: {
    current(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.load7Day();
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
.box-bg {
  background-color: #ffffff;
  position: relative;
  display: flex;
  align-items: center;
  .leftIcon {
    display: flex;
    align-items: center;
    .uni-nav-bar-text {
      margin-left: 24rpx;
      font-size: 30rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 700;
      color: #2e334e;
    }
    view {
      display: flex;
      flex-direction: row;
      align-items: center;
      image {
        width: 34rpx;
        height: 34rpx;
      }
    }
  }
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
  }
  .list-item {
    padding: 15rpx 0;
    font-size: 34rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #2e334e;
  }
}

.uni-segmented-control {
  // z-index: 999;
  width: 328rpx;
  height: 70rpx;
  // position: absolute;
  top: calc(var(--status-bar-height) + 6rpx);
  right: 10rpx;
  background-color: #f3f5f7;
  border-radius: 6rpx;
  display: flex;
  justify-content: center;
  align-items: center;

  /deep/ .segmented-control__item--text {
    background-color: #ffffff;
    border-radius: 6rpx;
  }
  /deep/ .segmented-control__text {
    padding: 8rpx 18rpx;
  }
}
.segmented-content {
  background-color: #ffffff;
}

// 表格
.uni-container {
  margin-top: 30rpx;
  margin-bottom: 104rpx;
  .title {
    font-size: 32rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #2e334e;
  }
  .text {
    font-size: 30rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #9ea3bb;
    .income {
      display: inline-block;
      view {
        display: inline-block;
      }
    }
  }
  // 左边文字
  .text:first-child {
    padding-left: 42rpx;
  }
  // 右边文字
  .text:last-child {
    padding-right: 42rpx;
  }
  // 收益日期和收益数额顶部padding
  /deep/ .uni-table-tr:first-child {
    th {
      padding-top: 44rpx;
    }
  }
}

.incomeEcharts {
  margin-top: 24rpx;
}
</style>
