<template>
  <view class="content">
    <view class="block">
      <view class="img">
        <image src="../../../static/images/login/aboutAPP/logo.png" mode=""></image>
      </view>
      <view class="imgText">
        <image :src="header" :style="isFan" mode=""></image>
      </view>
    </view>

    <view class="uniList">
      <uni-list :border="false" v-for="(message, index) in swipeList" :key="message.id" :showArrow="false">
        <uni-list-item ref="list" link :to="message.url">
          <template v-slot:body>
            <text class="list-item">{{ message.content }}</text>
          </template>
          <!-- 当前版本号-->
          <template v-slot:footer>
            <text class="list-item-footer" v-if="index == 0">V{{ uploadLatestVersion }}</text>
          </template>
        </uni-list-item>
      </uni-list>
    </view>

    <view class="footer">
      <text class="companyName">HADA META PTE. LTD.</text>
      <view>
        <text class="companyNameENG">Copyright © www.hada.com, All Rights Reserved.</text>
      </view>
    </view>
  </view>
</template>

<script>
  // #ifdef APP-PLUS
  import APPUpdate from "@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate";
  // #endif
  import jian from "../../../static/images/login/aboutAPP/titleText.png";
  import fan from "../../../static/images/login/aboutAPP/titleTextfan2.png";
  export default {
    data() {
      return {
        userToken: "",
        type: "center",
        msgType: "message",
        header: fan,
        isFan: "",
        swipeList: [
          {
            id: 0,
            content: this.$t("mine-aboutapp-gengxin"),
            url: "/pages/mine/aboutAPP/uploadInfo",
          },
          {
            id: 1,
            content: this.$t("mine-aboutapp-fuwu"),
            url: "/pages/mine/aboutAPP/serviceAgreement",
          },
          {
            id: 2,
            content: this.$t("mine-aboutapp-yinsi"),
            url: "/pages/index/HadaMetaPolicy",
          },
          {
            id: 3,
            content: this.$t("mine-aboutapp-shengming"),
            url: "/pages/index/HadaMetaStatement",
          },
        ],
        // 记录触发了几次需要更新APP
        appUpdate: 0,
        uploadLatestVersion: "",
      };
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
      if (uni.getStorageSync("lang")) {
        if (uni.getStorageSync("lang") == "zh-Hant") {
          this.header = fan;
          this.isFan = "width: 282rpx;height: 35rpx;";
          return;
        } else {
          this.header = jian;
          this.isFan = "";
          return;
        }
      }
      this.header = fan;
    },
    onShow() {
      this.getIsAllRead();
      this.getUploadInfo();
    },
    methods: {
      // 获取接口 消息是否全部已读-----(用于检查是否需要更新)
      getIsAllRead() {
        uni.request({
          url: this.host + "/app/announcements/judgeIsRead",
          method: "GET",
          header: {
            //token
            "x-token": this.userToken,
            //version
            version: this.version,
          },
          success: (res) => {
            if (res.data.code !== 0) {
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
            }
          },
        });
      },
      // 获取接口 获取更新信息列表
      getUploadInfo() {
        uni.request({
          // url: this.host + "/app/getAllVersionInfo",
          url: "http://192.168.3.179:9901/app/getAllVersionInfo",
          method: "GET",
          header: {
            //token
            "x-token": this.userToken,
            //version
            version: this.version,
          },
          data: {
            page: 1,
            pageSize: 999,
          },
          success: (res) => {
            if (res.data.code !== 0) {
              return;
            }
            if (res.data.code == 0) {
              console.log(res.data);
              this.uploadLatestVersion = res.data.data.list[0].VersionName;
            }
          },
        });
      },
    },
  };
</script>

<style>
  page {
    background-color: #f6f8fa;
  }
</style>

<style lang="less" scoped>
  .block {
    // width: 100%;
    height: 425rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .img {
      // width: 300rpx;
      // height: 140rpx;
      // margin-top: 20upx;
      // margin-left: 450upx;
      image {
        width: 286rpx;
        height: 134rpx;
      }
    }
    .imgText {
      // margin-top: 20upx;
      // margin-left: 450upx;
      image {
        width: 268rpx;
        height: 24rpx;
      }
    }
  }

  .uniList {
    .list-item {
      font-size: 30rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #2e334e;
      padding: 22rpx 0 22rpx 27rpx;
    }
    .list-item-footer {
      position: absolute;
      top: 22rpx;
      right: 0rpx;
      font-size: 30rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #2e334e;
      padding: 22rpx 0 22rpx 27rpx;
    }
  }

  .footer {
    position: absolute;
    left: 10rpx;
    right: 10rpx;
    bottom: 46rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .companyName {
      font-size: 28rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #2e334e;
    }

    .companyNameENG {
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #2e334e;
      white-space: nowrap;
    }
  }
</style>
