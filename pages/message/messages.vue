<template>
  <view>
    <!-- 顶部灰色横线 -->
    <view class="nav-line"></view>
    <view>
      <!-- 个人类msgList -->
      <uni-list :border="false" v-for="(message, index) in privateMessage" :key="message.ID" v-if="showTable">
        <view @click="jumpToPage(message.imgUrl)">
          <uni-list-item
            :showArrow="false"
            :border="false"
            class="uniList-item"
            ref="list"
            :note="message.content"
            :title="message.title"
            :clickable="true"
            @click="isRead(message.ID)"
          >
            <template v-slot:body>
              <view class="slot-body">
                <view class="body-title">
                  <text :class="message.isReaded == 1 ? 'isRead-title' : ''">
                    {{ message.title }}
                  </text>
                </view>
                <view class="body-content">
                  <text :class="message.isReaded == 1 ? 'isRead-content' : ''" :style="message.msgType == 'msg' ? 'display: block;' : 'display: none;'">
                    {{ message.content }}
                  </text>
                </view>
              </view>
            </template>
            <template v-slot:footer>
              <view class="footer-time">
                <text>
                  {{ dateChangeFormat("mm-dd HH:MM:SS", message.CreatedAt) }}
                </text>
              </view>
            </template>
          </uni-list-item>
        </view>
      </uni-list>
      <!-- <view v-for="(message, index) in privateMessage" :key="message.ID" v-if="showTable">
		  <view  @click="isRead(message.ID)">
		  <messageListBlock :message="message"></messageListBlock>
		  </view>
      </view> -->
      <!-- 加载更多组件 -->
      <view v-if="isShowLoadMore">
        <uni-load-more iconType="circle" :status="status" :color="loadDivColor" />
      </view>
    </view>

    <!-- nodata img -->
    <view class="nodata" v-if="showNoDataImg">
      <image src="@/static/images/nodata.png"></image>
      <text>{{ $t("Aleo.InvestmentRecord.nodata") }}</text>
    </view>
  </view>
</template>

<script>
import messageListBlock from "@/components/ETH/home/messageListBlock.vue";
// #ifdef APP-PLUS
import APPUpdate from "@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate";
// #endif
export default {
  name: "Message",
  components: {
    messageListBlock,
  },
  data() {
    return {
      // 记录触发了几次需要更新APP
      appUpdate: 0,
      userToken: "",
      // 装接口获取到的msg
      message: [],
      // 装接口获取到的pri
      // state为0表示未读，1表示已读
      // 注意！副标题不能为空！至少有一个空格作为占位！！！
      privateMessage: [],
      // 记录当前时间
      nowTime: "",
      // 底部上拉加载状态栏状态
      status: "more",
      // 当前page
      page: 1,
      // 当前每页的size
      pageSize: 14,
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
      // 標識用戶有沒有觸發過"沒有更多數據"狀態
      isNoMoreData: false,
      // 加載組件的顔色
      loadDivColor: "#007AFF",
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
    // 获取接口 消息列表信息(个人类)
    this.getPrivateMsgList();
  },
  methods: {
    // 获取接口 消息列表信息(个人类)
    getPrivateMsgList() {
      console.log("读取了信息接口");
      // // 判断触发了几次上拉加载
      // if (this.page > 1) {
      //   // 计算对应应该展示的消息条数
      //   this.pageSize = this.page * this.pageSize;
      // }
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
          type: "pri",
          // page: this.page,
          // 请求消息列表的时候应该固定只有1页,这样就不会出现重复读取的bug
          page: 1,
          pageSize: this.pageSize,
          language: "zh-Hans",
        },
        success: (res) => {
          if (res.data.code != 0) {
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
            // 如果沒查到數據就顯示nodata圖片
            if (res.data.msg == "暂时没有消息") {
              this.showNoDataImg = true;
              // 隱藏list
              this.showTable = false;
              return;
            }
            // 隱藏nodata圖片
            this.showNoDataImg = false;
            // 顯示list
            this.showTable = true;
            this.privateMessage = res.data.data.list;
            const date = new Date();
            this.nowTime = this.dateChangeFormat("YYYY-mm-dd HH:MM:SS", date);

            this.privateMessage.forEach((msg, index) => {
              // 公告msg
              if (msg.t_code == "TZGXGG") {
                msg.title = this.$t("Home.Message.announcement");
                msg.imgUrl = "./announcement?msgId=" + msg.ID;
              }
              // 投资份额提交成功msg
              if (msg.t_code == "TZFETJ") {
                msg.title = this.$t("Home.Message.investment-submit");
                msg.imgUrl = "./submitSuccessMsg?msgId=" + msg.ID;
              }
              // 投资份额审核通过msg
              if (msg.t_code == "TZFESHY") {
                msg.title = this.$t("Home.Message.investment-success");
                msg.imgUrl = "./auditSuccessMsg?msgId=" + msg.ID;
              }
              // 投资份额审核失败msg
              if (msg.t_code == "TZFESHN") {
                msg.title = this.$t("Home.Message.investment-fail");
                msg.imgUrl = "./auditFailMsg?msgId=" + msg.ID;
              }
              // 奖励结算通知msg
              if (msg.t_code == "JLJS01") {
                msg.title = this.$t("Home.Message.award-settlement-notice");
                msg.imgUrl = "./bonusMsg?msgId=" + msg.ID;
              }
              // 激励结算通知msg
              if (msg.t_code == "JLJS02") {
                msg.title = this.$t("Home.Message.incentive-settlement-notice");
                msg.imgUrl = "./inspiredMsg?msgId=" + msg.ID;
              }
              // 拓展客户通知msg
              if (msg.t_code == "KZKH") {
                msg.title = this.$t("Home.Message.expanding-customer-notice");
                msg.imgUrl = "./inviteMsg?msgId=" + msg.ID;
              }
              // 客户被拓展通知msg
              if (msg.t_code == "KZKHB") {
                msg.title = this.$t("Home.Message.authentication-success-notice");
                msg.imgUrl = "./beInvitedMsg?msgId=" + msg.ID;
              }
              // 发展客户投资提交通知msg
              if (msg.t_code == "TZFETJL") {
                msg.title = this.$t("Home.Message.customer-submit-investment-notice");
                msg.imgUrl = "./CustomerSubmitInvestmentMsg?msgId=" + msg.ID;
              }
            });

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
    // 获取接口 单条消息标记为已读
    isRead(msgId) {
      console.log("标记已读");
      uni.request({
        url: this.host + "/app/announcements/Trigger/readed",
        method: "GET",
        data: {
          Id: msgId,
        },
        header: {
          //token
          "x-token": this.userToken,
          //version
          version: this.version,
        },
        success: (res) => {
          if (res.data.code != 0) {
            return;
          }
          if (res.data.code == 0) {
            // 获取消息成功
            // 重新获取变更后的消息列表
            // this.getMsgList();
            // console.log("isRead");
            this.getPrivateMsgList();
          }
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
    // 跳转到对应页面
    jumpToPage(url) {
      console.log("跳转", url);
      uni.navigateTo({
        url: url,
        success: (res) => {
          // console.log("success",res);
        },
        fail: (res) => {
          // console.log("fail",res);
        },
      });
    },
  },
  // 上拉加载
  onReachBottom() {
    console.log("读取了加载接口");
    // 如果觸發過"沒有更多數據"狀態,不繼續執行
    if (this.isNoMoreData) {
      return;
    }
    // 用户触发了上拉加载操作
    this.pullFlag = true;
    // 初始化pageSize
    this.pageSize = 14;
    let _this = this;
    this.status = "loading";
    //在当前页面显示导航条加载动画。
    // uni.showNavigationBarLoading()
    setTimeout(function () {
      if (_this.privateMessage.length < _this.totalLength) {
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
            type: "pri",
            page: _this.page,
            pageSize: _this.pageSize,
            language: "zh-Hans",
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
              return;
            }
            res.data.data.list.forEach((msg, index) => {
              // 投资份额提交成功msg
              if (msg.t_code == "TZFETJ") {
                msg.title = _this.$t("Home.Message.investment-submit");
                msg.imgUrl = "./submitSuccessMsg?msgId=" + msg.ID;
              }
              // 投资份额审核通过msg
              if (msg.t_code == "TZFESHY") {
                msg.title = _this.$t("Home.Message.investment-success");
                msg.imgUrl = "./auditSuccessMsg?msgId=" + msg.ID;
              }
              // 投资份额审核失败msg
              if (msg.t_code == "TZFESHN") {
                msg.title = _this.$t("Home.Message.investment-fail");
                msg.imgUrl = "./auditFailMsg?msgId=" + msg.ID;
              }
              // 奖励结算通知msg
              if (msg.t_code == "JLJS01") {
                msg.title = _this.$t("Home.Message.award-settlement-notice");
                msg.imgUrl = "./bonusMsg?msgId=" + msg.ID;
              }
              // 激励结算通知msg
              if (msg.t_code == "JLJS02") {
                msg.title = _this.$t("Home.Message.incentive-settlement-notice");
                msg.imgUrl = "./inspiredMsg?msgId=" + msg.ID;
              }
              // 拓展客户通知msg
              if (msg.t_code == "KZKH") {
                msg.title = _this.$t("Home.Message.expanding-customer-notice");
                msg.imgUrl = "./inviteMsg?msgId=" + msg.ID + "&customerId=" + msg.customerId;
              }
              // 客户被拓展通知msg
              if (msg.t_code == "KZKHB") {
                msg.title = _this.$t("Home.Message.authentication-success-notice");
                msg.imgUrl = "./beInvitedMsg?msgId=" + msg.ID;
              }
              // 发展客户投资提交通知msg
              if (msg.t_code == "TZFETJL") {
                msg.title = _this.$t("Home.Message.customer-submit-investment-notice");
                msg.imgUrl = "./CustomerSubmitInvestmentMsg?msgId=" + msg.ID;
              }
            });

            let sliceArr = [];
            // 把onload里读取到的pageSize条投资信息都存入sliceArr
            sliceArr = res.data.data.list;

            sliceArr.forEach((obj) => {
              _this.privateMessage.push(obj);
            });
          },
        });
        _this.status = "more";
      }

      if (_this.privateMessage.length >= _this.totalLength) {
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
            // uni.pageScrollTo({
            //   scrollTop: height,
            //   duration: 200,
            // });
          })
          .exec();
      }
      //在当前页面隐藏导航条加载动画。
      // uni.hideNavigationBarLoading()
    }, 2000);
  },
};
</script>

<style lang="less" scoped>
// 顶部导航栏分割线
.nav-line {
  width: 100%;
  height: 1rpx;
  background-color: #ececec;
}

.isRead-title {
  color: #9699a6;
}
.isRead-content {
  color: #c4c6d3;
}
.uniList-item {
  .slot-body {
    // margin-left: 20rpx;
    .body-title {
      font-size: 30rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #2e334e;
    }
    .body-content {
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 488rpx;
      height: 40rpx;
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #888da7;
      line-height: 40rpx;
    }
  }
}
.footer-time {
  font-size: 24rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #9ea3bb;
  text-align: right;
  // display: flex;
  // align-items: flex-start;
}
// 标题样式注入
/deep/ .uni-list-item__content-title {
  font-size: 30rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #2e334e;
}
// 描述样式注入
/deep/ .uni-list-item__content-note {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 488rpx;
  height: 40rpx;
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #888da7;
  line-height: 40rpx;
}

// 去掉消息右边箭头
/deep/ .uni-icon-wrapper {
  display: none;
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
