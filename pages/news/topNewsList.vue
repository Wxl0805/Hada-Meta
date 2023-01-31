<template>
  <view class="page-main">
    <!-- 顶部灰色横线 -->
    <view class="nav-line"></view>
    <!-- 新闻区域 -->
    <view class="test-component">
      <view class="test-component-view">
        <view @click="onNewsClick(news)" v-for="(news, index) in document" :key="index" class="scroll-box">
          <hm-news-card-list :options="news"></hm-news-card-list>
          <view class="list-line"></view>
        </view>
      </view>
      <!-- 加载更多组件 -->
      <view v-if="isShowLoadMore">
        <uni-load-more iconType="circle" :status="status" color="#007AFF" />
      </view>
    </view>
  </view>
</template>

<script>
import HmNewsCardList from "@/components/hm-news-card/indexList.vue";
// #ifdef APP-PLUS
import APPUpdate from "@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate";
// #endif
export default {
  components: {
    HmNewsCardList,
  },
  data() {
    return {
      // 记录触发了几次需要更新APP
      appUpdate: 0,
      timer2: null,
      userToken: "",
      // 装文章接口获取到的信息
      document: [],
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
      isShowLoadMore: true,
      //获取当前设置的语言
      applicationLocale: "",
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
    //获取当前设置的语言
    this.applicationLocale = uni.getLocale();
    // 获取接口 文章列表信息
    this.getDocList();
  },
  onShow() {
    // 启动定时器
    setTimeout(() => {
      this.startMyTimer();
    }, 100);
  },
  methods: {
    // 获取接口 文章列表信息
    getDocList() {
      // uni.showLoading({
      //   mask: true,
      //   title: this.$t("common.jiazai-loading"),
      // });
      uni.request({
        url: this.host + "/app/announcements/list",
        method: "GET",
        header: {
          //token
          "x-token": this.userToken,
          //version
          version: this.version,
        },
        data: {
          type: "doc",
          page: this.page,
          pageSize: this.pageSize,
          // 傳遞當前app語言
          language: this.applicationLocale,
        },
        success: (res) => {
          if (res.data.code !== 0) {
            // 如果没拿到数据,也不显示上拉加载更多
            this.isShowLoadMore = false;
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
            console.log(res.data.data.list);

            this.document = res.data.data.list;
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
        // complete: (res) => {
        // 	uni.hideLoading();
        // }
      });
    },
    //跳转到新闻详情页
    onNewsClick(news) {
      uni.navigateTo({
        url: "../news/topNews?newsId=" + news.ID,
      });
    },
    startMyTimer() {
      if (this.timer2 == null) {
        // 获取接口 文章信息 1h请求一次
        this.timer2 = setInterval(() => {
          this.getDocList();
        }, 1000 * 60 * 60);
      }
    },
    stopMyTimer() {
      if (this.timer2 != null) {
        clearInterval(this.timer2);
        this.timer2 = null;
      }
    },
  },
  // 上拉加载
  onReachBottom() {
    // 用户触发了上拉加载操作
    this.pullFlag = true;
    // 初始化pageSize
    this.pageSize = 10;
    let _this = this;
    this.status = "loading";
    //在当前页面显示导航条加载动画。
    // uni.showNavigationBarLoading()
    setTimeout(function () {
      if (_this.document.length < _this.totalLength) {
        // 计算最多多少页
        const maxPage = Math.floor(_this.totalLength / _this.pageSize) + 1;

        if (_this.page < maxPage) {
          _this.page++;
        }
        // 获取接口 用户的投資記錄
        uni.request({
          url: _this.host + "/app/announcements/list",
          method: "GET",
          data: {
            type: "doc",
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
            let sliceArr = [];
            // 把onload里读取到的pageSize条投资信息都存入sliceArr
            sliceArr = res.data.data.list;

            sliceArr.forEach((obj) => {
              _this.document.push(obj);
            });
          },
        });
        _this.status = "more";
      }

      if (_this.document.length >= _this.totalLength) {
        _this.status = "noMore";
        let height = null;
        let screenHeight = uni.getSystemInfoSync().screenHeight;
        uni
          .createSelectorQuery()
          .in(_this)
          .select(".top")
          .boundingClientRect((data) => {
            // 这里+4是测出来的,但是为什么???
            height = data.height - (screenHeight + 4);
            // uni.pageScrollTo({
            //   scrollTop: height,
            //   duration: 200,
            // });
          })
          .exec();
      }
    }, 2000);
  },
  onHide() {
    this.stopMyTimer();
  },
};
</script>

<style lang="less">
page {
  position: absolute;
  // z-index: -999;
  background-color: #ffffff;
}
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
}
</style>

<style lang="less" scoped>
// 设置轮播图底下部分的css
.page-main {
  // 顶部导航栏分割线
  .nav-line {
    width: 100%;
    height: 2rpx;
    background-color: #ececec;
  }
  // 新闻部分css
  .test-component {
    .test-component-view {
      // 热门动态列表分割线
      .list-line {
        width: 100%;
        height: 2rpx;
        background-color: #f5f9fa;
      }
      // 滚动视图内的新闻组件
      .scroll-box {
      }
    }
  }
}
</style>
