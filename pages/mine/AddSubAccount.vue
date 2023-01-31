<template>
  <view class="content">
    <view class="input-add">
      <view class="input-name">
        <uni-easyinput :inputBorder="false" v-model="subaccountname" placeholder="输入子账户名称"></uni-easyinput>
      </view>
      <view class="title-pro">
        <span>请选择投资产品:</span>
      </view>
      <view class="select-pro">
        <uni-data-select v-model="ID" :localdata="range" @change="Change" :clear="false"></uni-data-select>
      </view>

      <button class="btn-add" @click="add">
        确认添加
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
      token: "",
      subaccountname: "",
      ID: "",
      range: [
        // { value: 0, text: "篮球" },
      ],
      token: "",
      list: "",
      num: "",
      // 记录触发了几次需要更新APP
      appUpdate: 0,
    };
  },

  onShow() {
    this.token = uni.getStorageSync("token");
  },
  onReady() {
    uni.request({
      header: {
        "Content-Type": "application/json",
        "x-token": this.token,
        //version
        version: this.version,
      },
      url: this.host + "/app/product/List",
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

        this.list = res.data.data;

        for (const key in this.list) {
          // 删除id属性
          delete this.list[key].CreatedAt;
          delete this.list[key].UpdatedAt;
          delete this.list[key].productCode;
          delete this.list[key].description;
          delete this.list[key].currencyCategory;
        }
        this.range = this.list;
      },
    });
  },

  methods: {
    Change(e) {
      this.num = e;
    },
    add() {
      if (this.subaccountname == "") {
        uni.showToast({
          title: "名称不能为空",
          icon: "none",
        });
        return;
      }
      if (this.ID == "") {
        uni.showToast({
          title: "请选择投资产品",
          icon: "none",
        });
        return;
      }

      uni.request({
        header: {
          "Content-Type": "application/json",
          "x-token": this.token,
          //version
          version: this.version,
        },
        url: this.host + "/app/user/account/sub/add",
        method: "POST",
        data: {
          SubaccountName: this.subaccountname,
          ProductId: this.num,
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
          if (res.data.msg == "子账户名称重复") {
            uni.showToast({
              title: "子账户名称重复",
              icon: "none",
            });
            return;
          }
          uni.navigateTo({
            url: "/pages/mine/subAccount",
          });
        },
      });
    },
  },
};
</script>

<style lang="scss">
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
  background-color: #ffffff;
}
page {
  width: 750rpx;
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
.left,
.right {
  width: 68rpx;
  height: 48rpx;
  color: rgba(0, 155, 249, 1);
  font-size: 34rpx;
  font-family: PingFangSC-Medium;
  text-align: center;
  white-space: nowrap;
}
.content {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.popup-content {
  align-items: center;
  justify-content: center;
  padding: 30upx;
  height: 40upx;
  background-color: #fff;
}
.text {
  font-size: 24upx;
  color: #333;
}
.input-add {
  width: 500rpx;
  height: 700rpx;
  position: absolute;
  top: 300rpx;
}
.input-name {
  // width: 100%;
  height: 100rpx;
  background-color: rgba(245, 249, 250, 1);
  border-radius: 100rpx;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20rpx;
}
.title-pro {
  margin: 40rpx 0 30rpx 0;
}
.select-pro {
  width: 100%;
  height: 100rpx;
  // margin-top: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(245, 249, 250, 1);
  border-radius: 100rpx;
}
.btn-add {
  width: 100%;
  height: 100rpx;
  border-radius: 100rpx;
  background-color: rgba(0, 155, 249, 1);
  position: absolute;
  bottom: 0;
  color: #ffffff;
  line-height: 100rpx;
}
</style>
