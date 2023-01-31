<template>
	<view class="content">
		<view class="box1">
			<text class="title">
				{{$t('ETH.IncomeInfo.SubAccountIncome.SubIncomeTotal.financial-yesterday')}}({{incomeUnit}})
				<view :class="incomeInfo.YesyesterdayIncomePercent>=0 ? 'red':'blue' " v-if="incomeInfo.YesyesterdayIncomePercent!==0">
					<text v-if="incomeInfo.YesyesterdayIncomePercent>=0">+</text>
					<text v-if="incomeInfo.YesyesterdayIncomePercent<0">-</text>
					<text>{{incomeInfo.YesyesterdayIncomePercent}}%</text>
				</view>
			</text>
			<view>
				{{incomeInfo.yesterdayIncome}}
			</view>
		</view>
		<view class="line"></view>
		<view class="box2">
			<text class="title">{{$t('ETH.IncomeInfo.SubAccountIncome.financial-today')}}({{incomeUnit}})</text>
			<view>
				{{incomeInfo.todayForecast}}
			</view>
		</view>
		<view class="box3">
			<text class="title">{{$t('ETH.IncomeInfo.SubAccountIncome.SubIncomeTotal.financial-total')}}({{incomeUnit}})</text>
			<view>
				{{incomeInfo.totalIncome}}
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		name:'incomeTotal',
		props:{
			incomeInfo:{
				type:Object,
			},
			incomeUnit:{
				type:String,
			}
		}
	}
</script>

<style lang="less">
	// @import "@/static/css/incomeTotal-homepage.less";
	.content {
		position: relative;
	  background-image: url("@/static/images/income/smallbg.png");
	  background-repeat: no-repeat;
	  background-size: cover;
	  width: 702rpx;
	  height: 333rpx;
	  display: grid;
	  grid-template-rows: 3fr 1fr;
	  grid-template-columns: 50% 50%;
	  grid-row-gap: 2rpx;
	  .box1,
	  .box2,
	  .box3 {
	    color: #ffffff;
	    padding-top: 30rpx;
	    padding-bottom: 30rpx;
	    // 标题
	    .title {
	      font-size: 28rpx;
	      font-family: PingFangSC-Regular, PingFang SC;
	      font-weight: 400;
	      color: #6D899D;
	    }
	    view {
	      display: flex;
	    }
	  }
	  .box1 {
	    grid-row-start: 1;
	    grid-row-end: 1;
	    grid-column-start: 1;
	    grid-column-end: 3;
	    padding-left: 40rpx;
		text{
			display: inline-flex;
			align-items: center;
			// 百分比收益
			view{
				margin-left: 48rpx;
				display: inline-block;
				font-size: 26rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
			}
			.red{
				color: #E52D18;
			}
			.blue{
				color: #447CB7;
			}
		}
	    // 数字
	    view {
	      display: flex;
	      align-items: baseline;
	      font-size: 54rpx;
	      font-family: AlibabaPuHuiTiM;
	      color: #2B5F99;
	      // 单位
	      p {
	        margin-left: 20rpx;
	        font-size: 28rpx;
	        font-weight: 700;
	      }
	    }
	  }
		
		.line{
			position: absolute;
			top: 200rpx;
			width: 643rpx;
			height: 1rpx;
			opacity: 0.25;
			background-color: #73A8DF;
			margin-left: 34rpx;
		}
		
	  .box2,
	  .box3 {
	    grid-row-start: 2;
	    grid-row-end: 2;
	    display: flex;
	    flex-direction: column;
	    justify-content: center;
	    align-items: flex-start;
	    padding-left: 40rpx;
	    // 数字
	    view {
	      display: flex;
	      align-items: baseline;
	
	      font-size: 38rpx;
	      font-family: AlibabaPuHuiTiM;
	      color: #2B5F99;
	      // 单位
	      p {
	        margin-top: 10rpx;
	        font-family: PingFangSC-Medium, PingFang SC;
	        margin-left: 20rpx;
	        font-size: 28rpx;
	        font-weight: 500;
	      }
	    }
	  }
	  .box2 {
	    grid-column-start: 1;
	    grid-column-end: 2;
	  }
	  .box3 {
	    grid-column-start: 2;
	    grid-column-end: 3;
	  }
	}
</style>