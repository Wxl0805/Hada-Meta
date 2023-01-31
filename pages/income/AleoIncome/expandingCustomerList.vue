<template>
  <view>
    <!-- 顶部搜索框 -->
    <view class="header-input">
      <view class="search-input">
        <uni-easyinput prefixIcon="search" :inputBorder="false" v-model="username" :placeholder="$t('Aleo.ExpandingCustomerList.top-search')"></uni-easyinput>
        <view class="search-btn" @click="getSearchinfo">
          <text>{{ $t("Aleo.ExpandingCustomerList.search") }}</text>
        </view>
      </view>
    </view>

    <!-- nodata img -->
    <view class="nodata" v-if="showNoDataImg">
      <image src="@/static/images/income/Aleo/exchange/nodata.png"></image>
      <text>{{ $t("Aleo.ExpandingCustomerList.noInfo") }}</text>
    </view>

    <!-- 当输入框有值时 -->
    <view v-if="showTableSearch" class="table-block">
      <view v-for="(cInfo, index) in clientDataSearch" :key="index" class="clientListDiv" @click="detail(cInfo)">
        <clientListDiv :clientInfo="cInfo"></clientListDiv>
      </view>
      <!-- 加载更多组件 -->
      <view v-if="isShowLoadMoreSearch == true">
        <uni-load-more iconType="circle" :status="statusSearch" :color="loadDivColorSearch" />
      </view>
    </view>
    <!-- nodata img -->
    <view class="nodata" v-if="showNoDataImgSearch">
      <image src="@/static/images/income/Aleo/exchange/errorDataImg.png"></image>
      <text>{{ $t("Aleo.ExpandingCustomerList.errordata") }}</text>
    </view>
  </view>
</template>

<script>
import clientListDiv from "@/components/Aleo/income/ClientListDiv.vue";
// #ifdef APP-PLUS
import APPUpdate from "@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate";
// #endif
export default {
  components: {
    clientListDiv,
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
  },
  data() {
    return {
      // 记录触发了几次需要更新APP
      appUpdate: 0,
      userToken: "",
      // 搜索框值
      username: "",
      // 是否顯示nodata圖片
      showNoDataImg: true,

      // search触发的属性
      // 底部上拉加载状态栏状态
      statusSearch: "more",
      // 当前page
      pageSearch: 1,
      // 当前每页的size
      pageSizeSearch: 10,
      // 标识用户有没有进行过上拉加载操作
      pullFlagSearch: false,
      // 上拉加载组件是否显示
      isShowLoadMoreSearch: false,
      // 总共有多少条投资数据
      totalLengthSearch: null,
      // 是否顯示nodata圖片
      showNoDataImgSearch: false,
      // 是否顯示table和btn
      showTableSearch: false,
      // 裝接口獲取的客戶信息
      clientDataSearch: [],
      // 標識用戶有沒有觸發過"沒有更多數據"狀態
      isNoMoreDataSearch: false,
      // 加載組件的顔色
      loadDivColorSearch: "#007AFF",
    };
  },
  watch: {
    username(val) {
      if (val != "") {
        // 隐藏"搜索后xxx"
        this.showNoDataImg = false;
        this.pageSearch = 1;
        // 调精确查询接口
        this.getSearchinfo();
      } else {
        // 显示"搜索后xxx"
        this.showNoDataImg = true;
        // 隐藏"未找到xxx"
        this.showNoDataImgSearch = false;
      }
    },
  },
  methods: {
    // 跳转到兑换页面，并携带参数
    detail(info) {
      let pages = getCurrentPages(); // 获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。
      let nowPage = pages[pages.length - 1]; //当前页页面实例
      let prevPage = pages[pages.length - 2]; //上一页页面实例
      let object = info;
      prevPage.$vm.otherFun(object); // 給上一頁綁定方法otherFun,傳參object
      uni.navigateBack({
        delta: 1,
      });
    },
    // 模糊查询接口
    getSearchinfo() {
      // 如果输入没内容,不继续执行
      if (this.username == "") {
        console.log("输入为空");
        return;
      }
      uni.showLoading({
        mask: true,
        title: this.$t("common.wait"),
      });
      uni.request({
        url: this.host + "/app/getExchangeMemberList",
        method: "POST",
        header: {
          //token
          "x-token": this.userToken,
          //version
          version: this.version,
        },
        data: {
          page: this.pageSearch,
          pageSize: this.pageSizeSearch,
          values: this.username,
        },
        success: (res) => {
          console.log(res.data);
          if (res.data.code != 0 || res.data.msg == "搜索不到数据，请输入正确的信息再进行搜索") {
            // 如果沒查到數據就顯示nodata圖片
            this.showNoDataImgSearch = true;
            // 隱藏list
            this.showTableSearch = false;

            return;
          }

          if (res.data.code == 0) {
            // 隱藏nodata圖片
            this.showNoDataImgSearch = false;
            // 顯示list
            this.showTableSearch = true;

            this.clientDataSearch = res.data.data.list;
            // 获取总共有多少条数据
            this.totalLengthSearch = res.data.data.total;
            // 如果总数小于分页的size,说明小于一页
            if (this.totalLengthSearch <= this.pageSizeSearch) {
              this.isShowLoadMoreSearch = false;
            }
            if (this.totalLengthSearch > this.pageSizeSearch) {
              this.isShowLoadMoreSearch = true;
            }
          }
        },
        complete: () => {
          uni.hideLoading();
        },
      });
    },
  },
  // 上拉加载
  onReachBottom() {
    // 如果使用搜索框
    if (this.showTableSearch) {
      // 如果觸發過"沒有更多數據"狀態,不繼續執行
      if (this.isNoMoreDataSearch) {
        return;
      }
      // 用户触发了上拉加载操作
      this.pullFlagSearch = true;
      // 初始化pageSize
      this.pageSizeSearch = 10;
      let _this = this;
      this.statusSearch = "loading";
      //在当前页面显示导航条加载动画。
      // uni.showNavigationBarLoading()
      setTimeout(function () {
        if (_this.clientDataSearch.length < _this.totalLengthSearch) {
          // 计算最多多少页
          const maxPage = Math.floor(_this.totalLengthSearch / _this.pageSizeSearch) + 1;

          if (_this.pageSearch < maxPage) {
            _this.pageSearch++;
          }
          // 获取接口 用户的投資記錄
          uni.request({
            url: _this.host + "/app/getExchangeMemberList",
            method: "POST",
            data: {
              page: _this.pageSearch,
              pageSize: _this.pageSizeSearch,
              values: _this.username,
            },
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
              sliceArr = res.data.data.list;

              sliceArr.forEach((obj) => {
                _this.clientDataSearch.push(obj);
              });
            },
          });
          _this.statusSearch = "more";
        }

        if (_this.clientDataSearch.length >= _this.totalLengthSearch) {
          _this.statusSearch = "noMore";
          // 用戶已經觸發過一次"沒有更多數據"狀態
          _this.isNoMoreDataSearch = true;
          _this.loadDivColorSearch = "#9EA3BB";
        }
      }, 2000);
      return;
    }
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
@import url("@/static/css/MainColor.less");
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
.header-input {
  width: 100%;
  height: 132rpx;
  background-color: #ffffff;
  position: fixed;
  top: 0;
  box-sizing: border-box;
  z-index: 1;
}
.table-block {
  margin-top: 132rpx;
  overflow-y: scroll;
}
.search-input {
  position: absolute;
  width: 90%;
  height: 92rpx;
  left: 5%;
  margin-top: 20rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  // 搜索btn
  .search-btn {
    margin-left: 20rpx;
    text {
      font-size: 30rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      // color: #009BF9;
      color: @main-color;
      line-height: 42rpx;
    }
  }
}
/deep/ .uni-easyinput__content {
  border-radius: 20rpx;
  background-color: #f1f1f2 !important;
  .uni-easyinput__content-input {
    display: flex;
    flex-direction: row;
    position: relative;
    overflow: visible;

    .uni-easyinput__placeholder-class {
      font-size: 26rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #c7cad6;
    }
  }
  .uni-easyinput__content-input::before {
    content: "";
    display: block;
    background-image: url(@/static/images/income/search.png);
    background-size: cover;
    width: 32rpx;
    height: 32rpx;
    position: absolute;
    transform: translate(-138%, 58%);
  }
}
/deep/ .content-clear-icon {
  visibility: hidden;
  background-color: #f1f1f2 !important;
}
</style>
