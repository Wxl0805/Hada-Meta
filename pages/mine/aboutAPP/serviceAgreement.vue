<template>
	<view class="content">
		<view v-html="doc"></view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				doc: '',
			}
		},
		onReady() {
			if(uni.getStorageSync('lang')){
				if(uni.getStorageSync('lang') == 'zh-Hant'){
				 this.callinterface('FWXY_zh_HK')
				 return;
				}else{
				 this.callinterface('FWXY_zh_CN')
				 return;
				} 
			}
			if(uni.getSystemInfoSync().language == 'zh-TW'){
				this.callinterface('FWXY_zh_HK')
				return;
			}
			if(uni.getSystemInfoSync().language == 'zh-CN'){
				this.callinterface('FWXY_zh_CN')
				return;
			}
			this.callinterface('FWXY_zh_HK')
		},
		methods: {
			callinterface(value){
				uni.showLoading({
					mask:true,
					title: this.$t('common.wait')
				})
				uni.request({
					url: this.host + '/base1/get_agreement?title='+value,
					header: {'Content-Type': 'application/json'},
					method:"GET",
					data:'',
					dataType: 'json',
					success: (res) => {
						this.doc = res.data.data;
					},
					complete: () => {
						uni.hideLoading();
					}
				})
			}
		}
	}
</script>

<style>
	.content{
		width: 100%;
		height: 100%;
		padding: 0 20rpx 120rpx 20rpx;
		box-sizing: border-box;
		border-top: 1px solid #efece8;
		font-size: 30rpx;
	}
</style>