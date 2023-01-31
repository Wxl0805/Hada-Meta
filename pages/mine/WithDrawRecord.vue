<template>
  <view class="content">
    <view class="status_bar"></view>

    <!-- 顶部导航栏 -->
    <view class="header-fixed">
      <uni-nav-bar height="118rpx" backgroundColor="#ffffff" left-icon="left" @clickLeft="back">
        <view class="header-title">
          <span>提现管理</span>
        </view>
      </uni-nav-bar>
    </view>

    <view class="all">
      <view class="block_2 flex-row" @click="withdrawinfo(item)" v-for="(item, key) in List" :key="key">
        <view class="text-group_1 flex-col justify-between">
          <text class="text_4"
            >{{ item.businessType == 6 || item.businessType == 7 || item.businessType == 8 ? "自动提现" : "手动提现" }}&nbsp;{{
              item.businessType == 4 || item.businessType == 7 ? "(系统处理中)" : ""
            }}</text
          >
          <text class="text_5">{{ item.tradeTime.substring(0, 16).replace("T", " ") }}</text>
        </view>
        <view class="text-group_2 flex-col justify-between">
          <text class="text_6">+{{ item.changeAmount }}</text>
          <text
            class="text_7"
            :class="{
              errorcolor: item.businessType == 3 || item.businessType == 6,
              successcolor: item.businessType == 5 || item.businessType == 8,
              detailcolor: item.businessType == 4 || item.businessType == 7,
            }"
            >{{ item.businessType == 4 || item.businessType == 7 ? "提现中" : item.businessType == 3 || item.businessType == 6 ? "提现失败" : "已提现" }}
          </text>
        </view>
      </view>

      <!-- 加载更多组件 -->
      <view>
        <uni-load-more iconType="circle" :status="status" color="#007AFF" />
      </view>
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
      page: 1,
      pagesize: 10,
      total: 0,
      List: [],
      newData: [],
      status: "loading",
      token: "",
      // 记录触发了几次需要更新APP
      appUpdate: 0,
    };
  },
  onLoad(option) {
    this.token = uni.getStorageSync("token");
    this.productId = option.productId;
    uni.request({
      url: this.host + "/app/user/withdrawal/record?productId=" + this.productId + "&page=" + this.page + "&pageSize=" + this.pagesize,
      header: {
        "Content-Type": "application/json",
        "x-token": this.token,
        //version
        version: this.version,
      },
      method: "GET",
      data: {},
      dataType: "json",
      success: (res) => {
        this.List = res.data.data.list;
        this.total = res.data.data.total;
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
        if (res.data.code == 7) {
          this.status = "nomore";
          return;
        }
        if (this.List.length == this.total) {
          this.status = "nomore";
          return;
        }
        this.status = "more";
      },
    });
  },
  // 上拉加载更多,onReachBottom上拉触底函数
  onReachBottom: function () {
    this.status = "more";
    this.loadMoreFunc();
  },
  methods: {
    withdrawinfo(info) {
      uni.navigateTo({
        url: "/pages/mine/WithdrawInfo?info=" + JSON.stringify(info),
      });
    },
    loadMoreFunc: function () {
      //展示loading
      this.status = "loading";
      this.page++; // 当上拉触发页码++
      uni.request({
        url: this.host + "/app/user/withdrawal/record?subCustomerId=" + this.productId + "&page=" + this.page + "&pageSize=" + this.pagesize,
        header: {
          "Content-Type": "application/json",
          "x-token": this.token,
          //version
          version: this.version,
        },
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
          if (this.List.length == this.total) {
            this.status = "noMore"; //没有数据时显示‘没有更多’
            return;
          }
          this.newData = res.data.data.list;
          this.List = this.List.concat(this.newData);
        },
      });
    },

    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
  },
};
</script>

<style>
@import "@/static/css/common.css";
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
page {
  background-color: rgba(243, 245, 247, 1);
}
.all {
  position: relative;
  top: calc(var(--status-bar-height) + 118rpx);
}
.block_2 {
  background-color: rgba(255, 255, 255, 1);
  width: 750rpx;
  height: 151rpx;
  border-bottom: 1px solid rgba(243, 245, 247, 1);
}

.text-group_1 {
  width: 330rpx;
  height: 87rpx;
  margin: 32rpx 0 0 42rpx;
}

.text_4 {
  width: 330rpx;
  height: 42rpx;
  color: rgba(46, 51, 78, 1);
  font-size: 30rpx;
  font-family: PingFangSC-Medium;
  text-align: left;
  white-space: nowrap;
  line-height: 42rpx;
}

.text_5 {
  width: 212rpx;
  height: 33rpx;
  color: rgba(158, 163, 187, 1);
  font-size: 24rpx;
  text-align: left;
  white-space: nowrap;
  line-height: 33rpx;
  margin-top: 12rpx;
}

.text-group_2 {
  width: 250rpx;
  height: 87rpx;
  margin: 32rpx 41rpx 0 auto;
}

.text_6 {
  width: 100%;
  height: 42rpx;
  color: rgba(46, 51, 78, 1);
  font-size: 30rpx;
  font-family: PingFangSC-Medium;
  text-align: right;
  white-space: nowrap;
  line-height: 42rpx;
}

.text_7 {
  width: 150rpx;
  height: 33rpx;
  font-size: 24rpx;
  text-align: right;
  white-space: nowrap;
  line-height: 33rpx;
  margin: 12rpx 0 0 auto;
}
.errorcolor {
  color: rgba(255, 0, 0, 1);
}
.successcolor {
  color: rgba(158, 163, 187, 1);
}
.detailcolor {
  color: rgba(250, 143, 1, 1);
}
</style>
