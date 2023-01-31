<template>
  <view class="content">
    <view class="msg">
      <text v-for="(template, index) in privateMsg.Temp">
        <text class="template">{{ template }}</text>
        <text class="content" v-if="index != privateMsg.Content.length">{{ privateMsg.Content[index] }}</text>
      </text>
      <text class="more" @click="onMoreInfoClick">{{ $t("Home.Message.more") }}&nbsp;&gt;&gt;</text>
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
      // 信息和套话(假数据)
      fakeMsg: {
        Content: ["100Aleo", "TZ186i12e8611"],
        Temp: "尊敬的用户您好，已经成功提交#阿莱欧投资份额，流水号为#，请等待系统后台审核。",
      },
      // 装从接口获取到的信息和套话(假数据)
      privateMsg: {},
      //获取当前软件内设置的语言
      applicationLocale: "",
      // 从onload的option里获取的msgId
      msgId: 27,
      // 从onload的option里获取的customerId
      customerId: 27,
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
    //获取当前软件内设置的语言
    this.applicationLocale = uni.getLocale();
    // 获取上一个页面传来的msgId
    this.msgId = options.msgId;
    // 获取接口 消息内容详细信息
    this.getDetailMsgList();
  },
  methods: {
    // 获取接口 消息内容详细信息
    getDetailMsgList() {
      uni.request({
        url: this.host + "/app/getContentTemps/detail",
        method: "GET",
        header: {
          //token
          "x-token": this.userToken,
          //version
          version: this.version,
        },
        data: {
          id: this.msgId,
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
          console.log(res.data);
          this.privateMsg = res.data.data;
          // 模板字符串为数组,分为0简1英2繁
          // 简中
          if (this.applicationLocale == "zh-Hans") {
            // 按#号分割模板字符串
            let templateArr = this.privateMsg.Temp[0].split("#");
            this.privateMsg.Temp = templateArr;
          }
          // english
          if (this.applicationLocale == "en") {
            // 按#号分割模板字符串
            let templateArr = this.privateMsg.Temp[1].split("#");
            this.privateMsg.Temp = templateArr;
          }
          // 繁中
          if (this.applicationLocale == "zh-Hant") {
            // 按#号分割模板字符串
            let templateArr = this.privateMsg.Temp[2].split("#");
            this.privateMsg.Temp = templateArr;
          }

          // 获取接口里传来的customerId(这个参数需要带到"立即查看"里面,下一个页面接口需要用到)
          // customerId是Content数组的最后一个元素
          // 8.18下午又改了,不调到拓展客户详情页面了,跳到邀请记录页面..
          // this.customerId = this.privateMsg.Content[this.privateMsg.Content.length-1];
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
    // 立即查看被点击
    onMoreInfoClick() {
      uni.navigateTo({
        // url: "../income/AleoIncome/expandingCustomerDetail?customerId=" + this.customerId,
        url: "../income/AleoIncome/inviteCustomersRecord",
        success: (res) => {},
        fail: (res) => {},
      });
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  .msg {
    margin: 24rpx 32rpx;
    text-indent: 2rem;
    word-break: break-all;
    // 模板
    .template {
      color: #2e2e2e;
    }
    // 变量
    .content {
      color: #eb9b19;
    }
    // 查看更多
    .more {
      color: #009bf0;
    }
  }
}
</style>
