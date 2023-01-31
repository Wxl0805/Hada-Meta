<template>
  <view class="page-index">
    <view class="status_bar">
      <!-- 这里是占位状态栏 -->
    </view>
    <view class="bg"></view>
    <!-- 导航栏 -->
    <view class="box-bg">
      <view class="title navBg" :style="topNavStyle.style"></view>
      <view class="title" style="background-color: transparent;">
        <view class="logo">
          <image src="@/static/images/home/logo.png"></image>
        </view>
        <!-- <view class="right" @click="onMessageClick">
          <image src="@/static/images/home/xinxi.png"></image>
          <image src="@/static/images/home/xinxiCircle.png" v-show="isMessage"></image>
        </view> -->
      </view>
    </view>

    <!-- 顶部轮播 -->
    <swiper
      class="swiper"
      autoplay="true"
      interval="3000"
      circular="true"
      current="currImgIndex"
      :indicator-dots="true"
      indicator-color="rgba(255,255,255,0.7)"
      indicator-active-color="#ffffff"
      @change="nowSwiperImg"
    >
      <!-- 如果轮播图需要指示点则加上 indicator-dots="true" -->
      <swiper-item v-for="(item, index) in swiperList" :key="item" class="swiper-item" @click="onSwiperClick">
        <image :src="item"></image>
        <view class="swiper-content" v-if="!index">
          <view class="swiper-btn">
            <image src="@/static/images/home/swiper/rectangular.png"></image>
            <view class="swiper-btn-icon">
              <text>{{ $t("Home.Index.swiper-btn") }}</text>
              <image src="@/static/images/home/swiper/arrow.png"></image>
            </view>
          </view>
        </view>
      </swiper-item>
    </swiper>

    <view class="page-main">
      <view class="content-box1">
        <!-- 稳健理财 -->
        <view class="new-comer financial">
          <view class="new-comer-top">
            <text class="new-comer-title">{{ $t("Home.Index.financial-title") }}</text>
            <text class="new-comer-desc">{{ $t("Home.Index.financial-desc") }}</text>
          </view>
        </view>

        <!-- 理财产品区域(以定盈区域) -->
        <view class="section">
          <view class="section-list">
            <scroll-view class="scroll-view-financial" scroll-x="true">
              <!-- Aleo -->
              <view class="section-sale-text Aleobg" @click="onAleoFinancialNewsClick">
                <view class="section-sale-text-title">
                  <p>{{ $t("Home.Index.Aleo-section-title") }}</p>
                  <view>
                    <view class="section-sale-text-tip1">
                      <image src="@/static/images/home/financial/home-tag.png"></image>
                      <text>{{ $t("Home.Index.Aleo-section-sale-title") }}</text>
                    </view>
                  </view>
                </view>
                <view class="main2">
                  <text class="section-sale-text-description">{{ $t("Home.Index.section-sale-Aleo-description") }}</text>
                  <view class="moreInfo">
                    <view class="moreInfo-title">
                      <text class="moreInfo-text">{{ $t("Home.Index.section-sale-moreInfo") }}</text>
                      <view class="moreInfo-icon">
                        <image src="@/static/images/home/financial/snajiao_icon.png"></image>
                      </view>
                    </view>
                  </view>
                </view>
              </view>

              <!-- ETH -->
              <view class="section-sale-text ETHbg" @click="onETHFinancialNewsClick">
                <view class="section-sale-text-title">
                  <p>{{ $t("Home.Index.ETH-section-title") }}</p>
                  <view>
                    <view class="section-sale-text-tip2">
                      <image src="@/static/images/home/financial/home-tag.png"></image>
                      <text>{{ $t("Home.Index.ETH-section-sale-title") }}</text>
                    </view>
                  </view>
                </view>
                <view class="main2">
                  <text class="section-sale-text-description">{{ $t("Home.Index.section-sale-ETH-description") }}</text>
                  <view class="moreInfo">
                    <view class="moreInfo-title">
                      <text class="moreInfo-text">{{ $t("Home.Index.section-sale-moreInfo") }}</text>
                      <view class="moreInfo-icon">
                        <image src="@/static/images/home/financial/snajiao_icon.png"></image>
                      </view>
                    </view>
                  </view>
                </view>
              </view>

              <!-- 占位div -->
              <view style="width: 30rpx; height: 310rpx; z-index: 121; margin-top: 16px; margin-bottom: 28px;">
                <text style="visibility: hidden;">1</text>
              </view>
            </scroll-view>
          </view>
        </view>
      </view>

      <view class="content-box2">
        <!-- 热门动态 -->
        <view class="new-comer">
          <view class="new-comer-top hot-news">
            <view class="new-comer-title-img">
              <image :src="hotNewsImg"></image>
            </view>
            <view class="new-comer-desc hangqingjvjiao" @click="onNewsListClick">
              {{ $t("Home.Index.hotNews-hangqingjvjiao") }}
              <view style="display: inline-block;">
                <uni-icons type="forward" size="14" color="#9ea3bb"></uni-icons>
              </view>
            </view>
          </view>
        </view>
        <!-- 新闻区域 -->
        <view class="section">
          <view class="test-component">
            <view class="test-component-view">
              <scroll-view
                class="scroll-view_H"
                scroll-x="true"
                @scrolltolower="loadMoreNews"
                lower-threshold="30"
                @scroll="scroll"
                :scroll-left="scrollLeftDestence"
                @touchstart="banceStart"
                @touchmove="banceMove"
                @touchend="banceEnd"
              >
                <!-- 新闻block -->
                <view @click="onNewsClick(news)" v-for="(news, index) in document" :key="index" class="scroll-box">
                  <hm-news-card :options="news"></hm-news-card>
                </view>

                <!-- 左滑加载更多block -->
                <view class="load-more-block" :style="bance">
                  <image src="@/static/images/home/news/loadMore.png"></image>
                  <text>{{ $t("Home.Index.hotNews-left") }}</text>
                </view>
              </scroll-view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import HmNewsCard from "@/components/hm-news-card/index.vue";
  // #ifdef APP-PLUS
  import APPUpdate from "@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate";
  // #endif

  export default {
    components: {
      HmNewsCard,
    },
    data() {
      return {
        timer1: null,
        timer2: null,
        timer3: null,
        userToken: "",
        // 导航栏背景色
        backgroundColor: "transparent",
        // 页面滚动距离
        pageScrollTop: 0,
        // 当前轮播图图片下标
        currImgIndex: 0,
        // 轮播图列表
        swiperList: [
          "../../static/images/home/swiper/telegram.png",
          "../../static/images/home/swiper/banner1.png",
          "../../static/images/home/swiper/banner2.png",
          "../../static/images/home/swiper/banner3.png",
        ],
        // hotNewsImg
        hotNewsImg: "../../static/images/home/news/hotNews.png",
        // 是否有消息
        isMessage: false,
        // 装文章接口获取到的信息
        document: [],
        //获取当前设置的语言
        applicationLocale: "",
        // 设置热门动态加载更多回弹css效果
        bance: "",
        // 设置padding增加多少
        banceAddWidth: 0,
        // 记录是否触发左滑更多
        isBance: false,
        // 记录热门动态X移动了多少值
        scrollChangeX: [],
        scrollChange: [],
        // 记录热门动态是否左滑
        isScrollLeft: false,
        // 热门动态跳转定时器
        myTimer: null,
        // 设置热门动态滚动位置
        scrollLeftDestence: -1,
        // 记录热门动态touchstart位置
        touchstartPoint: null,
        // 记录热门动态touch结尾位置
        touchendPoint: null,
        // 记录热门动态滚动栏宽
        banceWidth: null,
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
    },
    computed: {
      topNavStyle() {
        let r = this.pageScrollTop / 20;
        return {
          style: `opacity: ${r >= 1 ? 1 : r};`,
          class: `title ${r >= 1 ? "navBg" : ""}`,
        };
      },
    },
    onShow() {
      // 用于概览页面刷新
      uni.setStorageSync("isChangeTabbar", 1);
      //获取当前设置的语言
      this.applicationLocale = uni.getLocale();
      // 如果是繁体
      if (this.applicationLocale == "zh-Hant") {
        this.swiperList = [
          "../../static/images/home/swiper/banner1-fan.png",
          "../../static/images/home/swiper/banner2-fan.png",
          "../../static/images/home/swiper/banner3-fan.png",
          "../../static/images/home/swiper/banner4-fan.png",
        ];
        this.hotNewsImg = "../../static/images/home/news/hotNews-fan.png";
      }
      // 如果是简体
      if (this.applicationLocale == "zh-Hans") {
        this.swiperList = [
          "../../static/images/home/swiper/banner1.png",
          "../../static/images/home/swiper/banner2.png",
          "../../static/images/home/swiper/banner3.png",
          "../../static/images/home/swiper/banner4.png",
        ];
        this.hotNewsImg = "../../static/images/home/news/hotNews.png";
      }

      // 设置热门动态scroll-view回到起点
      this.scrollLeftDestence = -1;
      this.$nextTick(function () {
        this.scrollLeftDestence = 0;
      });

      // 获取接口 消息是否全部已读
      this.getIsAllRead();
      // 获取接口 文章列表信息
      this.getDocList();
      // 启动定时器
      setTimeout(() => {
        this.startMyTimer();
      }, 100);
    },
    // 页面滚动监听
    onPageScroll(e) {
      this.pageScrollTop = Math.floor(e.scrollTop);
    },
    methods: {
      // 获取接口 文章列表信息
      getDocList() {
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
            page: 1,
            // 首页只展示五条文章
            pageSize: 5,
            // 傳遞當前app語言
            language: this.applicationLocale,
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
              this.document = res.data.data.list;
              // 设置其余文章isHot不显示
              this.document.forEach((doc) => {
                doc.isHot = 0;
              });
              // 第一个文章就是top1,第二个文章就是top2
              this.document[0].isHot = "./static/images/home/news/top1.png";
              this.document[1].isHot = "./static/images/home/news/top2.png";
            }
          },
        });
      },
      // 获取接口 消息是否全部已读
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
              return;
            }
            if (res.data.code == 0) {
              // false全部已读,true有未读
              if (res.data.data) {
                // 显示红点
                this.isMessage = true;
              } else {
                // 不显示红点
                this.isMessage = false;
              }
            }
          },
        });
      },
      // 改变当前轮播图index
      nowSwiperImg(evt) {
        this.currImgIndex = evt.target.current;
      },
      //跳转到消息详情页
      onMessageClick() {
        uni.navigateTo({
          url: "../message/messages",
        });
      },
      //跳转到新闻详情页
      onNewsClick(news) {
        uni.navigateTo({
          url: "../news/topNews?newsId=" + news.ID,
        });
      },
      //跳转到新闻列表页
      onNewsListClick() {
        uni.navigateTo({
          url: "../news/topNewsList",
        });
      },
      // 点击轮播图进入页面
      onSwiperClick() {
        //因为第一个图下标是0所以用!即可
        if (!this.currImgIndex) {
          uni.navigateTo({
            url: "../telegram/addTelegram",
          });
        }
        if (this.currImgIndex == 1) {
          uni.navigateTo({
            url: "../equipment/equipments",
          });
        }
        // hada meta官网跳转
        if (this.currImgIndex == 3) {
          // #ifdef APP-PLUS
          plus.runtime.openURL("http://www.hada.com/homepage");
          // #endif
        }
      },
      //跳转到ETH理财产品详情页
      onETHFinancialNewsClick() {
        uni.navigateTo({
          url: "../news/ETHfinancialNews",
        });
      },
      //跳转到Aleo理财产品详情页
      onAleoFinancialNewsClick() {
        uni.navigateTo({
          url: "../news/AleoFinancialNews",
        });
      },
      //热门动态左滑加载更多
      loadMoreNews(e) {
        console.log("触发加载更多news", e);
        this.isBance = true;
        if (this.banceAddWidth < 48) {
          console.log("自增");
          this.banceAddWidth += 12;
          let temp1 = 18 + this.banceAddWidth;
          let temp2 = 14;
          this.bance = "transition:all 0.4s;padding: 0rpx " + temp1 + "rpx 0rpx " + temp2 + "rpx;";
        } else {
          console.log("nooooooooooooooooooooooooooooooooooooooooo自增");
          this.isBance = false;

          this.banceEnd();
          // 防抖
          clearTimeout(this.myTimer);

          this.myTimer = setTimeout(() => {
            console.log("跳转");
            //跳转到新闻详情页
            uni.navigateTo({
              url: "../news/topNewsList",
            });
          }, 320);
        }
      },
      // 热门动态正在左滑时,右滑
      scroll(e) {
        this.banceWidth = e.detail.scrollWidth;
        // 如果触发了加载更多
        if (this.isBance) {
          this.scrollChangeX.push(e.detail.scrollLeft);
          // 判断是否是左滑
          if (this.scrollChangeX[0] < this.scrollChangeX[this.scrollChangeX.length - 1]) {
            console.log("左滑");
            if (this.banceAddWidth < 48) {
              this.banceAddWidth += 12;
            }
            this.isScrollLeft = true;
            let temp1 = 18 + this.banceAddWidth;
            let temp2 = 14;
            this.bance = "transition:all 0.4s;padding: 0rpx " + temp1 + "rpx 0rpx " + temp2 + "rpx;";
          }
        }
        this.scrollChange.push(e.detail.scrollLeft);
        // 如果触发了左滑,只要右滑过一点就取消跳转
        if (this.isScrollLeft) {
          if (this.scrollChange[this.scrollChange.length - 1] < this.scrollChange[this.scrollChange.length - 2]) {
            console.log("开始右滑");
            // 防抖
            clearTimeout(this.myTimer);
            if (this.banceAddWidth > 10) {
              this.banceAddWidth -= 2;
            }
            let temp1 = 18 + this.banceAddWidth;
            let temp2 = 14;
            this.bance = "transition:all 0.2s;padding: 0rpx " + temp1 + "rpx 0rpx " + temp2 + "rpx;";
          }
        }
      },
      // 回弹开始
      banceStart(e) {
        // console.log("回弹", e);
        this.touchstartPoint = e.changedTouches[0].pageX;
        console.log("touchStart", this.touchstartPoint);
      },
      // 回弹中,此事件只在scroll-view滚动到底时可以被触发
      banceMove(e) {
        console.log("回弹ing", e);
        console.log(this.isBance);
        if (this.isBance) {
          console.log("触发左滑更多");
          this.scrollChangeX.push(e.changedTouches[0].pageX);
          // 判断是否是左滑
          if (this.scrollChangeX[0] > this.scrollChangeX[this.scrollChangeX.length - 1]) {
            console.log("左滑1");
            this.isScrollLeft = true;
            if (this.banceAddWidth < 48) {
              this.banceAddWidth += 12;
              let temp1 = 18 + this.banceAddWidth * 2;
              let temp2 = 14;
              this.bance = "transition:all 0.4s;padding: 0rpx " + temp1 + "rpx 0rpx " + temp2 + "rpx;";
            } else {
              console.log(33333333333);
            }
            // 防抖
            clearTimeout(this.myTimer);

            this.myTimer = setTimeout(() => {
              console.log("跳转");
              //跳转到新闻详情页
              uni.navigateTo({
                url: "../news/topNewsList",
              });
            }, 320);
            // this.scrollLeftDestence = this.banceWidth-100;
            // this.scrollLeftDestence -= 1;
            // this.$nextTick(function () {
            //   this.scrollLeftDestence -=1;
            // });
            console.log(this.banceWidth);
          }
        }
      },
      // 取消回弹
      banceEnd(e) {
        console.log("bance end", e);
        // 初始化
        clearTimeout(this.myTimer);
        this.banceAddWidth = 0;
        let temp1 = 18 + this.banceAddWidth;
        let temp2 = 14 + this.banceAddWidth;
        this.bance = "transition:all 0.4s;padding: 0rpx " + temp1 + "rpx 0rpx " + temp2 + "rpx;";
        this.scrollChangeX = [];
        this.scrollChange = [];
        this.isScrollLeft = false;
        this.isScrollRight = false;
      },
      startMyTimer() {
        if (this.timer1 == null) {
          // 获取接口 消息已读状态信息 1min请求一次
          this.timer1 = setInterval(() => {
            this.getIsAllRead();
          }, 1000 * 60);
        }
        if (this.timer2 == null) {
          // 获取接口 文章信息 1h请求一次
          this.timer2 = setInterval(() => {
            this.getDocList();
          }, 1000 * 60 * 60);
        }
        if (this.timer3 == null) {
          // 获取接口 文章信息 1h请求一次
          this.timer3 = setInterval(() => {
            if (this.document.length == 0) {
              this.getDocList();
            } else {
              clearInterval(this.timer3);
              this.timer3 = null;
            }
          }, 1000 * 2);
        }
      },
      stopMyTimer() {
        if (this.timer1 != null) {
          clearInterval(this.timer1);
          this.timer1 = null;
        }
        if (this.timer2 != null) {
          clearInterval(this.timer2);
          this.timer2 = null;
        }
        if (this.timer3 != null) {
          clearInterval(this.timer3);
          this.timer3 = null;
        }
      },
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
    background-color: #f3f5f7;
  }
  .status_bar {
    height: var(--status-bar-height);
    width: 100%;
    /* background-color: #38abf8; */
  }

  /* 解决小程序和app滚动条的问题 */
  //#ifdef MP-WEIXIN || APP-PLUS
  ::-webkit-scrollbar {
    display: none;
  }
  //#endif

  /* 解决H5 的问题 / 隐藏滚动条，但依旧具备可以滚动的功能 */
  // #ifdef H5
  /deep/ uni-scroll-view .uni-scroll-view::-webkit-scrollbar {
    display: none;
  }
  // #endif
</style>

<style lang="less" scoped>
  .bg {
    overflow: hidden;
    z-index: -10;
    position: absolute;
    top: 0rpx;
    left: 0rpx;
    width: 750rpx;
    // height: 634rpx;
    height: 350rpx;
    background-image: url("@/static/images/home/bg.png");
    background-repeat: no-repeat;
    background-size: 100%;
  }
  // 导航栏整体
  .box-bg {
    position: relative;
    z-index: 1000;
    // margin-left: 3rpx;
    width: 750rpx;
    // background-color: #ffffff;
    .navBg {
      overflow: hidden;
      background-image: url("@/static/images/home/navBg.png");
      // background-size: 750rpx 175rpx;
      background-size: cover;
      background-repeat: no-repeat;
    }
    .title {
      position: fixed;
      top: 0;
      left: 0;
      width: 750rpx;
      height: 80rpx;
      padding-top: var(--status-bar-height);
      z-index: 10;
      background-color: transparent;
      // color: rgba(255,255,255,0.8);
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .logo {
        position: relative;
        z-index: 20;
        // left: 4rpx;
        margin-left: 34rpx;
        margin-top: 14rpx;
        image {
          width: 302rpx;
          height: 46rpx;
        }
      }
      .right {
        position: relative;
        padding-right: 6rpx;
        margin-right: 34rpx;
        margin-top: 14rpx;
        // 信息
        image:first-child {
          width: 54rpx;
          height: 54rpx;
        }
        // 信息红点
        image:last-child {
          position: absolute;
          z-index: 100;
          top: 0rpx;
          left: 36rpx;
          width: 24rpx;
          height: 24rpx;
        }
      }
    }
  }

  // 轮播图css
  /deep/ uni-swiper .uni-swiper-dot-active {
    width: 40rpx;
    height: 12rpx;
  }
  /deep/ .uni-swiper-dot {
    width: 12rpx;
    height: 12rpx;
  }
  /deep/ uni-swiper .uni-swiper-dots-horizontal .uni-swiper-dot {
    margin-right: 8rpx;
  }
  .swiper {
    position: absolute;
    z-index: 10;
    left: 26rpx;
    // top: 200rpx;
    top: calc(var(--status-bar-height) + 112rpx);
    width: 700rpx;
    height: 270rpx;
    .swiper-item {
      // 轮播图图片
      image {
        width: 700rpx;
        height: 270rpx;
      }
      .swiper-content {
        // width: 253rpx;
        height: 190rpx;
        margin: 48rpx 0 0 -9rpx;
        opacity: 1;
        font-family: PingFangSC-Semibold, PingFang SC;
        // 轮播图按钮
        .swiper-btn {
          position: absolute;
          left: 48rpx;
          bottom: 32rpx;
          image {
            width: 190rpx;
            height: 54rpx;
          }
          .swiper-btn-icon {
            display: flex;
            align-items: center;
            position: absolute;
            bottom: 18rpx;
            left: 32rpx;
            // 点击加入
            text {
              // width: 104rpx;
              // height: 37rpx;
              font-size: 26rpx;
              font-weight: 600;
              color: #325880;
              // line-height: 37rpx;
            }
            // icon
            image {
              width: 26rpx;
              height: 26rpx;
            }
          }
        }
      }
    }
    // 轮播图指示点位置
    /deep/ .uni-swiper-dots {
      // 指示点整个区域
      bottom: 20rpx;
    }
  }

  // 设置轮播图底下部分的css
  .page-main {
    // margin-top: 100rpx;
    // 稳健理财整体
    .content-box1 {
      background-color: #ffffff;
      margin-top: 250rpx;
      margin-bottom: 24rpx;
    }
    // 热门动态整体
    .content-box2 {
      background-color: #ffffff;
      padding-bottom: 34rpx;
    }
    // 稳健理财 占位padding(相对与背景过渡的那个线)
    .financial {
      padding-top: 161rpx;
    }
    // 稳健理财标题css
    .new-comer {
      // width: 686rpx;
      // height: 62rpx;
      .new-comer-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 32rpx;

        .hangqingjvjiao {
          padding-bottom: 16rpx;
        }
      }
      // 稳健理财 & 热门动态 文字
      .new-comer-title {
        font-size: 44rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #121212;
      }
      // 热门动态整体上边距
      .hot-news {
        padding-top: 46rpx;
      }
      // 热门动态图片
      .new-comer-title-img {
        image {
          width: 157rpx;
          height: 49rpx;
        }
      }
      // 价值甄选 & 行情聚焦
      .new-comer-desc {
        // width: 243rpx;
        // height: 40rpx;
        font-size: 28rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #9ea3bb;
        // line-height: 40rpx;
      }
    }
    // 以定盈部分的css
    .section {
      // 以定盈背景
      .ETHbg {
        background-image: url("../../static/images/home/financial/ETHfinancial.png");
        // margin-right: 24rpx;
      }
      // Aleo背景
      .Aleobg {
        background-image: url("../../static/images/home/financial/Aleofinancial.png");
      }
      .scroll-view-financial {
        width: 750rpx;
        /deep/ .uni-scroll-view-content {
          display: flex;
          flex-direction: row;
        }
      }
      .section-sale-text:nth-of-type(1) {
        margin-left: 32rpx;
      }
      // 以定盈整体css
      .section-sale-text {
        z-index: 121;
        width: 440rpx;
        height: 310rpx;
        background-size: cover;
        margin-top: 32rpx;
        margin-left: 24rpx;
        margin-bottom: 56rpx;

        // 以定盈标题
        .section-sale-text-title {
          width: 440rpx;
          height: 55rpx;
          display: inline-block;
          position: relative;
          // 以定盈
          p {
            margin-top: 16rpx;
            margin-left: 32rpx;
            font-size: 40rpx;
            font-family: PingFangSC-Medium;
            color: #ffffff;
            line-height: 55rpx;
            text-align: left;
            white-space: nowrap;
            display: inline-block;
          }
          view {
            position: absolute;
            top: 0rpx;
            right: 0rpx;
            display: inline-block;
            // width: 208rpx;
            // height: 38rpx;

            // Aleo旁边黄色框css
            .section-sale-text-tip1 {
              position: relative;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: flex-start;
              white-space: nowrap;

              width: 208rpx;
              height: 38rpx;
              // 实利好品文字css
              text {
                position: absolute;
                right: 14rpx;
                font-size: 22rpx;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #2e334e;
              }
              // 黄色tag
              image {
                width: 208rpx;
                height: 38rpx;
              }
            }
            // 以定盈旁边黄色框css
            .section-sale-text-tip2 {
              position: relative;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: flex-start;
              white-space: nowrap;

              width: 234rpx;
              height: 38rpx;
              // 实利好品文字css
              text {
                position: absolute;
                right: 14rpx;
                font-size: 22rpx;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #2e334e;
              }
              // 黄色tag
              image {
                width: 234rpx;
                height: 38rpx;
              }
            }
          }
        }

        // 以定盈下方白色框css
        .main2 {
          margin: 23rpx 16rpx 14rpx;
          width: 412rpx;
          height: 200rpx;
          background: #ffffff;
          border-radius: 12rpx;

          // 以定盈描述文字css
          .section-sale-text-description {
            display: block;
            width: 382rpx;
            // height: 40rpx;
            font-size: 28rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #888da7;
            // line-height: 40rpx;
            padding-top: 24rpx;
            margin-left: 22rpx;
          }
          // 查看详情
          .moreInfo {
            width: 130rpx;
            height: 38rpx;
            margin: 32rpx 0 0 22rpx;
            //查看详情
            .moreInfo-title {
              display: flex;
              flex-direction: row;
              align-items: center;
              .moreInfo-text {
                display: block;
                overflow-wrap: break-word;
                color: #242733;
                font-size: 26rpx;
                font-family: PingFangSC-Semibold;
                text-align: left;
                white-space: nowrap;
              }
              .moreInfo-icon {
                display: flex;
                align-items: center;
                image {
                  width: 24rpx;
                  height: 24rpx;
                }
              }
            }
          }
        }
      }

      .section-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
      }
    }

    // 新闻部分css
    .test-component {
      // 新闻block样式
      .test-component-view {
        margin-left: 32rpx;
        margin-top: 28rpx;
        // 滚动视图部分
        .scroll-view_H {
          width: 100%;
          white-space: nowrap;
          /deep/ .uni-scroll-view-content {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
          }
          // 滚动视图内的新闻组件
          .scroll-box {
            display: inline-block;
            // margin-right: 24rpx;
            padding-right: 24rpx;
            margin-bottom: 50rpx;
          }
        }
      }

      // 左滑加载更多样式
      .load-more-block {
        // opacity: 0;

        background-color: #f5f9fa;
        // width: 57rpx;
        height: 272rpx;
        border-radius: 12rpx 0rpx 0rpx 12rpx;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        padding: 0rpx 18rpx;
        image {
          width: 24rpx;
          height: 24rpx;
          margin-bottom: 4rpx;
        }
        text {
          writing-mode: vertical-rl;
          color: #9ea3bb;
          font-size: 22rpx;
          text-align: start;
        }
      }
    }
  }
</style>
