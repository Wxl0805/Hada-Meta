<template>
  <view>
    <view class="content" v-for="(pro, index) in productData" :key="index">
      <view class="title">
        <view>
			<image src="@/static/images/equipment/subEquipment/equipLogo.png"></image>
			<text>{{ pro.SubaccountName }}</text>
		</view>
        <p @click="onSubAccountClick(index)">{{$t('ETH.SubAccountIncome.detail')}}</p>
      </view>

      <view class="echartsContent">
        <l-echart ref="chart" style="width: 400rpx; height: 400rpx;"></l-echart>
        <view class="hashRateContent">
          <view>
            <p class="subTitle">{{$t('Equipment.Menu.equipSubAccount.real-time-hashrate')}}</p>
            <text
              >{{ subdata[index].HashRateInt }}.
              <p>{{ subdata[index].HashRateFloat }}</p>
              <p>MH/s</p>
            </text>
          </view>
          <view>
            <p class="subTitle">{{$t('Equipment.Menu.equipSubAccount.24h-hashrate')}}</p>
            <text
              >{{ subdata[index].HashRate24Int }}.
              <p>{{ subdata[index].HashRate24Float }}</p>
              <p>MH/s</p>
            </text>
          </view>
        </view>
      </view>

      <view class="state">
        <view>
          <image src="@/static/images/equipment/online.png"></image>
          <text>{{$t('Equipment.Menu.equipSubAccount.online-devices')}}</text><text>{{ subdata[index].subOnline }}</text>
        </view>
        <view>
          <image src="@/static/images/equipment/offline.png"></image>
          <text>{{$t('Equipment.Menu.equipSubAccount.offline-devices')}}</text><text>{{ subdata[index].subOffline }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import * as echarts from "echarts";
export default {
  props: {
    url: {
      type: String,
    },
    subdata: {
      type: Array,
    },
    productData: {
      type: Array,
    },
	refreshFlag:0
  },
  data() {
    return {
      userToken: "",
      // 设备在线、离线信息【按子产品分】
      equipmentData: []
    };
  },
  onShow() {
    this.$nextTick(() => {
      // 渲染圆环echarts
      this.renderCircleEcharts();
    });
  },
  mounted() {
      this.$nextTick(() => {
        this.renderCircleEcharts();
      });
    },
  watch: {
  	refreshFlag() {
		this.renderCircleEcharts();
  	}
  },
  methods: {
    //跳转到子账户详情页
    onSubAccountClick(index) {
      uni.navigateTo({
        url: this.url+`?subAccountId=${this.productData[index].SubaccountId}`+`&subAccountName=${this.productData[index].SubaccountName}`,
        success(res) {
        },
        fail(res) {
        },
      });
    },
	createOption(index){
		return {
		  color: [
		    {
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
		          color: "#009BF9", // 100% 处的颜色
		        },
		      ],
		      global: false, // 缺省为 false
		    },
		    "#f2f2f2",
		  ],
		  tooltip: {
		    show: false,
		  },
		  title: [
		    {
		      text: `{val|${this.subdata[index].subTotal}}\n{name|${this.$t('Equipment.Menu.equipSubAccount.devices-nums')}}`,
		      top: "center",
		      left: "center",
		      textStyle: {
		        rich: {
		          name: {
		            fontSize: 13,
		            color: "#888DA7",
		            padding: [4, 0],
		            fontFamily: "PingFangSC-Regular, PingFang SC",
		            fontWeight: 400,
		          },
		          val: {
		            fontSize: 41,
		            fontWeight: "bold",
		            color: "#2E334E",
		            fontFamily: "AlibabaPuHuiTiB",
		          },
		        },
		      },
		    },
		  ],
		  // animation:true,
		  // animationEasing:'liner',
		  // animationEasingUpdate:'liner',
		  series: [
		    {
		      type: "pie",
		      clockwise: false, //顺时加载
		      silent: "true", //图形是否不响应和触发鼠标事件
		      // animation:false,
		      force: {
		        layoutAnimation: false,
		      },
		      radius: ["72%", "80%"],
		      startAngle: 0,
		      avoidLabelOverlap: false,
		      itemStyle: {
		        borderRadius: 4,
		        borderColor: {
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
		              color: "#009BF9", // 100% 处的颜色
		            },
		          ],
		          global: false, // 缺省为 false
		        },
		        borderWidth: 8,
		      },
		      label: {
		        show: false,
		      },
		      labelLine: {
		        show: false,
		      }
		    },
		  ],
		};
	},
    // 加载圆环echarts
    renderCircleEcharts() {
      // 因为此时在v-for里面,所以ref变成数组了,需要拿到下标!!!
      this.productData.forEach((item, index) => {
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
            color: "#E9E9E9",
            borderColor: "#E9E9E9",
            borderWidth: 1,
          }
        }
        
        // 把 echarts 传入
        this.$refs.chart[index].init(echarts, (chart) => {
		  const option = this.createOption(index)
		  
		  if(this.subdata[index].subOnline ==0 && this.subdata[index].subOffline ==0) {
			 option.series[0].data=[
				 { value: 0, itemStyle: placeHolderStyle }
			 ];
		  } else if(this.subdata[index].subOnline ==0){
			  option.series[0].data=[
			        { value: this.subdata[index].subOffline, itemStyle: placeHolderStyle }
			      ];
		  } else if(this.subdata[index].subOffline ==0) {
			  option.series[0].data=[
			        this.subdata[index].subOnline
			      ];
		  } else {
			  option.series[0].data=[
			        { value: this.subdata[index].subOffline, itemStyle: placeHolderStyle },
			        this.subdata[index].subOnline
			      ];
		  }
          chart.setOption(option);
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  margin: 20rpx 24rpx;
  background-color: #ffffff;
  border-radius: 20rpx;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32rpx 32rpx 24rpx;
    // border-bottom: 1px solid #f2f2f2;
	view{
		display: flex;
		align-items: center;
		text {
			// display: block;
			// align-items: center;
		  font-size: 34rpx;
		  font-family: PingFangSC-Medium, PingFang SC;
		  font-weight: 500;
		  color: #2E334E;
		}
		  image {
			  // padding-top: 10rpx;
			margin-right: 10rpx;
			width: 32rpx;
			height: 32rpx;
		  }
	}
	
    p {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #888DA7;
    }
  }

  .echartsContent {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    .titleBlock {
      position: absolute;
      left: 156rpx;
      bottom: 140rpx;
      display: flex;
      flex-direction: column-reverse;
      align-items: center;
      .echartsTitle {
        font-size: 26rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #888da7;
      }
      .echartsTitleNum {
        font-size: 82rpx;
        font-weight: 700;
        font-family: AlibabaPuHuiTiB;
        color: #2e334e;
      }
    }
    .hashRateContent {
      view {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-left: 26rpx;
        // margin-bottom: 30rpx;
		// 00和MH/s
        p {
          font-size: 30rpx;
          color: #2e334e;
        }
        // 小标题
		.subTitle{
			// white-space: normal;
			font-size: 30rpx;
			color: #888DA7;
		}
      }
      view:first-child {
        margin-bottom: 30rpx;
      }
      // 大数字
      view > text:first-of-type {
        font-size: 50rpx;
        font-weight: 700;
        // 00
        p:first-child {
          display: inline-block;
          font-size: 20rpx;
          font-weight: 700;
          margin-left: 0rpx;
        }
        // MH/s
        p {
          display: inline-block;
          font-size: 30rpx;
          font-weight: 400;
          margin-left: 20rpx;
        }
      }
    }
  }

  .state {
    display: flex;
    justify-content: space-around;
    view {
      margin-bottom: 40rpx;
      image {
		  padding: 0 14rpx 8rpx 20rpx;
        // padding-bottom: 8rpx;
        // padding-right: 10rpx;
        width: 9rpx;
        height: 9rpx;
      }
	  text{
		  vertical-align: middle;
	  }
	  // 在线设备/离线设备
	  text:first-of-type{
		  font-size: 26rpx;
		  font-family: PingFangSC-Regular, PingFang SC;
		  font-weight: 400;
		  color: #888DA7;
	  }
	  // num
      text:last-child{
        margin-left: 14rpx;
        font-size: 54rpx;
		font-family: AlibabaPuHuiTiB;
      }
    }
    view:first-child {
      text:last-child {
        color: #64CD83;
      }
    }
    view:last-child {
      text:last-child {
		
		color: #FF2F28;
      }
    }
  }
}
</style>
