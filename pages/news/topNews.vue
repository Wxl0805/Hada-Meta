<template>
  <view>
    <view class="doc" v-html="doc"></view>
    <!-- 文章底下固定用来占位置的div -->
    <view class="placeholder"></view>
  </view>
</template>

<script>
// #ifdef APP-PLUS
import APPUpdate from "@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate";
// #endif
export default {
  name: "newsContent",
  data() {
    return {
      // 记录触发了几次需要更新APP
      appUpdate: 0,
      userToken: "",
      // 用来装首页传来的新闻idx
      newsId: null,
      // 用来装接口里获取到的文章信息
      document: [],
      doc: "",
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
    // 获取新闻id
    this.newsId = options.newsId;
    // 获取接口 文章列表信息
    this.getDocList();
  },
  methods: {
    // 获取接口 文章列表信息
    getDocList() {
      uni.request({
        url: this.host + "/app/announcements/getDocDetails",
        method: "GET",
        header: {
          //token
          "x-token": this.userToken,
          //version
          version: this.version,
        },
        data: {
          docId: this.newsId,
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
            this.doc = res.data.data.Content;
          }
        },
        fail: (res) => {},
      });
    },
  },
};
</script>

<style lang="less" scoped>
.placeholder {
  width: 750rpx;
  height: 80rpx;
  // background-color: aqua;
}
.doc {
  padding: 0rpx 40rpx;
}
</style>
