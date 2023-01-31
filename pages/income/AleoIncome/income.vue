v<template>
  <view>
    <view class="status_bar">
      <!-- 这里是占位状态栏 -->
    </view>
    <!-- 导航栏部分 -->
    <view class="box-bg">
      <view class="title" :style="topNavStyle.style">
        <view class="leftIcon">
          <text class="uni-nav-bar-text">{{ $t("Aleo.Index.topTabbar-title") }}</text>
        </view>
        <view class="rightIcon">
          <text @click="onMetaVerseBtnClick">Metaverse</text>
        </view>
      </view>
      <!-- 顶部灰色横线 -->
      <view style="width: 750rpx; height: 1rpx; background-color: rgb(236, 236, 236); margin-top: 90rpx;"></view>
    </view>

    <!-- 分段器(切换顶部卡片用) -->
    <view class="uni-segmented-control">
      <uni-segmented-control :current="current" :values="units" style-type="text" :active-color="activeColor" @clickItem="onClickItem" />
    </view>
    <!-- 选项卡组件 -->
    <view class="segmented-content">
      <view v-if="current === 0">
        <!-- U组件 -->
        <view class="Udiv">
          <Udiv
            :TotalNum="UTotal"
            :isBindLeader="isBindLeader"
            :isRemainingEnough="isRemainingEnough"
            @open-dialog="dialogOpen()"
            @open-remaining-dialog="exchangeDialogOpen()"
          ></Udiv>
        </view>
      </view>
      <view v-if="current === 1">
        <!-- G组件 -->
        <view class="Gdiv">
          <Gdiv
            :TotalNum="GTotal"
            :isBindLeader="isBindLeader"
            :isRemainingEnough="isRemainingEnough"
            @open-dialog="dialogOpen()"
            @open-remaining-dialog="exchangeDialogOpen()"
          ></Gdiv>
        </view>
      </view>
      <view v-if="current === 2">
        <!-- Ao组件 -->
        <view class="Aodiv">
          <Aodiv :TotalNum="AoTotal"></Aodiv>
        </view>
      </view>

      <!-- 阴影 -->
      <view class="shadow"> </view>
    </view>

    <!-- 流水列表 -->
    <view class="variable-flow-list">
      <view class="title">
        <text>{{ $t("Aleo.Index.content-title") }}</text>
      </view>
      <view v-for="(record, index) in recordList" :key="record.uid" @click="toDetails(record.types, record.orderNumber, record.settlementDate)">
        <flowRecordDiv :record="record"></flowRecordDiv>
      </view>

      <!-- 加载更多组件 -->
      <view v-if="isShowLoadMoreU == true">
        <uni-load-more iconType="circle" :status="Ustatus" :color="loadUDivColor" />
      </view>
      <view v-if="isShowLoadMoreG == true">
        <uni-load-more iconType="circle" :status="Gstatus" :color="loadGDivColor" />
      </view>
      <view v-if="isShowLoadMoreAo == true">
        <uni-load-more iconType="circle" :status="Aostatus" :color="loadAoDivColor" />
      </view>
    </view>

    <!-- nodata img -->
    <view class="nodata" v-if="showNoDataImg">
      <image src="@/static/images/nodata.png"></image>
      <text>{{ $t("Aleo.InvestmentRecord.nodata") }}</text>
    </view>

    <!-- 认证提示窗 -->
    <view>
      <uni-popup ref="alertDialog" type="dialog">
        <uni-popup-dialog
          type="info"
          :title="$t('Aleo.authenticationAlertDialog.title')"
          :cancelText="$t('Aleo.authenticationAlertDialog.cancel')"
          :confirmText="$t('Aleo.authenticationAlertDialog.confirm')"
          :content="$t('Aleo.authenticationAlertDialog.text')"
          @confirm="dialogConfirm"
          @close="dialogClose"
        ></uni-popup-dialog>
      </uni-popup>
    </view>

    <!-- 余额不足提示窗 -->
    <view>
      <uni-popup ref="alertDialogBalance" type="dialog">
        <uni-popup-dialog
          type="info"
          :title="$t('Aleo.balanceAlertDialog.title')"
          :cancelText="$t('Aleo.balanceAlertDialog.cancel')"
          :confirmText="$t('Aleo.balanceAlertDialog.confirm')"
          :content="$t('Aleo.balanceAlertDialog.text')"
          @confirm="dialogBalanceConfirm"
          @close="dialogClose"
        >
        </uni-popup-dialog>
      </uni-popup>
    </view>
  </view>
</template>

<script>
  import Udiv from "@/components/Aleo/income/Udiv.vue";
  import Gdiv from "@/components/Aleo/income/Gdiv.vue";
  import Aodiv from "@/components/Aleo/income/Aodiv.vue";
  import flowRecordDiv from "@/components/Aleo/income/flowRecordDiv.vue";
  // #ifdef APP-PLUS
  import APPUpdate from "@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate";
  // #endif
  export default {
    components: {
      Udiv,
      Gdiv,
      Aodiv,
      flowRecordDiv,
    },
    onLoad() {
      uni.showLoading({
        mask: true,
      });
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
    onShow() {
      uni.hideLoading();
      // 获取tabbar切换状态
      this.tabbarStatus = uni.getStorageSync("isChangeTabbar");
      // 重新把存到storage里的flag初始化
      uni.setStorageSync("isChangeTabbar", 0);

      // 初始化
      // 如果触发过跳转详情U/跳转详情G或跳转详情Ao,不初始化
      if (this.jumpU == true || this.jumpG == true || this.jumpAo == true) {
        console.log("不初始化");
        // 如果触发过跳转详情,检测是否切换过tabbar
        if (this.tabbarStatus) {
          // 如果切换过tabbar,初始化
          console.log("初始化-tabbar");
          // 初始化数据
          this.initPage();
          // 初始化页面回到顶部
          uni.pageScrollTo({
            scrollTop: 0,
            duration: 0,
          });
        }
      } else {
        console.log("初始化");
        // 初始化数据
        this.initPage();
        // 初始化页面回到顶部
        uni.pageScrollTo({
          scrollTop: 0,
          duration: 0,
        });
      }

      if (this.current == 0) {
        console.log("onShow");
        // 获取接口 用户拥有的U流水列表
        this.getUserUdataList();
        // 获取接口 用户拥有的U顶部div信息 UTotal
        this.getUserUdivDataList();
      } else if (this.current == 1) {
        // 获取接口 用户拥有的G流水列表
        this.getUserGdataList();
        // 获取接口 用户拥有的G顶部div信息 GTotal
        this.getUserGdivDataList();
        console.log("GGGGGGG");
      } else {
        // 获取接口 用户拥有的Ao流水列表
        this.getUserAodataList();
        // 获取接口 用户拥有的Ao顶部div信息 AoTotal
        this.getUserAodivDataList();
        console.log("AOOOOOOOOOOOO");
      }

      // 获取接口 用户是否余额充足
      this.getUsersRemaining();
      // 获取接口 用户是否填寫了上級邀請碼
      this.getUsersLeader();
      this.checkUserIsLeader();
      // setTimeout(() => {
      //   this.startMyTimer();
      // }, 2000);
    },
    data() {
      return {
        timer: null,
        userToken: "",
        // 存tabbar切换状态,0是没切换,1是切换到首页或我的
        tabbarStatus: null,
        // 裝用户拥有的当前U,历史U,兑换U
        UTotal: {},
        // 裝用户拥有的当前G,历史G,兑换G
        GTotal: {},
        // 裝用户拥有的当前Ao,历史Ao,兑换Ao
        AoTotal: {
          nowInt: 0,
          nowFloat: "00",
          historyInt: 0,
          historyFloat: "00",
          exchangeInt: 0,
          exchangeFloat: "00",
        },
        // 记录分段器当前下标
        current: 0,
        // 记录分段器被激活颜色
        activeColor: "#ffffff",
        // 记录分段器代表的卡片
        units: ["· U", "· G", "· Ao"],
        // 是否顯示nodata圖片
        showNoDataImg: false,
        // 用户拥有的产品信息
        productData: [],
        // 是否是leader
        isLeader: false,
        // 是否綁定了leader
        isBindLeader: false,
        // 余额是否充足
        isRemainingEnough: false,
        // 当前Upage
        pageU: 1,
        // 当前U每页的size
        pageUSize: 10,
        // 当前Gpage
        pageG: 1,
        // 当前G每页的size
        pageGSize: 10,
        // 当前Aopage
        pageAo: 1,
        // 当前Ao每页的size
        pageAoSize: 10,
        // 标识用户有没有进行过上拉加载操作U
        pullUFlag: false,
        // 标识用户有没有进行过上拉加载操作G
        pullGFlag: false,
        // 标识用户有没有进行过上拉加载操作Ao
        pullAoFlag: false,
        // 标识用户有没有进行过跳转详情操作U
        jumpU: false,
        // 标识用户有没有进行过跳转详情操作G
        jumpG: false,
        // 标识用户有没有进行过跳转详情操作Ao
        jumpAo: false,
        // U上拉加载组件是否显示
        isShowLoadMoreU: false,
        // G上拉加载组件是否显示
        isShowLoadMoreG: false,
        // Ao上拉加载组件是否显示
        isShowLoadMoreAo: false,
        // 总共有多少条投资数据
        totalLength: null,
        // 裝接口獲取的流水信息
        recordList: [],
        // 流水列表信息(假数据)
        recordListfake: [
          {
            // 前端手动加这个type
            // 0是U,1是G,2是Ao
            recordType: 0,
            // 0是流通转入,符号是+ ; 1是兑换转出,符号是-
            // 0是自主兑换1是他人代兑,符号都是+
            // 0是固定产出1是额外产出
            types: 0,
            // 0待1成功2失败
            status: 1,
            tradeTime: "2022-10-10 12:00",
            changeAmount: 10,
          },
        ],
        // 標識用戶有沒有觸發過"沒有更多數據"狀態U
        isNoMoreUData: false,
        // 標識用戶有沒有觸發過"沒有更多數據"狀態G
        isNoMoreGData: false,
        // 標識用戶有沒有觸發過"沒有更多數據"狀態Ao
        isNoMoreAoData: false,
        // 底部上拉加载状态栏状态U
        Ustatus: "more",
        // 底部上拉加载状态栏状态G
        Gstatus: "more",
        // 底部上拉加载状态栏状态Ao
        Aostatus: "more",
        // 加載組件的顔色U
        loadUDivColor: "#007AFF",
        // 加載組件的顔色G
        loadGDivColor: "#007AFF",
        // 加載組件的顔色Ao
        loadAoDivColor: "#007AFF",
        // 加載組件的计时器U
        loadU: null,
        // 加載組件的计时器G
        loadG: null,
        // 加載組件的计时器Ao
        loadAo: null,
        // 记录触发了几次需要更新APP
        appUpdate: 0,
      };
    },
    computed: {
      topNavStyle() {
        return {
          style: `background-color: rgba(255, 255, 255,1);`,
        };
      },
    },
    methods: {
      // 初始化所有的page和pageSize以及加载flag/颜色
      initPage() {
        this.pageU = 1;
        this.pageUSize = 10;
        this.isNoMoreUData = false;
        this.pullUFlag = false;
        this.loadUDivColor = "#007AFF";

        this.pageG = 1;
        this.pageGSize = 10;
        this.isNoMoreGData = false;
        this.pullGFlag = false;
        this.loadGDivColor = "#007AFF";

        this.pageAo = 1;
        this.pageAoSize = 10;
        this.isNoMoreAoData = false;
        this.pullAoFlag = false;
        this.loadAoDivColor = "#007AFF";

        // 初始化跳转flag
        this.jumpU = false;
        this.jumpG = false;
        this.jumpAo = false;

        // 清除上拉加载计时器任务
        if (this.loadU != null) {
          console.log("清除U计时器");
          clearTimeout(this.loadU);
          this.loadU = null;
        }
        if (this.loadG != null) {
          console.log("清除G计时器");
          clearTimeout(this.loadG);
          this.loadG = null;
        }
        if (this.loadAo != null) {
          console.log("清除Ao计时器");
          clearTimeout(this.loadAo);
          this.loadAo = null;
        }
      },
      // 更新当前分段器下标
      onClickItem(e) {
        if (this.current !== e.currentIndex) {
          this.current = e.currentIndex;
          // 每切换一次上面的UGAo就初始化一次
          this.initPage();

          if (this.current == 0) {
            // 获取接口 用户拥有的U流水列表
            this.getUserUdataList();
            // 获取接口 用户拥有的U顶部div信息 UTotal
            this.getUserUdivDataList();
            // 隐藏其他loading组件
            this.isShowLoadMoreG = false;
            this.isShowLoadMoreAo = false;
          } else if (this.current == 1) {
            // 获取接口 用户拥有的G流水列表
            this.getUserGdataList();
            // 获取接口 用户拥有的G顶部div信息 GTotal
            this.getUserGdivDataList();
            // 隐藏其他loading组件
            this.isShowLoadMoreU = false;
            this.isShowLoadMoreAo = false;
            console.log("GGGGGGG");
          } else {
            // 获取接口 用户拥有的Ao流水列表
            this.getUserAodataList();
            // 获取接口 用户拥有的Ao顶部div信息 AoTotal
            this.getUserAodivDataList();
            // 隐藏其他loading组件
            this.isShowLoadMoreU = false;
            this.isShowLoadMoreG = false;
            console.log("AOOOOOOOOOOOO");
          }
        }
      },
      // 控制提示彈窗-確認按鈕
      dialogConfirm() {
        // 点击"立即认证"后跳转到  我的认证页面
        uni.navigateTo({
          url: "/pages/news/identity",
        });
      },
      // 余额弹窗
      dialogBalanceConfirm() {
        // 点击"立即获取"后跳转到  获取U页面
        uni.navigateTo({
          url: "/pages/news/AddAleoFinancial",
        });
      },
      // 控制提示彈窗-關閉按鈕
      dialogClose() {},
      // 控制认证提示彈窗打開
      dialogOpen() {
        this.$refs.alertDialog.open();
      },
      // 控制兑换提示彈窗打開
      exchangeDialogOpen() {
        this.$refs.alertDialogBalance.open();
      },
      // startMyTimer() {
      //   if (this.timer == null) {
      //     this.timer = setInterval(() => {
      //       if (this.current == 0) {
      //         // 获取接口 用户拥有的U流水列表
      //         this.getUserUdataList();
      //         // 获取接口 用户拥有的U顶部div信息 UTotal
      //         this.getUserUdivDataList();
      //       } else if (this.current == 1) {
      //         // 获取接口 用户拥有的G流水列表
      //         this.getUserGdataList();
      //         // 获取接口 用户拥有的G顶部div信息 GTotal
      //         this.getUserGdivDataList();
      //       } else {
      //         // 获取接口 用户拥有的Ao流水列表
      //         // this.getUserAodataList();
      //       }

      //       // 判断是不是leader
      //       this.checkUserIsLeader();
      //     }, 60000);
      //   }
      // },
      // stopMyTimer() {
      //   if (this.timer != null) {
      //     clearInterval(this.timer);
      //     this.timer = null;
      //   }
      // },
      // 获取接口  用户是否是leader
      checkUserIsLeader() {
        uni.request({
          url: this.host + "/app/user/check/leader",
          method: "GET",
          header: {
            "x-token": this.userToken,
            //version
            version: this.version,
          },
          data: null,
          success: (res) => {
            if (res.data.code == 0) {
              var isLeader = res.data.data.is_leader;
              if (isLeader == 1) {
                this.isLeader = true;
              } else {
                this.isLeader = false;
              }
            }
          },
        });
      },
      // 获取接口 用户拥有的U流水列表
      getUserUdataList() {
        uni.showLoading({
          mask: true,
          title: this.$t("common.wait"),
        });
        // 如果用户触发了上拉加载操作
        if (this.pullUFlag) {
          this.pageUSize = this.pageU * 10;
          this.pageU = 1;
          // 初始化上拉flag
          this.pullUFlag = false;
          // 初始化跳转flag
          this.jumpU = false;
          this.jumpG = false;
          this.jumpAo = false;
        }
        // 每次请求接口前先清空recordList
        this.recordList = [];
        // 请求接口
        uni.request({
          url: this.host + "/app/rechargeAndExchangesList/" + this.pageU + "/" + this.pageUSize,
          method: "GET",
          header: {
            //token
            "x-token": this.userToken,
            //version
            version: this.version,
          },
          success: (res) => {
            console.log("uuuuuu", res);
            if (res.data.code != 0) {
              // 如果沒查到數據就顯示nodata圖片
              this.showNoDataImg = true;
              return;
            }

            if (res.data.code == 0) {
              if (res.data.data.list == null) {
                // 如果沒查到數據就顯示nodata圖片
                this.showNoDataImg = true;
                return;
              }
              // 隱藏nodata圖片
              this.showNoDataImg = false;

              this.recordList = JSON.parse(JSON.stringify(res.data.data.list));

              this.recordList.forEach((data, index) => {
                data.uid = this.current + data.orderNumber + index;
                data.recordType = this.current;
                data.tradeTime = this.dateChangeFormat("YYYY-mm-dd HH:MM:SS", data.tradeTime);
              });
              // 获取总共有多少条数据
              this.totalLength = res.data.data.total;
              // 如果总数小于分页的size,说明小于一页
              if (this.totalLength <= this.pageUSize) {
                this.isShowLoadMoreU = false;
              }
              if (this.totalLength > this.pageUSize) {
                this.isShowLoadMoreU = true;
              }
            }
          },
          complete: (res) => {
            uni.hideLoading();
          },
        });
      },
      // 获取接口 用户拥有的G流水列表
      getUserGdataList() {
        uni.showLoading({
          mask: true,
          title: this.$t("common.wait"),
        });
        // 如果用户触发了上拉加载操作
        if (this.pullGFlag) {
          this.pageGSize = this.pageG * 10;
          this.pageG = 1;
          // 初始化上拉flag
          this.pullGFlag = false;
          // 初始化跳转flag
          this.jumpU = false;
          this.jumpG = false;
          this.jumpAo = false;
        }
        // 每次请求接口前先清空recordList
        this.recordList = [];
        // 请求接口
        uni.request({
          url: this.host + "/app/getExchangeList",
          method: "POST",
          header: {
            //token
            "x-token": this.userToken,
            //version
            version: this.version,
          },
          data: {
            page: this.pageG,
            pageSize: this.pageGSize,
          },
          success: (res) => {
            console.log("gggggg", res);
            if (res.data.code != 0) {
              // 如果沒查到數據就顯示nodata圖片
              this.showNoDataImg = true;
              return;
            }

            if (res.data.code == 0) {
              if (res.data.msg == "暂无数据") {
                // 如果沒查到數據就顯示nodata圖片
                this.showNoDataImg = true;
                return;
              }
              // 隱藏nodata圖片
              this.showNoDataImg = false;

              this.recordList = JSON.parse(JSON.stringify(res.data.data.list));

              this.recordList.forEach((data, index) => {
                data.uid = this.current + data.orderNumber + index;
                data.recordType = this.current;
                data.tradeTime = this.dateChangeFormat("YYYY-mm-dd HH:MM:SS", data.tradeTime);
                data.types = parseInt(data.exchangeType);
                data.status = 1;
                data.changeAmount = data.changeAmount;
              });
              // 获取总共有多少条数据
              this.totalLength = res.data.data.total;
              // 如果总数小于分页的size,说明小于一页
              if (this.totalLength <= this.pageGSize) {
                this.isShowLoadMoreG = false;
              }
              if (this.totalLength > this.pageGSize) {
                this.isShowLoadMoreG = true;
              }
            }
          },
          complete: () => {
            uni.hideLoading();
          },
        });
      },
      // 获取接口 用户拥有的Ao流水列表
      getUserAodataList() {
        uni.showLoading({
          mask: true,
          title: this.$t("common.wait"),
        });
        // 如果用户触发了上拉加载操作
        if (this.pullAoFlag) {
          this.pageAoSize = this.pageAo * 10;
          this.pageAo = 1;
          // 初始化上拉flag
          this.pullAoFlag = false;
          // 初始化跳转flag
          this.jumpU = false;
          this.jumpG = false;
          this.jumpAo = false;
        }
        // 每次请求接口前先清空recordList
        this.recordList = [];
        // 请求接口
        uni.request({
          // url: this.host + "/app/integralList?page="+this.pageAo+"&pageSize="+this.pageAoSize,
          url: this.host + "/app/integralList",
          method: "GET",
          header: {
            //token
            "x-token": this.userToken,
            //version
            version: this.version,
          },
          data: {
            page: this.pageAo,
            pageSize: this.pageAoSize,
          },
          success: (res) => {
            console.log("aoooooooooo", res);
            if (res.data.code != 0) {
              // 如果沒查到數據就顯示nodata圖片
              this.showNoDataImg = true;
              return;
            }

            if (res.data.code == 0) {
              if (res.data.msg == "暂无数据") {
                // 如果沒查到數據就顯示nodata圖片
                this.showNoDataImg = true;
                return;
              }
              // 隱藏nodata圖片
              this.showNoDataImg = false;

              this.recordList = JSON.parse(JSON.stringify(res.data.data.list));

              this.recordList.forEach((data, index) => {
                data.uid = this.current + data.orderNumber + index;
                data.recordType = this.current;
                data.textTime = data.settlementDate.split("-").join(".");
                data.tradeTime = this.dateChangeFormat("YYYY-mm-dd HH:MM:SS", data.createdAt);
                data.changeAmount = data.totalIntegral;
                data.types = 0;
                data.status = 1;
              });
              // 获取总共有多少条数据
              this.totalLength = res.data.data.total;
              // 如果总数小于分页的size,说明小于一页
              if (this.totalLength <= this.pageAoSize) {
                this.isShowLoadMoreAo = false;
              }
              if (this.totalLength > this.pageAoSize) {
                this.isShowLoadMoreAo = true;
              }
            }
          },
          complete: (res) => {
            uni.hideLoading();
          },
        });
      },
      // 获取接口 用户拥有的U顶部div信息 UTotal
      getUserUdivDataList() {
        uni.request({
          url: this.host + "/app/rechargeOverview",
          method: "GET",
          header: {
            //token
            "x-token": this.userToken,
            //version
            version: this.version,
          },
          success: (res) => {
            if (res.data.code != 0) {
              // 如果沒查到數據就顯示假数据(全0)
              this.UTotal = {
                nowInt: 0,
                historyInt: 0,
                exchangeInt: 0,
              };
              return;
            }

            if (res.data.code == 0) {
              this.UTotal = res.data.data;
              this.UTotal.nowInt = res.data.data.rechargeBalance;
              this.UTotal.historyInt = res.data.data.totalRecharge;
              this.UTotal.exchangeInt = res.data.data.shareExchanges;
            }
          },
        });
      },
      // 获取接口 用户拥有的G顶部div信息 GTotal
      getUserGdivDataList() {
        uni.request({
          url: this.host + "/app/exchangeOverview",
          method: "GET",
          header: {
            //token
            "x-token": this.userToken,
            //version
            version: this.version,
          },
          success: (res) => {
            if (res.data.code != 0) {
              // 如果沒查到數據就顯示假数据(全0)
              this.GTotal = {
                total: 0,
                self: 0,
                other: 0,
              };
              return;
            }

            if (res.data.code == 0) {
              this.GTotal = res.data.data;
              this.GTotal.total = res.data.data.TotalShares;
              this.GTotal.self = res.data.data.SelfExchange;
              this.GTotal.other = res.data.data.OtherExchange;
            }
          },
        });
      },
      // 获取接口 用户拥有的Ao顶部div信息 AoTotal
      getUserAodivDataList() {
        uni.request({
          url: this.host + "/app/integralOverview",
          method: "GET",
          header: {
            //token
            "x-token": this.userToken,
            //version
            version: this.version,
          },
          success: (res) => {
            if (res.data.code != 0) {
              // 如果沒查到數據就顯示假数据(全0)
              this.AoTotal = {
                nowInt: 0,
                nowFloat: "00",
                historyInt: 0,
                historyFloat: "00",
                exchangeInt: 0,
                exchangeFloat: "00",
              };
              return;
            }

            if (res.data.code == 0) {
              this.AoTotal = res.data.data;
              let temp_total = res.data.data.totalIntegral.split(".");
              let temp_fixed = res.data.data.totalCustomerIntegral.split(".");
              let temp_extra = res.data.data.totalLeaderIntegral.split(".");

              this.AoTotal.nowInt = temp_total[0];
              if (temp_total.length > 1) {
                this.AoTotal.nowFloat = temp_total[1];
              } else {
                this.AoTotal.nowFloat = "00";
              }

              this.AoTotal.historyInt = temp_fixed[0];
              if (temp_fixed.length > 1) {
                this.AoTotal.historyFloat = temp_fixed[1];
              } else {
                this.AoTotal.historyFloat = "00";
              }

              this.AoTotal.exchangeInt = temp_extra[0];
              if (temp_extra.length > 1) {
                this.AoTotal.exchangeFloat = temp_extra[1];
              } else {
                this.AoTotal.exchangeFloat = "00";
              }
            }
          },
        });
      },
      // 获取接口 用户的上級邀請碼,上級uid和用戶uid
      getUsersLeader() {
        uni.request({
          url: this.host + "/app/judge_Has_Leader",
          method: "GET",
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
              // 如果res.data.data為true,説明綁定了上級邀請碼
              if (res.data.data) {
                this.isBindLeader = true;
              }
              // 如果res.data.data為false,説明沒綁定上級邀請碼
              if (!res.data.data) {
                this.isBindLeader = false;
              }
            }
          },
        });
      },
      // 获取接口 用户的余额验证
      getUsersRemaining() {
        uni.request({
          url: this.host + "/app/checkRechargeBalance",
          method: "GET",
          header: {
            //token
            "x-token": this.userToken,
            //version
            version: this.version,
          },
          success: (res) => {
            if (res.data.code != 0) {
              this.isRemainingEnough = false;
              return;
            }
            if (res.data.code == 0) {
              // 如果res.data.code為0,説明余额够
              this.isRemainingEnough = true;
            }
          },
        });
      },
      // 点击跳转 Aleo收益-metaverse
      onMetaVerseBtnClick() {
        // 如果未绑定上级邀请码,打开提示弹窗
        if (!this.isBindLeader) {
          this.$refs.alertDialog.open();
          return;
        }
        // 如果已绑定过上级邀请码,跳转到metaverse页面
        uni.navigateTo({
          url: "/pages/income/AleoIncome/inviteCustomersRecord",
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
      // 跳转到流通转入详情和兑换转出详情
      toDetails(types, order_number, time) {
        if (this.current == 0) {
          // 恢复触发"没有更多U数据"flag为false
          this.isNoMoreUData = false;
          // 触发跳转flag
          this.jumpU = true;
          // 跳转到流通转入详情
          if (types == "0") {
            uni.navigateTo({
              url: "/pages/income/AleoIncome/InvestmentDetails?order_number=" + order_number,
            });
            return;
          }
          // 跳转到兑换转出详情
          if (types == "1") {
            uni.navigateTo({
              url: "/pages/income/AleoIncome/exchangeOut?order_number=" + order_number,
            });
            return;
          }
        }
        if (this.current == 1) {
          // 恢复触发"没有更多G数据"flag为false
          this.isNoMoreGData = false;
          // 触发跳转flag
          this.jumpG = true;
          // 跳转到自主兑换详情
          if (types == "0") {
            uni.navigateTo({
              url: "/pages/income/AleoIncome/zizhuExchangeDetail?order_number=" + order_number,
            });
            return;
          }
          // 跳转到代人兑换详情
          if (types == "1") {
            uni.navigateTo({
              url: "/pages/income/AleoIncome/otherExchangeDetail?order_number=" + order_number,
            });
            return;
          }
        }
        if (this.current == 2) {
          // 恢复触发"没有更多Ao数据"flag为false
          this.isNoMoreAoData = false;
          // 触发跳转flag
          this.jumpAo = true;
          // 跳转到产出详情
          if (types == "0") {
            uni.navigateTo({
              url: "/pages/income/AleoIncome/outputDetails?outputTime=" + time,
            });
            return;
          }
        }
      },
    },
    // 上拉加载
    onReachBottom() {
      clearTimeout(this.loadU);
      clearTimeout(this.loadG);
      clearTimeout(this.loadAo);

      // 如果当前是U模块
      if (this.current == 0) {
        // 如果觸發過"沒有更多數據"狀態,不繼續執行
        if (this.isNoMoreUData) {
          return;
        }
        // 用户触发了上拉加载操作
        this.pullUFlag = true;
        console.log("this.pullUFlag", this.pullUFlag);
        // 初始化pageUSize
        this.pageUSize = 10;
        let _this = this;
        this.Ustatus = "loading";
        this.loadU = setTimeout(function () {
          if (_this.recordList.length < _this.totalLength) {
            // 计算最多多少页
            const maxPage = Math.floor(_this.totalLength / _this.pageUSize) + 1;

            if (_this.pageU < maxPage) {
              console.log("page自增");
              _this.pageU++;
              console.log(_this.pageU);
            }
            // 获取接口 用户的U流水列表
            uni.request({
              url: _this.host + "/app/rechargeAndExchangesList/" + _this.pageU + "/" + _this.pageUSize,
              method: "GET",
              header: {
                //token
                "x-token": _this.userToken,
                //version
                version: _this.version,
              },
              success: (res) => {
                // code!=0就是接口请求结果失败
                if (res.data.code != 0) {
                  return;
                }
                let sliceArr = [];
                // 把onload里读取到的pageUSize条投资信息都存入sliceArr
                sliceArr = res.data.data.list;
                sliceArr.forEach((obj, index) => {
                  obj.uid = _this.current + obj.orderNumber + index;
                  obj.recordType = _this.current;
                  obj.tradeTime = _this.dateChangeFormat("YYYY-mm-dd HH:MM:SS", obj.tradeTime);
                  _this.recordList.push(obj);
                });
              },
            });
            _this.Ustatus = "more";
          }

          if (_this.recordList.length >= _this.totalLength) {
            _this.Ustatus = "noMore";
            // 用戶已經觸發過一次"沒有更多數據"狀態U
            _this.isNoMoreUData = true;
            _this.loadUDivColor = "#9EA3BB";
          }
        }, 2000);
        return;
      }
      // 如果当前是G模块
      if (this.current == 1) {
        // 如果觸發過"沒有更多數據"狀態,不繼續執行
        if (this.isNoMoreGData) {
          return;
        }
        // 用户触发了上拉加载操作
        this.pullGFlag = true;
        // 初始化pageGSize
        this.pageGSize = 10;
        let _this = this;
        this.Gstatus = "loading";
        this.loadG = setTimeout(function () {
          if (_this.recordList.length < _this.totalLength) {
            // 计算最多多少页
            const maxPage = Math.floor(_this.totalLength / _this.pageGSize) + 1;

            if (_this.pageG < maxPage) {
              _this.pageG++;
            }
            // 获取接口 用户的U流水列表
            uni.request({
              url: _this.host + "/app/getExchangeList",
              method: "POST",
              header: {
                //token
                "x-token": _this.userToken,
                //version
                version: _this.version,
              },
              data: {
                page: _this.pageG,
                pageSize: _this.pageGSize,
              },
              success: (res) => {
                // code!=0就是接口请求结果失败
                if (res.data.code != 0) {
                  return;
                }

                let sliceArr = [];
                // 把onload里读取到的pageGSize条投资信息都存入sliceArr
                sliceArr = res.data.data.list;
                sliceArr.forEach((obj, index) => {
                  obj.uid = _this.current + obj.orderNumber + index;
                  obj.recordType = _this.current;
                  obj.tradeTime = _this.dateChangeFormat("YYYY-mm-dd HH:MM:SS", obj.tradeTime);
                  obj.types = parseInt(obj.exchangeType);
                  obj.status = 1;
                  obj.changeAmount = obj.changeAmount;
                  _this.recordList.push(obj);
                });
              },
            });
            _this.Gstatus = "more";
          }

          if (_this.recordList.length >= _this.totalLength) {
            _this.Gstatus = "noMore";
            // 用戶已經觸發過一次"沒有更多數據"狀態
            _this.isNoMoreGData = true;
            _this.loadGDivColor = "#9EA3BB";
          }
        }, 2000);
        return;
      }
      // 如果当前是Ao模块
      if (this.current == 2) {
        // 如果觸發過"沒有更多數據"狀態,不繼續執行
        if (this.isNoMoreAoData) {
          return;
        }
        // 用户触发了上拉加载操作
        this.pullAoFlag = true;
        // 初始化pageAoSize
        this.pageAoSize = 10;
        let _this = this;
        this.Aostatus = "loading";
        this.loadAo = setTimeout(function () {
          if (_this.recordList.length < _this.totalLength) {
            // 计算最多多少页
            const maxPage = Math.floor(_this.totalLength / _this.pageAoSize) + 1;

            if (_this.pageAo < maxPage) {
              _this.pageAo++;
            }
            // 获取接口 用户的U流水列表
            uni.request({
              url: _this.host + "/app/integralList",
              method: "GET",
              header: {
                //token
                "x-token": _this.userToken,
                //version
                version: _this.version,
              },
              data: {
                page: _this.pageAo,
                pageSize: _this.pageAoSize,
              },
              success: (res) => {
                // code!=0就是接口请求结果失败
                if (res.data.code != 0) {
                  return;
                }

                let sliceArr = [];
                // 把onload里读取到的pageAoSize条投资信息都存入sliceArr
                sliceArr = res.data.data.list;
                sliceArr.forEach((obj, index) => {
                  obj.uid = _this.current + obj.orderNumber + index;
                  obj.recordType = _this.current;
                  obj.textTime = obj.settlementDate.split("-").join(".");
                  obj.tradeTime = _this.dateChangeFormat("YYYY-mm-dd HH:MM:SS", obj.createdAt);
                  obj.changeAmount = obj.totalIntegral;
                  obj.types = 0;
                  obj.status = 1;
                  _this.recordList.push(obj);
                });
              },
            });
            _this.Aostatus = "more";
          }

          if (_this.recordList.length >= _this.totalLength) {
            _this.Aostatus = "noMore";
            // 用戶已經觸發過一次"沒有更多數據"狀態
            _this.isNoMoreAoData = true;
            _this.loadAoDivColor = "#9EA3BB";
          }
        }, 2000);
        return;
      }
    },
  };
</script>

<style lang="less">
  .status_bar {
    height: var(--status-bar-height);
    width: 100%;
  }
</style>

<style lang="less" scoped>
  .box-bg {
    z-index: 999;
    position: relative;
    .title {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 90rpx;
      padding-top: var(--status-bar-height);
      z-index: 999;
      background-color: transparent;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .leftIcon {
        display: flex;
        align-items: center;
        margin-left: 48rpx;
        margin-top: 14rpx;
        margin-bottom: 14rpx;
        .uni-nav-bar-text {
          margin-right: 12rpx;
          font-size: 40rpx;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 500;
          color: #000000;
        }
        // 小三角
        image {
          width: 34rpx;
          height: 34rpx;
        }
      }
      .rightIcon {
        margin-right: 34rpx;
        text {
          font-size: 30rpx;
          font-family: PingFang-SC-Medium, PingFang-SC;
          font-weight: 500;
          color: #2e334e;
        }
      }
    }
  }

  // 分段器卡片选项css
  /deep/ .uni-segmented-control {
    margin-top: 50rpx;
    .segmented-control {
      margin-left: 25rpx;
      .segmented-control__item {
        position: relative;
        z-index: 10;
        margin-right: 40rpx;
        width: 170rpx;
        height: 70rpx;
        background-color: #f1f3f5;
        border-radius: 35rpx;
        flex: none;
        .segmented-control__text {
          display: flex;
          align-items: center;
          font-size: 34rpx;
          color: #767d8f;
          line-height: 51rpx;
          font-weight: 500;
          font-family: SourceHanSansCN-Medium, SourceHanSansCN;
        }
      }
      // U
      .segmented-control__item:first-of-type {
        .segmented-control__text::before {
          content: "";
          background-image: url("@/static/images/income/Aleo/UGAodiv/uIcon.png");
          background-size: cover;
          display: block;
          margin-right: 8rpx;
          width: 50rpx;
          height: 50rpx;
        }
      }
      // U-selected
      .segmented-control__item:first-of-type {
        .segmented-control__item--text::before {
          content: "";
          background-image: url("@/static/images/income/Aleo/UGAodiv/uIconSelected.png");
          background-size: cover;
          display: block;
          width: 50rpx;
          height: 50rpx;
        }
        .segmented-control__item--text::after {
          content: "";
          position: absolute;
          z-index: -10;
          left: 0;
          display: block;
          background-color: aqua;
          width: 170rpx;
          height: 70rpx;
          background-color: #009bf9;
          border-radius: 35rpx;
        }
      }
      // G
      .segmented-control__item:nth-of-type(2) {
        .segmented-control__text::before {
          content: "";
          background-image: url("@/static/images/income/Aleo/UGAodiv/gIcon.png");
          background-size: cover;
          display: block;
          width: 50rpx;
          height: 50rpx;
          margin-right: 8rpx;
        }
      }
      // G-selected
      .segmented-control__item:nth-of-type(2) {
        .segmented-control__item--text::before {
          content: "";
          background-image: url("@/static/images/income/Aleo/UGAodiv/gIconSelected.png");
          background-size: cover;
          display: block;
          width: 50rpx;
          height: 50rpx;
        }
        .segmented-control__item--text::after {
          content: "";
          position: absolute;
          z-index: -10;
          left: 0;
          display: block;
          background-color: aqua;
          width: 170rpx;
          height: 70rpx;
          background-color: #009bf9;
          border-radius: 35rpx;
        }
      }
      // Ao
      .segmented-control__item:last-of-type {
        .segmented-control__text::before {
          content: "";
          background-image: url("@/static/images/income/Aleo/UGAodiv/aoIcon.png");
          background-size: cover;
          display: block;
          width: 50rpx;
          height: 50rpx;
          margin-right: 8rpx;
        }
      }
      // Ao-selected
      .segmented-control__item:last-of-type {
        .segmented-control__item--text::before {
          content: "";
          background-image: url("@/static/images/income/Aleo/UGAodiv/aoIconSelected.png");
          background-size: cover;
          display: block;
          width: 50rpx;
          height: 50rpx;
        }
        .segmented-control__item--text::after {
          content: "";
          position: absolute;
          z-index: -10;
          left: 0;
          display: block;
          background-color: aqua;
          width: 170rpx;
          height: 70rpx;
          background-color: #009bf9;
          border-radius: 35rpx;
        }
      }
    }
  }

  // Udiv,Gdiv,Aodiv
  .segmented-content {
    margin-top: 37rpx;
    position: relative;
    z-index: 30;
    display: flex;
    justify-content: center;
    align-items: center;
    // 阴影
    .shadow {
      position: absolute;
      z-index: -999;
      top: 415rpx;
      width: 600rpx;
      height: 70rpx;
      background: #dce5ef;
      filter: blur(22rpx);
    }
  }

  // 变动流水
  .variable-flow-list {
    margin-top: 70rpx;
    .title {
      margin-bottom: 19rpx;

      display: block;
      margin-left: 40rpx;
      font-size: 38rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #2e334e;
      line-height: 53rpx;
    }
  }

  // 暂无数据图片
  .nodata {
    margin-top: 118rpx;
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

  // 左侧侧边栏整体
  .left-aside {
    .left-aside-title {
      width: 220rpx;
      height: 62rpx;
      font-size: 44rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #2e334e;
      line-height: 62rpx;
      margin-top: 83rpx;
      margin-left: 42rpx;
      margin-bottom: 55rpx;
      white-space: nowrap;
    }
    .list-item {
      padding: 15rpx 0;
      font-size: 34rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #2e334e;
    }
  }
</style>
