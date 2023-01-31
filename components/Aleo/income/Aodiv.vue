<template>
  <view class="box">
    <view class="inspiredPoints">
      <view class="content">
        <view class="clientBox">
          <view class="box2">
            <view class="num">
              <text>
                {{ TotalNum.nowInt }}
                <p>.{{ TotalNum.nowFloat }}</p>
              </text>
            </view>
          </view>
          <view class="box1">
            <text class="now">{{ $t("Aleo.Aodiv.totalNums") }}</text>
          </view>
        </view>
        <view class="box4">
          <view class="client">
            <view class="num">
              <text>
                {{ TotalNum.historyInt }}
                <p>.{{ TotalNum.historyFloat }}</p>
              </text>
            </view>
            <view class="subTitle">
              <text class="texts">{{ $t("Aleo.Aodiv.fixed-output") }}</text>
            </view>
          </view>
          <view class="total" >
            <view class="num">
              <text>
                {{ TotalNum.exchangeInt }}
                <p>.{{ TotalNum.exchangeFloat }}</p>
              </text>
            </view>
            <view class="subTitle">
              <text class="texts">{{ $t("Aleo.Aodiv.additional-output") }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "GdivView",
  props: {
    // 累计/自主兑换/他人代兑
    TotalNum: Object,
  },
  data() {
    return {};
  },
  methods: {
    // 点击跳转 Aleo收益-邀请客户
    // onInvitationBtnClick() {
    //   uni.navigateTo({
    //     url: "/pages/income/AleoIncome/inviteCustomers",
    //   });
    // },
    // 点击跳转 Aleo收益-激励积分记录
    onAleoInspiredPointsRecordClick() {
      uni.navigateTo({
        url: "/pages/income/AleoIncome/inspiredPointsRecord",
      });
    },
    // 点击跳转 Aleo收益-拓展客户列表
    onAleoExpandingCustomerListClick() {
      uni.navigateTo({
        url: "/pages/income/AleoIncome/expandingCustomerList",
      });
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
  background-image: url("@/static/images/income/Aleo/UGAodiv/aoDivBg.png");
  background-repeat: no-repeat;
  background-size: cover;
  width: 706rpx;
  height: 466rpx;
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
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
        position: relative;
        margin-left: 44rpx;
        display: flex;
        flex-direction: row;
        // num
        .num {
          text {
            font-size: 55rpx;
            // font-family: PingFangSC-Semibold, PingFang SC;
            font-family: SpaceGrotesk-Regular, SpaceGrotesk;
            font-weight: 500;
            color: #2e334e;
          }
          p {
            display: inline;
            font-weight: 500;
            font-size: 30rpx;
          }
        }
        // 兑换按钮
        // 兑换按钮颜色
        .box5 {
          position: absolute;
          top: -10rpx;
          right: 63rpx;
          button {
            background-color: #9267ff;
          }
        }
      }
    }

    .box4 {
      margin-top: 113rpx;
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
        p {
          display: inline;
          font-weight: 500;
          font-size: 30rpx;
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
      }
      // 客户数
      .client {
        margin-left: 48rpx;
        display: flex;
        flex-direction: column;
        // // 获取按钮颜色
        // .box5 {
        //   button {
        // 	  background-color: #479AFF;
        //   }
        // }
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
