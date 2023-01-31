<template>
  <view class="page flex-col">
    <view class="status_bar"></view>

    <!-- 顶部导航栏 -->
    <view class="header-fixed">
      <uni-nav-bar height="118rpx" backgroundColor="#ffffff" left-icon="left" @clickLeft="back">
        <view class="header-title">
          <span>提现管理</span>
        </view>
      </uni-nav-bar>
    </view>

    <view class="block_2 flex-col">
      <view class="group_2 flex-col">
        <view class="box_5 flex-row">
          <view class="block_4 flex-col"></view>
          <text class="text_4">当前余额</text>
          <text class="text_5" @click="record">提现记录</text>
        </view>
        <view class="box_6 flex-row">
          <view class="text-wrapper_2">
            <text class="text_6">{{ balance }}</text>
            <text class="text_7">&nbsp;{{ currencyCategory }}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="block_5 flex-col">
      <text class="text_8">快速提现</text>
      <view class="grid_1 flex-row">
        <view class="text-wrapper_3 flex-col" :class="{ style: select1 }" @click="Select1">
          <text class="text_9">1&nbsp;{{ currencyCategory }}</text>
        </view>
        <view class="text-wrapper_3 flex-col" :class="{ style: select2 }" @click="Select2">
          <text class="text_9">2&nbsp;{{ currencyCategory }}</text>
        </view>
        <view class="text-wrapper_3 flex-col" :class="{ style: select3 }" @click="Select3">
          <text class="text_9">5&nbsp;{{ currencyCategory }}</text>
        </view>
        <view class="text-wrapper_3 flex-col" :class="{ style: select4 }" @click="Select4">
          <text class="text_9">10&nbsp;{{ currencyCategory }}</text>
        </view>
      </view>

      <text class="text_10">自定义金额</text>
      <view class="group_3 flex-row">
        <input type="number" class="inputstyle" v-model="num" @focus="change" />
      </view>

      <text class="text_12">提现地址</text>
      <view class="group_4 flex-row">
        <text class="text_13">{{ walletAddress }}</text>
      </view>

      <button class="text-wrapper_4 flex-col" @click="confirmWithdraw">
        确认提现
      </button>
    </view>

    <view class="popup-bg" :catchtouchmove="true" @click="closemask" v-if="showmask"></view>
    <view class="group_8 flex-col" v-if="success">
      <view class="group_9 flex-row justify-between">
        <view class="block_3 flex-col"></view>
        <text class="text_18">提交成功</text>
      </view>
      <text class="text_19_1">提现申请已提交成功，请等待系统处理</text>
      <button class="button_1 flex-col" @click="closemask">
        <text class="text_20">确定</text>
      </button>
    </view>

    <view class="group_9_1 flex-col" v-if="error">
      <view class="group_10 flex-row justify-between">
        <view class="group_11 flex-col"></view>
        <text class="text_18">提交失败</text>
      </view>
      <text class="text_19">提现申请失败，请重新提交</text>
      <button class="text-wrapper_8 flex-col" @click="closemask">
        <text class="text_20">确定</text>
      </button>
    </view>
  </view>
</template>
<script>
// #ifdef APP-PLUS
import APPUpdate from "@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate";
// #endif
export default {
  data() {
    return {
      productid: "",
      balance: "",
      walletAddress: "",
      currencyCategory: "",
      token: "",
      select1: false,
      select2: false,
      select3: false,
      select4: false,
      num: "",
      showmask: false,
      success: false,
      error: false,
      productidstr: "",
      // 记录触发了几次需要更新APP
      appUpdate: 0,
    };
  },
  onLoad(options) {
    this.productidstr = options.productid;
    this.productid = parseInt(options.productid);
    this.token = uni.getStorageSync("token");

    this.getinfo();
  },
  methods: {
    Select1() {
      this.select1 = true;
      this.select2 = false;
      this.select3 = false;
      this.select4 = false;
    },
    Select2() {
      this.select1 = false;
      this.select2 = true;
      this.select3 = false;
      this.select4 = false;
    },
    Select3() {
      this.select1 = false;
      this.select2 = false;
      this.select3 = true;
      this.select4 = false;
    },
    Select4() {
      this.select1 = false;
      this.select2 = false;
      this.select3 = false;
      this.select4 = true;
    },
    change() {
      this.select1 = false;
      this.select2 = false;
      this.select3 = false;
      this.select4 = false;
    },
    callinterface(withdrawmoney) {
      uni.request({
        header: {
          "Content-Type": "application/json",
          "x-token": this.token,
          //version
          version: this.version,
        },
        url: this.host + "/app/withdraw",
        method: "POST",
        data: {
          change_amount: withdrawmoney,
          product_id: this.productidstr,
        },
        dataType: "json",
        success: (res) => {
          if (res.data.code == 2) {
            console.log("需要更新版本");
            this.appUpdate++;
            // 控制只出现一次弹窗
            if (this.appUpdate >= 0 && this.appUpdate < 2) {
              // #ifdef APP-PLUS
              APPUpdate(true);
              // #endif
            }
            return;
          }
          this.success = true;
          this.showmask = true;
          // return;
          this.getinfo();
        },
      });
    },
    getinfo() {
      uni.request({
        header: {
          "Content-Type": "application/json",
          "x-token": this.token,
          //version
          version: this.version,
        },
        url: this.host + "/app/querybalance?productid=" + this.productid,
        method: "GET",
        data: {},
        dataType: "json",
        success: (res) => {
          if (res.data.code == 2) {
            console.log("需要更新版本");
            this.appUpdate++;
            // 控制只出现一次弹窗
            if (this.appUpdate >= 0 && this.appUpdate < 2) {
              // #ifdef APP-PLUS
              APPUpdate(true);
              // #endif
            }
            return;
          }
          this.balance = parseFloat(res.data.data.balance).toFixed(5);
          this.currencyCategory = res.data.data.currency_category;
        },
        complete: () => {
          uni.request({
            header: {
              "Content-Type": "application/json",
              "x-token": this.token,
              //version
              version: this.version,
            },
            url: this.host + "/app/user/account/list",
            method: "GET",
            data: {},
            dataType: "json",
            success: (res) => {
              if (res.data.code == 2) {
                console.log("需要更新版本");
                this.appUpdate++;
                // 控制只出现一次弹窗
                if (this.appUpdate >= 0 && this.appUpdate < 2) {
                  // #ifdef APP-PLUS
                  APPUpdate(true);
                  // #endif
                }
                return;
              }
              let i = 0;
              while (i < res.data.data.length) {
                if (this.currencyCategory == res.data.data[i].currencyCategory) {
                  this.walletAddress = res.data.data[i].walletAddress;
                }
                i++;
              }
            },
          });
        },
      });
    },
    record() {
      uni.navigateTo({
        url: "/pages/mine/WithDrawRecord?productId=" + this.productid,
      });
    },
    confirmWithdraw() {
      if (this.select1 == true) {
        if (this.balance < 1) {
          this.error = true;
          this.showmask = true;
          return;
        }
        this.callinterface(1);
        return;
      }
      if (this.select2 == true) {
        if (this.balance < 2) {
          this.error = true;
          this.showmask = true;
          return;
        }
        this.callinterface(2);
        return;
      }
      if (this.select3 == true) {
        if (this.balance < 5) {
          this.error = true;
          this.showmask = true;
          return;
        }
        this.callinterface(5);
        return;
      }
      if (this.select4 == true) {
        if (this.balance < 10) {
          this.error = true;
          this.showmask = true;
          return;
        }
        this.callinterface(10);
        return;
      }
      if (this.balance < this.num || this.num == "" || this.num < 0.5) {
        this.error = true;
        this.showmask = true;
        return;
      }
      this.callinterface(this.num);
    },
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    closemask() {
      this.showmask = false;
      this.success = false;
      this.error = false;
    },
  },
};
</script>
<style>
@import "@/static/css/common.css";
@import "@/static/css/withdraw.css";
@import "@/static/css/success.css";
@import "@/static/css/error.css";
page {
  background-color: rgba(243, 245, 247, 1);
}
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
  background-color: #ffffff;
  position: fixed;
}
.header-fixed {
  width: 100%;
  position: fixed;
  top: var(--status-bar-height);
  z-index: 100;
}
.header-title {
  width: 100%;
  display: flex;
  align-self: center;
  justify-content: center;
}
.header-title > span {
  width: 204rpx;
  height: 48rpx;
  color: rgba(46, 51, 78, 1);
  font-size: 34rpx;
  font-family: PingFangSC-Medium;
  text-align: center;
  white-space: nowrap;
  line-height: 48rpx;
}
.style {
  border: 1.5px solid rgba(0, 155, 249, 1);
  background-color: rgba(0, 155, 249, 0.1);
  color: rgba(0, 155, 249, 1);
}
.inputstyle {
  width: 100%;
  height: 100%;
  font-size: 32rpx;
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
