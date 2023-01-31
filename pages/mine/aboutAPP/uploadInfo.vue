<template>
  <view class="content">
    <!-- 顶部灰色横线 -->
    <view class="nav-line"></view>
    <view v-for="(data, index) in uploadInfoList" :key="data + index">
      <view class="box-210 box">
        <view class="text-wrapper_2">
          <text class="text_4">V{{ data.VersionName }}</text>
          <text class="text_5">{{ data.date }}</text>
        </view>
        <view class="text">
          <text class="paragraph_1">
            {{ data.text }}
          </text>
        </view>
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
        userToken: "",
        isFan: true,
        uploadInfoList: [],
        // 记录触发了几次需要更新APP
        appUpdate: 0,
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
          this.isFan = true;
          return;
        } else {
          this.isFan = false;
          return;
        }
      }
    },
    onShow() {
      this.getUploadInfo();
    },
    methods: {
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
              console.log(res.data);
              this.uploadInfoList = res.data.data.list;
              this.uploadInfoList.forEach((data) => {
                if (this.isFan) {
                  data.text = data.Notes2;
                } else {
                  data.text = data.Notes1;
                }
                data.date = data.CreatedAt.slice(0, 10);
              });
            }
          },
        });
      },
    },
  };
</script>

<style lang="less" scoped>
  // 顶部导航栏分割线
  .nav-line {
    width: 100%;
    height: 4rpx;
    background-color: #f2f2f2;
  }
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .box {
    width: 700rpx;
    margin-bottom: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    // align-items: center;
  }
  .text-wrapper_2 {
    // width: 663rpx;
    // height: 45rpx;
    margin: 42rpx 32rpx 0rpx;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .text_4 {
      width: 90rpx;
      height: 45rpx;
      color: rgba(46, 51, 78, 1);
      font-size: 32rpx;
      font-family: PingFangSC-Medium;
      text-align: center;
      white-space: nowrap;
      line-height: 45rpx;
    }
    .text_5 {
      width: 155rpx;
      height: 37rpx;
      color: rgba(136, 141, 167, 1);
      font-size: 26rpx;
      font-family: PingFangSC-Medium;
      text-align: right;
      white-space: nowrap;
      line-height: 37rpx;
      margin-top: 6rpx;
    }
  }

  .text {
    margin: 42rpx 32rpx 0rpx;
    .paragraph_1 {
      // width: 303rpx;
      // height: 198rpx;
      color: rgba(136, 141, 167, 1);
      font-size: 24rpx;
      text-align: left;
      // line-height: 22rpx;
      // margin: 32rpx 0 0 42rpx;
    }
  }
</style>
