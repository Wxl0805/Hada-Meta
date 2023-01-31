<template>
  <view class="top">
    <!-- 收益详情表格 -->
    <view class="uni-container" v-if="showTable">
      <view v-for="(item, index) in inspiredInfo" :key="index">
        <points-list-div :info="item"></points-list-div>
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
import PointsListDiv from "@/components/Aleo/income/PointsListDiv.vue";
// #ifdef APP-PLUS
import APPUpdate from "@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate";
// #endif
export default {
  components: {
    PointsListDiv,
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
    // 获取接口 用户拥有的激勵積分記錄
    this.getUserInspiredPointsRecord();
  },
  data() {
    return {
      // 记录触发了几次需要更新APP
      appUpdate: 0,
      userToken: "",
      // 底部上拉加载状态栏状态
      status: "more",
      // 当前page
      page: 1,
      // 当前每页的size
      pageSize: 24,
      // 标识用户有没有进行过上拉加载操作
      pullFlag: false,
      // 总共有多少条投资数据
      totalLength: null,
      // 上拉加载组件是否显示
      isShowLoadMore: false,
      // 是否顯示nodata圖片
      showNoDataImg: false,
      // 是否顯示table
      showTable: true,
      // 存接口獲取到的激勵積分信息
      inspiredInfo: [],
      // 標識用戶有沒有觸發過"沒有更多數據"狀態
      isNoMoreData: false,
      // 加載組件的顔色
      loadDivColor: "#007AFF",
    };
  },
  methods: {
    // 获取接口 用户拥有的激勵積分記錄
    getUserInspiredPointsRecord() {
      uni.request({
        url: this.host + "/app/incentiverecord",
        // url: "http://192.168.3.33:8887/app/incentiverecord",
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
            // 隱藏nodata圖片
            this.showNoDataImg = false;
            // 顯示list
            this.showTable = true;
            // loading(加載中)

            res.data.data.data.forEach((data) => {
              data.time = this.dateChangeFormat("YYYY-mm-dd", data.time);
              data.points = parseFloat(data.points).toFixed(2);
            });
            this.inspiredInfo = res.data.data.data;
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
    // // 点击跳转 Aleo收益-收益详情页面
    // onAleoIncomeDetailClick() {
    //   uni.navigateTo({
    //     url: "../equipment/bindEquipment",
    //     success(res) {
    //     },
    //     fail(res) {
    //     },
    //   });
    // },
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
    this.pageSize = 24;
    let _this = this;
    this.status = "loading";
    setTimeout(function () {
      if (_this.inspiredInfo.length < _this.totalLength) {
        // 计算最多多少页
        const maxPage = Math.floor(_this.totalLength / _this.pageSize) + 1;

        if (_this.page < maxPage) {
          _this.page++;
        }
        // 获取接口 用户的投資記錄
        uni.request({
          url: _this.host + "/app/incentiverecord",
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

            res.data.data.data.forEach((data) => {
              data.time = _this.dateChangeFormat("YYYY-mm-dd", data.time);
              data.points = parseFloat(data.points).toFixed(2);
            });

            let sliceArr = [];
            // 把onload里读取到的pageSize条投资信息都存入sliceArr
            sliceArr = res.data.data.data;

            sliceArr.forEach((obj) => {
              _this.inspiredInfo.push(obj);
            });
          },
        });
        _this.status = "more";
      }

      if (_this.inspiredInfo.length >= _this.totalLength) {
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
            // 回弹效果
            // uni.pageScrollTo({
            //   scrollTop: height,
            //   duration: 200,
            // });
          })
          .exec();
      }
    }, 2000);
  },
};
</script>

<style lang="less" scoped>
// 表格
.uni-container {
  // margin-top: 30rpx;
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
      // padding-top: 44rpx;
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
