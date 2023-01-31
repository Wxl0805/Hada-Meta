<template>
	<view class="">
		<view class="status_bar">
		  <!-- 这里是占位状态栏 -->
		</view>
		
		<!-- 顶部导航栏 -->
		<view class="header-fixed">
		  <uni-nav-bar height="88rpx" backgroundColor="#ffffff">
		    <view class="header-title">
		      <span>{{ $t('common.output') }} - {{ headTime }}</span>
		    </view>
		    <view slot="left">
		      <!-- <view class="left" @click="back">
		        <span>{{ $t("common.quxiao") }}</span>
		      </view> -->
			  <i class="uni-btn-icon" style="color: rgb(0, 0, 0); font-size: 27px;" @click="back"></i>
		    </view>
		  </uni-nav-bar>
		</view>
		<!-- 产出总计 -->
		<view class="block block-first">
			<view class="block-left">
				<span>{{ $t('common.Settlement-total-points') }}</span>
			</view>
			<view class="block-right">
				<span>{{ totalPoints }}&nbsp;Aleo</span>
			</view>
		</view>
		<!-- 当日产出 -->
		<view class="block block-title">
			<view class="block-left left-title">
				<span>{{ $t('common.same-day-settlement') }}</span>
			</view>
		</view>
		<view class="block">
			<view class="block-left">
				<span>{{ $t('common.Settlement-Shares') }}</span>
			</view>
			<view class="block-right">
				<span>{{ SettlementSharesNow }}&nbsp;G</span>
			</view>
		</view>
		<view class="block">
			<view class="block-left" style="flex: 2;">
				<span>{{ $t('common.Points-per-share') }}({{ $t('common.has-been-deducted') }}{{ serviceFee }}%)</span>
			</view>
			<view class="block-right">
				<span>{{ perShareNow }}&nbsp;Aleo</span>
			</view>
		</view>
		<view class="block">
			<view class="block-left">
				<span>{{ $t('common.output-guding') }}</span>
			</view>
			<view class="block-right">
				<span>{{ fixedOutputNow }}&nbsp;Aleo</span>
			</view>
		</view>
		<view class="block">
			<view class="block-left">
				<span>{{ $t('common.output-ewai') }}</span>
			</view>
			<view class="block-right">
				<span>{{ extraOutputNow }}&nbsp;Aleo</span>
			</view>
		</view>
		<!-- 往期结算 -->
		<!-- <view class="block block-title">
			<view class="block-left left-title">
				<span>{{ $t('common.settlement-in-the-past') }}</span>
			</view>
		</view>
		<view class="block">
			<view class="block-left">
				<span>{{ $t('common.Settlement-Shares') }}</span>
			</view>
			<view class="block-right">
				<span>{{ SettlementSharesLast }}&nbsp;G</span>
			</view>
		</view>
		<view class="block">
			<view class="block-left">
				<span>{{ $t('common.output-guding') }}</span>
			</view>
			<view class="block-right">
				<span @click="toPastDetails">{{ fixedOutputLast }}&nbsp;Aleo</span>
				<view class="right-icon" @click="toPastDetails"></view>
			</view>
		</view>
		<view class="block">
			<view class="block-left">
				<span>{{ $t('common.output-ewai') }}</span>
			</view>
			<view class="block-right">
				<span>{{ extraOutputLast }}&nbsp;Aleo</span>
			</view>
		</view> -->
	</view>
</template>

<script>
	// #ifdef APP-PLUS
	import APPUpdate from "@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate";
	// #endif
	export default {
		data(){
			return {
				headTime: '',
				totalPoints: 1000,
				SettlementSharesNow: 100,
				serviceFee: '8',
				perShareNow: 1,
				fixedOutputNow: 100,
				extraOutputNow: 100,
				SettlementSharesLast: 10,
				fixedOutputLast: 100,
				extraOutputLast: 100,
				// 记录触发了几次需要更新APP
				appUpdate: 0,
				// 用于接口的时间
				useTime: ''
			}
		},
		onLoad(options) {
			if(options){
				console.log(options);
				this.headTime = options.outputTime.replace('-','.').replace('-','.');
				this.useTime = options.outputTime;
				this.getDetail();
			}
			// data.time = _this.dateChangeFormat("YYYY-mm-dd HH:MM:SS", data.time);
		},
		methods:{
			back(){
				uni.navigateBack({
					delta: 1
				})
			},
			// 跳转到往期结算详情
			toPastDetails(){
				uni.navigateTo({
					url: '/pages/income/AleoIncome/pastDetails?settlementDate='+this.useTime,
				})
			},
			// 获取结算信息
			getDetail(){
				uni.request({
				  url: this.host + "/app/integralDetail?settlementDate="+this.useTime,
				  method: "GET",
				  header: {
				    //token
				    "x-token": uni.getStorageSync('token'),
				    //version
				    version: this.version,
				  },
				  success: (res) => {
					  console.log(res);
					  console.log(this.useTime);
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
				    if (res.data.code == 0) {
				      this.totalPoints = Number(res.data.data.totalIntegral);
					  this.SettlementSharesNow = Number(res.data.data.dailySettlementShares);
					  this.serviceFee = res.data.data.serviceRate;
					  this.perShareNow = Number(res.data.data.perCustomerIntegral);
					  this.fixedOutputNow = Number(res.data.data.dailyCustomerIntegral);
					  this.extraOutputNow = Number(res.data.data.dailyTotalLeaderIntegral);
					  // this.SettlementSharesLast = Number(res.data.data.preSettlementShares);
					  // this.fixedOutputLast = Number(res.data.data.preCustomerIntegral);
					  // this.extraOutputLast = Number(res.data.data.preTotalLeaderIntegral);
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
		},
	}
</script>

<style lang="scss">
	page{
		background: rgba(243, 245, 247, 1);
		overflow: hidden;
	}
	.status_bar {
	  height: var(--status-bar-height);
	  width: 100%;
	  background: #ffffff;
	  position: fixed;
	  top: 0;
	  z-index: 11;
	}
	.header-fixed{
		width: 100%;
		position: fixed;
		top: var(--status-bar-height);
		z-index: 100;
	}
	.header-title {
	  width: 100%;
	  display: flex;
	  align-self: center;
	  justify-content: center;
	}
	.header-title > span {
	  /* width: 204rpx; */
	  height: 48rpx;
	  color: rgb(0, 0, 0);
	  font-size: 32rpx;
	  font-family: PingFangSC-Medium;
	  text-align: center;
	  white-space: nowrap;
	  line-height: 48rpx;
	}
	[class^=uni-btn-icon] {
	    display: inline-block;
	    font: normal normal normal 14px/1 unibtn;
	    font-size: inherit;
	    text-rendering: auto;
	    -webkit-font-smoothing: antialiased;
	}
	.block{
		width: 100%;
		height: 100rpx;
		background: #ffffff;
		border-bottom: 0.5px solid rgba(236, 238, 240, 1);
		display: flex;
		padding: 0 40rpx;
		box-sizing: border-box;
	}
	.block-first{
		margin-top: calc(var(--status-bar-height) + 88rpx);
		// margin-top: 88rpx;
	}
	.block-left{
		display: flex;
		flex: 1;
		justify-content: flex-start;
		align-items: center;
		font-size: 30rpx;
		color: rgba(136, 141, 167, 1);
	}
	.block-right{
		display: flex;
		flex: 1;
		justify-content: flex-end;
		align-items: center;
		font-size: 28rpx;
		color: rgba(46, 51, 78, 1);
	}
	.block-title{
		margin-top: 20rpx;
	}
	.left-title{
		font-size: 30rpx;
		color: rgba(46, 51, 78, 1);
	}
	.right-icon{
		width: 20rpx;
		height: 20rpx;
		background: url('@/static/images/income/Aleo/rightIn.png') no-repeat;
		background-size: 100% 100%;
		margin-left: 10rpx;
	}
	/deep/ .uni-navbar--border{
		border-bottom-color:rgba(236, 236, 236, 1) !important;
	}
	/deep/ .uni-navbar__header{
		padding: 0 5px;
	}
</style>