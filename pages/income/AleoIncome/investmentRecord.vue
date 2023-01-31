<template>
  <view class="top">
    <view class="uniList-list" v-if="showTable">
      <view class="list">
        <view v-for="(info, index) in recordData" :key="index">
          <view @click="onListItemClick(info)">
            <!-- 顶部灰色横线 -->
            <view style="width: 750rpx; height: 1rpx; background-color: #f5f9fa;"></view>
            <investment-record-div :record="info"></investment-record-div>
            <!-- 顶部灰色横线 -->
            <view style="width: 750rpx; height: 1rpx; background-color: #f5f9fa;"></view>
          </view>
        </view>
        <!-- 加载更多组件 -->
        <view v-if="isShowLoadMore">
          <uni-load-more iconType="circle" :status="status" :color="loadDivColor" />
        </view>
      </view>
    </view>

    <!-- 追加投资按钮 -->
    <view class="addBtn" v-if="showTable">
      <button type="default" @click="onAddInvestmentBtnClick">
        <text>{{ $t("Aleo.InvestmentRecord.addBtn") }}</text>
      </button>
    </view>

    <!-- nodata img -->
    <view class="nodata" v-if="showNoDataImg">
      <image src="@/static/images/nodata.png"></image>
      <text>{{ $t("Aleo.InvestmentRecord.nodata") }}</text>
    </view>

    <!-- 提示窗示例 -->
    <view>
      <uni-popup ref="alertDialog" type="dialog">
        <uni-popup-dialog
          type="info"
          :title="$t('Aleo.alertDialog.title')"
          :cancelText="$t('Aleo.alertDialog.cancel')"
          :confirmText="$t('Aleo.alertDialog.confirm')"
          :content="$t('Aleo.alertDialog.text')"
          @confirm="dialogConfirm"
          @close="dialogClose"
        ></uni-popup-dialog>
      </uni-popup>
    </view>
  </view>
</template>

<script>
import InvestmentRecordDiv from "@/components/Aleo/income/investmentRecordDiv.vue";
// #ifdef APP-PLUS
import APPUpdate from "@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate";
// #endif
export default {
  components: {
    InvestmentRecordDiv,
  },
  onBackPress(options) {
    if (options.from === "navigateBack") {
      return false;
    }

    if (this.from == "record") {
      uni.navigateBack({
        delta: 2,
      });
    } else {
      uni.navigateBack({
        delta: 1,
      });
    }
    return true;
  },
  onLoad(options) {
    this.from = options.from;
    try {
      const value = uni.getStorageSync("token");
      if (value) {
        // 获取token
        this.userToken = value;
      }
    } catch (e) {
      // error
    }
    // 获取接口 用户的投資記錄
    this.getUserInvestmentRecord();
    // 获取接口 用户是否填寫了上級邀請碼
    this.getUsersLeader();
  },
  data() {
    return {
      // 记录触发了几次需要更新APP
      appUpdate: 0,
      from: "",
      userToken: "",
      // 底部上拉加载状态栏状态
      status: "more",
      // 当前page
      page: 1,
      // 当前每页的size
      pageSize: 14,
      // 标识用户有没有进行过上拉加载操作
      pullFlag: false,
      // 总共有多少条投资数据
      totalLength: null,
      // 上拉加载组件是否显示
      isShowLoadMore: false,
      // 是否顯示nodata圖片
      showNoDataImg: false,
      // 是否顯示table和btn
      showTable: true,
      // 裝從接口獲取到的投資記錄
      recordData: [],
      // 標識用戶有沒有觸發過"沒有更多數據"狀態
      isNoMoreData: false,
      // 加載組件的顔色
      loadDivColor: "#007AFF",
      // 是否綁定了leader
      isBindLeader: false,
    };
  },
  methods: {
    // 控制提示彈窗-確認按鈕
    dialogConfirm() {
      // 点击"立即认证"后跳转到  我的认证页面
      uni.navigateTo({
        url: "/pages/news/identity",
      });
    },
    // 控制提示彈窗-關閉按鈕
    dialogClose() {},
    // 获取接口 用户的上級邀請碼,上級uid和用戶uid
    getUsersLeader() {
      uni.request({
        url: this.host + "/app/judge_Has_Leader",
        // url: "http://192.168.3.112:8888/app/judge_Has_Leader",
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
    // 获取接口 用户的投資記錄
    getUserInvestmentRecord() {
      uni.request({
        url: this.host + "/app/queryinvestment",
        // url: "http://192.168.3.82:8887/app/queryinvestment",
        method: "GET",
        header: {
          //token
          "x-token": this.userToken,
          //version
          version: this.version,
        },
        data: {
          page: this.page,
          pageSize: this.pageSize,
          keyword: 2,
        },
        success: (res) => {
          if (res.data.code != 0) {
            // 如果沒查到數據就顯示nodata圖片
            this.showNoDataImg = true;
            // 隱藏list
            this.showTable = false;
            return;
          }

          if (res.data.code == 0) {
            // 隱藏nodata圖片
            this.showNoDataImg = false;
            // 顯示list
            this.showTable = true;
            // loading(加載中)
            uni.showLoading({
              title: this.$t("Aleo.InvestmentRecord.loading"),
            });
            res.data.data.data.forEach((data) => {
              data.trade_time = this.dateChangeFormat("YYYY-mm-dd HH:MM:SS", data.trade_time);
            });
            this.recordData = res.data.data.data;
            // 获取总共有多少条数据
            this.totalLength = res.data.data.total;
            // 如果总数小于分页的size,说明小于一页
            if (this.totalLength <= this.pageSize) {
              this.isShowLoadMore = false;
            }
            if (this.totalLength > this.pageSize) {
              this.isShowLoadMore = true;
            }
            uni.hideLoading();
          }
        },
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
    // 追加投资按钮点击事件
    onAddInvestmentBtnClick() {
      // 如果未绑定上级邀请码,打开提示弹窗
      if (!this.isBindLeader) {
        this.$refs.alertDialog.open();
        return;
      }
      // 如果已绑定过上级邀请码,直接跳转到投資
      uni.navigateTo({
        url: "/pages/news/AddAleoFinancial?from=record",
      });
    },
    // 单条投资记录被点击,跳转到投资详情事件
    onListItemClick(info) {
      uni.navigateTo({
        url: "/pages/income/AleoIncome/InvestmentDetails?info=" + JSON.stringify(info),
      });
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
    this.pageSize = 14;
    let _this = this;
    this.status = "loading";
    //在当前页面显示导航条加载动画。
    // uni.showNavigationBarLoading()
    setTimeout(function () {
      if (_this.recordData.length < _this.totalLength) {
        // 计算最多多少页
        const maxPage = Math.floor(_this.totalLength / _this.pageSize) + 1;

        if (_this.page < maxPage) {
          _this.page++;
        }
        // 获取接口 用户的投資記錄
        uni.request({
          url: _this.host + "/app/queryinvestment",
          method: "GET",
          data: {
            keyword: 2,
            page: _this.page,
            pageSize: _this.pageSize,
          },
          header: {
            //token
            "x-token": _this.userToken,
            //version
            version: this.version,
          },
          success: (res) => {
            // code!=0就是接口请求结果失败
            if (res.data.code != 0) {
              return;
            }

            res.data.data.data.forEach((data) => {
              data.trade_time = _this.dateChangeFormat("YYYY-mm-dd HH:MM:SS", data.trade_time);
            });

            let sliceArr = [];
            // 把onload里读取到的pageSize条投资信息都存入sliceArr
            sliceArr = res.data.data.data;

            sliceArr.forEach((obj) => {
              _this.recordData.push(obj);
            });
          },
        });
        _this.status = "more";
      }

      if (_this.recordData.length >= _this.totalLength) {
        _this.status = "noMore";
        // 用戶已經觸發過一次"沒有更多數據"狀態
        _this.isNoMoreData = true;
        _this.loadDivColor = "#9EA3BB";
        let height = null;
        let screenHeight = uni.getSystemInfoSync().screenHeight;
        uni
          .createSelectorQuery()
          .in(_this)
          .select(".top")
          .boundingClientRect((data) => {
            // 这里+4是测出来的,但是为什么???
            height = data.height - (screenHeight + 4);
            // uni.pageScrollTo({
            //   scrollTop: height,
            //   duration: 200,
            // });
          })
          .exec();
      }
      //在当前页面隐藏导航条加载动画。
      // uni.hideNavigationBarLoading()
    }, 2000);
  },
};
</script>

<style lang="less" scoped>
@import "@/static/css/MainColor.less";
.scroll-Y {
  // 滚动区域高度=100vh-追加投资按钮高度
  height: calc(100vh - 180rpx);
}

.list {
  padding-bottom: 200rpx;
}

// 追加投资按钮
.addBtn {
  background-color: #ffffff;
  z-index: 999;
  width: 750rpx;
  height: 180rpx;
  position: fixed;
  bottom: 0rpx;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  button {
    width: 640rpx;
    height: 90rpx;
    border-radius: 100rpx;
    // background: #009bf9;
    background: @main-color;
    display: flex;
    justify-content: center;
    align-items: center;
    text {
      color: #ffffff;
    }
  }
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
</style>
