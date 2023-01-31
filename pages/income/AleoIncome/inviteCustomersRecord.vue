<template>
  <view class="top">
    <view class="status_bar">
      <!-- 这里是占位状态栏 -->
    </view>
    <!-- 导航栏部分 -->
    <view class="box-bg">
      <view class="title">
        <view class="leftIcon">
          <uni-icons type="back" size="20" color="#2e334e" @click="back"></uni-icons>
        </view>
        <view class="content-title">
          <text class="uni-nav-bar-text">{{ $t("Aleo.Metaverse.topTabbar-title") }}</text>
        </view>
        <view class="rightIcon">
          <uni-icons type="personadd" size="28" color="#2e334e" @click="onInvitationBtnClick"></uni-icons>
        </view>
      </view>
    </view>
    <view class="top-box" :style="iOStyle">
      <view class="inspiredPoints" :style="topDivBg">
        <view class="content">
          <view class="clientBox">
            <view class="box2">
              <image :src="usernameIcon"></image>
              <view class="num">
                <text :style="leaderColor">{{ TotalNum.name }}</text>
              </view>
            </view>
          </view>
          <view class="box4">
            <view class="client">
              <view class="info">
                <view>
                  <text class="num" :style="leaderColor">{{ TotalNum.person }}</text>
                  <text class="unit" :style="leaderColor">人</text>
                </view>
              </view>
            </view>
            <view class="total">
              <view class="info">
                <view>
                  <text class="num" :style="leaderColor">{{ TotalNum.gu }}</text>
                  <text class="unit" :style="leaderColor">G</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view v-if="showTable">
      <view v-for="(cInfo, index) in clientData" :key="index" class="clientListDiv">
        <inviteClientListDiv :clientInfo="cInfo"></inviteClientListDiv>
      </view>
      <!-- 加载更多组件 -->
      <view v-if="isShowLoadMore == true">
        <uni-load-more iconType="circle" :status="status" :color="loadDivColor" />
      </view>
    </view>

    <!-- nodata img -->
    <view class="nodata" v-if="showNoDataImg">
      <image src="@/static/images/nodata.png"></image>
      <text>{{ $t("Aleo.InvestmentRecord.nodata") }}</text>
    </view>
  </view>
</template>

<script>
  import inviteClientListDiv from "@/components/Aleo/income/InviteClientListDiv.vue";
  // #ifdef APP-PLUS
  import APPUpdate from "@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate";
  // #endif
  export default {
    components: {
      inviteClientListDiv,
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
      const platform = uni.getSystemInfoSync().platform;
      if (platform === "android") {
        console.log(platform);
        this.iOStyle = "";
      } else {
        // this.iOStyle="margin-top: 90rpx+24rpx;";
        this.iOStyle="margin-top: 104rpx;";
      }
    },
    onShow() {
      // 获取接口 用户拓展的客戶列表及相關信息
      this.getUserExpandingCustomerList();
      // 获取接口 用户是否是leader
      this.checkUserIsLeader();
    },
    data() {
      return {
        // 记录触发了几次需要更新APP
        appUpdate: 0,
        userToken: "",
        // 存顶部顶部div信息
        TotalNum: {
          name: "暂无数据",
          person: 0,
          gu: 0,
        },
        // 控制顶部div背景图片
        topDivBg: "",
        // 控制顶部div文字颜色
        leaderColor: "",
        // 控制顶部div-username图标
        usernameIcon: "../../../static/images/income/Aleo/Metaverse/usernameIcon.png",
        // 是否是leader
        isLeader: false,
        // 底部上拉加载状态栏状态
        status: "more",
        // 当前page
        page: 1,
        // 当前每页的size
        pageSize: 10,
        // 标识用户有没有进行过上拉加载操作
        pullFlag: false,
        // 上拉加载组件是否显示
        isShowLoadMore: false,
        // 总共有多少条投资数据
        totalLength: null,
        // 是否顯示nodata圖片
        showNoDataImg: false,
        // 是否顯示table和btn
        showTable: true,
        // 裝接口獲取的客戶信息
        clientData: [],
        // 標識用戶有沒有觸發過"沒有更多數據"狀態
        isNoMoreData: false,
        // 加載組件的顔色
        loadDivColor: "#007AFF",
        // iOS的不同顶部样式
        iOStyle: "",
      };
    },
    methods: {
      // 获取接口 用户拓展的客戶列表及相關信息
      getUserExpandingCustomerList() {
        uni.request({
          // url: this.host + "/app/metaVerse/" + this.page + "/" + this.pageSize,
          url: this.host + "/app/metaVerse/" + this.page + "/" + 999,
          method: "GET",
          header: {
            //token
            "x-token": this.userToken,
            //version
            version: this.version,
          },
          success: (res) => {
            if (res.data.code != 0) {
              // 如果沒查到數據就顯示nodata圖片
              this.showNoDataImg = true;
              // 隱藏list
              this.showTable = false;
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
              if (res.data.data.total == 0) {
                // 如果沒查到數據就顯示nodata圖片
                this.showNoDataImg = true;
                // 隱藏list
                this.showTable = false;
                // 存顶部div数据
                this.TotalNum.name = res.data.data.list.NickName;
                this.TotalNum.person = res.data.data.list.TotalExpanded;
                this.TotalNum.gu = res.data.data.list.AmountTotal;
                return;
              }
              // 隱藏nodata圖片
              this.showNoDataImg = false;
              // 顯示list
              this.showTable = true;

              // 存顶部div数据
              this.TotalNum.name = res.data.data.list.NickName;
              this.TotalNum.person = res.data.data.list.TotalExpanded;
              this.TotalNum.gu = res.data.data.list.AmountTotal;

              // 存下方list数据
              this.clientData = res.data.data.list.Children;
              this.clientData.forEach((data) => {
                data.totalG = data.ChangeAmount + data.InvitationAmountTotal;
              });

              // 获取总共有多少条数据
              this.totalLength = res.data.data.total;
              // 如果总数小于分页的size,说明小于一页
              if (this.totalLength <= this.pageSize) {
                this.isShowLoadMore = false;
              }
              if (this.totalLength > this.pageSize) {
                this.isShowLoadMore = true;
              }
            }
          },
        });
      },
      // 获取接口  用户是否是leader
      checkUserIsLeader() {
        uni.request({
          url: this.host + "/app/user/check/leader",
          method: "GET",
          header: {
            "x-token": this.userToken,
            //version
            version: this.version,
          },
          success: (res) => {
            if (res.data.code == 0) {
              let isLeader = res.data.data.is_leader;
              if (isLeader == 1) {
                this.isLeader = true;
                // 是leader的话修改topDiv背景图片
                this.topDivBg = 'background-image: url("../../../static/images/income/Aleo/Metaverse/leaderBg.png");width: 702rpx;height: 272rpx;';
                // 是leader的话修改topDiv-usernameIcon
                this.usernameIcon = "../../../static/images/income/Aleo/Metaverse/leaderIcon.png";
                // 是leader的话修改topDiv文字颜色
                this.leaderColor = "color: #5D4F3C;";
              } else {
                console.log("不是leader");
                this.isLeader = false;
              }
            }
          },
        });
      },
      back() {
        uni.navigateBack({
          delta: 1,
        });
      },
      // 点击跳转 Aleo收益-邀请客户
      onInvitationBtnClick() {
        // 跳转到邀请二维码页面
        uni.navigateTo({
          url: "/pages/income/AleoIncome/inviteCustomers",
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
    },
    // 上拉加载
    onReachBottom() {
      // 如果觸發過"沒有更多數據"狀態,不繼續執行
      if (this.isNoMoreData) {
        return;
      }
      // 用户触发了上拉加载操作
      this.pullFlag = true;
      // 初始化pageSize
      this.pageSize = 10;
      let _this = this;
      this.status = "loading";
      setTimeout(function () {
        if (_this.clientData.length < _this.totalLength) {
          // 计算最多多少页
          const maxPage = Math.floor(_this.totalLength / _this.pageSize) + 1;

          if (_this.page < maxPage) {
            _this.page++;
          }
          // 获取接口 用户的投資記錄
          uni.request({
            url: _this.host + "/app/metaVerse/" + _this.page + "/" + _this.pageSize,
            method: "GET",
            header: {
              //token
              "x-token": _this.userToken,
              //version
              version: _this.version,
            },
            success: (res) => {
              // code!=0就是接口请求结果失败
              if (res.data.code != 0) {
                return;
              }

              let sliceArr = [];
              // 把onload里读取到的pageSize条投资信息都存入sliceArr
              sliceArr = res.data.data.list.Children;

              sliceArr.forEach((obj) => {
                obj.totalG = obj.ChangeAmount + obj.InvitationAmountTotal;
                _this.clientData.push(obj);
              });
            },
          });
          _this.status = "more";
        }

        if (_this.clientData.length >= _this.totalLength) {
          _this.status = "noMore";
          // 用戶已經觸發過一次"沒有更多數據"狀態
          _this.isNoMoreData = true;
          _this.loadDivColor = "#9EA3BB";
        }
      }, 2000);
    },
  };
</script>

<style lang="less">
  page {
    position: absolute;
    background-color: #f3f5f7;
  }
  .status_bar {
    height: var(--status-bar-height);
    width: 100%;
  }
</style>

<style lang="less" scoped>
  @import "@/static/css/MainColor.less";
  .top {
    position: relative;
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
        background-color: #ffffff;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .leftIcon {
          margin-left: 52rpx;
        }
        .content-title {
          .uni-nav-bar-text {
            font-size: 34rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #2e334e;
            line-height: 48rpx;
          }
        }
        .rightIcon {
          margin-right: 32rpx;
        }
      }
    }
  }

  .clientListDiv {
    display: flex;
    justify-content: center;
    margin-top: 24rpx;
    margin-bottom: 24rpx;
  }
  .nodata {
    margin-top: 296rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    image {
      width: 292rpx;
      height: 198rpx;
    }
    text {
      display: block;
      margin-top: 46rpx;
      font-size: 30rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #2e334e;
    }
  }

  // 顶部div样式
  .top-box {
    margin-top: calc(var(--status-bar-height) + 60rpx);
    display: flex;
    justify-content: center;
    .inspiredPoints {
      background-image: url("@/static/images/income/Aleo/Metaverse/userBg.png");
      background-repeat: no-repeat;
      background-size: cover;
      width: 700rpx;
      height: 270rpx;
      .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        .clientBox {
          margin-top: 40rpx;
          width: 700rpx;
          //    .box2::before {
          //  content: "";
          //  background-image: url("@/static/images/income/Aleo/Metaverse/usernameIcon.png");
          //  background-size: cover;
          //  display: inline-block;
          //  width: 60rpx;
          //  height: 60rpx;
          //  margin-right: 10rpx;
          // }
          .box2 {
            position: relative;
            margin-left: 40rpx;
            display: flex;
            flex-direction: row;
            align-items: center;
            // username
            .num {
              text {
                font-size: 38rpx;
                font-family: PingFang-SC-Medium, PingFang-SC;
                font-weight: 500;
                color: #636dad;
              }
            }
            // icon
            image {
              width: 60rpx;
              height: 60rpx;
              margin-right: 10rpx;
            }
          }
        }

        .box4 {
          margin-top: 76rpx;
          width: 700rpx;
          display: flex;
          flex-direction: row;
          .info {
            display: flex;
            flex-direction: row;
            align-items: center;
            // 数字
            .num {
              // display: flex;
              // align-items: baseline;
              font-size: 54rpx;
              font-family: SpaceGrotesk-Regular, SpaceGrotesk;
              font-weight: 400;
              color: #636dad;
              line-height: 69rpx;
            }
            // 单位
            .unit {
              display: inline-block;
              margin-left: 8rpx;
              font-size: 28rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #636dad;
              line-height: 40rpx;
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
            display: flex;
            flex-direction: column;
            margin-left: 200rpx;
            // icon
            .info:first-of-type::before {
              content: "";
              background-image: url("@/static/images/income/Aleo/Metaverse/guNumIcon.png");
              background-size: cover;
              display: inline-block;
              width: 50rpx;
              height: 50rpx;
              margin-right: 20rpx;
            }
          }
          // 客户数
          .client {
            margin-left: 40rpx;
            display: flex;
            flex-direction: column;
            // icon
            .info:first-of-type::before {
              content: "";
              background-image: url("@/static/images/income/Aleo/Metaverse/personNumIcon.png");
              background-size: cover;
              display: inline-block;
              width: 50rpx;
              height: 50rpx;
              margin-right: 20rpx;
            }
          }
        }
      }
    }
  }
</style>
