<template>
	<view class="content">
		<view class="text-area">
			<view class="select-country-code" @click="gotoPickcode">
				<view class="select-country-zone">+</view>
				<input type="text" class="select-country-input" name="zone" :value="this.zone" style="color:#B4BDD9;" readonly/>
				<image class="select-country-img" mode="" src="../../static/pull-down-btn@2x.png"></image>
			</view>
				<input class="uni-input" name="tel" placeholder="请输入手机" placeholder-style="color:#B4BDD9"/>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//国际区号
				zone: '86',
			}
		},
		onLoad() {

		},
		methods: {
			gotoPickcode() {
				uni.navigateTo({
					url:'./country-code'
				})
			},
			upDataCountryCode: function(msg) {
				if(msg) {
					this.zone = msg;
				}
				this.$forceUpdate();
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 40upx;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content:  left;
		border-bottom: 2upx solid #C8C7CC;
		width: 100%;
		line-height: 100upx;
	}

	.uni-input{
		padding: 0;
		background-color: #FFFFFF;
		color: #333333;
		float: left;
		height: 100upx;
	}
	
	.select-country-input {
		width: 84upx;
		height: 100upx;
		float: left;
		z-index: 1;
		background-color: transparent;
		text-align: center;
	}
	
	.select-country-zone {
		display: inline-block;
		float: left;
		color: #B4BDD9;
	}
	
	.select-country-code {
		width: 140upx;
		height: 100upx;
		line-height: 100upx;
		z-index: 1;
	}
	
	image {
		width: 20upx;
		height: 20upx;
		display: inline-block;
		float: left;
		margin-top: 42upx;
	}
</style>
