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
        <text>{{ $t("common.exchange-way") }}</text>
      </view>
      <view class="block-right">
        <text>{{ way }}</text>
      </view>
    </view>
    <view class="block" v-if="showPerson">
      <view class="block-left">
        <text>{{ $t("common.exchange-person") }}</text>
      </view>
      <view class="block-right">
        <text>{{ person }}</text>
      </view>
    </view>
    <view class="block">
      <view class="block-left">
        <text>U</text>
      </view>
      <view class="block-right">
        <text>{{ Uamount }}</text>
      </view>
    </view>
    <view class="block">
      <view class="block-left">
        <text>G</text>
      </view>
      <view class="block-right">
        <text>{{ Gamount }}</text>
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
      orderNumber: "",
      time: "",
      type: this.$t("common.out-exchange"),
      way: "",
      person: "",
      Uamount: "",
      Gamount: "",
      showPerson: false,
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
        url: this.host + "/app/rechargeOrExchangesDetail/" + orderNumber + "/1",
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
          this.time = this.dateChangeFormat("YYYY.mm.dd HH:MM:SS", obj.tradeTime);
          this.Gamount = obj.changeAmount;
          this.Uamount = obj.amountU;
          this.way = obj.exchangeType == 0 ? this.$t("common.exchange-mine") : this.$t("common.exchange-other");
          if (obj.exchangeType == "1") {
            this.showPerson = true;
            this.person = obj.nickName + "(" + obj.uid + ")";
          }
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
  border-top: 1px solid #f3f5f7;
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
  height: 350rpx;
  background: #ffffff;
  border-top: 1px solid #f3f5f7;
  padding: 30rpx 40rpx;
  box-sizing: border-box;
}
.ProofPurchase-title {
  width: 100%;
  height: 50rpx;
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
}
.img-2 {
  width: 200rpx;
  height: 100%;
  margin-right: 20rpx;
}
.img-3 {
  width: 200rpx;
  height: 100%;
}
.error {
  width: 100%;
  height: 200rpx;
  border-top: 1px solid #f3f5f7;
  background-color: #ffffff;
  padding: 30rpx 40rpx;
  box-sizing: border-box;
}
.error-title {
  margin-bottom: 30rpx;
  color: #9ea3bb;
}
.successcolor {
  color: black;
}
.errorcolor {
  color: rgba(249, 0, 0, 1);
}
.detailcolor {
  color: rgba(255, 151, 20, 1);
}
</style>
