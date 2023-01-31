<template>
  <view class="content">
    <view class="box_2 flex-col">
      <!-- <view class="box_3 flex-col"></view> -->
      <view class="box_4 flex-row justify-between">
        <view class="single-avatar_1 flex-col" v-if="showimg">
          <view class="icon_2 flex-col" v-if="isleader"></view>
        </view>
        <view class="IMG flex-col" v-if="!showimg">
          <image :src="imgShow"></image>
          <view class="icon_2 flex-col" v-if="isleader"></view>
        </view>

        <text class="text_4">{{ username }}({{ uid }})</text>
      </view>
      <view class="box_5 flex-row justify-between">
        <view class="text-group_1 flex-col justify-between">
          <text class="text_5">{{ $t("Aleo.ExpandingCustomerDetails.totalGu") }}</text>
          <text class="text_6">{{ $t("Aleo.ExpandingCustomerDetails.development-Gu") }}</text>
          <text class="text_7">{{ $t("Aleo.ExpandingCustomerDetails.development-Aleo") }}</text>
        </view>
        <view class="text-group_2 flex-col justify-between">
          <text class="text_8">{{ total * 1000 }}{{ $t("Aleo.ExpandingCustomerDetails.HM") }}({{ total }}{{ $t("Aleo.ExpandingCustomerDetails.gu") }})</text>
          <text class="text_9">{{ development * 1000 }}{{ $t("Aleo.ExpandingCustomerDetails.HM") }}({{ development }}{{ $t("Aleo.ExpandingCustomerDetails.gu") }})</text>
          <text class="text_10">{{ developstimulate }}Aleo</text>
        </view>
      </view>
    </view>

    <view class="hengtiao"></view>

    <view class="record">
      <text>{{ $t("Aleo.ExpandingCustomerDetails.inspired-pointsR-record") }}</text>
    </view>

    <view class="records">
      <view v-if="false">
        <!-- <view v-if="showTable"> -->
        <view class="records-block" v-for="(item, index) in inspiredInfo" :key="index">
          <text>{{ item.Date }}</text>
          <text>{{ item.Amount }}Aleo</text>
        </view>
      </view>

      <!-- 加载更多组件 -->
      <view v-if="false">
        <!-- <view v-if="isShowLoadMore"> -->
        <uni-load-more iconType="circle" :status="status" :color="loadDivColor" />
      </view>

      <!-- nodata img -->
      <view class="nodata" v-if="true">
        <!-- <view class="nodata" v-if="showNoDataImg"> -->
        <image src="@/static/images/nodata.png"></image>
        <text>{{ $t("Aleo.InvestmentRecord.nodata") }}</text>
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
      // 记录触发了几次需要更新APP
      appUpdate: 0,
      userToken: "",
      // 底部上拉加载状态栏状态
      status: "more",
      // 当前page
      page: 1,
      // 当前每页的size
      pageSize: 10,
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
      inspiredInfo: [
        {
          Date: "2022.08.06",
          Amount: 13333,
        },
        {
          Date: "2022.08.07",
          Amount: 13333,
        },
        {
          Date: "2022.08.08",
          Amount: 13333,
        },
        {
          Date: "2022.08.09",
          Amount: 13333,
        },
        {
          Date: "2022.08.10",
          Amount: 13333,
        },
        {
          Date: "2022.08.11",
          Amount: 13333,
        },
        {
          Date: "2022.08.12",
          Amount: 13333,
        },
        {
          Date: "2022.08.13",
          Amount: 13333,
        },
        {
          Date: "2022.08.14",
          Amount: 13333,
        },
        {
          Date: "2022.08.15",
          Amount: 13333,
        },
        {
          Date: "2022.08.16",
          Amount: 13333,
        },
        {
          Date: "2022.08.17",
          Amount: 13333,
        },
        {
          Date: "2022.08.18",
          Amount: 13333,
        },
      ],
      // 標識用戶有沒有觸發過"沒有更多數據"狀態
      isNoMoreData: false,
      // 加載組件的顔色
      loadDivColor: "#007AFF",
      username: "",
      uid: "",
      // 总股份
      total: "",
      // 发展股份
      development: "",
      // 发展股份激励
      developstimulate: "",
      // 头像路径
      imgShow: "",
      // 是否有头像(没有为true)
      showimg: true,
      isleader: false,
      customerid: "",
    };
  },
  // 获取头像
  onShow() {
    uni.showLoading({
      mask: true,
      title: this.$t("common.wait"),
    });
    uni.request({
      url: this.host + "/app/avatar/" + this.customerid,
      header: {
        "x-token": this.userToken,
        //version
        version: this.version,
      },
      method: "GET",
      // data: {},
      responseType: "ArrayBuffer",
      // dataType:'json',
      success: (res) => {
        if (res.statusCode == 200) {
          this.showimg = false;
          this.imgShow = "data:image/png;base64," + uni.arrayBufferToBase64(res.data);
          return;
        }
      },
      complete: () => {
        uni.hideLoading();
      },
    });
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
    if (options.info) {
      const obj = JSON.parse(options.info);
      this.username = obj.nickName;
      this.uid = obj.uuid.substring(obj.uuid.length - 6, obj.uuid.length);
      this.isleader = obj.is_leader == "1" ? true : false;
      this.customerid = obj.customerId;
      this.total = parseInt(obj.changeAmount) + parseInt(obj.invitationChangeAmount);
      this.development = obj.invitationChangeAmount;
      this.developstimulate = obj.points;
    }
    // // 如果有customerId,说明是从消息页面进来的
    // if (options.customerId) {
    //   this.customerid = options.customerId;
    //   this.getUserExpandingCustomerList();
    // }
  },
  onReady() {
    // 获取接口 用户拥有的激勵積分記錄
    this.getUserInspiredPointsRecord();
  },
  methods: {
    // 获取接口 用户拥有的激勵積分記錄
    getUserInspiredPointsRecord() {
      uni.request({
        url: this.host + "/app/getincomelog/excitation/" + this.uid + "/" + this.page + "/" + this.pageSize,
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
            // 隱藏nodata圖片
            this.showNoDataImg = false;
            // 顯示list
            this.showTable = true;
            // loading(加載中)

            res.data.data.list.forEach((data) => {
              data.Date = this.dateChangeFormat("YYYY.mm.dd", data.Date);
              data.Amount = parseFloat(data.Amount).toFixed(2);
            });
            this.inspiredInfo = res.data.data.list;
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
    // // 获取接口 用户拓展的客戶列表及相關信息
    // getUserExpandingCustomerList() {
    //   uni.request({
    //     url: this.host + "/app/investmentfollwer",
    //     // url: "http://192.168.3.33:8887/app/investmentfollwer",
    //     method: "GET",
    //     header: {
    //       //token
    //       "x-token": this.userToken,
    //     },
    //     data: {
    //       page: 1,
    //       pageSize: 1,
    //       keyword: 2,
    //       nickName: "",
    //       CustomerId: this.customerid,
    //     },
    //     success: (res) => {
    //       console.log(res);
    //       if (res.data.code != 0) {
    //         return;
    //       }

    //       if (res.data.code == 0) {
    //         console.log(res.data.data.data);
    //         // this.clientData = res.data.data.data;
    //       }
    //     },
    //   });
    // },
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
    console.log("觸底了");
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
      if (_this.inspiredInfo.length < _this.totalLength) {
        // 计算最多多少页
        const maxPage = Math.floor(_this.totalLength / _this.pageSize) + 1;

        if (_this.page < maxPage) {
          _this.page++;
        }
        // 获取接口 用户的投資記錄
        uni.request({
          url: this.host + "/app/getincomelog/excitation/" + _this.uid + "/" + _this.page + "/" + _this.pageSize,
          method: "GET",
          // data: {},
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

            res.data.data.list.forEach((data) => {
              data.Date = _this.dateChangeFormat("YYYY.mm.dd", data.Date);
              data.Amount = parseFloat(data.Amount).toFixed(2);
            });

            let sliceArr = [];
            // 把onload里读取到的pageSize条投资信息都存入sliceArr
            sliceArr = res.data.data.list;

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
@import "@/static/css/common.css";
.content {
  position: relative;
}
page {
  background-color: #ffffff;
}
// 頂部部分
.box_2 {
  z-index: 999;
  position: fixed;
  background-color: rgba(255, 255, 255, 1);
  width: 750rpx;
  height: 427rpx;
}

.box_3 {
  width: 750rpx;
  height: 1rpx;
  background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng2b2293f12db9be29433e9238123b011db7ce4bdd3f0a8ee17623e5dba17fbaa2) 0rpx -1rpx no-repeat;
  background-size: 750rpx 2rpx;
}

.box_4 {
  width: 402rpx;
  height: 100rpx;
  margin: 31rpx 0 0 26rpx;
}

.single-avatar_1 {
  height: 100rpx;
  background: url("@/static/images/income/Aleo/headerImg.png") -4rpx -4rpx no-repeat;
  background-size: 108rpx 108rpx;
  width: 100rpx;
}

.IMG {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  position: relative;
}
.IMG > image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: absolute;
}

.icon_2 {
  width: 28rpx;
  height: 28rpx;
  background: url("@/static/images/income/Aleo/leader.png") -2rpx -2rpx no-repeat;
  background-size: 32rpx 32rpx;
  margin: 70rpx 0 0 68rpx;
  border-radius: 50%;
  z-index: 1;
}

.text_4 {
  width: 278rpx;
  height: 48rpx;
  overflow-wrap: break-word;
  color: rgba(46, 51, 78, 1);
  font-size: 34rpx;
  font-family: PingFangSC-Medium;
  text-align: left;
  white-space: nowrap;
  line-height: 48rpx;
  margin-top: 26rpx;
}

.box_5 {
  background-color: rgba(243, 245, 247, 1);
  border-radius: 12px;
  width: 700rpx;
  height: 228rpx;
  margin: 30rpx 0 37rpx 26rpx;
}

.text-group_1 {
  width: 168rpx;
  height: 168rpx;
  margin: 30rpx 0 0 24rpx;
}

.text_5 {
  width: 84rpx;
  height: 40rpx;
  overflow-wrap: break-word;
  color: rgba(136, 141, 167, 1);
  font-size: 28rpx;
  font-family: PingFang-SC-Medium;
  text-align: left;
  white-space: nowrap;
  line-height: 40rpx;
}

.text_6 {
  width: 112rpx;
  height: 40rpx;
  overflow-wrap: break-word;
  color: rgba(136, 141, 167, 1);
  font-size: 28rpx;
  font-family: PingFang-SC-Medium;
  text-align: left;
  white-space: nowrap;
  line-height: 40rpx;
  margin-top: 24rpx;
}

.text_7 {
  width: 168rpx;
  height: 40rpx;
  overflow-wrap: break-word;
  color: rgba(136, 141, 167, 1);
  font-size: 28rpx;
  font-family: PingFang-SC-Medium;
  text-align: left;
  white-space: nowrap;
  line-height: 40rpx;
  margin-top: 24rpx;
}

.text-group_2 {
  width: 450rpx;
  height: 168rpx;
  margin: 30rpx 24rpx 0 0;
}

.text_8 {
  width: 400rpx;
  height: 40rpx;
  overflow-wrap: break-word;
  color: rgba(46, 51, 78, 1);
  font-size: 28rpx;
  font-family: PingFang-SC-Medium;
  text-align: right;
  white-space: nowrap;
  line-height: 40rpx;
  margin-left: auto;
}

.text_9 {
  width: 400rpx;
  height: 40rpx;
  overflow-wrap: break-word;
  color: rgba(46, 51, 78, 1);
  font-size: 28rpx;
  font-family: PingFang-SC-Medium;
  text-align: right;
  white-space: nowrap;
  line-height: 40rpx;
  margin: 24rpx 0 0 auto;
}

.text_10 {
  width: 250rpx;
  height: 40rpx;
  overflow-wrap: break-word;
  color: rgba(46, 51, 78, 1);
  font-size: 28rpx;
  font-family: PingFang-SC-Medium;
  text-align: right;
  white-space: nowrap;
  line-height: 40rpx;
  margin: 24rpx 0 0 auto;
}

// 占位塊
.hengtiao {
  z-index: 999;
  position: fixed;
  width: 100%;
  height: 24rpx;
  margin-top: 427rpx;
  background-color: rgba(243, 245, 247, 1);
}
// 激勵積分記錄 標題部分
.record {
  z-index: 999;
  margin-top: calc(427rpx + 24rpx);
  position: fixed;
  width: 100%;
  height: 100rpx;
  background-color: #ffffff;
  box-sizing: border-box;
  padding: 40rpx;
  display: flex;
  align-items: center;
  text {
    color: rgba(36, 39, 51, 1);
    font-size: 30rpx;
    font-family: PingFangSC-Medium;
  }
}
// 激勵積分記錄 表格部分
.records {
  width: 100%;
  margin-top: calc(427rpx + 24rpx + 100rpx);
  // height: calc(100vh - 551rpx);
  position: absolute;
  background-color: #ffffff;
}
.records-block {
  width: 100%;
  height: 100rpx;
  box-sizing: border-box;
  padding: 0 40rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(158, 163, 187, 1);
  font-size: 30rpx;
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
