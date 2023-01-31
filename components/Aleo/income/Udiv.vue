<template>
  <view class="box">
    <view class="inspiredPoints">
      <view class="content">
        <view class="clientBox">
          <view class="box2">
            <view class="num">
              <text>
                {{ TotalNum.nowInt }}
              </text>
            </view>
          </view>
          <view class="box1">
            <text class="now">{{ $t("Aleo.Udiv.nowNums") }}</text>
          </view>
        </view>
        <view class="box4">
          <view class="client">
            <view class="num">
              <text>
                {{ TotalNum.historyInt }}
              </text>
            </view>
            <view class="subTitle">
              <text class="texts">{{ $t("Aleo.Udiv.historyNums") }}</text>
            </view>
            <!-- 获取按钮 -->
            <view class="box5">
              <button type="default" @click="onGetBtnClick">
                <text class="btn-text">{{ $t("Aleo.Udiv.getBtn") }}</text>
              </button>
            </view>
          </view>
          <view class="total">
            <view class="num">
              <text>
                {{ TotalNum.exchangeInt }}
              </text>
            </view>
            <view class="subTitle">
              <text class="texts">{{ $t("Aleo.Udiv.exchange") }}</text>
            </view>
            <!-- 兑换按钮 -->
            <view class="box5">
              <button type="default" @click="onExchangeBtnClick">
                <text class="btn-text">{{ $t("Aleo.Udiv.exchangeBtn") }}</text>
              </button>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "UdivView",
  props: {
    // 当前/历史/兑换
    TotalNum: Object,
    // 是否绑定leader
    isBindLeader: Boolean,
    // 是否余额充足
    isRemainingEnough: Boolean,
  },
  data() {
    return {};
  },
  methods: {
    // 点击跳转 获取页面
    onGetBtnClick() {
      // 如果綁定了上級邀請碼,正常跳轉
      if (this.isBindLeader) {
        uni.navigateTo({
          url: "/pages/news/AddAleoFinancial",
        });
      }
      if (!this.isBindLeader) {
        this.$emit("open-dialog");
      }
    },
    // 点击跳转 兑换页面
    onExchangeBtnClick() {
      // 如果綁定了上級邀請碼,正常跳轉
      if (this.isBindLeader) {
        // 验证是否余额充足
        if (this.isRemainingEnough) {
          // 余额充足,跳转
          uni.navigateTo({
            url: "/pages/income/AleoIncome/exchange",
          });
        } else {
          this.$emit("open-remaining-dialog");
        }
      }
      if (!this.isBindLeader) {
        this.$emit("open-dialog");
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/static/css/MainColor.less";
.box {
  display: flex;
  justify-content: center;
}
// 激励积分
.inspiredPoints {
  background-image: url("@/static/images/income/Aleo/UGAodiv/uDivBg.png");
  background-repeat: no-repeat;
  background-size: cover;
  width: 706rpx;
  height: 466rpx;
  .content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 706rpx;
    height: 466rpx;
    position: relative;
    .clientBox {
      margin-top: 58rpx;
      width: 700rpx;
      .box1 {
        margin-left: 44rpx;
        display: flex;
        align-items: center;
        // 当前
        .now {
          font-size: 28rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #7283a9;
        }
      }
      .box2 {
        margin-left: 44rpx;
        // num
        .num {
          text {
            font-size: 55rpx;
            // font-family: PingFangSC-Semibold, PingFang SC;
            font-family: SpaceGrotesk-Regular, SpaceGrotesk;
            font-weight: 500;
            color: #2e334e;
          }
        }
      }
    }

    .box4 {
      position: absolute;
      bottom: 58rpx;
      // margin-top: 54rpx;
      width: 700rpx;
      display: flex;
      flex-direction: row;
      // 数字
      .num {
        text {
          font-size: 55rpx;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 500;
          color: #2e334e;
        }
      }
      .subTitle {
        display: flex;
        align-items: center;
        .texts {
          font-size: 28rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #7283a9;
        }
        image {
          width: 32rpx;
          height: 32rpx;
          margin-right: 8rpx;
        }
      }
      // 累计奖励
      .total {
        // width: 240rpx;
        display: flex;
        flex-direction: column;
        margin-left: 200rpx;

        // 兑换按钮颜色
        .box5 {
          button {
            background-color: #9267ff;
          }
        }
      }
      // 客户数
      .client {
        margin-left: 48rpx;
        display: flex;
        flex-direction: column;
        // align-items: center;

        // 获取按钮颜色
        .box5 {
          button {
            background-color: #479aff;
          }
        }
      }
    }

    // button
    .box5 {
      margin-top: 20rpx;
      button {
        width: 140rpx;
        height: 60rpx;
        // background-color: #009bf9;
        background-color: @main-color;
        border-radius: 6rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        // padding: 0rpx 28rpx;

        .btn-text {
          display: inline-block;
          white-space: nowrap;
          line-height: 40rpx;
          font-size: 28rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          color: #ffffff;
        }
      }
    }
  }
}
</style>
