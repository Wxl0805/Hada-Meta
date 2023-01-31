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
          <uni-icons type="arrow-left" size="28" color="#000000"></uni-icons>
        </view>
        <view class="text">
          <text class="uni-nav-bar-text">{{ $t("Home.Aleo.FinancialNews.title") }}</text>
        </view>
        <view class="iconRight" @click="onInviteIconClick">
          <uni-icons type="personadd" size="28" color="#000000"></uni-icons>
        </view>
      </view>
    </view>
    <!-- aleo透明背景圖 -->
    <view class="main-title-bg"> </view>

    <view class="main-title">
      <text>{{ $t("Home.Aleo.FinancialNews.Aleo-title") }}</text>
      <text>{{ $t("Home.Aleo.FinancialNews.Aleo-description") }}</text>
    </view>

    <!-- 产品简介 -->
    <view class="introduction">
      <view class="title">
        <view class="introduction-titleBg"></view>
        <image src="../../static/images/home/financial/left.png"></image>
        <text>{{ $t("Home.Aleo.FinancialNews.introduction-title") }}</text>
        <image src="../../static/images/home/financial/right.png"></image>
      </view>
      <view class="content">
        <text>
          {{ $t("Home.Aleo.FinancialNews.investment-content") }}
        </text>
      </view>
    </view>

    <!-- 产品详情 -->
    <view class="details">
      <view class="title">
        <view class="details-titleBg"></view>
        <image src="../../static/images/home/financial/left.png"></image>
        <text>{{ $t("Home.Aleo.FinancialNews.details-title") }}</text>
        <image src="../../static/images/home/financial/right.png"></image>
      </view>
      <view class="subTitle1">
        <view class="tag-text">
          <text>{{ $t("Home.Aleo.FinancialNews.details-tag1-text") }}</text>
        </view>
        <view class="box1">
          <text>{{ $t("Home.Aleo.FinancialNews.details-subTitle1-box1") }}</text>
        </view>
        <view class="box2">
          <text>
            {{ $t("Home.Aleo.FinancialNews.details-subTitle1-box2") }}
          </text>
        </view>
      </view>
      <view class="subTitle2">
        <view class="box1">
          <text>{{ $t("Home.Aleo.FinancialNews.details-subTitle2-box1") }}</text>
        </view>
        <view class="box2">
          <text>
            {{ $t("Home.Aleo.FinancialNews.details-subTitle2-box2") }}
          </text>
        </view>
      </view>
      <view class="subTitle3">
        <view class="tag-text">
          <text>{{ $t("Home.Aleo.FinancialNews.details-tag2-text") }}</text>
        </view>
        <view class="box1">
          <text>{{ $t("Home.Aleo.FinancialNews.details-subTitle3-box1") }}</text>
        </view>
        <view class="box2">
          <text>
            {{ $t("Home.Aleo.FinancialNews.details-subTitle3-box2") }}
          </text>
        </view>
      </view>
    </view>

    <!-- 投资档案 -->
    <view class="file">
      <view class="title">
        <view class="file-titleBg"></view>
        <image src="../../static/images/home/financial/left.png"></image>
        <text>{{ $t("Home.Aleo.FinancialNews.file-title") }}</text>
        <image src="../../static/images/home/financial/right.png"></image>
      </view>
      <view class="subTitle1">
        <view class="box1">
          <text>{{ $t("Home.Aleo.FinancialNews.file-subTitle1-box1") }}</text>
        </view>
        <view class="box2">
          <view>
            <view class="blue-circle"></view>
            <text>
              {{ $t("Home.Aleo.FinancialNews.file-subTitle1-box2-text1") }}
            </text>
          </view>
          <view>
            <view class="blue-circle"></view>
            <text>
              {{ $t("Home.Aleo.FinancialNews.file-subTitle1-box2-text2") }}
            </text>
          </view>
        </view>
      </view>
      <view class="subTitle2">
        <view class="box1">
          <text>{{ $t("Home.Aleo.FinancialNews.file-subTitle2-box1") }}</text>
        </view>
        <view class="box2">
          <view>
            <view class="blue-circle"></view>
            <text>
              {{ $t("Home.Aleo.FinancialNews.file-subTitle2-box2-text1") }}
            </text>
          </view>
          <view>
            <view class="blue-circle"></view>
            <text>
              {{ $t("Home.Aleo.FinancialNews.file-subTitle2-box2-text2") }}
            </text>
          </view>
          <view>
            <view class="blue-circle"></view>
            <text>{{ $t("Home.Aleo.FinancialNews.file-subTitle2-box2-text3") }}</text>
          </view>
        </view>
      </view>
      <view class="subTitle3">
        <view class="box1">
          <text>{{ $t("Home.Aleo.FinancialNews.file-subTitle3-box1") }}</text>
        </view>
        <view class="box2">
          <view>
            <view class="blue-circle"></view>
            <text>
              {{ $t("Home.Aleo.FinancialNews.file-subTitle3-box2-text1") }}
            </text>
          </view>
          <view>
            <view class="blue-circle"></view>
            <text>
              {{ $t("Home.Aleo.FinancialNews.file-subTitle3-box2-text2") }}
            </text>
          </view>
        </view>
      </view>
    </view>

    <!-- 立即投资按钮 -->
    <view class="buyBtn">
      <button type="default" @click="onBuyBtnClick">
        <text>{{ $t("Home.Aleo.FinancialNews.buyBtn") }}</text>
      </button>
    </view>

    <!-- 认证提示窗 -->
    <view>
      <uni-popup ref="alertDialog" type="dialog">
        <uni-popup-dialog
          type="info"
          :title="$t('Aleo.authenticationAlertDialog.title')"
          :cancelText="$t('Aleo.authenticationAlertDialog.cancel')"
          :confirmText="$t('Aleo.authenticationAlertDialog.confirm')"
          :content="$t('Aleo.authenticationAlertDialog.text')"
          @confirm="dialogConfirm"
          @close="dialogClose"
        >
        </uni-popup-dialog>
      </uni-popup>
    </view>

    <!-- 余额不足提示窗 -->
    <view>
      <uni-popup ref="alertDialogBalance" type="dialog">
        <uni-popup-dialog
          type="info"
          :title="$t('Aleo.balanceAlertDialog.title')"
          :cancelText="$t('Aleo.balanceAlertDialog.cancel')"
          :confirmText="$t('Aleo.balanceAlertDialog.confirm')"
          :content="$t('Aleo.balanceAlertDialog.text')"
          @confirm="dialogBalanceConfirm"
          @close="dialogClose"
        >
        </uni-popup-dialog>
      </uni-popup>
    </view>
  </view>
</template>

<script>
// #ifdef APP-PLUS
import APPUpdate from "@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate";
// #endif
export default {
  name: "AleoFinancialNews",
  data() {
    return {
      // 记录触发了几次需要更新APP
      appUpdate: 0,
      userToken: "",
      // 记录页面滚动距离
      pageScrollTop: "",
      // 是否綁定了leader
      isBindLeader: false,
      // 余额是否充足
      isRemainingEnough: false,
    };
  },
  onLoad(options) {
    try {
      const value = uni.getStorageSync("token");
      if (value) {
        // 获取token
        this.userToken = value;
      }
    } catch (e) {
      // error
    }
  },
  onShow() {
    // 获取接口 用户的上級邀請碼,上級uid和用戶uid
    this.getUsersLeader();
    // 获取接口 用户的余额
    this.getUsersRemaining();
  },
  computed: {
    topNavStyle() {
      let r = this.pageScrollTop / 100;
      return {
        style: `background-color: rgba(226, 228, 243,${r >= 1 ? 1 : r});`,
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
    // 获取接口 用户的上級邀請碼,上級uid和用戶uid
    getUsersLeader() {
      uni.request({
        url: this.host + "/app/judge_Has_Leader",
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
            // 如果res.data.data為true,説明綁定了上級邀請碼
            if (res.data.data) {
              this.isBindLeader = true;
            }
            // 如果res.data.data為false,説明沒綁定上級邀請碼
            if (!res.data.data) {
              this.isBindLeader = false;
            }
          }
        },
      });
    },
    // 获取接口 用户的余额验证
    getUsersRemaining() {
      uni.request({
        url: this.host + "/app/checkRechargeBalance",
        method: "GET",
        header: {
          //token
          "x-token": this.userToken,
          //version
          version: this.version,
        },
        success: (res) => {
          if (res.data.code != 0) {
            this.isRemainingEnough = false;
            return;
          }
          if (res.data.code == 0) {
            // 如果res.data.code為0,説明余额够
            this.isRemainingEnough = true;
          }
        },
      });
    },
    // 点击立即投资按钮
    onBuyBtnClick() {
      // 如果未绑定上级邀请码,打开提示弹窗
      if (!this.isBindLeader) {
        this.$refs.alertDialog.open();
        return;
      }
      // 如果已绑定过上级邀请码
      // 验证是否余额充足
      if (this.isRemainingEnough) {
        // 余额充足,直接跳转到新增投资页面
        uni.navigateTo({
          url: "/pages/news/AddAleoFinancial",
        });
      } else {
        this.$refs.alertDialogBalance.open();
      }
    },
    // 点击右上角邀请用户icon
    onInviteIconClick() {
      // 如果未绑定上级邀请码,打开提示弹窗
      if (!this.isBindLeader) {
        this.$refs.alertDialog.open();
        return;
      }
      // 如果已绑定过上级邀请码,直接跳转到二维码页面
      uni.navigateTo({
        url: "/pages/income/AleoIncome/inviteCustomers",
      });
    },
    // 认证弹窗
    dialogConfirm() {
      // 点击"立即认证"后跳转到  我的认证页面
      uni.navigateTo({
        url: "/pages/news/identity",
      });
    },
    // 余额弹窗
    dialogBalanceConfirm() {
      // 点击"立即获取"后跳转到  获取U页面
      uni.navigateTo({
        url: "/pages/news/AddAleoFinancial",
      });
    },
    dialogClose() {},
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
@import "@/static/css/MainColor.less";

//提示弹窗内部text样式
/deep/ .uni-dialog-content-text {
  text-align: center;
}

// 背景图片
.bg {
  z-index: -10;
  position: absolute;
  // left: -4rpx;
  top: -8rpx;
  width: 750rpx;
  height: 559rpx;
  background-image: url("@/static/images/home/financial/AleoInvestmentBg.png");
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
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .iconLeft {
      position: absolute;
      top: calc(var(--status-bar-height) + 14rpx);
      bottom: 10rpx;
      left: 40rpx;
    }

    .iconRight {
      position: absolute;
      top: calc(var(--status-bar-height) + 14rpx);
      bottom: 10rpx;
      right: 40rpx;
    }

    .text {
      margin-top: 18rpx;
      margin-bottom: 24rpx;

      text {
        margin-right: 12rpx;
        font-size: 34rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #242733;
      }
    }
  }
}

// Aleo标题背景
.main-title-bg {
  position: absolute;
  left: 25rpx;
  right: 25rpx;
  top: calc(var(--status-bar-height) + 40rpx);

  width: 700rpx;
  height: 400rpx;
  background-image: url("@/static/images/home/financial/AleoTitleBg.png");
  background-repeat: no-repeat;
  background-size: cover;
}

// Aleo标题
.main-title {
  z-index: 110;
  position: relative;
  padding: 120rpx 30rpx 30rpx;
  display: flex;
  flex-direction: column;
  margin-left: 24rpx;

  // 以定盈
  text:first-child {
    margin-top: 12rpx;
    font-size: 48rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #242733;
  }

  // 基于xxx
  text:last-child {
    margin-top: 24rpx;
    font-size: 28rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #2e334e;
  }
}

// 产品简介
.introduction {
  position: relative;
  z-index: 120;
  margin: 10rpx 25rpx;
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 64rpx 32rpx 24rpx;

  // 标题背后装饰图片
  .introduction-titleBg {
    z-index: 100;
    position: absolute;
    top: -18rpx;
    width: 360rpx;
    height: 34rpx;
    background-image: url("@/static/images/home/financial/INTRODUCTION.png");
    background-repeat: no-repeat;
    background-size: cover;
  }

  .title {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    image {
      width: 45rpx;
      height: 18rpx;
    }

    text {
      z-index: 120;
      position: relative;
      display: inline-block;
      margin-left: 25rpx;
      margin-right: 25rpx;
      font-size: 39rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #242733;
    }
  }

  .content {
    margin-top: 26rpx;

    text {
      font-size: 28rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #888da7;
    }
  }
}

// 产品详情
.details {
  position: relative;
  z-index: 120;
  margin: 24rpx 25rpx;
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 64rpx 16rpx 24rpx;

  // 标题背后装饰图片
  .details-titleBg {
    z-index: 100;
    position: absolute;
    top: -18rpx;
    width: 203rpx;
    height: 37rpx;
    background-image: url("@/static/images/home/financial/DETAILS.png");
    background-repeat: no-repeat;
    background-size: cover;
  }

  .title {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    image {
      width: 45rpx;
      height: 18rpx;
    }

    text {
      z-index: 120;
      position: relative;
      display: inline-block;
      margin-left: 25rpx;
      margin-right: 25rpx;
      font-size: 39rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #242733;
    }
  }

  // 头矿红利
  .subTitle1 {
    margin-top: 40rpx;
    width: 670rpx;
    height: 257rpx;
    background-image: url("@/static/images/home/financial/toukuanghongli.png");
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;

    // 加了星号部分的颜色
    .tag-text {
      width: 456rpx;
      height: 54rpx;
      background-image: url("@/static/images/home/financial/tag1.png");

      text {
        margin-top: 10rpx;
        font-size: 26rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
      }
    }

    // 小标题
    .box1 {
      padding-top: 60rpx;
      padding-left: 42rpx;

      text {
        color: #7a5c31;
      }
    }

    .box2 {
      width: 609rpx;

      text {
        line-height: 46rpx;
        color: #957444;
      }
    }
  }

  // 算力认购
  .subTitle2 {
    margin-top: 24rpx;
    width: 670rpx;
    height: 216rpx;
    background-image: url("@/static/images/home/financial/suanlirengou.png");
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;

    // 小标题
    .box1 {
      padding-top: 30rpx;
      padding-left: 42rpx;

      text {
        color: #2a3e97;
      }
    }

    .box2 {
      text {
        line-height: 46rpx;
        color: #2a3e97;
      }
    }
  }

  // 轻装上阵
  .subTitle3 {
    margin-top: 24rpx;
    margin-bottom: 16rpx;
    width: 670rpx;
    height: 232rpx;
    background-image: url("@/static/images/home/financial/suanlikuorong.png");
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;

    // 加了星号部分的颜色
    .tag-text {
      width: 456rpx;
      height: 54rpx;
      background-image: url("@/static/images/home/financial/tag3.png");

      text {
        margin-top: 10rpx;
        font-size: 26rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
      }
    }

    // 小标题
    .box1 {
      padding-top: 40rpx;
      padding-left: 42rpx;

      text {
        color: #652e77;
      }
    }

    .box2 {
      text {
        line-height: 46rpx;
        color: #652e77;
      }
    }
  }

  // 小标题
  .box1 {
    text {
      font-size: 30rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
    }
  }

  // 加了星号部分的颜色
  .tag-text {
    position: absolute;
    top: 0rpx;
    right: 0rpx;
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
  }

  .box2 {
    margin-top: 16rpx;
    margin-left: 42rpx;
    width: 609rpx;

    text {
      line-height: 46rpx;
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
    }
  }
}

// 投资档案
.file {
  margin: 20rpx 25rpx 160rpx;
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 24rpx 32rpx;

  // 标题背后装饰图片
  .file-titleBg {
    z-index: 100;
    position: absolute;
    top: -18rpx;
    width: 203rpx;
    height: 37rpx;
    background-image: url("@/static/images/home/financial/RECORD.png");
    background-repeat: no-repeat;
    background-size: cover;
  }

  .title {
    margin-top: 40rpx;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    image {
      width: 45rpx;
      height: 18rpx;
    }

    text {
      z-index: 120;
      position: relative;
      display: inline-block;
      margin-left: 25rpx;
      margin-right: 25rpx;
      font-size: 39rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #242733;
    }
  }

  .subTitle1,
  .subTitle2,
  .subTitle3 {
    background-color: rgba(229, 232, 248, 0.2);
    border-radius: 12rpx;
  }

  // 小标题
  .box1 {
    margin-top: 20rpx;
    padding-top: 40rpx;
    padding-left: 32rpx;

    text {
      font-size: 30rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #242733;
    }
  }

  // 加了星号部分的颜色
  .box2 {
    margin-top: 20rpx;
    padding-bottom: 24rpx;
    padding-left: 12rpx;

    text {
      font-size: 28rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #888da7;
      display: block;
      margin-bottom: 10rpx;
      width: 554rpx;
    }

    // text::before{
    // 	content: '● ';
    // 	color: #009BF9;
    // }
    .blue-circle {
      margin-right: 18rpx;
      margin-top: 16rpx;
      width: 8rpx;
      height: 8rpx;
      // background: #009bf9;
      background: @main-color;
      border-radius: 50%;
    }

    view {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: flex-start;
    }
  }
}

// 投资按钮
.buyBtn {
  z-index: 999;
  padding: 20rpx 0rpx;

  width: 750rpx;
  display: flex;
  justify-content: center;

  position: fixed;
  bottom: 0rpx;

  background-color: #ffffff;

  button {
    width: 640rpx;
    // background-color: #009bf9;
    background-color: @main-color;
    border-radius: 100rpx;

    text {
      font-size: 32rpx;
      font-family: AlibabaPuHuiTiM;
      color: #ffffff;
    }
  }
}
</style>
