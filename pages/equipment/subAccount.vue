<template>
  <view class="subAccount">
    <view class="status_bar">
      <!-- 这里是占位状态栏 -->
    </view>
    <view class="bg"></view>
    <view class="bg1"></view>
    <!-- 导航栏部分 -->
    <view class="box-bg">
      <view class="title navBg" :style="topNavStyle.style"></view>
      <view class="title">
        <view class="left-nav" @click="showDrawer('showLeft')">
          <view>
            <text class="uni-nav-bar-text">{{ subAccountName }}</text>
          </view>
        </view>
        <view class="city">
          <uni-icons
            type="plusempty"
            color="#ffffff"
            size="24"
            @click="onAddEquipmentClick"
          />
          <image
            :src="isImgChange"
            @click="equip1divShow = !equip1divShow"
          ></image>
        </view>
      </view>
    </view>

    <!-- 左侧侧边栏 -->
    <view class="left-aside">
      <uni-drawer
        ref="showLeft"
        mode="left"
        :width="260"
        @change="change($event, 'showLeft')"
      >
        <view class="close">
          <view class="left-aside-title">{{$t('ETH.Equipment.SubAccount.aside-title')}}</view>
          <uni-list :border="false">
            <uni-list-item
              :border="false"
              clickable
              v-for="(sub, index) in subData"
              :key="index"
              @click="onClick(index)"
            >
              <template v-slot:body>
                <text class="list-item">{{ sub.subAccountName }}</text>
              </template>
            </uni-list-item>
          </uni-list>
        </view>
      </uni-drawer>
    </view>

    <view class="nowHashRate">
      <text>设备实时总算力(MH/s)</text>
      <!-- 这里放个插件 -->
      <view class="number">
        <fontface-num color="#009bf9" :value="totalhashRate"></fontface-num>
      </view>
    </view>

    <!-- 设备详细信息模块 -->
    <view
      v-for="(info, index) in equipData"
      :key="index"
      style="padding-bottom: 24rpx;"
      class="equipDiv"
    >
      <view class="equip6Div">
        <equipment6div
          :subEquipmentInfo="info"
          :subIndex="index"
          :subAccountId="subAccountId"
          v-show="!equip1divShow"
          :key="equip1divShow"
        ></equipment6div>
      </view>
      <view class="equip1Div">
        <equipment1div
          :subEquipmentInfo="info"
          :subIndex="index"
          :subAccountId="subAccountId"
          v-show="equip1divShow"
          :key="equip1divShow"
        ></equipment1div>
      </view>
    </view>

    <!-- 加载更多组件 -->
    <view>
      <uni-load-more iconType="circle" :status="status" color="#007AFF" />
    </view>

    <!-- 弹窗 -->
    <uni-popup ref="popup" :is-mask-click="false" type="center">
      <view class="addPop">
        <view class="addPop-img">
          <image src="../../static/images/equipment/hada1bg.png"></image>
        </view>
        <view class="addPop-title">
          <p>添加设备</p>
          <text>您还未添加设备，请立即添加设备获取收益</text>
        </view>
        <view class="addPop-Btn">
          <button @click="onAddEquipmentClick" type="default">
            <text>立即添加</text>
          </button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import fontfaceNum from "@/components/fontface-num/fontface-num.vue";
import equipment6div from "@/components/ETH/equipment/equipment6div.vue";
import equipment1div from "@/components/ETH/equipment/equipment1div.vue";
export default {
  components: {
    fontfaceNum,
    equipment6div,
    equipment1div,
  },
  onLoad(option) {
    try {
      const value = uni.getStorageSync("token");
      if (value) {
        // 获取token
        this.userToken = value;
      }
    } catch (e) {
      // error
    }
    // 获取从设备主页面传递来的子账户id
    this.subAccountId = option.subAccountId;

    // 获取从设备主页面传递来的子账户name
    this.subAccountName = option.subAccountName;

    // 获取接口 用户拥有的子账户信息
    this.getUserProductTotalInfo();
  },
  onShow() {
    // 启动定时器
    setTimeout(() => {
      this.startMyTimer();
    }, 1000);
    // 每次onShow的时候重新请求一下接口数据,变更每个设备的算力数值
    this.getEquipmentTotalInfo();
  },
  data() {
    return {
      timer1: null,
      showRight: false,
      showLeft: false,
      totalhashRate: 0,
      userToken: "",
      // 装 所有 子账户的所有设备的详细信息
      equipData: [],
      // 装 单个 子账户的所有设备的详细信息
      subEquipData: [],
      // 装用户拥有的子账户id,name,子账户实时算力的信息
      subData: [],
      // 接设备主页面传来的子账户id
      subAccountId: null,
      // 接设备主页面传来的子账户name
      subAccountName: null,
      // 接 用户拥有的子账户接口获取到的内容
      productData: [],
      // 页面滚动距离
      pageScrollTop: 0,
      // 底部上拉加载状态栏状态
      status: "more",
      // 当前page
      page: 1,
      // 当前每页的size
      pageSize: 6,
      // 子账户里总共有多少条数据
      totalLength: null,
      // equipment1div是否显示
      equip1divShow: false,
      // 子账号里没设备的时候弹窗是否显示
      popWindow: false,
      // 标识用户有没有进行过上拉加载操作
      pullFlag: false,
      // 存储上拉加载了page次后有多少条
      pullPageSize: 6,
    };
  },
  computed: {
    topNavStyle() {
      let r = this.pageScrollTop / 20;
      return {
        style: `opacity: ${r >= 1 ? 1 : r};`,
        class: `title ${r >= 1 ? "navBg" : ""}`,
      };
    },
	// 右上角切换按钮是否被点击,若点击则切换图标
	isImgChange(){
		if(!this.equip1divShow){
			return "../../static/images/equipment/subEquipment/changeBefore.png"
		}
		if(this.equip1divShow){
			return "../../static/images/equipment/subEquipment/changeAfter.png"
		}
	}
  },
  // 页面滚动监听
  onPageScroll(e) {
    this.pageScrollTop = Math.floor(e.scrollTop);
  },
  methods: {
    // 左侧侧边栏点击跳转
    onClick(index) {
      uni.navigateTo({
        url:
          "../equipment/subAccount" +
          `?subAccountId=${this.productData[index].SubaccountId}` +
          `&subAccountName=${this.productData[index].SubaccountName}`,
        success(res) {
        },
        fail(res) {
        },
      });
    },
    startMyTimer() {
      if (this.timer1 == null) {
        this.timer1 = setInterval(() => {
          // 获取接口总哈希信息
          this.getHashTotalInfo();
        }, 1000);
      }
    },
    stopMyTimer() {
      if (this.timer1 != null) {
        clearInterval(this.timer1);
        this.timer1 = null;
      }
    },
    // 获取接口 用户拥有的产品(子账户)信息【设置productData】
    getUserProductTotalInfo() {
      uni.request({
        url: this.host + "/app/user/product/list",
        method: "GET",
        header: {
          "x-token": this.userToken,
        },
        success: (res) => {
          if (res.data.code != 0) {
            return;
          }

          if (res.data.data == null) {
            return;
          }
          this.productData = res.data.data;
          // 遍历用户拥有的子账户信息,把他们存到subData并初始化
          for (let i = 0; i < this.productData.length; i++) {
            this.subData.push({
              // 接口里获取到的子账户id
              subAccountId: this.productData[i].SubaccountId,
              // 接口里获取到的子账户名称
              subAccountName: this.productData[i].SubaccountName,
              // 子账户实时算力  数据为null时初始化为0
              subNowHashRate: 0,
            });
          }
          // 获取接口总哈希信息
          this.getHashTotalInfo();
          // 获取接口 子产品下的设备详细信息
          this.getEquipmentTotalInfo();
        },
      });
    },
    // 获取接口 总实时算力信息
    getHashTotalInfo() {
      uni.request({
        url: this.host + "/app/hash/user",
        method: "GET",
        header: {
          "x-token": this.userToken,
        },
        success: (res) => {
          if (res.data.code != 0) {
            return;
          }
          if (res.data.data == null) {
            // 遍历用户拥有的子账户信息
            for (let i = 0; i < this.subData.length; i++) {
              for (let i = 0; i < this.subData.length; i++) {
                this.subData[i].subNowHashRate = 0;
              }
            }
            return;
          }
          // 公式
          let formula = 1000 * 1000;

          // 定义subRateMap来存储每个子账户的实时算力
          const subRateMap = new Map();

          res.data.data.forEach((data) => {
            // 把子账户id(productCode)作为key,把data(res.data.data是数组对象,data是对象)作为value
            // 如果data.ProductCode等于onload里读取到的subAccountId
            if (data.ProductCode == this.subAccountId) {
              subRateMap.set(data.ProductCode, data);
            }
          });

          // 遍历用户拥有的子账户信息
          for (let i = 0; i < this.subData.length; i++) {
            // 如果map里有这个子账户id
            if (subRateMap.has(this.subData[i].subAccountId.toString())) {
              // 按公式计算出每个子账户的实时算力结果
              let nowHashRate = (
                parseFloat(
                  subRateMap.get(this.subData[i].subAccountId.toString())
                    .HashRate
                ) / formula
              ).toFixed(2);

              this.$set(this.subData[i], "subNowHashRate", nowHashRate);
            }
          }

          this.subData.forEach((sub) => {
            // 如果subData里的subAccountId等于从onload里获取到的id
            if (sub.subAccountId == this.subAccountId) {
              const subHashRate = subRateMap.get(sub.subAccountId.toString());
              // 因为子账号没算力的时候获取不到对应的data[即:假设有两个子账号,一个没算力一个有算力,那么data只返回一个对象而不是返回两个对象其中一个对象为null]
              // 所以需要判断,如果subHashRate为undefined,那么说明某子账号目前没算力,则totalhashRate为0
              if (subHashRate == undefined) {
                this.totalhashRate = 0;
              } else {
                this.totalhashRate = parseInt(subHashRate.HashRate / formula);
              }
            }
          });
        },
      });
    },
    // 获取接口 子产品下的设备详细信息 [获取用户设备在线及部件状态]
    getEquipmentTotalInfo() {
      // 如果用户没有触发过上拉加载操作
      if (!this.pullFlag) {
        // 初始化page
        this.page = 1;
        // 初始化pageSize
        this.pageSize = 6;
        uni.request({
          url: this.host + "/app/machine/status/list",
          // url: "http://192.168.3.33:8887" + "/app/machine/status/list",
          method: "GET",
          data: {
            SubaccountId: this.subAccountId,
            page: this.page,
            pageSize: this.pageSize,
          },
          header: {
            //token
            "x-token": this.userToken,
          },
          success: (res) => {
            // code!=0就是接口请求结果失败
            if (res.data.code != 0) {
              return;
            }
            // -------------------2022.7.21换接口了-------------------------------
            // 把onload里读取到的子账户下的pageSize条设备信息都存入equipData
            this.equipData = res.data.data.list;
            // 子账户里总共有多少条数据
            this.totalLength = res.data.data.total;
            if (this.totalLength == 0) {
              // 这个子账号里面没有设备,弹窗
              this.popWindow = true;
              this.$refs.popup.open("center");
            } else {
              this.popWindow = false;
              this.$refs.popup.close();
            }
          },
        });
      }

      // 如果用户触发了上拉加载操作
      if (this.pullFlag) {
        // 获得用户触发上拉加载后,只有1页时pageSize应该为几
        this.pageSize *= this.page;
        // 初始化page
        this.page = 1;
        uni.request({
          url: this.host + "/app/machine/status/list",
          // url: "http://192.168.3.33:8887" + "/app/machine/status/list",
          method: "GET",
          data: {
            SubaccountId: this.subAccountId,
            page: this.page,
            pageSize: this.pageSize,
          },
          header: {
            //token
            "x-token": this.userToken,
          },
          success: (res) => {
            // code!=0就是接口请求结果失败
            if (res.data.code != 0) {
              return;
            }
            // -------------------2022.7.21换接口了-------------------------------
            // 把onload里读取到的子账户下的pageSize条设备信息都存入equipData
            this.equipData = res.data.data.list;
            // 子账户里总共有多少条数据
            this.totalLength = res.data.data.total;
            if (this.totalLength == 0) {
              // 这个子账号里面没有设备,弹窗
              this.popWindow = true;
              this.$refs.popup.open("center");
            } else {
              this.popWindow = false;
              this.$refs.popup.close();
            }
          },
        });
      }
    },
    // 点击跳转绑定设备页面
    onAddEquipmentClick() {
      uni.navigateTo({
        url: "../equipment/bindEquipment",
        success(res) {
        },
        fail(res) {
        },
      });
    },
    // 打开窗口
    showDrawer(e) {
      this.$refs[e].open();
    },
    // 关闭窗口
    closeDrawer(e) {
      this.$refs[e].close();
    },
    // 抽屉状态发生变化触发
    change(e, type) {
      this[type] = e;
    },
  },
  // 上拉加载
  onReachBottom() {
    // 用户触发了上拉加载操作
    this.pullFlag = true;
    // 初始化pageSize
    this.pageSize = 6;
    let _this = this;
    this.status = "loading";
    //在当前页面显示导航条加载动画。
    // uni.showNavigationBarLoading()
    setTimeout(function () {
      if (_this.equipData.length < _this.totalLength) {
        // 计算最多多少页
        const maxPage = Math.floor(_this.totalLength / _this.pageSize) + 1;

        if (_this.page < maxPage) {
          _this.page++;
        }
        // 获取接口 子产品下的设备详细信息 [获取用户设备在线及部件状态]
        uni.request({
          url: _this.host + "/app/machine/status/list",
          // url: "http://192.168.3.33:8887" + "/app/machine/status/list",
          method: "GET",
          data: {
            SubaccountId: _this.subAccountId,
            page: _this.page,
            pageSize: _this.pageSize,
          },
          header: {
            //token
            "x-token": _this.userToken,
          },
          success: (res) => {
            // code!=0就是接口请求结果失败
            if (res.data.code != 0) {
              return;
            }

            let sliceArr = [];
            // 把onload里读取到的子账户下的pageSize条设备信息都存入sliceArr
            sliceArr = res.data.data.list;

            sliceArr.forEach((obj) => {
              _this.equipData.push(obj);
            });
          },
        });
        _this.status = "more";
      }

      if (_this.equipData.length >= _this.totalLength) {
        _this.status = "noMore";
        let height = null;
        let screenHeight = uni.getSystemInfoSync().screenHeight;
        uni
          .createSelectorQuery()
          .in(_this)
          .select(".subAccount")
          .boundingClientRect((data) => {
            // 这里+4是测出来的,但是为什么???
            height = data.height - (screenHeight + 4);
            uni.pageScrollTo({
              scrollTop: height,
              duration: 200,
            });
          })
          .exec();
      }
      //在当前页面隐藏导航条加载动画。
      // uni.hideNavigationBarLoading()
    }, 2000);
  },
  // app端拦截返回事件 ，仅app端生效
  onBackPress() {
    if (this.showRight || this.showLeft) {
      this.$refs.showLeft.close();
      this.$refs.showRight.close();
      return true;
    }
  },
  onHide() {
    this.stopMyTimer();
  },
};
</script>

<style>
page {
  position: absolute;
  /* z-index: -999; */
  background-color: #f3f5f7;
}
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
}
</style>

<style lang="less" scoped>
	@import "@/static/css/MainColor.less";
// 添加设备弹窗css
.addPop {
  width: 640rpx;
  height: 698rpx;
  background-color: #ffffff;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  .addPop-img {
    padding-top: 24rpx;
    image {
      width: 592rpx;
      height: 352rpx;
    }
  }
  .addPop-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    //添加设备
    p {
      margin-top: 24rpx;
      font-size: 42rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #2e334e;
    }
    // 您还未xx
    text {
      margin-top: 24rpx;
      margin-bottom: 36rpx;
      font-size: 28rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #9ea3bb;
    }
  }
  .addPop-Btn {
    button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 576rpx;
      height: 90rpx;
      // background-color: #009bf9;
      background-color: @main-color;
      border-radius: 100rpx;
    }

    text {
      font-size: 32rpx;
      font-family: AlibabaPuHuiTiM;
      color: #ffffff;
    }
  }
}

// 背景图片
.bg {
  z-index: -10;
  position: absolute;
  top: -2rpx;
  width: 750rpx;
  height: 634rpx;
  background-image: url("@/static/images/equipment/subEquipment/bg.png");
  background-repeat: no-repeat;
  background-size: cover;
}
.bg1 {
  z-index: -1;
  position: absolute;
  top: 524rpx;
  width: 750rpx;
  height: 243rpx;
  background: linear-gradient(180deg, #9ec8ee 0%, #f3f5f7 100%);
}
// 导航栏css
.box-bg {
  position: relative;
  .navBg {
    background-image: url("@/static/images/equipment/subEquipment/navBg.png");
    background-size: 756rpx 177rpx;
    background-repeat: no-repeat;
    background-position-x: -4rpx;
  }
  .title {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 90rpx;
    padding-top: var(--status-bar-height);
    z-index: 10;
    background-color: transparent;
    // color: rgba(255,255,255,0.8);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    // background-position: left -4rpx;

    .left-nav {
      .uni-nav-bar-text {
        font-size: 40rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #ffffff;
        margin-left: 48rpx;
        // padding-top: 14rpx;
      }
    }
    // 右上角加号
    .city {
      margin-right: 44rpx;
      margin-top: 12rpx;
      display: flex;
      flex-direction: row;
      align-items: center;
      text {
        margin-right: 40rpx;
      }
      image {
        width: 44rpx;
        height: 44rpx;
      }
    }
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
    // width: 170px;
    // height: 48px;
    font-size: 34rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #2e334e;
    // line-height: 48rpx;
  }
}

// 动态数字展示css
.nowHashRate {
  display: flex;
  flex-direction: column;
  width: 702rpx;
  height: 235rpx;
  // margin: 42rpx 24rpx 24rpx;
  margin: 122rpx 24rpx 24rpx;
  // border: 4rpx solid #f2f2f2;
  border-radius: 12rpx;
  background-image: url("@/static/images/equipment/subEquipment/smallbg.png");
  background-repeat: no-repeat;
  background-size: 100%;
  // 小标题
  text {
    height: 40rpx;
    font-size: 28rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #f3f3f3;
    line-height: 40rpx;
    margin-left: 24rpx;
    margin-top: 32rpx;
  }
  // 动态数字组件的css
  .number {
    // width: 100%;
    // height: 300rpx;
  }
}

// equip6div和equip1div
.equipDiv {
  position: relative;
  .equip6Div {
  }
  .equip1Div {
    // position: absolute;top: 0;left: 0;
  }
}
</style>
