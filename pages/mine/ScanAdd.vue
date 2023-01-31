<template>
	<view class="content">
		<view class="status_bar">
			<!-- 这里是占位状态栏 -->
		</view>
		<view class="text-area">
			<button type="small" @click="onScan">点击扫码</button>
			<view class="">
				<view class="title">扫码回调参数：{{value}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				textscan: '扫码',
				typescan: 'scan-listener',
				value:''
			}
		},
		onReady() {
			uni.$on(this.typescan,(data)=>{
				this.value=data.result
			})
		},
		methods: {
			onScan(){
				uni.navigateTo({
					url: '/pages/mine/plusScan/index?text=' + this.textscan + '&type=' + this.typescan,
				});
			}
		}
	}
</script>

<style scoped>
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}
.content{
	width: 100%;
	display: flex;
	flex-direction: column;
	place-content: center;
}
button{
	background-color: #DD524D;
	color: #FFFFFF;
}
</style>
