<template>
	<view class="content">
		
		<view class="status_bar"></view>
		
		<!-- 顶部导航栏 -->
		<view class="header-fixed">
		<uni-nav-bar height="118rpx" backgroundColor="#ffffff" left-icon="left" @clickLeft="back">
			<view class="header-title">
				<span>提现管理</span>
			</view>
		</uni-nav-bar>
		</view>
		
		<view class="all">
			
		<view class="block">
			<view class="left">
				<span>提现状态</span>
			</view>
			<view class="right" :class="{errorcolor: error,detailcolor: detail,successcolor: success}">
				<span class="keep-right" >{{status}}</span>
			</view>
		</view>
		<view class="block">
			<view class="left">
				<span>类别</span>
			</view>
			<view class="right">
				<span class="keep-right">{{type}}</span>
			</view>
		</view>
		<view class="block">
			<view class="left">
				<span>提现时间</span>
			</view>
			<view class="right">
				<span class="keep-right">{{time}}</span>
			</view>
		</view>
		<view class="block">
			<view class="left">
				<span>提现金额</span>
			</view>
			<view class="right">
				<span class="keep-right">{{money}}{{pro}}</span>
			</view>
		</view>
		<view class="block">
			<view class="left">
				<span>提现地址</span>
			</view>
			<view class="right">
				<span class="keep-right">{{address}}</span>
			</view>
		</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				status: '',
				type: '',
				time: '',
				money: '',
				pro: '',
				address: '',
				infomation: {},
				error: false,
				success: false,
				detail: false,
			}
		},
		onLoad(option) {
			this.infomation = JSON.parse(option.info);
			this.status = this.infomation.businessType == 4 || this.infomation.businessType == 7?'系统处理中':
			(this.infomation.businessType == 3 || this.infomation.businessType == 6?'提现失败':'提现成功');
			this.type = this.infomation.businessType == 6 || this.infomation.businessType == 7 || this.infomation.businessType == 8 
			?'自动提现':'手动提现';
			this.time = (this.infomation.tradeTime.substring(0,16).replace('T',' ').replace('-','.').replace('-','.'));
			this.money = this.infomation.changeAmount;
			this.pro = this.infomation.currencyCategory;
			this.address = this.infomation.address;
			if(this.status == '系统处理中'){
				this.detail = true;
			}
			if(this.status == '提现失败'){
				this.error = true;
			}
			if(this.status == '提现成功'){
				this.success = true;
			}
		},
		methods: {
			back(){
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style>
	.status_bar{
			height: var(--status-bar-height);
			width: 100%;
			background-color: #ffffff;
			position: fixed;
		}
		.header-fixed{
			width: 100%;
			position: fixed;
			top: var(--status-bar-height);
			z-index: 100;
		}
		.header-title{
			width: 100%;
			display: flex;
			align-self: center;
			justify-content: center;
		}
		.header-title > span{
			width: 204rpx;
			  height: 48rpx;
			  color: rgba(46, 51, 78, 1);
			  font-size: 34rpx;
			  font-family: PingFangSC-Medium;
			  text-align: center;
			  white-space: nowrap;
			  line-height: 48rpx;
		}
		.all{
			position: relative;
			top: calc(var(--status-bar-height) + 118rpx);
		}
	page{
		background-color: rgba(243, 245, 247, 1);
	}
	.block{
		width: 100%;
		height: 100rpx;
		background-color: #ffffff;
		border-top: 1px solid rgba(243, 245, 247, 1);
		padding: 0 40rpx;
		box-sizing: border-box;
		display: flex;
	}
	.left{
		flex: 1;
		display: flex;
		align-items: center;
	}
	.right{
		flex: 2;
		display: flex;
		align-items: center;
	}
	.keep-right{
		margin-left: auto;
	}
	.errorcolor{
		color: rgba(255, 0, 0, 1);
	}
	.successcolor{
		color: #52C41A;
	}
	.detailcolor{
		color: rgba(250, 143, 1, 1);
	}
</style>