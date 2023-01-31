<template>
  <view>
    <view class="outer1 flex-col">
      <view class="box1 flex-col">
        <view class="mod1 flex-row"></view>

        <view class="mod2 flex-row justify-between" @click="skip">
          <view class="bd1 flex-col justify-between">
            <text class="word2">{{ username }}</text>
            <view class="ImageText1 flex-row justify-between">
              <view class="outer2"></view>
              <view class="TextGroup1 flex-col">
                <text class="info1">{{ uid }}</text>
              </view>
            </view>
          </view>

          <!-- 头像 -->
          <view class="headimg1">
            <image class="headimg1" src="@/static/images/headerimg.png"></image>
            <image :class="{ headimg1: headerimg1, headimg: headerimg2 }" :src="src" mode="aspectFill" style="z-index: 1;"></image>
          </view>
        </view>
        <view class="mod4 flex-col" v-if="false">
          <view class="bd3 flex-row">
            <!-- 投资管理 -->
            <view class="block1 flex-col justify-between" @click="childUser">
              <view class="mod5 flex-col subaccount"></view>
              <view class="TextGroup2 flex-col">
                <text class="info2">{{ $t("mine.index-submanage") }}</text>
              </view>
            </view>

            <!-- 钱包管理 -->
            <view class="block1 flex-col justify-between" @click="walletmanage">
              <view class="mod5 flex-col wallet"></view>
              <view class="TextGroup2 flex-col">
                <text class="info2">{{ $t("mine.index-moneymanage") }}</text>
              </view>
            </view>

            <!-- 提现管理 -->
            <view class="block1 flex-col justify-between" @click="withdrawmanage">
              <view class="mod5 flex-col money"></view>
              <view class="TextGroup2 flex-col">
                <text class="info2">{{ $t("mine.index-tixianmanage") }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="outer7 flex-col">
      <!-- 修改密码 -->
      <view class="mod8 flex-row justify-between" @click="editPassword">
        <text class="word3">{{ $t("mine.index-editpassword") }}</text>
        <view class="outer8 flex-col"></view>
      </view>

      <!-- 意见反馈 -->
      <view class="mod11 flex-row justify-between" @click="optionclick">
        <text class="info4">{{ $t("mine.index-option") }}</text>
        <view class="mod12 flex-col"></view>
      </view>

      <!-- 关于应用 -->
      <view class="mod13 flex-row justify-between" @click="aboutAPPClick">
        <text class="word4">{{ $t("mine.index-about") }}</text>
        <view class="layer5 flex-col"></view>
      </view>

      <!-- 邀请好友 -->
      <view class="mod13 flex-row justify-between" @click="yaoqingFriend">
        <text class="word4">{{ $t("common.yaoqinghaoyou") }}</text>
        <view class="layer5 flex-col"></view>
      </view>

      <!-- 设置 -->
      <view class="mod14 flex-row justify-between" @click="enterset">
        <text class="txt4">{{ $t("mine.index-set") }}</text>
        <view class="ImageText2 flex-row justify-between">
          <view class="TextGroup4 flex-col">
            <text class="info5">{{ $t("mine.index-set-info") }}</text>
          </view>
          <view class="mod15 flex-col"></view>
        </view>
      </view>
    </view>
    <!-- 子账户弹窗 -->
    <view class="popup-bg" :catchtouchmove="true" v-if="subpop">
      <view class="section_2 flex-col">
        <view class="group_2 flex-row justify-between">
          <view class="group_3 flex-col"></view>
          <view class="icon_1 flex-col" @click="subpop = false"></view>
        </view>
        <view class="text-group_1 flex-col justify-between">
          <text class="text_1">{{ $t("common.subpop-title") }}</text>
          <text class="text_2">{{ $t("common.subpop-content") }}</text>
        </view>
        <button class="button_1 flex-col" @click="subpop = false">
          <text>{{ $t("common.know-popconfirm") }}</text>
        </button>
        <view class="group_4 flex-col"></view>
      </view>
    </view>

    <!-- 钱包弹窗 -->
    <view class="popup-bg" :catchtouchmove="true" v-if="moneypop">
      <view class="section_2 flex-col">
        <view class="group_2 flex-row justify-between">
          <view class="group_3 flex-col"></view>
          <view class="icon_1 flex-col" @click="moneypop = false"></view>
        </view>
        <view class="text-group_1 flex-col justify-between">
          <text class="text_1">{{ $t("common.moneypop-title") }}</text>
          <text class="text_2">{{ $t("common.moneypop-content") }}</text>
        </view>
        <button class="button_1 flex-col" @click="moneypop = false">
          <text>{{ $t("common.know-popconfirm") }}</text>
        </button>
        <view class="group_4 flex-col"></view>
      </view>
    </view>

    <!-- 提现弹窗 -->
    <view class="popup-bg" :catchtouchmove="true" v-if="widthrawpop">
      <view class="section_2 flex-col">
        <view class="group_2 flex-row justify-between">
          <view class="group_3 flex-col"></view>
          <view class="icon_1 flex-col" @click="widthrawpop = false"></view>
        </view>
        <view class="text-group_1 flex-col justify-between">
          <text class="text_1">{{ $t("common.widthrawpop-title") }}</text>
          <text class="text_2">{{ $t("common.widthrawpop-content") }}</text>
        </view>
        <button class="button_1 flex-col" @click="widthrawpop = false">
          <text>{{ $t("common.know-popconfirm") }}</text>
        </button>
        <view class="group_4 flex-col"></view>
      </view>
    </view>

    <!-- 提示窗示例 -->
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
        ></uni-popup-dialog>
      </uni-popup>
    </view>
  </view>
</template>
<script>
import img from "@/static/images/headerimg.png";
import APPUpdate from "@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate";
export default {
  data() {
    return {
      username: "",
      switchBtn: false,
      uid: "",
      src: img,
      token: "",

      subpop: false,
      moneypop: false,
      widthrawpop: false,
      headerimg1: true,
      headerimg2: false,
      // 记录触发了几次需要更新APP
      appUpdate: 0,
      // 是否綁定了leader
      isBindLeader: false,
	    IsLogOut: '',
    };
  },
  onShow() {
    // 用于概览页面刷新
    uni.setStorageSync("isChangeTabbar", 1);

    var uuid = uni.getStorageSync("user").uuid;
    this.username = uni.getStorageSync("user").nickName;
    this.uid = uuid.substring(uuid.length - 6, uuid.length);
    this.token = uni.getStorageSync("token");
    // 执行查看是否有leader
    this.getUsersLeader();
    uni.request({
      header: {
        "x-token": this.token,
        //version
        version: this.version,
      },
      url: this.host + "/app/avatar",
      method: "GET",
      // responseType:"ArrayBuffer",
      dataType: "json",
      success: (res) => {
        if (res.data.code == 2) {
          console.log("需要更新版本");
          this.appUpdate++;
          // 控制只出现一次弹窗
          if (this.appUpdate >= 0 && this.appUpdate < 2) {
            APPUpdate(true);
          }
        }
        if (res.data.code == 0) {
			this.IsLogOut = res.data.data.IsLogOut;
		  if(res.data.data.Pics){
			  this.headerimg1 = false;
			  this.headerimg2 = true;
			  this.src = res.data.data.Pics;
		  }

        }
      },
    });
  },
  methods: {
    confirmModel() {
      this.status = false;
    },
    modelCancel() {
      this.status = false;
    },
    skip() {
      uni.navigateTo({
        url: "/pages/mine/userDate",
        success(res) {},
        fail(res) {},
      });
      // this.$router.push({path:'/pages/mine/userDate',params:{}})
    },
    childUser() {
      this.subpop = true;
      return;
      uni.navigateTo({
        url: "/pages/mine/subAccount",
        success(res) {},
        fail(res) {},
      });
      // this.$router.push('/pages/mine/subAccount');
    },
    walletmanage() {
      this.moneypop = true;
      return;
      uni.navigateTo({
        url: "/pages/mine/WalletManage",
        success(res) {},
        fail(res) {},
      });
      // this.$router.push('/pages/mine/WalletManage');
    },
    editPassword() {
      uni.navigateTo({
        url: "/pages/mine/editPassword",
        success(res) {},
        fail(res) {},
      });
      // this.$router.push('/pages/mine/editPassword');
    },
    enterset() {
      uni.navigateTo({
        url: "/pages/mine/set?IsLogOut="+this.IsLogOut,
        success(res) {},
        fail(res) {},
      });
    },
    optionclick() {
      uni.navigateTo({
        url: "/pages/mine/option",
        success(res) {},
        fail(res) {},
      });
    },
    // 关于应用点击跳转事件
    aboutAPPClick() {
      uni.navigateTo({
        url: "/pages/mine/aboutAPP/aboutAPP",
        success(res) {},
        complete(res) {},
      });
    },
    withdrawmanage() {
      this.widthrawpop = true;
      return;
      uni.navigateTo({
        url: "/pages/mine/WithdrawManage",
      });
    },
    // 邀请好友点击
    yaoqingFriend() {
      // 如果未绑定上级邀请码,打开提示弹窗
      if (!this.isBindLeader) {
        this.$refs.alertDialog.open();
        return;
      }
      uni.navigateTo({
        url: "/pages/income/AleoIncome/inviteCustomers",
      });
    },
    // 获取接口 用户的上級邀請碼,上級uid和用戶uid
    getUsersLeader() {
      uni.request({
        url: this.host + "/app/judge_Has_Leader",
        method: "GET",
        header: {
          //token
          "x-token": uni.getStorageSync("token"),
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
                APPUpdate(true);
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
    dialogConfirm() {
      // 点击"立即认证"后跳转到  我的认证页面
      uni.navigateTo({
        url: "/pages/news/identity",
      });
    },
    dialogClose() {},
  },
};
</script>
<style>
@import "@/static/css/common.css";
@import "@/static/css/mineindex.css";
@import "@/static/css/zizhanghu.css";

page {
  background-color: rgba(243, 245, 247, 1);
}
.outer1 {
  height: 752rpx;
  background: url("@/static/images/mine/background.png");
  background-size: 100% 100%;
  background-color: liner-gr;
  width: 750rpx;
}
.mod4 {
  height: 210rpx;
  background: url("@/static/images/mine/juxing.png");
  background-size: 100% 100%;
  margin-top: 77rpx;
  width: 702rpx;
}
.mod5 {
  border-radius: 50%;
}
.info2 {
  text-align: center;
}
.subaccount {
  background: url("@/static/images/mine/icon1.png") no-repeat;
  background-size: 100% 100%;
}
.wallet {
  background: url("@/static/images/mine/icon2.png") no-repeat;
  background-size: 100% 100%;
}
.money {
  background: url("@/static/images/mine/icon3.png") no-repeat;
  background-size: 100% 100%;
}
.headimg1 {
  width: 157rpx;
  height: 157rpx;
  border-radius: 50%;
  position: absolute;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.headimg {
  width: 144rpx;
  height: 144rpx;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mod8 {
  width: 676rpx;
  margin: 31rpx 0 0 42rpx;
  height: 120rpx;
  display: flex;
  align-items: center;
}

.switch-button {
  width: 87rpx;
  height: 87rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mod9 {
  height: 90rpx;
  margin: 8rpx 0 0 42rpx;
}

.mod13 {
  width: 676rpx;
  height: 120rpx;
  margin: 0 0 0 42rpx;
}

.popup-bg {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  background-color: rgba(1, 1, 1, 0.3);
  z-index: 1000;
}
</style>

<style lang="less" scoped>
//提示弹窗内部text样式
/deep/ .uni-dialog-content {
  text-align: center;
  word-break: break-all;
  box-sizing: border-box;
}
/deep/ .uni-dialog-content-text {
  text-align: center;
}
</style>
