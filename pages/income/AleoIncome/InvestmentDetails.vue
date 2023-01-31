<template>
  <view class="content">
    <view class="block">
      <view class="block-left">
        <text>{{ $t("common.in-danhao") }}</text>
      </view>
      <view class="block-right">
        <text>{{ orderNumber }}</text>
      </view>
    </view>
    <view class="block">
      <view class="block-left">
        <text>{{ $t("common.in-status") }}</text>
      </view>
      <view class="block-right" :class="{ errorcolor: error, successcolor: success, detailcolor: detail }">
        <text>{{ status }}</text>
      </view>
    </view>
    <view class="block">
      <view class="block-left">
        <text>{{ $t("common.in-time") }}</text>
      </view>
      <view class="block-right">
        <text>{{ time }}</text>
      </view>
    </view>
    <view class="block">
      <view class="block-left">
        <text>{{ $t("common.in-type") }}</text>
      </view>
      <view class="block-right">
        <text>{{ type }}</text>
      </view>
    </view>
    <view class="block">
      <view class="block-left">
        <text>{{ $t("common.in-num") }}</text>
      </view>
      <view class="block-right">
        <text>{{ amount }}U</text>
      </view>
    </view>
    <view class="ProofPurchase">
      <view class="ProofPurchase-title">
        <text>{{ $t("common.in-img") }}</text>
      </view>
      <view class="ProofPurchase-imgs">
        <view class="img-1"><image :src="img1"></image></view>
        <view class="img-2"><image :src="img2"></image></view>
        <view class="img-3"><image :src="img3"></image></view>
      </view>
    </view>
    <view class="error" v-if="showerror">
      <view class="error-title">
        <text>{{ $t("common.in-reason") }}</text>
      </view>
      <view class="error-content">
        <text>{{ reason }}</text>
      </view>
    </view>
  </view>
</template>

<script>
// import img from '@/static/images/userdata/lunkuo.png'
// #ifdef APP-PLUS
import APPUpdate from "@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate";
// #endif
export default {
  data() {
    return {
      // 记录触发了几次需要更新APP
      appUpdate: 0,
      userToken: "",
      singleNumber: "",
      status: "",
      time: "",
      amount: "",
      orderNumber: "",
      img1: "",
      img2: "",
      img3: "",
      reason: "",
      error: false,
      success: false,
      detail: false,
      showerror: false,
      type: this.$t("common.in-liutong"),
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
    if (options.order_number) {
      console.log(options);
      this.orderNumber = options.order_number;
      // 调用接口读取详情
      this.getInvestmentDetails(this.orderNumber);
    }
  },
  methods: {
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
    // 获取接口  单个订单流水号对应的投资详情
    getInvestmentDetails(orderNumber) {
      uni.request({
        // url:this.host+'/app/getInvestDetails',
        url: this.host + "/app/rechargeOrExchangesDetail/" + orderNumber + "/0",
        header: {
          "x-token": this.userToken,
          //version
          version: this.version,
        },
        data: {},
        success: (res) => {
          console.log("res", res.data);
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
          let obj = res.data.data;
          this.time = this.dateChangeFormat("YYYY.mm.dd HH:MM:SS", obj.trade_time);
          this.amount = obj.change_amount;
          this.reason = obj.fail_reason;
          if (obj.status == 2) {
            this.status = this.$t("common.errored");
            this.error = true;
            this.showerror = true;
          }
          if (obj.status == 1) {
            this.status = this.$t("common.successed");
            this.success = true;
          }
          if (obj.status == 0) {
            this.status = this.$t("common.detailing");
            this.detail = true;
          }
          this.img1 = obj.vouchers_pic1;
          this.img2 = obj.vouchers_pic2;
          this.img3 = obj.vouchers_pic3;
        },
        fail: (res) => {
          console.log("loading investment details fail !", res);
        },
      });
    },
  },
};
</script>

<style>
page {
  background-color: #f3f5f7;
}
.content {
  font-size: 30rpx;
}
.block {
  width: 100%;
  height: 100rpx;
  background-color: #ffffff;
  border-top: 1rpx solid #f3f5f7;
  padding: 0 40rpx;
  box-sizing: border-box;
  display: flex;
}
.block-left {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #9ea3bb;
}
.block-right {
  flex: 2;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: #2E334E;
}
.ProofPurchase {
  width: 100%;
  height: 370rpx;
  background: #ffffff;
  border-top: 1rpx solid #f3f5f7;
  padding: 30rpx 40rpx;
  box-sizing: border-box;
}
.ProofPurchase-title {
  width: 100%;
  height: 70rpx;
  color: #9ea3bb;
}
.ProofPurchase-imgs {
  width: 100%;
  height: 220rpx;
  display: flex;
}
.ProofPurchase-imgs image {
  width: 100%;
  height: 100%;
}
.img-1 {
  width: 200rpx;
  height: 100%;
  margin-right: 20rpx;
  border-radius: 10px;
  overflow: hidden;
}
.img-2 {
  width: 200rpx;
  height: 100%;
  margin-right: 20rpx;
  border-radius: 10px;
  overflow: hidden;
}
.img-3 {
  width: 200rpx;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
}
.error {
  width: 100%;
  /* height: 200rpx; */
  border-top: 1rpx solid #f3f5f7;
  background-color: #ffffff;
  padding: 30rpx 40rpx;
  box-sizing: border-box;
  word-wrap: break-word;
  word-break: break-all;
}
.error-title {
  margin-bottom: 30rpx;
  color: #9ea3bb;
}
.successcolor {
  color: rgba(5, 201, 133, 1);
}
.errorcolor {
  color: rgba(249, 0, 0, 1);
}
.detailcolor {
  color: rgba(255, 151, 20, 1);
}
</style>
