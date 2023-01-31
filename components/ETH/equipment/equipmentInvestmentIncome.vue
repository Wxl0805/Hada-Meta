<template>
  <view>
    <view class="header">
      <view class="img">
        <!-- <image :src="equipmentInvestmentIncomeInfo.Img" v-if="equipmentInvestmentIncomeInfo.Img != '../../static/images/equipment/u98.png  '"></image> -->
        <image src="../../../static/images/equipment/hada1.png" v-if="equipmentInvestmentIncomeInfo.Img == '../../static/images/equipment/u98.png  '"></image>
		<image src="../../../static/images/equipment/hada1Pro.png" style="width: 702rpx;" v-if="equipmentInvestmentIncomeInfo.Img == '../../static/images/equipment/u97.png'"></image>
        <!-- 售罄图片 -->
        <image :src="soldOutImg" class="soldOutImg"></image>
      </view>
      <view class="head-content">
        <!-- <view class="price">
          <text class="smallTitle">{{ $t("Home.Swiper.equipment.price") }}</text>
          <view>
            <p>$</p>
            <text>{{ equipmentInvestmentIncomeInfo.Price }}</text>
          </view>
        </view> -->
        <view class="depreciation-period">
          <text class="smallTitle">{{ $t("Home.Swiper.equipment.depreciation-period") }}</text>
          <view>{{ equipmentInvestmentIncomeInfo.DepreciationPeriod }}({{ $t("Home.Swiper.equipment.estimated-price") }})</view>
        </view>
      </view>
    </view>

    <view class="select-product">
      <text class="smallTitle">{{ $t("Home.Swiper.equipment.select-product") }}</text>
      <!-- 这里后面放一个下拉选择框 -->
      <view>
        <text>{{ $t("Home.Swiper.equipment.ETH-product") }}</text>
        <uni-icons type="bottom" size="20"></uni-icons>
      </view>
    </view>

    <form @submit="formSubmit" ref="baseForm" :modelValue="baseFormData">
      <!-- 表格1 -->
      <view class="uni-container">
        <view class="table-title1">{{ $t("Home.Swiper.equipment.equipment-info") }}</view>
        <uni-table ref="table1" :border="false" :stripe="false">
          <uni-tr>
            <uni-th width="250rpx" align="center" class="title">占位的</uni-th>
            <uni-th width="150rpx" align="center" class="title">占位的</uni-th>
          </uni-tr>
          <uni-tr>
            <uni-td align="left" class="text">{{ $t("Home.Swiper.equipment.equipment-hashrate") }}</uni-td>
            <uni-td align="right" class="text">
              <view class="right-text">{{ equipmentInvestmentIncomeInfo.ComputingPower }}MH/s</view></uni-td
            >
          </uni-tr>
          <uni-tr>
            <uni-td align="left" class="text">{{ $t("Home.Swiper.equipment.equipment-power") }}</uni-td>
            <uni-td align="right" class="text">
              <view class="right-text">{{ equipmentInvestmentIncomeInfo.RatedPower }}W</view></uni-td
            >
          </uni-tr>
          <uni-tr>
            <uni-td align="left" class="text">{{ $t("Home.Swiper.equipment.price") }}</uni-td>
            <uni-td align="right" class="text">
              <view class="right-text"
                >{{ (equipmentInvestmentIncomeInfo.Price / USDtoRMB).toFixed(0) }} {{ $t("Home.Swiper.equipment.equipment-unit") }}</view
              ></uni-td
            >
          </uni-tr>
          <uni-tr>
            <uni-td align="left" class="text"
              >{{ $t("Home.Swiper.equipment.equipment-electricityPrices") }}
              <p>*</p></uni-td
            >
            <uni-td align="right" class="text">
              <view class="right-text">
                <input
                  class="uni-input"
                  name="electricityPricesInput"
                  :placeholder="$t('Home.Swiper.equipment.input-equipment-power')"
                  value="0.052"
                  placeholder-class="uni-input-placeholder"
                  type="digit"
                  :adjust-position="true"
                  @input="changeElectricityInput"
                />
                <p>{{ $t("Home.Swiper.equipment.equipment-electricity-unit") }}</p>
              </view></uni-td
            >
          </uni-tr>
        </uni-table>
      </view>

      <!-- 表格2 -->
      <view class="uni-container table2">
        <view class="table-title2">{{ $t("Home.Swiper.equipment.product-info") }}</view>
        <uni-table ref="table2" :border="false" :stripe="false" emptyText="暂无更多数据">
          <uni-tr>
            <uni-th width="250rpx" align="center" class="title">占位的</uni-th>
            <uni-th width="168rpx" align="center" class="title">占位的</uni-th>
          </uni-tr>
          <uni-tr>
            <uni-td align="left" class="text"
              >{{ $t("Home.Swiper.equipment.coin-price") }}
              <p>*</p></uni-td
            >
            <uni-td align="right" class="text">
              <view class="right-text">
                <input
                  class="uni-input"
                  name="coinPricesInput"
                  :placeholder="$t('Home.Swiper.equipment.input-coin-price')"
                  :value="latestCoinPrice"
                  placeholder-class="uni-input-placeholder"
                  type="digit"
                  :adjust-position="true"
                  @input="changeCoinInput"
                />
                <p>{{ $t("Home.Swiper.equipment.equipment-unit") }}</p>
              </view></uni-td
            >
          </uni-tr>
          <uni-tr>
            <uni-td align="left" class="text"
              >{{ $t("Home.Swiper.equipment.equipment-other") }}
              <p>*</p></uni-td
            >
            <uni-td align="right" class="text">
              <view class="right-text">
                <input
                  class="uni-input"
                  name="otherExpensesInput"
                  :placeholder="$t('Home.Swiper.equipment.input-equipment-other')"
                  value="0"
                  placeholder-class="uni-input-placeholder"
                  type="digit"
                  :adjust-position="true"
                  @input="changeOtherInput"
                />
                <p>{{ $t("Home.Swiper.equipment.input-equipment-other-unit") }}</p>
              </view></uni-td
            >
          </uni-tr>
          <uni-tr>
            <uni-td align="left" class="text">{{ $t("Home.Swiper.equipment.equipment-totalHash") }}</uni-td>
            <uni-td align="right" class="text">
              <view class="right-text">940TH/s</view>
            </uni-td>
          </uni-tr>
          <uni-tr>
            <uni-td align="left" class="text">{{ $t("Home.Swiper.equipment.equipment-cost-fee") }}</uni-td>
            <uni-td align="right" class="text">
              <view class="right-text">2%(PPLNS)</view>
            </uni-td>
          </uni-tr>
        </uni-table>
      </view>

      <view class="startCountBtn">
        <button type="primary" form-type="submit" @touchstart="startCount" @touchend="pageScroll">
          <text>{{ $t("Home.Swiper.equipment.equipment-startBtn") }}</text>
        </button>
      </view>
    </form>

    <view class="echarts-content" v-if="this.showEchartsFlag">
      <!-- 收益信息模块 -->
      <view class="ETH-price-content">
        <view class="title">
          <text>{{ $t("Home.Swiper.equipment.equipment-income-info") }}</text>
          <view>
            <text>{{ $t("Home.Swiper.equipment.equipment-ETH-echarts-unit") }}：</text>
            <text>{{ $t("Home.Swiper.equipment.equipment-unit") }}</text>
          </view>
        </view>
      </view>
      <view class="echarts-content-income">
        <!--        <view class="title">
          <text>{{ $t("Home.Swiper.equipment.equipment-income-info") }}</text>
          <view>
            <text>{{ $t("Home.Swiper.equipment.equipment-ETH-echarts-unit") }}：</text>
            <text>{{ $t("Home.Swiper.equipment.equipment-unit") }}</text>
          </view>
        </view> -->

        <!-- 选项卡组件 -->
        <!-- <view class="switch-content">
         <view class="switch-title" @click="onclick">
          <view
				  @tap="tap(index)"
				  v-for="(item, index) in list"
				  :key="index"
				  >{{ item.title }}</view
				>
        </view> -->

        <l-echart ref="chart" class="echarts-income"></l-echart>
		
		<view style="display: flex;position: absolute;top: 460rpx;left: auto;">
			<view>
				<view style="display: flex;flex-direction: row;align-items: center;">
					<view style="width: 20rpx;height: 20rpx;background-color: #FEA390;"></view>
					<text style="margin-left: 12rpx;color: #2E334E;font-size: 28rpx;">其他支出</text>
					<text style="color: #2E334E;font-size: 28rpx;">{{other}}</text>
					<text style="margin-left: 20rpx;color: #888DA7;font-size: 28rpx;">{{otherPercentage}}</text>
				</view>
				<view style="display: flex;flex-direction: row;align-items: center;">
					<view style="width: 20rpx;height: 20rpx;background-color: #88A5FF;"></view>
					<text style="margin-left: 12rpx;color: #2E334E;font-size: 28rpx;">电费支出</text>
					<text style="color: #2E334E;font-size: 28rpx;">{{elec}}</text>
					<text style="margin-left: 20rpx;color: #888DA7;font-size: 28rpx;">{{elecPercentage}}</text>
				</view>
			</view>
			<view style="margin-left: 32rpx;">
				<view style="display: flex;flex-direction: row;align-items: center;">
					<view style="width: 20rpx;height: 20rpx;background-color: #FFDC8B;"></view>
					<text style="margin-left: 12rpx;color: #2E334E;font-size: 28rpx;">设备成本</text>
					<text style="color: #2E334E;font-size: 28rpx;">{{equip}}</text>
					<text style="margin-left: 20rpx;color: #888DA7;font-size: 28rpx;">{{equipPercentage}}</text>
				</view>
				<view style="display: flex;flex-direction: row;align-items: center;">
					<view style="width: 20rpx;height: 20rpx;background-color: #ccec78;"></view>
					<text style="margin-left: 12rpx;color: #2E334E;font-size: 28rpx;">净收益</text>
					<text style="color: #2E334E;font-size: 28rpx;">{{nIcome}}</text>
					<text style="margin-left: 20rpx;color: #888DA7;font-size: 28rpx;">{{nIcomePercentage}}</text>
				</view>
			</view>
		</view>

        <view class="income-box">
          <view class="box1">
            <text>{{ $t("Home.Swiper.equipment.equipment-income-rate") }}</text>
            <text>({{ $t("Home.Swiper.equipment.equipment-year") }})</text>
            <p>{{ incomeNumInfo.ROI }}</p>
          </view>
          <view class="box2">
            <text>{{ $t("Home.Swiper.equipment.equipment-mao") }}</text>
            <text>({{ $t("Home.Swiper.equipment.equipment") }})</text>
            <p>{{ incomeNumInfo.yearlyGrossProfitRatio }}</p>
          </view>
          <view class="box3">
            <text>{{ $t("Home.Swiper.equipment.equipment-day") }}</text>
            <text class="dontShow">占位的</text>
            <p>{{ incomeNumInfo.returnDays }}{{ $t("Home.Swiper.equipment.equipment-day-unit") }}</p>
          </view>
        </view>
      </view>

      <!-- 日收益模块 -->
      <view class="ETH-price-content">
        <view class="title">
          <text>{{ $t("Home.Swiper.equipment.equipment-daily-echarts") }}</text>
          <view>
            <text>{{ $t("Home.Swiper.equipment.equipment-ETH-echarts-unit") }}：</text>
            <text>{{ $t("Home.Swiper.equipment.equipment-unit") }}</text>
          </view>
        </view>
      </view>
      <view class="echarts-content-daily">
        <l-echart ref="chartDay" class="echarts-daily"></l-echart>
      </view>

      <!-- 以太坊价格变化趋势图 -->
      <view class="ETH-price-content">
        <view class="title">
          <text>{{ $t("Home.Swiper.equipment.equipment-ETH-echarts") }}</text>
          <view>
            <text>{{ $t("Home.Swiper.equipment.equipment-ETH-echarts-unit") }}：</text>
            <text>{{ $t("Home.Swiper.equipment.equipment-unit") }}</text>
          </view>
        </view>
        <l-echart ref="ETHchart" class="echarts"></l-echart>
      </view>
    </view>
  </view>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "equipmentInvestmentIncome",
  props: {
    equipmentInvestmentIncomeInfo: {
      type: Object,
    },
    // 獲取接口 ETH價格信息
    echartsInfo: {
      type: Array,
    },
    latestCoinPrice: {
      type: String,
    },
  },
  data() {
    return {
      // 售罄图片
      soldOutImg: "../../static/images/equipment/soldOut.png",
      baseFormData: {
        electricityPrices: "",
        coinPrices: "",
        otherExpenses: "",
      },
      // 转换率
      USDtoRMB: 6.74,
      flag: 0,
      // 存储用户输入的数据
      eInfo: {
        coinPrices: "",
        electricityPrices: "0.052",
        otherExpenses: "0",
        // 设备价格，假数据
        // equipmentPrice: "38888",
      },
      // 是否展示所有echarts的flag
      showEchartsFlag: false,
      // 收益详情echarts下方数据
      incomeNumInfo: {
        ROI: "228.51%",
        yearlyGrossProfitRatio: "55.45%",
        returnDays: "560",
      },
      // 日收益echarts图页面数据
      dailyIncomeNum: {
        netIncome: "160.00",
        electricityPrices: "30.00",
        otherExpenses: "10.00",
      },
      // 收益详情echarts的默认值
      echartsData: [
        {
          name: "其他支出",
          value: 15000,
        },
        {
          name: "电费支出",
          value: 15000,
        },
        {
          name: "设备成本",
          value: 38888,
        },
        {
          name: "净收益",
          value: 20000,
        },
      ],
	  // 9.2收益信息下方四个块信息
	  other:null,
	  elec:null,
	  equip:null,
	  nIcome:null,
	  otherPercentage:null,
	  elecPercentage:null,
	  equipPercentage:null,
	  nIcomePercentage:null,
    };
  },
  updated() {
    // 读取币价到eInfo里
    this.eInfo.coinPrices = this.latestCoinPrice;

    // console.log(this.equipmentInvestmentIncomeInfo.Img);
    // console.log(this.equipmentInvestmentIncomeInfo.Img=="../../static/images/equipment/u98.png  ");
  },
  methods: {
    changeCoinInput(e) {
      this.eInfo.coinPrices = e.detail.value.toString();
    },
    changeElectricityInput(e) {
      this.eInfo.electricityPrices = e.detail.value.toString();
    },
    changeOtherInput(e) {
      this.eInfo.otherExpenses = e.detail.value.toString();
    },
    formSubmit(e) {
      const formdata = e.detail.value;

      this.eInfo.electricityPrices = formdata.electricityPricesInput.toString();
      this.eInfo.otherExpenses = formdata.otherExpensesInput.toString();
      this.eInfo.coinPrices = formdata.coinPricesInput.toString();
    },
    // 获取组件内选项卡的下标并存到flag里面
    tap(index) {
      this.flag = index;
    },
    pageScroll() {
      // 控制页面下滑
      uni.pageScrollTo({
        scrollTop: 900,
        duration: 300,
      });
    },
    // 更新echarts里的数据
    startCount() {
      // 如果三个输入值有任何一个为空,所有echarts不显示
      if (this.eInfo.coinPrices == "" || this.eInfo.electricityPrices == "" || this.eInfo.otherExpenses == "") {
        this.showEchartsFlag = false;
        return;
      }
      this.showEchartsFlag = true;

      // 收益信息里echarts的值
      let obj = {
        name: "",
        value: null,
      };
      let yearlyData = {
        electricityPrices: "",
        otherExpenses: "",
        netIncome: "",
        // 设备价格
        equipmentPrice: "",
      };
      // 每日电费=用户输入的电价 * 24h * [设备功率(W) / 1000](KW)  ---改
      let dailyElectricityPrices = (parseFloat(this.eInfo.electricityPrices) * 24 * parseFloat(this.equipmentInvestmentIncomeInfo.RatedPower)) / 1000;
      // console.log(dailyElectricityPrices)
      // 三年电费=每日电费 * 365天 * 三年
      yearlyData.electricityPrices = dailyElectricityPrices * 365 * 3;
      // console.log(yearlyData.electricityPrices)
      // 三年其他支出=用户输入的每日其他支出 * 365 * 三年
      yearlyData.otherExpenses = parseFloat(this.eInfo.otherExpenses) * 365 * 3;
      // 三年设备价格=设备价格
      yearlyData.equipmentPrice = parseInt((parseFloat(this.equipmentInvestmentIncomeInfo.Price) / this.USDtoRMB).toFixed(0));

      // 每日总收益=【设备算力 / （总算力(940) * 1000 * 1000） * (13400（每天可以产生的ETH个数）+ 1000（打包费）)】 * 币价
      let dailyGrossProfit =
        (parseFloat(this.equipmentInvestmentIncomeInfo.ComputingPower) / (940 * 1000 * 1000)) * (13400 + 1000) * parseFloat(this.eInfo.coinPrices);
      // (parseFloat(this.equipmentInvestmentIncomeInfo.ComputingPower) / (940 * 1000 * 1000)) * (13400 + 1000) * parseFloat(this.latestCoinPrice);
      console.log("币价", parseFloat(this.latestCoinPrice));
      console.log("币价", parseFloat(this.eInfo.coinPrices));
      console.log("日总收益", dailyGrossProfit);
      // 三年总收益=每日总收益 * 365 * 三年
      yearlyData.netIncome = dailyGrossProfit * 365 * 3;
      console.log("3总收益", yearlyData.netIncome);

      // 每日毛利=日总收益-每日电费-每日其他支出
      let dailyNetIncomeMao = dailyGrossProfit - dailyElectricityPrices - parseFloat(this.eInfo.otherExpenses);
      // console.log("每日毛利", dailyNetIncomeMao);

      // 三年毛利=每日毛利 * 365 * 3
      let yearlyGrossProfit = dailyNetIncomeMao * 365 * 3;
      // console.log("三年毛利", yearlyGrossProfit);

      // 三年投资回报率=(三年毛利) / 成本（设备价格）---改
      let yearlyROI = yearlyGrossProfit / yearlyData.equipmentPrice;
      // console.log("三年投资回报率", yearlyROI);

      // 转成百分比
      this.incomeNumInfo.ROI = (yearlyROI * 100).toFixed(2) + "%";

      // 毛利年化=三年投资回报率 / 3
      let yearlyGrossProfitRatio = yearlyROI / 3;

      // 转成百分比
      this.incomeNumInfo.yearlyGrossProfitRatio = (yearlyGrossProfitRatio * 100).toFixed(2) + "%";

      // 预计回本天数=设备价格 / 每日毛利 --改
      let returnDays = yearlyData.equipmentPrice / dailyNetIncomeMao;
      console.log(yearlyData.equipmentPrice);
      console.log(dailyNetIncomeMao);
      // 取整
      this.incomeNumInfo.returnDays = returnDays.toFixed(2) + "";

      // 三年电费取整
      const elec = yearlyData.electricityPrices.toFixed(0);
      // 三年其他支出取整
      const other = yearlyData.otherExpenses.toFixed(0);
      // 三年总收益取整
      const totalIcome = yearlyData.netIncome.toFixed(0);
      // 三年设备成本取整
      const equip = yearlyData.equipmentPrice.toFixed(0);

      // 三年净收益取整
      const nIcome = (totalIcome - other - elec - equip).toFixed(0);
		
		this.other = other;
		this.elec = elec;
		this.equip = equip;
		this.nIcome = nIcome;
		
		
		this.otherPercentage = (other / totalIcome * 100).toFixed(2) + "%";
		this.elecPercentage = (elec / totalIcome * 100).toFixed(2) + "%";
		this.equipPercentage = (equip / totalIcome * 100).toFixed(2) + "%";
		this.nIcomePercentage = (nIcome / totalIcome * 100).toFixed(2) + "%";
		
		
      let afterData = [
        {
          name: this.$t("Home.Swiper.equipment.equipment-other-echarts"),
          value: other,
        },
        {
          name: this.$t("Home.Swiper.equipment.equipment-elec-echart"),
          value: elec,
        },
        {
          name: this.$t("Home.Swiper.equipment.equipment-echart"),
          value: equip,
        },
        {
          name: this.$t("Home.Swiper.equipment.equipment-income-echart"),
          value: nIcome,
        },
      ];

      const incomeInfoOption = {
        color: ["#FEA390", "#88A5FF", "#FFDC8B", "#ccec78"],
        title: [
          {
            text: `{val|${totalIcome}}\n{name|${this.$t("Home.Swiper.equipment.equipment-total-echart")}}`,
            top: "30%",
            left: "center",
            textStyle: {
              rich: {
                name: {
                  fontSize: 13,
                  color: "#888DA7",
                  padding: [10, 0],
                },
                val: {
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#2E334E",
                  fontFamily: "AlibabaPuHuiTiB",
                },
              },
            },
          },
        ],
        tooltip: {
          show: true,
          trigger: "item",
        },
        legend: {
			// ---------------------------------------------------------------------
			show:false,
          bottom: "0%",
          x: "center",
          itemWidth: 10, // 设置宽度
          itemHeight: 10, // 设置高度
          textStyle: {
            color: "#2E334E",
            fontFamily: "PingFangSC-Regular, PingFang SC",
            fontSize: 12,
            rich: {
              name: {
                fontSize: 14,
                color: "#2E334E",
                // width:40
              },
              percentage: {
                fontSize: 12,
                color: "#9EA3BB",
              },
            },
          },
          // orient: "vertical",
          formatter: function (name) {
            let data = afterData;
            let total = 0;
            let tarValue = null;
            for (let i = 0; i < data.length; i++) {
              total += parseFloat(data[i].value);
              if (data[i].name == name) {
                tarValue = parseFloat(data[i].value);
              }
            }
            //计算出百分比
            let p = ((tarValue / total) * 100).toFixed(2) + "%";
            let text = `{name|${name}}${tarValue} ` + `{percentage|${p}}`;
            return text;
          },
          // data:[this.$t("Home.Swiper.equipment.equipment-other-echarts"),this.$t("Home.Swiper.equipment.equipment-elec-echart")]
        },
        series: [
          {
            name: this.$t("Home.Swiper.equipment.equipment-total-echart"),
            type: "pie",
            center: ["50%", "40%"],
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 4,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
              formatter: "{a}",
              color: "#999999",
              fontSize: "16",
              height: "30",
            },
            labelLine: {
              show: false,
            },
            // data: this.echartsData
            data: afterData,
          },
        ],
      };

      // 日收益echarts里的值

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
          color: "#f5f9fa",
          borderColor: "#f5f9fa",
          borderWidth: 6,
        },
      };
      // 日收益玉钰图中间部分数字=每日毛利+每日电费+用户输入的每日其他费用
      const dailyEchartsTotalNum = (dailyNetIncomeMao + dailyElectricityPrices + parseFloat(this.eInfo.otherExpenses)).toFixed(2);

      // 修改页面上的日收益数据
      this.dailyIncomeNum.netIncome = dailyNetIncomeMao.toFixed(2);
      this.dailyIncomeNum.electricityPrices = dailyElectricityPrices.toFixed(2);
      this.dailyIncomeNum.otherExpenses = parseFloat(this.eInfo.otherExpenses).toFixed(2);

      const afterData2 = [
        [
          {
            value: dailyEchartsTotalNum - dailyNetIncomeMao,
            name: "",
            itemStyle: placeHolderStyle,
          },
          {
            value: dailyNetIncomeMao,
            // 22.8.12:字从"净收益"换成"日毛利",值也换成日毛利
            name: this.$t("Home.Swiper.equipment.equipment-income-dailyMaoLi-echart"),
          },
        ],
        [
          {
            value: dailyEchartsTotalNum - dailyElectricityPrices,
            name: "",
            itemStyle: placeHolderStyle,
          },
          {
            value: dailyElectricityPrices,
            name: this.$t("Home.Swiper.equipment.equipment-elec1-echart"),
          },
        ],
        [
          {
            value: dailyEchartsTotalNum - parseFloat(this.eInfo.otherExpenses),
            name: "",
            itemStyle: placeHolderStyle,
          },
          {
            value: parseFloat(this.eInfo.otherExpenses),
            name: this.$t("Home.Swiper.equipment.equipment-other1-echarts"),
          },
        ],
      ];

      const dailyEchartsOption = {
        animation: false, // 取消动画
        title: [
          {
            text: `{val|${dailyEchartsTotalNum}}\n{name|${this.$t("Home.Swiper.equipment.equipment-total-echart")}}`,
            top: "34%",
            left: "center",
            textStyle: {
              rich: {
                name: {
                  fontSize: 13,
                  color: "#888DA7",
                  fontFamily: "PingFangSC-Regular, PingFang SC",
                  padding: [8, 0],
                },
                val: {
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#2E334E",
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
        color: ["#6f78ff", "#36CCFE", "#45E881"],
        legend: {
          bottom: "0%",
          orient: "vertical",
          selectedMode: false,
          itemWidth: 6, // 设置宽度
          itemHeight: 6, // 设置高度
          textStyle: {
            color: "#2E334E",
            fontFamily: "PingFangSC-Regular, PingFang SC",
            fontSize: 12,
            rich: {
              name: {
                fontSize: 12,
                color: "#2E334E",
              },
              value: {
                fontSize: 14,
                color: "#2E334E",
                fontWeight: 400,
              },
            },
          },
          formatter: function (name) {
            let data = afterData2;
            let total = 0;
            let tarValue = null;
            for (let i = 0; i < data.length; i++) {
              total += parseFloat(data[i][1].value);
              if (data[i][1].name == name) {
                tarValue = parseFloat(data[i][1].value);
              }
            }
            total = total.toFixed(2);
            tarValue = tarValue.toFixed(2);
            let text = `{name|${name}}    {value|${tarValue}} `;
            return text;
          },
        },
        series: [
          {
            type: "pie",
            clockwise: false, //顺时加载
            silent: "true", //图形是否不响应和触发鼠标事件
            startAngle: 90,
            center: ["50%", "44%"],
            radius: ["69%", "70%"],
            itemStyle: {
              normal: {
                label: {
                  show: false,
                  position: "outside",
                },

                borderWidth: "6",
                borderColor: "#6f78ff",
              },
            },
            data: afterData2[0],
          },
          {
            type: "pie",
            clockwise: false,
            silent: "ture", //图形是否不响应和触发鼠标事件
            center: ["50%", "44%"],
            radius: ["59%", "60%"],
            itemStyle: {
              normal: {
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                  length: 100,
                  smooth: 0.5,
                },
                borderWidth: "6",
                shadowBlur: 40,
                borderColor: "#36CCFE",
                shadowColor: "rgba(0, 0, 0, 0)", //边框阴影
              },
            },
            data: afterData2[1],
          },
          {
            type: "pie",
            clockwise: false,
            silent: "ture", //图形是否不响应和触发鼠标事件
            center: ["50%", "44%"],
            radius: ["49%", "50%"],
            itemStyle: {
              normal: {
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                  length: 100,
                  smooth: 0.5,
                },
                borderWidth: "6",
                shadowBlur: 40,
                borderColor: "#45E881",
                shadowColor: "rgba(0, 0, 0, 0)", //边框阴影
              },
            },
            data: afterData2[2],
          },
        ],
      };

      // 获取以太坊价格数据
      const fakeData = {
        // currIdx:0,
        date: [
          "5.27",
          "5.28",
          "5.29",
          "5.30",
          "5.31",
          "6.01",
          "6.02",
          "6.01",
          "6.02",
          "6.03",
          "6.04",
          "6.05",
          "6.06",
          "6.07",
          "6.08",
          "6.09",
          "6.10",
          "6.11",
          "6.12",
          "6.13",
        ],
        RMBdata: [1000, 1320, 101, 134, 90, 230, 210, 12, 314, 135, 3621, 4631, 231, 268, 865, 56, 456, 75, 198, 108],
      };

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
              color: "#37FFFC", // 0% 处的颜色
            },
            {
              offset: 0,
              color: "#0DFF4B", // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
        tooltip: {
          trigger: "axis",
          valueFormatter: (value) => parseFloat(value).toFixed(2),
        },
        legend: {
          show: false,
          bottom: "5%",
          left: "center",
        },
        grid: {
          left: "4%",
          right: "8%",
          top: "10%",
          bottom: "5%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.echartsInfo.date,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            //x轴文字的配置
            show: true,
            textStyle: {
              color: "#888DA7",
            },
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            //y轴文字的配置
            show: true,
            textStyle: {
              color: "#888DA7",
            },
          },
          splitLine: {
            //分割线配置
            show: true,
            lineStyle: {
              color: "#f5f9fa",
            },
          },
        },
        series: [
          {
            name: this.$t("Home.Swiper.equipment.coin-price"),
            type: "line",
            showSymbol: false,
            smooth: true,
            // data: fakeData.RMBdata,
            data: this.echartsInfo.RMBdata,
          },
        ],
      };

      // 收益详情挂载
      this.$nextTick(() => {
        this.$refs.chart.init(echarts, (chart) => {
          chart.setOption(incomeInfoOption, true);
        });
      });
      // 日收益玉钰图挂载
      this.$nextTick(() => {
        this.$refs.chartDay.init(echarts, (chart) => {
          chart.setOption(dailyEchartsOption, true);
        });
      });
      // 以太坊价格变化挂载
      this.$nextTick(() => {
        this.$refs.ETHchart.init(echarts, (chart) => {
          chart.setOption(option);
        });
      });
    },
  },
};
</script>

<style>
page {
  background-color: #f3f5f7;
}
</style>

<style lang="less" scoped>
	@import "@/static/css/MainColor.less";
// 收益信息
.echarts-content-income {
	position: relative;
  margin-bottom: 24rpx;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  // 标题
  .title {
    padding: 32rpx 0;
    text {
      font-size: 34rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #2e334e;
    }
  }

  .echarts-income {
    width: 100%;
    height: 540rpx;
  }
  .income-box {
    width: 750rpx;
    height: 282rpx;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .box1,
    .box2,
    .box3 {
      width: 218rpx;
      height: 210rpx;
      display: flex;
      flex-direction: column;
      // justify-content: center;
      align-items: center;
      background-color: #f5f9fa;
      border-radius: 20rpx;
      text {
        font-size: 28rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #2e334e;
      }
      text:first-child {
        margin-top: 32rpx;
      }
      // 数字
      p {
        margin-top: 24rpx;
        font-size: 38rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        // color: #009bf9;
        color: @main-color;
      }
    }
    .box2 {
      margin: 0 24rpx;
    }
    .box3 {
      .dontShow {
        color: #f5f9fa;
      }
    }
  }
}
// 日收益信息
.echarts-content-daily {
  padding-bottom: 24rpx;
  margin-bottom: 24rpx;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;

  .title {
    padding: 32rpx 0;
    text {
      font-size: 34rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #2e334e;
    }
  }

  .echarts-daily {
	  margin-bottom: 18rpx;
    width: 750rpx;
    height: 568rpx;
  }

  .echarts-num {
    position: relative;
    height: 34rpx;
    text {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #2e334e;
    }
    text:nth-of-type(1) {
      position: absolute;
      top: -40rpx;
      left: -156rpx;
    }
    text:nth-of-type(2) {
      position: absolute;
      top: -40rpx;
      left: 44rpx;
    }
    text:nth-of-type(3) {
      position: relative;
      top: -42rpx;
      left: 280rpx;
    }
  }
}

// 以太坊价格变化趋势图css echarts-content-income
.ETH-price-content {
  background-color: #ffffff;
  .title {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 10rpx;
    font-size: 32rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #2e334e;
    padding-top: 32rpx;
    view {
      position: absolute;
      top: 32rpx;
      right: 42rpx;
      text {
        margin-right: 10rpx;
        font-size: 26rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #888da7;
      }
    }
  }
  .echarts {
    width: 750rpx;
    height: 526rpx;
    padding-bottom: 24rpx;
  }
}

// 投资产品选择 标题
.smallTitle {
  font-size: 28rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #888da7;
}

// 设备数据+投资产品数据的左右边距调整
// 设备数据+投资产品数据里面的分割线颜色按usbi改了uni-model/uni-table/uni-td和uni-th的$border-color
/deep/ .uni-container .text {
  padding: 32rpx 32rpx 28rpx;
}

.header {
  padding-top: 42rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  .img {
    position: relative;
    width: 702rpx;
    height: 334rpx;
    background: #f8f8f8;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    image {
      width: 429rpx;
      height: 334rpx;
    }
    .soldOutImg {
      position: absolute;
      top: 0rpx;
      right: 0rpx;
      width: 79rpx;
      height: 79rpx;
    }
  }
  .head-content {
    margin-top: 42rpx;
    margin-bottom: 26rpx;
    // margin-left: 24rpx;
    width: 750rpx;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .price {
      width: 680rpx;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-left: 24rpx;
      padding-left: 12rpx;
      // 标题
      text {
        font-size: 28rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #888da7;
      }
      // 价格
      view {
        display: flex;
        align-items: center;
        // price
        text:last-child {
          font-size: 50rpx;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          // color: #009bf9;
          color: @main-color;
        }
        // $
        p {
          font-size: 32rpx;
          font-weight: 700;
          display: inline-block;
          // color: #009bf9;
          color: @main-color;
          margin-right: 4rpx;
        }
      }
    }
    .depreciation-period {
      width: 678rpx;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-left: 24rpx;
      margin-top: 30rpx;
      padding-left: 12rpx;
      // 标题
      text {
        font-size: 28rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #888da7;
      }
      // 折旧期
      view {
        font-size: 34rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #2e334e;
      }
    }
  }
}

// 产品选择
.select-product {
  width: 750rpx;
  height: 110rpx;
  background: #ffffff;
  margin-top: 24rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  .smallTitle {
    margin-left: 42rpx;
  }
  view {
    margin-right: 42rpx;
    display: flex;
    align-items: center;
    text:first-child {
      font-size: 30rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      margin-right: 10rpx;
    }
  }
}

// 表格
.uni-container {
  margin-top: 30rpx;
  margin-bottom: 30rpx;
  position: relative;
  // 绝对定位固定表头文字
  .table-title1 {
    position: absolute;
    z-index: 999;
    top: 32rpx;
    left: 307rpx;
    font-size: 34rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #2e334e;
  }
  .table-title2 {
    position: absolute;
    z-index: 999;
    top: 32rpx;
    left: 273rpx;
    font-size: 34rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #2e334e;
  }
  // 原表头文字
  .title {
    font-size: 46rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
  }
  .text {
    font-size: 28rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #888da7;
    p {
      display: inline-block;
      // color: #009bf9;
      color: @main-color;
      font-size: 28rpx;
    }
    .right-text {
      color: #2e334e;
      display: inline-flex;
      align-items: center;
      font-size: 28rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      // 输入框宽度
      .uni-input {
        width: 210rpx;
        font-size: 32rpx;
        // color: #009bf9;
        color: @main-color;
      }
      // 输入框placeholder
      .uni-input-placeholder {
        font-size: 28rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        line-height: 32rpx;
      }
      // 不可变单位
      p {
        color: #2e334e;
        // color: #000000;
        margin-left: 6rpx;
      }
    }
  }
}
// 取消开始计算按钮和上面表格的margin
.table2 {
  margin-bottom: 0rpx;
}
// 开始计算按钮
.startCountBtn {
  margin-bottom: 24rpx;
  // margin-top: 42rpx;

  height: 157rpx;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;

  button {
    width: 640rpx;
    height: 90rpx;
    // background-color: #009bf9;
    background-color: @main-color;
    border-radius: 100rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    text {
      font-size: 32rpx;
      font-family: AlibabaPuHuiTiM;
      color: #ffffff;
    }
  }
}
</style>
