<template>
  <view>
    <view class="status_bar">
      <!-- 这里是占位状态栏 -->
    </view>
    <view class="box-bg">
      <view class="title" :style="topNavStyle.style">
        <view class="leftIcon">
          <text class="uni-nav-bar-text">{{$t('ETH.Equipment.Index.topTabbar-title')}}</text>
          <image src="@/static/images/equipment/triangle.png"></image>
        </view>
        <view class="rightIcon" @click.stop="showList">
          <uni-icons type="plusempty" color="#000000" size="24" />
        </view>
      </view>

      <!-- 这里是弹出来的下拉筛选框 -->
      <view class="arrivalNavigation" v-if="ShowHidden">
        <view class="d4"></view>
        <view class="sideNavigation">
          <nav>
            <ul>
              <li class="zhanwei"></li>
              <navigator url="/pages/equipment/inputBindInfo">
                <li>
                  <image
                    src="@/static/images/equipment/inputCode.png"
                  ></image
                  >
				  {{$t('Equipment.Menu.input-equipment-code')}}
                </li>
              </navigator>
              <view class="liBottomBorder"></view>
              <navigator
                url="/pages/plusScan/index?text=undefined&type=undefined"
                ><li>
                  <image src="@/static/images/equipment/scan.png"></image
                  >
				  {{$t('Equipment.Menu.scan-to-add')}}
                </li></navigator
              >
            </ul>
          </nav>
        </view>
      </view>

      <!-- 遮罩层 -->
      <!-- 可以设置这个禁止滚动@touchmove.stop.prevent="stopRoll" -->
      <view
        class="shadow"
        @click="showList"
        @touchmove.stop.prevent="stopRoll"
        v-if="ShowHidden"
        :style="{ height: screenHeight + 'px' }"
      ></view>
    </view>

    <!-- 总体算力 -->
    <view class="bg">
      <view class="hashRateContent">
        <view class="box1">
          <view>
            <p class="subTitle">
              <image src="@/static/images/equipment/dot.png"></image>
              {{$t('Equipment.Menu.equipSubAccount.24h-hashrate')}}
            </p>
            <text class="subTitle1"
              >{{ HashRate24Int }}.
              <p>{{ HashRate24Float }}</p>
              <p>MH/s</p>
            </text>
          </view>
        </view>
        <view class="box2">
          <view>
            <p class="subTitle">
              <image src="@/static/images/equipment/dot.png"></image>
              {{$t('Equipment.Menu.equipSubAccount.real-time-hashrate')}}
            </p>
            <text class="subTitle1"
              >{{ nowHashRateInt }}.
              <p>{{ nowHashRateFloat }}</p>
              <p>MH/s</p>
            </text>
          </view>
        </view>
        <view class="box3">
          <p class="subTitle">{{$t('Equipment.Menu.trend-chart-of-hashrate')}}</p>
          <view>
            <l-echart ref="chart" class="echarts"></l-echart>
          </view>
        </view>

        <view class="box4">
          <view>
            <text>{{ totalEquipmentState.totalNum }}</text>
            <p class="subTitle">{{$t('Equipment.Menu.total-number-of-binding-equipment')}}</p>
          </view>
        </view>

        <view class="split">
          <view class="split-line1"></view>
        </view>

        <view class="box5">
          <l-echart ref="chartOnline" class="echarts"></l-echart>
          <p class="subTitle">{{$t('Equipment.Menu.number-of-online-devices')}}</p>
        </view>
        <view class="split">
          <view class="split-line2"></view>
        </view>

        <view class="box6">
          <l-echart ref="chartOffline" class="echarts"></l-echart>
          <p class="subTitle">{{$t('Equipment.Menu.number-of-offline-devices')}}</p>
        </view>
      </view>
    </view>

    <!-- 子账户组件 -->
    <view v-if="isGetData == true">
      <equipmentSubAccount
        :url="url"
        :subdata="subData"
        :productData="productData"
        :refreshFlag="refreshFlag"
      ></equipmentSubAccount>
    </view>

    <!-- 弹窗 -->
    <uni-popup ref="popup" :is-mask-click="false" type="center">
      <view class="addPop">
        <view class="addPop-img">
          <image src="@/static/images/equipment/hada1bg.png"></image>
        </view>
        <view class="addPop-title">
          <p>{{$t('Equipment.Menu.ETH.add-pop-title')}}</p>
          <text>{{$t('Equipment.Menu.ETH.add-pop-content')}}</text>
        </view>
        <view class="addPop-Btn">
          <button @click="onAddEquipmentClick" type="default">
            <text>{{$t('Equipment.Menu.ETH.add-pop-btn')}}</text>
          </button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import * as echarts from "echarts";
import equipmentSubAccount from "@/components/ETH/equipment/equipmentSubAccount.vue";
export default {
  components: {
    equipmentSubAccount,
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
    // 获取屏幕高度
    // 获取可使用窗口的高度使用windowHeight关键字
    this.screenHeight = uni.getSystemInfoSync().screenHeight;
  },
  onShow() {
    // 获取接口 用户拥有的产品信息
    this.getUserProductTotalInfo();
    // 启动定时器
    setTimeout(() => {
      this.startMyTimer();
    }, 2000);
  },
  data() {
    return {
      // 主动刷新子组件
      refreshFlag: 0,
      // 记录屏幕高度
      screenHeight: null,
      // 是否显示右上角下拉筛选框
      ShowHidden: false,
      // 记录页面滚动距离
      pageScrollTop: "",
      timer1: null,
      timer2: null,
      // 判断父组件是否获取到数据
      isGetData: false,
      // 判断是否需要显示“请先绑定设备”
      showPop: false,
      // 顶部蓝色区域数据
      nowHashRate: "0",
      nowHashRateInt: "0",
      nowHashRateFloat: "00",
      HashRate24: "0",
      HashRate24Int: "0",
      HashRate24Float: "00",
      // token
      userToken: "",
      url: "../equipment/subAccount",
      // 用户拥有的产品信息
      productData: [],
      // 设备在线、离线信息【按子产品分】
      equipmentData: [],
      totalEquipmentState: {
        totalNum: "0",
        onlineNum: "0",
        offlineNum: "0",
      },
      subData: [],
      echartsData: [],
      echartsDate: [],
    };
  },
  computed: {
    topNavStyle() {
      let r = this.pageScrollTop / 50;
      return {
        style: `background-color: rgba(255, 255, 255,${r >= 1 ? 1 : r});`,
      };
    },
  },
  onPageScroll(e) {
    // 页面滚动监听
    this.pageScrollTop = Math.floor(e.scrollTop);
  },
  methods: {
    // 禁止滚动的函数,为空也起效
    stopRoll() {},
    // 控制是否显示右上角下拉筛选框
    showList() {
      this.ShowHidden = !this.ShowHidden;
    },
    // 点击页面事件 隐藏右上角加号部分
    HiddenClick() {
      this.ShowHidden = false;
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
              subaccountId: this.productData[i].SubaccountId,
              // 接口里获取到的子账户名称
              subaccountName: this.productData[i].SubaccountName,
              // 数据为null时初始化用的数据
              HashRate: "0",
              HashRateInt: "0",
              HashRateFloat: "00",
              HashRate24: "0",
              HashRate24Int: "0",
              HashRate24Float: "00",
              online: "0",
              offline: "0",
              total: "0",
            });
          }
          // 获取接口 用户拥有的设备在线情况信息【接口TODO：只要在线离线】
          this.getUserEquipmentTotalInfo();
          // 获取接口 实时算力
          this.getHashTotalInfo();
          // 获取接口 24h算力信息
          this.getHash24Info();
        },
      });
    },
    // 获取接口 用户拥有的设备在线情况信息 【设置equipmentData】
    getUserEquipmentTotalInfo() {
      uni.request({
        url: this.host + "/app/machine/online",
        method: "GET",
        header: {
          "x-token": this.userToken,
        },
        success: (res) => {
          // code!=0就是接口请求结果失败
          if (res.data.code != 0) {
            return;
          }
          if (res.data.data == null) {
            for (let i = 0; i < this.subData.length; i++) {
              this.subData[i].subTotal = 0;
              this.subData[i].subOnline = 0;
              this.subData[i].subOffline = 0;
            }
            // 顶部蓝色区域的设备绑定总数为0
            this.totalEquipmentState.totalNum = 0;
            // 显示添加设备弹窗
            this.showPop = true;

            return;
          }
          // 把所有子账户设备信息都存入equipmentData
          this.equipmentData = res.data.data;
          // 顶部蓝色区域的设备绑定总数为equipmentData.length
          this.totalEquipmentState.totalNum = this.equipmentData.length;

          // 不显示添加设备弹窗
          this.showPop = false;

          let total = 0;
          let online = 0;
          let offline = 0;
          let subTotal = 0;
          let subOnline = 0;
          let subOffline = 0;

          // 定义machineMap用来存储子账户下的设备在线离线数量
          const machineMap = new Map();
          // 遍历所有子账户设备的在线离线信息
          this.equipmentData.forEach((data, index) => {
            let obj = {
              subTotal: 0,
              subOnline: 0,
              subOffline: 0,
            };
            // 如果map里有子账户id,把空obj存进去
            if (machineMap.has(data.SubaccountId)) {
              obj = machineMap.get(data.SubaccountId);
            } else {
              // 如果没有,子账户id为key,obj为value存进map
              machineMap.set(data.SubaccountId, obj);
            }
            // 此时map的长度就是用户拥有的子账户的个数

            obj.subTotal = obj.subTotal + 1;

            subTotal++;

            // 0离线1在线
            if (data.IfOnline) {
              obj.subOnline = obj.subOnline + 1;
            }
            if (!data.IfOnline) {
              obj.subOffline = obj.subOffline + 1;
            }

            // 获取完数据后再渲染子组件
            this.isGetData = true;

            // 计算设备首页顶部蓝色区域的绑定设备数量
            // 0离线1在线
            if (data.IfOnline) {
              online++;
            }
            if (!data.IfOnline) {
              offline++;
            }
            // 顶部蓝色区域的设备绑定在线数
            this.totalEquipmentState.onlineNum = online;
            // 顶部蓝色区域的设备绑定离线数
            this.totalEquipmentState.offlineNum = offline;
          });

          // 遍历subData拿到用户拥有的子账户初始化信息
          for (let i = 0; i < this.subData.length; i++) {
            // 如果map里有subData里的子账户id
            if (machineMap.has(this.subData[i].subaccountId.toString())) {
              // 获取到obj存进temp
              let temp = machineMap.get(
                this.subData[i].subaccountId.toString()
              );
              this.subData[i].subTotal = temp.subTotal;
              this.subData[i].subOnline = temp.subOnline;
              this.subData[i].subOffline = temp.subOffline;
            } else {
              // 如果map里没有subData里的子账户id,全部置0    {实际上应该不会出现这种情况吧???}
              this.subData[i].subTotal = 0;
              this.subData[i].subOnline = 0;
              this.subData[i].subOffline = 0;
            }
          }

          // 判断showPop是否为true
          if (this.showPop) {
            this.$refs.popup.open("center");
          }
          if (!this.showPop) {
            this.$refs.popup.close();
          }
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
              this.$set(this.subData[i], "HashRateInt", "0");
              this.$set(this.subData[i], "HashRateFloat", "00");
            }
            this.nowHashRateInt = "0";
            this.nowHashRateFloat = "00";
            return;
          }

          // 总实时算力 byte
          let hashRate = 0;
          // 公式
          let formula = 1000 * 1000;

          // 定义subRateMap来存储每个子账户的实时算力
          const subRateMap = new Map();

          res.data.data.forEach((data) => {
            // 把子账户id(productCode)作为key,把data(res.data.data是数组对象,data是对象)作为value
            subRateMap.set(data.ProductCode, data);

            hashRate += parseFloat(data.HashRate);
            // 计算出总实时算力
            this.nowHashRate = (hashRate / formula).toFixed(2);
            // 按整数和小数分开
            this.nowHashRate = this.nowHashRate.split(".");
            this.nowHashRateInt = this.nowHashRate[0];
            this.nowHashRateFloat = this.nowHashRate[1];
          });

          // 遍历用户拥有的子账户信息
          for (let i = 0; i < this.subData.length; i++) {
            // 如果map里有这个子账户id
            if (subRateMap.has(this.subData[i].subaccountId.toString())) {
              // 按公式计算出每个子账户的实时算力结果
              let nowHashRate = (
                parseFloat(
                  subRateMap.get(this.subData[i].subaccountId.toString())
                    .HashRate
                ) / formula
              ).toFixed(2);
              // 按整数和小数分开
              const hashRateArr = nowHashRate.split(".");
              this.$set(this.subData[i], "HashRate", nowHashRate);
              this.$set(this.subData[i], "HashRateInt", hashRateArr[0]);
              this.$set(this.subData[i], "HashRateFloat", hashRateArr[1]);
            } else {
              this.$set(this.subData[i], "HashRateInt", "0");
              this.$set(this.subData[i], "HashRateFloat", "00");
            }
          }
        },
      });
    },
    // 获取接口 24H算力信息
    getHash24Info() {
      uni.request({
        url: this.host + "/app/hash/user/24H",
        method: "GET",
        header: {
          "x-token": this.userToken,
        },
        success: (res) => {
          this.isGetData = true;
          this.refreshFlag++;
          if (res.data.code != 0) {
            return;
          }
          if (res.data.data == null) {
            // 遍历用户拥有的子账户信息
            for (let i = 0; i < this.subData.length; i++) {
              this.$set(this.subData[i], "HashRate24Int", "0");
              this.$set(this.subData[i], "HashRate24Float", "00");
            }
            this.HashRate24Int = "0";
            this.HashRate24Float = "00";
            return;
          }

          let totalHash = 0;
          let subTotalHash = 0;
          let formula = 1000 * 1000;

          // 定义sub24RateMap来存储每个子账户的近24h算力
          const sub24RateMap = new Map();

          res.data.data.forEach((d) => {
            // 总近24h算力
            totalHash += d.HashRate;
            // 如果map里有该子账户id
            if (sub24RateMap.has(d.ProductCode)) {
              // 该子账户id为key,value为累加结果
              sub24RateMap.set(
                d.ProductCode,
                sub24RateMap.get(d.ProductCode) + d.HashRate
              );
            } else {
              sub24RateMap.set(d.ProductCode, d.HashRate);
            }
          });
          // 总近24h算力的计算转换
          totalHash = totalHash / res.data.data.length / formula;
          // 该子账户近24h算力的计算转换
          subTotalHash = subTotalHash / res.data.data.length / formula;

          this.HashRate24 = totalHash.toFixed(2);
          // 按整数和小数分开
          this.HashRate24 = this.HashRate24.split(".");
          this.HashRate24Int = this.HashRate24[0];
          this.HashRate24Float = this.HashRate24[1];

          for (let i = 0; i < this.subData.length; i++) {
            if (sub24RateMap.has(this.subData[i].subaccountId.toString())) {
              let HashRate24 = (
                sub24RateMap.get(this.subData[i].subaccountId.toString()) /
                res.data.data.length /
                formula
              ).toFixed(2);
              const HashRate24Arr = HashRate24.split(".");
              this.$set(this.subData[i], "HashRate24", HashRate24);
              this.$set(this.subData[i], "HashRate24Int", HashRate24Arr[0]);
              this.$set(this.subData[i], "HashRate24Float", HashRate24Arr[1]);
            } else {
              this.$set(this.subData[i], "HashRate24Int", 0);
              this.$set(this.subData[i], "HashRate24Float", 0);
            }
          }
        },
      });
    },
    // 点击跳转绑定设备页面
    onAddEquipmentClick() {
      uni.navigateTo({
        url: "/pages/equipment/bindEquipment",
        success(res) {},
        fail(res) {},
      });
    },
    startMyTimer() {
      if (this.timer1 == null) {
        this.timer1 = setInterval(() => {
          this.getHashTotalInfo();
        }, 1000);
      }
      if (this.timer2 == null) {
        // 获取接口 24H算力信息
        this.timer2 = setInterval(() => {
          this.getHash24Info();
        }, 1000 * 60);
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
    },
  },
  mounted() {
    // 以下部分是顶部蓝色区域在线离线的圆环echarts

    // 获取接口 用户近24h算力
    uni.request({
      url: this.host + "/app/hash/user/24H",
      method: "GET",
      header: {
        //token
        "x-token": this.userToken,
      },
      success: (res) => {
        let hash = [];
        let date = [];
        // 如果为空，存入24个0
        if (res.data.data === null) {
          for (let i = 0; i < 24; i++) {
            hash.unshift(0);
            date.unshift(0);
          }
          this.echartsData = hash;
          this.echartsDate = date;
        }
        // 如果不为空，存入数据
        if (res.data.data !== null) {
          // 定义sub24HashMap来存储每个子账户的近24h算力每小时的算力
          let sub24HashMap = new Map();
          // 定义sub24DateMap来存储每个子账户的近24h算力每小时的小时
          let sub24DateMap = new Map();

          // 遍历接口返回的所有子账号的近24h数据(有几个子账号就有几个24)
          res.data.data.forEach((d) => {
            let tempHash = [];
            let tempDate = [];

            // 如果map里有该子账户id
            if (sub24HashMap.has(d.ProductCode)) {
              // 该子账户id为key,value为每小时 算力的数组
              tempHash = sub24HashMap.get(d.ProductCode);
              tempHash.unshift(d.HashRate);
              sub24HashMap.set(d.ProductCode, tempHash);
            } else {
              sub24HashMap.set(d.ProductCode, [d.HashRate]);
            }

            // 如果map里有该子账户id
            if (sub24DateMap.has(d.ProductCode)) {
              // 该子账户id为key,value为每小时 小时的数组
              tempDate = sub24DateMap.get(d.ProductCode);
              tempDate.unshift(d.HashRate);
              sub24DateMap.set(d.ProductCode, tempDate);
            } else {
              sub24DateMap.set(d.ProductCode, [d.HashRate]);
            }
          });

          // 创建一个新数组,长度为24,每个值都是0
          let totalHash = new Array(24);
          totalHash.fill(0);

          sub24HashMap.forEach((sub) => {
            for (let i = 0; i < 24; i++) {
              totalHash[i] = totalHash[i] + sub[i];
            }
          });

          // 创建一个新数组,长度为24,每个值都是0
          let totalDate = new Array(24);
          totalDate.fill(0);

          sub24DateMap.forEach((sub) => {
            for (let i = 0; i < 24; i++) {
              totalDate[i] = totalDate[i] + sub[i];
            }
          });

          this.echartsData = totalHash;
          this.echartsDate = totalDate;
        }

        const option = {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 1,
                color: "#0DFF4B", // 0% 处的颜色
              },
              {
                offset: 0,
                color: "#37FFFC", // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
          tooltip: {
            show: true,
            trigger: "axis",
            triggerOn: "mousemove|click",
            showContent: false,
            axisPointer: {
              type: "none",
              // type:'shadow',
              snap: true,
              shadowStyle: {
                color: "rgba(53, 255, 243, 0.42)",
                opacity: 0.5,
              },
            },
          },
          legend: {
            show: false,
            bottom: "5%",
            left: "center",
          },
          grid: {
            left: "-24%",
            right: "0%",
            top: "110%",
            containLabel: true,
          },
          xAxis: {
            show: false,
            type: "category",
            boundaryGap: false,
            data: this.echartsDate,
          },
          yAxis: {
            show: false,
            type: "value",
          },
          series: [
            {
              name: "设备1",
              type: "line",
              smooth: true,
              showSymbol: false,
              symbolSize: 6,
              stack: "总量",
              data: this.echartsData,
            },
          ],
        };
        this.$refs.chart.init(echarts, (chart) => {
          chart.setOption(option);
        });
      },
    });

    // 获取接口 用户拥有的设备在线情况信息
    uni.request({
      url: this.host + "/app/machine/online",
      method: "GET",
      header: {
        //token
        "x-token": this.userToken,
      },
      success: (res) => {
        this.equipmentData = res.data.data;
        let online = 0;
        let offline = 0;

        // 设备首页绑定设备总数
        if (this.equipmentData == null) {
          this.totalEquipmentState.totalNum = 0;
        } else {
          this.totalEquipmentState.totalNum = this.equipmentData.length;
        }
        // 如果设备数不为0
        if (this.totalEquipmentState.totalNum !== 0) {
          // 遍历每个设备在线离线信息
          this.equipmentData.forEach((data) => {
            // 计算设备首页绑定设备数量
            // 0离线1在线
            if (data.IfOnline) {
              online++;
            }
            if (!data.IfOnline) {
              offline++;
            }
            this.totalEquipmentState.onlineNum = online;
            this.totalEquipmentState.offlineNum = offline;
          });
        }

        //反方向剩下部分的样式
        const placeHolderStyle = {
          normal: {
            label: {
              show: false,
              position: "center",
            },
            labelLine: {
              show: false,
            },
            color: "#56ace8",
            borderColor: "#56ace8",
            borderWidth: 1,
          },
        };

        let onlineEchartsData = [];
        let offlineEchartsData = [];
        if (this.totalEquipmentState.onlineNum == 0) {
          onlineEchartsData = [
            {
              value: this.totalEquipmentState.offlineNum,
              name: "离线设备数",
              itemStyle: placeHolderStyle,
            },
          ];
        } else {
          onlineEchartsData = [
            {
              value: this.totalEquipmentState.offlineNum,
              name: "离线设备数",
              itemStyle: placeHolderStyle,
            },
            {
              value: this.totalEquipmentState.onlineNum,
              name: "在线设备数",
            },
          ];
        }

        if (this.totalEquipmentState.offlineNum == 0) {
          offlineEchartsData = [
            {
              value: this.totalEquipmentState.onlineNum,
              name: "在线设备数",
              itemStyle: placeHolderStyle,
            },
          ];
        } else {
          offlineEchartsData = [
            {
              value: this.totalEquipmentState.onlineNum,
              name: "在线设备数",
              itemStyle: placeHolderStyle,
            },
            {
              value: this.totalEquipmentState.offlineNum,
              name: "离线设备数",
            },
          ];
        }

        const circleOnlineOption = {
          animation: false, // 取消动画
          title: [
            {
              text: `{val|${online}}`,
              top: "center",
              left: "center",
              textStyle: {
                rich: {
                  val: {
                    fontSize: 22,
                    fontWeight: "bold",
                    color: "#ffffff",
                    fontFamily: "AlibabaPuHuiTiB",
                  },
                },
              },
            },
          ],
          tooltip: {
            show: false,
            trigger: "item",
          },
          color: ["#37FFFC", "#56ace8"],
          legend: {
            show: false,
          },
          series: [
            {
              type: "pie",
              clockwise: true, //顺时加载
              silent: "ture", //图形是否不响应和触发鼠标事件
              startAngle: 40,
              // endAngle: 90,
              center: ["50%", "50%"],
              radius: ["80%", "88%"],
              itemStyle: {
                normal: {
                  label: {
                    show: false,
                    position: "outside",
                  },
                  borderRadius: 4,
                  borderWidth: "3",
                  borderColor: "#37FFFC",
                },
              },
              data: onlineEchartsData,
            },
          ],
        };

        const circleOfflineOption = {
          animation: false, // 取消动画
          title: [
            {
              text: `{val|${offline}}`,
              top: "center",
              left: "center",
              textStyle: {
                rich: {
                  val: {
                    fontSize: 22,
                    fontWeight: "bold",
                    color: "#ffffff",
                    fontFamily: "AlibabaPuHuiTiB",
                  },
                },
              },
            },
          ],
          tooltip: {
            show: false,
            trigger: "item",
          },
          color: ["#FE9675", "#56ace8"],
          legend: {
            show: false,
          },
          series: [
            {
              name: "净收益",
              type: "pie",
              clockwise: true, //顺时加载
              silent: "ture", //图形是否不响应和触发鼠标事件
              startAngle: 40,
              // endAngle: 90,
              center: ["50%", "50%"],
              radius: ["80%", "88%"],
              itemStyle: {
                normal: {
                  label: {
                    show: false,
                    position: "outside",
                  },
                  borderRadius: 4,
                  borderWidth: "3",
                  borderColor: "#FE9675",
                },
              },
              data: offlineEchartsData,
            },
          ],
        };

        this.$refs.chartOnline.init(echarts, (chart) => {
          chart.setOption(circleOnlineOption);
        });

        this.$refs.chartOffline.init(echarts, (chart) => {
          chart.setOption(circleOfflineOption);
        });
      },
    });
  },

  onHide() {
    this.stopMyTimer();
    // 如果隐藏,那么右上角下拉选择栏也要不显示
    this.ShowHidden = false;
  },
};
</script>

<style>
page {
  background-color: #F3F5F7;
}
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
  background-color: #ffffff;
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
    // margin: 0 24rpx;
    padding-top: 24rpx;
    // width: 592rpx;
    // height: 352rpx;
    // background-color: #f8f8f8;
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

.echarts {
  height: 160rpx;
}
// 导航栏
.box-bg {
  position: relative;
  .title {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
    padding-top: var(--status-bar-height);
    z-index: 50;
    background-color: transparent;
    // color: rgba(255,255,255,0.8);
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
      text {
        margin-right: 12rpx;
        font-size: 40rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #2e334e;
      }
      image {
        width: 34rpx;
        height: 34rpx;
      }
    }

    .rightIcon {
      margin-right: 44rpx;
      margin-top: 14rpx;
      margin-bottom: 14rpx;
      // padding-top: 8rpx;
    }
  }

  // 弹出框的样式
  .arrivalNavigation {
    width: 260rpx;
    position: fixed;
    top: calc(var(--status-bar-height) + 70rpx);
    right: 10rpx;
    z-index: 100;
    // 小三角
    .d4 {
      width: 2rpx;
      height: 2rpx;
      margin-left: 180rpx;
      margin-top: -20rpx;
      border-width: 20rpx;
      border-style: solid;
      border-color: transparent rgba(0, 0, 0, 0.9) transparent transparent;
      transform: rotate(90deg); /*顺时针旋转90°*/
    }
    .sideNavigation {
      width: 260rpx;
      background-color: rgba(0, 0, 0, 0.9);
      border-radius: 10rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      ul {
        padding: 0;
        list-style: none;
      }
      // 占位的li
      .zhanwei {
        height: 12rpx;
      }
      li {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        height: 90rpx;
        // text-align: center;
        line-height: 90rpx;
        font-size: 30rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #f8f9fa;
		
        image {
          margin-right: 14rpx;
          width: 44rpx;
          height: 44rpx;
        }
      }
      // 分割线
      .liBottomBorder {
        width: 230rpx;
        height: 1rpx;
        opacity: 0.2;
        background-color: #f5f9fa;
      }
    }
  }
  // 遮罩层css
  .shadow {
    z-index: 99;
    position: absolute;
    width: 750rpx;
    background-color: transparent;
    // background-color: rgba(0, 0, 0, 0.9);
  }
}

.bg {
  // position: absolute;
  // z-index: 2;
  width: 750rpx;
  height: 596rpx;
  padding-top: 110rpx;
  // background: linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%);
  background-color: #ffffff;
  background-image: linear-gradient(
    180deg,
    #ffffff 0%,
    #ffffff 33%,
    #ffffff 66%,
    #f3f5f7 100%
  );

  .hashRateContent {
    // z-index: 300;
    margin-left: 24rpx;
    margin-right: 24rpx;
    // background-color: #ffffff;
    background-image: url("@/static/images/equipment/bg.png");
    background-repeat: no-repeat;
    background-size: cover;
    width: 702rpx;
    height: 592rpx;
    display: grid;
    grid-template-rows: 1fr 1fr 1fr;
    grid-template-columns: 1fr 1fr 2rpx 1fr 1fr 2rpx 1fr 1fr;
    // 第三栏中间的分割线
    .split {
      grid-row-start: 3;
      grid-row-end: 3;
      .split-line1 {
        grid-column-start: 3;
        grid-column-end: 4;
        width: 1rpx;
        height: 52rpx;
        background-color: #57abe7;

        align-items: center;
      }
      .split-line2 {
        grid-column-start: 6;
        grid-column-end: 7;
        width: 1rpx;
        height: 52rpx;
        background-color: #57abe7;

        align-items: center;
      }
    }
    view {
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: #ffffff;
      // padding-left: 40rpx;
      // 小标题
      .subTitle {
        height: 37rpx;
        font-size: 26rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #306996;
        line-height: 37rpx;
		// text-align: center;
      }
      // 所有大数字
      text:first-of-type {
        font-size: 50rpx;
        // font-weight: 700;
        font-family: AlibabaPuHuiTiB;

        // 00
        p:first-child {
          display: inline-block;
          font-size: 26rpx;
          // font-weight: 700;
          font-family: AlibabaPuHuiTiB;
          margin-left: 0rpx;
        }
        // MH/s
        p {
          display: inline-block;
          font-size: 26rpx;
          // font-weight: 400;
          margin-left: 10rpx;
          font-family: PingFangSC-Medium;
        }
      }
      // 24h和实时算力大数字
      .subTitle1 {
        margin-left: 32rpx;
        margin-top: 10rpx;
      }
    }
    .box1 {
      grid-row-start: 1;
      grid-row-end: 1;
      grid-column-start: 1;
      grid-column-end: 5;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      view {
        margin-top: 12rpx;
        margin-right: 12rpx;
        background-image: url("@/static/images/equipment/smallbg.png");
        background-repeat: no-repeat;
        background-size: cover;
        width: 315rpx;
        height: 167rpx;
        .subTitle {
          width: 134rpx;
          height: 40rpx;
          font-size: 28rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ffffff;
          line-height: 40rpx;
          white-space: nowrap;

          // 小圆点
          image {
            margin-left: 32rpx;
            margin-right: 16rpx;
            margin-bottom: 6rpx;
            width: 9rpx;
            height: 9rpx;
          }
        }
      }
    }
    .box2 {
      margin-top: 12rpx;
      grid-row-start: 1;
      grid-row-end: 1;
      grid-column-start: 5;
      grid-column-end: 9;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      view {
        margin-left: 12rpx;
        background-image: url("@/static/images/equipment/smallbg2.png");
        background-repeat: no-repeat;
        background-size: cover;
        width: 315rpx;
        height: 167rpx;
        .subTitle {
          width: 134rpx;
          height: 40rpx;
          font-size: 28rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ffffff;
          line-height: 40rpx;
          white-space: nowrap;
		  text-align: center;
        }
        image {
          margin-left: 32rpx;
          margin-right: 16rpx;
          margin-bottom: 6rpx;
          width: 9rpx;
          height: 9rpx;
        }
      }
    }
    .box3 {
      position: relative;
      grid-row-start: 2;
      grid-row-end: 2;
      grid-column-start: 1;
      grid-column-end: 9;
      justify-content: flex-start;
      .subTitle {
        font-size: 28rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        margin-left: 42rpx;
      }
    }
    .box4,
    .box5,
    .box6 {
      .echarts {
        margin-top: 10rpx;
        width: 100rpx;
        height: 100rpx;
        // margin-bottom: 10rpx;
      }
    }
    .box4 {
      grid-row-start: 3;
      grid-row-end: 3;
      grid-column-start: 1;
      grid-column-end: 3;

      justify-content: center;
      align-items: center;
      view {
        margin-top: 14rpx;
        height: 130rpx;
        display: flex;
        flex-direction: column;
        align-items: center;

        text {
          display: flex;
          width: 100rpx;
          height: 100rpx;
          justify-content: center;
          align-items: center;
          text-align: center;
          // vertical-align: middle;
          // margin-bottom: 6rpx;
        }
      }
	  // 調整app語言為英文時綁定設備總數的樣式
	  .subTitle{
		  text-align: center;
		  line-height: 28rpx;
	  }
      // display: flex;
      // flex-direction: column;
    }
    .box5 {
      grid-row-start: 3;
      grid-row-end: 3;
      grid-column-start: 4;
      grid-column-end: 6;
      justify-content: center;
      align-items: center;
    }
    .box6 {
      grid-row-start: 3;
      grid-row-end: 3;
      grid-column-start: 7;
      grid-column-end: 9;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
